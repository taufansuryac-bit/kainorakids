// Archived demo records from the previous blog. Not published editorial content.
const ORIGINAL_DEMO_POSTS = [
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

// Existing demo copy is retained; preview visuals use local assets, never remote hotlinks.
// Concept photos are labelled in the UI and are not official article photography.
const visuals = [
  '/images/kainora-generated/hero-editorial.webp',
  '/images/kainora-generated/look-01.webp',
  '/images/kainora-generated/brand-material.webp',
  '/images/kainora-generated/campaign-wide.webp',
];
export const BLOG_DEMO_POSTS = ORIGINAL_DEMO_POSTS.map((post, index) => ({
  ...post,
  sourceImg: post.img,
  img: visuals[index % visuals.length],
  imagePosition: index % visuals.length === 1 ? '50% 0%' : undefined,
  preview: true,
  imageCaption: 'Visual konsep Kainora / ilustrasi artikel contoh',
}));
