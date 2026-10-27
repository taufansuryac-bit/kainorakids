# Kaos, footer mobile dan logo navbar

22 Oktober 2026 — perubahan lokal.

## Implementasi

- GarmentCanvas memakai skala 0.84 dan jarak rail 1.2 pada canvas di bawah 768px. Pengaturan disimpan pada GARMENT_VIEW. Ukuran dan posisi sablon tetap mengikuti preset sebelumnya. Desktop memakai skala dan gap lama.
- CTA Lihat Produk mobile 198×48px menggantikan 264×60px; tile panah menjadi 36px. Aksi produk tetap sama.
- mobile-refinements.css diimpor setelah fashion.css sehingga aturan responsif tidak tertimpa stylesheet lama. Footer mobile dipadatkan dari sekitar 922px menjadi 788px pada viewport 390px. Wordmark mobile berupa teks SVG yang mengikuti lebar container, bukan teks 22vw yang terpotong. Menu dua kolom mempunyai target sentuh 44px; pesan newsletter kosong tidak memakan ruang. Baris bawah memberi jarak horizontal 54px dari launcher chat.
- File logo asli 400×120px hanya mempunyai isi alpha sekitar x2–398/y22–85. Sebelumnya object-fit contain pada kotak 120×28px turut mengecilkan isi. Wrapper baru menghilangkan padding transparan melalui viewport CSS, menjaga rasio asli dan posisi logo. Artwork tidak diedit atau diganti. Tagline tetap ada.

## Verifikasi

- Build produksi dan ESLint untuk GarmentCanvas, HalftoneFooter, Navbar, garmentViewConfig serta main.jsx lolos.
- Browser Chromium: lebar 320, 360, 390, 430, 768, 1440px; tidak ada overflow horizontal halaman pada ukuran yang diperiksa.
- CTA mobile 198×48px dan desktop 264×60px terukur. Logo mobile 134px / 126px pada layar terkecil; desktop 145px. SVG wordmark mobile tidak tampil pada desktop.
- Tombol kembali ke atas dan launcher chat tidak bertumpuk pada semua lebar tersebut. Tombol kembali ke atas diuji dan menggulir ke awal halaman.
- Navigasi kaos melalui panah mengubah slide 1 menjadi 2; keyboard panah kiri mengembalikan slide 1. Gesture sentuh emulasi pada kaos tengah menghasilkan tampak belakang (lihat mobile-theater-rotated.png), tanpa berpindah slide (tetap 1).
- Tombol Lihat Produk membuka ?view=productDetail. Logo navbar mengembalikan ?view=home. Menu mobile dapat dibuka dan ditutup.
- Wordmark footer tetap tampil pada reduced motion. Hasil build produksi di port 4173 memuat logo dan ukuran CTA baru, dengan stylesheet produksi dan tanpa overflow horizontal pada 390px.
- Tidak ada error console aplikasi pada pemeriksaan ini. Warning THREE.Clock dari dependensi 3D lama masih ada. Uji mobile memakai viewport dan emulasi sentuh Chromium; bukan pengujian perangkat fisik atau Safari/iOS.

## Screenshot

- mobile-theater-smaller.png: tampak depan dengan kaos samping dan CTA kecil.
- mobile-theater-rotated.png: tampak belakang setelah gesture sentuh.
- mobile-footer-refined.png: footer dan logo navbar setelah revisi.
