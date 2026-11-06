import { SEO } from '../constants/data';
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { db, ADMIN_EMAIL, appId } from '../firebase';
import { ChevronRight, Star, Pencil, Trash, Quote
} from 'lucide-react';
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { ReviewModal } from '../components/ui/Modals';

const reviewSubmissionEnabled = false;

export const AllReviewsView = () => {
  const { user, showToast, setIsAuthModalOpen, setView } = useStore();
  const [organicReviews, setOrganicReviews] = useState([]);
  const [visibleReviewCount, setVisibleReviewCount] = useState(12);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const mergedReviews = organicReviews;
  
  const totalReviewCount = organicReviews.length;

  useEffect(() => {
    if (!user) return; 
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'reviews');
    const unsubscribe = onSnapshot(q, (snapshot) => {
       let fetchedReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       fetchedReviews.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
       setOrganicReviews(fetchedReviews);
    }, (error) => console.error("Error loading all reviews:", error));
    return () => unsubscribe();
  }, [user]);

  const handleDeleteReview = async (reviewId) => {
    try { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'reviews', reviewId)); showToast("Ulasan berhasil dihapus!"); } catch { showToast("Gagal menghapus ulasan."); }
  };

  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
      <SEO title="Ulasan Pelanggan Kainora Kids" description="Baca ulasan pelanggan yang tersimpan untuk koleksi Kainora Kids." keywords="ulasan Kainora Kids, ulasan kaos anak, graphic tee oversize anak" canonicalPath="/?view=allReviews" robots="noindex, follow" />
      <button onClick={() => setView('productDetail')} className="font-black uppercase text-[10px] mb-8 flex items-center gap-2 transition-colors hover:text-brand-red tracking-widest"><ChevronRight className="rotate-180" size={16} strokeWidth={3}/> Kembali ke Produk</button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-4 border-gray-900 pb-4 gap-4">
         <div><h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{totalReviewCount} Ulasan Pelanggan</h1></div>
         <button disabled title="Pengiriman ulasan belum dibuka" className="font-black uppercase text-[10px] md:text-xs hover:bg-amber-400 hover:text-gray-900 flex items-center gap-2 transition-colors border-4 border-gray-900 px-5 py-4 shadow-solid-sm bg-amber-500 text-gray-900"><Star size={16} strokeWidth={3} className="text-gray-900"/> Pengiriman ulasan belum dibuka</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mergedReviews.slice(0, visibleReviewCount).map((r) => {
          const isOwnerOrAdmin = user && (user.email === ADMIN_EMAIL || user.email === r.email);
          return (
            <div key={r.id} className="border-4 border-gray-900 p-6 md:p-8 bg-white shadow-solid-sm relative overflow-hidden flex flex-col justify-between">
              {reviewSubmissionEnabled && isOwnerOrAdmin && !r.isDummy && r.id.length > 5 && (
                <div className="absolute top-4 left-4 flex gap-2 z-20">
                  <button onClick={() => { setEditingReview(r); setIsReviewModalOpen(true); }} className="p-2 bg-amber-100 text-brand-red border-2 border-gray-900 hover:bg-amber-500 hover:text-gray-900 transition-colors"><Pencil size={14}/></button>
                  <button onClick={() => handleDeleteReview(r.id)} className="p-2 bg-red-100 text-red-600 border-2 border-gray-900 hover:bg-red-500 hover:text-white transition-colors"><Trash size={14}/></button>
                </div>
              )}
              <div>
                <Quote size={32} className="text-gray-100 absolute top-4 right-4" />
                <div className="flex text-brand-red mb-4 relative z-10">{[...Array(5)].map((_, j) => <Star key={j} size={16} fill={j < r.rating ? "currentColor" : "none"} strokeWidth={j < r.rating ? 0 : 2} className={j >= r.rating ? "text-gray-300" : ""}/>)}</div>
                <p className="italic text-sm font-bold text-gray-700 leading-loose mb-6 relative z-10">"{r.text.replace(/^"|"$/g, '')}"</p>
              </div>
              <div className="flex items-center gap-3 border-t-2 border-gray-100 pt-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-gray-900 flex items-center justify-center font-black text-xs uppercase shadow-sm text-gray-900">{r.name.charAt(0)}</div>
                <div><p className="font-black text-xs text-gray-900 uppercase tracking-widest">{r.name}</p><p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest truncate">{r.productName || 'Produk Kainora'}</p></div>
              </div>
            </div>
          )
        })}
      </div>
      {visibleReviewCount < mergedReviews.length && (
        <div className="flex justify-center mt-12"><button onClick={() => setVisibleReviewCount(prev => prev + 12)} className="px-8 py-4 bg-white text-gray-900 font-black uppercase tracking-widest text-xs border-4 border-gray-900 shadow-solid hover:-translate-y-1 transition-transform">Muat Lebih Banyak Ulasan</button></div>
      )}
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => { setIsReviewModalOpen(false); setEditingReview(null); }} editData={editingReview} />
    </main>
  );
};

// --- 6.5 WISHLIST VIEW (Halaman Favorit) ---