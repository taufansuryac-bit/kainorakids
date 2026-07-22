import { SEO, HERO_SLIDES } from '../constants/data';
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { auth, db, ADMIN_EMAIL, WA_NUMBER } from '../firebase';
import { 
  ShoppingCart, Heart, ChevronRight, X, Minus, Plus, Star, Send, Package, Pencil, Trash, User, Search, Instagram, Video as VideoIcon, Scissors, Ruler
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { formatPrice } from '../constants/data';
import { FadeIn, SizeGuideModal, ColorDropdown, ModernDropdown, CustomVideoPlayer, Parallax } from '../components/ui/Modals';
import InstagramFeed from '../components/layout/InstagramFeed';

export const HomeView = ({ setSelectedProduct }) => {
  const { setView, toggleWishlist, wishlist, setGlobalGenderFilter, products } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [qualitySlide, setQualitySlide] = useState(0);
  const qualityImages = ["potong-bahan.jpg", "detail-jahitan.jpg", "penjahit-workshop.jpg"];

  // --- LOGIKA BARU: Filter Produk 7 Hari Terakhir ---
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000); // Hitungan 7 hari dalam milidetik
  const recentProducts = useMemo(() => {
    return products.filter(p => {
      let time = 0;
      if (p.createdAt && typeof p.createdAt.toMillis === 'function') {
        time = p.createdAt.toMillis();
      } else if (p.createdAt) {
        time = p.createdAt;
      } else {
        // Fallback untuk dummy awal yang id-nya < 1000 agar masuk status "Baru"
        time = p.id < 1000 ? Date.now() : p.id; 
      }
      return time >= sevenDaysAgo;
    }).sort((a, b) => {
      const timeA = (a.createdAt && typeof a.createdAt.toMillis === 'function') ? a.createdAt.toMillis() : (a.createdAt || (a.id < 1000 ? Date.now() : a.id));
      const timeB = (b.createdAt && typeof b.createdAt.toMillis === 'function') ? b.createdAt.toMillis() : (b.createdAt || (b.id < 1000 ? Date.now() : b.id));
      return timeB - timeA;
    }).slice(0, 8); // Maksimal tampil 8 produk
  }, [products]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length), 5000);
    const qTimer = setInterval(() => setQualitySlide(prev => (prev + 1) % 3), 3500);
    return () => { clearInterval(timer); clearInterval(qTimer); }
  }, []);

  return (
    <main className="min-h-screen relative z-0 overflow-x-hidden text-center">
      <SEO title="Kainora Kids — Toko Baju Anak Premium Katun Adem | Gratis Ongkir Jawa" description="Kainora Kids — Toko baju anak premium #1 Indonesia. Koleksi kaos, dress & setelan anak bahan 100% katun tebal, super adem, ramah kulit sensitif. Korean style oversize boxy. Gratis ongkir se-Jawa!" keywords="baju anak premium, toko baju anak online terpercaya, baju anak katun adem, kaos anak oversize boxy, baju anak korean style, toko baju anak terdekat jakarta bandung surabaya semarang yogyakarta, racun tiktok baju anak, ootd anak pinterest, baju anak kekinian 2026, kainora kids" />
      <h1 className="sr-only">Toko Baju Anak Premium Indonesia - Kainora Kids</h1>
      <section className="relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden bg-gray-900 border-b-4 border-gray-900 shadow-[0_4px_0_0_#111827]">
        {HERO_SLIDES.map((slide, index) => (
          <div key={slide.id} className={`absolute inset-0 transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${index === currentSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-110'}`}>
            {slide.type === 'video' ? <video autoPlay muted loop playsInline controlsList="nodownload" disablePictureInPicture onContextMenu={(e) => e.preventDefault()} className="w-full h-full object-cover"><source src={slide.media} type="video/mp4" /></video> : <img src={slide.media} alt="Model baju anak premium terbaru" className="w-full h-full object-cover" />}
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 md:py-16 relative z-10 text-left mt-4 md:mt-8">
        <div className="bg-white border-4 border-gray-900 p-6 md:p-12 lg:p-16 shadow-solid relative w-full">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-16 items-center">
            <div className="lg:w-1/2">
              <FadeIn>
                 <div className="inline-block border-2 border-gray-900 px-2 py-1 md:px-3 md:py-1 mb-4 md:mb-6 bg-amber-100"><p className="text-gray-900 font-bold tracking-widest text-[9px] md:text-xs uppercase">KUALITAS STANDARD INTERNATIONAL</p></div>
                 <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 font-['Montserrat',sans-serif] uppercase tracking-tighter mb-4 md:mb-8 leading-tight">Kualitas Premium <br/>Setiap Sentuhan.</h2>
                 <p className="text-gray-600 font-medium leading-relaxed mb-4 md:mb-6 text-xs md:text-base">Setiap produk Kainora dibuat dari bahan pilihan berkualitas tinggi yang dirancang khusus untuk kenyamanan anak. Menggunakan Heavyweight Cotton 100% anti alergi.</p>
              </FadeIn>
              <div className="space-y-4 md:space-y-8 mt-6 md:mt-10">
                 <FadeIn delay={150}>
                   <div className="flex gap-4 md:gap-6 items-start">
                     <div className="w-10 h-10 md:w-14 md:h-14 border-2 border-gray-900 bg-white flex items-center justify-center text-xl md:text-2xl shadow-solid-sm flex-shrink-0"><Scissors className="w-5 h-5 md:w-7 md:h-7"/></div>
                     <div><h3 className="font-black text-gray-900 text-sm md:text-lg uppercase tracking-wider mb-1 md:mb-2 font-['Montserrat',sans-serif]">Pemotongan Presisi</h3><p className="text-gray-600 text-[10px] md:text-sm font-medium leading-relaxed">Kain dipotong mengikuti arah serat bahan untuk menjaga bentuk pakaian anak tetap rapi dan tidak mudah melar.</p></div>
                   </div>
                 </FadeIn>
                 <FadeIn delay={300}>
                   <div className="flex gap-4 md:gap-6 items-start">
                     <div className="w-10 h-10 md:w-14 md:h-14 border-2 border-gray-900 bg-white flex items-center justify-center text-xl md:text-2xl shadow-solid-sm flex-shrink-0"><Ruler className="w-5 h-5 md:w-7 md:h-7"/></div>
                     <div><h3 className="font-black text-gray-900 text-sm md:text-lg uppercase tracking-wider mb-1 md:mb-2 font-['Montserrat',sans-serif]">Jahitan Baju Ekstra Kuat</h3><p className="text-gray-600 text-[10px] md:text-sm font-medium leading-relaxed">Dikerjakan dengan standar international pakaian anak menggunakan jahit rantai untuk menahan pergerakan aktif si kecil & Dilengkapi jahitan overdeck 3 jarum yang berfungsi membuat lebih kuat, elastis & tahan lama.</p></div>
                   </div>
                 </FadeIn>
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
               <FadeIn delay={200}>
                  <div className="relative aspect-square border-4 border-gray-900 shadow-solid bg-gray-100 group overflow-hidden">
                     {qualityImages.map((img, idx) => <img key={idx} src={img} alt={`Kualitas Kainora ${idx}`} className={`absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out ${idx === qualitySlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'}`} /> )}
                  </div>
               </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-10 border-b-4 border-gray-900 pb-4 text-left">
          <div><h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Koleksi Terbaru</h2><p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Ditambahkan 7 Hari Terakhir</p></div>
          <button onClick={() => setView('products')} className="hidden md:flex font-black uppercase text-sm tracking-widest hover:text-amber-500 items-center gap-2 transition-colors hover-magnetic">Lihat Semua Katalog <ChevronRight size={18} strokeWidth={3}/></button>
        </div>
        
        {recentProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-left">
            {recentProducts.map((p, idx) => (
              <FadeIn key={p.id} delay={(idx % 4) * 100}>
                <article className="bg-white border-2 border-gray-200 hover:border-gray-900 transition-colors cursor-pointer group flex flex-col h-full relative" onClick={() => setSelectedProduct(p)}>
                  <div className="relative aspect-square overflow-hidden border-b-2 border-gray-200 group-hover:border-gray-900 bg-gray-100">
                    <img src={p.img || (p.images && p.images[0])} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${p.images && p.images.length > 1 ? 'group-hover:opacity-0' : ''}`} alt={p.alt} loading="lazy" />
                    {p.images && p.images.length > 1 && <img src={p.images[1]} alt={p.alt} className="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-105" loading="lazy" />}
                    
                    {p.label && (
                      <div className={`absolute top-0 left-0 text-[9px] md:text-[10px] uppercase tracking-widest font-black px-3 py-1.5 z-10 border-b-2 border-r-2 border-gray-900 shadow-sm ${
                        p.label === 'Terbaru' ? 'bg-amber-500 text-gray-900' : 
                        p.label === 'Terlaris' ? 'bg-red-600 text-white' : 
                        'bg-pink-500 text-white'
                      }`}>
                        {p.label}
                      </div>
                    )}

                    <button className="absolute top-2 right-2 z-20 bg-white/80 p-2 border-2 border-transparent hover:border-red-500 transition-colors shadow-sm" onClick={(e) => { e.stopPropagation(); toggleWishlist(e, p.id); }} aria-label="Tambah ke wishlist"><Heart size={18} fill={wishlist.includes(p.id) ? 'currentColor' : 'none'} className={wishlist.includes(p.id) ? 'text-amber-500' : 'text-gray-900'} /></button>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between"><h3 className="font-bold text-xs md:text-sm uppercase leading-snug line-clamp-2 text-gray-900">{p.name}</h3><p className="font-black text-gray-900 tracking-wider mt-4 text-sm md:text-base">{formatPrice(p.price)}</p></div>
                </article>
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border-4 border-gray-900 shadow-solid-sm">
            <Search size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Belum ada baju baru minggu ini.</p>
            <p className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-widest">Cek katalog untuk koleksi lainnya Bunda!</p>
          </div>
        )}
        <div className="mt-8 md:hidden"><button onClick={() => setView('products')} className="w-full bg-gray-900 text-white font-black py-4 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-solid-sm hover-magnetic">Lihat Semua Katalog <ChevronRight size={14} strokeWidth={3} /></button></div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 border-4 border-gray-900 shadow-solid overflow-hidden">
          <div className="relative h-[300px] md:h-[400px] cursor-pointer border-b-4 md:border-b-0 md:border-r-4 border-gray-900 group" onClick={() => { setGlobalGenderFilter('Laki-laki'); setView('products'); }}>
            <img src='shop-for-boys.jpg' className="absolute inset-0 w-full h-full object-cover" alt="Baju anak laki-laki premium" />
          </div>
          <div className="relative h-[300px] md:h-[400px] cursor-pointer group" onClick={() => { setGlobalGenderFilter('Perempuan'); setView('products'); }}>
            <img src='shop-for-girl.jpg' className="absolute inset-0 w-full h-full object-cover" alt="Baju dress anak perempuan" />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-4">
        <FadeIn>
          <div className="flex justify-between items-end mb-10 border-b-4 border-gray-900 pb-4 text-left">
             <div><h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Perjalanan Pesanan Bunda</h2><p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Proses "Behind The Scene" Baju Anak Kainora</p></div>
          </div>
          <div className="w-full bg-white border-4 border-gray-900 shadow-solid p-2 relative">
            <div className="absolute -top-4 -left-4 bg-amber-500 text-gray-900 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] px-4 py-2 border-4 border-gray-900 z-10 shadow-sm">BEHIND THE SCENES</div>
            <video className="w-full aspect-video object-cover border-4 border-gray-900" muted autoPlay playsInline loop controlsList="nodownload" disablePictureInPicture onContextMenu={(e) => e.preventDefault()} poster={products[0]?.img}><source src="VIDEO-WEB-PERJALANAN.mp4" type="video/mp4" /></video>
          </div>
        </FadeIn>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-10 relative z-10">
        <FadeIn delay={200}>
          <div className="flex flex-col gap-4 md:gap-6 w-full">
            <div className="bg-amber-500 border-4 border-gray-900 py-6 md:py-8 px-4 md:px-10 text-gray-900 shadow-solid flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 w-full">
               <div className="text-center md:text-left flex-1"><h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter mb-1 md:mb-2">Program Affiliate Baju Anak</h2><p className="text-[10px] md:text-sm font-bold uppercase tracking-wider text-gray-800">Bagikan rekomendasi produk premium kami dan dapatkan komisi menarik setiap penjualan.</p></div>
               <button onClick={() => setView('affiliate')} className="whitespace-nowrap bg-gray-900 text-white border-2 border-gray-900 font-black py-3 px-6 md:py-4 md:px-8 shadow-solid uppercase tracking-widest text-[10px] md:text-xs transition-all hover:bg-black shrink-0 hover-magnetic">Pelajari Affiliate</button>
            </div>

          </div>
        </FadeIn>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8 pb-24">
        <FadeIn delay={150}>
          <div className="flex justify-between items-end mb-10 border-b-4 border-gray-900 pb-4 text-left">
             <div>
               <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Featured on TikTok</h2>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Racun TikTok Kainora Kids</p>
             </div>
             <button onClick={() => window.open('https://www.tiktok.com/@taufansurc', '_blank')} className="hidden md:flex font-black uppercase text-sm tracking-widest hover:text-amber-500 items-center gap-2 transition-colors hover-magnetic">
               Follow TikTok Kami <ChevronRight size={18} strokeWidth={3}/>
             </button>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-4 md:gap-8 pb-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {/* Ganti "PLACEHOLDER_1" dengan nama file MP4 yang sudah diunduh (misal: "video-promo-1.mp4") */}
            <CustomVideoPlayer src="PLACEHOLDER_1" className="min-w-[75vw] md:min-w-0 shrink-0 snap-center" />
            <CustomVideoPlayer src="PLACEHOLDER_2" className="min-w-[75vw] md:min-w-0 shrink-0 snap-center" />
            <CustomVideoPlayer src="PLACEHOLDER_3" className="min-w-[75vw] md:min-w-0 shrink-0 snap-center" />
          </div>
          <div className="mt-8 md:hidden">
            <button onClick={() => window.open('https://www.tiktok.com/@taufansurc', '_blank')} className="w-full bg-gray-900 text-white font-black py-4 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-solid-sm hover-magnetic">
              Follow TikTok Kami <ChevronRight size={14} strokeWidth={3} />
            </button>
          </div>
        </FadeIn>
      </section>

      <Parallax speed={0.2} className="w-full relative my-10 md:my-12 block border-y-4 border-gray-900 aspect-[21/9] md:aspect-[21/4]">
        <img src="banner-hero-slider-1.jpg" alt="Promo Banner Kainora Kids" className="w-full h-full object-cover block transition-transform duration-700 hover:scale-105" />
      </Parallax>

      <InstagramFeed />
    </main>
  );
};

// --- 6.2 PRODUCTS PAGE VIEW (Katalog Pakaian & List Produk) ---