# Panduan ukuran fashion anak — riset dan arah desain

Tanggal penelusuran: 23 Oktober 2026. Status: **bahan brainstorming dan pemilihan konsep, belum spesifikasi yang disetujui atau implementasi website**.

## Keputusan yang disarankan

Lanjutkan dengan **Studio Ukuran** sebagai arah visual, alur bertahap di HP, dan fitur membandingkan pakaian yang sudah nyaman dipakai. Halaman melayani orang tua di Indonesia; mesin analisis berjalan lokal tanpa LLM atau API berbayar. Nilai utamanya adalah membantu orang tua mengetahui **apa yang harus diukur dan angka yang harus dicari pada size chart**, bukan menjanjikan satu label ukuran yang pasti cocok untuk seluruh merek.

Ukuran tubuh, dimensi pakaian jadi, label ukuran, dan panjang kaki adalah empat hal berbeda. Ketidakpastian ini harus terlihat dalam hasil, bukan disembunyikan oleh animasi atau kata AI.

## Hasil pengumpulan data yang benar-benar tersedia

`observations.json` berisi **72 baris observasi dari 7 merek**: H&M, adidas, Mothercare, UNIQLO, Nike, Cotton On, dan Bata. Ini sampel riset terpilih, bukan inventaris lengkap seluruh ukuran merek. Sebagian sumber merupakan situs regional, tabel lama yang terindeks, atau respons yang masih perlu verifikasi; jumlah 72 bukan jumlah baris yang siap digunakan dalam kalkulator.

| Kelompok data | Hasil | Batas penggunaan |
|---|---|---|
| Tubuh anak/bayi | H&M Indonesia; adidas UAE; Mothercare Singapura | Dapat dibandingkan secara deskriptif pada tinggi nominal yang selaras. Bukan survei anak Indonesia atau dimensi pola pakaian. |
| Tubuh anak tambahan | UNIQLO Indonesia; Nike Kids Fit global | Grid tinggi, pasar, dan rentang berbeda; disimpan terpisah agar tidak dipaksakan ke rata-rata. |
| Pakaian jadi per potongan | Cotton On regular tee pendek, boxy tee panjang, slim stretch tee pendek | Satu merek/SKU per potongan. Belum cukup untuk rata-rata lintas merek. Regular tee yang ditemukan sudah 410 saat dibuka langsung, sehingga hanya referensi historis. |
| Panjang kaki | adidas UAE; tabel Bata Indonesia | URL Bata memberikan dua versi tabel berbeda pada permintaan berbeda. Bata dikarantina dari agregasi sampai versi/model terverifikasi. |
| Muslim anak | Sumber Rabbani ditemukan | Belum ada tabel numerik terverifikasi untuk koko/gamis/hijab/mukena dalam dataset. |
| Dress, bawahan, pakaian rumah/dalam, bayi per pola | Ada metode ukur dan tabel tubuh umum | Belum ada sampel multi-merek pakaian jadi per pola yang cukup. Jangan membuat rata-rata potongan dari tabel dada tubuh. |

Sumber lengkap, pasar, status akses, SKU dan alasan eksklusi ada di [sources.json](sources.json). Next, PUMA, Rabbani, dan Bohopanna tercatat sebagai sumber yang ditinjau/ditemukan tetapi tidak dihitung sebagai data numerik bersih.

### Rata-rata awal yang telah dihitung

Tiga sumber: [H&M Indonesia](https://id.hm.com/id_id/customer-service/sizeguide/kids.html), [adidas UAE](https://www.adidas.ae/en/size-chart-kids-clothes.html), [Mothercare Singapura](https://www.mothercare.com.sg/size-charts/2025-mothercare-baby--kids/).

Metode: rentang dada H&M diwakili titik tengah; satu suara per merek; disejajarkan menurut **label/ujung tinggi nominal**. H&M tidak memberikan rentang tinggi yang sama dengan dua sumber lain. Karena itu, hasil berikut adalah ringkasan sampel label nominal, bukan prediksi lingkar dada setiap anak pada tinggi tersebut.

| Acuan tinggi nominal | Rata-rata acuan lingkar dada tubuh | Rata-rata acuan lingkar pinggang tubuh | Jumlah merek |
|---|---:|---:|---:|
| 92 cm | 52,83 cm | 51,17 cm | 3 |
| 98 cm | 55,00 cm | 53,00 cm | 3 |
| 104 cm | 56,67 cm | 54,33 cm | 3 |
| 110 cm | 58,50 cm | 55,00 cm | 3 |
| 116 cm | 60,67 cm | 55,83 cm | 3 |

**Angka dada di atas bukan lebar kaos.** Jangan membagi dua lalu langsung menyebutnya ukuran kaos yang pas; kelonggaran, bahan, pola dan panjang belum diperhitungkan. Dua desimal dipertahankan untuk audit perhitungan, bukan ketelitian praktis pengukuran.

Contoh pengaruh cutting pada satu merek: ukuran berlabel 4 pada [slim stretch tee](https://cottonon.com/US/fitted-short-sleeve-essential-boat-neck-tee/7348978-04.html) memiliki lingkar dada produk 55 cm dan panjang 39 cm; [boxy lengan panjang](https://cottonon.com/US/essential-long-sleeve-boxy-tee/7349143-05.html) 76 cm dan 43 cm. Ini produk/bahan berbeda, **bukan eksperimen terkontrol tentang cutting**, tetapi menunjukkan mengapa semua pakaian tidak boleh dipaksa ke satu tabel atau selisih 1–2 cm.

Jalankan ulang dengan `python docs/research/2026-10-23-size-guide/calculate.py`. Hasil terdapat pada `summary.json`, termasuk median, jangkauan antar titik acuan, konversi inci Nike, serta alasan angka tidak layak menjadi rekomendasi produksi. Semua `public_recommendation_eligible` tetap `false`.

### Kalimat publik yang disarankan

> Panduan ini menggunakan acuan dari sampel tabel ukuran merek yang tersedia di Indonesia, dengan referensi regional yang ditandai. Ukuran dapat berbeda menurut merek, model, bahan, dan potongan. Cocokkan hasil dengan size chart produk sebelum membeli.

Jangan menulis “rata-rata ukuran anak Indonesia” sebagai hasil survei nasional. Jangan menjanjikan “setiap merek hanya berbeda 1–2 cm”. [UNIQLO Indonesia](https://faq-id.uniqlo.com/pkb_Home_UQ_ID?c=category_uq_th%3AUQID_C6&fs=Search&id=kA0Ie000000TP0n&l=in&pn=1) memang menyebut perbedaan 1–2 cm terkait tipe/bahan produknya; itu bukan batas universal antarmerek. [ISO 8559-2:2025](https://www.iso.org/standard/85590.html) membahas indikator ukuran berdasarkan tubuh, bukan tabel ukuran pakaian nasional Indonesia. Tidak ada klaim sertifikasi ISO/SNI untuk alat ini.

## Cakupan: tujuh kelompok, banyak kebutuhan

Urutan berikut adalah **prioritas desain yang diusulkan**, bukan peringkat volume pencarian atau hasil survei kebutuhan orang tua.

| Kelompok | Jenis yang masuk | Ukuran penting | Visual dan animasi khusus |
|---|---|---|---|
| Atasan & outer ringan | Kaos, polo, kemeja, blouse, tunik, hoodie, jaket ringan | Tinggi, dada; bahu/lengan sesuai produk; lebar dan panjang pakaian pembanding | Kaos/atasan besar; garis lebar dan panjang tergambar berurutan. Ganti regular/relaxed/oversize mengubah siluet dan posisi garis secara halus. Outer mengaktifkan lengan dan kebutuhan layering. |
| Bawahan | Celana pendek/panjang, jeans, jogger, legging, rok | Pinggang, pinggul, panjang kaki dalam/panjang yang diinginkan; elastisitas | Celana depan; garis pinggang, pinggul dan inseam. Pilih pendek/panjang mengubah batas panjang; denim dan stretch memiliki aturan berbeda. |
| Sepatu & sandal | Sepatu sekolah, sneaker, olahraga, sandal, clogs | Panjang kedua kaki; lebar kaki bila relevan; model | Tampak atas/samping; garis tumit–jari terpanjang dan lebar. Sorot kaki lebih panjang. Ruang depan tidak memakai tambahan universal yang diada-adakan. |
| Bayi | Bodysuit, romper, sleepsuit, atasan/bawahan bayi | Umur bulan sebagai konteks; panjang tubuh, dada, panjang torso untuk one-piece | Visual bodysuit; jalur bahu–selangkangan dan dada. Sleepsuit berkaki meminta ruang kaki; tidak hanya membesarkan kaos dewasa. |
| Dress & one-piece | Dress, jumpsuit, playsuit | Dada, pinggang, tinggi, panjang yang diinginkan; torso/inseam untuk jumpsuit | Dress ditampilkan utuh; garis dada dan panjang turun. Pilihan siluet mengubah volume/hem secara terkendali, bukan animasi flare tanpa makna. |
| Pakaian rumah & dalam | Piyama, setelan rumah, singlet, celana dalam, kaus kaki | Dada/pinggang/pinggul sesuai subjenis; panjang kaki untuk kaus kaki; bahan stretch | Atasan-bawahan terpisah untuk setelan; ukur bagian yang sedang dipilih. Tidak menyarankan pakaian tidur/internals sengaja kebesaran tanpa dasar produk. |
| Muslim & ibadah | Koko, gamis, hijab instan anak, mukena | Dada dan panjang untuk koko/gamis; lingkar wajah dan panjang hijab; cakupan mukena | Visual berubah sesuai subjenis. Garis wajah untuk hijab dan panjang/cakupan untuk mukena, tidak memakai data kaos sebagai pengganti. |

Skenario “Persiapan sekolah” menghubungkan atasan, bawahan, dan sepatu. Bukan kategori kedelapan dengan data/algoritma duplikat. Aksesori dekoratif, perhiasan, kostum, dan tas tidak menjadi kalkulator utama tahap pertama; ukuran tas bukan hasil turunan dari berat badan anak.

Ketujuh kategori harus punya halaman/cara ukur. **Rekomendasi angka hanya diaktifkan pada subkategori yang datanya lolos**, sedangkan kategori lain tetap memberi panduan ukur dan pencocokan size chart. Ini bukan alasan menghilangkan kategorinya.

## Tiga arah visual untuk dipilih

1. **Studio Ukuran — rekomendasi.** Satu visual pakaian besar, panel input pendek, kategori jelas, hasil dapat dijelaskan. Paling seimbang untuk orang tua yang ingin jawaban cepat dan visual yang menarik. Tantangan: visual jangan menutupi formulir di HP.
2. **Meja Banding.** Dua potongan/pakaian pembanding sejajar. Paling kuat mengajarkan beda fit dan membandingkan pakaian favorit. Tantangan: lebih padat dan perlu dua tahap tampilan pada layar kecil.
3. **Panduan Bertahap.** Satu pertanyaan/kelompok input per langkah; visual selalu mengikuti. Paling mudah bagi pengguna baru dan mengurangi beban formulir. Tantangan: lebih banyak ketukan untuk pengguna yang sudah tahu ukurannya.

Usulan: struktur Studio Ukuran, fitur banding sebagai tindakan kedua, langkah ringkas di HP. Pilihan ini belum disetujui pengguna.

Gambar konsep tersimpan di `concepts/studio-ukuran.png`, `concepts/meja-banding.png`, dan `concepts/panduan-bertahap.png`. Ketiganya gambar ideasi, bukan screenshot implementasi, bukan foto produk yang dijual, dan bukan bukti hasil kalkulator. Pada desain final sepatu, garis panjang kaki harus berada pada jejak kaki/bidang ukur, bukan disamakan dengan panjang sol luar sepatu. Kolom pakaian pembanding meminta ukuran dalam cm, bukan mengandalkan label S/M/L saja.

## Susunan halaman yang diusulkan

1. **Pembuka ringkas:** H1 “Panduan Ukuran Baju, Celana & Sepatu Anak”. Headline visual “Ukuran pas. Bergerak bebas.”; tidak ada intro panjang yang menunda alat.
2. **Pemilih kebutuhan:** tujuh kelompok dengan label Indonesia; subjenis muncul setelah kelompok dipilih. Pilihan cutting hanya muncul bila relevan. Tidak ada pemilih merek.
3. **Studio interaktif:** desktop input di kiri dan visual di kanan; HP kategori → visual ringkas → input → hasil. Input yang sama tetap tersimpan selama pindah kategori, tetapi hanya ukuran yang relevan digunakan.
4. **Dua jalur:** “Saya tahu ukuran tubuh” dan “Bandingkan pakaian yang sudah pas”. Berat/tinggi saja menghasilkan estimasi terbatas atau meminta ukuran tambahan; jangan menghasilkan lingkar tubuh presisi dari rumus tanpa data.
5. **Hasil yang dapat dimengerti:** ukuran acuan, dimensi tubuh/produk yang harus dicari, alasan, alternatif bila di batas ukuran, dan hal yang masih perlu dicek. Tidak membuat “98% cocok”.
6. **Cara mengukur:** petunjuk bertahap; menekan “Lingkar dada” menyorot garis yang sesuai pada visual. Tampilkan satuan dan bedakan lebar dari lingkar.
7. **Bandingkan fit:** tampilkan regular/relaxed/oversize berdampingan jika datanya ada. Tidak menyamakan boxy, oversized dan sekadar naik satu label ukuran.
8. **Sumber & pembaruan:** panel metodologi berisi sumber, tanggal diperiksa, jenis data, cakupan dan keterbatasan. Nama merek berada pada atribusi sumber, bukan filter rekomendasi.
9. **Tautan bantu dan produk relevan:** ajakan melihat koleksi hanya setelah hasil, tidak menutupi alat. Rekomendasi produk Kainora memakai size chart Kainora yang terpisah dari benchmark umum.

## Rencana motion

Animasi menjelaskan hubungan input → garis ukur → hasil; bukan waktu tunggu palsu.

| Interaksi | Gerakan yang dirancang | Durasi usulan |
|---|---|---|
| Pilih kategori | Visual lama opacity turun; visual baru muncul dengan pergeseran kecil dan scale 0,97 → 1 | 260–380 ms |
| Pengukuran aktif | Garis utama digambar, kemudian garis kedua; angka muncul di dekat garis, bukan jauh pada kartu lain | 420–700 ms |
| Ubah angka | Garis/label bergerak ke posisi akhir; nilai tetap dapat dibaca selama transisi | 180–260 ms |
| Ubah fit | Siluet/asset berpindah ke bentuk fit tujuan; titik ukur ikut berpindah | 360–500 ms |
| Minta hasil | Hasil siap ditampilkan segera, panel masuk dengan opacity dan translate 8 px; tidak menunggu seluruh dekorasi selesai | 220–320 ms |
| Buka panduan | Penjelasan meluas dari kontrol terkait; fokus tetap masuk akal dan tersedia tombol tutup | 220–280 ms |
| Pindah bagian halaman | Reveal pendek sekali ketika masuk area pandang | 300–450 ms |

Seluruh durasi di atas adalah rancangan, belum hasil pengujian pengguna atau implementasi. Jangan membuat animasi angka merayap dari nol setiap mengetik. Jangan mengumumkan setiap frame kepada screen reader. `prefers-reduced-motion` menampilkan keadaan akhir dengan transisi minimal. Tidak ada scroll hijacking, pin panjang, atau efek berkedip.

Referensi terbuka yang diperiksa:

- [Motion SVG animation](https://motion.dev/docs/react-svg-animation): line drawing dan perpindahan titik ukur. Pakai fitur bebas yang cocok dengan versi Motion proyek; tidak mengasumsikan semua API dokumentasi terbaru tersedia pada versi terpasang.
- [Motion path drawing example](https://examples.motion.dev/react/path-drawing): acuan penggambaran garis; tidak membeli Motion+.
- [Framer Academy scroll animations](https://www.framer.com/academy/lessons/scroll-animations): reveal yang mengikuti konteks viewport.
- [Framer product configurator](https://www.framer.com/marketplace/components/product-configurator/): referensi hubungan pilihan dan visual; komponen berbayar hanya dilihat sebagai referensi konsep, tidak dibeli/disalin sumbernya.
- [21st.dev community](https://21st.dev/community/components): katalog interaksi tab, accordion dan tombol. Peninjauan katalog bukan audit source code atau bukti semua demo telah diuji.
- Mobbin tidak dapat diakses karena paket berbayar; pengguna menyetujui lanjut tanpa Mobbin.

## Mesin rekomendasi tanpa LLM

Nama publik: **Panduan Ukuran Cerdas**. Penjelasan singkat: analisis berbasis ukuran dan aturan. Sistem pakar berbasis aturan dapat dibuat sendiri, tetapi bukan model AI yang dilatih dan tidak boleh dipasarkan sebagai pendeteksi bentuk tubuh.

Alur: validasi satuan dan input → pilih aturan kategori/subjenis → pilih sumber yang memenuhi cakupan → cocokkan dimensi penting → pilih kandidat yang memenuhi kebutuhan → jelaskan alasan/alternatif atau minta pengukuran tambahan.

- Atasan mengutamakan dada dan panjang; bawahan mempertimbangkan pinggang/pinggul/panjang; sepatu meminta kaki, bukan berat badan.
- Jika input hanya usia/tinggi/berat, tampilkan perkiraan awal dengan keterbatasannya. Tidak ada model tervalidasi untuk menebak dada/torso/kaki dari input ini pada dataset sekarang.
- Kondisi datanya kurang harus menghasilkan pesan “Perlu ukuran tambahan” atau “Acuan angka belum cukup”, bukan label pasti.
- Tidak ada bonus “growth allowance” umum untuk semua item. Ruang tumbuh, kelonggaran fit dan ukuran produk adalah variabel berbeda.
- Dukung koma desimal Indonesia; label selalu menyebut cm/kg; input kosong tidak menjadi nol; hindari pergantian hasil saat pengguna belum selesai mengetik.
- Data anak tidak dikirim ke server, tidak perlu login/nama/foto. Simpan profil di perangkat hanya bila pengguna memilihnya; jangan masukkan ukuran anak ke URL publik.

## Cara menyelesaikan rata-rata per cutting dengan benar

1. Buat matriks **jenis × potongan × bahan/stretch × kelompok tinggi × pasar**. Contoh: tee pendek regular katun non-stretch dipisahkan dari fitted rib dan boxy panjang.
2. Kumpulkan chart pakaian jadi dari sedikitnya tiga merek independen per sel sebagai gerbang cakupan internal awal, lalu tambah sampel SKU/ukuran. Tiga merek belum membuktikan representativitas Indonesia.
3. Catat URL, SKU, tanggal, pasar, metode ukur, panjang depan/belakang, lebar/lingkar dan toleransi produsen. Jangan menganggap label 4 otomatis sama dengan ukuran tinggi 104.
4. Normalisasi hanya metode yang sepadan. Setengah lingkar boleh diturunkan dan ditandai; jangan menggantinya sebagai pengukuran ketiak-ke-ketiak bila konstruksi pakaian tidak mendukung.
5. Samakan kelompok tinggi dengan aturan eksplisit. Bila perlu interpolasi, simpan asumsi dan jangan ekstrapolasi di luar rentang teramati.
6. Hitung rata-rata per merek lebih dahulu agar merek dengan banyak SKU tidak mendominasi; tampilkan juga median dan jangkauan. Jangan menyebut jangkauan sampel sebagai confidence interval.
7. Periksa anomali, perubahan versi dan data kosong; jangan menghapus outlier hanya karena merusak rata-rata.
8. Uji kasus nyata dengan mengukur pakaian pembanding. Ukur kesesuaian dimensi, keberhasilan pengguna menyelesaikan alat dan kebutuhan koreksi; jangan mengklaim akurasi sebelum ada pengujian.

Sampel pola multi-merek untuk bawahan, dress, bayi one-piece, pakaian rumah/dalam dan muslim **masih harus dilengkapi**. Dokumen ini tidak mengisi kekosongan itu dengan angka buatan.

## SEO, mobile, dan kecepatan

- Usulan URL induk `/panduan-ukuran-anak/`; halaman kategori yang mempunyai konten substantif memakai URL tetap dan canonical sendiri. Jangan membuat ratusan halaman tipis dari kombinasi berat/tinggi.
- Teks pengukuran, tabel yang layak, sumber, breadcrumb dan tautan kategori hadir pada HTML hasil render/prerender, tidak bergantung pada pengguna menghitung dahulu.
- Judul, deskripsi, heading dan internal link mencakup “ukuran baju anak”, “ukuran celana anak”, dan “ukuran sepatu anak” secara alami. Jangan menjanjikan ranking/score tinggi karena desain.
- Gunakan `WebPage`/`BreadcrumbList` yang cocok; schema tidak boleh memasukkan ukuran/ulasan/akurasi palsu. FAQ terlihat dapat membantu pengguna, tetapi jangan menjanjikan FAQ rich result untuk situs toko.
- HP: teks utama minimal 16 px, tombol efektif sekitar 44 px, unit jelas, label tidak hanya placeholder. Visual tidak menutupi input; semua informasi penting tersedia tanpa hover.
- Asset garment berlisensi/orisinal: render ringan per kategori dengan overlay garis vektor. Satu visual aktif; 3D opsional hanya jika membantu, dimuat belakangan. Jangan menjalankan tujuh WebGL canvas.
- Arah performa: LCP ≤2,5 detik, INP ≤200 ms, CLS ≤0,1; ukur lagi setelah implementasi. Laporan proyek sebelumnya masih menunjukkan beberapa target belum tercapai, jadi angka ini target, bukan hasil halaman baru.
- Tetapkan dimensi asset, muat font seperlunya, animasikan transform/opacity/garis secara terukur, hentikan aktivitas di luar viewport. Tidak ada biaya inferensi AI atau API baru untuk kalkulator lokal.

## Urutan lanjutan setelah konsep dipilih

1. Pengguna memilih arah visual dari tiga konsep. Penjelasan dan gambar sekarang merupakan usulan yang dapat direvisi.
2. Susun spesifikasi desain final sesuai pilihan: desktop/HP, setiap kategori, hasil, error, aksesibilitas dan keadaan data belum cukup.
3. Lengkapi dan validasi dataset per subkategori sebelum hasil angka diaktifkan; halaman cara ukur tetap mencakup seluruh kelompok.
4. Setelah desain disetujui, pecah rencana implementasi pada stack Kainora yang sudah ada. Jangan membuat aplikasi baru atau mengganti alur admin yang ada tanpa kebutuhan.
5. Verifikasi visual pada 320/390/768/1440 px, keyboard/reduced-motion, aturan ukuran dan input batas, tautan sumber, SEO render dan Core Web Vitals.

Website belum diubah oleh pekerjaan riset ini. Tidak ada klaim seluruh pola sudah memiliki rata-rata, algoritma sudah terkalibrasi, atau visual konsep merupakan kalkulator yang telah berjalan.
