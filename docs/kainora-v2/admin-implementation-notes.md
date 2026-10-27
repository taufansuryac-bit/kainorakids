# Hasil implementasi dan batas verifikasi — 22 Oktober 2026

## Sudah tersedia

- Panel lokal: `http://127.0.0.1:5174/?view=admin` melalui `npm run dev:admin`.
- Katalog produk, pemilihan/urutan maksimal 12 highlight home, serta koleksi 3D terpisah: PNG, putih/hitam, tampilan awal depan/belakang dan tautan produk opsional.
- Penyimpanan lokal nyata; adapter online GitHub App dan Cloudflare Pages Functions sudah ditulis. Publish online menghasilkan commit atomik dan menolak konflik revisi.
- Firebase khusus [Kainora Kids Store](https://console.firebase.google.com/project/kainora-kids-store/overview): Spark, billing mati, Firestore Standard free tier Jakarta. Email/password dan Google aktif; aturan kepemilikan data sudah diterapkan.
- Profil, keranjang/wishlist dan pesanan memakai UID. Checkout menyimpan permintaan pending sebelum melanjutkan konfirmasi WhatsApp; kegagalan simpan mempertahankan keranjang.

## Bukti pengujian

- `npm run build:cloudflare`: berhasil; 298 file keluaran memenuhi batas 25 MiB/file. Dua salinan video lama yang tidak direferensikan tidak disertakan pada build Cloudflare; sumbernya tetap ada.
- `npm run test:admin`: 17/17; `npm run test:buyers`: 3/3; `npm run test:rules`: lulus pada emulator; skenario auto-turn lulus. Scoped ESLint tanpa error.
- Browser desktop/mobile: katalog, urutan highlight, PNG transparan, kaos hitam, simpan lokal dan reload, koleksi enam/satu/kosong, rotasi hanya kaos aktif, admin tanpa konfigurasi terkunci, kegagalan login tidak menjadi login palsu.
- Pengujian aturan memeriksa isolasi pembeli, penolakan profil admin palsu, kepemilikan pesanan dan larangan browser menandai pesanan lunas. Ini tidak membuktikan pembayaran otomatis.
- Semua data percobaan sudah dibersihkan. Sumber dikembalikan ke 12 produk, 12 highlight dan 5 kaos 3D.

## Belum aktif atau belum terbukti

- Website belum di-push atau diterbitkan ke Cloudflare. Akun Cloudflare, instalasi/secret GitHub App, integrasi build dan domain menunggu langkah pada [panduan aktivasi](admin-online-setup.md).
- Login akun sungguhan/popup Google dan checkout pada domain live belum diuji. Nomor WhatsApp toko perlu dikonfigurasi sebelum menerima pesanan nyata. Harga/ongkir masih dikonfirmasi manual; tidak ada payment gateway.
- Pengiriman/edit/hapus review dinonaktifkan. Pengelolaan promo/affiliate dan pembayaran otomatis di luar cakupan CMS ini.
- Tidak ada perubahan DNS, billing, commit/push checkout atau rotasi credential. Auth dan rules Firebase merupakan pengecualian yang secara eksplisit disetujui pemilik.
- [Laporan key](github-secret-audit-2026-10-22.md) mencatat audit terbatas repo publik, risiko variabel AI pada frontend, dan token di remote Git lokal yang harus diganti. Tidak ada klaim seluruh riwayat GitHub atau produksi bebas secret.
