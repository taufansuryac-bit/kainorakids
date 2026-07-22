import { SEO } from '../constants/data';
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { auth, db, ADMIN_EMAIL, WA_NUMBER, appId } from '../firebase';
import { 
  ShoppingCart, Heart, ChevronRight, X, Minus, Plus, Star, Send, Package, Pencil, Trash, User, Loader2
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { formatPrice } from '../constants/data';
import { FadeIn, SizeGuideModal, ColorDropdown, ModernDropdown } from '../components/ui/Modals';

export const OrdersView = () => {
  const { user, setView } = useStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    
    let q;
    if (user.email === ADMIN_EMAIL) {
        q = collection(db, 'artifacts', appId, 'public', 'data', 'orders');
    } else {
        q = query(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), where('userEmail', '==', user.email));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetchedOrders.sort((a, b) => {
         const timeA = a.createdAt && typeof a.createdAt.toMillis === 'function' ? a.createdAt.toMillis() : 0;
         const timeB = b.createdAt && typeof b.createdAt.toMillis === 'function' ? b.createdAt.toMillis() : 0;
         return timeB - timeA;
      });
      setOrders(fetchedOrders);
      setIsLoading(false);
    }, (error) => {
      console.error("Error loading orders:", error);
      setIsLoading(false); 
    });
    return () => unsubscribe();
  }, [user]);

  if (!user?.email) {
      return (
        <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center max-w-6xl mx-auto">
           <Package size={100} className="text-gray-200 mb-10" strokeWidth={1}/>
           <h1 className="text-4xl font-black uppercase mb-6 tracking-tighter">Belum Masuk</h1>
           <button onClick={() => setView('home')} className="px-12 py-5 mt-6 bg-gray-900 text-white font-black uppercase border-4 border-gray-900 shadow-solid hover:translate-y-1 transition-all tracking-widest text-sm">Kembali ke Beranda</button>
        </main>
      );
  }

  return (
    <main className="min-h-screen py-16 px-4 max-w-4xl mx-auto text-left">
      <SEO title="Riwayat Pesanan | Kainora Kids" description="Cek status riwayat pesanan pakaian anak Anda." />
      <button onClick={() => setView('home')} className="font-black mb-8 uppercase text-[10px] tracking-widest flex items-center gap-2 hover:text-amber-500 transition-colors"><ChevronRight className="rotate-180" size={16}/> KEMBALI KE BERANDA</button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="bg-amber-100 border-4 border-gray-900 p-6 flex flex-col justify-center items-center text-center shadow-solid-sm cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => setView('products')}>
          <h3 className="font-black uppercase tracking-widest text-amber-900 mb-2">Promo Spesial</h3>
          <p className="text-xs font-bold text-amber-700 uppercase">Diskon 20% Koleksi Baru</p>
        </div>
        <div className="bg-indigo-100 border-4 border-gray-900 p-6 flex flex-col justify-center items-center text-center shadow-solid-sm cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => setView('products')}>
          <h3 className="font-black uppercase tracking-widest text-indigo-900 mb-2">Gratis Ongkir</h3>
          <p className="text-xs font-bold text-indigo-700 uppercase">Min. Belanja Rp 200.000</p>
        </div>
      </div>

      <div className="bg-white border-4 border-gray-900 shadow-solid p-8 md:p-12">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 border-b-4 border-gray-900 pb-4">Riwayat Pesanan Bunda</h1>
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 size={32} className="animate-spin text-amber-500"/></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10">
            <Package size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1}/>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-2">Belum Ada Pesanan</h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Yuk mulai belanja baju lucu untuk si kecil!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="border-2 border-gray-200 p-6 flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ID: {order.id}</p>
                  <p className="font-bold text-gray-900 text-sm">{order.items?.length || 0} Item Baju</p>
                  <p className="text-xs text-gray-500 mt-1">Total: {formatPrice(order.totalAmount)}</p>
                </div>
                <div className="flex flex-col items-end justify-center">
                   <span className="bg-amber-100 text-amber-700 font-black text-[10px] px-3 py-1 uppercase tracking-widest border-2 border-amber-700">Diproses</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

// --- 6.11 ADMIN DASHBOARD VIEW (Halaman Khusus Admin) ---