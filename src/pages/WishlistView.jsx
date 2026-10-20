import { SEO } from '../constants/data';
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { auth, db, ADMIN_EMAIL, WA_NUMBER } from '../firebase';
import { 
  ShoppingCart, Heart, ChevronRight, X, Minus, Plus, Star, Send, Package, Pencil, Trash, User
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { formatPrice } from '../constants/data';
import { FadeIn, SizeGuideModal, ColorDropdown, ModernDropdown } from '../components/ui/Modals';

export const WishlistView = ({ setActiveProduct }) => {
  const { wishlist, setView, toggleWishlist, products } = useStore();
  const items = products.filter(p => wishlist.includes(p.id));
  return (
    <main className="min-h-screen py-16 px-4 max-w-6xl mx-auto text-center">
      <SEO title="Wishlist Baju Anak | Kainora Kids" description="Koleksi daftar impian belanja baju anak balita kesukaan Bunda di Kainora Kids." />
      <div className="border-b-4 border-gray-900 pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 text-left"><h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Wishlist Baju Anak</h1><p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tersimpan {items.length} Item</p></div>
      {items.length === 0 ? (
        <div className="text-center py-32 bg-white border-2 border-gray-200 border-dashed rounded-2xl"><Heart size={64} className="mx-auto text-gray-200 mb-6" strokeWidth={1} /><h3 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-3">Belum Ada Impian Baju</h3><button onClick={() => setView('products')} className="px-10 py-4 mt-6 bg-gray-900 text-white font-black uppercase tracking-widest text-xs hover:bg-black transition-colors rounded-full shadow-md hover:-translate-y-1">Mulai Eksplorasi</button></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-left">
          {items.map(p => (
            <article key={p.id} className="bg-white border-2 border-gray-200 hover:border-gray-900 transition-colors cursor-pointer group flex flex-col h-full relative rounded-xl overflow-hidden shadow-sm hover:shadow-md" onClick={() => { setActiveProduct(p); setView('productDetail'); }}>
              <div className="relative aspect-square bg-gray-100 overflow-hidden border-b-2 border-gray-200 group-hover:border-gray-900 transition-colors"><img src={p.img || (p.images && p.images[0])} alt={p.alt} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" /><img src={(p.images && p.images[1]) || p.img} alt={p.alt} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" /><button className="absolute top-3 right-3 z-20 bg-white/90 p-2 border-2 border-transparent rounded-full hover:border-red-500 transition-colors shadow-sm" onClick={(e) => toggleWishlist(e, p.id)}><Heart size={16} fill={wishlist.includes(p.id) ? 'currentColor' : 'none'} className={wishlist.includes(p.id) ? 'text-brand-red' : 'text-gray-900'} /></button></div>
              <div className="p-4 md:p-5 flex-grow flex flex-col justify-between bg-white relative z-10"><div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{p.type}</p><h3 className="font-bold text-gray-900 uppercase text-xs leading-snug line-clamp-2">{p.name}</h3></div><p className="text-gray-900 font-black tracking-wider mt-3 text-sm">{formatPrice(p.price)}</p></div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

// --- 6.6 CART VIEW (Halaman Keranjang) ---