# Audit beranda dan revisi produk — 22 Oktober 2026

Beranda sebelumnya belum cukup menonjolkan produk. Grid belanja terlalu jauh dari pembukaan, sementara manifesto memakan ruang besar. Revisi menempatkan 12 pilihan tepat setelah manifesto, memperjelas foto, nama, harga yang tersedia, serta tindakan memilih ukuran.

## Temuan dan perbaikan

- Pada viewport 1440 × 960, awal grid produk sebelumnya sekitar 10.909 px dari atas halaman. Setelah revisi menjadi sekitar 1.680 px. Manifesto desktop dipadatkan dari sekitar 2.544 menjadi 720 px. Pada 390 × 844, section produk mulai sekitar 1.105 px. Angka bergantung viewport dan kondisi render.
- Grid sebelumnya hanya memuat delapan produk. Kini memuat 12 motif berbeda: Sunshine, Breakfast Morning Club, Kids Club, Kainora Park, Born to Play, Be You, Love Peace Joy, Hello World, Avocado, Cherry Harvest, Good Life, dan Candy.
- Semua sampul utama memakai foto produk resmi berlatar kuning (`*-1.jpg`). Sepuluh pilihan memiliki foto kedua; dua pilihan hanya memiliki satu foto. Total 22 file foto tersedia dan jalurnya diperiksa. File sumber tidak diubah.
- Card memakai foto persegi, judul tebal, pemisahan informasi lebih jelas, CTA yang selalu terlihat, tombol foto kedua, dan tombol favorit untuk produk katalog yang terdaftar.
- Animasi memakai spring, reveal per card, perpindahan filter dengan layout animation, crossfade foto, serta respons hover/press. Aksi foto kedua tersedia lewat sentuhan dan keyboard. Tidak ditambahkan sapuan checkerboard.
- CTA utama hero menuju `#products`. Grid lama di bagian bawah dihapus dari render beranda sehingga tidak ada duplikasi ID.
- Modal membedakan produk dengan data pemesanan dari motif yang baru memiliki foto. Tombol tambah keranjang baru aktif setelah ukuran dipilih.
- Tautan Instagram footer aktif dan footer lama diperbaiki menjadi `https://www.instagram.com/kainorakids/`, sesuai konfirmasi pengguna.

## Bukti pemeriksaan

- Build produksi berhasil; generator halaman blog tetap menghasilkan 71 halaman artikel.
- Lint seluruh proyek: **0 error, 187 warning**. Warning yang masih ada tidak dinyatakan selesai. Lint komponen utama yang direvisi berhasil tanpa error.
- Lebar 320, 390, 768, 1024, 1440, dan 1920 px diperiksa. Grid memakai dua kolom pada mobile, tiga pada tablet, dan empat pada desktop; tidak ditemukan overflow horizontal pada pemeriksaan tersebut.
- Susunan DOM memastikan manifesto langsung diikuti section `#products`; terdapat 12 ID unik dan semua foto pertama berakhiran `-1.jpg`.
- Filter menghasilkan 12 semua pilihan, 10 pilihan dengan foto lengkap, dan 8 pilihan dengan ukuran. Pencarian motif, kondisi kosong, serta reset berfungsi.
- Sunshine: modal membuka foto kuning terlebih dahulu; pemilihan ukuran mengaktifkan tambah keranjang. Ukuran, kuantitas, dan subtotal muncul di keranjang. Escape, pengembalian fokus, serta pemulihan scroll halaman diperiksa.
- Avocado: modal menampilkan foto dan keterangan belum lengkap, tanpa harga rekaan atau tombol tambah keranjang.
- Pergantian foto melalui hover desktop dan tombol mobile diperiksa. Crop foto model pada card dan modal ditinjau agar wajah dan footer iklan foto tidak masuk bingkai.
- Product theater, navigasi coverflow termasuk keyboard, dan navigasi maju/mundur gallery diperiksa. Tautan hero berhenti di section produk dengan jarak aman dari navbar.
- Reduced motion: manifesto menjadi satu pesan ringkas, transform card dinonaktifkan, dan smooth scroll dinonaktifkan. Tidak ditemukan exception JavaScript pada pemeriksaan akhir alur beranda.

Tangkapan layar: `home-products-desktop-v3.png`, `home-products-mobile-v3.png`, dan `home-quick-view-v3.png` di folder ini. Screenshot adalah bukti kondisi render tertentu, bukan jaminan seluruh keadaan aplikasi.

## Batas dan pekerjaan yang masih membutuhkan data

- Harga dan ukuran delapan produk mengikuti data pratinjau lama aplikasi; belum diverifikasi terhadap daftar komersial resmi. Keterangan pratinjau tersedia pada modal. Blok keterangan di atas grid telah dihapus sesuai revisi pengguna.
- Empat motif tambahan memakai foto asli, tetapi belum mempunyai harga, ukuran, dan detail pemesanan. Karena itu tampil sebagai pratinjau motif, bukan SKU siap dibeli. Data resmi diperlukan sebelum aktivasi pemesanan.
- Newsletter masih merupakan pratinjau tanpa endpoint pengiriman. Validasi formulir tidak membuktikan email terkirim.
- Pembayaran, sinkronisasi stok, ongkos kirim, dan transaksi produksi tidak diuji dalam revisi ini. Pengujian beranda tidak membuktikan seluruh toko bebas bug.
- Tidak dilakukan pengukuran FPS pada perangkat fisik atau audit Lighthouse formal; jangan menganggap target performa sebagai hasil pengukuran.

## File utama

- `src/pages/HomeView.jsx`: urutan section.
- `src/components/fashion/FeaturedEdit.jsx` dan `featured-edit.css`: grid, card, filter, pencarian, motion, dan crop.
- `src/constants/featuredProducts.js`: pemilihan 12 motif dan fallback foto tanpa metadata komersial rekaan.
- `src/utils/productMedia.js`: prioritas foto produk kuning.
- `src/components/fashion/Scenes.jsx`: manifesto ringkas dan CTA hero.
- `src/components/fashion/Commerce.jsx`: penggunaan foto dan modal belanja.
- `src/components/neo/ProductCard.jsx`: konsistensi foto utama katalog.
- `src/components/fashion/HalftoneFooter.jsx` dan `src/components/layout/Footer.jsx`: tautan Instagram.

## Rujukan gerak

- [Framer: hover dan press](https://www.framer.com/academy/lessons/framer-animations-hover-and-press-effects): respons interaksi yang terarah dan tidak menggeser layout.
- [Motion: useSpring](https://motion.dev/docs/react-use-spring), [transitions](https://motion.dev/docs/react-transitions), dan [accessibility](https://motion.dev/docs/react-accessibility): spring, transisi yang dapat diinterupsi, serta reduced motion.
- [21st.dev: card animation](https://21st.dev/community/components/explore/card-animation-react): eksplorasi pola card. Tidak menyalin komponen berbayar atau menambahkan dependency baru.

## Revisi tampilan lanjutan

Blok pembuka di atas filter dihapus sesuai screenshot pengguna. Card memiliki sudut luar kotak dan border 1 px yang lebih tegas pada desktop maupun mobile. Product Theater (A Closer Look) dipindahkan menjadi section yang langsung mengikuti 12 produk.
