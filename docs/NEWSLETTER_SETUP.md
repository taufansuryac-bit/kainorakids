# Menyiapkan newsletter Kainora Kids

Status 30 Oktober 2026: formulir, endpoint server, validasi, dan feed RSS tersedia di kode. Akun email, domain pengirim, daftar pelanggan, template konfirmasi, dan kampanye otomatis belum diaktifkan. Tanpa konfigurasi lengkap, formulir menampilkan **Segera tersedia** dan tidak menerima pendaftaran.

## Alur yang disiapkan

Pengunjung mengisi email, mencentang persetujuan, dan melewati verifikasi Cloudflare Turnstile. Server memeriksa token, hostname, action, origin, format email, dan ukuran request sebelum meminta email konfirmasi melalui Brevo. Respons berhasil berarti **perlu konfirmasi email**, bukan pelanggan sudah aktif. Pelanggan masuk ke daftar tujuan setelah mengeklik tautan konfirmasi. Pengiriman artikel berikutnya dikelola kampanye RSS di Brevo.

API key berada di server. Endpoint `GET /api/newsletter` hanya mengirim status kesiapan dan site key publik Turnstile. Endpoint tidak menyimpan email di localStorage atau log aplikasi. Turnstile dimuat ketika pengunjung mulai berinteraksi dengan formulir, setelah konfigurasi tersedia.

## Konfigurasi layanan

1. Buat akun Brevo dan verifikasi alamat serta domain pengirim di dashboard. Ikuti record DNS yang diberikan akun tersebut; jangan menebak record SPF/DKIM. Pilih paket berdasarkan kebutuhan aktual sebelum mengaktifkan kampanye.
2. Buat daftar khusus **Artikel Kainora Kids**. Simpan nomor list sebagai `BREVO_NEWSLETTER_LIST_ID`.
3. Buat dan aktifkan template double opt-in. Tautan tombol konfirmasi wajib menggunakan `{{ params.DOIurl }}`. Simpan nomor template sebagai `BREVO_NEWSLETTER_DOI_TEMPLATE_ID`. Isi yang disarankan:
   - Subjek: **Konfirmasi langganan artikel Kainora Kids**
   - Teks: **Anda meminta untuk menerima artikel Kainora Kids melalui email. Klik tombol berikut untuk mengonfirmasi alamat email Anda. Jika Anda tidak mengajukan permintaan ini, abaikan email ini.**
   - Tombol: **Konfirmasi langganan**
4. Buat widget Cloudflare Turnstile, izinkan hostname website yang dipakai, lalu simpan site key dan secret key. Untuk pengujian lokal, gunakan widget khusus pengembangan dengan hostname lokal yang diizinkan. Jangan menambahkan bypass verifikasi pada production.
5. Tambahkan variabel berikut ke environment **Cloudflare Pages Functions**, untuk production dan preview sesuai kebutuhan. Secret harus dipasang melalui dashboard/secret binding, tidak ditulis ke repository:

| Variabel | Nilai |
| --- | --- |
| `BREVO_API_KEY` | API key Brevo, rahasia |
| `BREVO_NEWSLETTER_LIST_ID` | ID numerik daftar artikel |
| `BREVO_NEWSLETTER_DOI_TEMPLATE_ID` | ID numerik template konfirmasi aktif |
| `NEWSLETTER_TURNSTILE_SITE_KEY` | Site key widget, boleh tampil di browser |
| `NEWSLETTER_TURNSTILE_SECRET_KEY` | Secret verifikasi, rahasia |

Untuk server Vite lokal, tambahkan nilai ke `.env.local`, lalu restart `npm run dev`. Jangan memakai awalan `VITE_` untuk key newsletter. `npm run preview` hanya menyajikan build statis; gunakan Vite dev atau emulator Pages Functions untuk menguji endpoint. Hosting statis tanpa Pages Functions tidak menyediakan `/api/newsletter`.

## Mengirim artikel terbaru

Build menghasilkan feed **https://kainorakids.com/blog/feed.xml**. Di Brevo, buat integrasi RSS Campaign dengan feed tersebut dan daftar pelanggan terkonfirmasi. Pilih jadwal, template, jumlah artikel, dan pastikan tautan berhenti berlangganan tersedia. Periksa preview dan uji ke alamat milik pengelola sebelum mengaktifkan kampanye. Jangan otomatis mengirim seluruh arsip lama kepada pelanggan baru.

Feed memakai URL artikel sebagai GUID tetap, tanggal publikasi bila tersedia, dan tanggal editorial yang sudah ada sebagai fallback. Tidak ada tanggal baru yang dibuat saat build. Artikel baru perlu ditambahkan ke sumber `BLOG_POSTS` beserta `datePublished` asli, kemudian dibuild dan dipublikasikan agar masuk feed. Artikel remote Firestore belum termasuk feed build ini. Mengubah `dateModified` artikel tanpa `datePublished` dapat membuatnya dianggap baru oleh pembaca RSS; isi tanggal publikasi yang benar sebelum mengaktifkan kampanye.

Pengaktifan kampanye merupakan langkah terpisah di Brevo. Website tidak mengklaim bahwa kampanye telah aktif atau email sudah diterima. Endpoint juga tidak memeriksa status konfirmasi penerima setelah tautan DOI diklik; daftar di Brevo menjadi sumber status pelanggan.

## Pemeriksaan sebelum dibuka

- `npm run test:journal` menguji jumlah kategori, navigasi, RSS, dan endpoint dengan jaringan tiruan. Pengujian ini tidak mengirim email.
- `npm run build:cloudflare` memeriksa build dan batas aset.
- Uji dengan alamat milik pengelola: request → email konfirmasi → klik → masuk daftar → email artikel → berhenti berlangganan. Periksa juga email duplikat, token kedaluwarsa, layanan tidak tersedia, dan perangkat mobile.
- Pastikan respons publik tidak memuat API key/secret dan request ditolak bila token atau persetujuan tidak valid. Atur batas request di Cloudflare bila formulir menerima penyalahgunaan; Turnstile dan double opt-in tidak menggantikan pemantauan pengiriman.

Dokumentasi resmi: [Brevo double opt-in](https://developers.brevo.com/reference/create-doi-contact), [Brevo RSS Campaign](https://help.brevo.com/hc/en-us/articles/360013130059-RSS-Campaign-integration-Automatically-share-your-blog-posts-with-your-subscribers), [validasi Turnstile di server](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
