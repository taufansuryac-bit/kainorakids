# Studio Ukuran Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Implement the selected Studio Ukuran mock faithfully in the Kainora storefront, with seven category measuring guides and honest local comparison.

**Architecture:** Small declarative category/measurement module, pure analysis helpers, one lazy page with reusable form and animated asset stage. Extend the existing router/static rendering instead of creating another app.

**Tech Stack:** Existing React 18, Vite 5, motion/react, lucide-react; Node test runner. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-23-size-studio-design.md`

## Global Constraints

- Visual truth: first displayed mock, `docs/research/2026-10-23-size-guide/concepts/studio-ukuran.png`.
- No new dependencies, backend, paid API, LLM, child-data transmission, or persistence.
- Existing Kainora-specific size chart remains separate and intact.
- All seven categories are present. No universal garment sizes or fabricated ease/accuracy.
- White/cream/ink/lime, readable mobile controls, reduced motion, one active image, no handmade garment artwork.
- Preserve existing dirty changes; no deploy or broad commit/reset/cleanup.

## Review Focus

- Blank/negative/nonfinite/decimal-comma inputs never produce stale or fabricated results.
- Shoe guide uses longer measured foot; never outer sole or a made-up room allowance.
- Compare like units; never mix body circumference and flat garment width.
- Subtype/category changes cannot retain irrelevant result/fields or misleading visual annotations.
- Deep links, back navigation, SSR and mobile 320 px remain usable.

### Task 1: Measurement model and analysis

**Files:** Create `src/content/sizeStudio.js`, `src/utils/sizeStudio.js`, `scripts/test-size-studio.mjs`.

**Interfaces:** `SIZE_CATEGORIES` with id, label, types, asset and instructions; `measurementFields(categoryId,typeId,mode)` returns field definitions; `analyseMeasurements({categoryId,typeId,mode,values,fit})` returns `{ok,errors,heading,items,notes}`; `parseMeasurement(value)` returns number or null.

- [x] Write Node tests for comma, blank, zero, Infinity, required/category ranges, ignored stale keys, both feet, explicit flat-width deltas and no fabricated size.
- [x] Run `node --test scripts/test-size-studio.mjs`; verify RED before implementation.
- [x] Implement declarative model and pure helpers; comparison uses same named dimensions, descriptive differences only.
- [x] Run same tests; expect all pass.

### Task 2: Faithful page and motion

**Files:** Create `src/pages/SizeStudioView.jsx`, `src/pages/size-studio.css`, `src/components/size-guide/MeasurementStage.jsx`, original assets under `public/images/size-guide/`.

**Interfaces:** Page takes `initialLocation`; stage takes category/type, focused measurement and fit. Consumes Task 1 definitions/results.

- [x] Implement reference layout/white-cream-lime tokens, seven native category tabs, subtype selector below main form, labelled fields, fit selection, primary action and secondary comparison mode.
- [x] Place actual generated assets, vector measurement annotations with responsive readable labels; crossfade and reduced-motion support.
- [x] Add validation/result focus, reset stale result on changes, measuring instructions, comparison explanation and source disclosure, mobile ordering.
- [x] Verify local browser default, categories, invalid submission, result, comparison and mobile; capture evidence for final QA.

### Task 3: Navigation, static SEO and build integration

**Files:** Modify `src/App.jsx`, `src/utils/productRoutes.js`, `src/context/StoreContext.jsx`, `src/utils/guideLinks.js`, `src/components/shop/BuyerGuideLinks.jsx`, `src/components/fashion/HalftoneFooter.jsx`, `scripts/build-buyer-guides.mjs`, `scripts/hydrate-storefront.mjs`.

**Interfaces:** `/panduan-ukuran-anak/` resolves to `sizeGuide`; legacy query supported; `openGuide` preserves plain-click/middle-click behavior. Static builder emits canonical/meta/schema document and SSR reuses first HTML.

- [x] Add route tests to `test-size-studio.mjs` for canonical/query/old guide paths and modified click behavior where applicable.
- [x] Implement route/navigation/static document using shared definitions and matching WebPage/BreadcrumbList schema.
- [x] Run `node --test scripts/test-size-studio.mjs scripts/test-storefront-seo.mjs scripts/test-shop.mjs` and `npm run build`; expect pass.
- [x] Inspect built page for H1, sources, canonical, sitemap, hydrated initial content, asset dimensions; verify direct browser navigation/back.

### Task 4: Visual and behavior acceptance

**Files:** Root `design-qa.md`; evidence in `docs/size-studio-2026-10-23/`.

- [x] Compare source and captured implementation at matching desktop viewport together; fix actionable typography/layout/asset/spacing drift and recapture.
- [x] Verify 390 and 320 px layouts, input/result/comparison/category states, reduced motion and console; capture.
- [x] Run targeted tests/build after relevant fixes. Record exact proof/limitations in QA; expect `final result: passed` only with no actionable P0/P1/P2.
- [x] Fresh independent review of changed feature files, repair important issues, and hand off clickable local page. No deployment.

Execution uses this session and a focused final reviewer. The user already approved the proposed design and requested implementation; no repeated approval prompt. Record task status and deviations in `docs/size-studio-2026-10-23/progress.md` because the workspace contains pre-existing uncommitted work that must not be swept into feature commits.

