import { SEO } from '../constants/data';
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { auth, db, ADMIN_EMAIL, WA_NUMBER } from '../firebase';
import { 
  ShoppingCart, Heart, ChevronRight, X, Minus, Plus, Star, Send, Package, Pencil, Trash, User
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { formatPrice } from '../constants/data';
import { SplitReveal } from '../components/motion/KineticText';
import { CheckerStrip } from '../components/neo/Checker';
import { Cloud, Burst } from '../components/neo/Stickers';

export const CartView = () => {
  const { cart, setView, updateCartQty, removeFromCart } = useStore();
  const cartTotal = cart.reduce((s, item) => s + (item.price * item.qty), 0);
  const cartCount = cart.reduce((s, item) => s + item.qty, 0);

  if (cart.length === 0) return (
    <main className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-4 text-center">
      <SEO title="Keranjang Belanja Kainora Kids" description="Keranjang belanja kaos anak premium." />
      <div className="relative mb-6">
        <Cloud width={190} className="animate-bob" />
        <Burst fill="var(--yellow)" className="absolute -right-10 -top-6 h-20 w-20 rotate-12" textClass="text-[0.55rem]">YUK<br />BELANJA</Burst>
      </div>
      <h1 className="display mb-6 text-[clamp(2.4rem,8vw,5.5rem)]">Keranjang<br />Kosong</h1>
      <button onClick={() => setView('products')} className="neo-btn">Cek Katalog Produk</button>
    </main>
  );
  return (
    <main className="min-h-screen py-24 px-4 max-w-6xl mx-auto">
      <SEO title="Keranjang Belanja Pakaian Anak | Kainora Kids" description="Selesaikan pesanan pakaian anak premium dari Kainora Kids." />
      <h1 className="display mb-6 text-[clamp(2.4rem,7.5vw,6rem)]"><SplitReveal text={`Keranjang Pakaian (${cartCount})`} /></h1>
      <div className="mb-10 md:mb-14"><CheckerStrip size={12} /></div>
      <div className="flex flex-col lg:flex-row gap-8 md:gap-16">
        <div className="lg:w-2/3 bg-white border-4 border-gray-900 p-4 md:p-8 shadow-solid-sm space-y-6 md:space-y-8">
          {cart.map(item => (
            <div key={item.cartId} className="flex gap-3 md:gap-8 items-center border-b-2 border-gray-100 pb-6 md:pb-8 last:border-0 last:pb-0">
              <img src={item.img || (item.images && item.images[0])} className="w-20 h-20 md:w-32 md:h-32 object-cover border-2 border-gray-900 shadow-sm" alt={item.alt} />
              <div className="flex-1 text-left">
                <h3 className="font-black text-[10px] md:text-base uppercase tracking-tight line-clamp-2 leading-snug">{item.name}</h3>
                <p className="text-[9px] md:text-xs text-gray-400 font-black mt-1 uppercase tracking-widest">SIZE: {item.size}</p>
                <p className="font-black text-xs text-gray-900 tracking-widest mt-2 md:hidden">{formatPrice(item.price * item.qty)}</p>
              </div>
              <div className="flex flex-col md:flex-row items-end md:items-center gap-3 md:gap-6">
                <div className="flex items-center border-2 border-gray-900 bg-white h-8 md:h-12"><button className="px-2 md:px-3 h-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center" onClick={() => updateCartQty(item.cartId, -1)}><Minus size={14} className="md:w-[18px] md:h-[18px]" strokeWidth={3}/></button><span className="w-6 md:w-10 text-center font-black text-sm md:text-lg text-gray-900">{item.qty}</span><button className="px-2 md:px-3 h-full hover:bg-gray-100 transition-colors text-gray-900 flex items-center justify-center" onClick={() => updateCartQty(item.cartId, 1)}><Plus size={14} className="md:w-[18px] md:h-[18px]" strokeWidth={3}/></button></div>
                <p className="font-black text-base text-gray-900 tracking-widest w-28 text-right hidden md:block">{formatPrice(item.price * item.qty)}</p>
                <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-white hover:bg-red-500 transition-colors p-1.5 md:p-2 border-2 border-transparent hover:border-red-600 rounded-none"><Trash size={16} className="md:w-6 md:h-6"/></button>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:w-1/3 bg-white border-4 border-gray-900 p-6 md:p-10 shadow-solid h-fit sticky top-32">
          <h3 className="font-black text-2xl uppercase mb-8 border-b-4 border-gray-900 pb-4 tracking-tighter">Total Belanja</h3>
          <div className="flex justify-between items-center mb-10 font-black text-xl uppercase tracking-tighter"><span>Subtotal</span><span className="text-brand-red">{formatPrice(cartTotal)}</span></div>
          <button onClick={() => setView('checkout')} className="w-full bg-amber-500 text-gray-900 font-black py-5 uppercase text-base border-4 border-gray-900 shadow-solid hover:translate-y-1 transition-all tracking-widest">Lanjut Pembayaran</button>
        </div>
      </div>
    </main>
  );
};

// --- 6.7 CHECKOUT VIEW (Halaman Formulir & Pesan WA) ---