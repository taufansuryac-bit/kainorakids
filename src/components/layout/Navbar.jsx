import React, { useState } from 'react';
import { ShoppingCart, Heart, ChevronRight, Menu, User, Package, Star, LogOut, Sparkles, Loader2, Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { auth, LOGO_URL, ADMIN_EMAIL } from '../../firebase';
import { signOut, signInAnonymously } from 'firebase/auth';
import { cloudAIService } from '../../services/cloudAIService';

export const Navbar = () => {
  const { setView, cart, wishlist, setGlobalGenderFilter, user, showToast, setIsAuthModalOpen } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const nav = (v) => { if (v === 'products') setGlobalGenderFilter('Semua'); setView(v); setIsMobileMenuOpen(false); };
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      showToast("Sampai jumpa lagi! 👋");
      setView('home'); setIsMobileMenuOpen(false); signInAnonymously(auth); 
    });
  };

  const SmartSearchInput = ({ isMobile }) => {
    const { setGlobalSearchState, showToast } = useStore();
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
      e.preventDefault();
      if (!query.trim()) return;
      
      setIsSearching(true);
      try {
        const prompt = `Anda adalah asisten pencarian toko baju anak Kainora Kids.
Tugas Anda adalah mengekstrak niat pencarian pelanggan menjadi 3 filter:
1. "gender": (Pilih salah satu: "Laki-laki", "Perempuan", "Unisex", atau "Semua")
2. "age": (Pilih salah satu: "1-2Y", "3-4Y", "5-6Y", "7-8Y", "9-10Y", atau "Semua")
3. "query": (Kata kunci selain gender dan umur, misal "kaos dinosaurus", "kado", "merah". Jika tidak ada, kosongkan "")

Contoh 1: "kaos lengan pendek buat cowok 3 tahun" -> {"gender": "Laki-laki", "age": "3-4Y", "query": "kaos lengan pendek"}
Contoh 2: "baju bayi perempuan" -> {"gender": "Perempuan", "age": "1-2Y", "query": "baju"}

Kalimat pencarian: "${query}"

Kembalikan HANYA JSON object dengan 3 keys di atas tanpa markdown \`\`\`json.`;

        const text = await cloudAIService.chat([
          { role: 'system', content: 'Anda adalah asisten yang hanya membalas dengan JSON valid.' },
          { role: 'user', content: prompt }
        ], { temperature: 0.3, maxTokens: 100, stream: false });

        let cleaned = text.trim();
        if(cleaned.startsWith('```json')) cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
        if(cleaned.startsWith('```')) cleaned = cleaned.replace(/```/g, '').trim();

        const parsed = JSON.parse(cleaned);

        setGlobalSearchState({
          query: parsed.query || '',
          gender: parsed.gender || 'Semua',
          age: parsed.age || 'Semua'
        });
        
        nav('products');
        if (isMobile) setIsMobileMenuOpen(false);
      } catch (err) {
        console.error(err);
        showToast("Pencarian AI gagal. Coba kata kunci yang lebih singkat.");
        // Fallback pencarian biasa
        setGlobalSearchState({ query: query, gender: 'Semua', age: 'Semua' });
        nav('products');
      } finally {
        setIsSearching(false);
      }
    };

    return (
      <form onSubmit={handleSearch} className={`relative flex items-center w-full ${isMobile ? 'mb-4' : ''}`}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari Pintar AI ✨" 
          className="w-full bg-amber-50 border-2 border-gray-900 rounded-full py-2 pl-4 pr-10 text-xs font-bold outline-none focus:border-amber-500 focus:bg-amber-100 transition-colors placeholder-amber-700/50"
          disabled={isSearching}
        />
        <button type="submit" className="absolute right-2 text-amber-600 hover:text-gray-900" disabled={isSearching}>
          {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        </button>
      </form>
    );
  };

  return (
    <header className="bg-white sticky top-0 z-[1000] border-b-[3px] border-gray-900 shadow-[0_2px_0_0_#111827] w-full">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 h-20 flex justify-between items-center">
        <div className="flex-shrink-0 cursor-pointer flex items-center" onClick={() => nav('home')}>
           <img src={LOGO_URL} alt="Kainora Kids Logo" className="h-6 sm:h-8 md:h-10 w-auto object-contain" />
        </div>
        <nav className="hidden lg:flex items-center space-x-3 xl:space-x-8">
          <button onClick={() => nav('home')} className="font-bold uppercase text-xs xl:text-sm tracking-widest hover:text-amber-500 transition-colors whitespace-nowrap">Beranda</button>
          <button onClick={() => nav('products')} className="font-bold uppercase text-xs xl:text-sm tracking-widest hover:text-amber-500 transition-colors whitespace-nowrap">Produk</button>
          <div className="relative group py-6">
            <button className="font-bold uppercase text-xs xl:text-sm tracking-widest group-hover:text-amber-500 transition-colors flex items-center gap-1 whitespace-nowrap">Marketplace <ChevronRight size={14} className="transform rotate-90 transition-transform group-hover:-rotate-90" /></button>
            <div className="absolute left-0 top-full -mt-2 w-56 bg-white border-4 border-gray-900 shadow-solid opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 flex flex-col translate-y-2 group-hover:translate-y-0">
              <button onClick={() => window.open('https://shopee.co.id', '_blank')} className="text-left font-bold text-xs uppercase p-4 border-b-2 border-gray-100 hover:bg-amber-100 transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-amber-500"/> Shopee</button>
              <button onClick={() => window.open('https://tokopedia.com', '_blank')} className="text-left font-bold text-xs uppercase p-4 hover:bg-amber-100 transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-amber-500"/> Tiktok/Tokopedia</button>
            </div>
          </div>
          <button onClick={() => nav('affiliate')} className="font-bold uppercase text-xs xl:text-sm tracking-widest hover:text-amber-500 transition-colors whitespace-nowrap">Affiliate</button>
          <button onClick={() => nav('blog')} className="font-bold uppercase text-xs xl:text-sm tracking-widest hover:text-amber-500 transition-colors whitespace-nowrap">Blog</button>
        </nav>
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          <button onClick={() => nav('products')} className="lg:hidden font-black uppercase text-[9px] sm:text-[10px] tracking-widest text-gray-900 hover:text-amber-500 transition-colors">Produk</button>
          <button onClick={() => nav('blog')} className="lg:hidden font-black uppercase text-[9px] sm:text-[10px] tracking-widest text-gray-900 hover:text-amber-500 transition-colors">Blog</button>
          <button onClick={() => nav('affiliate')} className="lg:hidden font-black uppercase text-[9px] sm:text-[10px] tracking-widest text-gray-900 hover:text-amber-500 transition-colors">Affiliate</button>
          
          <div className="relative group hidden lg:block py-6">
            <button className="relative hover:text-amber-500 transition-colors flex items-center" aria-label="Search">
              <Search size={20} strokeWidth={2.5} className="md:w-6 md:h-6" />
            </button>
            <div className="absolute right-0 top-full -mt-2 w-72 bg-white border-4 border-gray-900 shadow-solid opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-4 translate-y-2 group-hover:translate-y-0">
               <p className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">Pencarian Pintar AI</p>
               <SmartSearchInput isMobile={false} />
            </div>
          </div>
          <button onClick={() => nav('wishlist')} className="relative" aria-label="Wishlist"><Heart size={20} strokeWidth={2.5} className="md:w-6 md:h-6 hover:text-amber-500 transition-colors" />{wishlist.length > 0 && <span className="absolute -top-2 -right-2 bg-amber-500 text-gray-900 text-[9px] md:text-[10px] font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center border-2 border-gray-900">{wishlist.length}</span>}</button>
          <button onClick={() => nav('cart')} className="relative" aria-label="Keranjang"><ShoppingCart size={20} strokeWidth={2.5} className="md:w-6 md:h-6 hover:text-amber-500 transition-colors" />{cartCount > 0 && <span className="absolute -top-2 -right-2 bg-amber-500 text-gray-900 text-[9px] md:text-[10px] font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center border-2 border-gray-900">{cartCount}</span>}</button>
          {user && user.email ? (
            <div className="relative group py-6 hidden lg:block">
              <div className="flex items-center gap-3 border-l-2 border-gray-200 pl-6 ml-2 cursor-pointer group">
                 {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-gray-900 object-cover group-hover:border-amber-500 transition-colors bg-amber-50" /> : <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-gray-900 flex items-center justify-center font-black text-xs uppercase text-gray-900 group-hover:border-amber-500 transition-colors">{user.name.charAt(0)}</div>}
                 <div className="flex flex-col text-left group-hover:text-amber-500 transition-colors"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Halo {user.nickname || (user.gender === 'ayah' ? 'Ayah' : 'Bunda')},</span><span className="text-xs font-bold text-gray-900 leading-none mt-1 truncate w-24">{user.name}</span></div>
                 <ChevronRight size={14} className="transform rotate-90 transition-transform group-hover:-rotate-90 text-gray-400 group-hover:text-amber-500 ml-1" />
              </div>
              <div className="absolute right-0 top-full w-52 bg-white border-4 border-gray-900 shadow-solid opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 flex flex-col translate-y-2 group-hover:translate-y-0">
                <button onClick={() => nav('profile')} className="text-left font-bold text-xs uppercase p-4 border-b-2 border-gray-100 hover:bg-pink-100 transition-colors flex items-center gap-2"><User size={14} className="text-gray-900"/> Profil Lucu</button>
                <button onClick={() => nav('orders')} className="text-left font-bold text-xs uppercase p-4 border-b-2 border-gray-100 hover:bg-amber-100 transition-colors flex items-center gap-2"><Package size={14} className="text-gray-900"/> Pesanan & Promo</button>
                {user?.email === ADMIN_EMAIL && <button onClick={() => nav('admin')} className="text-left font-bold text-xs uppercase p-4 border-b-2 border-gray-100 hover:bg-indigo-100 transition-colors flex items-center gap-2"><Star size={14} className="text-indigo-600"/> Admin Panel</button>}
                <button onClick={handleSignOut} className="text-left font-bold text-xs uppercase p-4 hover:bg-red-100 text-red-600 transition-colors flex items-center gap-2"><LogOut size={14} /> Logout Akun</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setIsAuthModalOpen(true)} className="hidden lg:block bg-gray-900 text-white border-2 border-gray-900 px-3 py-1.5 xl:px-5 xl:py-2 font-black uppercase tracking-widest text-[10px] hover:bg-amber-500 hover:text-gray-900 transition-colors ml-2 xl:ml-4 shadow-solid-sm whitespace-nowrap">Masuk / Daftar</button>
          )}
          <button className="lg:hidden ml-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu Mobile"><Menu size={24} className="md:w-7 md:h-7" strokeWidth={2.5} /></button>
        </div>
      </div>
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden bg-white border-b-4 border-gray-900 p-6 shadow-xl w-full`}>
        <div className="flex flex-col space-y-6">
          <SmartSearchInput isMobile={true} />
          {user && user.email ? (
             <div className="border-b-2 border-gray-100 pb-4 mb-2">
               <div className="flex items-center gap-3 mb-4">
                  {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-gray-900 object-cover bg-amber-50" /> : <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-gray-900 flex items-center justify-center font-black text-sm uppercase text-gray-900">{user.name.charAt(0)}</div>}
                  <div className="flex flex-col text-left"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Halo {user.nickname || (user.gender === 'ayah' ? 'Ayah' : 'Bunda')},</span><span className="text-sm font-bold text-gray-900 mt-1">{user.name}</span></div>
               </div>
               <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => nav('profile')} className="flex items-center justify-center gap-2 text-[10px] font-black uppercase border-2 border-gray-900 p-2 hover:bg-pink-100"><User size={14}/> Profil</button>
                 <button onClick={() => nav('orders')} className="flex items-center justify-center gap-2 text-[10px] font-black uppercase border-2 border-gray-900 p-2 hover:bg-amber-100"><Package size={14}/> Pesanan</button>
                 {user?.email === ADMIN_EMAIL && <button onClick={() => nav('admin')} className="col-span-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase border-2 border-gray-900 p-2 hover:bg-indigo-100"><Star size={14}/> Admin Panel</button>}
                 <button onClick={handleSignOut} className="col-span-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase border-2 border-red-500 text-red-600 p-2 hover:bg-red-50 mt-1"><LogOut size={14}/> Logout</button>
               </div>
             </div>
          ) : (
             <button onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }} className="w-full bg-gray-900 text-white border-2 border-gray-900 px-5 py-3 font-black uppercase tracking-widest text-xs hover:bg-amber-500 hover:text-gray-900 transition-colors shadow-solid-sm mb-2">Masuk / Daftar</button>
          )}
          <button onClick={() => nav('home')} className="w-full text-left font-black uppercase text-sm">Beranda</button>
          <button onClick={() => nav('products')} className="w-full text-left font-black uppercase text-sm">Produk</button>
          <button onClick={() => nav('affiliate')} className="w-full text-left font-black uppercase text-sm">Affiliate</button>
          <div className="pt-2 pb-2">
            <p className="block w-full text-left font-black uppercase text-sm mb-4 text-gray-400">Marketplace</p>
            <div className="pl-4 space-y-4 border-l-4 border-amber-500">
              <button onClick={() => window.open('https://shopee.co.id', '_blank')} className="block w-full text-left font-bold uppercase text-xs">Shopee</button>
              <button onClick={() => window.open('https://tokopedia.com', '_blank')} className="block w-full text-left font-bold uppercase text-xs">Tiktok/Tokopedia</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
