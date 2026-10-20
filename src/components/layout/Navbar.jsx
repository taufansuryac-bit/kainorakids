import React, { useEffect, useRef, useState } from 'react';
import { ShoppingCart, Heart, ChevronDown, Menu, X, User, Package, Star, LogOut, Sparkles, Loader2, Search, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { auth, LOGO_URL, ADMIN_EMAIL } from '../../firebase';
import { signOut, signInAnonymously } from 'firebase/auth';
import { cloudAIService } from '../../services/cloudAIService';
import { TextRoll } from '../motion/KineticText';
import { CheckerStrip } from '../neo/Checker';

/** Pencarian pintar AI — dipisah dari Navbar agar input tidak ter-remount tiap render. */
const SmartSearchInput = ({ isMobile, onNavigate }) => {
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
      if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
      if (cleaned.startsWith('```')) cleaned = cleaned.replace(/```/g, '').trim();

      const parsed = JSON.parse(cleaned);

      setGlobalSearchState({
        query: parsed.query || '',
        gender: parsed.gender || 'Semua',
        age: parsed.age || 'Semua'
      });

      onNavigate('products');
    } catch (err) {
      console.error(err);
      showToast("Pencarian AI gagal. Coba kata kunci yang lebih singkat.");
      // Fallback pencarian biasa
      setGlobalSearchState({ query: query, gender: 'Semua', age: 'Semua' });
      onNavigate('products');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative flex w-full items-center ${isMobile ? 'mb-2' : ''}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari Pintar AI ✨"
        aria-label="Pencarian pintar AI"
        className="w-full rounded-full border-[3px] border-ink bg-brand-yellow/60 py-2.5 pl-4 pr-11 text-xs font-extrabold uppercase tracking-wide text-ink outline-none transition-colors placeholder:text-ink/50 focus:bg-brand-yellow"
        disabled={isSearching}
      />
      <button type="submit" className="absolute right-3 text-ink hover:text-brand-red" disabled={isSearching} aria-label="Cari">
        {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
      </button>
    </form>
  );
};

const NAV = [
  { key: 'home', label: 'Beranda', views: ['home'] },
  { key: 'products', label: 'Produk', views: ['products', 'productDetail'] },
  { key: 'affiliate', label: 'Affiliate', views: ['affiliate'] },
  { key: 'blog', label: 'Blog', views: ['blog'] },
];

const CountDot = ({ n }) => (n > 0 ? (
  <span className="absolute -right-2.5 -top-2.5 grid h-5 min-w-5 place-items-center rounded-full border-[2.5px] border-ink bg-brand-red px-1 text-[10px] font-black leading-none text-paper">{n}</span>
) : null);

export const Navbar = () => {
  const { view, setView, cart, wishlist, setGlobalGenderFilter, user, showToast, setIsAuthModalOpen } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(80);
  const barRef = useRef(null);
  const nav = (v) => { if (v === 'products') setGlobalGenderFilter('Semua'); setView(v); setIsMobileMenuOpen(false); };
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const isMember = !!(user && user.email);

  useEffect(() => {
    if (isMobileMenuOpen && barRef.current) setMenuTop(Math.round(barRef.current.getBoundingClientRect().bottom + 10));
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      showToast("Sampai jumpa lagi! 👋");
      setView('home'); setIsMobileMenuOpen(false); signInAnonymously(auth);
    });
  };

  const linkCls = (active) =>
    `roll-host relative rounded-full px-3.5 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] transition-colors xl:px-4 ${active ? 'bg-brand-yellow ring-[3px] ring-ink' : 'hover:bg-ink hover:text-paper'}`;

  return (
    <header className="sticky top-0 z-[1000] w-full px-2.5 pt-2.5 sm:px-4 sm:pt-3">
      <div ref={barRef} className="mx-auto flex h-[60px] max-w-[1600px] items-center justify-between gap-2 rounded-full border-[3px] border-ink bg-paper pl-2 pr-2 shadow-solid-sm sm:h-[68px] sm:pl-2.5 sm:pr-3">
        {/* Logo */}
        <button onClick={() => nav('home')} className="roll-host flex shrink-0 items-center gap-2.5 rounded-full" aria-label="Kainora Kids — ke beranda">
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border-[3px] border-ink bg-brand-yellow sm:h-12 sm:w-12">
            <img src={LOGO_URL} alt="" className="h-6 w-6 object-contain sm:h-7 sm:w-7" />
          </span>
          <span className="display hidden text-[1.15rem] leading-none sm:block">
            <TextRoll>KAINORA</TextRoll>
          </span>
        </button>

        {/* Menu desktop */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {NAV.slice(0, 2).map((n) => (
            <button key={n.key} onClick={() => nav(n.key)} className={linkCls(n.views.includes(view))} aria-current={n.views.includes(view) ? 'page' : undefined}>
              <TextRoll>{n.label}</TextRoll>
            </button>
          ))}
          <div className="group relative">
            <button className={`${linkCls(false)} inline-flex items-center gap-1`} aria-haspopup="menu">
              <TextRoll>Marketplace</TextRoll> <ChevronDown size={14} strokeWidth={3} className="transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-0 top-full z-50 w-60 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="neo-panel overflow-hidden bg-paper shadow-solid">
                <button onClick={() => window.open('https://shopee.co.id', '_blank')} className="flex w-full items-center justify-between border-b-[3px] border-ink p-4 text-left text-xs font-black uppercase tracking-wider transition-colors hover:bg-brand-yellow">
                  Shopee <ArrowUpRight size={16} strokeWidth={3} />
                </button>
                <button onClick={() => window.open('https://tokopedia.com', '_blank')} className="flex w-full items-center justify-between p-4 text-left text-xs font-black uppercase tracking-wider transition-colors hover:bg-brand-pink">
                  TikTok / Tokopedia <ArrowUpRight size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
          {NAV.slice(2).map((n) => (
            <button key={n.key} onClick={() => nav(n.key)} className={linkCls(n.views.includes(view))} aria-current={n.views.includes(view) ? 'page' : undefined}>
              <TextRoll>{n.label}</TextRoll>
            </button>
          ))}
        </nav>

        {/* Aksi */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <div className="group relative hidden lg:block">
            <button className="grid h-11 w-11 place-items-center rounded-full border-[3px] border-transparent transition-colors hover:border-ink hover:bg-brand-yellow" aria-label="Cari produk">
              <Search size={20} strokeWidth={2.75} />
            </button>
            <div className="invisible absolute right-0 top-full z-50 w-80 pt-3 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="neo-panel bg-paper p-4 shadow-solid">
                <p className="mb-3 text-[0.68rem] font-black uppercase tracking-[0.18em]">Pencarian Pintar AI</p>
                <SmartSearchInput isMobile={false} onNavigate={nav} />
              </div>
            </div>
          </div>

          <button onClick={() => nav('wishlist')} className="relative grid h-10 w-10 place-items-center rounded-full border-[3px] border-transparent transition-colors hover:border-ink hover:bg-brand-pink sm:h-11 sm:w-11" aria-label={`Wishlist (${wishlist.length})`}>
            <Heart size={20} strokeWidth={2.75} />
            <CountDot n={wishlist.length} />
          </button>
          <button onClick={() => nav('cart')} className="relative grid h-10 w-10 place-items-center rounded-full border-[3px] border-transparent transition-colors hover:border-ink hover:bg-brand-teal sm:h-11 sm:w-11" aria-label={`Keranjang (${cartCount})`}>
            <ShoppingCart size={20} strokeWidth={2.75} />
            <CountDot n={cartCount} />
          </button>

          {isMember ? (
            <div className="group relative hidden lg:block">
              <button className="flex items-center gap-2.5 rounded-full border-[3px] border-ink bg-brand-yellow py-1 pl-1 pr-3.5 transition-transform hover:-translate-y-0.5" aria-haspopup="menu">
                {user.photoURL
                  ? <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full border-[3px] border-ink object-cover" />
                  : <span className="grid h-8 w-8 place-items-center rounded-full border-[3px] border-ink bg-paper text-xs font-black uppercase">{(user.name || 'B').charAt(0)}</span>}
                <span className="text-left leading-none">
                  <span className="block text-[9px] font-black uppercase tracking-widest opacity-70">Halo {user.nickname || (user.gender === 'ayah' ? 'Ayah' : 'Bunda')},</span>
                  <span className="mt-0.5 block w-24 truncate text-xs font-extrabold">{user.name}</span>
                </span>
              </button>
              <div className="invisible absolute right-0 top-full z-50 w-56 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="neo-panel overflow-hidden bg-paper shadow-solid">
                  <button onClick={() => nav('profile')} className="flex w-full items-center gap-2 border-b-[3px] border-ink p-4 text-left text-xs font-black uppercase tracking-wider hover:bg-brand-pink"><User size={14} /> Profil Lucu</button>
                  <button onClick={() => nav('orders')} className="flex w-full items-center gap-2 border-b-[3px] border-ink p-4 text-left text-xs font-black uppercase tracking-wider hover:bg-brand-yellow"><Package size={14} /> Pesanan & Promo</button>
                  {user?.email === ADMIN_EMAIL && <button onClick={() => nav('admin')} className="flex w-full items-center gap-2 border-b-[3px] border-ink p-4 text-left text-xs font-black uppercase tracking-wider hover:bg-brand-blue"><Star size={14} /> Admin Panel</button>}
                  <button onClick={handleSignOut} className="flex w-full items-center gap-2 p-4 text-left text-xs font-black uppercase tracking-wider text-brand-red hover:bg-brand-red hover:text-paper"><LogOut size={14} /> Logout Akun</button>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => setIsAuthModalOpen(true)} className="neo-btn neo-btn--ink hidden !px-5 !py-3 !text-[0.68rem] lg:inline-flex">
              <span className="roll-host"><TextRoll>Masuk / Daftar</TextRoll></span> <ArrowUpRight size={14} strokeWidth={3} />
            </button>
          )}

          <button
            className="grid h-10 w-10 place-items-center rounded-full border-[3px] border-ink bg-brand-orange transition-transform active:scale-90 sm:h-11 sm:w-11 lg:hidden"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
          </button>
        </div>
      </div>

      {/* Menu mobile: panel penuh gaya poster */}
      {isMobileMenuOpen && (
        <div style={{ top: menuTop }} className="fixed inset-x-0 bottom-0 z-[999] overflow-y-auto bg-brand-yellow px-4 pb-10 pt-4 lg:hidden">
          <div className="neo-panel mb-4 bg-paper p-3 shadow-solid-sm">
            <SmartSearchInput isMobile onNavigate={nav} />
          </div>

          {isMember ? (
            <div className="neo-panel mb-4 bg-paper p-3 shadow-solid-sm">
              <div className="mb-3 flex items-center gap-3">
                {user.photoURL
                  ? <img src={user.photoURL} alt="" className="h-10 w-10 rounded-full border-[3px] border-ink object-cover" />
                  : <span className="grid h-10 w-10 place-items-center rounded-full border-[3px] border-ink bg-brand-pink text-sm font-black uppercase">{(user.name || 'B').charAt(0)}</span>}
                <div className="text-left leading-tight">
                  <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">Halo {user.nickname || (user.gender === 'ayah' ? 'Ayah' : 'Bunda')},</span>
                  <span className="text-sm font-extrabold">{user.name}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => nav('profile')} className="flex items-center justify-center gap-2 rounded-full border-[3px] border-ink bg-brand-pink p-2.5 text-[10px] font-black uppercase"><User size={14} /> Profil</button>
                <button onClick={() => nav('orders')} className="flex items-center justify-center gap-2 rounded-full border-[3px] border-ink bg-brand-teal p-2.5 text-[10px] font-black uppercase"><Package size={14} /> Pesanan</button>
                {user?.email === ADMIN_EMAIL && <button onClick={() => nav('admin')} className="col-span-2 flex items-center justify-center gap-2 rounded-full border-[3px] border-ink bg-brand-blue p-2.5 text-[10px] font-black uppercase"><Star size={14} /> Admin Panel</button>}
                <button onClick={handleSignOut} className="col-span-2 flex items-center justify-center gap-2 rounded-full border-[3px] border-ink bg-brand-red p-2.5 text-[10px] font-black uppercase text-paper"><LogOut size={14} /> Logout</button>
              </div>
            </div>
          ) : (
            <button onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }} className="neo-btn neo-btn--ink mb-4 w-full">Masuk / Daftar</button>
          )}

          <nav className="flex flex-col" aria-label="Navigasi mobile">
            {[...NAV.slice(0, 2), ...NAV.slice(2)].map((n, i) => (
              <button
                key={n.key}
                onClick={() => nav(n.key)}
                className="display flex items-center justify-between border-b-[3px] border-ink py-3 text-left text-[clamp(2.2rem,11vw,3.4rem)]"
                style={{ animation: `slideIn 0.4s var(--ease-out) ${i * 0.06}s both` }}
              >
                {n.label}
                <ArrowUpRight size={34} strokeWidth={3} />
              </button>
            ))}
          </nav>

          <p className="mb-3 mt-6 text-[10px] font-black uppercase tracking-[0.22em]">Marketplace</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => window.open('https://shopee.co.id', '_blank')} className="neo-btn neo-btn--pink">Shopee</button>
            <button onClick={() => window.open('https://tokopedia.com', '_blank')} className="neo-btn neo-btn--teal">TikTok</button>
          </div>
          <div className="mt-8"><CheckerStrip size={14} tone="ink" /></div>
        </div>
      )}
    </header>
  );
};
