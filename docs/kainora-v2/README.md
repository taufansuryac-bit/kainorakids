# Kainora Kids V2 — implementasi dan verifikasi

## Revisi blog / Journal — 21 Oktober 2026

Blog dan halaman baca kini mengikuti arah V2. Header/footer blog lama yang menduplikasi navigasi toko, slideshow otomatis, warna oranye, serta panel promosi berulang diganti dengan masthead editorial, sorotan asimetris, arsip artikel, dan tautan koleksi. Logo, header toko, footer V2, Firebase `articles`, serta route `?view=blog` dipertahankan.

Source: `src/pages/BlogView.jsx`, `src/journal.css`, `src/utils/journal.js`, dan arsip data contoh `src/constants/blogPosts.js`. Satu perubahan pada inisialisasi history di StoreContext mempertahankan parameter artikel setelah refresh. Artikel memakai URL `?view=blog&article=ID`; alias lama `id` tetap dibaca. Preload hero hanya berjalan pada beranda agar halaman artikel tidak memuat gambar yang tidak dipakai. Metadata artikel dibersihkan saat berpindah halaman.

Pemeriksaan yang benar-benar dilakukan:

- Listing pada lebar 320, 390, 768, 1024, 1440, dan 1920 px: `scrollWidth === clientWidth`. Halaman baca diperiksa pada 320, 390, 768, dan 1440 px. Screenshot desktop/mobile dibuka; crop foto sorotan diperbaiki agar kepala tidak terpotong.
- Pencarian `sayur` menghasilkan satu artikel; kategori FASHION menghasilkan lima. Reset mengembalikan 26 catatan contoh. Pencarian tanpa hasil menampilkan empty state. Pagination benar-benar mengganti isi: halaman kedua 9 artikel, terakhir 8, tombol lanjut nonaktif pada halaman 3/3.
- Enter pada tautan membuka artikel; fokus pindah ke judul. Browser Back/Forward, tautan kembali, serta refresh pada `article=5` mempertahankan artikel yang dimaksud. Kembali ke arsip memulihkan halaman pagination, posisi scroll, dan fokus pada tautan artikel asal.
- Salin tautan diuji setelah izin clipboard diberikan pada context browser QA; nilai clipboard cocok dengan URL artikel. Dukungan izin tetap mengikuti browser pengguna.
- Reduced motion menghasilkan computed transform `none` pada judul. Satu landmark main dan satu footer terverifikasi. Dua belas gambar yang dimuat tidak broken; console navigasi akhir menghasilkan 0 error/0 warning.
- CTA koleksi membuka katalog 8 produk; smoke check beranda tetap menemukan hero dan preload yang tepat.
- Parser rich text diuji dengan fixture DOM berisi heading, gambar, script, iframe, SVG, event handler, style, dan tautan javascript. Heading/daftar isi serta gambar lokal bertahan; elemen/atribut berbahaya pada fixture dihapus. Ini pemeriksaan fixture, bukan audit keamanan formal atau bukti artikel produksi.
- Build setelah perubahan berhasil. Lint file blog baru beserta utilitas terkait: 0 error/0 warning. Lint seluruh project: 0 error, 187 warning pada area lama; lihat `journal-lint.log`. Angka 197 pada laporan awal V2 di bawah adalah baseline sebelum penggantian blog lama.

**Batas data:** pengujian tampilan memakai 26 artikel contoh yang sudah ada sebelumnya. Foto contoh memakai empat aset konsep lokal yang sudah tercatat provenance-nya, bukan foto artikel resmi. UI menandai konten contoh, memberi `noindex, follow`, dan tidak membuat BlogPosting schema untuk contoh. Naskah yang tidak tersedia tidak lagi diganti paragraf generik. Koneksi baca Firebase dipertahankan; bila lambat, preview tersedia setelah batas tunggu 4,5 detik sementara request tetap berjalan. Tidak ada artikel resmi baru ditulis ke database, dan tidak ada klaim pengujian penerbitan artikel produksi. Tidak ada deploy atau commit.

Screenshot: `journal-1440.png`, `journal-390.png`, `journal-archive-1440.png`, `journal-article-1440.png`, dan `journal-article-390.png`.

21 Oktober 2026. Implementasi langsung pada React 18 / Vite yang sudah ada, tanpa project baru dan tanpa dependency baru. `newkainorapage.md` tetap salinan utuh master pengguna; hash SHA-256 cocok dengan sumber.

## Status per section

| No. | Section | Implementasi dan pemeriksaan |
| --- | --- | --- |
| 00 | Type remix preloader | Logo resmi dibagi mask, stagger, meter, shutter CSS. Sekali per sesi; terukur sekitar 1,95 detik dari kemunculan sampai pelepasan DOM. Reduced motion dan deep link katalog melewati intro. |
| 01 | Editorial hero | Judul SMALL FITS. BIG ENERGY., foto dominan, reveal garis dan foto, pointer/scroll parallax, CTA koleksi dan indikator scroll. Mobile disusun ulang dengan CTA sebelum foto. |
| 02 | Kinetic manifesto | Tiga frasa penuh dengan clipping, scale dan translate berbasis progres scroll. Pinned dan dapat berbalik; mobile/reduced motion memakai tiga frasa statis. |
| 03 | Horizontal collections | Empat panel; jarak track dihitung dari DOM, resize, image load dan font readiness. Progres/index/keyboard; mobile dan reduced motion memakai native scroll-snap tanpa scroll trap. |
| 04 | Product theater | Lima produk katalog, indeks, pilihan produk/foto/ukuran, warna dari data, zoom, spring pointer depth, idle 3 px saat terlihat. Metadata berganti bersama produk. Add-to-cart hanya aktif setelah memilih ukuran yang ada. |
| 05 | Product rotation | Carousel terpisah, perspektif, spring, projected release velocity dan snap ke pilihan terbatas. Tombol, drag mouse dan keyboard diuji. Tidak ada loop ujung yang melompat. |
| 06 | Expanding lookbook | Tiga foto dengan waktu masuk dan arah berbeda; panel tengah memakai clip yang membuka ke panggung lebar. Scroll balik mengembalikan komposisi; mobile/reduced motion memakai rail native. |
| 07 | Campaign chapter | Foto kampanye bergerak dari inset menuju full bleed, parallax/scale dan headline bermask. Mobile memisahkan teks/foto agar wajah dan CTA terbaca. |
| 08 | Shop grid | Delapan produk sumber yang sama, empat kolom desktop dan dua mobile, pencarian, filter gender, wishlist, quick view, ukuran, add-to-cart, mask stagger dan layout transition. |
| 09 | Brand story | Tipografi DESIGNED FOR MOVEMENT., masked lines, studi tekstur material konseptual tanpa label bawaan, parallax dan CTA. Tidak ditampilkan sebagai bukti konstruksi produk resmi. |
| 10 | Community editorial | Empat foto dengan ritme ukuran, native swipe/drag mouse, keyboard, kontrol dan indeks. Caption membedakan konsep kampanye dari arsip brand; tidak ada klaim UGC/testimoni. |
| 11 | Halftone footer | Navigasi/contact/bantuan, validasi email lokal yang jujur tentang status newsletter, wordmark canvas bertitik dengan spring displacement dan click ripple. Mobile/reduced motion memakai wordmark statis. |

## Struktur source

- `src/components/fashion/design.js`: aset dan motion tokens.
- `src/components/fashion/hooks.js`: media query, progres section, native rail, fokus dialog/Escape/body-scroll cleanup.
- `src/components/fashion/motion.jsx`: masked headings, overline, preloader.
- `src/components/fashion/Scenes.jsx`: hero, manifesto, koleksi, lookbook, campaign, brand story, community.
- `src/components/fashion/Commerce.jsx`: theater, carousel, grid dan quick view.
- `src/components/fashion/HalftoneFooter.jsx`: footer dan status newsletter.
- `src/fashion.css`: sistem putih–hitam, aksen lime, komposisi dan breakpoint.
- `src/pages/HomeView.jsx`, `src/App.jsx`, `src/main.jsx`: wiring ke aplikasi yang sama.
- Integrasi lain: `src/components/layout/Navbar.jsx`, `src/components/neo/HalftoneWordmark.jsx`, `src/components/ui/Modals.jsx`, `src/context/StoreContext.jsx`, `src/pages/ProductDetailView.jsx`, `src/pages/AllReviewsView.jsx`, `src/pages/CartView.jsx`, `src/pages/CheckoutView.jsx`, `src/utils/seoHelpers.js`, `tailwind.config.js`, dan `index.html`. Layanan Firebase dan rute dipertahankan.

## Data dan batas demo

Delapan seed produk lama belum memiliki harga/stok yang tervalidasi. Foto dari public tetap digunakan; data harga, ukuran, ID, gender dan mekanisme override Firestore dipertahankan. Seed dikenali berdasarkan sumber objek dan ditandai `catalogPreview` saat ditambahkan ke keranjang. Data produk yang datang dari Firestore tetap melalui jalur yang sudah ada.

Keranjang dan ringkasan checkout dapat dicoba. Item contoh tidak dapat dikirim menjadi pesanan: UI dan submit handler checkout menahan pengiriman jika item bertanda preview. Jalur pesanan produk non-preview tetap ada; tidak diuji dengan pesanan sungguhan. Ini penjagaan pada aplikasi klien, bukan pengganti validasi server/inventory produksi.

Ulasan buatan, tambahan angka 850, viewer acak, rating 4,9/854 statis, stok dan ketentuan pengiriman/retur schema yang tidak bersumber dihapus dari permukaan terkait. Pengambilan ulasan asli Firestore tetap ada. Offer pada metadata hanya dibuat untuk produk non-preview; status stok hanya saat angka stok tersedia. Rating schema dihitung dari ulasan nyata, bukan default.

Newsletter belum memiliki endpoint pengiriman. Form hanya memvalidasi email dan menyatakan bahwa email tidak dikirim. Login UI diperiksa untuk fokus dan Escape; login produksi, pembayaran, pengiriman WhatsApp dan penulisan order sungguhan tidak dijalankan.

## Aset

Empat raster baru dibuat dengan built-in Codex image_gen: hero-editorial, look-01, campaign-wide dan brand-material. PNG asli serta WebP pada dimensi yang sama disimpan di `public/images/kainora-generated/`. Total empat WebP sekitar 531 KB; hero sekitar 82 KB. Prompt, ukuran, pemakaian ulang dan provenance tersedia di `ASSET_MANIFEST.md` pada folder itu.

Gambar tersebut adalah GENERATED_CONCEPT, bukan SKU atau foto pelanggan. Logo dan foto produk pengguna tidak diregenerasi. CSS mempertahankan lebar/rasio cetak produk dan memotong area iklan bawah pada sumber foto model; foto lengkap tetap bisa dibuka di detail.

## Pemeriksaan browser yang benar-benar dilakukan

- Lebar 320/390/768/1024/1440/1920 px: scrollWidth sama dengan clientWidth. Orientasi 390×844 → 844×390 → 390×844 diperiksa. Viewport 1440×650 menampung sticky gallery 572 px tanpa konten keluar dari tingginya.
- Preloader diukur lewat MutationObserver; transisi masuk terlihat, node dilepas sekitar 1,95 detik, kunjungan berikutnya melewati intro. Reduced motion melewatinya.
- Scroll manifesto pada tiga fase dan kembali; computed clip/style diperiksa. Gallery desktop mencapai x=0 dan x=-1480 px pada viewport 1440, dengan track 2905 px dan viewport 1425 px. Perhatikan bahwa Motion dapat memakai WAAPI: inline style saja bukan bukti frame yang terlihat.
- Carousel: tombol berpindah ke Breakfast, keyboard berpindah ke Kids Club, drag nyata memindahkan Sunshine ke Breakfast. Input berulang berhenti di ujung dan menonaktifkan tombol berikutnya.
- Theater: thumbnail Breakfast mengubah judul/harga; FOTO 2 membuka breakfastmorning-1.jpg; ukuran 3-4Y mengaktifkan cart. Tidak ada kontrol belakang atau 360 palsu.
- Pencarian Sunshine menghasilkan satu produk. BOYS dan GIRLS masing-masing menghasilkan enam produk dengan isi berbeda; SEMUA mengembalikan delapan.
- Produk Breakfast ukuran 3-4Y masuk cart: jumlah 1/2/1 memberi total Rp149.000/Rp298.000/Rp149.000. Checkout mempertahankan produk, ukuran dan total. Setelah penjagaan preview ditambahkan, notifikasi preview dan tombol submit nonaktif juga diverifikasi.
- Quick view fokus ke tombol tutup; Escape menutup dan memulihkan fokus. Dialog login, info toko, serta lightbox produk diperiksa dengan keyboard. Halaman home memiliki satu landmark main.
- Menu mobile membuka katalog delapan produk tanpa overflow. Galeri koleksi mobile/reduced motion dapat digerakkan dengan keyboard/native rail; perpindahan breakpoint menyelaraskan indeks.
- Pada context browser dengan `isMobile` dan `hasTouch`, pointer coarse terverifikasi. Swipe CDP menggeser galeri 247 px dan mengganti carousel Sunshine ke Breakfast. Ini simulasi touch browser, bukan perangkat fisik.
- Invalid email ditolak validasi native; email berformat valid hanya menampilkan status lokal. Tidak ada email dikirim.
- Canvas footer bereaksi terhadap pointer/klik: checksum pixel berubah. Tidak ada klaim angka FPS atau MotionScore.
- Screenshot desktop dan mobile di folder ini dibuka dan diperiksa; crop wajah, cetakan produk, CTA dan fase animasi diperbaiki berdasarkan hasilnya. Gambar yang dimuat tidak menunjukkan broken image.

## Build, lint dan batas verifikasi

`npm run build` berhasil. Lint pada source V2 baru dan file integrasi yang diperiksa menghasilkan 0 error/0 warning (lihat `lint-v2.log`). Lint seluruh project menghasilkan 0 error dan 197 warning lama pada area lain (lihat `lint.log`). Tidak ada script typecheck atau unit-test yang dikonfigurasi; tidak dipasang runner baru untuk mengklaim pengujian tambahan.

Tidak ada deploy/publish. Tidak ada klaim audit aksesibilitas formal, pengujian perangkat fisik, 60 FPS yang terukur, Lighthouse, atau kesiapan backend produksi. Pengujian responsif memakai browser desktop dengan viewport yang diubah, interaksi pointer/keyboard, dan context mobile dengan touch yang disimulasikan; ini tidak setara dengan sertifikasi pada semua perangkat sentuh.

## Referensi mekanik

Dokumentasi primer [useScroll](https://motion.dev/docs/react-use-scroll), [useTransform](https://motion.dev/docs/react-use-transform), [useSpring](https://motion.dev/docs/react-use-spring), [layout animation](https://motion.dev/docs/react-layout-animations), dan [AnimatePresence](https://motion.dev/docs/react-animate-presence) diakses. Implementasi memakai paket Motion yang sudah tersedia.

Halaman Framer Animated Gallery, Scroll Reveal Fly-in dan Scroll Reveal Slider diakses pada tingkat deskripsi. Halaman 21st.dev untuk type remix dan halftone hanya mengembalikan shell/metadata, bukan source komponen lengkap. Tidak ada source berbayar atau berlisensi tidak diketahui yang disalin. Prototype HTML pengguna dibaca sebagai referensi; produk demo, faux checkout dan data contohnya tidak dijadikan backend toko.
