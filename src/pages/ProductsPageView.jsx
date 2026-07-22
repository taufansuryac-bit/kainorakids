import { SEO, COLOR_SWATCHES } from '../constants/data';
import { productListSchema } from '../utils/seoHelpers';
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { auth, db, ADMIN_EMAIL, WA_NUMBER } from '../firebase';
import { 
  ShoppingCart, Heart, ChevronRight, X, Minus, Plus, Star, Send, Package, Pencil, Trash, User, Search
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { formatPrice } from '../constants/data';
import { FadeIn, SizeGuideModal, ColorDropdown, ModernDropdown } from '../components/ui/Modals';

export const ProductsPageView = ({ setActiveProduct }) => {
  const { setView, toggleWishlist, wishlist, globalGenderFilter, products, globalSearchState } = useStore();
  const [typeFilter, setTypeFilter] = useState('Semua');
  const [ageFilter, setAgeFilter] = useState(globalSearchState?.age || 'Semua');
  const [sortOrder, setSortOrder] = useState('Terbaru');
  const [genderFilter, setGenderFilter] = useState(globalSearchState?.gender !== 'Semua' ? globalSearchState?.gender : globalGenderFilter);
  const [colorFilter, setColorFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState(globalSearchState?.query || '');

  useEffect(() => {
    if (globalSearchState) {
      if (globalSearchState.age) setAgeFilter(globalSearchState.age);
      if (globalSearchState.gender && globalSearchState.gender !== 'Semua') setGenderFilter(globalSearchState.gender);
      if (globalSearchState.query !== undefined) setSearchQuery(globalSearchState.query);
    }
  }, [globalSearchState]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16; // 4 columns x 5 rows

  const ages = ['Semua', '1-2Y', '3-4Y', '5-6Y', '7-8Y', '9-10Y'];
  const filtered = products.filter(p => {
    if (typeFilter !== 'Semua' && p.type !== typeFilter) return false;
    if (genderFilter !== 'Semua' && p.gender !== genderFilter && p.gender !== 'Unisex') return false;
    if (ageFilter !== 'Semua' && (!p.sizes || !p.sizes.includes(ageFilter))) return false;
    if (colorFilter !== 'Semua') {
      const selectedHex = COLOR_SWATCHES.find(c => c.name === colorFilter)?.hex;
      if (!p.colors || !p.colors.includes(selectedHex)) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name?.toLowerCase().includes(q) && !p.type?.toLowerCase().includes(q)) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortOrder === 'Terlaris') return (b.sold || 0) - (a.sold || 0);
    
    // --- LOGIKA BARU: Pengurutan Paling Disukai ---
    if (sortOrder === 'Paling Disukai') {
      // Menggunakan data simulasi dari angka terjual + id
      const likesA = a.likes !== undefined ? a.likes : (a.sold ? (a.sold * 2) + (a.id % 10) : 0);
      const likesB = b.likes !== undefined ? b.likes : (b.sold ? (b.sold * 2) + (b.id % 10) : 0);
      return likesB - likesA; 
    }

    // Sort primarily by Admin 'order' ascending, then fallback to 'id' descending
    const orderA = a.order !== undefined ? a.order : 999;
    const orderB = b.order !== undefined ? b.order : 999;
    if (orderA !== orderB) return orderA - orderB;
    return b.id - a.id; 
  });
  
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="min-h-screen pb-12 bg-white">
      <SEO title="Katalog Baju Anak Premium 2026 — Kaos, Dress & Setelan | Kainora Kids" description="Jelajahi koleksi lengkap baju anak premium Kainora Kids. Kaos anak laki-laki, dress anak perempuan, setelan unisex bahan 100% katun tebal, adem, ramah kulit sensitif. Korean style oversize boxy mulai Rp89.000." keywords="katalog baju anak premium, baju anak murah bagus, kaos anak laki-laki premium, dress anak perempuan Korean style, setelan anak katun adem, baju anak oversize boxy, baju anak estetik minimalis 2026, baju anak ramah kulit sensitif" image="https://kainorakids.com/link-logo.jpg" url="https://kainorakids.com/?view=products" type="website" />

      {/* JSON-LD ItemList Schema — Google Shopping */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema(filtered)) }} />
      
      <div className="pt-10 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Katalog Pakaian</h1>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Menampilkan {filtered.length} Model Baju</p>
        </div>
      </div>

      {/* FILTER BAR - APPLE STYLE */}
      <div className="sticky top-20 z-40 w-full bg-white/95 backdrop-blur-md border-y border-gray-200 py-1 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-1 md:gap-2">
             <ModernDropdown label="Kategori" value={typeFilter} options={['Semua', 'Kaos', 'Dress', 'Setelan', 'Jaket', 'Kemeja', 'Celana']} onChange={(v) => {setTypeFilter(v); setCurrentPage(1);}} />
             <ModernDropdown label="Jenis" value={genderFilter} options={['Semua', 'Laki-laki', 'Perempuan']} onChange={(v) => {setGenderFilter(v); setCurrentPage(1);}} />
             <ModernDropdown label="Usia" value={ageFilter} options={ages} onChange={(v) => {setAgeFilter(v); setCurrentPage(1);}} />
             <ColorDropdown value={colorFilter} options={COLOR_SWATCHES} onChange={(v) => {setColorFilter(v); setCurrentPage(1);}} />
             
             <div className="hidden md:block w-px h-5 bg-gray-300 mx-2 shrink-0"></div>
             
             {/* Tambahkan opsi 'Paling Disukai' di Dropdown Array */}
             <ModernDropdown label="Urutkan" value={sortOrder} options={['Terbaru', 'Terlaris', 'Paling Disukai']} onChange={(v) => {setSortOrder(v); setCurrentPage(1);}} />
             
             <div className="hidden md:block w-px h-5 bg-gray-300 mx-2 shrink-0"></div>
             
             <div className="relative flex-grow md:max-w-xs mt-2 md:mt-0">
               <input 
                 type="text" 
                 placeholder="Cari Baju..." 
                 value={searchQuery}
                 onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                 className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-gray-900 outline-none"
               />
               <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
               {searchQuery && <button onClick={() => {setSearchQuery(''); setCurrentPage(1);}} className="absolute right-3 top-1/2 transform -translate-y-1/2"><X size={14} className="text-gray-500 hover:text-gray-900" /></button>}
             </div>
          </div>
        </div>
      </div>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 text-left">
            {currentProducts.map((p, idx) => {
              return (
              <FadeIn key={p.id} delay={(idx % 4) * 100}>
                <article className="bg-white border-2 border-gray-200 hover:border-gray-900 transition-colors cursor-pointer group flex flex-col h-full relative rounded-xl overflow-hidden shadow-sm hover:shadow-md" onClick={() => { setActiveProduct(p); window.scrollTo(0,0); setView('productDetail'); }}>
                  <div className="relative aspect-square bg-gray-100 overflow-hidden border-b-2 border-gray-200 group-hover:border-gray-900 transition-colors">
                    <img src={p.img || (p.images && p.images[0])} alt={p.alt} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${p.images && p.images.length > 1 ? 'group-hover:opacity-0' : ''}`} loading="lazy" />
                    {p.images && p.images.length > 1 && <img src={p.images[1]} alt={p.alt} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105" loading="lazy" />}
                    
                    {p.label && (
                      <div className={`absolute top-0 left-0 text-[9px] md:text-[10px] uppercase tracking-widest font-black px-3 py-1.5 z-10 border-b-2 border-r-2 border-gray-900 shadow-sm ${
                        p.label === 'Terbaru' ? 'bg-amber-500 text-gray-900' : 
                        p.label === 'Terlaris' ? 'bg-red-600 text-white' : 
                        'bg-pink-500 text-white'
                      }`}>
                        {p.label}
                      </div>
                    )}

                    <button className="absolute top-3 right-3 z-20 bg-white/90 p-2 border-2 border-transparent rounded-full hover:border-red-500 transition-colors shadow-sm" onClick={(e) => toggleWishlist(e, p.id)} aria-label="Tambah ke wishlist"><Heart size={16} fill={wishlist.includes(p.id) ? 'currentColor' : 'none'} className={wishlist.includes(p.id) ? 'text-amber-500' : 'text-gray-900'} /></button>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between bg-white relative z-10">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{p.type}</p>
                      <h2 className="font-bold text-gray-900 uppercase text-xs leading-snug line-clamp-2">{p.name}</h2>
                    </div>
                    <p className="text-gray-900 font-black tracking-wider mt-3 text-sm">{formatPrice(p.price)}</p>
                  </div>
                </article>
              </FadeIn>
            )})}
          </div>
        ) : (
          <div className="text-center py-24 bg-white border-2 border-gray-200 border-dashed rounded-2xl"><Search size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1} /><h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-2">Pakaian Tidak Ditemukan</h3><p className="text-sm text-gray-500 mb-6">Coba ganti filter warna atau usia anak Bunda.</p><button onClick={() => { setTypeFilter('Semua'); setColorFilter('Semua'); setGenderFilter('Semua'); setAgeFilter('Semua'); }} className="px-8 py-3 bg-gray-900 text-white font-bold uppercase tracking-widest text-xs transition-colors rounded-full shadow-sm hover-magnetic">Reset Filter</button></div>
        )}
      </section>

      {/* PAGINATION NUMBERS */}
      {totalPages > 1 && (
         <div className="flex justify-center gap-2 mt-4 pb-10">
            {[...Array(totalPages)].map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                 className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-black text-sm md:text-base flex items-center justify-center transition-all ${currentPage === i + 1 ? 'bg-gray-900 text-white shadow-md -translate-y-1' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
               >
                 {i + 1}
               </button>
            ))}
         </div>
      )}
    </main>
  );
};

// --- 6.3 PRODUCT DETAIL VIEW (Halaman Spesifikasi Baju) ---