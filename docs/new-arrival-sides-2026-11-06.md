# New Arrival: pilihan tampak

Admin → New Arrival → Edit gambar menyediakan pilihan **Tampak awal: Depan / Belakang**. Pilihan mengikuti gambar yang tersedia. Upload minimal satu gambar depan atau belakang; samping opsional. Tombol Hapus gambar dapat mengosongkan sisi yang tidak digunakan.

Rail dan perbesaran memakai sisi awal yang sama. Item satu sisi hanya merender gambar tersebut, tanpa tombol flip. Item dengan dua sisi menyediakan tombol Depan / Belakang dengan animasi putar. Saat gambar sisi awal dihapus, editor dan validasi server memilih sisi yang masih tersedia. Konten lama tanpa `initialView` tetap dimulai dari depan bila gambar depan tersedia.

Pemeriksaan 6 November 2026:

- Uji gagal awal membuktikan validasi lama menolak satu sisi dan belum menyimpan pilihan awal.
- 36 pemeriksaan admin (termasuk 8 New Arrival), 5 katalog, 8 blog/newsletter, dan 9 SEO lulus; build Cloudflare berhasil.
- Browser lokal: depan saja → satu gambar dan tanpa flip; belakang saja → gambar belakang dan tanpa flip; dua sisi dengan awal belakang → gambar belakang lalu dapat di-flip depan/belakang.
- Editor browser lokal berhasil menghapus depan/samping, menyimpan item belakang saja ke project, dan mempertahankan pilihan awal belakang pada file hasil penyimpanan.
- Mobile 390 × 844: gambar dan tombol perbesaran utuh, tanpa overflow horizontal setelah animasi selesai. Viewport sementara dipulihkan setelah pemeriksaan.
- Data uji hanya dipakai lokal dan dipulihkan sebelum commit. Produk, harga, serta keenam item New Arrival produksi tidak diubah.
