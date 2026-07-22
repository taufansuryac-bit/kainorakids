import { SEO } from '../constants/data';
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { auth, db, ADMIN_EMAIL, WA_NUMBER } from '../firebase';
import { 
  ShoppingCart, Heart, ChevronRight, X, Minus, Plus, Star, Send, Package, Pencil, Trash, User
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { formatPrice } from '../constants/data';
import { FadeIn, SizeGuideModal, ColorDropdown, ModernDropdown, EditProfileModal } from '../components/ui/Modals';

export const ProfileView = () => {
  const { user, setView } = useStore();
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!user?.email) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center max-w-6xl mx-auto">
         <SEO title="Profil Pengguna | Kainora Kids" description="Masuk untuk melihat profil Anda." />
         <User size={100} className="text-gray-200 mb-10" strokeWidth={1}/>
         <h1 className="text-4xl font-black uppercase mb-6 tracking-tighter">Belum Masuk</h1>
         <button onClick={() => setView('home')} className="px-12 py-5 mt-6 bg-gray-900 text-white font-black uppercase border-4 border-gray-900 shadow-solid hover:translate-y-1 transition-all tracking-widest text-sm">Kembali ke Beranda</button>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-16 px-4 max-w-4xl mx-auto text-left">
      <SEO title={`Profil ${user.name} | Kainora Kids`} description="Manajemen profil pengguna Kainora Kids." />
      <button onClick={() => setView('home')} className="font-black mb-10 uppercase text-[10px] tracking-widest flex items-center gap-2 hover:text-amber-500 transition-colors"><ChevronRight className="rotate-180" size={16}/> KEMBALI KE BERANDA</button>
      
      <div className="bg-white border-4 border-gray-900 shadow-solid p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-8 border-b-4 border-gray-900 pb-8 mb-8">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile Avatar" className="w-32 h-32 rounded-full border-4 border-gray-900 object-cover bg-amber-50 shadow-sm" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-amber-100 border-4 border-gray-900 flex items-center justify-center font-black text-4xl uppercase text-gray-900">{user.name.charAt(0)}</div>
          )}
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">{user.name}</h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{user.email}</p>
            <div className="mt-4 inline-block bg-green-100 text-green-700 font-black text-[10px] px-3 py-1 uppercase tracking-widest border-2 border-green-700">Member Aktif</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 border-2 border-gray-200 p-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nomor WhatsApp</p>
            <p className="font-bold text-gray-900">{user.phone || 'Belum diisi'}</p>
          </div>
          <div className="bg-gray-50 border-2 border-gray-200 p-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Alamat Pengiriman Utama</p>
            <p className="font-bold text-gray-900">{user.address || 'Belum diisi'}</p>
          </div>
          <div className="bg-gray-50 border-2 border-gray-200 p-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kode Pos</p>
            <p className="font-bold text-gray-900">{user.kodepos || 'Belum diisi'}</p>
          </div>
        </div>

        <button onClick={() => setIsEditOpen(true)} className="mt-8 bg-gray-900 text-white font-black uppercase text-xs px-8 py-4 border-4 border-gray-900 shadow-solid-sm hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
          <Pencil size={16} /> Edit Profil Saya
        </button>
      </div>
      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </main>
  );
};

// --- 6.10 ORDERS VIEW (Halaman Riwayat Order) ---