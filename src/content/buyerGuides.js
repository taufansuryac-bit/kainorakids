import { COMMERCE_POLICY } from './commercePolicies.js';

export const BUYER_GUIDES = [
  { path: '/panduan/ukuran-kaos-anak/', title: 'Panduan Ukuran Kaos Anak Oversize S–XXL | Kainora Kids', heading: 'Mulai dari ukuran yang pas.', eyebrow: 'FIND THEIR EVERYDAY FIT',
    description: 'Cara mengukur lebar dan panjang kaos anak, membaca size chart Kainora S–XXL, dan memilih potongan oversize yang nyaman.',
    sections: [
      { heading: 'Ukur kaos yang sudah nyaman dipakai.', paragraphs: ['Gunakan kaos si kecil yang paling nyaman sebagai pembanding. Bentangkan pada permukaan datar, rapikan lipatannya tanpa menarik kain, lalu gunakan pita ukur dalam sentimeter.'], steps: ['Lebar: ukur mendatar dari ujung ketiak kiri ke ujung ketiak kanan. Angka ini adalah lebar kaos, bukan lingkar dada.', 'Panjang: ukur dari bahu dekat kerah hingga ujung bawah badan kaos.', 'Bandingkan hasilnya dengan size chart. Untuk potongan oversize, perhatikan ruang gerak dan panjang badan, bukan hanya label ukuran.'] },
      { heading: 'Size chart Kainora.', chart: true, paragraphs: ['Pilihan katalog S, M, L, XL, dan XXL. Utamakan pengukuran kaos; ukuran yang sama pada merek lain dapat berbeda. Toleransi jahitan 1–2 cm.'] },
      { heading: 'Periksa gerak, bukan hanya tampilan.', paragraphs: ['Saat mencoba, minta si kecil mengangkat tangan, duduk, dan bergerak seperti biasa. Pastikan bukaan leher dan lengan nyaman, serta panjang kaos tidak mengganggu kegiatan.', 'Jika ukuran berada di antara dua pilihan, bandingkan keduanya dengan kaos pembanding dan tanyakan kepada tim Kainora sebelum memesan. Tidak ada satu label ukuran yang cocok untuk semua anak.'], links: [{ href: '/retur/', label: 'Baca ketentuan penukaran ukuran' }, { href: '/products/', label: 'Pilih motif dan ukuran kaos' }] },
    ] },
  { path: '/panduan/perawatan-sablon/', title: 'Cara Merawat Kaos Katun dan Sablon DTF | Kainora Kids', heading: 'Rawat baik. Pakai lebih sering.', eyebrow: 'CARE FOR THE LITTLE DETAILS',
    description: 'Panduan mencuci, menjemur, menyetrika, dan menyimpan kaos grafis Kainora agar kain serta sablonnya lebih terawat.',
    sections: [
      { heading: 'Sebelum mencuci.', paragraphs: ['Utamakan petunjuk pada label perawatan pakaian. Panduan berikut membantu merawat kaos grafis; lakukan penanganan khusus jika label produk memintanya.'], steps: ['Balik kaos sehingga sablon berada di bagian dalam. Pisahkan dari pakaian yang berpotensi luntur.', 'Gunakan deterjen lembut dan air bersuhu sejuk. Hindari pemutih serta perendaman terlalu lama.', 'Jika memakai mesin, pilih siklus lembut. Hindari menyikat atau mengucek langsung area sablon.'] },
      { heading: 'Menjemur dan menyetrika.', steps: ['Keringkan di tempat teduh dengan sirkulasi udara baik, sambil tetap membalik kaos.', 'Ikuti suhu setrika pada label. Hindari menempelkan permukaan setrika langsung pada sablon; setrika dari sisi dalam atau gunakan kain pelapis.', 'Simpan setelah kaos benar-benar kering. Lipat tanpa menekan atau merekatkan permukaan sablon yang masih hangat.'] },
      { heading: 'Kenali detail sebelum memilih.', paragraphs: ['Lihat foto studio untuk komposisi grafis dan foto pemakaian bila tersedia. Foto pemakaian adalah referensi tampilan; ukuran badan setiap anak tetap berbeda.'], links: [{ href: '/products/', label: 'Lihat foto dan detail koleksi' }, { href: '/panduan/ukuran-kaos-anak/', label: 'Bandingkan ukuran kaos' }] },
    ] },
  { path: '/pengiriman/', title: 'Pengiriman J&T dari Bandung & Cara Cek Ongkir | Kainora Kids', heading: 'Dari Bandung, menuju ceritamu.', eyebrow: 'THE JOURNEY TO YOUR DOOR',
    description: 'Informasi pengiriman Kainora dari Bandung melalui J&T Express, cara cek ongkir, estimasi perjalanan, dan pelacakan paket.',
    sections: [
      { heading: 'Asal dan kurir pengiriman.', paragraphs: [COMMERCE_POLICY.shippingSummary, 'Pesanan website dicatat sebagai permintaan untuk dikonfirmasi toko. Konfirmasi pesanan dan pembayaran terlebih dahulu; memasukkan produk ke keranjang belum berarti paket sudah dikirim.'] },
      { heading: 'Berapa ongkirnya?', paragraphs: ['Masukkan asal Bandung, kecamatan tujuan, dan berat paket pada halaman tarif resmi J&T. Tarif dapat mempertimbangkan berat aktual atau volumetrik. Tim Kainora mengonfirmasi berat dan total ongkir pesanan; tidak ada tarif rata untuk seluruh wilayah.'], links: [{ href: COMMERCE_POLICY.rateUrl, label: 'Cek ongkir resmi J&T' }] },
      { heading: 'Kapan paket tiba?', paragraphs: [COMMERCE_POLICY.transitSummary, 'Dokumentasi publik tersebut tidak memberikan tabel waktu khusus Bandung ke setiap provinsi. Karena itu, waktu untuk Jawa, Sumatra, Kalimantan, Sulawesi, Bali/Nusa Tenggara, Maluku, dan Papua mengikuti estimasi rute aktual J&T—bukan janji durasi yang disamakan untuk semua tujuan.'], links: [{ href: COMMERCE_POLICY.carrierFaq, label: 'Baca FAQ resmi J&T' }] },
      { heading: 'Setelah paket diserahkan.', paragraphs: ['Gunakan nomor resi yang diberikan toko untuk melihat perjalanan paket. Jika status belum berubah atau alamat memerlukan koreksi, hubungi tim Kainora dan layanan J&T dengan nomor resi Anda.'], links: [{ href: COMMERCE_POLICY.trackingUrl, label: 'Lacak paket di J&T' }, { href: '/retur/', label: 'Baca kebijakan retur' }] },
    ] },
  { path: '/retur/', title: 'Kebijakan Retur, Penukaran Ukuran & Ongkir | Kainora Kids', heading: 'Jika ada yang perlu diperbaiki.', eyebrow: 'LET’S MAKE IT RIGHT',
    description: 'Ketentuan retur Kainora maksimal 2×24 jam setelah diterima, bukti unboxing, kondisi produk, dan pembagian biaya pengiriman retur.',
    sections: [
      { heading: 'Batas pengajuan dan kondisi produk.', paragraphs: ['Hubungi tim Kainora maksimal 2×24 jam setelah paket diterima untuk mengajukan retur atau penukaran.'], steps: ['Sertakan video unboxing utuh sejak paket belum dibuka, tanpa jeda atau edit.', 'Produk belum dicuci atau dipakai bepergian.', 'Hangtag dan label masih terpasang utuh.', 'Siapkan nomor pesanan, motif, ukuran, alasan pengajuan, serta foto bagian yang bermasalah bila ada.'] },
      { heading: 'Siapa yang menanggung ongkir?', paragraphs: ['Salah memilih ukuran atau kelalaian pembeli: biaya pengiriman retur/penukaran menjadi tanggungan pembeli.', 'Produk cacat/reject, salah motif, salah ukuran kiriman, atau kesalahan lain dari penjual: biaya pengiriman retur/penukaran ditanggung Kainora. Jumlah biaya mengikuti rute dan kebutuhan pengiriman aktual.'] },
      { heading: 'Konfirmasi sebelum mengirim kembali.', paragraphs: ['Hubungi tim Kainora terlebih dahulu agar alasan pengajuan, alamat tujuan retur, dan tindak lanjut dapat dikonfirmasi. Kesepakatan penukaran atau pengembalian dana mengikuti hasil pemeriksaan pengajuan; tidak ada janji waktu refund otomatis.'], links: [{ href: 'https://www.instagram.com/kainorakids/', label: 'Hubungi Kainora melalui Instagram' }, { href: '/panduan/ukuran-kaos-anak/', label: 'Baca panduan ukuran sebelum memesan' }] },
    ] },
  { path: '/kebijakan-privasi/', title: 'Kebijakan Privasi | Kainora Kids', heading: 'Data Anda, dijaga dengan jelas.', eyebrow: 'PRIVACY · DIPERBARUI 27 OKTOBER 2026',
    description: 'Data apa yang dikumpulkan Kainora Kids saat Anda berbelanja, untuk apa dipakai, dengan siapa dibagikan, dan cara meminta akses atau penghapusan.',
    sections: [
      { heading: 'Data yang kami kumpulkan.', steps: [
        'Akun: alamat email dan nama dari pendaftaran email atau Google.',
        'Profil dan pesanan: nama penerima, nomor WhatsApp, alamat, kode pos, catatan pesanan, produk, ukuran, jumlah, dan kode promo.',
        'Keranjang dan favorit: tersimpan di akun Anda bila masuk, atau di penyimpanan browser (localStorage) perangkat Anda bila belum masuk.',
        'Ulasan yang Anda kirim untuk produk.',
        'Percakapan dengan asisten chat beserta riwayat singkatnya, yang tersimpan di browser Anda.',
        'Statistik kunjungan anonim melalui Google Analytics, hanya jika Anda memilih “Izinkan Semua” pada banner cookie.',
      ] },
      { heading: 'Untuk apa data dipakai.', paragraphs: ['Memproses dan mengonfirmasi pesanan, menghitung ongkir, mengirim paket, menangani retur, menyimpan keranjang dan favorit, serta menjawab pertanyaan Anda. Statistik kunjungan dipakai untuk memahami halaman yang membantu dan yang perlu diperbaiki. Kami tidak menjual data pribadi Anda.'] },
      { heading: 'Pihak yang menerima data.', steps: [
        'Google Firebase (Google Cloud, region Jakarta) untuk akun, pesanan, keranjang, favorit, dan ulasan.',
        'WhatsApp (Meta): rincian pesanan dikirim dari perangkat Anda ke WhatsApp admin Kainora saat Anda menekan tombol pesan.',
        'J&T Express: nama, nomor telepon, dan alamat penerima untuk pengiriman paket.',
        'Penyedia layanan AI pihak ketiga yang menjawab pesan di asisten chat. Jangan menuliskan data pribadi di chat.',
        'Google Analytics, hanya dengan persetujuan Anda, tanpa nama, nomor WhatsApp, atau alamat.',
      ] },
      { heading: 'Cookie dan penyimpanan browser.', paragraphs: ['Website menyimpan pilihan cookie, keranjang tamu, penanda sesi login, dan riwayat chat di penyimpanan browser Anda. Google Analytics baru memasang cookie setelah Anda memilih “Izinkan Semua”. Anda dapat menghapus semuanya kapan saja melalui pengaturan browser.'] },
      { heading: 'Hak Anda.', paragraphs: ['Sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi, Anda dapat meminta salinan data, memperbaiki data yang keliru, menarik persetujuan, atau meminta penghapusan akun dan data pesanan yang tidak lagi wajib kami simpan. Kirim permintaan melalui WhatsApp admin di nomor 0815-9977-430.'], links: [{ href: 'https://wa.me/628159977430', label: 'Hubungi admin via WhatsApp' }] },
      { heading: 'Penyimpanan dan perubahan kebijakan.', paragraphs: ['Data akun disimpan selama akun aktif. Data pesanan disimpan selama diperlukan untuk layanan purnajual dan kewajiban pencatatan usaha. Perubahan kebijakan ini akan ditandai dengan tanggal pembaruan di bagian atas halaman.'] },
    ] },
];
export const guideFromLocation = location => BUYER_GUIDES.find(guide => guide.path.replace(/\/$/, '') === location.pathname.replace(/\/$/, ''));
