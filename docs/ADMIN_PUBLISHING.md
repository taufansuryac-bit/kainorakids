# Admin dan publikasi Kainora Kids

Konfigurasi 6 November 2026. Login admin menggunakan akun GitHub `taufansuryac-bit`; login Google/Firebase digunakan untuk akun pembeli.

## Alur pengelola

1. Buka `https://kainorakids.com/?view=admin` dan pilih Login dengan GitHub.
2. Edit katalog, banner promosi, New Arrival, atau koleksi kaos 3D. Simpan perubahan editor ke draft.
3. Klik **Terbitkan** untuk menyimpan satu commit ke branch `admin-production`.
4. GitHub Actions **Publish Kainora** menjalankan pemeriksaan dan build, lalu mengunggah hasil ke proyek Cloudflare Pages `kainorakids` yang sudah ada. Tunggu proses berhasil sebelum memeriksa tampilan publik.

Menyimpan draft belum memublikasikan website. Pesan commit diterima belum berarti deployment selesai. Riwayat proses: https://github.com/taufansuryac-bit/kainorakids/actions . Bila proses gagal, versi publik sebelumnya tetap tersedia; periksa langkah yang gagal sebelum mencoba kembali.

## Gambar

Foto produk dan banner JPG/PNG/WebP diproses di browser menjadi WebP, maksimal 2.048 piksel pada sisi terpanjang, kualitas 90%. Hasil maksimal 4 MB per gambar; sumber unggahan maksimal 20 MB. Desain transparan kaos 3D dan New Arrival tetap PNG. Nama file mengikuti SHA-256; upload disimpan di `public/images/uploads/` bersama commit konten.

## Akses dan rahasia

- GitHub App pribadi **Kainora Kids Admin**, instalasi `179303475`, hanya repositori `taufansuryac-bit/kainorakids`: Contents read/write dan Metadata read.
- Pengelola diizinkan berdasarkan GitHub ID `270434085`. Token pengguna berada di cookie terenkripsi HttpOnly/Secure dengan masa sesi terbatas; kode frontend tidak menerima token tersebut.
- Tujuh pengaturan admin berada di environment produksi Cloudflare. Jangan menyalin nilainya ke chat, kode sumber, atau variabel `VITE_`.
- GitHub Actions memakai secret `CLOUDFLARE_API_TOKEN`, izin Cloudflare Pages Edit pada akun hosting, kedaluwarsa **6 November 2027**. Ganti token sebelum tanggal tersebut agar publikasi tetap berjalan. Izin Cloudflare tersedia pada tingkat akun Pages, bukan per proyek.
- DNS, email toko, dan proyek Firebase tidak diubah oleh aktivasi admin ini.

## Wajib sebelum pengembangan atau deploy berikutnya

`admin-production` adalah sumber konten produksi. Branch `main` lama belum disamakan dan tidak dipakai oleh workflow ini. Setelah ada penerbitan dari admin, baca commit terbaru branch produksi sebelum mengubah atau menerbitkan kode lokal. Jangan menimpa `src/content/store.json` atau gambar hasil admin dengan salinan lokal yang lebih lama. Gunakan pembaruan tanpa force-push, pertahankan katalog aktif dan riwayat pesanan.

Cloudflare project memakai Direct Upload. Workflow mengirim `--branch main` untuk memilih environment produksi Cloudflare; ini berbeda dari nama branch sumber GitHub `admin-production`. Tidak ada perpindahan DNS atau pembuatan proyek hosting kedua.

Konflik revisi konten ditolak dengan HTTP 409. Muat ulang konten terbaru dan terapkan kembali perubahan. Untuk pemulihan, perbaiki/revert commit sumber lalu terbitkan ulang; rollback hosting saja membuat Git dan website berbeda.

## Google untuk pembeli

Provider Google aktif pada Firebase `kainora-kids-store`, klien OAuth tersedia, dan domain produksi `kainorakids.com` serta `www.kainorakids.com` terdaftar. Keaktifan provider bukan bukti login akun nyata sudah selesai; catat pengujian sesi pengguna secara terpisah.
