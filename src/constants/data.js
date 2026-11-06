import { trackPageView } from '../utils/analytics';
import { useEffect } from 'react';

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

export const SEO = ({ title, description, keywords, image, canonicalPath, ogType, publishedTime, modifiedTime, imageAlt, author, section, articleTags, robots }) => {
  useEffect(() => {
    document.title = title;
    const previousRobots = document.querySelector('meta[name="robots"]')?.content;

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
    if (robots) setMeta('name', 'robots', robots);

    // Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', ogType || 'website');
    if (image) {
      const imageURL = new URL(image, 'https://kainorakids.com/').href;
      setMeta('property', 'og:image', imageURL);
      setMeta('property', 'og:image:secure_url', imageURL);
      setMeta('property', 'og:image:alt', imageAlt || title);
      if (image.includes('/images/journal/')) {
        setMeta('property', 'og:image:width', '1536'); setMeta('property', 'og:image:height', '1024'); setMeta('property', 'og:image:type', 'image/webp');
      } else if (image.includes('/images/og/')) {
        setMeta('property', 'og:image:width', '1200'); setMeta('property', 'og:image:height', '630'); setMeta('property', 'og:image:type', 'image/jpeg');
      } else document.querySelectorAll('meta[property="og:image:width"],meta[property="og:image:height"],meta[property="og:image:type"]').forEach(el => el.remove());
    }

    // Article Specific Open Graph
    if (ogType === 'article') {
      if (publishedTime) setMeta('property', 'article:published_time', publishedTime);
      if (modifiedTime) setMeta('property', 'article:modified_time', modifiedTime);
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
      setMeta('name', 'twitter:image', new URL(image, 'https://kainorakids.com/').href);
      setMeta('name', 'twitter:image:alt', imageAlt || title);
    }

    // Canonical URL
    if (canonicalPath !== undefined && canonicalPath !== null) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      const canonicalURL = new URL(canonicalPath, 'https://kainorakids.com/').href;
      canonical.href = canonicalURL;
      document.querySelectorAll('link[rel="canonical"]').forEach(link => { if (link !== canonical) link.remove(); });
      document.querySelectorAll('link[hreflang]').forEach(link => { link.href = canonicalURL; });

      setMeta('property', 'og:url', canonicalURL);
    }
    trackPageView();
    return () => {
      document.querySelectorAll('meta[property^="article:"]').forEach(el => el.remove());
      if (robots) {
        const meta = document.querySelector('meta[name="robots"]');
        if (meta && previousRobots !== undefined) meta.content = previousRobots;
        else meta?.remove();
      }
    };
  }, [title, description, keywords, image, canonicalPath, ogType, publishedTime, modifiedTime, imageAlt, author, section, articleTags, robots]);
  return null;
};

export const IMG1 = "/PRODUCT/sunshine-2.jpg";
export const IMG2 = "/PRODUCT/breakfastmorning-2.jpg";
export const IMG3 = "/PRODUCT/kidsclub-1.jpg";
export const IMG4 = "/PRODUCT/kainorapark-2.jpg";
export const IMG5 = "/PRODUCT/borntoplay-1.jpg";
export const IMG6 = "/PRODUCT/beyou-2.jpg";
export const IMG7 = "/PRODUCT/lovepeach-2.jpg";
export const IMG8 = "/PRODUCT/helloworld-2.jpg";

export const PREM_DESC = "Kaos anak dengan motif grafis dan potongan oversize boxy. Periksa bahan, foto produk, serta panduan ukuran sebelum memesan.";
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

// Legacy demo products are retired; the catalogue is loaded from content/store.json.
export const INITIAL_PRODUCTS = [];

export const HERO_SLIDES = [ { id: 1, type: 'image', media: '/images/banners/banner-hero-1.jpg' }, { id: 2, type: 'image', media: '/images/banners/banner-hero-2.jpg' }, { id: 3, type: 'image', media: '/images/banners/banner-hero-3.jpg' } ];

export const FOOTER_INFO = {
  cara: { title: 'Cara Belanja', content: '1. Pilih produk: lihat motif, bahan, harga, dan foto di halaman koleksi.\n\n2. Pilih ukuran: bandingkan lebar dan panjang kaos dengan tabel ukuran produk.\n\n3. Tambahkan ke keranjang: periksa produk, ukuran, dan jumlah yang akan dipesan.\n\n4. Lengkapi data penerima: masuk ke akun, lanjut ke checkout, lalu isi nama, nomor WhatsApp, alamat, dan kode pos.\n\n5. Konfirmasi melalui WhatsApp: tekan Pesan via WhatsApp, periksa rincian pesan, lalu kirim ke tim Kainora untuk konfirmasi stok, ongkir, dan pembayaran.' },
  retur: { title: 'Retur dan Penukaran', content: 'Ajukan retur atau penukaran maksimal 2×24 jam setelah paket diterima.\n\nSertakan video unboxing utuh sejak paket belum dibuka. Produk belum dicuci atau dipakai bepergian; hangtag dan label tetap terpasang.\n\nOngkir akibat salah memilih ukuran atau kelalaian pembeli ditanggung pembeli. Ongkir akibat cacat produk atau kesalahan penjual ditanggung Kainora. Hubungi tim Kainora sebelum mengirim kembali produk.' },
  faq: { title: 'Pertanyaan Umum', content: 'Apa bahan dan potongan kaos Kainora?\nKoleksi kaos menggunakan potongan oversize boxy. Periksa komposisi bahan pada halaman produk yang dipilih.\n\nBagaimana memilih ukuran?\nBentangkan kaos anak yang sudah nyaman dipakai. Ukur lebar dari ketiak ke ketiak dan panjang dari bahu dekat kerah ke ujung bawah. Bandingkan dengan tabel ukuran produk; usia saja tidak memastikan ukuran yang sesuai.\n\nBagaimana merawat sablon?\nIkuti label perawatan. Balik kaos sebelum mencuci, hindari pemutih, dan jangan menyetrika langsung pada sablon.\n\nApakah tersedia kemasan kado?\nTulis kebutuhan Anda pada Catatan Pesanan di checkout. Ketersediaan kemasan, kartu ucapan, dan biaya dikonfirmasi dengan tim Kainora.' },
};

export { formatPrice } from '../utils/pricing';
