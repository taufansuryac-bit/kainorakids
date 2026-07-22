import { SEO } from '../constants/data';
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { auth, db, ADMIN_EMAIL, WA_NUMBER, appId } from '../firebase';
import { 
  ShoppingCart, Heart, ChevronRight, X, Minus, Plus, Star, Send, Package, Pencil, Trash, User, Check, Loader2, Play
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { formatPrice } from '../constants/data';
import { FadeIn, SizeGuideModal, ColorDropdown, ModernDropdown, CustomVideoPlayer } from '../components/ui/Modals';

export const AffiliateView = () => {
  const { setView, user, setIsAuthModalOpen, showToast, products } = useStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [promoProduct, setPromoProduct] = useState(null);

  useEffect(() => {
     if(products && products.length > 0) { setPromoProduct(products[0]); }
  }, [products]);

  const handleRegisterAffiliate = async () => {
    if (!user?.email) { setIsAuthModalOpen(true); return; }
    setIsRegistering(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'affiliates'), { name: user.name, email: user.email, status: 'pending', registeredAt: serverTimestamp() });
      showToast('Pendaftaran Affiliate berhasil! Admin akan segera menghubungi Bunda. 🚀');
      window.open(`https://wa.me/${WA_NUMBER}?text=Halo%20Admin%2C%20saya%20sudah%20mendaftar%20Affiliate%20di%20website%20atas%20nama%20${user.name}`, '_blank');
    } catch(err) { showToast('Gagal mendaftar ke database.'); } finally { setIsRegistering(false); }
  };

  return (
    <main className="min-h-screen py-16 px-4 max-w-6xl mx-auto text-left mt-10">
      <SEO title="Program Affiliate & Reseller Baju Anak — Komisi Jutaan Rupiah | Kainora Kids" description="Gabung program affiliate & reseller Kainora Kids. Bagikan link produk baju anak premium, dapatkan komisi jutaan rupiah per bulan. Tanpa modal, tanpa stok. Cocok untuk Ibu rumah tangga & content creator TikTok." keywords="affiliate baju anak, reseller baju anak premium, program affiliate kainora kids, komisi reseller baju anak, bisnis baju anak tanpa modal, content creator baju anak tiktok" />
      <button onClick={() => setView('home')} className="font-black mb-10 uppercase text-[10px] tracking-widest flex items-center gap-2 hover:text-amber-500 transition-colors"><ChevronRight className="rotate-180" size={16}/> KEMBALI KE BERANDA</button>
      
      <div className="space-y-20 md:space-y-32 mb-20 relative mx-auto mt-8">
        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 bg-gray-200 transform -translate-x-1/2" aria-hidden="true"></div>
        {[
          { step: "01", title: "Registrasi Reseller/Affiliate", desc: "Pendaftaran 100% gratis. Tanpa syarat rumit untuk mendaftar program pakaian anak premium.", img: "aff-1.jpg" },
          { step: "02", title: "Sampel Baju Anak", desc: "Dapatkan koleksi eksklusif Kainora Kids langsung ke alamat Anda sebagai bahan promosi.", img: 'aff-2.jpg' },
          { step: "03", title: "Promosi Online", desc: "Kreasikan konten visual baju anak berkualitas di platform media sosial Anda.", img: "aff-3.jpg" },
          { step: "04", title: "Pencairan Komisi", desc: "Nikmati komisi transparan untuk setiap transaksi kaos dan pakaian yang berhasil dari penjualan Anda.", img: "aff-4.jpg" }
        ].map((item, index) => (
          <FadeIn key={index} delay={index * 150}>
            <div className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-20 relative`}>
              <div className={`md:w-1/2 flex justify-center ${index % 2 !== 0 ? 'md:justify-start' : 'md:justify-end'} relative`}>
                <div className={`hidden md:flex absolute ${index % 2 !== 0 ? 'left-[-2.5rem]' : 'right-[-2.5rem]'} top-1/2 transform -translate-y-1/2 w-20 h-20 bg-white text-gray-900 items-center justify-center font-black text-3xl z-20 border-4 border-gray-900 shadow-solid`}>{item.step}</div>
                <div className="w-full max-w-[350px] aspect-square bg-gray-100 border-4 border-gray-900 shadow-solid overflow-hidden group"><img src={item.img} alt={item.title} className="w-full h-full object-cover transition duration-700 hover:scale-110" /></div>
              </div>
              <div className={`md:w-1/2 text-center ${index % 2 !== 0 ? 'md:text-right' : 'md:text-left'}`}><h2 className="font-black text-3xl md:text-4xl text-gray-900 mb-6 uppercase tracking-tighter">{item.title}</h2><p className="text-gray-600 text-sm font-bold uppercase tracking-widest leading-loose">{item.desc}</p></div>
            </div>
          </FadeIn>
        ))}
      </div>

      <section className="mb-20 bg-white border-4 border-gray-900 shadow-solid p-6 md:p-10 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6 border-b-4 border-gray-900 pb-4">
           <Star size={32} className="text-amber-500 fill-amber-500" />
           <div><h2 className="text-2xl font-black uppercase tracking-tighter">Kalkulator Komisi</h2><p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Cek komisi penjualan dari setiap produk Kainora Kids</p></div>
        </div>
        <div className="space-y-6">
            <div>
                <label className="block text-[10px] font-black uppercase mb-3 tracking-widest text-gray-500">Pilih Produk Yang Ingin Dipromosikan</label>
                <select className="w-full border-4 border-gray-900 p-4 font-bold outline-none focus:border-amber-500 text-sm cursor-pointer" value={promoProduct?.id || ''} onChange={(e) => setPromoProduct(products.find(p => p.id === parseInt(e.target.value)))}>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} - {formatPrice(p.price)}</option>)}
                </select>
                <div className="mt-4 bg-amber-50 border-4 border-amber-500 p-6 flex items-center justify-between shadow-solid-sm">
                    <div>
                    <p className="text-[10px] font-black uppercase text-amber-700 tracking-widest">Estimasi Komisi Affiliate (12%)</p>
                    <p className="text-2xl md:text-3xl font-black text-gray-900 mt-1">{promoProduct ? formatPrice(promoProduct.price * 0.12) : 'Rp 0'} <span className="text-xs text-gray-500 font-bold tracking-widest">/ PENJUALAN</span></p>
                    </div>
                    <div className="bg-amber-500 text-gray-900 p-4 border-2 border-gray-900 shadow-sm hidden sm:block"><Check size={28} strokeWidth={3} /></div>
                </div>
                <p className="mt-4 text-xs font-bold text-gray-600 leading-relaxed border-l-4 border-gray-200 pl-4">
                  Setiap kali pelanggan melakukan pembelian produk di atas melalui link atau rekomendasi Bunda, nilai tersebut adalah **komisi bersih** yang otomatis masuk ke saldo Bunda.
                </p>
            </div>
        </div>
      </section>

      <section className="mb-20">
        <div className="bg-amber-500 border-4 border-gray-900 p-8 md:p-12 text-center shadow-solid w-full mx-auto">
           <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-gray-900">Siap Memulai Bisnis Baju Anak?</h2>
           <p className="text-sm font-bold uppercase tracking-widest mb-8 text-gray-800">Daftar sekarang juga dan jadilah bagian dari kesuksesan Kainora Kids Indonesia!</p>
           <button onClick={handleRegisterAffiliate} disabled={isRegistering} className="bg-gray-900 text-white border-4 border-gray-900 font-black py-4 px-12 shadow-solid hover:translate-y-1 transition-all uppercase tracking-widest text-sm hover:bg-black disabled:opacity-70 flex items-center justify-center mx-auto gap-2">{isRegistering ? <Loader2 size={18} className="animate-spin" /> : (user?.email ? <><Check size={18}/> Daftar Affiliate Resmi</> : <><User size={18}/> Login Untuk Mendaftar</>)}</button>
        </div>
      </section>
      
      <div className="border-t-4 border-gray-900 pt-12 text-center mb-16 mt-8">
        <div className="inline-block bg-amber-500 text-gray-900 px-5 py-2 mb-6 font-black text-[10px] uppercase tracking-[0.2em] border-2 border-gray-900 shadow-solid-sm">Bunda Sukses</div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-16 leading-tight">Merekapun Sudah<br/>Membuktikannya</h2>
        <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-4 md:gap-6 justify-items-center pb-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <CustomVideoPlayer src="PLACEHOLDER_AFF_1" className="min-w-[75vw] md:min-w-0 shrink-0 snap-center" />
          <CustomVideoPlayer src="PLACEHOLDER_AFF_2" className="min-w-[75vw] md:min-w-0 shrink-0 snap-center" />
          <CustomVideoPlayer src="PLACEHOLDER_AFF_3" className="min-w-[75vw] md:min-w-0 shrink-0 snap-center" />
        </div>
      </div>
    </main>
  );
};

// --- 6.9 PROFILE VIEW (Halaman Data Pengguna) ---