# Katalog dan detail produk — 22 Oktober 2026

## Permintaan dan data produk

Pemilik meminta antarmuka modern/futuristik yang informatif, bernilai jual, dengan animasi dari riset Motion dan 21st.dev, serta fondasi SEO yang lebih kuat. Pemilik kemudian menetapkan semua kaos putih Rp69.000 dan meminta seluruh motif dari aset lokal dimasukkan.

- Lokasi aktual setelah pemindahan pemilik: `public/PRODUCT/`.
- Ditemukan 82 JPG untuk **42 motif**: 42 sampul `nama-1.jpg` berlatar kuning, 40 foto tambahan `nama-2.jpg`. Born to Play dan Kids Club masing-masing hanya memiliki satu foto; tidak dibuat foto kedua palsu.
- Katalog menjadi 42 produk unik, seluruhnya kaos putih Rp69.000. ID lama, urutan awal dan 12 pilihan highlight dipertahankan; 30 motif ditambahkan.
- Referensi aset lama di source diperbarui ke `/PRODUCT/`, termasuk bagian beranda dan affiliate yang memakai foto tersebut.
- Deskripsi tiap motif ditulis berdasarkan tampilan grafis, dengan bahan/potongan yang tercantum pada foto. Angka penjualan dan label popularitas lama tidak dipakai sebagai fakta.
- Koreksi atas masukan pemilik: delapan motif lama kembali memakai pilihan ukuran masing-masing dari data sebelumnya. Sebanyak 34 motif tambahan menggunakan rentang standar chart lama 1-2Y sampai 9-10Y sebagai konfigurasi awal yang dapat diubah lewat admin; ini bukan verifikasi inventaris fisik. Keranjang kembali aktif sesudah ukuran dipilih. Angka stok tidak dibuat.

## Desain dan interaksi

- Katalog: hero editorial besar dihapus sesuai permintaan. Judul ringkas, ringkasan harga, pencarian multi-kata, kategori, filter ukuran, pengurutan dan empat halaman langsung mengantar ke produk. Filter kosong mempunyai reset yang juga menghapus pencarian.
- Kartu: foto kuning menjadi tampilan awal, foto pemakaian sebagai hover alternatif, reveal tautan detail dan tombol favorit. Tautan HTML tetap dapat dibuka di tab baru; klik biasa memakai navigasi aplikasi agar keranjang tamu tidak hilang.
- Detail: galeri besar dengan thumbnail, panah, swipe horizontal mobile dan lightbox. Lightbox mendukung Escape, keyboard dan penguncian fokus. Informasi harga, material, potongan, ukuran, pemesanan dan rekomendasi dipisahkan secara jelas.
- Bar tindakan mobile mengikuti visibilitas area pembelian. Size chart lama dipulihkan (33/36/39/42/45 cm lebar dan panjang); ukuran pada tabel bisa langsung dipilih. Cara mengukur dan toleransi 1-2 cm tetap dijelaskan.
- Kainora Park memiliki opsi foto / 3D memakai model dan sablon yang sudah tersedia. WebGL dimuat saat dipilih, dimatikan setelah kembali ke foto, dan berhenti merender di luar area pandang. Motif lain tidak memakai sablon 3D pengganti.
- Motion menangani reveal, perubahan grid/filter, foto dan bar tindakan. CSS menangani hover singkat. Preferensi reduced-motion dihormati; scroll tidak dibajak.
- Tidak ada diskon rekaan, countdown, stok palsu atau ulasan sintetis. Ulasan hanya berasal dari data yang dapat dibaca akun pembeli; akses dan checkout Firebase tidak diubah.

## SEO teknis

- URL katalog `/products/`, `/products/page/2/` dan seterusnya. URL produk `/products/nama-motif--id/`; ID lama numerik dan ID baru string didukung. Alias query lama tetap terbaca dan diarahkan ke URL canonical pada aplikasi.
- Detail dapat dibuka langsung, di-reload dan dinavigasikan kembali lewat riwayat browser. Perpindahan antarproduk juga mempunyai entri riwayat.
- `scripts/build-products.mjs` menghasilkan HTML statis 42 detail + empat katalog dari JSON yang sama dengan admin, setelah build Vite/journal. Nama, harga, foto, deskripsi dan tautan dapat dibaca tanpa menunggu JavaScript.
- Metadata judul/deskripsi/Open Graph/canonical per produk, schema Product/Offer, CollectionPage/ItemList dan BreadcrumbList. Offer tidak mengarang availability; harga kosong tidak dikonversi menjadi nol; ulasan dummy tidak menjadi aggregateRating.
- Satu script `commerce-jsonld` diperbarui saat navigasi untuk menghindari schema lama tertinggal. JSON diserialisasi dengan perlindungan penutup tag script.
- `sitemap-products.xml` mencakup 46 URL, juga ditambahkan ke sitemap utama. URL pesanan privat/alias lama tidak dimasukkan sebagai halaman produk yang perlu diindeks. Lastmod tidak dibuat tanpa data perubahan resmi.
- `404.html` statis tanpa entry JavaScript memakai noindex. Cloudflare Pages menggunakan berkas tersebut untuk rute yang tidak ditemukan; perilaku production belum diuji karena website belum diterbitkan.
- Preload hero beranda dibatasi ke beranda agar halaman produk tidak mengunduh gambar hero yang tidak dipakai.

## Bukti dan batas pengujian

- `npm run test:shop`: lima pengujian domain untuk URL, Unicode/ID string, filter gabungan, urutan harga kosong, schema aman dan integritas semua aset/harga.
- Test admin 17, affiliate 3 dan buyer 3 tetap lulus. Scoped ESLint tanpa error.
- Build Cloudflare lulus. `node scripts/verify-products-build.mjs` memeriksa 42 HTML, harga/foto mentah, deskripsi unik, canonical, breadcrumb, pagination, 46 URL sitemap dan 404.
- Browser: katalog/search/reset/pagination, detail direct/reload/legacy URL, pindah produk dan back, galeri panah/lightbox/keyboard/swipe, panduan ukuran, bar mobile dan layout 320/390/1440.
- Fixture lokal sementara mengisi ukuran 5-6Y dan stok tiga: tombol menuntut ukuran, jumlah berhenti pada stok, tiga produk masuk keranjang dengan subtotal Rp207.000. Fixture dipulihkan sesudah pengujian; tidak ada pesanan, pembayaran atau pengguna produksi yang dibuat.
- Pratinjau 3D diuji pemuatan berdasarkan klik serta pelepasan canvas saat kembali ke foto. Peringatan deprecation THREE.Clock dari viewer lama masih ada; tidak ada error aplikasi baru pada pemeriksaan halaman baru.
- Belum ada pengukuran Lighthouse/Core Web Vitals produksi, pengujian Google Rich Results pada domain live atau verifikasi indeks/ranking. Fondasi teknis tersebut tidak sama dengan sertifikasi hasil Google.

## Referensi

- [Motion: layout animations](https://motion.dev/docs/react-layout-animations), [AnimatePresence](https://motion.dev/docs/react-animate-presence).
- [21st.dev: Product Reveal Card](https://news.21st.dev/@isaiahbjork/components/product-reveal-card), [Spatial Product Showcase](https://news.21st.dev/@daiwiikharihar/components/spatial-product-showcase). Dipakai untuk arah interaksi, tanpa menyalin paket berbayar.
- [Google: Product snippets](https://developers.google.com/search/docs/appearance/structured-data/product-snippet), [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).
- [Cloudflare: serving pages/404](https://developers.cloudflare.com/pages/configuration/serving-pages/).

Tidak ada commit, push, deployment website, perubahan DNS atau billing dalam pekerjaan ini.

## Koreksi UX setelah tinjauan pemilik

- Bingkai foto besar dihilangkan: galeri persegi tanpa padding foto, sudut membulat ringan, thumbnail berlabel dan navigasi di luar gambar. Foto kuning asli tetap utuh.
- Kaca pembesar 2,5x pada perangkat dengan mouse menggunakan koordinat kursor dan motion values. Touch memakai tap/swipe.
- Popup dipasang melalui portal agar tidak terpotong transform/sticky galeri. Backdrop fade/blur, panel spring masuk/keluar, panah keyboard, Escape, focus trap dan pengembalian fokus tersedia. Reduced-motion meniadakan pergerakan.
- Teks isi detail 16 px, judul accordion 17 px, spesifikasi 15 px, warna lebih gelap. CTA desktop dan mobile diperbesar.
- Koreksi ukuran menggantikan keputusan impor awal yang mengosongkan ukuran; ukuran tidak seharusnya hilang dalam pekerjaan desain.

### Verifikasi koreksi

- Build Cloudflare, 28 tes (shop 5, admin 17, affiliate 3, buyers 3), scoped ESLint dan pemeriksaan 42 HTML statis lulus.
- Browser hasil build: hero lama tidak ada; 12 kartu per halaman, CTA 13 px, detail 16 px. Size chart memilih ukuran dan menutup modal, tombol tanpa ukuran meminta pilihan, produk masuk keranjang lokal dengan ukuran yang dipilih.
- Lens 2,5x, popup spring, perpindahan foto, Escape dan siklus Tab/Shift+Tab diuji. Fokus kembali ke pembuka popup.
- Touch 390 px serta lebar 320 px tidak meluber; chart dapat discroll vertikal. Reduced-motion tidak memakai transform popup; sticky CTA menghilang saat area beli terlihat. Produk satu foto tidak mempunyai panah palsu. Kainora Park memuat canvas saat 3D dipilih lalu melepasnya saat kembali ke foto.
- Gambar bukti `product-v5-desktop.png`, `product-v5-mobile.png`, `product-v5-magnifier.png`, `product-v5-lightbox.png`, `product-v5-sizechart.png`, dan `catalog-v5-desktop.png` tersimpan di folder laporan ini.
- Belum diterbitkan; tidak membuat pesanan/pembayaran atau mengubah stok produksi.

- Penyesuaian berikutnya: pemilik menilai kaca pembesar terlalu kuat; faktor dikurangi dari 2,5x ke 1,6x. Label dan perhitungan memakai satu konstanta. Lima tes shop serta hover browser memverifikasi ukuran baru.
