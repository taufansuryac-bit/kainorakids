import { SEO, formatPrice, generateDummyReviews } from '../constants/data';
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { auth, db, ADMIN_EMAIL, WA_NUMBER, appId } from '../firebase';
import { 
  ShoppingCart, Heart, ChevronRight, X, Minus, Plus, Star, Send, Package, Pencil, Trash, User, Eye, Check, Quote, Bot, Loader2, Sparkles, Wand2
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { FadeIn, SizeGuideModal, ColorDropdown, ModernDropdown, ReviewModal } from '../components/ui/Modals';
import { WriteReviewModal } from '../components/ui/Modals';
import { cloudAIService } from '../services/cloudAIService';

export const ProductDetailView = ({ activeProduct, setActiveProduct }) => {
  const { setView, addToCart, toggleWishlist, wishlist, user, showToast, setIsAuthModalOpen, products } = useStore();
  const [size, setSize] = useState('');
  const [mainImg, setMainImg] = useState('');
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null); 
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [aiSummary, setAiSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  const [outfitIdea, setOutfitIdea] = useState('');
  const [isGeneratingOutfit, setIsGeneratingOutfit] = useState(false);
  
  // Magnifying Glass Zoom State
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);

  const viewersCount = useMemo(() => Math.floor(Math.random() * 30) + 12, [activeProduct]);
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  
  const dummyReviews = useMemo(() => generateDummyReviews(products).slice(0, 30), [products]);
  const mergedReviews = useMemo(() => [...reviews, ...dummyReviews], [reviews, dummyReviews]);
  const totalReviewCount = mergedReviews.length > 0 ? (850 + reviews.length) : "850";

  useEffect(() => {
    if (activeProduct) { 
       setMainImg(activeProduct.img || (activeProduct.images && activeProduct.images[0])); 
       setSize(activeProduct.sizes && activeProduct.sizes[0] ? activeProduct.sizes[0] : ''); 
       setQty(1); 
    }
  }, [activeProduct]);

  
  useEffect(() => {
    if(!user || !activeProduct) { setHasPurchased(false); return; }
    const qOrders = query(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), where('userEmail', '==', user.email));
    const unsubOrders = onSnapshot(qOrders, snap => {
      let bought = false;
      snap.forEach(doc => {
        const data = doc.data();
        if(data.items && data.items.some(it => String(it.id) === String(activeProduct.id))) {
          bought = true;
        }
      });
      setHasPurchased(bought);
    });
    return () => unsubOrders();
  }, [user, activeProduct]);

  useEffect(() => {
    if (!activeProduct) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'reviews'), where('productId', '==', activeProduct.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
       let fetchedReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       fetchedReviews.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
       setReviews(fetchedReviews);
    }, (error) => console.error("Gagal memuat ulasan produk:", error));
    return () => unsubscribe();
  }, [activeProduct]);

  if (!activeProduct) return null;

  const summarizeReviews = async () => {
    if (mergedReviews.length === 0) {
      showToast("Belum ada ulasan untuk diringkas.");
      return;
    }
    setIsSummarizing(true);
    try {
      const reviewsText = mergedReviews.slice(0, 10).map(r => r.text).join(" | ");
      const prompt = `Berikut adalah beberapa ulasan pelanggan untuk baju anak "${activeProduct.name}".
Tolong buatkan 1 atau 2 kalimat singkat dan sangat menarik yang merangkum ulasan-ulasan ini. Gunakan bahasa Indonesia santai yang persuasif (seperti: "Banyak bunda yang suka karena..."), tanpa poin-poin.
Ulasan: ${reviewsText}`;

      const text = await cloudAIService.chat([
        { role: 'system', content: 'Anda adalah asisten yang merangkum review produk.' },
        { role: 'user', content: prompt }
      ], { temperature: 0.5, maxTokens: 150, stream: false });

      setAiSummary(text.trim());
    } catch (err) {
      console.error(err);
      showToast("Gagal meringkas ulasan.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateOutfit = async () => {
    setIsGeneratingOutfit(true);
    try {
      const prompt = `Berikan 1 paragraf singkat (maksimal 3 kalimat) ide gaya padu padan (Mix & Match) yang keren untuk anak-anak menggunakan pakaian ini:
Nama Baju: ${activeProduct.name}
Warna: ${activeProduct.warna || 'Sesuai Gambar'}
Model: ${activeProduct.model || '-'}
Bahan: ${activeProduct.bahan || '-'}

Buat dengan bahasa Indonesia yang santai dan menginspirasi Bunda/Ayah. Tanpa poin-poin.`;

      const text = await cloudAIService.chat([
        { role: 'system', content: 'Anda adalah fashion stylist untuk baju anak.' },
        { role: 'user', content: prompt }
      ], { temperature: 0.7, maxTokens: 150, stream: false });

      setOutfitIdea(text.trim());
    } catch (err) {
      console.error(err);
      showToast("Gagal menghasilkan ide gaya.");
    } finally {
      setIsGeneratingOutfit(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'reviews', reviewId)); showToast("Ulasan berhasil dihapus!"); } catch (err) { showToast("Gagal menghapus ulasan."); }
  };

  const productImages = activeProduct.images && activeProduct.images.length > 0 ? activeProduct.images : [activeProduct.img];

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      backgroundImage: `url(${mainImg})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '250%', 
      backgroundRepeat: 'no-repeat'
    });
  };

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
      <SEO title={`Jual ${activeProduct.name} — Baju Anak Premium Katun Adem | Kainora Kids`} description={`Beli ${activeProduct.name} Kainora Kids. Bahan ${activeProduct.bahan}, jahitan ${activeProduct.jahitan}. Model ${activeProduct.model} Korean style. Ukuran ${(activeProduct.sizes || []).join(', ')}. Harga mulai ${formatPrice(activeProduct.price)}. Gratis ongkir Jawa!`} keywords={`${activeProduct.name}, baju anak premium, ${activeProduct.type} anak ${activeProduct.gender}, bahan katun adem, Korean style oversize boxy, kainora kids`} />
      
      {/* JSON-LD Product Schema — Google Rich Snippet per Produk */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": activeProduct.name,
        "image": activeProduct.images || [activeProduct.img],
        "description": `${activeProduct.name} — ${activeProduct.desc || 'Baju anak premium Kainora Kids'}. Bahan ${activeProduct.bahan}. Model ${activeProduct.model}.`,
        "brand": { "@type": "Brand", "name": "Kainora Kids" },
        "sku": `KNR-${activeProduct.id}`,
        "material": activeProduct.bahan,
        "color": activeProduct.warna,
        "audience": { "@type": "PeopleAudience", "suggestedMinAge": "1", "suggestedMaxAge": "10" },
        "offers": {
          "@type": "Offer",
          "url": `https://kainorakids.com/?view=productDetail&id=${activeProduct.id}`,
          "priceCurrency": "IDR",
          "price": activeProduct.price,
          "availability": "https://schema.org/InStock",
          "seller": { "@type": "Organization", "name": "Kainora Kids" },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "ID" },
            "deliveryTime": { "@type": "ShippingDeliveryTime", "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "DAY" }, "transitTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 5, "unitCode": "DAY" } }
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": String(Math.max(activeProduct.sold || 50, 50)),
          "bestRating": "5"
        }
      }) }} />

      <button onClick={() => setView('products')} className="font-black uppercase text-[10px] mb-8 flex items-center gap-2 transition-colors hover:text-amber-500 tracking-widest"><ChevronRight className="rotate-180" size={16} strokeWidth={3}/> Kembali Ke Katalog</button>
      
      {/* Lightbox / Fullscreen Image Viewer */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[7000] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsFullscreen(false)}>
          <button className="absolute top-6 right-6 text-white hover:text-amber-500 z-50 bg-gray-900/50 p-2 rounded-full transition-colors"><X size={24} strokeWidth={3}/></button>
          <div className="relative w-full max-w-4xl flex items-center justify-center h-full" onClick={e => e.stopPropagation()}>
             {productImages.length > 1 && <button onClick={(e) => { e.stopPropagation(); const i = productImages.indexOf(mainImg); setMainImg(productImages[i === 0 ? productImages.length - 1 : i - 1]); }} className="absolute left-2 md:left-4 p-3 bg-white/10 hover:bg-amber-500 text-white hover:text-gray-900 rounded-full transition-colors z-20"><ChevronRight className="rotate-180" size={24} strokeWidth={3}/></button>}
             <img src={mainImg} alt={activeProduct.alt} className="max-w-full max-h-[80vh] object-contain cursor-zoom-out" onClick={() => setIsFullscreen(false)} />
             {productImages.length > 1 && <button onClick={(e) => { e.stopPropagation(); const i = productImages.indexOf(mainImg); setMainImg(productImages[(i + 1) % productImages.length]); }} className="absolute right-2 md:right-4 p-3 bg-white/10 hover:bg-amber-500 text-white hover:text-gray-900 rounded-full transition-colors z-20"><ChevronRight size={24} strokeWidth={3}/></button>}
          </div>
          <div className="absolute bottom-6 flex gap-2 overflow-x-auto max-w-full px-4" onClick={e => e.stopPropagation()}>
             {productImages.map((img, idx) => (
               <button key={idx} onClick={() => setMainImg(img)} className={`w-14 h-14 flex-shrink-0 border-2 ${mainImg === img ? 'border-amber-500 scale-110' : 'border-gray-500 opacity-50 hover:opacity-100'} transition-all`}><img src={img} className="w-full h-full object-cover" /></button>
             ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-20">
        <div className="lg:w-1/2 flex flex-col gap-4">
          <div 
            className="w-full aspect-square bg-gray-100 border-4 border-gray-900 shadow-solid overflow-hidden relative cursor-zoom-in group"
            onClick={() => setIsFullscreen(true)}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
          >
            <img src={mainImg} alt={activeProduct.alt} className={`w-full h-full object-cover transition-opacity duration-300 ${isZooming ? 'opacity-0 md:opacity-0' : 'opacity-100'}`} />
            {/* Magnifying Zoom Overlay */}
            <div className={`absolute inset-0 pointer-events-none hidden md:block transition-opacity duration-300 ${isZooming ? 'opacity-100' : 'opacity-0'}`} style={zoomStyle} />
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2">
            {productImages.map((img, idx) => (
              <button key={idx} onClick={() => setMainImg(img)} aria-label={`Lihat gambar detail`} className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 border-4 transition-all ${mainImg === img ? 'border-gray-900 shadow-solid-sm -translate-y-1' : 'border-gray-200 hover:border-gray-400'}`}><img src={img} alt="Detail" className="w-full h-full object-cover" /></button>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2 flex flex-col justify-start">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Pakaian Anak / {activeProduct.gender}</p>
            {activeProduct.label && (
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border-2 border-gray-900 shadow-sm ${
                activeProduct.label === 'Terbaru' ? 'bg-amber-500 text-gray-900' : 
                activeProduct.label === 'Terlaris' ? 'bg-red-600 text-white' : 
                'bg-pink-500 text-white'
              }`}>
                {activeProduct.label === 'Terbaru' ? '✨' : activeProduct.label === 'Terlaris' ? '🔥' : '💖'} {activeProduct.label}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tighter leading-tight">{activeProduct.name}</h1>
          <p className="text-4xl font-black text-amber-500 mb-6">{formatPrice(activeProduct.price)}</p>

          <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b-4 border-gray-900">
             <div className="font-bold text-[10px] uppercase bg-gray-900 text-white px-3 py-2 tracking-widest">{activeProduct.sold || 0} Terjual</div>
             <div className="flex items-center gap-2 font-bold text-[10px] uppercase text-gray-600 tracking-widest bg-amber-100 border-2 border-gray-900 px-3 py-1.5"><Eye size={14}/> {viewersCount} Orang sedang melihat</div>
          </div>

          <div className="mb-10">
            <h2 className="font-black uppercase text-xl tracking-widest mb-4 text-gray-900 border-b-4 border-gray-900 pb-3">Tentang Produk Ini</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-8">{activeProduct.desc}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4 items-start"><div className="p-2 bg-amber-50 text-amber-500 shrink-0"><Check size={18} strokeWidth={3}/></div><div><h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Material / Bahan</h3><p className="text-sm font-black text-gray-900 uppercase tracking-wider mb-1">{activeProduct.bahan || '-'}</p></div></div>
              <div className="flex gap-4 items-start"><div className="p-2 bg-amber-50 text-amber-500 shrink-0"><Check size={18} strokeWidth={3}/></div><div><h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Konstruksi Jahitan</h3><p className="text-sm font-black text-gray-900 uppercase tracking-wider mb-1">{activeProduct.jahitan || '-'}</p></div></div>
              <div className="flex gap-4 items-start"><div className="p-2 bg-amber-50 text-amber-500 shrink-0"><Check size={18} strokeWidth={3}/></div><div><h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Warna</h3><p className="text-sm font-black text-gray-900 uppercase tracking-wider mb-1">{activeProduct.warna || 'Sesuai Gambar'}</p></div></div>
              <div className="flex gap-4 items-start"><div className="p-2 bg-amber-50 text-amber-500 shrink-0"><Star size={18} strokeWidth={3} className="fill-amber-500"/></div><div><h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Model / Potongan</h3><p className="text-sm font-black text-gray-900 uppercase tracking-wider mb-1">{activeProduct.model || '-'}</p></div></div>
            </div>

            {/* AI Outfit Generator */}
            <div className="mt-8 border-t-2 border-dashed border-gray-200 pt-6">
              {!outfitIdea && !isGeneratingOutfit ? (
                <button onClick={handleGenerateOutfit} className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 border-2 border-amber-300 transition-colors rounded-lg">
                  <Sparkles size={14} /> Minta Ide Gaya AI (Mix & Match)
                </button>
              ) : (
                <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-xl relative">
                  <div className="flex items-center gap-2 mb-2 text-amber-700">
                    {isGeneratingOutfit ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                    <h4 className="font-black text-[10px] uppercase tracking-widest">{isGeneratingOutfit ? 'AI sedang meracik gaya...' : 'Ide Gaya AI'}</h4>
                  </div>
                  {outfitIdea && <p className="text-sm font-medium text-amber-900 leading-relaxed">{outfitIdea}</p>}
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-2 bg-white border-4 border-gray-900 p-6 md:p-8 shadow-solid-sm">
            <div className="flex justify-between items-center mb-5 border-b-2 border-gray-100 pb-3"><span className="font-black uppercase text-xs tracking-widest text-gray-900">Pilih Ukuran</span><button onClick={() => setIsSizeGuideOpen(true)} className="text-[10px] font-black underline uppercase hover:text-amber-500 transition-colors text-gray-500">Panduan & Kalkulator</button></div>
            <div className="flex flex-wrap gap-2 md:gap-3">{activeProduct.sizes?.map(s => <button key={s} onClick={() => setSize(s)} className={`px-3 py-1.5 md:px-6 md:py-4 border-2 font-black uppercase text-[10px] md:text-sm tracking-widest transition-all ${size === s ? 'border-gray-900 bg-gray-900 text-white shadow-solid-sm -translate-y-1' : 'border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900'}`}>{s}</button>)}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-12 mt-4">
            <div className="flex items-center border-4 border-gray-900 bg-white min-h-[56px] md:min-h-[64px] w-full sm:w-40 shadow-solid-sm"><button className="px-4 md:px-5 hover:text-amber-500 transition-colors h-full flex items-center justify-center text-gray-900" onClick={() => setQty(Math.max(1, qty-1))}><Minus size={18} strokeWidth={3}/></button><span className="flex-1 text-center font-black text-xl md:text-2xl text-gray-900">{qty}</span><button className="px-4 md:px-5 hover:text-amber-500 transition-colors h-full flex items-center justify-center text-gray-900" onClick={() => setQty(qty+1)}><Plus size={18} strokeWidth={3}/></button></div>
            <button onClick={() => addToCart(activeProduct, size, qty)} className="flex-1 bg-amber-500 text-gray-900 font-black uppercase tracking-widest text-xs md:text-sm py-4 md:py-5 min-h-[56px] md:min-h-[64px] border-4 border-gray-900 shadow-solid hover:-translate-y-1 transition-all active:shadow-none flex items-center justify-center gap-3"><ShoppingCart size={20} strokeWidth={2.5}/> Masukkan Keranjang</button>
          </div>
        </div>
      </div>

      <section className="pt-8 pb-12 mt-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 border-b-4 border-gray-900 pb-4 gap-4">
           <div><h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Ulasan Pelanggan</h2><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">4 dari {totalReviewCount}++ Ulasan</p></div>
           <div className="flex flex-wrap gap-2">
             <button onClick={() => setView('allReviews')} className="font-black uppercase text-[10px] hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2 transition-colors border-2 border-gray-900 px-3 py-2 shadow-sm bg-white text-gray-900"><Quote size={14}/> Lihat Semua Ulasan</button>
             <button onClick={() => { if (user?.email) { setIsReviewModalOpen(true); } else { setIsAuthModalOpen(true); } }} className="font-black uppercase text-[10px] hover:bg-amber-400 hover:text-gray-900 flex items-center gap-2 transition-colors border-2 border-gray-900 px-3 py-2 shadow-sm bg-amber-500 text-gray-900"><Star size={14} strokeWidth={3} className="text-gray-900"/> Berikan Ulasan</button>
           </div>
        </div>

        {/* AI Summarizer UI */}
        <div className="mb-6 border-4 border-amber-500 bg-amber-50 p-4 md:p-6 shadow-solid-sm relative">
          <div className="flex items-center gap-2 mb-3 border-b-2 border-amber-200 pb-3">
             <Bot className="text-amber-500" size={24} />
             <div>
               <h3 className="font-black uppercase text-amber-900 tracking-wider text-sm">Ringkasan Ulasan AI</h3>
               <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Apa kata pembeli tentang produk ini?</p>
             </div>
          </div>
          {aiSummary ? (
            <p className="text-sm md:text-base font-bold text-gray-800 leading-relaxed italic">"{aiSummary.replace(/^"|"$/g, '')}"</p>
          ) : (
            <button onClick={summarizeReviews} disabled={isSummarizing} className="bg-gray-900 text-white font-black px-6 py-3 uppercase tracking-widest text-[10px] border-2 border-gray-900 shadow-sm hover:bg-amber-500 hover:text-gray-900 transition-colors flex items-center gap-2 mt-2">
              {isSummarizing ? <Loader2 size={16} className="animate-spin" /> : <Bot size={16} />}
              {isSummarizing ? 'Membaca Ulasan...' : 'Ringkas Ulasan dengan AI ✨'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 pb-4">
          {mergedReviews.slice(0, 4).map((r) => {
            const isOwnerOrAdmin = user && (user.email === ADMIN_EMAIL || user.email === r.email);
            return (
              <div key={r.id} className="border-2 border-gray-900 p-3 md:p-4 bg-white shadow-solid-sm relative flex flex-col">
                {isOwnerOrAdmin && !r.isDummy && r.id.length > 5 && (
                  <div className="absolute top-2 right-2 flex gap-1 z-20">
                    <button onClick={() => { setEditingReview(r); setIsReviewModalOpen(true); }} className="p-1 md:p-1.5 bg-amber-100 text-amber-600 border border-gray-900 hover:bg-amber-500 hover:text-gray-900 transition-colors"><Pencil size={10}/></button>
                    <button onClick={() => handleDeleteReview(r.id)} className="p-1 md:p-1.5 bg-red-100 text-red-600 border border-gray-900 hover:bg-red-500 hover:text-white transition-colors"><Trash size={10}/></button>
                  </div>
                )}
                <div className="flex items-start justify-between mb-2 md:mb-3">
                  <div className="flex text-amber-500">{[...Array(5)].map((_, j) => <Star key={j} className={`w-2 h-2 md:w-3 md:h-3 ${j >= r.rating ? "text-gray-300" : ""}`} fill={j < r.rating ? "currentColor" : "none"} strokeWidth={j < r.rating ? 0 : 2} />)}</div>
                  <Quote className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-200" />
                </div>
                <p className="italic text-[10px] md:text-xs font-bold text-gray-700 leading-relaxed mb-3 md:mb-4 line-clamp-3 flex-1 relative z-10">"{r.text.replace(/^"|"$/g, '')}"</p>
                <div className="flex items-center gap-2 border-t-2 border-gray-100 pt-2 md:pt-3 relative z-10">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-amber-100 border border-gray-900 flex items-center justify-center font-black text-[9px] md:text-[10px] uppercase shadow-sm text-gray-900 shrink-0">{r.name.charAt(0)}</div>
                  <div className="overflow-hidden">
                    <p className="font-black text-[9px] md:text-[10px] text-gray-900 uppercase tracking-widest truncate">{r.name}</p>
                    <p className="text-[7px] md:text-[8px] font-bold text-gray-500 uppercase tracking-widest truncate">{r.productName || 'Produk Kainora'} {r.isEdited && "(Diedit)"}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="pt-8 pb-16 mt-8">
        <div className="mb-10 border-b-4 border-gray-900 pb-4">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Bunda Mungkin Juga Suka</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-left">
          {products.filter(p => p.id !== activeProduct.id).slice(0, 4).map(p => (
            <article key={p.id} className="bg-white border-2 border-gray-200 hover:border-gray-900 transition-colors cursor-pointer group flex flex-col h-full relative" onClick={() => { setActiveProduct(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <div className="relative aspect-square bg-gray-100 overflow-hidden border-b-2 border-gray-200 group-hover:border-gray-900 transition-colors">
                <img src={p.img || (p.images && p.images[0])} alt={p.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <button className="absolute top-2 right-2 z-20 bg-white/80 p-2 border-2 border-transparent hover:border-red-500 transition-colors" onClick={(e) => toggleWishlist(e, p.id)}><Heart size={18} fill={wishlist.includes(p.id) ? 'currentColor' : 'none'} className={wishlist.includes(p.id) ? 'text-amber-500' : 'text-gray-900'} /></button>
              </div>
              <div className="p-4 md:p-5 flex-grow flex flex-col justify-between bg-white relative z-10"><div><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{p.type}</p><h3 className="font-bold text-gray-900 uppercase text-xs leading-snug line-clamp-2">{p.name}</h3></div><p className="text-gray-900 font-black tracking-wider mt-4 text-sm">{formatPrice(p.price)}</p></div>
            </article>
          ))}
        </div>
      </section>
      
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} onSelectSize={(sz) => { setSize(sz); setIsSizeGuideOpen(false); }} availableSizes={activeProduct.sizes} />
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => { setIsReviewModalOpen(false); setEditingReview(null); }} activeProduct={activeProduct} editData={editingReview} />
      {isWriteReviewModalOpen && <WriteReviewModal isOpen={isWriteReviewModalOpen} onClose={() => setIsWriteReviewModalOpen(false)} product={activeProduct} />}
    </main>
  );
};

// --- 6.4 ALL REVIEWS VIEW (Halaman Semua Testimoni) ---