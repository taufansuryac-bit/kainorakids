# Pemeriksaan secret GitHub Kainora — 22 Oktober 2026

## Hasil utama

Pada snapshot GitHub yang diperiksa, **tidak ditemukan nilai secret nyata dengan pola yang diuji**. Ini bukan jaminan seluruh riwayat/layanan bebas kebocoran. Ada token akses dalam konfigurasi remote Git **lokal**, dan rancangan variabel AI frontend perlu diperbaiki sebelum memakai secret produksi.

Target publik: https://github.com/taufansuryac-bit/kainorakids

Main yang diperiksa: `e8d8d75a4f0c830bedb2625858000112187056c8`.
Satu branch remote (`main`), tiga commit reachable: `e8d8d75`, `4381d0b`, `77cf814`.
Inventaris: 162 path historis; 61 blob teks unik diperiksa. File `.env` asli, service-account key, private PEM, dan token GitHub dengan pola yang diuji tidak ditemukan dalam snapshot remote/riwayat tersebut. `.env.example` ditemukan sebagai template.

## 1. Token GitHub dalam remote lokal — perlu diganti

Alamat origin pada `.git/config` checkout lokal mengandung credential/token. Nilai token tidak disalin ke laporan. Konfigurasi ini bukan file tracked di repo; pemeriksaan GitHub tidak membuktikan token tersebut dipublikasikan di repo.

Saat pemeriksaan awal, alamat remote bertoken sempat ikut tercetak di keluaran alat sebelum masking diterapkan. Karena itu token perlu dicabut/diganti, terlepas dari apakah masih aktif. Keaktifan, cakupan izin, dan pengguna token belum diuji. Jangan menganggap token mati hanya karena tidak ada dalam source GitHub.

Tindakan yang disarankan: ganti/cabut token melalui GitHub Settings → Developer settings → Personal access tokens; kemudian gunakan Git Credential Manager/SSH dan URL origin bersih `https://github.com/taufansuryac-bit/kainorakids.git`. Belum ada pencabutan token atau perubahan remote yang dilakukan karena permintaan adalah pemeriksaan, bukan rotasi credential.

## 2. Secret AI berawalan VITE_ akan terbuka jika diisi

Bukti pada remote main: [cloudAIService.js](https://github.com/taufansuryac-bit/kainorakids/blob/e8d8d75a4f0c830bedb2625858000112187056c8/src/services/cloudAIService.js#L21) membaca VITE_GROQ_API_KEY dan 12 variabel provider lain; pemanggilan fetch/Bearer langsung dari frontend ada di sekitar baris 295–312 dan 421–424.

Tidak ditemukan nilai key asli tersebut dalam snapshot yang diperiksa. Namun bila key asli dimasukkan saat build, Vite akan menyisipkannya ke JavaScript browser walaupun `.env` tidak di-commit. Karena itu ini risiko arsitektur **bersyarat**, bukan bukti sudah terjadi penyalahgunaan API.

Sebelum mengaktifkan provider AI bersecret: pindahkan pemanggilan AI ke endpoint server dengan autentikasi/rate limit/kuota, gunakan secret tanpa prefix VITE_, lalu rotasi key yang pernah disertakan dalam build publik. Jangan mengisi key AI produksi pada konfigurasi frontend yang sekarang. [Dokumentasi Vite](https://vite.dev/guide/env-and-mode#env-variables).

## 3. Firebase Web config bukan service-account secret

Firebase Web API key, project ID, app ID dan auth domain memang digunakan browser untuk mengidentifikasi proyek. Otorisasi data harus ditegakkan oleh Auth dan Security Rules, bukan menyembunyikan Web API key. Key untuk layanan lain seperti Gemini harus dipisahkan/restricted. [Dokumentasi Firebase](https://firebase.google.com/docs/projects/api-keys).

Sesudah pemeriksaan snapshot remote, konfigurasi Web publik untuk proyek baru `kainora-kids-store` ditambahkan **lokal** di `src/config/firebasePublic.json` atas permintaan pengguna. Kehadiran API key Firebase publik di file ini disengaja; tidak berisi private key, refresh token atau service-account credential. File baru ini belum dipush dalam pekerjaan ini. Billing proyek baru terverifikasi tidak aktif; aturan data pembeli telah diuji di emulator dan diterapkan ke proyek tersebut.

## Cakupan dan batas bukti

- Snapshot remote diunduh read-only ke salinan sementara terpisah; checkout pengguna dan riwayat GitHub tidak diubah untuk audit.
- Pemeriksaan pola meliputi token GitHub, Google API key, private-key PEM, AWS access key, Stripe live key, OpenAI key, serta assignment apiKey/secret/password/accessToken literal. Kandidat diperiksa tanpa mencetak nilainya.
- Blob biner, gambar/OCR, video, arsip, dan blob teks di atas 2 MB tidak dianalisis. Fork, commit yang tidak reachable, caches, issues, Actions logs/artifacts, GitHub secrets settings dan deployment live tidak termasuk.
- Tidak ada key yang diuji ke provider berbayar, tidak ada pembelian API, tidak ada rotasi/pencabutan, dan tidak ada perubahan remote GitHub.
- Hasil build lokal sebelum pemasangan Firebase baru juga diperiksa untuk pola key provider/GitHub; tidak ditemukan pola tersebut. Build berikutnya wajar berisi konfigurasi Firebase Web publik.
- Ini pemeriksaan khusus secret dengan inspeksi sumber/pola, bukan sertifikasi keamanan aplikasi. Pemindai Codex Security formal tidak berhasil dimulai karena snapshot awal berupa bare Git; tidak ada hasil scan formal yang diklaim.

Prioritas: ganti token GitHub lokal, lalu jangan memasukkan secret AI ke frontend. Konfigurasi admin GitHub yang baru menggunakan secret server Cloudflare dan token sesi terenkripsi; tidak memakai token lokal tersebut di browser.
