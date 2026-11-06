# Kainora Kids: pedoman wajib untuk agent

## Identitas dan bahasa

- Kainora Kids adalah toko graphic tee oversize anak dan fashion anak. Jangan mengubah fokus menjadi gaya hidup abstrak atau merek pakaian dewasa.
- Baca dan ikuti [pedoman teks](docs/COPY_STYLE.md) sebelum menulis atau mengubah teks UI, katalog, metadata, artikel, dan prompt AI.
- Bahasa Indonesia profesional dan alami. Gunakan "Anda" jika sapaan diperlukan; jangan mencampur kamu/Anda/Bunda dalam satu alur. Istilah fashion yang lazim seperti graphic tee, oversize, boxy, unisex, Boys/Girls boleh dipakai bila membantu pembeli.
- Judul harus menjelaskan isi: Ulasan pelanggan, Produk lainnya, Riwayat pesanan, Keranjang belanja, Panduan ukuran. Dilarang menggantinya dengan "Cerita pembeli", "Cerita lainnya", "Pilihan kecilmu", atau slogan sejenis.
- Hapus penomoran dekoratif seperti "01 / THE FIRST MOVEMENT", "03 / KAINORA", dan nomor urut foto/kartu yang tidak membantu pembeli. Angka harga, stok, ukuran, jumlah, halaman, tanggal, serta langkah instruksi tetap diperbolehkan.
- Jangan membuat klaim diskon, gratis ongkir, VIP, terlaris, stok terbatas, sertifikasi, kenyamanan medis, bahan, atau garansi tanpa data terverifikasi. Jangan mengubah harga, stok, komisi, dan kebijakan sebagai bagian dari penyuntingan gaya bahasa.
- Ulasan asli pelanggan tidak boleh ditulis ulang. Artikel yang benar-benar membahas membaca cerita boleh memakai kata "cerita"; larangan berlaku untuk metafora pemasaran kosong.

## Implementasi dan pemeriksaan

- Pertahankan perubahan pengguna yang sudah ada. Banyak file dapat memiliki perubahan lokal sebelum tugas dimulai.
- Admin produksi dan publikasi otomatis mengikuti `docs/ADMIN_PUBLISHING.md`. Sumber produksi berada di branch GitHub `admin-production`; baca revisi terbaru sebelum deploy atau mengubah katalog. Jangan menimpa konten/gambar yang diterbitkan admin dengan salinan lokal lama atau melakukan force-push.
- Periksa komponen aktif, komponen alternatif, `src/content/store.json`, modal, pesan kosong/error, aksesibilitas, serta `scripts/build-*.mjs`/`.js` agar teks lama tidak kembali lewat HTML statis.
- Teks yang dibuat asisten chat dan generator deskripsi admin wajib mengikuti pedoman yang sama.
- Pertahankan URL/canonical yang sudah ada saat menyunting teks. Pastikan title, deskripsi, H1, HTML statis, tampilan setelah JavaScript, dan JSON-LD konsisten. Hindari pengulangan keyword dan jangan menciptakan fakta hanya untuk SEO/AI SEO.
- Jangan menambah rating/testimoni buatan, FAQ tersembunyi, atau klaim bahwa schema/llms.txt menjamin ranking maupun kutipan AI.
- Setelah perubahan, jalankan build dan pemeriksaan relevan; tinjau desktop dan mobile untuk judul terpotong, tautan, footer, dan overflow. Laporkan batasan bukti dengan jelas.
- Untuk perubahan footer bantuan, gunakan dua kolom pada desktop/tablet agar tidak memanjang ke bawah. Pertahankan keterbacaan dan target sentuh mobile.
- Jumlah kategori blog dihitung dari koleksi artikel melalui `journalTopics`; jangan menulis angka tetap pada sidebar, dropdown, atau filter. Menu aktif mengikuti halaman, filter, dan hash tujuan.
- Newsletter mengikuti `docs/NEWSLETTER_SETUP.md`. Jangan menampilkan sukses atau menyimpan email jika layanan belum dikonfigurasi. Permintaan konfirmasi email bukan langganan aktif. API key dan secret Turnstile hanya di server; jangan gunakan awalan `VITE_`. Jangan mengaktifkan kampanye email atau mengubah DNS sebagai bagian dari perubahan tampilan.
- Desain newsletter: modern, futuristik, dan minimalis dengan tipografi jelas, warna netral, aksen kecil, serta animasi interaksi halus. Hindari gaya sci-fi seperti orbit, radar, grid dekoratif, neon/glow, atau ilustrasi melayang.
- Navbar blog mengikuti gaya modern minimalis: latar putih, tipografi sederhana, penanda aktif berupa garis tipis, dan dropdown yang rapi. Hindari kelompok menu berbentuk kapsul, efek glass/glow, serta badge dekoratif berlebihan. Pertahankan hover Topik, jumlah artikel, akses keyboard, dan target sentuh mobile.

## Katalog mulai 6 November 2026

- Katalog aktif berisi 33 motif dari `public/PRODUCT/PRODUCT NEW/`; nama produk mengikuti nama folder. Produk lama sudah dipensiunkan dari katalog.
- Spesifikasi yang dikonfirmasi pemilik: Soft 20S Organic Cotton, cutting oversize, S/M/L Rp89.000 dan XL/XXL Rp94.000. Harga setiap ukuran disimpan pada `sizePrices`; gunakan helper pricing untuk tampilan, keranjang, dan pesanan.
- Varian hitam/putih mengikuti `colorVariants`. KAI DPS, KAINORA TOYS, dan LITTLE MONA hanya hitam. Jangan menambah warna, kuantitas stok, angka penjualan, kategori usia, atau komisi tanpa data pemilik.
- Size chart resmi ada di `src/content/sizeChart.js`, bersumber dari `SIZECHART.jpg` dalam folder produk. Jangan mengembalikan tabel lama dengan rasio 1:1. Angka bahu adalah segmen dari leher ke sambungan lengan, bukan lebar bahu keseluruhan.
- Penggantian katalog harus memperbarui highlight, tautan CTA, HTML statis, sitemap, keranjang yang dipulihkan, dan data terstruktur. Pertahankan arsip pesanan pembeli sebagai riwayat transaksi.
