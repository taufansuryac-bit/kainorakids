# Penyerahan revisi Kainora Journal

Tanggal: 21 Oktober 2026. Status: selesai pada sumber lokal dan build lokal; belum deploy atau menulis database produksi.

## Isi yang tersedia

| Kategori | Artikel lama diperluas | Artikel baru | Total |
|---|---:|---:|---:|
| Parenting | 4 | 5 | 9 |
| Fashion Anak | 10 | 5 | 15 |
| Kesehatan Anak | 3 | 5 | 8 |
| Perawatan Pakaian | 2 | 5 | 7 |
| Panduan Belanja | 7 | 5 | 12 |
| Pengembangan Diri & Karakter | 0 | 10 | 10 |
| Aktivitas & Kreativitas (DIY) | 0 | 10 | 10 |
| **Total** | **26** | **45** | **71** |

Naskah awal hanya judul/ringkasan. Kini setiap artikel mempunyai isi asli berbahasa Indonesia, subjudul, langkah atau contoh yang sesuai topik, pertanyaan praktis, dan tautan ke artikel terkait. Panjang isi saat diperiksa: 294–361 kata; panjang bukan klaim kualitas atau syarat peringkat Google. Metadata judul, deskripsi, dan fokus berbeda untuk setiap artikel. Rujukan faktual menggunakan 22 URL primer yang relevan; sumber ditampilkan pada artikel yang menggunakannya. Penulis tercantum sebagai Kainora Journal, tanpa gelar medis atau pengalaman pelanggan yang dibuat-buat.

Inventaris lengkap: [JOURNAL_ARTICLE_INVENTORY.md](JOURNAL_ARTICLE_INVENTORY.md). Sumber isi: src/content/journalArticles.js. Data lama disimpan di blog-articles-before-seo.js pada folder ini.

## Batas bukti popularitas 2026

Tidak tersedia GA4, Search Console, angka kunjungan, data pembaca, atau volume pencarian terverifikasi. Artikel dipilih berdasarkan kebutuhan praktis keluarga dan rujukan yang tersedia, bukan bukti bahwa semuanya paling ramai pada 2026. Salah satu rujukan dengan pembaruan 2026 adalah [panduan 5 C media dari American Academy of Pediatrics](https://www.healthychildren.org/English/family-life/Media/Pages/kids-and-screen-time-how-to-use-the-5-cs-of-media-guidance.aspx). Topik pakaian dan kegiatan lain banyak yang tetap relevan lintas tahun. Tidak ada angka popularitas, klaim tren penjualan, atau janji ranking yang disisipkan.

Prinsip penulisan mengikuti isi yang menjawab kebutuhan pembaca, sesuai [Google Search Central: helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). Artikel kesehatan merupakan bacaan umum, bukan diagnosis atau klaim rekomendasi dokter untuk produk Kainora. Klaim peluncuran, sertifikasi dan keunggulan produk yang tidak didukung sumber tidak dipertahankan dari judul lama.

## Sampul dan aturan tanpa wajah

- 71 sampul unik dibuat melalui image_gen bawaan; tidak memakai API/CLI alternatif atau foto stok sebagai pengganti hasil generasi.
- Komposisi berupa benda, tangan/badan dengan kepala di luar bingkai, atau pandangan belakang tanpa profil. Seluruh hasil diperiksa secara visual; tidak ada wajah manusia yang terlihat, termasuk pantulan dan latar. Pemeriksaan ini dilakukan manual, bukan sertifikasi deteksi wajah otomatis.
- Satu permintaan sampul bertema batas pribadi ditolak sistem generator. Sampul finalnya diganti dengan still life pakaian, pintu dan tirai untuk ilustrasi privasi; tidak ada gambar manusia pada sampul tersebut.
- Asli PNG disimpan di docs/journal-assets/originals; final 1536 × 1024 WebP di public/images/journal. Total WebP: 13.79 MB untuk 71 aset; dimuat bertahap sesuai tampilan.
- Prompt, file asal, hasil final dan persetujuan visual dicatat di docs/journal-assets/manifest.json. Semua record mempunyai facesVisible=false dan status ACCEPTED.
- Gambar diberi keterangan ilustrasi editorial dibuat dengan AI. Gambar pakaian generatif tidak diklaim sebagai foto SKU resmi. Alt text menjelaskan adegan, bukan pengulangan kata kunci.
- Aturan tanpa wajah juga ditambahkan ke newkainorapage.md agar diperiksa lagi saat pekerjaan berikutnya.

## Navigasi dan SEO teknis

Navbar/footer khusus blog terpisah dari toko, dengan beranda blog, arsip, tujuh topik, pencarian, menu ponsel dan jalan kembali ke toko. Artikel mempunyai daftar isi, rujukan, tautan terkait serta tombol salin tautan. Filter, kata pencarian dan halaman disimpan di URL. Menu Escape dan pemulihan fokus diperiksa.

Setiap artikel memakai /blog/slug/ dan canonical yang sama. Tautan lama /?view=blog&article=ID tetap dibaca. Saat kembali ke toko, canonical kembali ke beranda dan schema blog dibersihkan. Tanggal yang dicantumkan adalah tanggal revisi sebenarnya; tidak dibuat tanggal terbit historis.

Perintah npm run build menjalankan Vite lalu scripts/build-journal.js. Hasilnya 71 berkas HTML artikel beserta indeks /blog/index.html. Isi artikel, judul, deskripsi, gambar berbagi absolut, canonical dan BlogPosting JSON-LD tersedia pada respons HTML sebelum JavaScript dijalankan. Build juga membuat dist/sitemap-journal.xml berisi 72 URL dan menambahkan URL journal ke dist/sitemap.xml sambil mempertahankan URL toko yang sudah ada. Jangan deploy hanya indeks utama; seluruh isi dist termasuk folder blog harus ikut.

Build gagal bila ID, judul, slug atau fokus duplikat; gambar/alt/isi/metadata tidak lengkap; tautan internal/related putus; atau sampul belum mempunyai persetujuan visual. Ini memeriksa integritas sumber, bukan menjamin ranking.

## Verifikasi yang dijalankan

- npm run build berhasil: 71 halaman artikel + satu indeks.
- Lint khusus file blog dan generator: 0 error, 0 warning. Lint seluruh proyek: 0 error, 187 warning yang sudah ada pada bagian lain.
- HTTP produksi lokal 127.0.0.1:4173: 71 artikel merespons 200 dengan H1 yang sesuai, satu canonical yang benar dan schema artikel; 71 sampul merupakan WebP valid dan merespons 200. Bukti: journal-http-qa.json.
- Browser dengan JavaScript dimatikan: artikel batas tubuh tetap menampilkan 333 kata hasil hitungan DOM, rujukan NSPCC, gambar, canonical dan BlogPosting. Indeks memuat tautan ke semua 71 artikel.
- Lebar indeks 320, 390, 768, 1024, 1440 dan 1920 piksel: tidak ada overflow horizontal. Artikel juga diperiksa pada 320–1440 piksel.
- Filter Karakter dan DIY masing-masing menunjukkan 10 artikel; pencarian es berwarna menemukan satu artikel; pagination DIY halaman 2 berisi artikel ke-10. Back, Forward, refresh halaman 2 dan tautan lama diperiksa.
- Tautan daftar isi dan refresh dengan hash menuju subjudul dengan jarak aman di bawah navbar. Diperbaiki konflik reset scroll aplikasi utama yang sebelumnya membatalkan posisi blog.
- Tautan dalam naskah menuju artikel lain dan tautan kembali ke toko diperiksa. Navbar/footer blog hanya satu dan navbar toko tidak ikut tampil.
- Screenshot desktop, ponsel dan artikel tersedia di folder ini. Sebagian screenshot tinggi dapat memperlihatkan placeholder lazy image bila belum tergulir; screenshot desktop final dimuat setelah semua gambar di halaman diperiksa.

## Batas operasional

Runtime development 5173 memakai konfigurasi kainora-kids-dev. Sumber lokal 71 artikel adalah edisi yang dipasang pada halaman; tidak ada penulisan Firestore atau publikasi produksi dalam pekerjaan ini. Bila konfigurasi Firestore nyata tersedia, sumber lokal tetap menjadi prioritas untuk ID yang sama dan artikel remote yang ID-nya berbeda tetap dapat dimuat. Pengeditan berikutnya atas 71 ID ini dilakukan melalui sumber editorial atau memerlukan alur sinkronisasi CMS yang terpisah; jangan menganggap perubahan database otomatis mengganti edisi lokal.

Pengujian produksi publik, indexing Google, peringkat, trafik aktual, serta persetujuan editorial/medis eksternal belum dilakukan. Tata kelola sitemap toko lama, pembayaran dan infrastruktur di luar blog tidak diaudit ulang dalam revisi ini.
