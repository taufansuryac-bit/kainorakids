# Revisi manifesto, movement reveal, sosial dan affiliate

Tanggal: 22 Oktober 2026. Diterapkan lokal; belum dipublikasikan.

## Hasil

- Lookbook NOT MADE TO SIT STILL dan kampanye foto besar digabung dalam MovementReveal. Dimulai dengan tipografi tanpa gambar, bukaan tengah memperlihatkan foto, bidang foto melebar sampai penuh, lalu judul akhir dan tombol katalog muncul. Scroll dibalik mengembalikan urutan animasi. Foto kampanye lama yang diminta pengguna dipertahankan; tidak membuat foto/model baru.
- DESIGNED FOR MOVEMENT dan THE MOVEMENT dihapus dari render beranda; implementasi lama di Scenes.jsx dibuang. Hero tetap memakai implementasi yang sama.
- Satu section sosial menyatukan Instagram @kainorakids dan TikTok @kainorastore.id, dengan visual koleksi lokal dan tautan profil. Bukan feed API langsung; tidak ada angka pengikut atau interaksi fiktif.
- Section Affiliate memakai foto produk asli Be You, tipografi hitam/lime, reveal poster dan tombol menuju halaman affiliate. Tidak melakukan pendaftaran atau menambahkan klaim komisi.

## Akar bug manifesto

featured-edit.css menimpa tinggi manifesto menjadi 75svh dan posisi stage menjadi relative. Akibatnya rentang scroll tiga kalimat terlalu pendek dan pin tidak bekerja. Override dihapus dari file tersebut. Komponen baru memiliki kelas khusus, stage sticky di bawah navbar (78px desktop/66px mobile), tiga fase teks dengan waktu baca, spring pada progress, dan tombol navigasi 01–03. Offset scroll mengikuti awal pin sampai akhir stage.

Mode reduced motion menampilkan ketiga kalimat dan foto secara statis. Override lokal pada kelas is-static memastikan nilai opacity/clip-path lama dari Motion tidak menyembunyikan isi ketika preferensi berubah saat halaman sudah terbuka. Tombol akhir lookbook tidak dapat difokuskan sebelum muncul.

## Referensi visual

- [21st.dev — Scroll media expansion hero](https://21st.dev/@arunachalam/components/scroll-expansion-hero): bidang media yang meluas mengikuti scroll.
- [Framer — Scroll Reveal Fly-in](https://www.framer.com/marketplace/components/scroll-reveal-fly-in/): reveal yang mengikuti posisi scroll dan dapat dibalik. Referensi visual saja; tidak menyalin sumber komponen berlisensi terbatas.
- [Framer Academy — Scroll animations](https://www.framer.com/academy/lessons/scroll-animations).
- [Motion — useScroll](https://motion.dev/docs/react-use-scroll), [useSpring](https://motion.dev/docs/react-use-spring).

## Verifikasi

- npm run build berhasil, termasuk 71 halaman HTML artikel. ESLint untuk HomeView dan seluruh komponen JS/JSX baru/diubah lolos. git diff --check tidak menemukan error whitespace; Git memberi peringatan normalisasi LF/CRLF pada beberapa file lama.
- Browser Chromium pada dev 5173 dan build produksi lokal 4173. Data pengujian produksi ada di scroll-sections-qa.json.
- Manifesto mencapai urutan 1 → 2 → 3 → 2 → 1; posisi stage tetap 78px. Wheel mundur mengubah tahap 3 menjadi 2. Gesture sentuh emulasi mengubah scroll sebesar 425px dengan stage tetap 66px, tanpa menangkap scroll halaman.
- Lookbook diuji kosong → bukaan sebagian → foto penuh → bukaan sebagian → kosong. CTA hanya aktif secara aksesibilitas ketika fase akhirnya muncul.
- Lebar 320, 390, 768, 1024, 1440 dan 1920px dicek; tidak ada overflow horizontal halaman. Landscape 844×390 juga dicek dan CTA terlihat dalam stage. Ini pengujian viewport/emulasi, bukan perangkat ponsel fisik.
- Reduced motion diubah aktif/nonaktif tanpa reload: ketiga teks serta foto/CTA tetap terlihat pada mode statis, dan stage kembali sticky saat animasi diaktifkan.
- Tombol akhir lookbook membuka ?view=products; tombol affiliate membuka ?view=affiliate. Link sosial sesuai akun yang dikonfirmasi. Tidak mendaftarkan akun affiliate, mengirim pesan atau melakukan transaksi.
- Gambar sosial dan affiliate termuat. Grid tetap berisi 12 card; dua section yang diminta dihapus tidak ada di DOM.
- Tidak ada error console pada halaman produksi yang diperiksa. Ada satu warning deprecation THREE.Clock dari dependensi 3D yang sudah ada; bukan error scroll. Tidak ada pengukuran FPS perangkat fisik atau pengujian Safari/iOS.

Screenshot: movement-reveal-desktop.png, movement-mid-reveal-desktop.png, movement-landscape.png, manifesto-fixed-desktop.png, manifesto-320.png, social-desktop.png, social-mobile.png, affiliate-desktop.png dan affiliate-mobile.png.
