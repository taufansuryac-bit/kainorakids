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
  { id: 1, order: 1, label: 'Terbaru', type: 'Kaos', gender: 'Laki-laki', name: 'Kaos Sunshine', price: 69000, sold: 342, img: IMG1, images: [IMG1, '/PRODUCT/sunshine-1.jpg'], colors: [BROKEN_WHITE_HEX], sizes: ['1-2Y', '3-4Y', '5-6Y'], ages: [1, 2, 3, 4, 5, 6], alt: 'Kaos Kainora Kids motif Sunshine warna broken white', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
  { id: 2, order: 2, label: 'Terlaris', type: 'Kaos', gender: 'Perempuan', name: 'Kaos Breakfast Morning Club', price: 69000, sold: 512, img: IMG2, images: [IMG2, '/PRODUCT/breakfastmorning-1.jpg'], colors: [BROKEN_WHITE_HEX], sizes: ['3-4Y', '5-6Y', '7-8Y'], ages: [3, 4, 5, 6, 7, 8], alt: 'Kaos Kainora Kids motif Breakfast Morning Club warna broken white', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
  { id: 3, order: 3, label: 'Paling Disukai', type: 'Kaos', gender: 'Unisex', name: 'Kaos Kids Club', price: 69000, sold: 450, img: IMG3, images: [IMG3], colors: [BROKEN_WHITE_HEX], sizes: ['1-2Y', '3-4Y'], ages: [1, 2, 3, 4], alt: 'Kaos Kainora Kids motif Kids Club warna broken white', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
  { id: 4, order: 4, label: '', type: 'Kaos', gender: 'Unisex', name: 'Kaos Kainora Park', price: 69000, sold: 189, img: IMG4, images: [IMG4, '/PRODUCT/kainorapark-1.jpg'], colors: [BROKEN_WHITE_HEX], sizes: ['5-6Y', '7-8Y', '9-10Y'], ages: [5, 6, 7, 8, 9, 10], alt: 'Kaos Kainora Kids motif Kainora Park warna broken white', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
  { id: 5, order: 5, label: '', type: 'Kaos', gender: 'Laki-laki', name: 'Kaos Born to Play', price: 69000, sold: 275, img: IMG5, images: [IMG5], colors: [BROKEN_WHITE_HEX], sizes: ['3-4Y', '5-6Y', '7-8Y'], ages: [3, 4, 5, 6, 7, 8], alt: 'Kaos Kainora Kids motif Born to Play warna broken white', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
  { id: 6, order: 6, label: '', type: 'Kaos', gender: 'Unisex', name: 'Kaos Be You', price: 69000, sold: 310, img: IMG6, images: [IMG6, '/PRODUCT/beyou-1.jpg'], colors: [BROKEN_WHITE_HEX], sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'], ages: [3, 4, 5, 6, 7, 8, 9, 10], alt: 'Kaos Kainora Kids motif Be You warna broken white', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
  { id: 7, order: 7, label: '', type: 'Kaos', gender: 'Perempuan', name: 'Kaos Love Peace Joy', price: 69000, sold: 198, img: IMG7, images: [IMG7, '/PRODUCT/lovepeach-1.jpg'], colors: [BROKEN_WHITE_HEX], sizes: ['5-6Y', '7-8Y'], ages: [5, 6, 7, 8], alt: 'Kaos Kainora Kids motif Love Peace Joy warna broken white', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
  { id: 8, order: 8, label: '', type: 'Kaos', gender: 'Unisex', name: 'Kaos Hello World', price: 69000, sold: 520, img: IMG8, images: [IMG8, '/PRODUCT/helloworld-1.jpg'], colors: [BROKEN_WHITE_HEX], sizes: ['1-2Y', '3-4Y', '5-6Y'], ages: [1, 2, 3, 4, 5, 6], alt: 'Kaos Kainora Kids motif Hello World warna broken white', bahan: 'Heavyweight 100% Cotton (16s-24s)', jahitan: 'Rantai & Overdeck 3 Benang', warna: 'Broken White', model: 'Oversize Boxy', desc: PREM_DESC },
];

export const HERO_SLIDES = [ { id: 1, type: 'image', media: '/images/banners/banner-hero-1.jpg' }, { id: 2, type: 'image', media: '/images/banners/banner-hero-2.jpg' }, { id: 3, type: 'image', media: '/images/banners/banner-hero-3.jpg' } ];

export const FOOTER_INFO = {
  'cara': { title: 'Cara Belanja', content: '1. Eksplorasi Katalog: Temukan koleksi pakaian premium pilihan Bunda di halaman "Katalog Produk".\n\n2. Pilih Spesifikasi: Tentukan warna dan ukuran yang paling pas untuk si kecil (jangan lupa merujuk pada "Panduan Ukuran").\n\n3. Tambahkan ke Keranjang: Klik tombol "Tambah Ke Keranjang" setelah memastikan produk dan ukuran sesuai.\n\n4. Lanjut Checkout: Keranjang akan otomatis terbuka di sebelah kanan layar, periksa kembali pesanan Bunda, lalu klik "Lanjut Checkout".\n\n5. Pesan via WhatsApp: Isi formulir data pengiriman dengan lengkap (termasuk KODE POS), lalu tekan tombol "Kirim Order WA". Detail pesanan Bunda akan otomatis tersusun rapi dan dikirimkan langsung ke Admin kami untuk diproses tanpa ribet!' },
  'retur': { title: 'Kebijakan Retur & Refund', content: 'Bunda dapat melakukan retur atau penukaran barang maksimal 2x24 jam setelah paket diterima.\n\nSyarat Retur & Refund:\n1. Wajib menyertakan video unboxing dari awal paket belum dibuka (tanpa jeda/edit).\n2. Pakaian belum pernah dicuci atau dipakai bepergian.\n3. Hangtag dan label masih menempel utuh.\n\nOngkir retur akibat salah ukuran atau kelalaian pembeli ditanggung pembeli. Untuk cacat atau kesalahan penjual, Kainora menanggung ongkir. Hubungi Admin sebelum mengirim kembali produk untuk konfirmasi prosesnya.' },
  'faq': { title: 'Tanya Jawab (FAQ)', content: 'T: Apakah bahannya panas untuk anak?\nJ: Tidak Bunda, produk Kainora menggunakan Heavyweight 100% Premium Cotton yang breathable (menyerap keringat) sehingga sangat adem dan nyaman untuk si kecil yang super aktif.\n\nT: Bagaimana cara mencucinya agar awet?\nJ: Sebaiknya dicuci dengan air suhu normal dan hindari penggunaan pemutih. Jika disetrika, gunakan suhu sedang dan jangan menyetrika langsung pada bagian sablon.\n\nT: Apakah ukurannya pasti sesuai dengan umur anak?\nJ: Bandingkan lebar dan panjang kaos yang sudah nyaman dipakai dengan panduan ukuran S–XXL. Rekomendasi berdasarkan umur, berat, atau tinggi hanya perkiraan; utamakan ukuran kaos sebenarnya.\n\nT: Apakah bisa pesan untuk kado/hampers?\nJ: Tentu Bunda, silakan tambahkan Catatan Baju di halaman Checkout jika ingin menggunakan kotak kado atau kartu ucapan.' }
};

export { formatPrice } from '../utils/pricing';
