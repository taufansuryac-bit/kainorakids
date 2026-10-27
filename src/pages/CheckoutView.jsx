import { SEO } from '../constants/data';
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { auth, db, WA_NUMBER, appId } from '../firebase';
import { ChevronRight, Send, Loader2, Tag, CheckCircle, Sparkles, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { AccountEmpty } from '../components/account/AccountUI';
import { collection, query, where, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { formatPrice } from '../constants/data';
import { cloudAIService } from '../services/cloudAIService';
import { buildOrderRequest, promoProblem } from '../services/buyerCommerce';
import { analyticsItem, track } from '../utils/analytics';

export const CheckoutView = () => {
  const { cart, setCart, setView, user, setIsAuthModalOpen, basketReady } = useStore();
  const cartTotal = cart.reduce((s, item) => s + (item.price * item.qty), 0);
  const isPreviewOrder = cart.some(item => item.catalogPreview === true);
  
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    wa: user?.phone || '', 
    address: user?.address || '', 
    kodepos: user?.kodepos || '',
    notes: '' 
  });
  const [isSaving, setIsSaving] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMsg, setPromoMsg] = useState({ text: '', type: '' });
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  // Set when the order is saved but the browser refused the WhatsApp tab.
  const [pendingWaUrl, setPendingWaUrl] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps -- once per checkout visit
  useEffect(() => { if (cart.length) track('begin_checkout', { currency: 'IDR', value: cartTotal, items: cart.map(item => analyticsItem(item, item.size, item.qty)) }); }, []);

  useEffect(() => {
    if(user) setForm(prev => ({ ...prev, name: user.name || prev.name, wa: user.phone || prev.wa, address: user.address || prev.address, kodepos: user.kodepos || prev.kodepos }));
  }, [user]);

  // Inline field instead of window.prompt/alert, which are inaccessible and blocked in some in-app browsers.
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftContext, setGiftContext] = useState('');
  const [giftError, setGiftError] = useState('');
  const handleGenerateGiftMessage = async () => {
    const context = giftContext.trim();
    if (!context) { setGiftError('Tuliskan untuk siapa dan acara apa kado ini.'); return; }
    setGiftError('');
    setIsGeneratingMessage(true);
    try {
      const prompt = `Anda adalah asisten Kainora Kids. Tolong buatkan 1-2 kalimat pendek ucapan selamat yang manis dan lucu untuk disertakan di kartu ucapan fisik kado baju anak.
Konteks dari pembeli: "${context}"
Kembalikan HANYA teks ucapannya saja, tanpa tanda kutip.`;

      const text = await cloudAIService.chat([
        { role: 'system', content: 'Anda adalah asisten yang membuat ucapan kado pendek dan manis.' },
        { role: 'user', content: prompt }
      ], { temperature: 0.7, maxTokens: 80, stream: false });

      setForm(prev => ({ ...prev, notes: (prev.notes ? prev.notes + '\n\n' : '') + 'Ucapan Kado:\n' + text.trim() }));
      setGiftOpen(false); setGiftContext('');
    } catch (err) {
      console.error(err);
      setGiftError('Maaf, AI gagal membuat ucapan. Silakan tulis manual di kolom catatan.');
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  const discountAmount = appliedPromo ? (appliedPromo.type === 'percent' ? (cartTotal * appliedPromo.value / 100) : appliedPromo.value) : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const handleApplyPromo = async () => {
    if(!promoCodeInput.trim()) return;
    setIsCheckingPromo(true);
    setPromoMsg({ text: '', type: '' });
    try {
      const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'promos'), where('code', '==', promoCodeInput.toUpperCase()));
      const snap = await getDocs(q);
      if(snap.empty) {
        setPromoMsg({ text: 'Kode promo tidak ditemukan atau sudah tidak berlaku.', type: 'error' });
        setAppliedPromo(null);
      } else {
        const promo = snap.docs[0].data();
        const problem = promoProblem(promo, cartTotal);
        setAppliedPromo(problem ? null : promo);
        setPromoMsg(problem ? { text: problem, type: 'error' } : { text: 'Kode promo berhasil digunakan!', type: 'success' });
      }
    } catch {
      setPromoMsg({ text: 'Gagal mengecek promo.', type: 'error' });
    }
    setIsCheckingPromo(false);
  };

  const finishOrder = () => { setPendingWaUrl(''); setCart([]); setView('orders'); };

  const handleWA = async (e) => {
    e.preventDefault();
    if (isPreviewOrder || !cart.length) return;
    if (!auth.currentUser?.email || !user?.uid) { setIsAuthModalOpen(true); return; }
    if (!basketReady) { setCheckoutError('Keranjang akun sedang disiapkan. Tunggu sebentar lalu coba lagi.'); return; }
    setCheckoutError('');
    // Open the tab while the click still counts as a user gesture; after the
    // Firestore await, Safari and Firefox treat window.open as a blocked pop-up.
    const waWindow = window.open('', '_blank');
    if (waWindow) waWindow.opener = null;
    setIsSaving(true);
    let order;
    
    try {
      order = buildOrderRequest({cart, user: {...user, uid: auth.currentUser.uid, email: auth.currentUser.email}, form, promo: appliedPromo});
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), {...order, createdAt: serverTimestamp()});
    } catch {
      waWindow?.close();
      setCheckoutError('Pesanan belum tersimpan. Periksa koneksi lalu coba lagi. Keranjang Anda tetap tersimpan.');
      setIsSaving(false);
      return;
    }
    const orderId = order.orderId;

    let msg = `Halo Admin Kainora Kids! 💖
Saya mau order baju anak yang super lucu ini. Berikut rinciannya:

*ID Pesanan:* ${orderId}

🛒 *Daftar Produk:*
`;
    cart.forEach((it, i) => msg += `${i+1}. *${it.name}*
   Size: ${it.size} | Qty: ${it.qty} | ${formatPrice(it.price * it.qty)}
`);
    
    msg += `
💳 *Ringkasan Pembayaran:*
`;
    msg += `- Subtotal: ${formatPrice(cartTotal)}
`;
    if(appliedPromo) msg += `- Diskon Promo (${appliedPromo.code}): -${formatPrice(discountAmount)}
`;
    msg += `*Total Belanja: ${formatPrice(finalTotal)}* (Belum termasuk Ongkir)

`;
    
    msg += `📦 *Data Pengiriman:*
👤 Nama: ${form.name}
📞 WhatsApp: ${form.wa}
🏠 Alamat: ${form.address}
📮 Kode Pos: ${form.kodepos}
`;
    if(form.notes) msg += `📝 Catatan: ${form.notes}
`;
    msg += `
Mohon dihitungkan total dengan ongkos kirimnya ya kak. Terima kasih! ✨`;
    
    setIsSaving(false);
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    track('whatsapp_order_sent', { transaction_id: orderId, currency: 'IDR', value: finalTotal, ...(appliedPromo?.code ? { coupon: appliedPromo.code } : {}), whatsapp_opened: Boolean(waWindow && !waWindow.closed), items: cart.map(item => analyticsItem(item, item.size, item.qty)) });
    // The cart is cleared only once WhatsApp has actually opened; otherwise the
    // buyer gets a link to send the saved order manually.
    if (waWindow && !waWindow.closed) { waWindow.location.href = waUrl; finishOrder(); }
    else setPendingWaUrl(waUrl);
  };

  if (!cart.length && !pendingWaUrl) return (
    <main className="ka-page ka-checkout">
      <SEO title="Checkout Pakaian Anak | Kainora Kids" description="Selesaikan pesanan baju anak Anda melalui WhatsApp Admin yang responsif." canonicalPath="/?view=checkout" robots="noindex, follow" />
      <AccountEmpty icon={ShoppingBag} title="Belum ada yang perlu dipesan." description="Keranjang Anda kosong. Pilih motif dan ukuran dulu, lalu kembali ke sini untuk memesan." action="Jelajahi koleksi" onAction={() => setView('products')} secondary="Lihat keranjang" onSecondary={() => setView('cart')} />
    </main>
  );

  return (
    <main className="min-h-screen py-24 px-4 max-w-7xl mx-auto">
      <SEO title="Checkout Pakaian Anak | Kainora Kids" description="Selesaikan pesanan baju anak Anda melalui WhatsApp Admin yang responsif." canonicalPath="/?view=checkout" robots="noindex, follow" />
      <button onClick={() => setView('cart')} className="text-gray-900 font-black uppercase tracking-widest text-[10px] hover:text-brand-red mb-10 flex items-center gap-2 transition-colors"><ChevronRight size={16} className="transform rotate-180" strokeWidth={3}/> KEMBALI KE KERANJANG</button>
      <div className="border-b-4 border-gray-900 pb-6 mb-12"><h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-left">Pemesanan Pakaian</h1></div>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          {checkoutError && <p role="alert" className="border border-red-300 bg-red-50 p-4 text-sm text-red-700">{checkoutError}</p>}
          {pendingWaUrl && <div role="alert" className="mb-6 border-4 border-gray-900 bg-amber-50 p-6 text-left space-y-4"><p className="font-bold text-gray-900">Pesanan sudah tersimpan, tetapi browser menahan jendela WhatsApp. Tekan tombol di bawah untuk mengirim rincian pesanan ke admin Kainora.</p><a href={pendingWaUrl} target="_blank" rel="noopener noreferrer" onClick={finishOrder} className="inline-flex items-center gap-2 bg-amber-500 border-4 border-gray-900 px-6 py-4 font-black uppercase text-sm tracking-widest text-gray-900">Kirim pesanan via WhatsApp <ArrowUpRight size={18}/></a></div>}
          <form id="checkoutForm" onSubmit={handleWA} className="bg-white border-4 border-gray-900 p-8 md:p-12 shadow-solid text-left space-y-8">
            <div className="flex justify-between items-center mb-8 border-b-2 border-gray-900 pb-4"><h2 className="font-black text-xl text-gray-900 uppercase tracking-wider">Informasi Penerima</h2>{!user?.email && <button type="button" onClick={() => setIsAuthModalOpen(true)} className="text-[10px] font-black underline uppercase text-gray-500 hover:text-brand-red">Punya Akun? Masuk</button>}</div>
            <div><label htmlFor="checkout-name" className="block text-[10px] font-black uppercase mb-3 tracking-widest text-gray-500">Nama Lengkap Bunda *</label><input id="checkout-name" autoComplete="name" required className="w-full border-4 border-gray-900 p-5 font-bold outline-none focus:border-amber-500 transition-colors text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Cth: Bunda Kainora" /></div>
            <div><label htmlFor="checkout-wa" className="block text-[10px] font-black uppercase mb-3 tracking-widest text-gray-500">WhatsApp Aktif *</label><input id="checkout-wa" autoComplete="tel" inputMode="tel" required type="tel" className="w-full border-4 border-gray-900 p-5 font-bold outline-none focus:border-amber-500 transition-colors text-sm" value={form.wa} onChange={e => setForm({...form, wa: e.target.value})} placeholder="Cth: 081234567890" /></div>
            <div><label htmlFor="checkout-address" className="block text-[10px] font-black uppercase mb-3 tracking-widest text-gray-500">Alamat Lengkap (Kecamatan & Kota) *</label><textarea id="checkout-address" autoComplete="street-address" required className="w-full border-4 border-gray-900 p-5 font-bold outline-none h-32 focus:border-amber-500 transition-colors resize-none text-sm leading-relaxed" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Nama Jalan, RT/RW, No. Rumah, Kecamatan, Kota/Kabupaten" /></div>
            <div><label htmlFor="checkout-kodepos" className="block text-[10px] font-black uppercase mb-3 tracking-widest text-gray-500">Kode Pos *</label><input id="checkout-kodepos" autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} title="5 digit kode pos" required type="text" className="w-full border-4 border-gray-900 p-5 font-bold outline-none focus:border-amber-500 transition-colors text-sm" value={form.kodepos} onChange={e => setForm({...form, kodepos: e.target.value})} placeholder="Cth: 40123" /></div>
            <div>
               <div className="flex justify-between items-center mb-3">
                 <label htmlFor="checkout-notes" className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Catatan Baju / Ucapan Kado</label>
                 <button type="button" onClick={() => setGiftOpen(open => !open)} aria-expanded={giftOpen} aria-controls="checkout-gift" disabled={isGeneratingMessage} className="text-[10px] font-black uppercase flex items-center gap-1 text-brand-red hover:text-brand-red transition-colors bg-amber-50 px-2 py-1 border-2 border-amber-200">
                   {isGeneratingMessage ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Tulis Ucapan AI
                 </button>
               </div>
               {giftOpen && <div id="checkout-gift" className="mb-4 border-2 border-amber-200 bg-amber-50 p-4 space-y-3">
                 <label htmlFor="checkout-gift-context" className="block text-[10px] font-black uppercase tracking-widest text-gray-700">Kado untuk siapa dan acara apa?</label>
                 <div className="flex gap-2">
                   <input id="checkout-gift-context" type="text" maxLength={200} className="flex-1 border-2 border-gray-900 p-3 text-sm font-bold outline-none focus:border-amber-500" value={giftContext} onChange={e => setGiftContext(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleGenerateGiftMessage(); } }} placeholder="Cth: ulang tahun ke-3 keponakan, Sarah" aria-describedby={giftError ? 'checkout-gift-error' : undefined} />
                   <button type="button" onClick={handleGenerateGiftMessage} disabled={isGeneratingMessage} className="bg-gray-900 text-white font-black uppercase text-[10px] px-4">{isGeneratingMessage ? <Loader2 size={14} className="animate-spin" /> : 'Buat ucapan'}</button>
                 </div>
                 {giftError && <p id="checkout-gift-error" role="alert" className="text-xs font-bold text-red-700">{giftError}</p>}
               </div>}
               <textarea id="checkout-notes" className="w-full border-4 border-gray-900 p-5 font-bold outline-none h-28 focus:border-amber-500 transition-colors resize-none text-sm" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Cth: Tolong dibungkus kado" />
            </div>
            <button type="submit" disabled={isSaving || isPreviewOrder || !!pendingWaUrl} className="lg:hidden w-full bg-amber-500 text-gray-900 py-6 font-black uppercase text-base border-4 border-gray-900 shadow-solid hover:translate-y-1 transition-all tracking-widest mt-8 flex justify-center items-center gap-2">{isSaving ? <Loader2 size={18} className="animate-spin"/> : 'Pesan via WhatsApp'}</button>
          </form>
        </div>
        <aside className="lg:w-1/3">
          <div className="bg-white border-4 border-gray-900 p-8 shadow-solid sticky top-28">
            <h2 className="font-black text-xl text-gray-900 mb-6 border-b-4 border-gray-900 pb-4 uppercase tracking-wider">Order Bunda</h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 border-2 border-gray-200 bg-gray-50 p-3 text-center">{isPreviewOrder ? 'PRATINJAU CHECKOUT — Produk contoh tidak dapat dikirim sebagai pesanan. Harga dan stok perlu divalidasi.' : 'Produk akan terkirim ke WhatsApp Admin'}</p>
            <div className="space-y-6 mb-8 border-b-2 border-gray-100 pb-8 max-h-[40vh] overflow-y-auto custom-scrollbar pr-4 text-left">{cart.map(item => (<div key={item.cartId} className="flex gap-4 items-center"><img src={item.img || (item.images && item.images[0])} alt={item.alt} className="w-16 h-16 border-2 border-gray-900 object-cover bg-gray-100" /><div className="flex-1"><p className="font-bold text-gray-900 uppercase text-xs leading-snug line-clamp-2 mb-1">{item.name}</p><p className="text-gray-500 font-black text-[9px] uppercase tracking-widest">SZ: {item.size} | QTY: {item.qty}</p></div></div>))}</div>
            
            {/* Promo Code Section */}
            <div className="mb-8 border-b-2 border-gray-100 pb-8">
              <label htmlFor="checkout-promo" className="block text-[10px] font-black uppercase mb-3 tracking-widest text-gray-500 flex items-center gap-2"><Tag size={12}/> Punya Kode Promo?</label>
              <div className="flex gap-2">
                <input id="checkout-promo" type="text" className="flex-1 border-4 border-gray-900 p-3 font-bold outline-none focus:border-amber-500 uppercase text-xs" value={promoCodeInput} onChange={e => { setPromoCodeInput(e.target.value); if (appliedPromo) { setAppliedPromo(null); setPromoMsg({ text: '', type: '' }); } }} placeholder="MASUKKAN KODE" />
                <button type="button" onClick={handleApplyPromo} disabled={isCheckingPromo} className="bg-gray-900 text-white font-black uppercase text-[10px] px-4 hover:bg-amber-500 hover:text-gray-900 transition-colors">Terapkan</button>
              </div>
              {promoMsg.text && <p className={`mt-2 text-[10px] font-black uppercase tracking-widest ${promoMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{promoMsg.text}</p>}
            </div>

            <div className="flex justify-between items-end mb-2"><span className="font-black text-gray-500 text-xs uppercase tracking-widest">Subtotal</span><span className="font-bold text-gray-900">{formatPrice(cartTotal)}</span></div>
            {appliedPromo && <div className="flex justify-between items-end mb-2"><span className="font-black text-green-600 text-xs uppercase tracking-widest flex items-center gap-1"><CheckCircle size={12}/> Diskon</span><span className="font-bold text-green-600">-{formatPrice(discountAmount)}</span></div>}
            <div className="flex justify-between items-end mb-10 mt-4 border-t-2 border-gray-900 pt-4"><span className="font-black text-gray-900 text-sm uppercase tracking-widest">Total Belanja</span><span className="font-black text-2xl text-brand-red tracking-widest">{formatPrice(finalTotal)}</span></div>
            <button disabled={isSaving || isPreviewOrder || !!pendingWaUrl} onClick={() => document.getElementById('checkoutForm')?.requestSubmit()} className="hidden lg:flex w-full bg-amber-500 text-gray-900 font-black py-5 uppercase text-sm border-4 border-gray-900 shadow-solid hover:translate-y-1 transition-all tracking-widest items-center justify-center gap-3">{isSaving ? <Loader2 size={18} className="animate-spin"/> : <><Send size={18} strokeWidth={3}/> Kirim Pesanan WA</>}</button>
          </div>
        </aside>
      </div>
    </main>
  );
};

// --- 6.8 AFFILIATE VIEW (Halaman Program Affiliate) ---
