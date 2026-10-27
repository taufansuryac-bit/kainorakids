# Halaman affiliate — Kainora Creator Club

Pemilik meminta desain informatif, modern/futuristik dengan animasi berkelas, kemudian secara eksplisit meminta langsung diterapkan. Pemilik juga meminta persentase komisi per produk di panel admin.

## Hasil

- Halaman `/?view=affiliate`: hero Create / Share / Inspire, foto gaya Kainora berlapis, orbit tipis, informasi kolaborasi, simulator, empat langkah kerja sama, FAQ, dan form perkenalan.
- Identitas putih/hitam/lime Kainora dipertahankan. Motion mengatur reveal judul/foto, parallax ringan, pergantian gambar, angka estimasi dan accordion. Gerakan dekoratif dapat dijeda; prefers-reduced-motion dihormati. Tidak menahan atau membajak scroll.
- Halaman dimuat secara lazy agar CSS/kode affiliate tidak perlu dimuat di beranda.
- Admin mempunyai menu **Komisi affiliate**: persentase 0–100, maksimal dua desimal, disimpan bersama JSON katalog dan mengikuti publish Git-backed yang sudah ada. Kosong berarti tidak ditampilkan di simulator; 0% merupakan tarif nol yang eksplisit.
- Delapan produk berharga memakai nilai awal simulasi 12% dari halaman lama. Empat motif tanpa harga tidak diberi angka rekaan. Nilai ini dapat diubah per produk; bukan janji tarif kerja sama atau pencairan otomatis.
- Simulator mendukung ID numerik maupun string, jumlah 1–100 dan pembulatan rupiah per penjualan. Harga/tarif kosong tidak berubah menjadi estimasi Rp0.
- Form lama yang mencoba menulis pendaftaran ke koleksi Firebase tanpa izin diganti jalur perkenalan melalui Instagram Kainora. Form menyiapkan/menyalin pesan, lalu pengguna sendiri membuka dan mengirim DM. Tidak ada pesan yang dikirim otomatis atau klaim pendaftaran berhasil.
- Klaim pendapatan jutaan, sampel otomatis, saldo/pencairan otomatis dan video testimonial placeholder dihapus.

## Cara mengatur komisi

1. Buka `http://127.0.0.1:5174/?view=admin` (jalankan `npm run dev:admin` jika server berhenti).
2. Pilih **Komisi affiliate**, isi persentase produk.
3. Klik **Simpan ke project** pada mode lokal. Di hosting yang sudah diaktifkan, **Terbitkan** membuat commit lalu menunggu build Cloudflare.
4. Buka ulang halaman affiliate untuk melihat tarif tersimpan. Mengosongkan tarif mengeluarkan produk dari simulator.

## Verifikasi

- Test affiliate 3/3: validasi/simpan persentase, batas input, pembulatan, tarif nol, harga/tarif kosong dan ID string.
- Test admin 17/17; build Cloudflare dan scoped ESLint lulus.
- Browser desktop 1440, mobile 390 dan sempit 320: tanpa overflow horizontal; simulator/FAQ/perkenalan diperiksa.
- Round trip lokal nyata: Sunshine 12% → 7,5%, simpan/reload, simulator menunjukkan Rp66.750 untuk 10 × Rp89.000; kemudian baseline 12% dikembalikan.
- Orbit terbukti bergerak, berhenti ketika dijeda, dan tidak berjalan pada reduced-motion. Pemeriksaan halaman baru tanpa error runtime/console.
- Clipboard diuji dengan stub browser untuk menghindari menimpa clipboard pengguna; tidak ada DM atau pendaftaran produksi yang dikirim.

## Referensi visual

Riset arah tipografi/editorial: [Creovo / Framer](https://creovo.framer.website/). Riset reveal teks: [Lexicon / 21st.dev](https://21st.dev/@daiwiikharihar/library/lexicon), [Text Reveal](https://preview.21st.dev/@dillionverma/components/text-reveal). Implementasi asli memakai API Motion yang sudah ada; tidak mengunduh atau memasang template berbayar.

Cloudflare dan admin GitHub online tetap mengikuti panduan aktivasi yang sudah ada. Pekerjaan ini tidak melakukan push, deployment, perubahan DNS atau perubahan kebijakan Firebase.
