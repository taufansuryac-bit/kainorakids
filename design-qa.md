# Studio Ukuran — design QA, diperbarui 26 Oktober 2026

QA 23 Oktober digantikan oleh audit dan perbaikan 26 Oktober. Klaim lama bahwa semua masalah visual telah tertutup terlalu luas: audit ulang menemukan sembilan masalah, termasuk 13 jenis dengan dimensi yang belum tergambar dan crop pada HP kecil. Riwayat dan bukti asli tetap tersimpan di `docs/size-studio-2026-10-23/` dan `docs/audit-studio-ukuran-2026-10-26/`.

## Findings

- F01–F09 sudah ditangani dan diuji ulang. Rincian perbaikan/bukti: `docs/size-studio-fixes-2026-10-26/PERBAIKAN.md`.
- Accepted visual adjustment: ilustrasi kini ditampung utuh dalam bidang persegi. Satu dimensi aktif dengan tombol pilihan dan angka di bawah menggantikan label menumpuk pada gambar; ini mengurangi tabrakan di HP. Komposisi dasar tetap mengikuti mockup, tetapi tidak diklaim identik per piksel.
- Accepted product limit: halaman belum menghasilkan rekomendasi label ukuran universal; dataset rata-rata Indonesia per cutting belum tervalidasi. Catatan ukuran dan perbandingan masukan tetap berfungsi.

## Visual truth dan bukti aktual

- Acuan: `docs/research/2026-10-23-size-guide/concepts/studio-ukuran.png` (1487×1058).
- Desktop baru: `docs/size-studio-fixes-2026-10-26/desktop-final.png`; viewport CSS diminta 1487×1058, area konten lebih sempit karena scrollbar.
- HP baru: `docs/size-studio-fixes-2026-10-26/mobile-final.png`; viewport CSS 390×844.
- Ukuran berkas capture aktual: desktop 1472×1047, HP 375×812. Screenshot ditinjau tanpa meregangkan gambar; batas viewport/scrollbar tidak seluruhnya masuk capture.
- State visual akhir: Atasan, Regular, lebar dada aktif. Formulir boleh berisi angka simulasi; ilustrasi body tidak mengubah lingkar dada menjadi lebar pakaian.
- Bukti semua jenis: `visual-contact.png` dan 21 tangkapan desktop asli. Kontak sheet adalah crop analisis, bukan pengganti screenshot asli.

## Required fidelity surfaces

- Typography: Archivo, display tebal, body 15–17 px, input 16 px. Hierarki judul/kategori/form/visual dipertahankan. Tombol dimensi dapat membungkus pada layar sempit.
- Layout/spacing: desktop dua kolom 32%/sisa, gap 32 px; mobile ilustrasi di atas formulir. Margin putih, bidang cream, CTA hitam dan pilihan lime dipertahankan. Ilustrasi tidak lagi diperbesar melewati batas bidang.
- Colors: ink #10110e, stage #f3f0e8, lime #d9ff38. Panah tipis dengan arah kepala otomatis; dimensi aktif terhubung ke readout.
- Assets: raster ivory/tekstur kain dipertahankan. Singlet, legging, sandal dan ilustrasi metode kaki ditambah; sumber PNG dipertahankan dan WebP digunakan di halaman. SVG hanya untuk anotasi fungsional. Semua 21 gambar jenis termuat saat simulasi.
- Copy: catatan tubuh, pakaian dan alas kaki dibedakan. Sisi Pembanding/Size chart mengikuti input aktif. Petunjuk khusus tersedia untuk seluruh dimensi. Sumber dan batas dataset tetap transparan.

## Verification

- 84 simulasi formulir aktual: 21 jenis × body/compare × desktop/HP390. Semuanya menghasilkan hasil dan tidak overflow.
- 51 penanda pada HP320: endpoint animasi ditunggu sampai selesai; gambar tertampung dan readout/header tidak bertabrakan.
- Tambahan responsif: 360, 375, 414, 430, 768, 844 landscape, 1024; input 16 px, tombol dimensi minimal 44 px, tanpa overflow horizontal.
- Regresi: klik pertama menampilkan hasil; kesalahan kolom lain tetap ada; mode lanjutan memfokuskan judul formulir yang terlihat; pembanding30 dan chart32 menampilkan sisi/angka yang sesuai.
- 53 tes Node lulus, ESLint fitur lulus, build produksi lulus. Logs dan data browser di `docs/size-studio-fixes-2026-10-26/`.
- Build produksi port 4173 diuji direct route, pergantian fit/aset, hasil formulir dan fokus mode lanjutan; console kosong. Tab kemudian dikembalikan ke port 5173 dan override viewport direset. Bukti `production-smoke.json`, `production-desktop.png`.
- Reduced motion ditinjau dari kode; tidak ada pengujian preferensi OS atau matriks perangkat fisik. Tidak ada klaim akurasi fit fisik, nilai performa lapangan, atau sertifikasi semua perangkat.

## Implementation checklist

- [x] Sembilan temuan audit ditangani.
- [x] Komposisi acuan dipertahankan dengan penyesuaian anotasi untuk keterbacaan.
- [x] Semua dimensi dan jenis memiliki visual yang sesuai.
- [x] Simulasi desktop/HP serta regresi formulir dan angka dilakukan.
- [x] Build, lint, dan tes selesai tanpa kegagalan.

Final result: passed pada cakupan yang diuji, dengan batas produk dan perangkat di atas.
