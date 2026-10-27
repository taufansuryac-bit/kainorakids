# Boys & Girls — 22 Oktober 2026

Permintaan pengguna: ganti The Current Rotation menjadi kategori Boys & Girls dengan desain futuristik dan motion; hapus seluruh Pilih Ceritamu.

## Hasil

HomeView sekarang: Hero / Manifesto / A Closer Look / 12 produk / CategoryPortals / Lookbook / Campaign / Editorial / Community. CollectionEdit dan carousel ProductCoverflow dihapus dari sumber runtime. CategoryPortals memakai foto kategori asli shop-boys.jpg dan shop-girl.jpg; kedua model menghadap belakang. Turunan WebP 1280 px berukuran 94.580 dan 87.822 byte, sumber serta hash ada di category-assets.json. Sumber JPG dipertahankan.

Dua panel terang dengan detail sudut terpotong, outline orbital, tipografi besar dan aksen lime/pink. Reveal masuk memakai spring; mouse menghasilkan tilt terbatas dan image hover. Float berhenti di luar viewport atau saat hover/focus. Tilt dimatikan pada mobile. Reduced motion dipantau langsung melalui matchMedia, mematikan tilt/float/scale tambahan. Tombol adalah elemen button standar dengan label dan fokus terlihat.

Boys mengatur globalGenderFilter dan globalSearchState.gender menjadi Laki-laki; Girls menjadi Perempuan. Pencarian dan usia direset. Katalog tetap menyertakan Unisex sesuai filter yang sudah ada.

## Verifikasi

- Build dan generator 71 artikel lolos. ESLint pada CategoryPortals, Commerce dan HomeView lolos tanpa keluaran error/warning.
- DOM: tidak ada #collections, judul Pilih Ceritamu atau The Current Rotation. Section #categories langsung mengikuti #products.
- Browser menampilkan enam produk Boys dan enam Girls pada data lokal saat QA, dengan daftar yang berbeda dan produk Unisex bersama. Ini hasil data pratinjau lokal, bukan klaim stok produksi.
- Keyboard Enter membuka kategori Girls. Sentuhan melalui Chrome DevTools Protocol membuka Boys dengan filter Laki-laki (emulasi, bukan perangkat fisik).
- Mouse menghasilkan rotateX 1.2 derajat / rotateY 2.4 derajat pada posisi uji. Float berhenti saat hover dan di luar viewport. Reduced motion langsung menghasilkan transform none / animation none / scale 1.
- Responsif diperiksa pada lebar 320, 390, 768, 1440, 1920. Pada 320 px, lebar isi label+panah Girls 210.58 px berada dalam area 213 px setelah perbaikan; tidak ada overflow horizontal.
- Screenshot desktop/mobile disimpan sebagai boys-girls-desktop.png dan boys-girls-mobile.png.

Tidak ada pengukuran FPS pada ponsel fisik atau deploy produksi. Peringatan THREE.Clock dari dependensi viewer 3D tetap terpisah dari kategori ini.
