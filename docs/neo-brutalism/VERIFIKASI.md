# Redesign Kainora Kids — 21 Oktober 2026

## Versi terkini: poster neo brutalism untuk toko baju anak

Revisi ini mengikuti masukan terakhir pengguna. Arahan checkerboard besar, lantai perspektif, preloader, dan sapuan checkerboard dari brief awal digantikan oleh komposisi poster dengan penekanan pada foto produk. Screenshot dengan nama v2 adalah arsip iterasi sebelumnya.

## Tampilan yang diterapkan

- Header ringkas memakai logo Kainora, bingkai krem, navigasi aktif, pencarian, wishlist, dan keranjang.
- Hero KAINORA / KIDS CLUB. mengikuti hierarki poster referensi: huruf hitam besar, panel foto pink, panel Sunshine, aksen bunga, dan empat benefit kecil.
- Galeri editorial manual menyediakan dua foto koleksi dan tiga banner lama. Tidak berpindah otomatis.
- Section motif Sunshine, Breakfast, dan Kids Club mendahului grid delapan produk. Kategori Boys/Girls menyusul sebagai dua panel foto besar.
- Cerita kualitas memakai tiga kartu sejajar, lalu video workshop tanpa penutup animasi, panel affiliate/TikTok, galeri Instagram, dan footer.
- Semua sapuan checkerboard pada kartu produk, foto, video, serta perpindahan halaman dihapus dari pohon render. Checkerboard tersisa hanya sebagai aksen statis tipis: strip 8 px dan tepi footer 5 px. Pola memakai ukuran tile tetap tanpa peregangan.
- Foto produk langsung terlihat. Pergantian foto saat hover dan animasi teks ringan tetap tersedia; preferensi reduced motion tetap dihormati oleh komponen Motion.

## Foto dari public

Delapan entri katalog bawaan kini memakai aset lokal dan nama motif yang sesuai:

| Produk | Foto utama | Foto tambahan |
| --- | --- | --- |
| Sunshine | /sunshine-2.jpg | /sunshine-1.jpg |
| Breakfast Morning Club | /breakfastmorning-2.jpg | /breakfastmorning-1.jpg |
| Kids Club | /kidsclub-1.jpg | — |
| Kainora Park | /kainorapark-2.jpg | /kainorapark-1.jpg |
| Born to Play | /borntoplay-1.jpg | — |
| Be You | /beyou-2.jpg | /beyou-1.jpg |
| Love Peace Joy | /lovepeach-2.jpg | /lovepeach-1.jpg |
| Hello World | /helloworld-2.jpg | /helloworld-1.jpg |

Nama Love Peace Joy mengikuti teks pada foto meskipun nama berkasnya lovepeach. Foto model diperbesar melalui CSS pada kartu agar tulisan iklan di bagian bawah sumber tidak mendominasi. File gambar tidak diubah. Galeri detail tetap menyediakan gambar lengkap.

ID, harga, ukuran, kategori, data penjualan, dan mekanisme sinkronisasi yang sudah ada dipertahankan. Harga dan metadata tersebut berasal dari data bawaan lama, belum divalidasi terhadap daftar harga/stok resmi. Tidak ada perubahan dokumen Firestore; produk dari Firestore tetap mengikuti mekanisme override sebelumnya.

## Skill project yang dipakai

- .claude/skills/neo-brutalism/SKILL.md — outline, flat color, hard shadow, respons tekan.
- .claude/skills/ui-ux-pro-max/SKILL.md — hierarki, ukuran layar, akses keyboard, dan touch target.
- .claude/skills/motion/SKILL.md beserta panduan React/CSS — pemakaian Motion yang sudah tersedia dan reduced motion.
- .claude/skills/brutalism/SKILL.md dibaca sebagai pembanding; implementasi mengikuti neo brutalism yang diminta pengguna.

Tidak ada dependency baru.

## Pemeriksaan yang dilakukan pada browser lokal

- Lebar 320, 375, 768, 1024, 1440, dan 1920 px: scrollWidth sama dengan clientWidth; tidak ada overflow horizontal halaman atau elemen hero yang diperiksa.
- Screenshot desktop 1440, tablet 768, dan mobile 375 px diambil dan diperiksa secara visual. Grid produk empat kolom di desktop dan dua kolom di mobile.
- Seluruh 14 gambar pada delapan kartu produk berhasil dimuat, semuanya dari public. Tidak ditemukan gambar rusak pada halaman yang dimuat.
- Tombol galeri berikutnya mengganti shop-boys ke shop-girl; tombol sebelumnya mengembalikan foto awal.
- Menu mobile membuka katalog dan menampilkan delapan produk lokal tanpa overflow.
- Kartu Sunshine membuka quick view, lalu detail lengkap. Tambah keranjang menampilkan Sunshine ukuran 1-2Y, jumlah 1, Rp89.000. Checkout menampilkan produk, ukuran, jumlah, subtotal, dan total yang sama. Form pesanan tidak dikirim.
- Video workshop benar-benar diputar: currentTime melewati 0,8 detik, readyState 4, tanpa media error; lalu dihentikan.
- Console browser pada mode normal: 0 error dan 0 warning. Uji reduced motion memastikan judul tetap terlihat; Motion menampilkan satu warning pengembangan yang memang menginformasikan bahwa reduced motion aktif, tanpa error aplikasi.
- Build produksi berhasil. ESLint pada file yang diubah di revisi ini: 0 error dan 0 warning. Ini bukan klaim bahwa semua lint historis seluruh repositori sudah bersih.

## Screenshot versi terkini

- poster-v3-1440.png
- poster-v3-768.png
- poster-v3-375.png
- products-v3-1440.png
- products-v3-375.png
- catalog-v3-375.png
- quality-v3-1440.png
- video-v3-1440.png
- footer-v3-1440.png

Pengujian terbatas pada aplikasi lokal. Pembayaran, pengiriman WhatsApp, layanan AI, dan penulisan produksi tidak diuji. Tidak ada deploy atau publish pada revisi ini.
