# Studio Ukuran — selected visual and behavior

The user approved proceeding after the research proposal and mockups, requesting fidelity to the image. Use the recommended first displayed image, `docs/research/2026-10-23-size-guide/concepts/studio-ukuran.png`, as visual truth. The other two images are alternatives, not permission to mix layouts. This consolidates the approved proposal in `docs/research/2026-10-23-size-guide/RISET-DAN-ARAH-DESAIN.md`.

## Intent and constraints

An Indonesian general children's-fashion measuring guide, integrated into the existing Kainora storefront. No new dependencies, backend, paid API, LLM, child-data transmission, or persistence. Existing Kainora-specific size chart remains separate and intact. All seven categories are present. Data coverage is disclosed: do not convert preliminary body-chart means into universal garment sizes, manufacture ease allowances, or promise 1–2 cm cross-brand variance. Research observations remain audit material, not calibrated production recommendations.

## Approaches and selected direction

Studio Ukuran (selected): visual at right, compact form at left, one primary action. Meja Banding was considered for fit education but is denser; a step-by-step shoe-led wizard was considered for beginners but takes more taps. Preserve Studio composition; add comparison and learning below the main studio, rather than replacing it with either alternative.

## Visual contract

White page, warm-ivory garment stage, near-black Archivo typography and acid-lime active category. Existing storefront navbar/wordmark retained. Reference is approximately 1487 × 1058 pixels. At 1440 CSS pixels: max page content 1280–1320 px, page side padding ~5%, breadcrumb at top, small STUDIO UKURAN label, one-line heading "Ukuran pas. Bergerak bebas." around 52–60 px, 16–18 px explanatory copy. Seven category controls align in one row above a subtle divider. Desktop work area uses 32% form / 68% stage, 32 px gap, stage approximately square-to-landscape and ~560 px high. Tee fully visible, natural shape, no edge cropping. Form fields use 16 px type, ~52 px height, soft 10 px radius, visible labels. Black primary action spans form width. Regular/Relaxed/Oversize are segmented native buttons. No HUD, sci-fi decoration, dashboards, fake accuracy badges, or extra marketing hero.

The main hero image is an original raster garment render matching the reference, not hand-drawn SVG/CSS art. Measurement lines are genuine UI data annotations (SVG lines, ticks and labels), explicitly requested by user; not replacements for garment imagery. Labels stay readable on mobile. Category images use the same neutral tactile art direction. Images are illustrations of method, not photos of products sold.

Below ~800 px: compact heading wraps naturally, category buttons wrap without horizontal page overflow, visual precedes form, no sticky overlay obscures fields, all controls ≥44 px, body ≥16 px. Keep the garment no taller than necessary (~340 px at 390 wide) so input is reachable. At 320 px no clipping. Preserve focus indicators and logical keyboard order.

## Category model and outputs

Atasan: tee/polo/shirt/blouse/tunic/outer. Bawahan: trousers/shorts/jeans/jogger/legging/skirt. Sepatu: school/sneakers/sport/sandal/clogs. Bayi: bodysuit/romper/sleepsuit. Dress: dress/jumpsuit/playsuit. Pakaian rumah: pyjamas/underwear/singlet/socks. Muslim: koko/gamis/hijab/mukena. Each category has relevant required fields and measuring instructions; type changes update image/annotations and fields. Fit choice is shown only where relevant, never interpreted as a universal +N cm rule.

Two modes: body measurement (default) and garment/size-chart comparison. Default above-fold state matches mock: height, chest, optional weight; cutting buttons. Additional categories replace relevant fields. Weight is context only, never infers chest/feet. Submit validates decimal comma/dot, finite positive numbers, category limits and optional values. Invalid or stale results must not remain presented as current recommendations. Submission focuses a result section, without forced animation delays.

The local deterministic analysis produces a personal measurement checklist and dimension targets the user actually entered, with a clear label "Panduan pengukuran" rather than invented size labels. Shoe output uses the longer of the two measured feet; do not add a universal toe allowance or equate external sole length to foot length. Garment comparison accepts a known comfortable garment and a candidate chart, compares their actual dimensions and describes smaller/larger/equal differences; it never guarantees fit or substitutes circumference for flat width. Missing coverage explicitly requests more measurement or a product chart. There is no false national average or source-count confidence percentage. Public sources are accessible in a methodology section, alongside date and limitations.

## Interaction and motion

Builder check resolved: subtype measurement matrix is mandatory. Use the following required fields and garment comparison dimensions (all cm); optional context never determines a size:

| Subtype | Body required | Comparison dimensions |
|---|---|---|
| Tee/polo/blouse | height, chest | flat chest width, shoulder-to-hem length |
| Shirt/light outer | height, chest, arm | flat chest width, body length, sleeve length |
| Trousers/jeans/jogger | waist, hip, inseam | flat waist width, flat hip width, inseam |
| Shorts | waist, hip, desired length | flat waist width, flat hip width, total length |
| Legging | waist, hip, inseam | same as trousers; stretch flagged, do not infer comfort |
| Skirt | waist, hip, desired length | flat waist width, flat hip width, skirt length |
| Shoes/sandals/clogs | left foot, right foot | foot length reference/chart, never external sole length |
| Bodysuit/romper | height, chest, shoulder-to-crotch | flat chest width, shoulder-to-crotch length |
| Sleepsuit | height, chest, shoulder-to-crotch | flat chest width, shoulder-to-crotch, inseam |
| Dress/gamis | height, chest, desired length | flat chest width, waist width, shoulder-to-hem |
| Jumpsuit/playsuit | height, chest, shoulder-to-crotch | flat chest width, shoulder-to-crotch, inseam |
| Pyjamas | height, chest, waist | top chest width, top length, bottom waist width |
| Singlet | height, chest | flat chest width, body length |
| Underwear | waist, hip | flat waist width, rise; do not infer from top size |
| Socks | left foot, right foot | foot length reference/chart |
| Koko | height, chest, arm | flat chest width, body length, sleeve length |
| Instant hijab | face circumference, desired front coverage | face-opening circumference, front coverage length |
| Mukena | height, desired top coverage, desired bottom length | upper length, lower length; no universal S/M prediction |

Annotation labels must identify whether they depict body or garment measurements. Each image is a representative subtype and labelled as such; only draw annotations appropriate to it. For subtype not represented by an asset, show measurement instructions instead of placing wrong lines on the representative image. No extra fabricated geometry.

Use installed `motion/react`, standard library icons and native inputs. Category change crossfades the image (260–380 ms) with a subtle 0.97→1 scale. SVG measurement line reveal 420–700 ms, then labels; focused field highlights the related line. Fit changes gently alter presentation to explain fit, clearly labelled an illustration; never pretend uncalibrated pixel scaling is a body simulation. Input changes update labels without counters from zero. Reduced motion shows final state; no continuous loops or scroll pin. Only one category image/annotation stage active; no WebGL canvases, shimmer or fake AI waiting.

## Integration and SEO

Canonical route `/panduan-ukuran-anak/`, with legacy query `?view=sizeGuide` mapped for compatibility. Add lazy page to existing state router and SSR route selection, a static/prerendered document, sitemap entry, guide/footer navigation. Existing `/panduan/ukuran-kaos-anak/` remains intact. First render contains useful body, category labels, source/methodology content, not an empty JS root. Set title, description, canonical, WebPage/BreadcrumbList schema. Canonical excludes user inputs; no child measurements in URL. No FAQ rich-result promise. Build and existing shop/SEO tests must pass with the new route. Use stable image dimensions, load the tee eagerly, other category assets on demand.

## Verification and acceptance

Pure-engine tests cover invalid/partial/out-of-range values, decimal comma, both feet, circumference versus width, comparison equality and negative deltas, no fabricated size result and no network. Browser checks default desktop composition, seven categories, subtype changes, body/garment mode, validation, submission, keyboard and mobile widths 390/320; also back/forward and direct deep link. View target and implementation in a single comparison input and record fixes in root `design-qa.md`. Compare header, heading wraps, work area proportions, asset scale, field heights, typography, palette and spacing. Remaining differences must be named honestly. Keep preview local and don't deploy.

## Builder discretion

Exact component/file split, sources copy wording, icon choice and diagram tick coordinates are implementation details. Prefer focused files and existing conventions. If full category assets are not yet available, finish producing them before handoff; don't substitute handmade silhouettes. Tests for the sizing logic are necessary; do not add implementation-mirroring tests for styling. Existing dirty workspace changes must be preserved, and no broad commit/reset/cleanup is allowed.
