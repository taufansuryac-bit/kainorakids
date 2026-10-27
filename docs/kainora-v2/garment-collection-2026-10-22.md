# Koleksi kaos 3D — 22 Oktober 2026

Tujuh folder pada `public/Design Png Depan Belakang` menjadi tujuh entri carousel. Empat duplikat Park dihapus dari daftar; aset aslinya tetap ada.

| Motif | Warna | Depan | Belakang | Tampak awal |
| --- | --- | --- | --- | --- |
| Kainora Park | Putih | Logo dada melebar | Besar | Belakang |
| DinoRex | Hitam | Badge dada | Besar | Belakang |
| Candy | Hitam | Besar | Polos | Depan |
| Kainora Fresh | Hitam | Badge dada | Besar | Belakang |
| Icecream | Hitam | Besar | Polos | Depan |
| Egg | Hitam | K kecil | K besar | Belakang |
| Key | Hitam | Badge dada | Besar | Belakang |

## Aset dan pengaturan

- Penempatan dan skala relatif mengacu pada foto JPG di setiap folder. Rasio artwork dipertahankan, hanya tepi transparan dirapikan. Foto bukan ukuran DTF dalam sentimeter; visual tidak menjadi ukuran produksi.
- `scripts/prepare-black-garments.py` menghasilkan sembilan tekstur WebP dari PNG pemilik. Sumber asli tidak ditimpa; sumber, SHA256, batas alpha, resolusi dan ukuran hasil tercatat di `black-garment-assets.json`.
- Preset depan `badge` ditambahkan untuk logo dada berbentuk tegak/bulat. Preset Park yang melebar dan preset depan besar tetap tersedia. Admin menyimpan serta menampilkan ketiganya.
- Candy dan Icecream mempunyai field `back` kosong. Pratinjau samping mengikuti tampak awal masing-masing agar desain depan tidak ditampilkan sebagai kaos polos.
- Enam motif hitam belum ditautkan ke SKU katalog putih. Tidak diasumsikan harga/ukuran/varian hitam sama dengan katalog putih; pemilik dapat menautkannya lewat admin.

## Koreksi material dan perspektif

- Pemeriksaan runtime menunjukkan skala XYZ kaos samping sama. Distorsi visual berasal dari arah putar tetap terhadap kamera perspektif, bukan mesh versi lain. Preview kini berputar menghadap arah mata berdasarkan posisi X/Z, dengan transisi ke rotasi interaktif saat berada di tengah.
- Sablon sebelumnya memakai DecalGeometry terpisah yang sudah mengikuti permukaan dasar. Kini tinta dicampur ke albedo material kaos sebelum pencahayaan, pada mesh yang sama. Kain dan tinta berbagi normal, lipatan, deformasi angin serta depth; tidak ada lapisan sablon yang mengambang.
- UV artwork mengikuti koordinat lokal kaos dan preset yang sama. Sisi depan/belakang dipisahkan pada torso; lipatan curam tidak dipotong dengan depth box agar tidak menimbulkan lubang tinta.
- ACES filmic diganti Neutral tone mapping setelah perbandingan browser, untuk mengurangi pemudaran warna. Warna tetap dipengaruhi cahaya dan grafis sumber; ini pratinjau render, bukan proof warna cetak.
- Render carousel berkurang menjadi lima draw call untuk lima kaos yang terlihat, karena sablon tidak menambah mesh/material terpisah. Geometri template tetap dibagi; tekstur hasil fit dan material salinan dibersihkan saat unmount.
- Registrasi kaos baru meminta render ulang. Ini mencegah pose tertinggal satu frame saat navigasi dalam reduced-motion/demand rendering.

## Verifikasi

- Build Cloudflare lulus: 373 aset, seluruhnya di bawah batas 25 MiB per file.
- 32 pengujian lulus: admin 20, shop 5, affiliate 3, buyers 3, auto-turn 1. Scoped ESLint dan verifikasi 42 HTML produk/sitemap lulus.
- Browser menelusuri tujuh motif dan memeriksa uniform depan/belakang material yang benar; hanya Candy/Icecream menonaktifkan tinta belakang. Lima mesh terlihat, tanpa mesh sablon tambahan.
- Browser desktop 1600 px, mobile touch 390 px, serta lebar 768 px diuji; tidak ada overflow horizontal. Pemeriksaan baru pada dev dan hasil build tidak mencatat error aplikasi/shader. Warning deprecation THREE.Clock dari library viewer masih ada.
- Putaran/jeda diuji oleh tes auto-turn; browser menguji drag dan pose yang tetap selama jeda. Deformasi angin tetap memakai profil independen per ID, bukan simulasi kain fisik penuh.
- Bukti: `garments-final-desktop.png`, `garments-final-mobile.png`, `garment-candy-final-mobile.png`. Foto prototype/before disimpan sebagai pembanding historis.
- Tidak ada deployment, publikasi GitHub, perubahan akun pembeli atau pesanan produksi.
