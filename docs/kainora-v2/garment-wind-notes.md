# Angin independen pada kaos Kainora

22 Oktober 2026. Diterapkan lokal.

## Cara kerja

garmentWind.js menambahkan deformasi halus pada vertex shader MeshStandardMaterial melalui onBeforeCompile. Gelombang besar, gelombang kecil, hembusan lambat dan gerakan ujung kain digabung. Mask menahan bagian atas model; bagian bawah dan lengan lebih bebas. Ini efek visual, bukan simulasi fisika kain.

Lima profil pseudo-random stabil dibuat satu kali, dengan kecepatan, fase, amplitudo dan arah berbeda. Tidak ada Math.random atau setState di frame loop. Tiap kaos mempunyai material/uniform sendiri; ketiga permukaan pada satu kaos (kain, sablon depan, sablon belakang) berbagi objek uniform yang sama. Geometri tetap digunakan bersama. Normal dikoreksi melalui inverse transpose Jacobian deformasi agar pencahayaan mengikuti lipatan.

Model GLB saat ini dan proyeksi decal sama-sama memakai koordinat normalisasi tanpa transform node tambahan. Artwork dan preset sablon tidak berubah. Bila aset 3D baru memakai transform mesh berbeda, koordinat harus disamakan sebelum menerapkan deformasi bersama.

Waktu angin berhenti ketika pengguna memutar/menahan kaos; pose kain terakhir dipertahankan lalu dilanjutkan tanpa loncatan waktu. Efek mengikuti active/pageVisible yang sudah ada. Reduced motion mengatur gain ke nol dan menghentikan frame idle. Material milik tiap salinan dibuang saat dilepas; geometri dan tekstur bersama tidak dibuang oleh wind helper.

## Verifikasi

- ESLint pada GarmentCanvas.jsx dan garmentWind.js lolos; npm run build lolos termasuk 71 artikel statis.
- Browser Chromium dengan WebGL memuat shader tanpa error console; warning THREE.Clock dari dependensi lama masih ada.
- Inspeksi scene runtime: 5 profil berbeda, 15 material terpisah, setiap pasangan sablon/kain berbagi uniform angin. Kelima kain berbagi satu geometri; shader body dan print dipakai ulang oleh renderer (2 program).
- Sampel profil speed: 0.934 / 1.080 / 0.820 / 1.070 / 0.983; fase: 5.682 / 1.163 / 2.560 / 4.945 / 2.034. Ada arah +1 dan -1. Amplitudo serta fase tidak dihitung ulang setiap frame.
- Sampel waktu ketika aktif bertambah 0.4501 detik. Saat pointer ditahan, perubahan waktu 0; setelah dilepas bertambah 0.3665 detik.
- Reduced motion: gain kelima kaos menjadi 0, perubahan waktu 0 dan tambahan frame 0 selama sampel pengamatan. Setelah section keluar dari viewport: perubahan waktu 0 dan tambahan frame 0. Pemeriksaan ini membaca scene renderer aktual, bukan hanya kelas CSS.
- Mobile 390px: panah berpindah dari slide 1 ke 2; drag pada kaos memutar ke belakang dan tetap pada slide 2. Sablon tampak mengikuti badan kaos. Tidak ada overflow horizontal pada viewport itu. Ukuran mobile, rail dan batas tilt sebelumnya dipertahankan.
- Screenshot runtime: wind-desktop-front.png, wind-mobile-front.png dan wind-mobile-back.png.
- Video wind-preview.mp4 merekam canvas runtime sekitar 5.48 detik, H.264, 1080×468px, sekitar 441 KB. Video hanya bukti visual; website tetap merender 3D interaktif, bukan memutar video tersebut.
- Batas pemeriksaan: Chromium desktop dan emulasi mobile; belum diuji pada ponsel fisik/Safari atau diukur konsumsi baterainya. Tidak ada klaim FPS perangkat nyata.

## Acuan API

- [Three.js Material](https://threejs.org/docs/pages/Material.html): hook shader dan program cache. Shader chunks diperiksa pada versi lokal Three.js 0.186.
- [React Three Fiber — Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance): demand rendering, invalidate dan penggunaan ulang resource.
