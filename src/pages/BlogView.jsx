import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Grid3x3, ShoppingCart, Image as ImageIcon, Monitor, Send, Facebook, Twitter, Dribbble, Instagram, ArrowUp, ChevronRight, Clock, User, Tag, Loader2, Sparkles, PenTool } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { SEO } from '../constants/data';
import { blogPostSchema } from '../utils/seoHelpers';

// === STYLES & FONTS ===
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Inter:wght@400;500;600&display=swap');
    
    @font-face {
      font-family: 'Momentz';
      src: local('Georgia'), local('Times New Roman');
    }

    .blog-wrapper {
        font-family: 'Inter', sans-serif;
        background-color: #ffffff;
        color: #222;
        overflow-x: hidden;
    }

    .font-oswald { font-family: 'Oswald', sans-serif; }
    .font-momentz { font-family: 'Momentz', serif; }

    /* Bright Pop-Art Colors replacing the dark red/black */
    .text-accent { color: #ff6b6b; } /* Bright Coral */
    .bg-accent { background-color: #ff6b6b; }
    .border-accent { border-color: #ff6b6b; }
    
    .text-primary { color: #f59e0b; } /* Bright Amber/Yellow */
    .bg-primary { background-color: #f59e0b; }

    @keyframes scaleUpFade {
        0% { transform: scale(0.3); opacity: 0; }
        50% { opacity: 0.06; }
        100% { transform: scale(1.2); opacity: 0.04; }
    }
    .animate-scale-text {
        animation: scaleUpFade 4s ease-out forwards;
    }

    /* Vibrant Sunny Background instead of Dark Red Rays */
    .bg-vibrant-rays {
        background: radial-gradient(circle at center, #ffde59 0%, #ff914d 100%);
        position: relative;
    }
    .bg-vibrant-rays::before {
        content: '';
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.1) 10px,
            rgba(255, 255, 255, 0.1) 20px
        );
        pointer-events: none;
    }
    
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: #ff6b6b; }
  `}</style>
);

// === DUMMY DATA (Kainora Optimized) ===
const INITIAL_POSTS = [
  { 
    id: 991, 
    title: "Ajaibnya Membacakan Buku Cerita Sebelum Tidur untuk Tumbuh Kembang Balita", 
    category: "PARENTING", 
    date: "JUN 23, 2026", 
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600", 
    excerpt: "Membacakan dongeng sebelum tidur bukan sekadar rutinitas penutup hari. Ini adalah investasi cerdas untuk kecerdasan emosional dan kognitif si kecil." 
  },
  { 
    id: 992, 
    title: "Tren Fashion Anak 2026: Tetap Nyaman, Stylish, dan Ramah Lingkungan", 
    category: "FASHION", 
    date: "JUN 22, 2026", 
    img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1600", 
    excerpt: "Tahun 2026 membawa angin segar dalam dunia fashion anak. Simak tren terbaru yang mengutamakan kenyamanan bergerak sekaligus peduli bumi." 
  },
  { 
    id: 993, 
    title: "Trik Ampuh Mengatasi Anak Susah Makan Sayur dengan Menu Kreatif", 
    category: "KESEHATAN", 
    date: "JUN 21, 2026", 
    img: "https://images.unsplash.com/photo-1489659639091-8b687bc4386e?w=1600", 
    excerpt: "Si kecil selalu menyisihkan sayur di piringnya? Jangan panik, Bunda! Coba trik 'menyembunyikan' sayur ke dalam menu favorit mereka berikut ini." 
  },
  { 
    id: 994, 
    title: "Panduan Memilih Sepatu Pertama untuk si Kecil yang Baru Belajar Jalan", 
    category: "FASHION", 
    date: "JUN 20, 2026", 
    img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1600", 
    excerpt: "Memilih sepatu untuk bayi yang sedang belajar berjalan butuh perhatian khusus. Pastikan langkah pertamanya aman dan nyaman." 
  },
  { 
    id: 995, 
    title: "5 Ide Kegiatan Akhir Pekan Seru Bersama Anak Tanpa Gadget", 
    category: "PARENTING", 
    date: "JUN 19, 2026", 
    img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1600", 
    excerpt: "Kurangi paparan layar (screen time) anak di akhir pekan dengan 5 aktivitas super seru yang bisa dilakukan di rumah ini." 
  },
  { id: 1, title: "Tren Warna Baju Anak Paling Hits di Tahun 2026", category: "FASHION", date: "MAY 22, 2026", img: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=1600", excerpt: "Warna pastel dan earth tone diprediksi akan mendominasi lemari pakaian si kecil tahun ini." },
  { id: 2, title: "Smart Parenting: Rahasia Anak Aktif Tanpa Gerah", category: "PARENTING", date: "MAY 20, 2026", img: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=1600", excerpt: "Memilih bahan katun premium adalah kunci agar anak bebas bereksplorasi di luar ruangan." },
  { id: 3, title: "Tips Mengatasi Kulit Sensitif pada Bayi", category: "KESEHATAN", date: "MAY 19, 2026", img: "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=1600", excerpt: "Pakaian memegang peranan penting. Hindari bahan sintetis yang memicu biang keringat." },
  { id: 4, title: "Koleksi Baju Lebaran Kainora Resmi Dirilis", category: "NEWS", date: "MAY 18, 2026", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600", excerpt: "Sambut hari raya dengan balutan busana broken white yang elegan namun tetap ramah anak." },
  { id: 5, title: "Cara Tepat Mencuci Baju Bahan Katun Premium", category: "LIFESTYLE", date: "MAY 17, 2026", img: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=600", excerpt: "Jangan asal sikat! Ikuti langkah ini agar baju kesayangan si kecil awet bertahun-tahun." },
  { id: 6, title: "OOTD Liburan Musim Panas yang Instagramable", category: "STYLE", date: "MAY 16, 2026", img: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=600", excerpt: "Padupadan celana pendek chino dan kaos ribbed adalah andalan liburan ke pantai." },
  { id: 7, title: "Sustainable Fashion untuk Balita Cerdas", category: "TRENDS", date: "MAY 15, 2026", img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600", excerpt: "Mengajarkan anak peduli lingkungan bisa dimulai dari memilih merk pakaian yang tepat." },
  { id: 8, title: "5 Aktivitas Sensorik di Rumah (Anti Kotor)", category: "PARENTING", date: "MAY 14, 2026", img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600", excerpt: "Ide bermain akhir pekan tanpa harus membuat rumah berantakan total." },
  { id: 9, title: "Panduan OOTD Formal Anak Laki-Laki", category: "FASHION", date: "MAY 13, 2026", img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600", excerpt: "Tampil rapi ke kondangan tanpa membuat anak menangis kegerahan." },
  { id: 10, title: "Warna Baju Pengaruhi Mood si Kecil", category: "PSYCHOLOGY", date: "MAY 12, 2026", img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600", excerpt: "Tahukah Bunda bahwa warna cerah bisa meningkatkan energi positif anak?" },
  { id: 11, title: "Koleksi Kaos Ribbed Kainora Siap Menggebrak", category: "PRODUCT", date: "MAY 11, 2026", img: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800", excerpt: "Dengan tekstur garis yang khas, kaos ini memberikan kesan tebal namun tetap bernapas." },
  { id: 12, title: "Baju Oversize Anak: Tren atau Kebutuhan?", category: "TRENDS", date: "MAY 10, 2026", img: "https://images.unsplash.com/photo-1584445584451-897db6ce246e?w=400", excerpt: "Siluet longgar kini makin diminati ibu-ibu milenial." },
  { id: 13, title: "Tips Memilih Sepatu Pertama untuk Bayi Berjalan", category: "PARENTING", date: "MAY 09, 2026", img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400", excerpt: "Perhatikan sol bagian bawah agar tidak mengganggu bentuk telapak kaki." },
  { id: 14, title: "Mengapa Baju Katun Begitu Mahal?", category: "LIFESTYLE", date: "MAY 08, 2026", img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400", excerpt: "Membongkar fakta di balik proses penanaman kapas organik." },
  { id: 15, title: "Gaya Streetwear Bayi Ala Selebriti Hollywood", category: "FASHION", date: "MAY 07, 2026", img: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=600", excerpt: "Inspirasi mendandani anak agar tampil sekeren North West." },
  { id: 16, title: "Pentingnya Label Halal pada Pakaian Anak", category: "HEALTH", date: "MAY 06, 2026", img: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600", excerpt: "Sertifikasi yang menjamin proses pewarnaan bebas bahan kimia najis." },
  { id: 17, title: "Inspirasi Kado Ulang Tahun Bermanfaat", category: "LIFESTYLE", date: "MAY 05, 2026", img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600", excerpt: "Daripada mainan, pakaian premium adalah hadiah yang selalu dipakai." },
  { id: 18, title: "Rahasia Desain Baju Anti Melar", category: "TIPS", date: "MAY 04, 2026", img: "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=400", excerpt: "Perhatikan jahitan kerah (rib) saat membeli kaos anak." },
  { id: 19, title: "Pemilihan Bahan untuk Kulit Eksim", category: "HEALTH", date: "MAY 03, 2026", img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400", excerpt: "Kurangi risiko ruam dengan 100% Cotton Combed." },
  { id: 20, title: "Waktu Terbaik Belanja Pakaian Bayi", category: "LIFESTYLE", date: "MAY 02, 2026", img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400", excerpt: "Jangan tunggu lahir! Ini waktu ideal untuk nyicil perlengkapan." },
  { id: 21, title: "INDUSTRI PAKAIAN ANAK LOKAL BERSAING DI PASAR GLOBAL", category: "NEWS", date: "MAY 01, 2026", img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=1000", excerpt: "Kualitas brand lokal Indonesia kini sejajar dengan brand Eropa." }
];

// === PROMO BANNERS ===

const HorizontalShopBanner = () => {
    const { setView } = useStore();
    return (
    <div className="w-full bg-primary text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group cursor-pointer overflow-hidden relative mb-20 shadow-xl">
        <div className="absolute -right-20 -top-20 opacity-10">
            <ShoppingBag size={300} />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 text-center md:text-left">
            <div className="w-20 h-20 bg-white text-primary flex items-center justify-center shrink-0 rounded-sm">
                <ShoppingBag size={32} />
            </div>
            <div>
                <p className="font-oswald text-xs uppercase tracking-widest text-white/90 mb-2 font-bold">PREMIUM KIDSWEAR</p>
                <h3 className="font-oswald text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-none mb-2">SHOP AT KAINORA</h3>
                <p className="text-white/90 text-sm font-medium">Temukan koleksi pakaian ternyaman untuk si kecil di website utama kami.</p>
            </div>
        </div>
        <button onClick={() => setView('home')} className="bg-white text-gray-900 font-oswald text-sm font-bold uppercase px-8 py-4 tracking-widest hover:bg-gray-900 hover:text-white transition-colors whitespace-nowrap relative z-10 border-2 border-transparent">
            VISIT MAIN STORE
        </button>
    </div>
    );
};

const VerticalShopBanner = () => {
    const { setView } = useStore();
    return (
    <div className="w-full bg-primary text-white p-8 flex flex-col items-center text-center group cursor-pointer relative overflow-hidden shadow-lg mt-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=400')] bg-cover bg-center opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
        <ShoppingBag size={48} className="mb-6 relative z-10 text-white" />
        <p className="font-oswald text-[10px] uppercase tracking-widest text-white/90 mb-2 relative z-10">UPGRADE THE WARDROBE</p>
        <h3 className="font-oswald text-4xl font-bold uppercase tracking-tighter mb-6 relative z-10 leading-none">SHOP AT<br/>KAINORA</h3>
        <button onClick={() => setView('home')} className="bg-white text-primary font-oswald text-sm font-bold uppercase px-6 py-4 tracking-widest hover:bg-gray-900 hover:text-white transition-colors relative z-10 w-full border border-transparent">
            SHOP NOW
        </button>
    </div>
    );
};

// === COMPONENTS ===

const Header = ({ currentView, setCurrentView }) => {
    const { setView } = useStore();
    return (
    <header className="bg-white h-[100px] flex justify-center relative z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-[1140px] w-full mx-auto px-6 flex justify-between items-center h-full">
            <div onClick={() => setCurrentView('home')} className="flex flex-col cursor-pointer">
                <span className="font-oswald font-bold text-4xl md:text-5xl tracking-tighter uppercase text-gray-900 leading-none" style={{ transform: 'scaleY(1.15)' }}>
                    KAINORA
                </span>
                <span className="font-oswald text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-accent mt-1 uppercase">
                    BLOG FOR KIDS
                </span>
            </div>
            <div className="flex items-center gap-10">
                <nav className="hidden lg:flex items-center gap-8 font-oswald font-bold uppercase text-[13px] tracking-wide text-gray-900">
                    <button onClick={() => setCurrentView('home')} className={`pb-1 transition-colors ${currentView === 'home' ? 'border-b-2 border-gray-900 text-gray-900' : 'border-b-2 border-transparent hover:text-accent'}`}>HOME</button>
                    <button onClick={() => setCurrentView('pages')} className={`pb-1 transition-colors ${currentView === 'pages' ? 'border-b-2 border-gray-900 text-gray-900' : 'border-b-2 border-transparent hover:text-accent'}`}>PAGES</button>
                    <button onClick={() => setView('home')} className="hover:text-accent transition-colors pb-1 border-b-2 border-transparent uppercase font-bold text-[13px]">
                        MAIN STORE
                    </button>
                </nav>
                <div className="flex items-center text-gray-900">
                    <button className="hover:text-accent transition-colors"><Search size={20} strokeWidth={2} /></button>
                </div>
            </div>
        </div>
    </header>
    );
};

const Section1_HeroSlider = ({ posts, overlayPosts, onArticleClick }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % posts.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [posts.length]);

    if (!posts || posts.length === 0) return null;

    return (
        <section className="relative w-full h-[85vh] bg-[#f8f9fa] overflow-hidden group">
            {posts.map((post, index) => (
                <div key={post.id} onClick={() => onArticleClick(post)} className={`absolute inset-0 transition-opacity duration-1000 cursor-pointer ${index === current ? 'opacity-100' : 'opacity-0'}`}>
                    <img loading="lazy" decoding="async" src={post.img} alt={post.title} className="w-full h-full object-cover opacity-90 scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-out" />
                </div>
            ))}

            <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20 pointer-events-none">
                <div className="max-w-[1140px] w-full mx-auto px-6 flex gap-6 pointer-events-auto flex-col lg:flex-row">
                    {overlayPosts.map((post) => (
                        <div key={post.id} onClick={() => onArticleClick(post)} className="w-full lg:flex-1 h-[120px] bg-white/90 backdrop-blur-sm p-4 flex gap-4 cursor-pointer hover:bg-white transition-colors shadow-lg border-b-4 border-accent">
                            <img loading="lazy" decoding="async" src={post.img} alt="" className="w-24 h-full object-cover shrink-0" />
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                                        <span>{post.category}</span> &nbsp;•&nbsp; <span className="text-gray-400">{post.date}</span>
                                    </p>
                                </div>
                                <h3 className="font-oswald text-sm md:text-[15px] font-bold uppercase text-gray-900 leading-snug line-clamp-3">
                                    {post.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-5 font-oswald text-sm font-bold text-gray-900 z-10 pointer-events-auto bg-white/80 p-3 shadow-md backdrop-blur-sm">
                {posts.map((_, index) => (
                    <button key={index} onClick={() => setCurrent(index)} className={`flex flex-col items-center transition-all ${current === index ? 'opacity-100 text-accent' : 'opacity-50 hover:opacity-100'}`}>
                        <span>0{index + 1}</span>
                        {current === index && <span className="w-4 h-[2px] bg-accent mt-1"></span>}
                    </button>
                ))}
            </div>
        </section>
    );
};

const Section2_LatestNews = ({ posts, onArticleClick }) => (
    <section className="py-20 md:py-28 bg-[#fafafa] flex justify-center border-b border-gray-100">
        <div className="max-w-[1140px] w-full mx-auto px-6 text-center">
            <p className="font-oswald text-xs uppercase font-bold text-gray-400 tracking-widest mb-2">BLOG & ARTIKEL</p>
            <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-16 text-gray-900">BERITA TERBARU</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                {posts.map((post) => (
                    <article key={post.id} onClick={() => onArticleClick(post)} className="group cursor-pointer bg-white p-4 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                        <div className="overflow-hidden mb-5">
                            <img loading="lazy" decoding="async" src={post.img} alt={post.title} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-accent">{post.category}</p>
                        </div>
                        <h3 className="font-oswald text-xl font-bold uppercase leading-snug mb-3 group-hover:text-accent transition-colors line-clamp-2 text-gray-900">
                            {post.title}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">
                            {post.date} &nbsp;•&nbsp; KAINORA EDITORIAL
                        </p>
                    </article>
                ))}
            </div>
        </div>
    </section>
);

const Section3_RecentPosts = ({ posts, onArticleClick }) => {
    if (!posts || posts.length < 4) return null;
    const mainPost = posts[0];
    const sidePosts = posts.slice(1, 4);

    return (
        <section className="bg-vibrant-rays py-24 md:py-32 text-gray-900 relative z-10 flex justify-center shadow-inner">
            <div className="max-w-[1140px] w-full mx-auto px-6">
                <p className="font-oswald text-xs uppercase font-bold text-gray-800 tracking-widest mb-2">TERUS UPDATE</p>
                <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-12 text-gray-900">POSTINGAN TERBARU</h2>
                
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <article onClick={() => onArticleClick(mainPost)} className="lg:w-2/3 group cursor-pointer bg-white p-6 shadow-xl border-b-4 border-gray-900">
                        <div className="relative overflow-hidden mb-6">
                            <img loading="lazy" decoding="async" src={mainPost.img} alt={mainPost.title} className="w-full aspect-video md:aspect-[21/9] object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                            <div className="absolute top-6 left-6 bg-accent text-white font-oswald text-xs font-bold uppercase px-3 py-1 tracking-widest">
                                {mainPost.category}
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center border-t-4 border-accent pt-2 w-16 shrink-0">
                                <span className="font-oswald text-4xl font-bold leading-none text-gray-900">18</span>
                                <span className="font-oswald text-[10px] uppercase tracking-widest text-accent font-bold mt-1">MAY</span>
                            </div>
                            <div>
                                <h3 className="font-oswald text-3xl md:text-4xl font-bold uppercase leading-tight mb-4 group-hover:text-accent transition-colors text-gray-900 line-clamp-2">
                                    {mainPost.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-2xl line-clamp-2 font-medium">
                                    {mainPost.excerpt}
                                </p>
                            </div>
                        </div>
                    </article>

                    <div className="lg:w-1/3 flex flex-col gap-6">
                        {sidePosts.map((post) => (
                            <article key={post.id} onClick={() => onArticleClick(post)} className="flex gap-6 group cursor-pointer bg-white p-4 shadow-lg border-l-4 border-primary hover:border-accent transition-colors">
                                <div className="w-28 h-28 shrink-0 overflow-hidden">
                                    <img loading="lazy" decoding="async" src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                                        <span className="text-accent">{post.category}</span> &nbsp;•&nbsp; {post.date}
                                    </p>
                                    <h4 className="font-oswald text-lg font-bold uppercase leading-snug text-gray-900 group-hover:text-accent transition-colors line-clamp-3">
                                        {post.title}
                                    </h4>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Section4_FeaturedAndSidebar = ({ posts, allPosts, onArticleClick }) => {
    // Hitung kategori secara dinamis dari SELURUH artikel (sama seperti PagesView)
    const categoryCounts = (allPosts || posts).reduce((acc, post) => {
        const cat = post.category || 'BLOG';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    const categoryList = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1]) // Urutkan dari yang terbanyak
        .slice(0, 8) // Tampilkan max 8 kategori teratas
        .map(([cat, count]) => `${cat} (${count})`);

    return (
    <section className="bg-white py-20 md:py-28 relative z-20 flex justify-center border-b border-gray-100">
        <div className="max-w-[1140px] w-full mx-auto px-6 flex flex-col lg:flex-row gap-12">
            
            <div className="lg:w-2/3">
                <h2 className="font-oswald text-4xl font-bold uppercase tracking-tighter mb-10 text-gray-900">POSTINGAN PILIHAN</h2>
                <div className="flex flex-col gap-6">
                    {posts.map((post) => (
                        <article key={post.id} onClick={() => onArticleClick(post)} className="bg-[#fafafa] flex flex-col md:flex-row h-auto md:h-64 group cursor-pointer shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                            <div className="md:w-1/2 overflow-hidden relative">
                                <img loading="lazy" decoding="async" src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                                    <span className="text-primary">{post.category}</span> &nbsp;•&nbsp; {post.date}
                                </p>
                                <h3 className="font-oswald text-2xl font-bold uppercase leading-tight mb-4 text-gray-900 group-hover:text-accent transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 font-medium">
                                    {post.excerpt}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <aside className="lg:w-1/3 flex flex-col gap-10">
                <div className="bg-[#fafafa] p-8 shadow-sm border border-gray-100">
                    <h3 className="font-oswald text-lg font-bold uppercase tracking-widest mb-6 text-gray-900">CARI ARTIKEL</h3>
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Cari..." className="w-full border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-accent transition-colors bg-white" />
                    </div>
                </div>

                <div className="bg-[#fafafa] p-8 shadow-sm border border-gray-100">
                    <h3 className="font-oswald text-lg font-bold uppercase tracking-widest mb-6 text-gray-900">KATEGORI</h3>
                    <ul className="space-y-3 text-sm text-gray-600 font-bold uppercase">
                        {categoryList.map((cat, i) => (
                            <li key={i} className="flex items-center gap-2 hover:text-accent cursor-pointer transition-colors pb-2 border-b border-gray-200 last:border-0 last:pb-0">
                                <ChevronRight size={14} className="text-accent" /> {cat}
                            </li>
                        ))}
                    </ul>
                </div>

                <VerticalShopBanner />
            </aside>
        </div>
    </section>
    );
};

const Section6_EditorsChoice = ({ posts, mainPost, onArticleClick }) => (
    <section className="bg-white py-20 md:py-28 flex justify-center text-center">
        <div className="max-w-[1140px] w-full mx-auto px-6">
            <p className="font-oswald text-xs uppercase font-bold text-gray-400 tracking-widest mb-2">ARTIKEL UNGGULAN</p>
            <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-16 text-gray-900">PILIHAN EDITOR</h2>
            
            <div className="flex flex-col lg:flex-row gap-0 md:gap-8 border-t border-b border-gray-100 py-10 text-left">
                
                <div className="lg:w-1/3 flex flex-col justify-between gap-8 mb-10 lg:mb-0">
                    {posts.map((post, idx) => (
                        <article key={post.id} onClick={() => onArticleClick(post)} className={`flex items-center gap-6 group cursor-pointer ${idx !== posts.length -1 ? 'border-b border-gray-100 pb-8' : ''}`}>
                            <div className="w-24 h-24 shrink-0 overflow-hidden bg-gray-50 p-1 border border-gray-100">
                                <img loading="lazy" decoding="async" src={post.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                                    <span className="text-accent">{post.category}</span> &nbsp;•&nbsp; {post.date}
                                </p>
                                <h4 className="font-oswald text-sm md:text-base font-bold uppercase leading-snug text-gray-900 group-hover:text-accent transition-colors line-clamp-2">
                                    {post.title}
                                </h4>
                            </div>
                        </article>
                    ))}
                </div>

                {mainPost && (
                    <article onClick={() => onArticleClick(mainPost)} className="lg:w-2/3 bg-primary text-white flex flex-col md:flex-row group cursor-pointer shadow-lg border-b-8 border-gray-900">
                        <div className="md:w-1/2 overflow-hidden bg-white">
                            <img loading="lazy" decoding="async" src={mainPost.img} alt="" className="w-full h-full object-cover min-h-[350px] group-hover:scale-105 transition-transform duration-700 opacity-90 mix-blend-multiply" />
                        </div>
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <span className="bg-gray-900 text-white font-oswald text-[10px] font-bold uppercase tracking-widest px-3 py-1 self-start mb-6">
                                {mainPost.category}
                            </span>
                            <h3 className="font-oswald text-3xl font-bold uppercase leading-tight mb-5 text-white group-hover:text-gray-900 transition-colors">
                                {mainPost.title}
                            </h3>
                            <p className="text-white/90 text-sm leading-relaxed mb-6 font-medium">
                                {mainPost.excerpt}
                            </p>
                        </div>
                    </article>
                )}

            </div>
        </div>
    </section>
);

// === PAGES VIEW: KUMPULAN SEMUA ARTIKEL + SIDEBAR ===
const PagesView = ({ posts, onArticleClick }) => {
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // Menghitung jumlah artikel per kategori secara dinamis dari database
    const categoryCounts = posts.reduce((acc, post) => {
        const cat = post.category || 'BLOG';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    
    // Sort kategori berdasarkan abjad
    const categoryList = Object.entries(categoryCounts)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([cat, count]) => ({ name: cat, label: `${cat} (${count})` }));

    // Filter posts berdasarkan pencarian dan kategori
    const filteredPosts = posts.filter(post => {
        const matchCat = activeCategory === 'ALL' || (post.category || 'BLOG') === activeCategory;
        const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCat && matchSearch;
    });

    return (
    <div className="w-full bg-[#fafafa] py-20 md:py-28 flex justify-center">
        <div className="max-w-[1140px] w-full mx-auto px-6">
            <div className="text-center mb-16">
                <p className="font-oswald text-xs uppercase font-bold text-accent tracking-widest mb-3">JELAJAHI KAINORA</p>
                <h1 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-tighter text-gray-900">SEMUA ARTIKEL</h1>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredPosts.length > 0 ? filteredPosts.map((post, idx) => (
                            <article key={post.id} onClick={() => onArticleClick(post)} className="bg-white group cursor-pointer shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full border border-gray-100 p-4">
                                <div className="overflow-hidden relative h-56 shrink-0">
                                    <img loading="lazy" decoding="async" src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        <div className="bg-amber-500 text-gray-900 font-oswald text-[10px] font-black uppercase px-2 py-1 tracking-widest self-start shadow-sm">
                                            {post.category || 'BLOG'}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 flex flex-col flex-1">
                                    <h3 className="font-oswald text-xl font-bold uppercase leading-snug mb-3 text-gray-900 group-hover:text-accent transition-colors line-clamp-3">
                                        {post.title}
                                    </h3>
                                    {post.excerpt && (
                                        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 font-medium">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        <span>{post.date || 'Jan 01, 2026'}</span>
                                        <span className="text-gray-900 hover:text-accent transition-colors flex items-center gap-1">Baca Selengkapnya <ChevronRight size={12}/></span>
                                    </div>
                                </div>
                            </article>
                        )) : (
                            <div className="col-span-1 md:col-span-2 text-center py-20">
                                <p className="text-gray-500 font-medium">Tidak ada artikel yang ditemukan.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center items-center gap-2 mt-16 font-oswald text-sm font-bold text-gray-500">
                        <button className="w-10 h-10 bg-white border border-gray-300 hover:border-accent hover:text-accent transition-colors flex items-center justify-center">&larr;</button>
                        <button className="w-10 h-10 bg-accent text-white flex items-center justify-center border border-accent">1</button>
                        <button className="w-10 h-10 bg-white border border-gray-300 hover:border-accent hover:text-accent transition-colors flex items-center justify-center">2</button>
                        <span>...</span>
                        <button className="w-10 h-10 bg-white border border-gray-300 hover:border-accent hover:text-accent transition-colors flex items-center justify-center">&rarr;</button>
                    </div>
                </div>

                <aside className="lg:w-1/3 flex flex-col gap-10">
                    <div className="bg-white p-8 shadow-sm border border-gray-100">
                        <h3 className="font-oswald text-lg font-bold uppercase tracking-widest mb-6 text-gray-900">CARI ARTIKEL</h3>
                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Cari artikel..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-accent transition-colors" 
                            />
                        </div>
                    </div>

                    <div className="bg-white p-8 shadow-sm border border-gray-100">
                        <h3 className="font-oswald text-lg font-bold uppercase tracking-widest mb-6 text-gray-900">KATEGORI</h3>
                        <ul className="space-y-3 text-sm text-gray-600 font-bold uppercase">
                            <li 
                                onClick={() => setActiveCategory('ALL')}
                                className={`flex items-center gap-2 cursor-pointer transition-colors pb-2 border-b border-gray-100 last:border-0 last:pb-0 ${activeCategory === 'ALL' ? 'text-accent' : 'hover:text-accent'}`}
                            >
                                <ChevronRight size={14} className={activeCategory === 'ALL' ? 'text-accent' : 'text-transparent'} /> SEMUA ({posts.length})
                            </li>
                            {categoryList.map((cat, i) => (
                                <li 
                                    key={i} 
                                    onClick={() => setActiveCategory(cat.name)}
                                    className={`flex items-center gap-2 cursor-pointer transition-colors pb-2 border-b border-gray-100 last:border-0 last:pb-0 ${activeCategory === cat.name ? 'text-accent' : 'hover:text-accent'}`}
                                >
                                    <ChevronRight size={14} className={activeCategory === cat.name ? 'text-accent' : 'text-transparent group-hover:text-accent'} /> {cat.label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <VerticalShopBanner />
                </aside>
            </div>
        </div>
    </div>
    );
};

// AI Studio removed

// === SINGLE ARTICLE VIEW ===
const ArticleView = ({ post, onBack }) => {
    useEffect(() => window.scrollTo(0, 0), []);

    // SEO: Inject JSON-LD BlogPosting schema for each article
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'blog-article-jsonld';
        const schema = blogPostSchema(post);
        if (schema) script.textContent = JSON.stringify(schema);
        const old = document.getElementById('blog-article-jsonld');
        if (old) old.remove();
        document.head.appendChild(script);
        return () => { const el = document.getElementById('blog-article-jsonld'); if (el) el.remove(); };
    }, [post]);

    return (
        <>
        <SEO 
            title={`${post.title} | Kainora Kids Blog`} 
            description={post.excerpt || 'Artikel eksklusif dari Kainora Kids tentang kesehatan, parenting, dan fashion anak.'}
            keywords={`${post.category || 'blog'}, kainora kids, artikel anak, parenting, kesehatan anak, fashion anak`}
            image={post.img}
            ogType="article"
            canonicalPath={`?view=blog&article=${post.id}`}
            publishedTime={post.date || new Date().toISOString().split('T')[0]}
            author="Kainora Kids Expert Team"
            section={post.category || 'Parenting'}
            articleTags={[post.category || 'blog', 'kainora kids', 'parenting', 'kesehatan anak', 'fashion anak']}
        />
        <div className="w-full bg-white pb-20">
            <div className="w-full h-[60vh] relative flex items-end justify-center pb-20 text-center">
                <div className="absolute inset-0 bg-gray-900">
                    <img loading="lazy" decoding="async" src={post.img || INITIAL_POSTS[0].img} alt="" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                </div>
                <div className="relative z-10 max-w-4xl px-6">
                    <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white mb-6">
                        <span className="bg-primary px-3 py-1">{post.category || 'BLOG'}</span>
                        <span className="flex items-center gap-1"><Clock size={12}/> {post.date || 'JAN 01, 2026'}</span>
                        <span className="flex items-center gap-1"><User size={12}/> BY KAINORA TEAM</span>
                    </div>
                    <h1 className="font-oswald text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white leading-tight">
                        {post.title}
                    </h1>
                </div>
            </div>

            <div className="max-w-[800px] mx-auto px-6 py-12 text-gray-700 text-lg leading-loose font-medium">
                
                {/* Render Content */}
                {post.content ? (
                    <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose prose-lg max-w-none text-gray-700 prose-headings:font-oswald prose-headings:uppercase prose-strong:text-gray-900" />
                ) : (
                    <>
                        <p className="mb-8"><strong className="text-gray-900 text-xl font-oswald tracking-wide uppercase">{post.excerpt ? post.excerpt[0] : 'D'}</strong>{post.excerpt ? post.excerpt.slice(1) : 'alam dunia fashion anak, kenyamanan adalah segalanya. Kami percaya pakaian terbaik adalah yang membiarkan anak bebas bergerak.'}</p>
                        <p className="mb-8">Menjadi orang tua adalah perjalanan yang menakjubkan sekaligus menantang. Di Kainora Kids, kami percaya setiap momen bersama buah hati sangatlah berharga. Memilih pakaian yang tepat tidak hanya soal gaya, tetapi juga tentang memberikan kenyamanan terbaik agar mereka dapat bebas bereksplorasi dan belajar hal baru setiap hari.</p>
                        <h3 className="font-oswald text-3xl font-bold uppercase tracking-tighter text-gray-900 mt-12 mb-6">MENGAPA INI PENTING?</h3>
                        <p className="mb-8">Bahan pakaian yang lembut seperti katun premium organik sangat dianjurkan untuk kulit sensitif anak. Ketika anak merasa nyaman, suasana hatinya akan lebih baik dan mereka akan lebih mudah berinteraksi dengan lingkungan sekitarnya. Jangan biarkan pakaian yang gatal atau gerah membatasi potensi mereka.</p>
                        <img loading="lazy" decoding="async" src={post.img || INITIAL_POSTS[0].img} alt="Content" className="w-full my-12 border-4 border-gray-100" />
                        <p className="mb-12">Oleh karena itu, selalu perhatikan label bahan pakaian saat berbelanja. Investasi pada pakaian yang tahan lama dan menyerap keringat akan membuat anak merasa lebih bahagia dan percaya diri.</p>
                    </>
                )}

                <div className="flex items-center gap-3 border-t border-b border-gray-200 py-6 mb-16 mt-12">
                    <Tag size={18} className="text-gray-400" />
                    <span className="font-oswald text-xs font-bold uppercase tracking-widest text-gray-900 hover:text-accent cursor-pointer">KIDSWEAR</span>
                    <span className="font-oswald text-xs font-bold uppercase tracking-widest text-gray-900 hover:text-accent cursor-pointer">TREND 2026</span>
                </div>

                <HorizontalShopBanner />
                
                <div className="text-center mt-12">
                    <button onClick={onBack} className="border-2 border-gray-900 text-gray-900 font-oswald text-sm font-bold uppercase px-8 py-4 tracking-widest hover:bg-gray-900 hover:text-white transition-colors">
                        &larr; BACK TO ARTICLES
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

const Footer = () => {
    const { setView } = useStore();
    return (
    <footer className="bg-gray-900 text-white pt-24 pb-8 relative flex flex-col items-center">
        <div className="max-w-[1140px] w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
            <div>
                <h2 className="font-oswald text-4xl font-bold uppercase tracking-tighter mb-6 text-white">KAINORA</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium">
                    Premium editorial for smart parenting and modern kids fashion trends.
                </p>
                <form className="relative border-b border-gray-700 pb-3 mb-4 group focus-within:border-white transition-colors">
                    <Send size={16} className="absolute left-0 top-1 text-gray-500" />
                    <input type="email" placeholder="Enter Your Email Address" className="w-full bg-transparent pl-8 pr-8 text-sm outline-none text-white placeholder:text-gray-500" />
                    <button type="submit" className="absolute right-0 top-1 text-white hover:text-accent transition-colors"><ArrowUp size={16} className="rotate-45" /></button>
                </form>
            </div>
            <div>
                <h3 className="font-oswald text-lg font-bold uppercase tracking-widest mb-8">RECENT POSTS</h3>
                <div className="flex flex-col gap-6">
                    {[INITIAL_POSTS[0], INITIAL_POSTS[1]].map((post, i) => (
                        <div key={i} className="flex gap-4 group cursor-pointer">
                            <img loading="lazy" decoding="async" src={post.img} alt="" className="w-16 h-16 object-cover opacity-80 group-hover:opacity-100 transition-opacity border border-gray-700" />
                            <div className="flex flex-col justify-center">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1">
                                    <span>{post.category}</span>
                                </p>
                                <h4 className="font-oswald text-xs font-bold uppercase leading-snug text-white group-hover:text-accent transition-colors line-clamp-2">
                                    {post.title}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="font-oswald text-lg font-bold uppercase tracking-widest mb-8">LINKS</h3>
                <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-gray-400">
                    <li><button onClick={() => setView('home')} className="hover:text-white transition-colors flex items-center gap-2 uppercase font-bold"><ShoppingBag size={14}/> Shop Store</button></li>
                    <li><button className="hover:text-white transition-colors uppercase font-bold">About Us</button></li>
                    <li><button className="hover:text-white transition-colors uppercase font-bold">Contacts</button></li>
                </ul>
            </div>
            <div>
                <h3 className="font-oswald text-lg font-bold uppercase tracking-widest mb-8">SOCIALS</h3>
                <div className="flex gap-3">
                    <a href="#" className="w-10 h-10 bg-gray-800 flex items-center justify-center hover:bg-accent hover:text-white transition-colors"><Facebook size={16} /></a>
                    <a href="#" className="w-10 h-10 bg-gray-800 flex items-center justify-center hover:bg-accent hover:text-white transition-colors"><Instagram size={16} /></a>
                </div>
            </div>
        </div>
        <div className="max-w-[1140px] w-full mx-auto px-6 border-t border-gray-800 pt-8 flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-widest">
            <p>Kainora Kids © 2026. All Rights Reserved. Editorial Blog.</p>
        </div>
    </footer>
    );
};

export const BlogView = () => {
  const [allPosts, setAllPosts] = useState(INITIAL_POSTS);
  const [currentView, setCurrentView] = useState('home');
  const [selectedPost, setSelectedPost] = useState(null);

  // FETCH ARTIKEL DARI FIREBASE
  useEffect(() => {
    const fetchArticles = async () => {
        try {
            const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const fetchedPosts = [];
            querySnapshot.forEach((doc) => {
                fetchedPosts.push({ id: doc.id, ...doc.data() });
            });
            
            if (fetchedPosts.length > 0) {
                // Kombinasi data Firebase dengan data statis jika kurang, atau gunakan Firebase saja
                setAllPosts(fetchedPosts);
            }
        } catch (error) {
            console.error("Gagal mengambil artikel dari Firebase:", error);
        }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, selectedPost]);

  const handleArticleClick = (post) => {
      setSelectedPost(post);
      setCurrentView('article');
  };



  return (
    <div className="blog-wrapper min-h-screen flex flex-col">
      <GlobalStyles />
      
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1">
          {currentView === 'home' && (
            <>
                <SEO 
                    title="Blog Parenting & Kesehatan Anak | Kainora Kids" 
                    description="Temukan artikel eksklusif seputar parenting, kesehatan balita, fashion anak, dan tips tumbuh kembang dari para ahli. Blog Kainora Kids — panduan lengkap ibu modern 2026."
                    keywords="blog parenting, artikel kesehatan anak, tips ibu, tumbuh kembang balita, fashion anak 2026, kainora kids blog, stunting, speech delay, MPASI, nutrisi anak"
                    ogType="blog"
                    canonicalPath="?view=blog"
                />
                <Section1_HeroSlider posts={allPosts.slice(0, 3)} overlayPosts={allPosts.slice(3, 6)} onArticleClick={handleArticleClick} />
                <Section2_LatestNews posts={allPosts.slice(6, 10)} onArticleClick={handleArticleClick} />
                <Section3_RecentPosts posts={allPosts.slice(10, 14)} onArticleClick={handleArticleClick} />
                <Section4_FeaturedAndSidebar posts={allPosts.slice(14, 17)} allPosts={allPosts} onArticleClick={handleArticleClick} />
                
                <div className="w-full flex justify-center bg-white py-10 border-b border-gray-100">
                    <div className="max-w-[1140px] w-full px-6">
                        <HorizontalShopBanner />
                    </div>
                </div>

                <Section6_EditorsChoice posts={allPosts.slice(17, 20)} mainPost={allPosts[20]} onArticleClick={handleArticleClick} />
            </>
          )}
          
          {currentView === 'pages' && (
            <>
                <SEO 
                    title="Semua Artikel Parenting & Anak | Kainora Kids Blog"
                    description="Jelajahi seluruh koleksi artikel parenting, kesehatan, fashion, dan lifestyle anak dari Kainora Kids. Ratusan panduan lengkap untuk ibu modern Indonesia."
                    keywords="semua artikel parenting, koleksi blog anak, panduan ibu, artikel kesehatan balita, tips fashion anak, kainora kids"
                    ogType="blog"
                    canonicalPath="?view=blog&page=all"
                />
                <PagesView posts={allPosts} onArticleClick={handleArticleClick} />
            </>
          )}
          
          {currentView === 'article' && selectedPost && (
              <ArticleView post={selectedPost} onBack={() => setCurrentView('home')} />
          )}


      </main>
      
      <Footer />
    </div>
  );
}