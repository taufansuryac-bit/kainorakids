import React, { useEffect } from 'react';

// ============================================================================
// 2. CONSTANTS, DUMMY DATA & HELPERS
// ============================================================================
export const seededRandom = (seed) => {
  let t = seed += 0x6D2B79F5;
  return () => {
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export const CATEGORIES = [
  "Semua", "Laki-laki", "Perempuan", "Unisex", "Terbaru", "Terlaris"
];

export const N = ["Bunda Nisa", "Mama Clara", "Ayah Budi", "Bunda Sarah", "Bunda Ayu", "Mama Tita", "Bunda Siska", "Bunda Fitri", "Mama Ratih", "Ayah Kevin", "Bunda Rini", "Mama Dinda", "Bunda Maya", "Bunda Dina", "Mama Rio", "Bunda Tari", "Mama Yuni", "Ayah Anton", "Bunda Lita", "Bunda Eka", "Mama Zahra", "Bunda Vina", "Bunda Lesti", "Mama Kiki", "Ayah Doni"];
export const P1 = ["Suka banget sama bahannya!", "Kualitasnya juara.", "Bahannya bener-bener premium.", "Kainnya tebal tapi adem.", "Jahitannya super rapi.", "Warnanya elegan banget.", "Ekspektasi terbayar lunas.", "Bagus banget aslinya!", "Bahan 100% katun asli.", "Gak nyesel beli di sini."];
export const P2 = ["Anakku nyaman banget pakainya.", "Pas banget di badan anakku.", "Gak bikin gerah sama sekali.", "Dipakai seharian anak tetep happy.", "Cocok buat jalan-jalan atau di rumah.", "Kulit sensitif anakku aman pakai ini.", "Ukurannya sesuai sama panduan.", "Anakku langsung minta langsung dipakai pas paket datang."];
export const P3 = ["Bakal langganan terus nih.", "Sangat recommended!", "Pengiriman juga super cepat.", "Packaging rapi dan mewah banget.", "Adminnya ramah. Mantap!", "Worth it banget dengan harganya.", "Fix nambah koleksi warna lain.", "Terima kasih Kainora Kids!", "Besok beli lagi buat kado keponakan.", "Rezeki dapet toko online sejujur ini."];

export const generateDummyReviews = (currentProducts) => {
  if (!currentProducts || currentProducts.length === 0) return [];
  const rand = seededRandom(888); 
  const dummies = [];
  for (let i = 0; i < 854; i++) {
     const p = currentProducts[Math.floor(rand() * currentProducts.length)]; 
     dummies.push({
        id: `dummy-${i}`,
        name: N[Math.floor(rand() * N.length)] + (Math.floor(rand()*99)>40 ? ` ${Math.floor(rand()*99)}` : ''),
        text: `"${P1[Math.floor(rand() * P1.length)]} ${P2[Math.floor(rand() * P2.length)]} ${P3[Math.floor(rand() * P3.length)]}"`,
        rating: 5,
        productId: p.id,
        productName: p.name,
        email: 'verified@buyer.com',
        isDummy: true 
     });
  }
  return dummies;
};

export const AVATARS_BUNDA = [
  "https://api.dicebear.com/9.x/micah/svg?seed=Bunda1&backgroundColor=ffb1c1,ffdfbf",
  "https://api.dicebear.com/9.x/micah/svg?seed=Bunda2&backgroundColor=ffb1c1,ffdfbf",
  "https://api.dicebear.com/9.x/micah/svg?seed=Bunda3&backgroundColor=ffb1c1,ffdfbf",
  "https://api.dicebear.com/9.x/micah/svg?seed=Bunda4&backgroundColor=ffb1c1,ffdfbf",
  "https://api.dicebear.com/9.x/micah/svg?seed=Bunda5&backgroundColor=ffb1c1,ffdfbf"
];

export const AVATARS_AYAH = [
  "https://api.dicebear.com/9.x/micah/svg?seed=Ayah1&backgroundColor=b6e3f4,c0aede",
  "https://api.dicebear.com/9.x/micah/svg?seed=Ayah2&backgroundColor=b6e3f4,c0aede",
  "https://api.dicebear.com/9.x/micah/svg?seed=Ayah3&backgroundColor=b6e3f4,c0aede",
  "https://api.dicebear.com/9.x/micah/svg?seed=Ayah4&backgroundColor=b6e3f4,c0aede",
  "https://api.dicebear.com/9.x/micah/svg?seed=Ayah5&backgroundColor=b6e3f4,c0aede"
];

export const SEO = ({ title, description, keywords, image, canonicalPath, ogType, publishedTime, author, section, articleTags }) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (attr, attrValue, content) => {
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // Core Meta
    setMeta('name', 'description', description);
    if (keywords) setMeta('name', 'keywords', keywords);

    // Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    if (ogType) setMeta('property', 'og:type', ogType);
    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('property', 'og:image:alt', title);
    }

    // Article Specific Open Graph
    if (ogType === 'article') {
      if (publishedTime) setMeta('property', 'article:published_time', publishedTime);
      if (author) setMeta('property', 'article:author', author);
      if (section) setMeta('property', 'article:section', section);
      
      // Cleanup old article tags
      document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
      // Insert new article tags
      if (articleTags && Array.isArray(articleTags)) {
        articleTags.forEach(tag => {
           let el = document.createElement('meta');
           el.setAttribute('property', 'article:tag');
           el.content = tag.trim();
           document.head.appendChild(el);
        });
      }
    }

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    if (image) {
      setMeta('name', 'twitter:image', image);
      setMeta('name', 'twitter:image:alt', title);
    }

    // Canonical URL
    if (canonicalPath) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = `https://kainorakids.com/${canonicalPath}`;

      setMeta('property', 'og:url', `https://kainorakids.com/${canonicalPath}`);
    }
  }, [title, description, keywords, image, canonicalPath, ogType, publishedTime, author, section, articleTags]);
  return null;
};

export const IMG1 = "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=500";
export const IMG2 = "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=500";
export const IMG3 = "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500";
export const IMG4 = "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500";
export const IMG5 = "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500";
export const IMG6 = "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500";
export const IMG7 = "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500";
export const IMG8 = "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500";

export const PREM_DESC = "Hadirkan kenyamanan kelas satu dan gaya tak lekang oleh waktu untuk si kecil dengan koleksi eksklusif Kainora. Dirancang dengan presisi, pakaian ini menjanjikan sentuhan paling lembut bagi kulit anak, sekaligus ketangguhan untuk menemani setiap fase eksplorasinya.";
export const BROKEN_WHITE_HEX = '#FAF9F6';

export const COLOR_SWATCHES = [
  { name: 'Semua', hex: 'conic-gradient(red, yellow, green, blue, magenta, red)' },
  { name: 'Broken White', hex: '#FAF9F6' },
  { name: 'Sage Green', hex: '#8A9A5B' },
  { name: 'Dusty Pink', hex: '#DCAE96' },
  { name: 'Navy Blue', hex: '#000080' },
  { name: 'Mustard Yellow', hex: '#E5A93C' },
  { name: 'Jet Black', hex: '#111827' }
];

export const INITIAL_PRODUCTS = [
  { id: 1, order: 1, label: 'Terbaru', type: 'Kaos', gender: 'Laki-laki', name: 'Kaos Dino Signature', price: 89000, sold: 342, img: IMG1, images: [IMG1, IMG5], colors: [BROKEN_WHITE_HEX], sizes: ['1-2Y', '3-4Y', '5-6Y'], ages: [1, 2, 3, 4, 5, 6], alt: 'Kaos anak laki-laki premium katun adem motif dinosaurus oversize boxy Kainora Kids', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
  { id: 2, order: 2, label: 'Terlaris', type: 'Kaos', gender: 'Perempuan', name: 'Kaos Ruffle Signature', price: 149000, sold: 512, img: IMG2, images: [IMG2, IMG1], colors: [BROKEN_WHITE_HEX], sizes: ['3-4Y', '5-6Y', '7-8Y'], ages: [3, 4, 5, 6, 7, 8], alt: 'Kaos anak perempuan premium ruffle Korean style bahan katun lembut ramah kulit sensitif', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
  { id: 3, order: 3, label: 'Paling Disukai', type: 'Kaos', gender: 'Unisex', name: 'Kaos Bear Signature', price: 125000, sold: 450, img: IMG3, images: [IMG3, IMG4], colors: [BROKEN_WHITE_HEX], sizes: ['1-2Y', '3-4Y'], ages: [1, 2, 3, 4], alt: 'Setelan baju kaos bayi anak unisex gambar beruang bahan katun tebal adem broken white', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
  { id: 4, order: 4, label: '', type: 'Kaos', gender: 'Unisex', name: 'Kaos Basic Premium', price: 159000, sold: 189, img: IMG4, images: [IMG4, IMG1], colors: [BROKEN_WHITE_HEX], sizes: ['5-6Y', '7-8Y', '9-10Y'], ages: [5, 6, 7, 8, 9, 10], alt: 'Kaos polos anak premium broken white bahan katun heavyweight 100% cotton oversize boxy', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
  { id: 5, order: 5, label: '', type: 'Kaos', gender: 'Laki-laki', name: 'Kaos Klasik Signature', price: 110000, sold: 275, img: IMG5, images: [IMG5, IMG3], colors: [BROKEN_WHITE_HEX], sizes: ['3-4Y', '5-6Y', '7-8Y'], ages: [3, 4, 5, 6, 7, 8], alt: 'Baju kaos anak laki-laki klasik putih estetik minimalis bahan katun adem nyaman', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
  { id: 6, order: 6, label: '', type: 'Kaos', gender: 'Unisex', name: 'Kaos Pocket Signature', price: 135000, sold: 310, img: IMG6, images: [IMG6, IMG2], colors: [BROKEN_WHITE_HEX], sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'], ages: [3, 4, 5, 6, 7, 8, 9, 10], alt: 'Kaos anak unisex kantong saku bahan katun tebal premium toko baju anak online terpercaya', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
  { id: 7, order: 7, label: '', type: 'Kaos', gender: 'Perempuan', name: 'Kaos Pastel Signature', price: 145000, sold: 198, img: IMG7, images: [IMG7, IMG8], colors: [BROKEN_WHITE_HEX], sizes: ['5-6Y', '7-8Y'], ages: [5, 6, 7, 8], alt: 'Baju anak perempuan aesthetic pastel estetik earth tone katun premium usia 5-8 tahun', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
  { id: 8, order: 8, label: '', type: 'Kaos', gender: 'Unisex', name: 'Kaos Cloud Signature', price: 95000, sold: 520, img: IMG8, images: [IMG8, IMG1], colors: [BROKEN_WHITE_HEX], sizes: ['1-2Y', '3-4Y', '5-6Y'], ages: [1, 2, 3, 4, 5, 6], alt: 'Baju anak santai motif awan katun adem murah bagus rekomendasi baju bayi 1-6 tahun', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
];

export const HERO_SLIDES = [ { id: 1, type: 'image', media: '/images/banners/banner-hero-1.jpg' }, { id: 2, type: 'image', media: '/images/banners/banner-hero-2.jpg' }, { id: 3, type: 'image', media: '/images/banners/banner-hero-3.jpg' } ];

export const FOOTER_INFO = {
  'cara': { title: 'Cara Belanja', content: '1. Eksplorasi Katalog: Temukan koleksi pakaian premium pilihan Bunda di halaman "Katalog Produk".\n\n2. Pilih Spesifikasi: Tentukan warna dan ukuran yang paling pas untuk si kecil (jangan lupa merujuk pada "Panduan Ukuran").\n\n3. Tambahkan ke Keranjang: Klik tombol "Tambah Ke Keranjang" setelah memastikan produk dan ukuran sesuai.\n\n4. Lanjut Checkout: Keranjang akan otomatis terbuka di sebelah kanan layar, periksa kembali pesanan Bunda, lalu klik "Lanjut Checkout".\n\n5. Pesan via WhatsApp: Isi formulir data pengiriman dengan lengkap (termasuk KODE POS), lalu tekan tombol "Kirim Order WA". Detail pesanan Bunda akan otomatis tersusun rapi dan dikirimkan langsung ke Admin kami untuk diproses tanpa ribet!' },
  'retur': { title: 'Kebijakan Retur & Refund', content: 'Bunda dapat melakukan retur atau penukaran barang maksimal 2x24 jam setelah paket diterima.\n\nSyarat Retur & Refund:\n1. Wajib menyertakan video unboxing dari awal paket belum dibuka (tanpa jeda/edit).\n2. Pakaian belum pernah dicuci atau dipakai bepergian.\n3. Hangtag dan label masih menempel utuh.\n\nSilakan hubungi Admin WA kami untuk proses penukaran atau pengembalian dana Bunda.' },
  'faq': { title: 'Tanya Jawab (FAQ)', content: 'T: Apakah bahannya panas untuk anak?\nJ: Tidak Bunda, produk Kainora menggunakan Heavyweight 100% Premium Cotton yang breathable (menyerap keringat) sehingga sangat adem dan nyaman untuk si kecil yang super aktif.\n\nT: Bagaimana cara mencucinya agar awet?\nJ: Sebaiknya dicuci dengan air suhu normal dan hindari penggunaan pemutih. Jika disetrika, gunakan suhu sedang dan jangan menyetrika langsung pada bagian sablon.\n\nT: Apakah ukurannya pasti sesuai dengan umur anak?\nJ: Gunakan Kalkulator Cerdas yang ada di website kami, cukup masukkan Berat dan Tinggi anak, sistem otomatis akan merekomendasikan ukuran paling tepat untuk pola Boxy Oversize Kainora Kids.\n\nT: Apakah bisa pesan untuk kado/hampers?\nJ: Tentu Bunda, silakan tambahkan Catatan Baju di halaman Checkout jika ingin menggunakan kotak kado atau kartu ucapan.' }
};

export const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p || 0);
