# Revisi tombol dan koleksi — 22 Oktober 2026

- CTA A Closer Look: tombol hitam 264 x 60 px, sudut kotak, panah lime, focus/hover/press. Tujuan tetap detail Kainora Park.
- Find Your Frequency diganti CollectionEdit, judul Pilih Ceritamu dan background terang. Empat tab motif mengubah poster produk resmi berwarna kuning; tidak memakai pinning atau galeri horizontal panjang.
- Desktop dua kolom; mobile memakai pilihan ringkas dua kolom di atas poster. Header dan gambar tetap terbaca pada lebar 320–1920 tanpa overflow horizontal.
- Foto: kainorapark-1.jpg, sunshine-1.jpg, breakfastmorning-1.jpg, beyou-1.jpg. Tidak ada gambar generatif atau metadata produk baru.
- Lihat Motif dicocokkan dengan URL foto pada katalog, kemudian memakai OPEN_PRODUCT. Jika produk tidak ditemukan, tombol membuka katalog; tidak membuka produk yang berbeda sebagai fallback.

## Verifikasi

Build Vite + 71 artikel berhasil. ESLint pada CollectionEdit, Commerce, Scenes dan HomeView lolos tanpa keluaran error/warning. Di browser: pergantian empat motif, detail Sunshine/Morning Club/Be You/Kainora Park, tombol semua motif, keyboard panah/Home/End, dan ukuran CTA diperiksa. Reduced motion memperlihatkan opacity 1 / transform none pada poster. Lebar 320, 390, 768, 1440 dan 1920 diperiksa tanpa overflow horizontal.

Preview build port 4173: tidak ada exception aplikasi atau request HTTP gagal pada alur yang diamati. Ini bukan pengujian checkout atau pengukuran ponsel fisik. Peringatan THREE.Clock dari dependensi 3D yang sudah ada tetap terpisah dari revisi ini.

Screenshot: collection-edit-desktop.png, collection-edit-mobile.png, closer-look-new-cta.png.
