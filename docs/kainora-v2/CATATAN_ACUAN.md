# Acuan Kainora V2

Dicatat 21 Oktober 2026 sebagai catatan tahap pembacaan. Implementasi kemudian diizinkan pengguna melalui pesan “kerjakan”; status terkini dan bukti pemeriksaan ada di `README.md` pada folder ini.

## Sumber utuh

- `../../newkainorapage.md`: salinan byte-identik dari `KAINORA_KIDS_CODEX_MASTER_PROMPT_V2.md`, 183 baris. SHA-256 sumber dan salinan telah dibandingkan dan cocok.
- `kainora_kids_motion_prototype.html`: salinan byte-identik prototype pengguna, 114 baris dengan 21 kemunculan gambar raster tertanam. HTML, CSS, dan JavaScript telah dibaca hingga akhir; payload base64 gambar tidak diperlakukan sebagai instruksi teks. File sumber tidak dimodifikasi.

## Arahan yang perlu dijaga pada pengerjaan berikutnya

- Master V2 menetapkan arah editorial minimalis putih–hitam, aksen lime terbatas, tipografi geometris tebal, dan penggunaan logo resmi. Ini berbeda dari arah neo brutalism pada iterasi sebelumnya.
- Urutan 00–11: preloader, hero, manifesto, galeri koleksi horizontal, product theater, product carousel terpisah, lookbook, campaign, shop grid, brand story, community, footer halftone.
- Animasi berbasis kemajuan scroll harus benar-benar mengikuti scroll, dapat berbalik, dan memiliki alternatif reduced motion serta mobile yang dapat dipakai.
- Pertahankan arsitektur React/Vite, rute, autentikasi, katalog, varian, keranjang, checkout, dan mekanisme sinkronisasi project. Jangan menyalin sistem demo prototype sebagai pengganti toko.
- Prioritaskan aset produk/logo yang sudah tersedia. Aset sintetis tidak boleh dianggap sebagai SKU resmi; kebutuhan editorial dan asal aset harus dicatat dengan jujur.
- Finalisasi membutuhkan pemeriksaan browser desktop/mobile, interaksi nyata, reduced motion, lint/build yang tersedia, serta laporan batas verifikasi.

## Perbedaan prototype terhadap spesifikasi master

Hasil berikut merupakan pembacaan statis source, bukan hasil uji runtime prototype:

- Prototype menggunakan lima produk contoh, harga contoh, keranjang `Map` di memori, checkout demo, swatch tanpa varian terverifikasi, dan newsletter yang tidak mengirim email. Theater belum memiliki pilihan ukuran.
- Logo prototype berupa teks. Master meminta logo resmi yang sudah tersedia.
- Manifesto prototype mempertahankan teks `BORN TO` dan mengganti PLAY/EXPLORE/EXPRESS. Master meminta tiga frasa penuh BORN TO PLAY, MADE TO EXPLORE, BUILT TO EXPRESS.
- Prototype memiliki blok tipografi tambahan dan beberapa judul/kategori berbeda. Urutan serta judul final perlu diselaraskan dengan master, bukan dianggap otomatis memenuhi seluruh 12 section.
- Lookbook prototype memakai reveal berbasis intersection dan hover; belum ada satu gambar yang membesar berdasarkan scroll menjadi panggung imersif.
- Campaign prototype memakai parallax/scale foto, belum ekspansi bingkai inset menuju full bleed seperti spesifikasi.
- Product carousel memakai perpindahan berbasis ambang swipe dan transisi CSS; inertia/snap serta kestabilan input cepat perlu diimplementasikan dan diuji pada integrasi.
- Halftone prototype menggambar titik dekat pointer; klik memunculkan toast. Ini belum setara dengan wordmark bertitik yang memakai respons spring/ripple.
- Galeri, fokus modal, reduced motion, resize, dan batas viewport tetap perlu QA runtime. Keberadaan kode tidak membuktikan acceptance criteria sudah terpenuhi.

Catatan ini membantu menemukan perbedaan, tidak menggantikan pembacaan ulang master dan prototype asli saat pengerjaan.
