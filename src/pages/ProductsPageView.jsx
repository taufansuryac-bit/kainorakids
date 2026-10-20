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
import { ColorDropdown, ModernDropdown } from '../components/ui/Modals';
import { ProductCard } from '../components/neo/ProductCard';
import { CheckerStrip } from '../components/neo/Checker';
import { SplitReveal } from '../components/motion/KineticText';

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

  const openProduct = (prod) => { setActiveProduct(prod); window.scrollTo(0, 0); setView('productDetail'); };

  return (
    <main className="min-h-screen pb-12">
      <SEO title="Katalog Baju Anak Premium 2026 — Kaos, Dress & Setelan | Kainora Kids" description="Jelajahi koleksi lengkap baju anak premium Kainora Kids. Kaos anak laki-laki, dress anak perempuan, setelan unisex bahan 100% katun tebal, adem, ramah kulit sensitif. Korean style oversize boxy mulai Rp89.000." keywords="katalog baju anak premium, baju anak murah bagus, kaos anak laki-laki premium, dress anak perempuan Korean style, setelan anak katun adem, baju anak oversize boxy, baju anak estetik minimalis 2026, baju anak ramah kulit sensitif" image="https://kainorakids.com/link-logo.jpg" url="https://kainorakids.com/?view=products" type="website" />

      {/* JSON-LD ItemList Schema — Google Shopping */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema(filtered)) }} />

      <header className="relative overflow-hidden border-b-[3px] border-ink bg-brand-teal">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'radial-gradient(var(--ink) 1.2px, transparent 1.7px)', backgroundSize: '14px 14px' }} />
        <div className="relative mx-auto flex max-w-[1500px] flex-col justify-between gap-5 px-4 pb-8 pt-10 sm:px-6 md:flex-row md:items-end lg:px-10">
          <h1 className="display text-[clamp(2.8rem,10.5vw,9rem)]">
            <SplitReveal text="Katalog" className="block" />
            <SplitReveal text="Pakaian" className="block text-brand-yellow [-webkit-text-stroke:0.022em_var(--ink)] [text-shadow:0.04em_0.04em_0_var(--ink)]" delay={0.2} />
          </h1>
          <p className="neo-pill bg-paper">Menampilkan {filtered.length} Model Baju</p>
        </div>
        <CheckerStrip size={12} />
      </header>

      {/* FILTER BAR */}
      <div className="sticky top-[72px] z-40 w-full border-b-[3px] border-ink bg-cream/95 py-2 backdrop-blur-md sm:top-[82px]">
        <div className="mx-auto max-w-[1500px] px-2 sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-center gap-1 md:gap-2">
             <ModernDropdown label="Kategori" value={typeFilter} options={['Semua', 'Kaos', 'Dress', 'Setelan', 'Jaket', 'Kemeja', 'Celana']} onChange={(v) => {setTypeFilter(v); setCurrentPage(1);}} />
             <ModernDropdown label="Jenis" value={genderFilter} options={['Semua', 'Laki-laki', 'Perempuan']} onChange={(v) => {setGenderFilter(v); setCurrentPage(1);}} />
             <ModernDropdown label="Usia" value={ageFilter} options={ages} onChange={(v) => {setAgeFilter(v); setCurrentPage(1);}} />
             <ColorDropdown value={colorFilter} options={COLOR_SWATCHES} onChange={(v) => {setColorFilter(v); setCurrentPage(1);}} />

             <div className="mx-2 hidden h-6 w-[3px] shrink-0 bg-ink md:block"></div>

             <ModernDropdown label="Urutkan" value={sortOrder} options={['Terbaru', 'Terlaris', 'Paling Disukai']} onChange={(v) => {setSortOrder(v); setCurrentPage(1);}} />

             <div className="mx-2 hidden h-6 w-[3px] shrink-0 bg-ink md:block"></div>

             <div className="relative mt-2 flex-grow md:mt-0 md:max-w-xs">
               <input
                 type="text"
                 placeholder="Cari Baju..."
                 aria-label="Cari baju"
                 value={searchQuery}
                 onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                 className="w-full rounded-full border-[3px] border-ink bg-paper py-2 pl-10 pr-9 text-xs font-extrabold uppercase tracking-wide outline-none transition-colors placeholder:text-ink/45 focus:bg-brand-yellow"
               />
               <Search size={15} strokeWidth={3} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
               {searchQuery && <button onClick={() => {setSearchQuery(''); setCurrentPage(1);}} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Hapus pencarian"><X size={15} strokeWidth={3} /></button>}
             </div>
          </div>
        </div>
      </div>

      <section className="mx-auto w-full max-w-[1500px] px-3 py-8 sm:px-6 lg:px-10">
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 text-left sm:gap-5 md:grid-cols-4 md:gap-6">
            {currentProducts.map((p, idx) => (
              <ProductCard
                key={p.id}
                product={p}
                index={idx}
                headingLevel="h2"
                onOpen={openProduct}
                wishlisted={wishlist.includes(p.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="neo-panel bg-paper py-20 text-center shadow-solid-sm">
            <Search size={48} className="mx-auto mb-4" strokeWidth={2.5} />
            <h3 className="display mb-2 text-3xl">Pakaian Tidak Ditemukan</h3>
            <p className="mb-6 text-sm font-semibold">Coba ganti filter warna atau usia anak Bunda.</p>
            <button onClick={() => { setTypeFilter('Semua'); setColorFilter('Semua'); setGenderFilter('Semua'); setAgeFilter('Semua'); }} className="neo-btn neo-btn--ink">Reset Filter</button>
          </div>
        )}
      </section>

      {/* PAGINATION NUMBERS */}
      {totalPages > 1 && (
         <nav className="mt-2 flex flex-wrap justify-center gap-2 px-3 pb-10" aria-label="Halaman katalog">
            {[...Array(totalPages)].map((_, i) => (
               <button
                 key={i}
                 onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                 aria-current={currentPage === i + 1 ? 'page' : undefined}
                 className={`font-arcade grid h-11 w-11 place-items-center rounded-full border-[3px] border-ink text-sm transition-transform md:h-12 md:w-12 ${currentPage === i + 1 ? 'bg-brand-yellow shadow-solid-sm -translate-y-1' : 'bg-paper hover:-translate-y-1 hover:bg-brand-pink'}`}
               >
                 {i + 1}
               </button>
            ))}
         </nav>
      )}
    </main>
  );
};

// --- 6.3 PRODUCT DETAIL VIEW (Halaman Spesifikasi Baju) ---