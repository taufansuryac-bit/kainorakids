# Antarmuka pembeli dan media beranda — 22 Oktober 2026

## Hasil

- Popup masuk, daftar, reset kata sandi, dan edit profil memakai komponen form bersama: label jelas, input 16 px, tampil/sembunyikan kata sandi, status proses, pesan kesalahan, fokus keyboard, Escape dan animasi Motion. Preferensi reduced motion menghilangkan gerak perpindahan modal.
- Keranjang menampilkan motif, ukuran, warna, harga satuan, jumlah dan subtotal; tombol jumlah mengikuti batas stok bila datanya ada serta batas 99. Checkout tidak aktif untuk item yang belum mempunyai data pemesanan lengkap atau sinkronisasi akun yang belum siap.
- Wishlist menggunakan kartu katalog yang sama, tombol hapus favorit, jumlah motif tersimpan dan kondisi kosong/tamu.
- Profil menampilkan informasi pribadi/pengiriman, navigasi pesanan, favorit, keranjang, keluar akun dan form edit. Nama, nomor, alamat, kode pos dan panggilan diizinkan; form tidak dapat mengubah UID/email/role. Kode pos disimpan sebagai teks agar nol awal tidak hilang.
- Identitas tetap berasal dari Firebase Auth. Kegagalan pembacaan profil setelah autentikasi sukses tidak dilaporkan sebagai kata sandi salah. Checkout tetap merupakan permintaan konfirmasi manual, bukan bukti pembayaran.

## Gambar dan video milik pemilik

- Header memakai empat aset: `banner-hero-1.jpg`, `banner-hero-2.jpg`, `banner-hero-3.jpg`, dan `banner-hero-slider-1.jpg`. Salinan WebP disiapkan di `public/images/kainora-owned/` tanpa mengubah file asli. Tiga panorama mempertahankan resolusi 2784×864; gambar taman 1440×600.
- Foto ditumpuk secara absolut pada satu panel kanan dengan ukuran yang identik, `object-fit: cover`. Pergantian setiap 2.500 ms setelah foto siap, fade silang 700 ms, tanpa tombol/pagination/progress/loading carousel. Foto berikutnya didekode sebelum dipilih. Timer berhenti di luar pandangan/tab tersembunyi. Reduced motion memakai pergantian langsung.
- Perbaikan tambahan setelah masukan pemilik: stylesheet khusus slideshow diimpor langsung oleh komponennya agar foto tidak jatuh ke alur dokumen dan tersusun vertikal. Bingkai desktop/mobile sudah diukur sama untuk keempat foto.
- Section movement memakai `VIDEO-WEB-PERJALANAN.mp4`, cerita ibu memilih/memesan, proses pengemasan/pengiriman dan paket diterima. Versi web `public/video/order-journey-web.mp4` adalah 1280×720, 30 fps, 34,33 detik, 10.241.159 byte; audio dibuang dari berkas.
- Video lazy load di dekat viewport, autoplay saat reveal terlihat, muted, playsInline, loop, tanpa kontrol atau tombol putar; berhenti saat keluar pandangan/tab tersembunyi. `object-fit: cover` mengisi penuh lebar desktop/mobile tanpa bar hitam. Konsekuensinya sebagian tepi video panorama terpotong pada layar yang lebih tegak.
- Caption bawah dibuat ringkas agar cerita video tetap menjadi fokus. Poster berasal dari video yang sama; metadata/preload beranda memakai foto sendiri.

## Verifikasi

- Browser desktop 1440 px dan mobile 390 px: keranjang, wishlist, profil, masuk/daftar/reset, toggle password, validasi kode pos, Escape dan pengembalian fokus. Browser 320 px dengan reduced motion: tidak ada horizontal overflow, modal panjang dapat digulir, Tab/Shift+Tab tetap di dalam dialog.
- Data profil/keranjang/wishlist terisi diuji dengan fixture lokal dalam `.cache/` yang diabaikan Git; fixture tidak mempunyai UID, tidak memuat AuthListener dan tidak mengakses data pembeli Firebase. Perubahan qty menghasilkan subtotal Rp207.000 → Rp276.000; hapus favorit 4 → 3.
- Hasil build di preview lokal port 4173 juga diuji melalui alur pembeli tamu nyata: buka produk Sunshine → pilih 1-2Y → tambah keranjang → notifikasi → buka keranjang. Subtotal Rp69.000 menjadi Rp138.000 setelah qty ditambah; menghapus produk mengembalikan kondisi kosong. Tidak mengirim checkout.
- Browser beranda: empat foto berhasil dimuat; posisi/lebar/tinggi identik. Sampel opacity menunjukkan fade dua foto bersamaan. Video desktop selebar 1425/1425 px area konten dan mobile 390/390 px; muted true, controls false, loop true. Lompatan mendekati akhir video terbukti kembali ke awal dan terus berjalan. Keluar section menghentikan pemutaran.
- Tidak ada pageerror pada sesi browser terpisah. Scoped ESLint lulus. `test:admin` 20, `test:shop` 5, `test:affiliate` 3, `test:buyers` 6 dan auto-turn 1: total 35 tes lulus. Build Cloudflare serta verifikasi 42 HTML produk/46 URL katalog-detail lulus.
- Login akun nyata, Google OAuth, pendaftaran, reset email dan simpan profil produksi tidak dijalankan; tidak membuat akun/pesanan uji pada Firebase produksi. Perubahan masih lokal, belum dipublikasikan.

## Tangkapan layar

- `account-login-desktop.png`, `account-login-mobile.png`, `account-register-mobile.png`, `account-edit-mobile.png`.
- `account-cart-desktop.png`, `account-cart-mobile.png`, `account-wishlist-desktop.png`, `account-wishlist-mobile.png`, `account-profile-desktop.png`, `account-profile-mobile.png`.
- `hero-own-slideshow-desktop.png`, `hero-own-slideshow-mobile.png`, `order-journey-desktop.png`, `order-journey-mobile.png`.

Tangkapan dashboard pembeli terisi menggunakan data contoh lokal, bukan akun pelanggan nyata.
