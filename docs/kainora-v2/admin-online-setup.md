# Panduan mengaktifkan admin online Kainora

Tanggal verifikasi: 22 Oktober 2026. Website belum dipublikasikan oleh pekerjaan ini; DNS belum diubah.

## Arsitektur yang disetujui

- Cloudflare Pages Free: website, jurnal statis, foto katalog, JSON konten dan model/tekstur kaos 3D.
- GitHub `taufansuryac-bit/kainorakids`: penyimpanan konten dan riwayat perubahan. Admin online membuat satu commit per Terbitkan, lalu Cloudflare membangun ulang website.
- Firebase `kainora-kids-store`: akun pembeli, profil, keranjang/favorit dan permintaan pesanan. Spark; billing tidak aktif. Firestore Standard `(default)` di Jakarta (`asia-southeast2`), free tier terkonfirmasi. Email/password dan Google aktif. Anonymous dinonaktifkan. Tidak ada penggunaan Firebase Storage atau deployment Firebase Hosting.
- Admin konten memakai login GitHub, terpisah dari login pembeli Firebase.

Firebase console: https://console.firebase.google.com/project/kainora-kids-store/overview
Pengelola proyek saat dibuat: `arcanelabs.studio@gmail.com`.

## 1. Coba editor yang sudah dibangun

Di folder `kainorakids-web`, jalankan `npm run dev:admin`, lalu buka http://127.0.0.1:5174/?view=admin . Ini hanya editor lokal, dapat diakses dari komputer tersebut. Tombol Simpan ke project menyimpan file sumber; tidak memublikasikan website.

Tiga tab:
1. Katalog produk: tambah/edit/hapus, upload foto, urutan katalog, harga dan ukuran. Foto pertama menjadi sampul. Harga/ukuran kosong tidak ditampilkan sebagai gratis dan tidak bisa dipesan.
2. Highlight beranda: pilih maksimal 12 produk yang sudah ada di katalog dan susun urutannya. Produk baru tidak otomatis menjadi highlight.
3. Koleksi kaos 3D: tambah/hapus kaos independen dari katalog; PNG depan/belakang, putih/hitam, awal depan/belakang, depan kecil di dada atau besar di tengah. Posisi sablon disimpan di `garmentPrintLayout.js`. PNG baru dirapikan tepi transparannya dan dipasang dengan preset yang sama. Tautan Lihat Produk opsional.

Simpan ke draft belum menyimpan permanen. Terbitkan (online) atau Simpan ke project (lokal) melakukan penyimpanan. Jangan menutup tab saat masih ada draft. Kaos aktif saja yang berputar; samping selalu belakang. Koleksi kosong menyembunyikan section, satu item tidak diduplikasi.

## 2. Siapkan akun Cloudflare gratis

1. Daftar di https://dash.cloudflare.com/sign-up lalu verifikasi email. Pilih paket Free; tidak perlu berlangganan paket berbayar untuk rancangan ini.
2. Buka Workers & Pages → buat proyek Pages dengan koneksi Git. Pilih hanya repositori Kainora untuk integrasi GitHub.
3. Sebelum deployment pertama, perubahan lokal harus ditinjau dan diselaraskan dengan repo remote. Pada audit ini HEAD lokal dan main remote berbeda. Jangan force-push. Pekerjaan ini belum commit/push perubahan lokal.
4. Gunakan branch produksi `main`, root directory yang berisi `package.json` Kainora. Build command: `npm run build:cloudflare`. Output directory: `dist`. Gunakan Node 24.
5. Pastikan folder `functions/`, `server/`, `shared/` dan `src/content/store.json` ikut masuk repo. Jangan unggah hanya folder dist melalui drag-and-drop, karena admin memerlukan Pages Functions.
6. Tunggu build pertama berhasil. Uji URL `*.pages.dev` yang benar-benar diberikan Cloudflare. Jangan menebak nama host.

Build Cloudflare hanya mengecualikan dua video lama yang tidak dipakai, masing-masing sekitar 53 MB. File sumber public tidak dihapus. Pemeriksa build menolak file di atas 25 MiB atau jumlah file di atas batas Free.

## 3. Buat GitHub App untuk admin

Di GitHub akun pengelola: Settings → Developer settings → GitHub Apps → New GitHub App.

- Nama: Kainora Content Studio (tambahkan nama akun jika sudah dipakai).
- Homepage: `https://kainorakids.com`.
- Callback: `https://kainorakids.com/api/admin/callback`.
- Aktifkan alur user authorization/OAuth. Biarkan user token memiliki masa kedaluwarsa; admin login kembali bila sesi berakhir.
- Webhooks tidak diperlukan; nonaktifkan.
- Repository permissions: Contents **Read and write**, Metadata **Read-only**. Account permissions lain tidak diperlukan.
- Instal hanya pada repositori `taufansuryac-bit/kainorakids`.
- Catat Client ID. Generate Client Secret dan simpan langsung pada secret Cloudflare. Jangan kirim secret lewat chat atau menaruhnya di repo.

Kode memakai OAuth state + PKCE; token GitHub berada dalam cookie terenkripsi HttpOnly/Secure. Browser JavaScript tidak menerima token GitHub.

## 4. Konfigurasi server admin pada Cloudflare

Pada project Pages → Settings → Variables and Secrets, environment **Production**:

| Nama | Nilai |
|---|---|
| `ADMIN_ORIGIN` | `https://kainorakids.com` |
| `ADMIN_REPO` | `taufansuryac-bit/kainorakids` |
| `ADMIN_BRANCH` | `main` |
| `ADMIN_GITHUB_USER_IDS` | `270434085` (ID akun pemilik repo, bukan email) |
| `GITHUB_CLIENT_ID` | Client ID GitHub App tadi |
| `GITHUB_CLIENT_SECRET` | Secret GitHub App; tandai sebagai secret |
| `ADMIN_SESSION_SECRET` | Nilai acak kuat minimal 32 karakter; tandai sebagai secret |

Generate session secret secara lokal, misalnya dengan Node crypto randomBytes(32). Jangan menaruhnya dalam variabel berawalan VITE_. Jangan memasukkan service-account key Firebase atau token GitHub ke build frontend.

Deploy ulang setelah environment siap. Preview deployments sebaiknya tidak diberi secret produksi; admin preview akan terkunci. Bila memilih hostname admin berbeda, ADMIN_ORIGIN dan callback GitHub harus sama persis dengan hostname HTTPS tersebut.

Konfigurasi Firebase Web publik ada di `src/config/firebasePublic.json`; itu bukan service-account key. Tidak perlu menaruh private key Firebase di Cloudflare. Variabel opsional VITE_FIREBASE_* hanya untuk override proyek yang disengaja; konfigurasi bawaan menunjuk ke proyek Kainora yang baru.

## 5. Hubungkan kainorakids.com tanpa mengganggu email

Domain tetap dibeli/diperpanjang melalui penyedia sekarang. Nameserver yang terdeteksi saat pemeriksaan: `apollo.dns-parking.com` dan `athena.dns-parking.com`.

Untuk domain akar `kainorakids.com`, Cloudflare Pages memerlukan zona domain di Cloudflare. Sebelum mengganti nameserver:

1. Simpan/export seluruh DNS lama, termasuk MX, SPF, DKIM, DMARC dan verifikasi layanan. Salin hasilnya ke zona Cloudflare; hasil import otomatis harus diperiksa.
2. Tambahkan kainorakids.com ke Cloudflare pada Free plan. Gunakan dua nameserver yang benar-benar diberikan akun Cloudflare tersebut.
3. Periksa web lama, email, dan rencana perpindahan sebelum mengganti nameserver di Hostinger. Mengganti nameserver tidak memindahkan pendaftaran domain, tetapi dapat memengaruhi semua layanan DNS.
4. Tambahkan custom domain melalui Pages → Custom domains, baru selesaikan DNS/sertifikat. Redirect www ke domain kanonis dapat ditambahkan setelah kedua hostname berfungsi.

Pilihan bertahap: `www.kainorakids.com` dapat dihubungkan lewat CNAME DNS eksternal terlebih dahulu. Domain akar membutuhkan konfigurasi zona Cloudflare menurut dokumentasi resminya.

Tidak ada perubahan nameserver, DNS, MX, SSL domain, atau domain production yang dilakukan otomatis dalam pekerjaan ini.

## 6. Verifikasi setelah aktif

1. Tamu bisa membuka katalog/3D/jurnal tanpa login dan tanpa membaca katalog dari Firestore.
2. `/?view=admin` meminta login GitHub. Akun di luar allowlist ditolak. API konten menolak pengunjung tanpa sesi.
3. Buat satu item percobaan, atur highlight dan upload satu PNG. Simpan draft, lalu Terbitkan sekali.
4. Status commit diterima bukan bukti website live. Tunggu deployment Cloudflare **Success**, lalu periksa website melalui tab baru.
5. Uji login pembeli dengan akun milik Anda, pastikan alamat profil tersimpan, keranjang tidak hilang, dan pembeli lain tidak dapat membaca pesanan Anda.
6. Checkout saat ini menyimpan permintaan **pending** lalu membuka alur WhatsApp lama; belum merupakan payment gateway atau bukti pembayaran. Nomor WhatsApp toko harus dikonfigurasi benar sebelum menerima pesanan nyata. Harga/ongkir dikonfirmasi toko; subtotal yang diajukan browser bukan harga pembayaran terverifikasi server.
7. Pengiriman/edit/hapus ulasan belum diaktifkan pada backend baru; kontrolnya dinonaktifkan agar tidak menawarkan aksi yang ditolak aturan. Review, promo/affiliate administration dan pembayaran otomatis perlu pekerjaan terpisah.

Konfigurasi provider dan domain Auth sudah diterapkan, tetapi login akun pembeli sungguhan/Google popup dan pesanan produksi belum diuji dengan akun nyata pada domain live. Pengujian isolasi data memakai emulator lokal, tanpa membuat pengguna atau pesanan produksi palsu.

## Kuota dan pemulihan

- Cloudflare static asset requests gratis; API admin tetap mengikuti kuota Workers Free. Pages Free memiliki batas 500 build/bulan, 20.000 file dan 25 MiB/file. Hindari Terbitkan untuk tiap perubahan kecil; gabungkan perubahan dalam draft.
- Firestore Standard gratis: 50.000 document reads/hari, 20.000 writes/hari, 1 GiB penyimpanan dan 10 GiB transfer/bulan. Trafik login/checkout tetap dapat mencapai kuota walau gambar berada di Cloudflare. Spark dapat menolak operasi ketika kuota habis; billing belum diaktifkan.
- Domain tetap memiliki biaya perpanjangan. Ketentuan paket gratis dapat berubah.
- Konflik dua editor ditolak dengan 409. Jangan menimpa paksa; muat versi terbaru dan terapkan ulang perubahan.
- Rollback konten: revert commit konten melalui GitHub, lalu tunggu build baru. Restore file gambar yang ikut berubah dari commit tersebut. Rollback deployment saja tanpa revert Git membuat sumber repo dan website berbeda.
- Lokal: versi JSON sebelum simpan berada di `.admin-backups/` (diabaikan Git). Gambar sumber lokal tidak dihapus oleh editor.

Referensi resmi: [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/), [Pages pricing](https://developers.cloudflare.com/pages/functions/pricing/), [Pages limits](https://developers.cloudflare.com/pages/platform/limits/), [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), [GitHub App user authentication](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app), [Firebase quotas](https://firebase.google.com/docs/firestore/quotas), [Firebase Web API keys](https://firebase.google.com/docs/projects/api-keys).
