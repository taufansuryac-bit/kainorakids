# Kainora Kids — Neo-Brutalist Design System

Satu sistem desain untuk seluruh situs: poster editorial krem, tinta hitam tebal, panel berwarna,
papan catur (strip / tepi / frame / lantai perspektif), stiker komik retro, dan tipografi kinetik.

## Token
- **Warna** (`tailwind.config.js` + variabel CSS di `src/index.css`): `ink`, `paper`, `cream`,
  `brand-{red,brick,yellow,pink,teal,blue,sky,orange,green}`.
  Skala `gray`, `amber`, `red`, `pink` dan `white` di-remap ke palet ini, sehingga halaman lama
  yang masih memakai `border-gray-900`, `bg-amber-500`, dll. otomatis ikut sistem.
- **Font**: Archivo (variabel, sumbu `wdth` 62–125 + `wght` 100–900) untuk display & body,
  Bungee untuk label arcade, Pixelify Sans untuk aksen piksel. Dimuat dari Google Fonts di `index.html`.
- **Bayangan**: `shadow-solid`, `shadow-solid-sm`, `shadow-solid-lg` (offset keras tanpa blur).
- **Kelas utilitas** (`src/index.css`): `.display`, `.display-narrow`, `.neo-panel`, `.neo-pill`,
  `.neo-btn` (+ `--ink|pink|teal`), `.press`, `.print` (tekstur halftone), `.checker-strip`,
  `.checker-edge`, `.checker-frame`, `.floor` (lantai perspektif).

> Setelah mengubah `tailwind.config.js`, **restart dev server** — perubahan tema tidak selalu ter-reload.

## Komponen
| Lokasi | Isi |
|---|---|
| `src/components/neo/Checker.jsx` | `CheckerStrip`, `CheckerEdge`, `CheckerFrame`, `CheckerFloor` (lantai 3D, bergerak, mengikuti pointer) |
| `src/components/neo/Stickers.jsx` | `Burst`, `Smiley`, `Flower`, `Cloud` (bermata), `Bubble`, `RotatingBadge` |
| `src/components/neo/ProductCard.jsx` | Kartu produk bersama (beranda & katalog) |
| `src/components/neo/Preloader.jsx` | Preloader tipografi + tirai papan catur (sekali per sesi) |
| `src/components/neo/HalftoneWordmark.jsx` | Wordmark halftone interaktif (kanvas) untuk footer |
| `src/components/motion/KineticText.jsx` | `SplitReveal`, `TextRoll`, `GooeyMorph`, `TypeRemix`, `WeightHover` |
| `src/components/motion/CheckerReveal.jsx` | Reveal gambar lewat disolve papan catur |
| `src/components/motion/CheckerWipe.jsx` | Tirai papan catur layar penuh (transisi halaman, preloader) |
| `src/components/motion/ScrollMarquee.jsx` | Marquee yang cepat/miring mengikuti kecepatan scroll |
| `src/components/home/*` | `Hero`, `QualityStory` (sticky storytelling), `Lookbook` |

## Aturan pakai
- Komponen yang menerima `className` dan memakai `relative` internal memakai helper `pos()` agar
  `absolute` dari pemanggil tidak dikalahkan (utilitas `relative` di Tailwind mengalahkan `absolute`).
- Kelas komponen (`.neo-*`, `.press`, `.print`) ada di `@layer components` supaya utilitas Tailwind
  (`hidden`, `absolute`, …) selalu menang.
- Semua animasi mengikuti `prefers-reduced-motion` (`useReducedMotion` + aturan CSS global).
- Teks kinetik menyediakan teks aksesibel via `sr-only`; huruf animasi ber-`aria-hidden`.

## Wiring toko (di `src/App.jsx`)
`DatabaseSync` & `AuthListenerSync` (Firestore/Auth), `ToastNotification`, `MiniCartDrawer`,
`AuthModal`, `FooterPopupModal`, `HomeQuickViewModal`, state `activeProduct`/`selectedProduct`,
dan listener event `OPEN_PRODUCT` / `OPEN_BLOG` dari chat AI.
