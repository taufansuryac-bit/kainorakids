import { SEO } from '../constants/data';
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { auth, db, ADMIN_EMAIL, WA_NUMBER, appId } from '../firebase';
import { 
  ShoppingCart, Heart, ChevronRight, X, Minus, Plus, Star, Send, Package, Pencil, Trash, User, Bot, Check
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { formatPrice } from '../constants/data';
import { FadeIn, SizeGuideModal, ColorDropdown, ModernDropdown, AdminProductModal, ReviewModal } from '../components/ui/Modals';

export const AdminDashboardView = () => {
  const { user, setView, products, showToast, aiSizeChart, setAiSizeChart } = useStore();
  const [allReviews, setAllReviews] = useState([]);
  const [promos, setPromos] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // --- State Baru: Filter & Pagination Admin ---
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    if (!user) return;
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'reviews');
    // Fetch Promos
    const qPromos = collection(db, 'artifacts', appId, 'public', 'data', 'promos');
    const unsubPromos = onSnapshot(qPromos, snap => {
       setPromos(snap.docs.map(d => ({id:d.id, ...d.data()})));
    });

    const unsub = onSnapshot(q, snap => {
       let fetched = snap.docs.map(d => ({id:d.id, ...d.data()}));
       fetched.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
       setAllReviews(fetched);
    }, (error) => console.error("Error fetching reviews:", error));
    return () => { unsub(); unsubPromos(); };
  }, [user]);

  const handleDeleteProduct = async (id) => {
    try { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', String(id))); showToast("Produk berhasil dihapus!"); } 
    catch(err) { showToast("Gagal menghapus produk."); }
  };

  const handleDeleteReview = async (id) => {
    try { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'reviews', String(id))); showToast("Ulasan berhasil dihapus!"); } 
    catch(err) { showToast("Gagal menghapus ulasan."); }
  };

  // --- Logika Filter & Pagination ---
  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'Semua') return products;
    return products.filter(p => p.type === categoryFilter);
  }, [products, categoryFilter]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset ke halaman 1 jika admin mengganti filter kategori
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter]);

  return (
    <main className="min-h-screen py-16 px-4 max-w-7xl mx-auto text-left">
      <SEO title="Admin Dashboard | Kainora Kids" description="Panel kontrol admin." />
      <button onClick={() => setView('home')} className="font-black mb-8 uppercase text-[10px] tracking-widest flex items-center gap-2 hover:text-indigo-500 transition-colors"><ChevronRight className="rotate-180" size={16}/> KEMBALI KE BERANDA</button>
      
      <div className="bg-white border-4 border-gray-900 shadow-solid p-6 md:p-12 mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-6">Panel Admin</h1>
        <div className="flex border-b-4 border-gray-900 mb-8">
          <button onClick={()=>setActiveTab('products')} className={`flex-1 font-black uppercase text-xs py-4 transition-colors ${activeTab === 'products' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-500'}`}>Katalog Produk</button>
          <button onClick={()=>setActiveTab('reviews')} className={`flex-1 font-black uppercase text-xs py-4 transition-colors ${activeTab === 'reviews' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-500'}`}>Ulasan</button>
          <button onClick={()=>setActiveTab('promos')} className={`flex-1 font-black uppercase text-xs py-4 transition-colors ${activeTab === 'promos' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-500'}`}>Kode Promo</button>
          <button onClick={()=>setActiveTab('ai')} className={`flex-1 font-black uppercase text-xs py-4 transition-colors ${activeTab === 'ai' ? 'bg-gray-900 text-brand-red' : 'hover:bg-gray-100 text-gray-500'}`}>Pengaturan AI</button>
        </div>

        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="font-black text-xl uppercase">Daftar Produk ({filteredProducts.length})</h2>
              
              {/* Filter Kategori & Tombol Tambah */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select 
                  value={categoryFilter} 
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border-2 border-gray-900 p-2 text-[10px] font-black uppercase focus:border-amber-500 cursor-pointer bg-gray-50"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Kaos">Kaos</option>
                  <option value="Dress">Dress</option>
                  <option value="Setelan">Setelan</option>
                  <option value="Jaket">Jaket</option>
                  <option value="Celana">Celana</option>
                  <option value="Kemeja">Kemeja</option>
                </select>
                <button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="bg-amber-500 text-gray-900 px-4 py-2 font-black uppercase text-[10px] border-2 border-gray-900 shadow-sm hover:-translate-y-1 flex items-center gap-2"><Plus size={14}/> Tambah Baju</button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
               <div className="text-center py-10 bg-gray-50 border-2 border-gray-200 border-dashed">
                 <p className="text-sm font-black text-gray-500 uppercase tracking-widest">Kategori ini masih kosong.</p>
               </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 pt-3">
                  {currentProducts.map(p => (
                    <div key={p.id} className="border-2 border-gray-200 flex flex-col relative group bg-white hover:border-gray-900 transition-colors mt-2">
                       <div className="absolute -top-3 -left-3 bg-amber-500 text-gray-900 border-2 border-gray-900 font-black text-[10px] w-8 h-8 flex items-center justify-center z-20 shadow-sm" title="Nomor Urutan Tampil">
                         {p.order !== undefined ? p.order : 99}
                       </div>
                       <div className="relative aspect-square overflow-hidden bg-gray-100 border-b-2 border-gray-200 group-hover:border-gray-900">
                          <img src={p.img || (p.images && p.images[0])} className="w-full h-full object-cover" alt="Product thumbnail" />
                       </div>
                       <div className="p-3 flex-1 flex flex-col justify-between">
                         <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">{p.type}</p>
                         <h3 className="font-bold text-xs uppercase line-clamp-1">{p.name}</h3>
                         <p className="font-black text-brand-red mt-2 text-sm">{formatPrice(p.price)}</p>
                       </div>
                       <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }} className="p-2 bg-amber-100 text-brand-red border border-gray-900 hover:bg-amber-500 hover:text-gray-900 shadow-sm"><Pencil size={12}/></button>
                         <button onClick={() => handleDeleteProduct(p.id)} className="p-2 bg-red-100 text-red-600 border border-gray-900 hover:bg-red-500 hover:text-white shadow-sm"><Trash size={12}/></button>
                       </div>
                    </div>
                  ))}
                </div>

                {/* Kontrol Pagination */}
                {totalPages > 1 && (
                   <div className="flex justify-center gap-2 mt-8 border-t-2 border-gray-100 pt-6">
                      {[...Array(totalPages)].map((_, i) => (
                         <button 
                           key={i} 
                           onClick={() => setCurrentPage(i + 1)}
                           className={`w-8 h-8 border-2 border-gray-900 font-black text-xs flex items-center justify-center transition-all ${currentPage === i + 1 ? 'bg-gray-900 text-white shadow-solid-sm -translate-y-1' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                         >
                           {i + 1}
                         </button>
                      ))}
                   </div>
                )}
              </>
            )}
          </div>
        )}

        
        {activeTab === 'promos' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-xl uppercase">Daftar Kode Promo ({promos.length})</h2>
              <button onClick={async () => {
                const code = window.prompt("Masukkan Kode Promo (Tanpa Spasi, cth: DISKON20):");
                if(!code) return;
                const typeInput = window.prompt("Tipe Diskon? Ketik '1' untuk Rupiah, Ketik '2' untuk Persen (%):");
                if(typeInput !== '1' && typeInput !== '2') return;
                const type = typeInput === '1' ? 'fixed' : 'percent';
                const value = parseInt(window.prompt(`Masukkan Nilai Diskon (cth: ${type === 'fixed' ? '50000' : '20'}):`));
                if(!value || isNaN(value)) return;
                
                try {
                  await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'promos'), { code: code.toUpperCase(), type, value, createdAt: serverTimestamp() });
                  showToast("Promo berhasil dibuat!");
                } catch(err) { showToast("Gagal membuat promo."); }
              }} className="bg-amber-500 text-gray-900 px-4 py-2 font-black uppercase text-[10px] border-2 border-gray-900 shadow-sm hover:-translate-y-1 flex items-center gap-2"><Plus size={14}/> Buat Promo Baru</button>
            </div>
            
            {promos.length === 0 ? (
               <div className="text-center py-10 bg-gray-50 border-2 border-gray-200 border-dashed">
                 <p className="text-sm font-black text-gray-500 uppercase tracking-widest">Belum ada promo yang aktif.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {promos.map(pr => (
                   <div key={pr.id} className="border-2 border-gray-900 p-6 flex flex-col relative bg-amber-50">
                     <button onClick={async () => {
                       if(window.confirm("Hapus promo ini?")) {
                         try { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'promos', pr.id)); showToast("Promo dihapus."); } catch(err){}
                       }
                     }} className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 border border-gray-900 hover:bg-red-500 hover:text-white"><Trash size={12}/></button>
                     <h3 className="text-2xl font-black text-gray-900 tracking-widest mb-1">{pr.code}</h3>
                     <p className="text-xs font-bold text-gray-600 uppercase">Potongan: {pr.type === 'percent' ? `${pr.value}%` : formatPrice(pr.value)}</p>
                   </div>
                 ))}
               </div>
            )}
          </div>
        )}


        {activeTab === 'reviews' && (
          <div>
            <h2 className="font-black text-xl uppercase mb-6">Semua Ulasan ({allReviews.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allReviews.map(r => (
                <div key={r.id} className="border-2 border-gray-200 p-6 flex flex-col relative">
                  <div className="absolute top-2 right-2 flex gap-1 z-10">
                     <button onClick={() => { setEditingReview(r); setIsReviewModalOpen(true); }} className="p-1.5 bg-amber-100 text-brand-red border border-gray-900 hover:bg-amber-500 hover:text-gray-900"><Pencil size={12}/></button>
                     <button onClick={() => handleDeleteReview(r.id)} className="p-1.5 bg-red-100 text-red-600 border border-gray-900 hover:bg-red-500 hover:text-white"><Trash size={12}/></button>
                  </div>
                  <div>
                    <div className="flex text-brand-red mb-2 mt-4">{[...Array(5)].map((_, j) => <Star key={j} size={12} fill={j < r.rating ? "currentColor" : "none"} className={j >= r.rating ? "text-gray-300" : ""}/>)}</div>
                    <p className="text-sm font-medium text-gray-700 mb-4 line-clamp-3">"{r.text.replace(/"/g, '')}"</p>
                  </div>
                  <div className="border-t-2 border-gray-100 pt-3"><p className="font-black text-[10px] uppercase">{r.name}</p><p className="text-[9px] font-bold text-gray-400 uppercase truncate">Produk: {r.productName}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="font-black text-xl uppercase text-brand-red flex items-center gap-2"><Bot size={24} /> Konfigurasi AI (Gemini)</h2>
                <p className="text-xs font-bold text-gray-500 mt-1">Data di bawah ini akan dibaca secara real-time oleh Kainora AI dan Kalkulator Ukuran.</p>
              </div>
              <button onClick={async () => {
                try {
                  await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'config', 'aiSettings'), { sizeChart: aiSizeChart }, { merge: true });
                  showToast("Pengaturan AI berhasil disimpan! ✨");
                } catch(err) { showToast("Gagal menyimpan pengaturan AI."); }
              }} className="bg-gray-900 text-white px-6 py-3 font-black uppercase text-xs border-2 border-gray-900 shadow-sm hover:bg-amber-500 hover:text-gray-900 transition-colors flex items-center gap-2"><Check size={16}/> Simpan Data AI</button>
            </div>
            
            <div className="bg-amber-50 p-6 border-4 border-amber-500">
               <label className="block text-xs font-black uppercase text-amber-900 mb-2">Panduan Ukuran (Size Chart) untuk AI</label>
               <p className="text-[10px] font-bold text-amber-700 mb-4">Gunakan format teks biasa. Semakin detail data ini, semakin akurat AI menebak ukuran anak pengunjung.</p>
               <textarea 
                 value={aiSizeChart || ''} 
                 onChange={(e) => setAiSizeChart(e.target.value)} 
                 className="w-full border-2 border-gray-900 p-4 font-bold text-sm outline-none focus:border-amber-500 resize-none min-h-[200px]" 
                 placeholder="Tinggi 90-100cm (Size S), Tinggi 100-110cm (Size M)..." 
               />
            </div>
          </div>
        )}
      </div>

      <AdminProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} editData={editingProduct} />
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => { setIsReviewModalOpen(false); setEditingReview(null); }} editData={editingReview} />
    </main>
  );
};
