# SEO dan pengalaman mobile Kainora — 23 Oktober 2026

Perubahan diterapkan pada kode dan build lokal. Belum deploy atau push. Judul, konten pembeli, ketersediaan dan kebijakan perdagangan sudah diperkuat. Pengukuran menunjukkan perbaikan besar pada waktu tampil, tetapi **belum membuktikan seluruh target Core Web Vitals tercapai**.

[Tabel pengukuran sebelum/sesudah](METRICS.md) · [Data angka Lighthouse](metrics.json) · [Ringkasan Event Timing](interaction-lab.json)

## Cara membaca bukti kecepatan

Lighthouse 13.5.0 dijalankan pada production preview `http://127.0.0.1:4173`, bukan Vite dev server. Profil mobile bawaan Moto G Power: viewport 412×823, DPR 1,75, simulated 4G (RTT 150 ms, throughput 1.638,4 Kbps), CPU slowdown 4×. Sebelum/sesudah memakai konfigurasi yang sama, proses audit berurutan, tanpa build atau tes berat bersamaan. Setiap berkas adalah satu sampel; angka dapat berubah antarrun. Chrome audit memakai profil terpisah, tanpa akun pembeli. Peringatan IndexedDB mengacu pada database Auth lokal kosong yang pernah dibuat, bukan bukti akun terisi.

Lihat `before-home.json`, `before-catalog.json`, `before-detail.json` dan pasangan `after-*.json`. Tabel final di `metrics.json` dibaca langsung dari berkas tersebut. Lighthouse SEO sudah 100 pada baseline; 100 tidak berarti ranking tinggi, seluruh SEO selesai, atau Core Web Vitals lulus.

**LCP target ≤2,5 detik belum tercapai secara konsisten.** CLS sesudah optimasi berada di bawah 0,1. TBT dicatat terpisah dan tidak disebut INP. Hasil ini bukan data HP fisik, koneksi produksi/CDN, atau persentil ke-75 dari pengunjung nyata. Validasi lapangan memerlukan situs yang sudah tayang dan data PageSpeed Insights/CrUX atau pengukuran RUM yang memadai.

### Pengujian interaksi lokal

Playwright, mobile 390×844, DPR 1,75, CPU slowdown 4×. Event Timing `PerformanceObserver` dengan `interactionId` dan `durationThreshold:16`, mengelompokkan event dari interaksi yang sama. Angka berikut adalah durasi event terlama yang terekam dalam sesi terbatas, **bukan INP lapangan**. Event di bawah ambang observasi tidak dihitung sebagai nol.

| Sesi | Interaksi yang diperiksa | Durasi terlama |
| --- | --- | ---: |
| Beranda | Foto lengkap, Siap pilih ukuran, mengetik pencarian, menghapus pencarian | 240 ms |
| Katalog | Boys, Girls, Semua motif, membuka filter dan memilih XXL | 128 ms |
| Detail → panduan → keranjang | Buka chart, pilih M, galeri/Escape, foto kedua, tambah barang, tutup notifikasi, buka panduan, buka keranjang | 144 ms |

Interaksi awal filter beranda masih melampaui target 200 ms pada CPU 4×. Pengukuran sebelumnya mencapai 248–272 ms; memo kartu dan pembatasan pengukuran layout pada mobile mengurangi pekerjaan, tetapi hasil belum layak disebut lulus. Prioritas lanjutan adalah profiling interaksi pertama saat scroll dan pekerjaan Motion/3D, serta pemisahan JavaScript halaman publik lebih lanjut. Tidak menghapus animasi secara menyeluruh untuk mengejar skor.

## Yang diubah untuk mengurangi beban

- 82 foto asli `public/PRODUCT` tetap disimpan. Turunan WebP 320/640/800/1000 px digunakan melalui `srcset` dan `sizes`; unggahan admin baru yang belum punya turunan tetap menggunakan URL aslinya.
- Sampul produk dan foto pemakaian memakai turunan sesuai ukuran layar. Foto kedua kartu diunduh setelah pengguna memintanya, bukan saat opacity-nya masih nol.
- Header memakai foto portrait responsif dari gambar pemilik; foto selanjutnya dipersiapkan dan didekode sebelum fade. Pergantian 2,5 detik tetap ada, berhenti saat tidak terlihat/tab tersembunyi. Zoom galeri tetap dapat menggunakan foto asli.
- Font Archivo disajikan lokal, beserta lisensi OFL; tidak lagi menunggu stylesheet Google Fonts. Preconnect yang tidak digunakan dihapus.
- SDK akun/Firebase, chat AI, halaman akun/admin/affiliate/blog dan modal berat dimuat sesuai kebutuhan. Pengunjung baru tidak mengunduh SDK akun hanya untuk membaca katalog; sesi tersimpan tetap diperiksa melalui metadata penyimpanan lokal.
- HTML penuh beranda, empat halaman katalog dan 42 detail produk dibuat saat build. React memakai kembali HTML yang sesuai melalui hydration; judul, foto, harga dan tautan sudah tersedia sebelum aplikasi aktif. URL lama seperti `?view=profile` tidak dipaksakan menghidrasi HTML beranda.
- Video dan poster perjalanan pesanan dimuat saat mendekati viewport. Autoplay tanpa suara, loop, dan pause saat keluar layar dipertahankan. Viewer 3D tetap lazy dan hanya menggambar saat aktif.

Skrip reproduksi turunan foto: `python scripts/prepare-shop-images.py` dengan Pillow. Build lengkap: `npm run build:cloudflare`. Audit: `npx --yes lighthouse http://127.0.0.1:4173/ --port=9222 --only-categories=performance,seo --output=json --output-path=report.json --quiet` dengan Chrome audit tersendiri yang sudah berjalan di port tersebut.

## Judul dan informasi produk

- Beranda: **Kaos Anak Oversize & Baju Anak Katun | Kainora Kids**. Tulisan visual Small Fits. Big Energy. dipertahankan.
- Katalog: koleksi kaos anak oversize; nama, warna dan jenis produk ikut dalam judul detail, dengan deskripsi motif masing-masing.
- Seluruh 42 SKU putih Rp69.000 memakai ukuran **S, M, L, XL, XXL** dan status tersedia sesuai konfirmasi pemilik. Tidak mengarang jumlah unit stok. Status bisa diubah di admin; stok numerik nol mengalahkan label tersedia dan memblokir pemesanan.
- Tabel sementara yang dikonfirmasi pemilik: S 33×33, M 36×36, L 39×39, XL 42×42, XXL 45×45 cm (lebar × panjang). Tabel dipakai bersama oleh popup dan halaman panduan; dapat diganti setelah ukuran produksi final tersedia.
- Kaos hitam di viewer 3D tidak otomatis dianggap SKU putih atau diberi stok/harga katalog yang belum dikonfirmasi.

## Kebijakan toko dan structured data

- Pengiriman **dari Bandung melalui J&T Express**. Ongkir berdasarkan tujuan dan berat/volume aktual, dikonfirmasi toko. Tidak ada angka ongkir nol/gratis yang dibuat agar schema terlihat lengkap.
- [FAQ resmi J&T](https://www.jet.co.id/information/faq) menyebut estimasi umum Regular/EZ 2–3 hari kerja bergantung tujuan. Dokumentasi publik yang diperiksa tidak menyediakan matriks Bandung → setiap provinsi. Halaman menjelaskan batas ini dan mengarahkan pembeli ke [cek tarif J&T](https://www.jet.co.id/rates) serta estimasi rute aktual. Durasi proses toko tidak dikarang.
- Retur diajukan maksimal **2×24 jam** sejak diterima, video unboxing utuh dari paket belum dibuka, belum dicuci/dipakai, hangtag utuh. Kesalahan ukuran/kelalaian pembeli: ongkir ditanggung pembeli. Cacat/reject/kesalahan penjual: ongkir ditanggung Kainora. Tidak menjanjikan tanggal refund otomatis.
- Product/Offer memuat SKU, harga, mata uang, ukuran, kondisi barang, ketersediaan dan kebijakan retur. Organization/OnlineStore memuat identitas, akun sosial yang benar, kebijakan retur dan ShippingService. Tidak membuat rating, ulasan, GTIN, biaya kirim atau tanggal promo palsu.

### Google Rich Results Test sungguhan

Mode **CODE**, menggunakan JSON-LD persis dari HTML build dan pembungkus HTML publik sederhana; bukan pengujian URL produksi atau pemeriksaan indeks. Tidak memasukkan kunci API, akun pembeli atau data pesanan. Semua 42 dokumen juga diperiksa oleh skrip verifikasi build lokal, tetapi tes Google individual dilakukan pada produk Sunshine sebagai sampel dan Organization beranda.

- [Hasil produk Sunshine](https://search.google.com/test/rich-results/result?id=WSNyJsoCIo5_R7UmsfD4ng): **3 item valid** — Product snippets, Merchant listings, Breadcrumbs. Peringatan nonkritis merchant: `shippingDetails` opsional belum diisi. Ongkir dinamis belum dapat dinyatakan sebagai angka tetap. Product snippets juga dapat memberi peringatan field rekomendasi yang datanya belum tersedia; valid bukan berarti seluruh field opsional terisi.
- [Hasil Organization beranda](https://search.google.com/test/rich-results/result?id=jJSdNijbGkPh4qq4MUyTxQ): **2 item valid** — Organization dan Shipping policies.
- Bukti layar: `rich-results-product.png`, `rich-results-merchant.png`, `rich-results-organization.png`. Link hasil Google dapat kedaluwarsa.

Schema valid tidak menjamin Google menampilkan rich result. Setelah deploy, ulangi mode URL pada domain nyata dan periksa Search Console/Merchant Center. Peringatan tidak dihilangkan dengan mengarang data.

## Panduan yang membantu pembeli

Empat halaman indexable, HTML statis, canonical, metadata dan sitemap:

1. `/panduan/ukuran-kaos-anak/` — mengukur kaos pembanding, lebar ketiak-ke-ketiak, panjang bahu-ke-hem, tabel S–XXL dan ruang gerak. Ukuran badan/umur tidak diperlakukan sebagai jaminan ukuran.
2. `/panduan/perawatan-sablon/` — membalik kaos, deterjen lembut, mengikuti label, menjemur teduh, tidak menyetrika langsung sablon.
3. `/pengiriman/` — asal, kurir, cek ongkir, estimasi bersyarat dan pelacakan.
4. `/retur/` — batas waktu, bukti, kondisi produk, pembagian ongkir dan konfirmasi sebelum mengirim kembali.

Panduan saling tertaut, tersedia di footer/katalog/detail dan kembali ke katalog. Galeri serta bagian detail menggunakan foto pemakaian milik pemilik dari `public/PRODUCT` jika tersedia; tidak menambahkan foto stok sebagai bukti pemakaian pelanggan.

## Verifikasi dan batasnya

- **39 tes otomatis lulus**, mencakup katalog, harga/ukuran/stok, schema, URL lama, admin, affiliate, keranjang, profil, identitas buyer dan alur quotation. Tes admin/backend memakai fixture dan mock, bukan publikasi atau transaksi nyata.
- `node scripts/verify-products-build.mjs`: 42 HTML detail dengan harga/foto, metadata unik, canonical, availability, retur dan breadcrumb; empat halaman katalog, pagination, sitemap serta 404 noindex diperiksa.
- Build Cloudflare lulus: 47 halaman storefront memakai HTML React yang sudah dirender; 71 artikel lama dan empat panduan tetap dibuat. Semua 739 file hasil build berada di bawah batas 25 MiB per file.
- ESLint pada berkas baru/perubahan terarah: tidak ada error. Pemeriksaan lebih luas pada berkas lama juga memperlihatkan beberapa warning Fast Refresh, import/dependency hook lama; tidak dinyatakan seluruh repo bebas warning.
- Browser 320/390/1440 px: beranda, katalog/detail, keempat panduan, affiliate, keranjang dan profil tidak melebar horizontal; tidak ada pageerror JavaScript pada rangkaian pemeriksaan. HTML tetap terbaca dengan JavaScript dimatikan.
- Chart → M → foto/popup/Escape → tambah keranjang → panduan → keranjang mempertahankan motif/ukuran dan subtotal Rp69.000. Popup akun lazy tampil dengan input email dan dapat ditutup; tidak mencoba login atau menyimpan profil akun nyata.
- Slideshow berpindah dari camp ke blue otomatis. Pengunjung baru tidak meminta chunk Firebase/BuyerBackend saat menunggu slideshow. Efek 3D/video/zoom tetap berada dalam implementasi; pengujian shader lengkap dari pekerjaan sebelumnya tidak diklaim diulang dalam audit SEO ini.

Foto layar lokal tersimpan di direktori laporan ini. Tidak melakukan deploy, push, perubahan DNS, pembuatan akun pembeli atau pesanan produksi. Skor SEO/performa produksi dan INP pengunjung nyata masih harus dibuktikan setelah publikasi.

Referensi: [Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals), [merchant listing](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing), [shipping policy](https://developers.google.com/search/docs/appearance/structured-data/shipping-policy), [return policy](https://developers.google.com/search/docs/appearance/structured-data/return-policy).
