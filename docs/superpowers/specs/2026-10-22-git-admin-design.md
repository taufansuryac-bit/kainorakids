# Admin konten Kainora tanpa Firebase Storage

Disetujui dalam percakapan: dua pengelolaan terpisah, katalog + pemilihan maksimal 12 highlight; koleksi 3D independen dengan PNG depan/belakang, warna putih/hitam, tampilan awal depan/belakang. Pemilik memilih admin online berbasis Git dan hosting gratis, memakai domain kainorakids.com. Belum mempunyai akun Cloudflare; minta panduan pendaftaran.

## Tujuan dan batasan
- Satu JSON menjadi sumber katalog, urutan highlight dan koleksi 3D. Penghapusan benar-benar menghapus, tanpa fallback menambahkan seed kembali.
- Draft di panel sampai Terbitkan. Online: satu commit atomik ke repo taufansuryac-bit/kainorakids, branch main; Cloudflare Pages membangun ulang. Tidak mengaktifkan billing, mengubah DNS, push checkout, atau menerbitkan website dalam pekerjaan lokal ini.
- Editor katalog memelihara foto, harga/ukuran opsional, kategori, deskripsi; data lama berlabel pratinjau tetap jujur. Empat motif photo-only masuk katalog tanpa harga rekaan. Cover foto studio kuning tetap diutamakan.
- Editor 3D tidak membuat SKU/harga. Minimal satu PNG, preset sablon tersimpan di kode, putih/hitam, awal depan/belakang. Tautan ke produk katalog opsional, dibersihkan bila produk dihapus.
- Hanya kaos aktif auto-rotate, berhenti saat interaksi dan lanjut setelah 3 detik. Samping selalu belakang. Angin berbeda per item, tilt dibatasi; reduced motion dipatuhi. Satu item tidak diduplikasi; kosong tidak menampilkan section.

## Keputusan implementasi
- React/Vite yang sudah ada; Cloudflare Pages Functions tanpa database baru. Publik membaca JSON build, bukan API GitHub pada tiap kunjungan.
- GitHub App user OAuth + PKCE; allowlist user ID 270434085; instalasi hanya pada repo Kainora, Contents read/write. Token disimpan dalam cookie terenkripsi HttpOnly, Secure; tidak masuk JS/localStorage. Server memeriksa origin dan CSRF untuk mutation, revision conflict 409, hanya menulis JSON konten dan media bernama hash.
- Adapter lokal hanya dalam mode Vite `admin`, loopback dan origin yang cocok, terpisah dari deployment. Memungkinkan pengujian editor/persistensi tanpa berpura-pura tersambung online. Default npm run dev tidak mengaktifkan write lokal.
- Halaman admin baru menggantikan route admin lama yang tidak memiliki guard. Dashboard lama tidak dihapus (fitur promosi/review/AI di luar cakupan), tetapi tidak lagi menjadi route publik. Data konten tidak lagi diambil dari Firestore.
- CMS konten tetap terpisah dari login/pesanan. Perluasan Firebase yang disetujui kemudian dicatat di bawah; website dan admin GitHub online masih menunggu aktivasi Cloudflare.
- Tidak menyimpan password/token nyata dalam dokumen, source, screenshots atau browser bundle.

## Bukti penerimaan
Node tests: schema/referential integrity, upload spoof/traversal, cookie expiry/tamper, OAuth state/PKCE, unauthorized/origin/CSRF rejection, atomic Git publish/conflict/no-write-on-invalid, local loopback-only persistence. Browser: desktop/mobile CRUD/highlights/reorder, upload PNG live 3D, color/front/back, draft not public before publish, cleanup QA, production-like unconfigured admin stays locked. Build dan lint pada file yang diubah.

## Amendemen disetujui: Firebase pembeli, 22 Oktober 2026

Pemilik memilih Cloudflare untuk katalog/media dan Firebase khusus untuk login serta checkout. Pemilik secara eksplisit menyetujui proyek baru Spark gratis dan lokasi Jakarta. Ini memperluas cakupan awal dengan provisioning Firebase dan penerapan Auth/security rules; tetap tidak mengizinkan push website, deployment Cloudflare, perubahan DNS atau billing.

- Proyek `kainora-kids-store`, aplikasi Web Kainora Kids Web; Firestore Standard free tier di `asia-southeast2`, billing mati.
- Email/password dan Google aktif, anonymous tidak aktif. Domain Auth mencakup domain Kainora dan loopback pengembangan.
- Profil, keranjang, wishlist dan pesanan dipisahkan dengan UID; tidak mempercayai role/admin dari profil browser. Rules diuji pada emulator sebelum diterapkan.
- Checkout adalah permintaan pending untuk konfirmasi manual melalui WhatsApp. Belum payment gateway atau harga pembayaran yang diverifikasi server. Nomor toko perlu diverifikasi sebelum pesanan nyata.
- Kegagalan menulis pesanan tidak mengosongkan keranjang. Login menggabungkan keranjang tamu dengan keranjang akun. Pengiriman/edit/hapus review belum diaktifkan.
- Login pembeli sungguhan, popup Google dan checkout pada domain live belum diuji. Jangan menyatakan seluruh alur produksi sudah terbukti.
