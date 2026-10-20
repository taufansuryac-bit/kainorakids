import { SEO } from '../constants/data';
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { auth, db, ADMIN_EMAIL, WA_NUMBER, appId } from '../firebase';
import { ShoppingCart, Heart, ChevronRight, X, Minus, Plus, Star, Send, Package, Pencil, Trash, User, Loader2, Tag, CheckCircle, Sparkles } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { formatPrice } from '../constants/data';
import { FadeIn, SizeGuideModal, ColorDropdown, ModernDropdown } from '../components/ui/Modals';
import { cloudAIService } from '../services/cloudAIService';

export const CheckoutView = () => {
  const { cart, setCart, setView, user, setIsAuthModalOpen } = useStore();
  const cartTotal = cart.reduce((s, item) => s + (item.price * item.qty), 0);
  
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    wa: user?.phone || '', 
    address: user?.address || '', 
    kodepos: user?.kodepos || '',
    notes: '' 
  });
  const [isSaving, setIsSaving] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMsg, setPromoMsg] = useState({ text: '', type: '' });
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  useEffect(() => {
    if(user) setForm(prev => ({ ...prev, name: user.name || prev.name, wa: user.phone || prev.wa, address: user.address || prev.address, kodepos: user.kodepos || prev.kodepos }));
  }, [user]);

  const handleGenerateGiftMessage = async () => {
    const context = window.prompt("Kado ini untuk siapa dan acara apa? (Misal: Kado ultah ke-3 untuk ponakan perempuan bernama Sarah)");
    if (!context) return;
    
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
    } catch (err) {
      console.error(err);
      alert("Maaf, AI gagal membuat pesan. Silakan tulis manual.");
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
        setAppliedPromo(promo);
        setPromoMsg({ text: 'Kode promo berhasil digunakan!', type: 'success' });
      }
    } catch(err) {
      setPromoMsg({ text: 'Gagal mengecek promo.', type: 'error' });
    }
    setIsCheckingPromo(false);
  };

  const handleWA = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), {
        orderId, userEmail: user?.email || 'Guest', customerName: form.name, whatsapp: form.wa, address: form.address, kodepos: form.kodepos, notes: form.notes, items: cart, 
        subTotal: cartTotal, discount: discountAmount, promoCode: appliedPromo ? appliedPromo.code : null, totalAmount: finalTotal, status: 'pending', createdAt: serverTimestamp()
      });
    } catch(err) { console.error("Gagal simpan db", err); }

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
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    
    // Clear cart and redirect to thank you page
    setCart([]);
    setView('thankyou');
  };

  return (
    <main className="min-h-screen py-24 px-4 max-w-7xl mx-auto">
      <SEO title="Checkout Pakaian Anak | Kainora Kids" description="Selesaikan pesanan baju anak Anda melalui WhatsApp Admin yang responsif." />
      <button onClick={() => setView('cart')} className="text-gray-900 font-black uppercase tracking-widest text-[10px] hover:text-brand-red mb-10 flex items-center gap-2 transition-colors"><ChevronRight size={16} className="transform rotate-180" strokeWidth={3}/> KEMBALI KE KERANJANG</button>
      <div className="border-b-4 border-gray-900 pb-6 mb-12"><h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-left">Pemesanan Pakaian</h1></div>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <form id="checkoutForm" onSubmit={handleWA} className="bg-white border-4 border-gray-900 p-8 md:p-12 shadow-solid text-left space-y-8">
            <div className="flex justify-between items-center mb-8 border-b-2 border-gray-900 pb-4"><h3 className="font-black text-xl text-gray-900 uppercase tracking-wider">Informasi Penerima</h3>{!user?.email && <button type="button" onClick={() => setIsAuthModalOpen(true)} className="text-[10px] font-black underline uppercase text-gray-500 hover:text-brand-red">Punya Akun? Masuk</button>}</div>
            <div><label className="block text-[10px] font-black uppercase mb-3 tracking-widest text-gray-500">Nama Lengkap Bunda *</label><input required className="w-full border-4 border-gray-900 p-5 font-bold outline-none focus:border-amber-500 transition-colors text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Cth: Bunda Kainora" /></div>
            <div><label className="block text-[10px] font-black uppercase mb-3 tracking-widest text-gray-500">WhatsApp Aktif *</label><input required type="tel" className="w-full border-4 border-gray-900 p-5 font-bold outline-none focus:border-amber-500 transition-colors text-sm" value={form.wa} onChange={e => setForm({...form, wa: e.target.value})} placeholder="Cth: 081234567890" /></div>
            <div><label className="block text-[10px] font-black uppercase mb-3 tracking-widest text-gray-500">Alamat Lengkap (Kecamatan & Kota) *</label><textarea required className="w-full border-4 border-gray-900 p-5 font-bold outline-none h-32 focus:border-amber-500 transition-colors resize-none text-sm leading-relaxed" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Nama Jalan, RT/RW, No. Rumah, Kecamatan, Kota/Kabupaten" /></div>
            <div><label className="block text-[10px] font-black uppercase mb-3 tracking-widest text-gray-500">Kode Pos *</label><input required type="number" className="w-full border-4 border-gray-900 p-5 font-bold outline-none focus:border-amber-500 transition-colors text-sm" value={form.kodepos} onChange={e => setForm({...form, kodepos: e.target.value})} placeholder="Cth: 40123" /></div>
            <div>
               <div className="flex justify-between items-center mb-3">
                 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Catatan Baju / Ucapan Kado</label>
                 <button type="button" onClick={handleGenerateGiftMessage} disabled={isGeneratingMessage} className="text-[10px] font-black uppercase flex items-center gap-1 text-brand-red hover:text-brand-red transition-colors bg-amber-50 px-2 py-1 border-2 border-amber-200">
                   {isGeneratingMessage ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Tulis Ucapan AI
                 </button>
               </div>
               <textarea className="w-full border-4 border-gray-900 p-5 font-bold outline-none h-28 focus:border-amber-500 transition-colors resize-none text-sm" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Cth: Tolong dibungkus kado" />
            </div>
            <button type="submit" disabled={isSaving} className="lg:hidden w-full bg-amber-500 text-gray-900 py-6 font-black uppercase text-base border-4 border-gray-900 shadow-solid hover:translate-y-1 transition-all tracking-widest mt-8 flex justify-center items-center gap-2">{isSaving ? <Loader2 size={18} className="animate-spin"/> : 'Pesan via WhatsApp'}</button>
          </form>
        </div>
        <aside className="lg:w-1/3">
          <div className="bg-white border-4 border-gray-900 p-8 shadow-solid sticky top-28">
            <h3 className="font-black text-xl text-gray-900 mb-6 border-b-4 border-gray-900 pb-4 uppercase tracking-wider">Order Bunda</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 border-2 border-gray-200 bg-gray-50 p-3 text-center">Produk akan terkirim ke WhatsApp Admin</p>
            <div className="space-y-6 mb-8 border-b-2 border-gray-100 pb-8 max-h-[40vh] overflow-y-auto custom-scrollbar pr-4 text-left">{cart.map(item => (<div key={item.cartId} className="flex gap-4 items-center"><img src={item.img || (item.images && item.images[0])} alt={item.alt} className="w-16 h-16 border-2 border-gray-900 object-cover bg-gray-100" /><div className="flex-1"><p className="font-bold text-gray-900 uppercase text-xs leading-snug line-clamp-2 mb-1">{item.name}</p><p className="text-gray-500 font-black text-[9px] uppercase tracking-widest">SZ: {item.size} | QTY: {item.qty}</p></div></div>))}</div>
            
            {/* Promo Code Section */}
            <div className="mb-8 border-b-2 border-gray-100 pb-8">
              <label className="block text-[10px] font-black uppercase mb-3 tracking-widest text-gray-500 flex items-center gap-2"><Tag size={12}/> Punya Kode Promo?</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 border-4 border-gray-900 p-3 font-bold outline-none focus:border-amber-500 uppercase text-xs" value={promoCodeInput} onChange={e => setPromoCodeInput(e.target.value)} placeholder="MASUKKAN KODE" />
                <button type="button" onClick={handleApplyPromo} disabled={isCheckingPromo} className="bg-gray-900 text-white font-black uppercase text-[10px] px-4 hover:bg-amber-500 hover:text-gray-900 transition-colors">Terapkan</button>
              </div>
              {promoMsg.text && <p className={`mt-2 text-[10px] font-black uppercase tracking-widest ${promoMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{promoMsg.text}</p>}
            </div>

            <div className="flex justify-between items-end mb-2"><span className="font-black text-gray-500 text-xs uppercase tracking-widest">Subtotal</span><span className="font-bold text-gray-900">{formatPrice(cartTotal)}</span></div>
            {appliedPromo && <div className="flex justify-between items-end mb-2"><span className="font-black text-green-600 text-xs uppercase tracking-widest flex items-center gap-1"><CheckCircle size={12}/> Diskon</span><span className="font-bold text-green-600">-{formatPrice(discountAmount)}</span></div>}
            <div className="flex justify-between items-end mb-10 mt-4 border-t-2 border-gray-900 pt-4"><span className="font-black text-gray-900 text-sm uppercase tracking-widest">Total Belanja</span><span className="font-black text-2xl text-brand-red tracking-widest">{formatPrice(finalTotal)}</span></div>
            <button disabled={isSaving} onClick={() => { const f = document.getElementById('checkoutForm'); if(f.reportValidity()) f.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); }} className="hidden lg:flex w-full bg-amber-500 text-gray-900 font-black py-5 uppercase text-sm border-4 border-gray-900 shadow-solid hover:translate-y-1 transition-all tracking-widest items-center justify-center gap-3">{isSaving ? <Loader2 size={18} className="animate-spin"/> : <><Send size={18} strokeWidth={3}/> Kirim Pesanan WA</>}</button>
          </div>
        </aside>
      </div>
    </main>
  );
};

// --- 6.8 AFFILIATE VIEW (Halaman Program Affiliate) ---