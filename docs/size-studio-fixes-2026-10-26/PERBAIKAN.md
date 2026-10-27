# Perbaikan Studio Ukuran — 26 Oktober 2026

Seluruh sembilan temuan pada audit 26 Oktober ditangani dalam kode dan diperiksa ulang. Ini adalah panduan metode pengukuran dan perbandingan angka; belum ada model ukuran universal yang tervalidasi.

| ID | Perbaikan | Bukti utama |
|---|---|---|
| F01 | Titik ukur per aset/cutting, bukan per kategori umum. Panjang hoodie dimulai di bahu, mukena dari puncak kepala; torso dan kaki dalam dipisahkan. | `visual-profiles.json`, `visual-contact.png` |
| F02 | Kepala panah SVG mengikuti arah vektor dengan `auto-start-reverse`, termasuk lengan/torso/kaki diagonal. | `mobile320-dimensions.json`, tangkapan outer/koko |
| F03 | Seluruh 51 dimensi dari 21 jenis memiliki penanda yang dapat dipilih. Lingkar wajah berupa lintasan tertutup; kaki ditampilkan di atas kertas dengan garis bantu batas tumit/jari. | `mobile320-dimensions.json` |
| F04 | Gambar dan SVG berada pada bidang persegi yang sama dan selalu ditampung utuh. Judul contoh dan angka mendapat ruang tersendiri. Satu dimensi aktif ditampilkan supaya garis/label tidak bertabrakan pada HP. | `mobile-final.png`, `responsive-matrix.json` |
| F05 | Aset khusus singlet, legging, sandal dan kaki di kertas ditambahkan. Sandal/sepatu/kaus kaki tetap ditampilkan sebagai contoh kecil, bukan dipakai mengukur sol. Alt mengikuti gambar sebenarnya. | `browser-simulations.json`, tangkapan singlet/legging/sandal |
| F06 | Petunjuk pesak, lengan, torso, mukena, hijab dan alas kaki dibedakan. Hasil pakaian dalam/hijab tidak lagi memakai catatan dada. Istilah perbandingan diselaraskan dengan keluaran “lebih kecil”. | Tes regresi dan hasil browser |
| F07 | Pergantian mode memfokuskan judul formulir dan menggulirnya ke area terlihat tanpa membuka keyboard. | `mode-switch-mobile.json`, `mobile320-mode-switch.png` |
| F08 | Mengedit satu kolom hanya mengoreksi kesalahan kolom itu; kolom kosong lain tetap invalid. Mengganti fit juga tidak membuang kesalahan formulir. | `validation-regression.json` |
| F09 | Angka dan label sisi mengikuti kolom pembanding atau chart yang dipilih. Tombol penanda mempertahankan sisi aktif. | `value-side-regression.json` |

## Pemeriksaan aktual

- 53/53 tes Node lulus, termasuk empat regresi baru; `tests.log`.
- ESLint pada lima berkas fitur lulus; `lint.log`.
- Build produksi lulus termasuk 48 render storefront; `build.log`.
- 21 jenis × 2 mode × 2 viewport (desktop 1487×1058 dan HP 390×844): **84 pengiriman formulir aktual di browser**, semuanya menghasilkan hasil. Seluruh gambar termuat, tidak ada overflow horizontal, gambar tertampung, dan perpindahan mode memberikan fokus ke judul formulir; `browser-simulations.json`.
- Seluruh **51 penanda pada 21 jenis** diklik di HP 320×740; tidak ada gambar terpotong oleh area ilustrasi atau label bertabrakan. Untuk garis, pengujian menunggu endpoint animasi mencapai koordinat akhir; `mobile320-dimensions.json`.
- Lebar tambahan 360, 375, 414, 430, 768, 844 landscape dan 1024: tidak ada overflow horizontal; bidang ilustrasi tetap tertampung, input 16 px, tombol dimensi minimal 44 px; `responsive-matrix.json`.
- Pengiriman sekali klik pada HP, fokus/scroll setelah hasil, 30 cm pembanding versus 32 cm chart, dan retensi kesalahan kolom kosong diuji terpisah.
- Console pengujian halaman tidak mencatat warning/error; `console.json`.
- Smoke test build produksi di port 4173: direct route termuat, pilihan Oversize mengubah aset, formulir body menghasilkan hasil, mode lanjutan memfokuskan judul formulir, satu elemen main, dan console tanpa warning/error; `production-smoke.json`, `production-desktop.png`. Setelah itu tab dikembalikan ke port 5173 dan override viewport direset.

## Batas klaim

Koordinat dikalibrasi secara visual terhadap ilustrasi, bukan diambil dari pengukuran pakaian fisik. Ilustrasi menjelaskan titik/metode, bukan skala sentimeter dan bukan jaminan fit. Perhitungan tidak membuat rekomendasi S/M/L atau rata-rata nasional yang belum didukung dataset sebanding. Ukuran tubuh tidak disamakan dengan lebar pakaian. Tidak ada transmisi/persistensi ukuran oleh alat ini.

Pengujian menggunakan browser desktop dengan override viewport, bukan seluruh perangkat Android/iPhone fisik. Reduced motion ditangani di kode, tetapi preferensi OS tidak diubah dalam sesi ini. Tidak ada deploy atau push Git pada pekerjaan ini.

`all-marks-analysis.png` adalah lembar analisis aset/koordinat, bukan tangkapan browser. Bukti runtime ada pada `desktop-*.png`, `mobile390-*.png`, `mobile320-*.png` dan tangkapan akhir.
