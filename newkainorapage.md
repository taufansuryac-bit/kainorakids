# KAINORA KIDS — CODEX MASTER IMPLEMENTATION PROMPT V2.0

## 0. YOUR ROLE / NON-NEGOTIABLE OUTCOME

Act as an elite creative developer, digital fashion art director, senior React/Next.js engineer, motion engineer, accessibility specialist, and visual QA lead. **Implement and test a real working website**, not an explanation, plan, screenshot or disconnected component showcase, for **KAINORA KIDS**, an independent Indonesian children's streetwear brand. Preserve the project's existing architecture, product catalogue, brand assets, routes, authentication, checkout, inventory and existing business logic. Do not start a second project or rewrite working infrastructure merely to simplify the animation task.

**Target:** an experimental minimalist kidswear fashion experience with world-class motion and believable e-commerce. Editorial, confident, clean, futuristic in interaction **NOT** sci-fi in visuals. A full website from preloader to footer with real controlled motion, not static mockups. **STRICT NO AI SLOP / ZERO TOLERANCE.**

## 1. BRAND & ART DIRECTION — DESIGN LOCK

- Brand **KAINORA KIDS**. Premium modern kids streetwear, ages ~1–10 where appropriate. No nursery/cartoon styling. Mature visual art direction that still captures youthful motion.
- Background **#FFFFFF** (primary), almost-black **#0C0C0C / #111111** type. Secondary #F3F3F0 neutrals; a single minimal lime or other brand-approved accent at no more than ~5–8% of screen. Zero random color palettes.
- **BOLD, EXTRA-BOLD GEOMETRIC SANS-SERIF** — strong dense letterforms, close leading, deliberate tracking; use existing official typography if available, otherwise Geist, Space Grotesk, or similarly capable face. Do not replace official logo with approximated type.
- Design grammar: editorial Swiss-modernist grid, unexpectedly large type, deliberate asymmetric compositions, purposeful whitespace, strong fashion photography, hierarchy between giant display type and tiny overline metadata; occasional outlined type only if helpful.
- All animation must serve hierarchy, storytelling, product examination, or navigation; neither decorative chaos nor repeats of generic fade-up for every block.
- Forbidden: excessive rounded cards, random SVG stickers, blobs, gradients, floating abstract shapes, neon/glassmorphism, AI art direction clichés, over-polished generic photos, unrelated text, unlicensed icon sets, fake social proof, filler sections, stock-landing-page patterns, generated text baked into photographs.

## 2. FIRST ACTION — INSPECT BEFORE MODIFYING

1. Inspect package, framework, routes, components, styles, animation libraries, product schema, commerce logic, existing assets, tests, deployment environment, and fonts.
2. Identify which working parts must be preserved. Keep a change plan concise and execute; do not stop at research.
3. Review relevant reference implementations and API docs as available. Use those for **motion mechanics**, not cloning their compositions.
4. Develop against the existing project. If it is blank, create a minimal cohesive React/TypeScript production structure (Next.js if appropriate) without unnecessary dependencies.
5. Keep the home page the priority; do not accidentally remove product detail, cart or checkout flows.

**Motion and interaction references:**
- https://21st.dev/@kedhareswer/components/type-remix-preloader
- https://21st.dev/@kedhareswer/components/halftone-wordmark-footer
- https://21st.dev
- https://www.framer.com/marketplace/components/animated-gallery/
- https://www.framer.com/marketplace/components/scroll-reveal-fly-in/
- https://www.framer.com/marketplace/components/scroll-reveal-slider/
- https://motion.dev/docs/react-use-scroll
- https://motion.dev/docs/react-use-transform
- https://motion.dev/docs/react-use-spring
- https://motion.dev/docs/react-layout-animations
- https://motion.dev/docs/react-animate-presence

Inspect the reference where accessible and honor its license. Do not claim a source was inspected if it was inaccessible.

## 3. CRITICAL ASSET PIPELINE — GENERATE MISSING IMAGERY WITH CODEX IMAGEGEN

**Images are essential, not optional**. First inventory existing approved KAINORA assets. Reuse approved product photographs and exact logos whenever possible. **If a required campaign/editorial asset is missing, use the built-in Codex `image_gen` / `$imagegen` skill if actually available in the active session** to create a genuinely new raster asset and integrate it into the project. Do not stop at gradients, gray placeholder boxes, external hotlinking, AI-generated filler text, or CSS-only fake product art when the tool exists.

**Codex ImageGen operating rules:**
- Discover the active image generation tool and its skill instructions first. Use the built-in generator for normal creation/editing, not a handwritten API wrapper.
- If the built-in tool is NOT exposed in this Codex environment, report the exact missing capability. **Do not falsely state generation succeeded and do not silently use a paid API/CLI fallback or ask for an API key as though it were required.** Continue building stable replaceable image slots from available approved assets; list precisely which missing images need generation when the tool is connected. Use CLI fallback only if the user explicitly authorizes it.
- Generate assets **one at a time or in intentional batches** with consistent photography direction and review results before final selection.
- Move/copy selected files from the generator's output location into the repository, e.g. `public/images/kainora-generated/`, and reference those real repo-local files in components. Check for broken links; never rely on temporary `$CODEX_HOME` paths or development-only machine paths at runtime.
- Maintain `public/images/kainora-generated/ASSET_MANIFEST.md` with filename, use case, prompt, dimensions/aspect ratio, and `GENERATED_CONCEPT` / `OFFICIAL_PRODUCT` / `APPROVED_EDITORIAL` provenance. Never label synthetic garment images as official products.
- Do not overwrite original brand/product assets. Never regenerate official logos, print art or typography when exact references exist. Preserve silhouettes and DTF artwork with product-photo accuracy.
- Web image search or stock photos are not a substitute for approved actual product imagery. For temporary design demos, clearly identify the sample assets.

**Minimum editorial image brief / shot list** (adjust to actual repository availability):

| Asset key | Target ratio | Subject / composition | Section |
| --- | --- | --- | --- |
| `hero-editorial` | 4:5 or 3:4 portrait, high-res | Two Indonesian kids, 6–9, authentic neutral streetwear, candid attitude, natural studio light, realistic textile folds, clear negative space for huge typography; no embedded text | Hero |
| `look-01` | 3:4 | 7-year-old Indonesian child in short-wide-boxy graphic T-shirt, full outfit, documentary streetwear photograph, realistic DTF drape | Lookbook |
| `look-02` | 4:5 | Two children in coordinated neutral streetwear, different perspective and candid expression | Collections/Lookbook |
| `look-03` | 3:4 | Indonesian child walking/running outdoors, strong motion, believable photography | Lookbook/Campaign |
| `campaign-wide` | 16:9 or 21:9 | Editorial movement photo with intentional negative space for type, natural photographic motion energy | Campaign |
| `community-01..04` | 3:4 | Varied candid fashion editorial moments, coherent lighting/style, no fake user-generated review claims | Community |
| `brand-material` | 4:5 | Premium textile detail/garment construction editorial, no invented labels/certification | Brand story |
| product views | Based on approved SKU | Real product photography or permitted retouch only: preserve actual print, color, shape, construction | Product theatre/shop |

**Photography master prompt for non-product editorials:**
"Authentic high-end independent Indonesian kids streetwear campaign photography; Indonesian children aged 6–9, natural expressive candid movement, realistic age-appropriate outfit, contemporary cropped wide boxy T-shirt and layered streetwear, true heavyweight cotton texture and local shadows, professional human fashion photography, restrained white/gray urban environment, subtle 35mm editorial grain, clean daylight, cohesive neutral palette, physically plausible anatomy and clothing, purposeful negative space for typography, no text, no logos unless supplied as original approved artwork, no background stickers, no vector cutout collage, no artificial glow, no stock photography look, no AI slop, no overprocessing."

Generate at sufficient resolution for intended usage; inspect crops at desktop and mobile. Responsive art direction can require separate approved crops; do not stretch portrait images across a landscape hero. If multiple outputs are weak, refine prompts and regenerate rather than quietly shipping low-quality assets.

## 4. HOME PAGE — EXACT SECTION ORDER / MOTION SPECIFICATION

The following 12 sections (00–11) must all be implemented. Each needs a distinctive visual composition, actual animation states and complete responsive behavior.

### 00 — TYPE REMIX PRELOADER
- Full viewport near-black or white, giant official KAINORA wordmark; staggered character/line mask reveal, restrained geometric re-typesetting and cinematic shutter/clip-path reveal of home page.
- Playback once per session or appropriately shortened for return visitors. Target ~1.2–2.2s, no indefinite waiting. No unnecessary fetching dependency. Preloader must not interfere with accessibility, deep links or SEO content; reduced motion bypasses.
- Browser acceptance: visibly animated characters then a clear reveal, no freeze/jump.

### 01 — CINEMATIC EDITORIAL HERO
- Full-viewport art-directed split/overlap: extreme black headline **SMALL FITS. BIG ENERGY.**, one dominant campaign image, compact side metadata, single primary **EXPLORE COLLECTION** CTA.
- Text line-mask stagger, photographic scale/clip reveal, subtle responsive pointer/scroll parallax, actual scroll indicator, minimal magnetic CTA where appropriate. On mobile, recrop photo and recompose typography; do not overlay unreadable text on busy photo.
- Acceptance: page appears visually impressive before scroll, with no generic 50/50 marketing template.

### 02 — PINNED KINETIC BRAND MANIFESTO
- Short full-screen pinned cinematic statement, scroll maps **BORN TO PLAY → MADE TO EXPLORE → BUILT TO EXPRESS**.
- Do character/word scale, translate, masking and spacing choreography; avoid text simply disappearing by opacity. Map progress to deterministic transitions; reverse smoothly on upward scroll. Accessible static equivalent exists.
- Acceptance: each statement visibly transforms across a real scroll range; pinned section releases.

### 03 — SCROLL-DRIVEN HORIZONTAL COLLECTION GALLERY
- Four large editorial image panels **GRAPHIC TEES / OVERSIZED ESSENTIALS / EVERYDAY STREETWEAR / NEW DROPS**.
- A tall scroll section with sticky full-screen container; progress from 0–1 maps to translated horizontal track distance `(track.scrollWidth - availableViewportWidth)`. Recalculate on resize, image load and font load. Use mask/scale/parallax in cards; live index/progress. Leave scroll naturally at end.
- Mobile: native horizontal swipe with snap, visible progress, no multi-screen scroll trap. Keyboard controls where applicable.
- Acceptance: full gallery reveals by vertical scroll on desktop; swipe works on touch.

### 04 — INTERACTIVE PRODUCT THEATER
- Editorial gray-white studio stage with oversized product, huge low-contrast product index, name, price, size/color selectors, thumbnail navigator, product CTA.
- Spring-like depth reaction to pointer, idle float subtle enough not to impede detail inspection; product change uses coordinated exit/enter scale/rotate/perspective and synchronized name/price transition.
- Product front/back ONLY if approved front/back photos. Genuine 360 ONLY if real 360 asset sequence or 3D garment model exists. Otherwise use honest image carousel/detail zoom; never mirror front to pretend it is back.
- Swatches change real verified variant imagery or show availability state; never claim nonexistent colors/sizes. Add-to-cart must update real client/server state. Respect selected size validation.
- Acceptance: tapping thumbnails actually changes product and metadata; back control (if present) uses a real matching back view; no distortions.

### 05 — EXPERIMENTAL PRODUCT CAROUSEL
- Additional visually dramatic **THE CURRENT ROTATION** horizontal product slider, distinct from the focused theater.
- Drag inertia and snap, active card scale/depth/perspective, neighbors partly visible, full synchronized metadata and index, arrow navigation and keyboard navigation.
- Avoid infinite-loop jump artifacts. Do not blur important product texture or distort true silhouette.
- Acceptance: arrows, drag, tab and touch work; transition states stay stable under rapid input.

### 06 — CINEMATIC EXPANDING LOOKBOOK
- Header **NOT MADE TO SIT STILL.**; asymmetrical editorial photo cluster. On entering viewport: first image reveals, other images arrive from different offsets, scale, rotate slightly, form a controlled collage; one image enlarges by scroll into a larger immersive image stage.
- Build with intentional design positions and deterministic transitions, not random motion or all images animating simultaneously. Mobile: edited swipeable gallery or short stacked cards.
- Acceptance: 3+ distinctly staged image reveals that reverse cleanly or settle elegantly.

### 07 — FULL-BLEED CAMPAIGN CHAPTER
- Campaign photography expands from inset to full bleed using scale/clip-path; **WEAR YOUR OWN STORY** text masked reveal, legible overlay, restrained parallax and one CTA. Avoid fake video controls if no video.
- Acceptance: a visible powerful transition between white editorial blocks.

### 08 — SHOP / NEW DROPS GRID
- More functional zone: product image, official title, real price in IDR, sizes/colors from catalogue, quick view, add-to-cart and filters. Four columns on large desktop, two on small mobile if readable.
- Image mask stagger, hover picture change only if real second photo exists, layout animation on filter, shared-element/modal transitions where appropriate.
- Do not invent official inventory, reviews, prices, discounts, shipping terms or testimonials. If no connected commerce backend, clearly label demonstration state.
- Acceptance: filter changes visible results; cart count/subtotal agree with quantities.

### 09 — EDITORIAL BRAND STORY
- Headline **DESIGNED FOR MOVEMENT.** / **WEAR YOUR OWN STORY.**, massive black text with fashion/material image, restrained word-by-word masked reveal and parallax, clear CTA.
- No unverified sustainability or fabric claims.

### 10 — COMMUNITY / SOCIAL GALLERY
- Distinct image rhythm, drag/swipe photo rail, focused image growth, controls and counters, accessible gallery viewer if included. Only approved editorial/customer photos; no fictional social proof.

### 11 — EXTREME TYPOGRAPHY / HALFTONE FOOTER
- Simple newsletter with real validation and actual submit only if endpoint exists, clear navigation/contact/social routes; footer wordmark **KAINORA** fills viewport width.
- Canvas or performant dot layer displaces near pointer with a spring response / click ripple; static legible fallback on mobile and reduced-motion. MIT examples may inform the mechanic but must remain original and respect license.
- Acceptance: interactive huge footer wordmark, still readable and navigable.

## 5. SYSTEMATIC MOTION ENGINEERING

1. Build **motion tokens** (e.g. fast hover 160–260ms; masked reveal 600–1100ms; major transitions 900–1500ms; spring stiffness/damping consistent) and avoid magic numbers spread throughout code.
2. Distinguish **scroll-linked** from **scroll-triggered** and from **interaction-driven** animations. A keyframe reveal on intersection does NOT satisfy an explicit scroll-progress-linked section.
3. Motion for React should be default if compatible: `useScroll`, `useTransform`, `useSpring`, `useMotionValueEvent`, `AnimatePresence`, `layoutId` when they fit; use CSS or native scroll where lighter. GSAP only if justified by complex pinning and compatible, without duplicating controllers.
4. All pinned sequences must calculate entry/exit based on real DOM geometry. Observe resizes and avoid scroll gaps and fixed pixel hardcoding. Smooth reverse playback is essential.
5. Prefer `transform` and `opacity`, offload expensive work from React state / scroll event loops. Use rAF for custom scroll logic and clean up listeners; avoid continuous per-frame rerendering.
6. Ensure hover motion doesn't obscure product details or interfere with click. On mobile, no hover-only actions. Touch-action and passive listeners set appropriately.
7. Browser native scroll, no blanket scroll hijack. Accessible focus, Escape to close overlays, appropriate `aria` state and body-scroll handling. Reduced motion gets legible functional equivalents.
8. Preserve interaction fidelity when tab is backgrounded, orientation changes or user drags rapidly.

## 6. RESPONSIVE / PERFORMANCE / COMMERCE / ACCESSIBILITY

**Responsive validation sizes:** 320, 390, 768, 1024, 1440, 1920 px; on desktop also test reduced-height viewport. Mobile is separately art-directed with proper imagery crops and scaled typography. No accidental horizontal overflow, unreadable headlines, clipping, invisible CTAs, or sticky traps. Use `clamp()`, container-aware layout and responsive art direction.

**Performance goals:** prioritize perceived speed, avoid CLS, lazy-load non-hero photos, optimize formats/WebP/AVIF if supported, preload main hero intelligently, defer heavy animation modules, build with a reliable performance budget; target 60fps on representative capable hardware, but document device limitations rather than falsely claiming exact FPS. Limit costly blur/filter, heavy canvases and WebGL. Avoid watermark-like image text artefacts.

**Commerce:** preserve actual product variants, routes, cart behavior, prices, inventory, shipping/checkout integrations. If backend missing, implement an honestly labeled demo cart only—no fake payments/submitted orders. Correct IDR formatting. Form validation is not the same as working newsletter delivery; call this out.

**Accessibility & SEO:** semantic main/section/headings, visible focus, sufficient contrast, meaningful alt text, interactive labels, modal focus management, reduced motion, accessible carousel navigation, metadata, appropriate page title and canonical if production.

## 7. DELIVERABLES / FILE ORGANIZATION

Deliver production-source components, styles, motion utilities, content/data adapters, repo-local approved/generated assets, generated asset manifest, and working routes. Include a brief developer-facing README describing animation sections and any temporary demo assets. Use sensible component names, e.g. `HeroScene`, `KineticManifesto`, `PinnedCollectionGallery`, `ProductTheater`, `ProductCoverflow`, `LookbookScene`, `CampaignReveal`, `ShopGrid`, `HalftoneFooter`.

## 8. EXECUTION & VERIFICATION — DO NOT STOP EARLY

Proceed in phases: repository audit → brand tokens/layout system → asset audit/generation → all section layouts → motion → data/commerce integration → responsive review → interaction QA → performance/accessibility QA → final refinement.

Use an actual browser available to the Codex environment to **open and inspect the rendered full page**, not only lint/code review. Inspect desktop and mobile with screenshots and fix weak visual compositions, generic sections, awkward type, wrong crops, overflowing text and broken animations. Run project lint/typecheck/tests/build when configured and repair issues introduced.

**Minimum interaction QA:** preloader timed and skipped on reduced-motion; scroll down/up through manifesto; gallery reaches first and last panel; product thumbnails and available views update; product slider arrows, drag and keyboard; cart increment/decrement and subtotal; search/navigation; mobile menu; responsive orientation; newsletter verification; footer pointer effect; no JS console exceptions.

**No fake completion claims.** If browser testing, ImageGen, product backend, or asset access is missing, say exactly what cannot be verified or created. Do not silently ship broken paths or claim 360° visualization with only one photo.

## 9. DEFINITION OF DONE

- [ ] All **12** sections **00–11** implemented, including **separate product theater AND product carousel**.
- [ ] Creative direction locked: white, bold black geometric sans, controlled accent, original editorial layouts, zero generic AI slop.
- [ ] Missing editorial imagery generated with built-in Codex ImageGen **if available**, saved in repo and tracked in manifest.
- [ ] Existing official product images/logo preserved; no fabricated official SKU images or details.
- [ ] At least 3 identifiable scroll-linked effects, 2 image masking/reveal types, interactive product switching, working horizontal gallery, kinetic type, footer pointer effect, plus functional responsive menus/cart.
- [ ] Responsive and reduced-motion variants.
- [ ] Visual browser QA desktop/mobile and successful available lint/typecheck/build.
- [ ] Honest final delivery summary in Indonesian with changed files, implementation status per section, tests run, missing assets/tool blockers and known limitations.

**FINAL DIRECTIVE:** You are here to IMPLEMENT a distinctive, cinematic KAINORA KIDS store, not write another plan. Do not substitute a static image, generic carousel, or recycled fade-up template for the specified effects. Take initiative, test in browser, refine the art direction, and finish the whole home page. Build an experimental minimalist fashion site that is visually memorable while still being a usable store. **STRICT NO AI SLOP.**

## 10. Journal: ketentuan tambahan pengguna, 21 Oktober 2026

- Blog memakai navbar dan footer khusus, dengan menu internal blog dan jalan kembali ke toko.
- Tujuh kategori: Parenting, Fashion Anak, Kesehatan Anak, Perawatan Pakaian, Panduan Belanja, Pengembangan Diri & Karakter, Aktivitas & Kreativitas (DIY).
- Perluas 26 artikel lama; tambah 5 artikel untuk masing-masing lima kategori awal serta 10 artikel untuk masing-masing dua kategori baru. Total 71 artikel.
- Setiap artikel memiliki sampul unik dari image generator bawaan, sesuai judul dan isi. Foto editorial generatif tidak boleh dianggap sebagai bukti produk resmi atau dokumentasi pelanggan.
- **ATURAN KRUSIAL: Wajah manusia sama sekali tidak boleh terlihat.** Bila memakai manusia, gunakan tangan/badan dengan seluruh kepala di luar bingkai, atau sudut belakang tanpa profil. Periksa juga pantulan, layar, foto dan orang di latar. Blur wajah dan wajah tanpa fitur bukan pengganti komposisi yang benar. Periksa hasil visual sebelum dipasang.
- Simpan sumber gambar, prompt, hasil WebP dan hasil pemeriksaannya. Manifest berada di `docs/journal-assets/manifest.json`.
- SEO harus memakai isi yang berguna, judul/deskripsi spesifik, tautan terkait dan rujukan yang relevan. Jangan membuat klaim jumlah pembaca, popularitas 2026, keahlian medis atau peringkat pencarian yang tidak terbukti.

## 11. Beranda: ketentuan tambahan pengguna, 22 Oktober 2026

- Tampilkan 12 produk pilihan tepat setelah manifesto Born to Play; produk harus lebih menonjol dan mudah dijangkau.
- Sampul depan memakai foto produk resmi berlatar kuning dari `public` (`*-1.jpg`). Foto kedua, bila tersedia, memakai pasangan asli (`*-2.jpg`). Jangan mengganti gambar produk resmi dengan gambar generatif.
- Card lebih modern dan bold, dengan animasi masuk, interaksi spring, dan pergantian foto yang tetap berfungsi lewat sentuhan dan keyboard. Rujuk Framer, Motion, dan 21st.dev sebelum implementasi. Hindari sapuan checkerboard besar.
- Jangan mengarang harga, ukuran, stok, atau detail pemesanan untuk motif yang baru memiliki foto. Bedakan pratinjau foto dari produk yang datanya lengkap.
- Akun Instagram yang dikonfirmasi pengguna: **@kainorakids**.
- Verifikasi susunan section, foto utama, pencarian/filter, pilihan ukuran, keranjang, modal, tampilan responsif, dan reduced motion; laporkan batas pengujian dengan jujur.
- Revisi lanjutan: hapus seluruh blok pembuka grid (overline, headline, angka besar, deskripsi, tautan katalog atas dan catatan pratinjau pada blok tersebut). Pertahankan filter, pencarian, data produk, serta keterangan di modal.
- Card produk berbentuk kotak tanpa radius pada sudut luar, dengan garis tepi tipis yang lebih tegas.
- Section **A Closer Look / Product Theater** harus tepat setelah section 12 produk pilihan, sebelum gallery koleksi.

## 12. A Closer Look: model 3D dan sablon, 22 Oktober 2026

- Gunakan aset kaos asli dari folder `ASSET3D`; hanya model **oversize** yang ditampilkan. Pertahankan file sumber, sediakan turunan GLB yang dioptimalkan untuk web.
- Model berada di tengah dan menyatu dengan background section, tanpa kotak atau bingkai viewer.
- Terapkan desain asli `public/Design Png Depan Belakang/Depan.png` dan `Belakang.png`: pretzel kecil di dada kiri pemakai, grafis besar di tengah belakang. Acuan penempatan awal adalah `public/kainorapark-1.jpg`.
- Revisi pengguna: sablon belakang dinaikkan dan diperbesar sedikit. Posisi serta ukuran depan/belakang harus tersimpan sebagai preset tetap, terpisah dari URL gambar, sehingga pergantian artwork tidak mengubah penempatan. Pertahankan rasio gambar dan alpha, jangan meregangkan desain.
- Preset sablon ada di `src/constants/garmentPrintLayout.js`; pengaturan kamera ada di `src/constants/garmentViewConfig.js`.
- Rotasi horizontal penuh 360°. Kemiringan vertikal dibatasi mendekati screenshot batas tampak belakang dan depan: elevasi +10° sampai -8° (polar 80°–98°). Kamera tidak boleh dapat melihat jauh ke kolong kaos. Batas berlaku pada drag, tombol dan putaran otomatis.
- Foto koleksi tetap dapat diakses. Model merupakan visualisasi motif pada siluet oversize, bukan simulasi ukuran atau konstruksi produksi yang telah divalidasi.
- Revisi carousel: ikuti pola presentasi Ciao Energy dengan kaos aktif di tengah dan kaos lain terlihat di kedua sisi, tetap memakai background dan tema Kainora. Sementara duplikasi model serta motif yang ada; jangan membuat SKU atau harga baru.
- Pisahkan mode Geser Koleksi (swipe/drag, panah, keyboard) dan Putar Baju 360° agar gesture navigasi tidak berbenturan dengan orbit. Batas kemiringan tetap berlaku pada mode putar.
- Tampilkan screenshot perbandingan aset folder 1 dan 2 langsung di chat. Jangan menganggap file folder 2 berlabel oversize: file yang digunakan adalah `2/Hi_T-shirt.obj`, sedangkan nama yang eksplisit menyebut oversized ada di folder 1. Dua proyek CLO pada folder 1 belum terbukti mewakili dua potongan berbeda.

## 13. Cloud Playground disetujui pengguna, 22 Oktober 2026

- Menindaklanjuti mockup yang disetujui: A Closer Look memakai latar ivory, judul satu baris, kaos tengah besar dan kaos lanjutan kiri/kanan, tanpa bingkai atau panel mode putar/geser.
- Gunakan aset awan asli folder ASSET3D/AWAN. VDB dirender ke lapisan transparan ringan dengan sumber/hash tercatat; jangan menyebut runtime ini volume VDB realtime.
- Revisi gesture menggantikan ketentuan mode terpisah di bagian 12: seret kaos tengah untuk memutar; geser latar untuk mengganti koleksi; klik kaos samping atau panah untuk navigasi. Drag cepat pada kaos tidak mengganti koleksi.
- Tambahkan reveal masuk, transisi keluar/masuk saat koleksi berganti, float lembut, awan bergerak pelan dan tidak menutupi sablon. Hentikan idle selama interaksi dan render di luar viewport. Reduced motion tetap berfungsi.
- Lima duplikasi sementara model/motif yang sama, tanpa metadata produk baru. Penempatan sablon tetap pada preset yang disetujui.

## 14. Revisi terbaru: tanpa awan dan urutan section

- Permintaan pengguna menggantikan konsep awan di bagian 13: hilangkan seluruh awan dari tampilan dan pemuatan runtime. Fokus pada kaos, dengan background bersih.
- A Closer Look / Product Theater berada tepat SEBELUM 12 produk pilihan, setelah manifesto. Ini menggantikan urutan pada bagian 11 dan 12.
- Pertahankan rotasi 360 derajat, batas kemiringan, carousel dengan kaos di kiri/kanan, reveal dan float kaos serta preset sablon.

- Revisi berikutnya: hapus seluruh tab dan tampilan Foto Koleksi dari A Closer Look; tampilkan 3D saja. Tombol Lihat Produk membuka detail Kainora Park, bukan mode foto dalam section.

## 15. Revisi CTA dan section koleksi

- Tombol Lihat Produk pada A Closer Look menjadi tombol hitam kotak dengan panah lime dan feedback hover/press. Tetap membuka detail Kainora Park.
- Section Find Your Frequency diganti CollectionEdit dengan latar terang, judul Pilih Ceritamu, empat pilihan motif asli dan satu foto resmi besar berlatar kuning. Tidak memakai judul hitam layar penuh atau scroll galeri yang dipin.
- Pilihan motif: Kainora Park, Sunshine, Morning Club, Be You. Tombol Lihat Motif membuka produk yang benar; Jelajahi Semua Motif membuka katalog. Tidak membuat metadata harga/stok baru.
- Keyboard tablist: panah atas/bawah dan Home/End, fokus terlihat; pergantian gambar menghormati reduced motion.

## 16. Boys & Girls menggantikan Current Rotation

- Hapus seluruh section Pilih Ceritamu beserta komponen CollectionEdit.
- Ganti carousel The Current Rotation menjadi dua panel kategori Boys & Girls yang futuristik, memakai aset kategori asli dari public/shop-boys.jpg dan public/shop-girl.jpg. Model terlihat dari belakang.
- Urutan: A Closer Look, 12 produk pilihan, Boys & Girls, Lookbook. Pertahankan section lainnya.
- Animasi: reveal masuk, tilt/parallax halus pada mouse, float pelan saat terlihat, feedback hover/focus. Matikan tilt pada mobile dan hormati reduced motion. Hindari sapuan checkerboard dan animasi berkedip.
- Boys membuka katalog dengan gender Laki-laki, Girls dengan Perempuan. Reset pencarian/usia saat membuka kategori; pertahankan perilaku katalog yang memasukkan produk Unisex.

## 17. Revisi lookbook, manifesto, sosial dan affiliate

- NOT MADE TO SIT STILL berawal dari tipografi dan bidang kosong; foto kampanye yang sudah ada muncul lewat bukaan tengah, melebar sampai memenuhi layar, kemudian menampilkan WEAR YOUR OWN STORY dan tombol katalog. Gabungkan dua scene lama agar foto tidak berulang dalam section terpisah.
- Gunakan referensi visual 21st.dev Scroll Expansion Hero dan Framer Scroll Reveal Fly-in; implementasi Motion dibuat untuk komposisi Kainora, tanpa menyalin komponen berlisensi terbatas.
- Hapus section DESIGNED FOR MOVEMENT dan THE MOVEMENT dari beranda. Ganti dengan satu section Instagram + TikTok dan satu section Affiliate.
- Akun yang telah dikonfirmasi pengguna: Instagram **@kainorakids**, TikTok **@kainorastore.id**. Hapus tautan TikTok footer lama ke akun pribadi.
- Section sosial memakai visual koleksi yang tersedia dan tautan profil resmi; jangan mengarang postingan, jumlah pengikut, likes, atau klaim feed langsung. Section affiliate membuka halaman program yang ada, tanpa mengarang besaran komisi atau melakukan pendaftaran otomatis.
- Perbaiki manifesto 02 pada sumber masalah: hapus override tinggi 75svh dan position relative dari featured-edit.css. Pertahankan sticky di bawah navbar, rentang scroll yang cukup untuk tiga kalimat, pergantian teks yang halus dan dapat dibalik, serta navigasi 01–03.
- Pengaturan reduced motion harus menampilkan semua teks dan foto secara statis, termasuk saat preferensi diubah ketika halaman sudah terbuka. Pastikan layout mobile dan layar pendek tetap terbaca.
- Urutan terbaru: Hero, Manifesto, A Closer Look, 12 produk, Boys & Girls, Movement Reveal, Instagram + TikTok, Affiliate, footer.

## 18. Perapihan mobile: kaos 3D, footer dan logo navbar

- Khusus mobile, perkecil kaos pada A Closer Look sedikit agar pratinjau kaos kiri dan kanan lebih terlihat. Skala mobile 0.84 dan jarak rail 1.2 disimpan di garmentViewConfig.js. Preset sablon, kamera desktop dan batas rotasi tidak berubah.
- Tombol Lihat Produk mobile berukuran 198×48px, ikon 36px. Desktop tetap 264×60px. Tetap membuka detail Kainora Park.
- Footer mobile lebih ringkas, navigasi dua kolom dengan target sentuh 44px, newsletter dipisahkan garis tipis, wordmark KAINORA tampil utuh dan baris bawah menyisakan ruang untuk launcher chat.
- Logo navbar tetap memakai artwork asli website-logo.png dengan viewport yang menghilangkan ruang transparan berlebih; tidak meregangkan huruf. Mobile 134px (126px pada layar di bawah 360px), desktop 145px. Logo tetap menuju beranda.
- Periksa 320–430px, tablet/desktop, reduced motion, swipe/rotasi kaos, tautan detail, navbar dan footer. Bukti dan batas pemeriksaan ada di docs/kainora-v2/mobile-refinements-notes.md.

## 19. Angin pada kain 3D

- Pengguna menyetujui efek angin lembut pada kain. Setiap kaos harus mempunyai gerakan berbeda, bukan animasi seragam yang berputar bersamaan.
- Gunakan profil pseudo-random yang stabil per kaos: kecepatan, fase, amplitudo dan arah. Jangan mengacak posisi vertex setiap frame karena akan menimbulkan getaran.
- Badan, lengan dan ujung bawah kain melengkung secara halus; bagian atas bahu/kerah lebih stabil. Sablon depan dan belakang harus mengikuti deformasi yang sama dengan kain, tanpa mengubah preset penempatannya.
- Simulasi visual pada vertex shader, bukan simulasi fisika kain penuh. Perbarui normal agar pencahayaan mengikuti lipatan. Pertahankan geometri bersama dan program shader yang digunakan ulang.
- Bekukan waktu angin selama interaksi putar/geser; lanjutkan setelah dilepas. Hentikan ketika di luar viewport atau tab tersembunyi. Reduced motion mematikan deformasi dan idle float.
- Implementasi: src/components/fashion/garmentWind.js dan GarmentCanvas.jsx. Bukti pemeriksaan serta video runtime ada di docs/kainora-v2/garment-wind-notes.md.


## 20. Admin katalog, highlight dan kaos 3D berbasis Git (22 Oktober 2026)

- Satu sumber `src/content/store.json` untuk katalog, highlight maksimal 12 dan koleksi 3D independen. Katalog awal berisi 8 produk lama yang tetap ditandai data pratinjau, ditambah 4 motif foto tanpa harga rekaan.
- Route `/?view=admin` memakai Content Studio baru; dashboard Firestore lama tidak lagi menjadi route publik. Tab Katalog, Highlight Beranda, Koleksi Kaos 3D. Foto/PNG diupload dari panel. Pilihan kaos putih/hitam, awal depan/belakang, preset depan kecil di dada/besar di tengah. Tautan ke produk katalog opsional.
- Simpan ke draft belum permanen. Online Terbitkan memakai GitHub App OAuth PKCE, allowlist user ID, cookie terenkripsi HttpOnly/Secure, origin + CSRF, satu commit Git dan penolakan revision conflict. Secret server tidak dikirim ke JS. Belum diaktifkan pada Cloudflare karena pemilik belum punya akun; tidak ada commit/push/deploy website atau DNS change dalam tahap ini.
- `npm run dev:admin` membuka editor localhost 5174 dengan adapter filesystem yang hanya mengizinkan loopback. Penyimpanan atomik dan backup JSON. Default `npm run dev` tidak membuka akses tulis lokal.
- Viewer membaca koleksi dinamis; maksimum 5 item terlihat dimuat. Satu item tidak diduplikasi, kosong menyembunyikan section. Hanya item tengah auto-rotate, samping belakang. Mulai sesuai konfigurasi depan/belakang, berhenti saat sentuhan dan lanjut 3 detik setelah selesai. Angin independen tetap digunakan.
- Review memperbaiki tiga kasus: kontrol terkunci saat publish, preview blob dipertahankan selama deployment belum selesai, pembacaan katalog GitHub >1MB memakai blob fallback.
- Build Cloudflare `npm run build:cloudflare` mengecualikan dua salinan video legacy tak terpakai >25 MiB dari dist saja; file asli tetap di public. Pemeriksa build memvalidasi batas file/ukuran Pages Free.
- Panduan aktivasi: `docs/kainora-v2/admin-online-setup.md`. Pengujian: `npm run test:admin`, scoped ESLint dan browser desktop/mobile. Online OAuth/Git commit nyata/Cloudflare deploy belum diuji karena secret akun belum disiapkan.

## 21. Arsitektur hybrid: Cloudflare + Firebase pembeli

- Pemilik menetapkan Cloudflare untuk konten, Firebase untuk login pembeli dan checkout. Pemilik menyetujui proyek Spark baru dan lokasi Jakarta.
- Dibuat proyek `kainora-kids-store` (Kainora Kids Store), akun `arcanelabs.studio@gmail.com`, Web App Kainora Kids Web. Billing terverifikasi **No**. Firestore `(default)` Jakarta `asia-southeast2`, `databaseEdition: STANDARD`, `freeTier: true`.
- Email/password dan Google Sign-In aktif; anonymous nonaktif. Domain authorized terverifikasi mencakup kainorakids.com, www, domain Firebase bawaan dan localhost/127.0.0.1. Tidak ada Firebase Storage/billing/Hosting deploy.
- Konfigurasi SDK publik ada di `src/config/firebasePublic.json`; ini bukan private key/service account. File .env lama tidak ditimpa. SDK memakai named app agar hot reload tidak membuat duplicate-app pada perpindahan proyek.
- Login palsu akibat fallback operation-not-allowed dihapus. Kegagalan SDK mempertahankan dialog dan tidak menganggap pengguna berhasil login. Reset password memakai SDK. Google login tidak menimpa alamat profil yang sudah ada.
- Profil tidak dapat mengubah UID/email otoritatif Auth atau memberi role admin. Keranjang tamu digabung saat login pertama; sinkronisasi berdasarkan UID tidak diulang hanya karena profil berubah. Keranjang/favorit pembeli disimpan di dokumen miliknya.
- Pesanan wajib login, memiliki userId dari Auth, status awal pending, serta hanya dapat dibaca pemilik UID. Kegagalan penyimpanan menghentikan langkah berikutnya dan mempertahankan keranjang. Riwayat pesanan memakai query UID.
- Checkout saat ini adalah permintaan/quotation untuk konfirmasi manual lewat WhatsApp; bukan pembayaran terverifikasi atau integrasi payment gateway. Harga/ongkir final perlu konfirmasi toko. Nomor WhatsApp produksi tetap harus dipastikan benar sebelum menerima pesanan nyata.
- Aturan akses adalah prototipe yang diuji dengan dua identitas pembeli dan tamu di emulator: owner berhasil, akses lintas pemilik/spoof UID-email/admin/status lunas ditolak. Aturan diterapkan ke proyek baru. Form pengiriman/edit/hapus ulasan dinonaktifkan karena fitur tersebut belum diberi kebijakan tulis di backend baru; tidak mengiklankan tombol aktif yang pasti gagal.
- Login Google akun nyata dan checkout produksi belum diuji; tidak dibuat akun/pesanan pelanggan palsu pada proyek produksi. Uji domain live menunggu publikasi Cloudflare.

## 22. Pemeriksaan key GitHub

- Laporan: `docs/kainora-v2/github-secret-audit-2026-10-22.md`.
- Snapshot remote main e8d8d75, tiga commit reachable, 162 path, 61 blob teks unik. Tidak ditemukan nilai secret sesuai pola yang diperiksa; bukan sertifikasi bebas kebocoran.
- Token GitHub ditemukan pada URL remote lokal; nilainya sempat tercetak di keluaran alat pada pembacaan awal. Tidak disalin ke laporan. Perlu dicabut/diganti; belum dirotasi dan belum diuji keaktifannya. Tidak ditemukan token itu pada source/riwayat GitHub yang diperiksa.
- Kode AI lama membaca secret VITE_* langsung di frontend. Tidak ditemukan nilai nyata pada snapshot/build awal, tetapi akan bocor ke bundle bila diisi. Jangan mengisi secret AI produksi sebelum proxy server/kuota dibuat.
- Firebase Web API key bersifat publik; berbeda dari service-account/private key. Proyek baru tetap dilindungi Auth dan Firestore Rules, bukan kerahasiaan Web config.

## 23. Affiliate / Kainora Creator Club

- Halaman affiliate didesain ulang dengan hero besar, foto berlapis, orbit, reveal/parallax ringan, informasi program, simulator komisi, alur kolaborasi, FAQ dan perkenalan melalui Instagram. Mendukung reduced-motion dan tombol jeda dekorasi; halaman dimuat lazy.
- Panel admin memiliki menu **Komisi affiliate** per produk (`affiliateCommissionPercent`, 0–100, dua desimal). Delapan produk berharga mempertahankan 12% sebagai nilai awal simulasi dari halaman lama; dapat diubah/kosongkan. Produk tanpa harga/tarif tidak dipakai simulator.
- Tidak menawarkan pendaftaran database yang gagal, jaminan penghasilan/sampel atau testimonial placeholder. Form menyiapkan pesan; pengguna sendiri mengirim DM, belum ada registrasi/pencairan otomatis.
- Detail implementasi, referensi, pengujian dan cara memakai pengaturan ada di `docs/kainora-v2/affiliate-redesign-2026-10-22.md`.

## 24. Katalog 42 motif dan detail produk

- Semua 82 foto produk yang dipindahkan pemilik ke `public/PRODUCT` dikelompokkan menjadi 42 motif, sampul kuning `-1` dan galeri `-2` bila ada. Seluruh kaos putih menjadi Rp69.000 sesuai instruksi; 12 highlight dan ID lama dipertahankan.
- Katalog/detail didesain ulang dalam identitas putih/hitam/lime, dengan hover/reveal, filter, galeri/swipe/lightbox, panduan ukuran, CTA mobile dan rekomendasi. Kainora Park menyediakan pratinjau 3D berdasarkan klik dengan asset aslinya.
- Koreksi UX: pilihan ukuran delapan motif lama dan size chart lama dipulihkan; 34 motif tambahan memakai rentang standar chart 1-2Y sampai 9-10Y sebagai konfigurasi awal yang dapat diatur di admin. Stok fisik belum diverifikasi. Keranjang aktif setelah pilih ukuran; hero katalog besar dihapus, galeri ringkas dengan kaca pembesar 1,6x dan popup spring, teks detail diperbesar.
- URL `/products/...`, HTML statis produk/katalog, metadata per halaman, schema yang tidak mengarang harga/stok/review, breadcrumb, sitemap produk dan 404 tersedia pada build. Reload detail, history, navigasi, alur keranjang dengan fixture lokal dan layout mobile diuji.
- Laporan implementasi dan batas verifikasi ada di `docs/kainora-v2/shop-redesign-2026-10-22.md`; belum ada klaim skor Lighthouse atau ranking Google produksi.

## 25. Koleksi tujuh kaos 3D

- Kainora Park putih dan enam motif hitam (DinoRex, Candy, Kainora Fresh, Icecream, Egg, Key) menggantikan duplikat Park. Candy/Icecream hanya depan, mulai dari depan dan belakang polos. Empat motif hitam lain memakai badge dada dan sablon besar belakang.
- Preset badge tersedia di admin. PNG asli dipertahankan; sembilan tekstur WebP serta manifest asal disiapkan untuk web. Motif hitam tidak ditautkan ke SKU putih tanpa data varian yang sesuai.
- Sablon menyatu di material kain agar berbagi normal dan deformasi; Neutral tone mapping memperbaiki warna. Preview samping menghadap arah kamera berdasarkan posisinya agar tidak tampak tertekan.
- Build, 32 tes, lint, shader/browser desktop/mobile dan metadata produk diperiksa. Laporan: docs/kainora-v2/garment-collection-2026-10-22.md. Perubahan masih lokal.

## 26. Antarmuka pembeli dan media beranda

- Popup masuk/daftar/reset, input, edit profil, keranjang, wishlist dan profil pembeli memakai desain baru dengan Motion, ukuran teks terbaca, kondisi kosong dan penguncian fokus keyboard. Fungsi Firebase dan konfirmasi manual checkout dipertahankan.
- Header memakai empat gambar pemilik dari public, ukuran penuh panel kanan dengan fade silang setiap 2,5 detik. Tidak ada tombol/indikator slideshow. Foto disiapkan sebelum pergantian; timer berhenti saat tidak terlihat.
- Section movement memakai video perjalanan pesanan pemilik. Salinan web 10,24 MB tanpa stream audio, autoplay saat terlihat, loop, tanpa kontrol dan pause saat keluar viewport. Video mengisi lebar desktop/mobile; tepi panorama dapat terpotong karena mode cover.
- Browser 1440/390/320 px, 35 tes, lint, build Cloudflare dan verifikasi HTML produk lulus. UI pembeli terisi diuji dengan fixture lokal tanpa UID; login/simpan akun nyata tidak dijalankan. Laporan: docs/kainora-v2/buyer-ui-and-home-media-2026-10-22.md. Belum deploy.

## 27. SEO, kebijakan perdagangan dan pengukuran mobile

- Judul beranda/katalog/detail diperkuat dengan kata kaos anak oversize/katun. HTML beranda, empat halaman katalog dan 42 detail dibuat penuh pada build dan dipakai kembali oleh React; SDK akun/chat/halaman lain dimuat sesuai kebutuhan. Foto responsif WebP, font lokal berlisensi, penundaan foto kedua dan video dipakai untuk mengurangi beban tanpa menghapus animasi.
- Pemilik mengonfirmasi seluruh SKU katalog tersedia S–XXL dan tabel sementara S33/M36/L39/XL42/XXL45 cm (lebar dan panjang sama). Ini menggantikan konfigurasi usia sementara pada bagian 24. Status tersedia menjadi data eksplisit; stok numerik nol tetap memblokir pembelian.
- Pengiriman dari Bandung/J&T, ongkir sesuai rute/berat, retur 2×24 jam dan tanggung jawab ongkir dikonfirmasi pemilik. Empat panduan HTML tersedia untuk ukuran/cara mengukur, perawatan sablon, pengiriman dan retur; ditautkan ke katalog/detail/footer.
- Google Rich Results Test mode CODE: Product snippets, Merchant listings, Breadcrumbs, Organization dan Shipping policies valid. ShippingDetails per SKU masih memberi peringatan opsional karena tarif aktual tidak boleh dikarang.
- Audit Lighthouse mobile sebelum/sesudah dan Event Timing lokal disimpan di `docs/performance-2026-10-23/`. Target LCP ≤2,5 detik dan interaksi ≤200 ms belum seluruhnya tercapai; CLS memenuhi batas dalam audit lokal. Tidak menyamakan TBT dengan INP atau skor SEO 100 dengan ranking Google.
- Build Cloudflare, 39 tes, verifikasi 42 HTML, UI 320/390/1440 px, navigasi panduan/keranjang, popup akun dan slideshow diperiksa. Belum deploy/push. Laporan lengkap dan batas verifikasi: `docs/performance-2026-10-23/README.md`.
