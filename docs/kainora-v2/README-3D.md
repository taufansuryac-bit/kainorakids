# A Closer Look — carousel kaos tanpa awan

Revisi terbaru: viewer tepat SEBELUM 12 produk, setelah manifesto. Model asli folder 1, lima salinan sementara motif Kainora Park, background bersih tanpa awan. Komponen dan pemuatan awan sudah dihapus dari runtime. Tidak ada SKU baru, bingkai viewer atau panel kontrol.

## Sumber

- Geometri: `ASSET3D/1/obj.obj`, 206.203.942 byte / sekitar 1.806.256 segitiga. Turunan `public/models/kainora/oversized.glb`: 993.376 byte / 39.825 segitiga. Geometri dan material dibagi antarsalinan.
- Artwork asli `public/Design Png Depan Belakang/Depan.png` dan `Belakang.png`. WebP lossless memangkas margin transparan dan membatasi resolusi tanpa menggambar ulang desain.
- Arsip eksperimen awan (tidak dipakai atau diminta viewer): dua volume dalam `ASSET3D/AWAN`, dirender melalui Blender Cycles ke WebP transparan. Empat plane pada kedalaman berbeda memberikan gerak dan parallax. Ini lapisan hasil render volume asli, bukan raymarch VDB langsung dalam browser. Sumber dan hash dicatat di `3d-cloud-assets.json`; VDB asli tidak diubah atau dikirim ke browser.
- Folder 2 hanya untuk perbandingan terpisah. `Hi_T-shirt.obj` tidak mempunyai label oversize; nama Hi/Low menyatakan tingkat detail. Toko tetap memakai model folder 1.

## Preset sablon tetap

`src/constants/garmentPrintLayout.js` memisahkan penempatan dari URL artwork:

| Area | Pusat x, y, z | Lebar x tinggi x kedalaman |
| --- | --- | --- |
| Depan, dada kiri pemakai | 0.30, 0.43, 0.28 | 0.26 x 0.198 x 0.55 |
| Tengah belakang | 0, 0, -0.43 | 1.06 x 1.30 x 0.55 |

Koordinat model dinormalisasi ke dimensi maksimum 2, bukan sentimeter produksi. Ganti URL pada `GARMENT_ARTWORK`; area dan pusat tetap, gambar memakai contain sehingga rasio dan alpha terjaga. Decal dibatasi ke sisi luar agar tidak terproyeksi ke kain dalam atau sisi sebaliknya. Jangan ubah preset saat mengganti gambar.

## Interaksi dan motion

- Seret kaos tengah: rotasi horizontal bebas 360 derajat, kemiringan objek dikunci -10 sampai +8 derajat melalui `garmentViewConfig.js`. Kamera tetap di depan; tidak bisa menengok jauh ke kolong.
- Geser area latar: pindah koleksi. Klik kaos tetangga atau panah samar: pindahkan kaos itu ke tengah. Drag cepat pada kaos tetap memutar dan tidak mengganti koleksi.
- Keyboard: panah kiri/kanan berganti; Shift+panah memutar; atas/bawah memiringkan; Home reset; +/- zoom terbatas. Double click reset.
- Area sentuh di tengah menangani rotasi, sedangkan area latar tetap mengizinkan scroll vertikal halaman. Tombol dan keyboard tersedia sebagai alternatif.
- Reveal: kaos naik dan berputar ringan saat viewer aktif. Pergantian koleksi memakai interpolasi posisi, kedalaman, skala dan rotasi; input baru dapat membalik arah transisi.
- Idle: kaos melayang halus. Waktu animasi berhenti selama drag. Rendering berhenti ketika di luar viewport, tab foto dipilih, halaman tersembunyi, atau WebGL context hilang.
- Reduced motion dipantau secara langsung: reveal, float dan interpolasi dinonaktifkan; rotasi manual tetap berfungsi dan renderer menggunakan demand.
- Lazy loading mendekati section, DPR maksimum 1.5, satu Canvas. Foto koleksi tetap tersedia untuk kegagalan WebGL. Penanganan context loss dan tombol muat ulang dipertahankan.

## Menyiapkan ulang

Dari root web:

```powershell
node --max-old-space-size=6144 scripts/prepare-theater-models.mjs
python scripts/prepare-garment-prints.py
& '..\.tools\blender-4.5.9-windows-x64\blender.exe' --background '..\ASSET3D\AWAN\Example\Cumulonimbus_Field_12_ExampleFile.blend' --python scripts/render-theater-clouds.py
python scripts/prepare-theater-clouds.py
```

Blender portable hanya alat authoring lokal dalam folder induk `.tools`, tidak termasuk build web. Script Python sistem memerlukan Pillow; script render memakai Python bawaan Blender. Render perantara disimpan dalam `.cache/cloud-renders` (ignored).

## Batas

Lima salinan sementara memakai satu model dan satu motif, sesuai permintaan. Visualisasi bukan simulasi ukuran/fit produksi. Tidak ada pengukuran FPS pada ponsel fisik. R3F 8 dengan Three 0.186 masih memberikan peringatan deprecation THREE.Clock dari dependensi; versi tidak diubah dalam pekerjaan ini.

## Riwayat verifikasi sebelum awan dihapus, 22 Oktober 2026

- Build Vite dan generator 71 artikel berhasil; ESLint pada empat berkas JavaScript yang terkait lolos tanpa error atau warning.
- Desktop: drag pada kaos tidak mengganti slide; geser latar mengganti slide; klik kaos tetangga mengganti slide. Rotasi keyboard 12 langkah menghasilkan 6.283185307 radian (360 derajat). Input keyboard berturut-turut tidak hilang karena batching React.
- Drag vertikal berhenti pada -0.174532925 radian dan +0.139626340 radian, sesuai batas -10/+8 derajat.
- Sentuhan melalui Chrome DevTools Protocol pada lebar 390 px: drag kaos memutar 2.2555 radian dengan slide tetap; swipe latar mengganti slide dari 1 ke 2. Ini emulasi sentuh browser, bukan pengujian ponsel fisik.
- Foto Koleksi membuka /kainorapark-1.jpg dengan nama Kaos Kainora Park; renderer 3D berubah menjadi never. Section di luar viewport juga menjadi never.
- Perubahan reduced motion saat halaman terbuka menghentikan float: frame renderer hanya bertambah satu frame penyelesaian sepanjang 20 frame browser yang diamati.
- Lebar 320, 390, 768, 1440 dan 1920 tidak menghasilkan overflow horizontal. Screenshot desktop/mobile ditinjau secara visual.
- Preview build di port 4173: model, kedua artwork dan kedua awan berhasil dimuat, tidak ada request HTTP gagal atau exception aplikasi pada alur yang diamati. Peringatan THREE.Clock dari dependensi masih ada.
- Turunan awan 31.766 + 175.410 byte; tidak ada VDB besar yang diminta browser.

Screenshot: cloud-playground-desktop.png, cloud-playground-mobile.png, cloud-playground-production.png. Tidak ada deploy, pengujian transaksi produksi atau pengukuran FPS ponsel dalam pekerjaan ini.

## Revisi tanpa awan

ProductTheater dipindahkan sebelum FeaturedEdit di HomeView. Import dan instance CloudPlayground dihapus beserta komponennya; texture awan tidak lagi dimuat. Judul diperkecil dan glow latar dihilangkan agar kaos lebih dominan. File sumber serta turunan eksperimen awan tetap diarsipkan; tidak ada perubahan pada sumber VDB atau preset sablon.

## Revisi 3D saja

Tab 360 View / Foto Koleksi dan seluruh panel foto/ukuran dalam ProductTheater dihapus. Lihat Produk kini membuka detail produk Kainora Park melalui alur OPEN_PRODUCT yang sudah ada. Foto dan pemesanan tetap tersedia melalui katalog/detail produk.
