# Plan: P1 Brand primitives: the logo, app icons and manifest, icon foundations
Status: APPROVED (owner, 2026-09-30: approved with the protected-file edits it lists; Q1 and Q2 answered (a), answers under Open questions)
Progress (2026-09-30):
- Steps 0 and 1 are done: the plan (`98a6747`); registry rows R174–R178 and conflict entries C36–C38 (`d1616f6`).
- Step 2 is done. **Baseline** (local, CI environment, 5 runs): median LCP 2179 ms, FCP 756 ms, Performance 99, Best Practices 96 (`errors-in-console`: the favicon 404), HTML 3,308 B, CSS 4,515 B, JS 139,668 B, fonts 38,823 B, images 0 B; HTML + CSS + JS 147,491 B of 190,868 B.
- Step 4, **the owner's verdict: the app icons are approved as shown** (the specimen, 2026-09-30).
- **A1 changed, by the owner's choice at the step 4 stop.** The command guard blocks any command that writes near the locked logo, so the planned `git show … > public/brand/deepzeta-logo.svg` copy can't run. Instead a static route, `src/app/brand/deepzeta-logo.svg/route.ts` (`dynamic = 'force-static'`), reads the locked file at build and serves it unchanged at the same URL. There's no copy in the repo, so nothing can drift, and the icon script reads the locked file too.
  - `public/brand/deepzeta-logo.svg` and the `.prettierignore` change are dropped.
  - One file is added: `src/lib/brand.ts`, the locked logo's path, URL, canvas and crops, shared by the route, `Logo.tsx`, the icon script and the tests, so none of them repeats a value.
- Step 5 is done. **Verified on the built site:** `global-not-found.tsx` honours `viewport` and gets the icon and manifest links; `app/icon.png` is served at `/icon.png`. Next writes `sizes="48x48"` for the ICO (its largest entry), not the `sizes="any"` its docs describe. The logo route opts out of Turbopack's file tracing (`turbopackIgnore`): it's read only at build, and without the opt-out Turbopack traced the whole project (a build warning).
- Step 6 is done: the pixel gradients are measured and reported on every run (24 pairs, C38), and disabled icon lines on the light page are gated (46 checks).
- Step 7 is done. What the checks found:
  - **Clearance (§4.2 rule 4), measured in Chromium** by tracing every line and dot: WhatsApp AI Agent 1.25, Booking Automation System 1.85, AI Voice Receptionist **0.15**, Speed-to-Lead System **−0.55** (the pixel overlaps the dial), CRM Setup & Automation **0.40**. The three approved drawings that fail get the rule's own remedy, a **knockout**: the lines are masked 0.75 around the pixel, and the pixel stays where the prototype put it.
  - **AI Voice Receptionist's pixel moves up 0.45** (y 19.7 → 19.25), more than the 0.1 snap: at 19.7 it crossed the 2-unit padding (§3).
  - **Vitest compiles `.tsx` without a plugin** (verified). **Playwright doesn't:** it compiles JSX with its component-testing runtime, which `react-dom/server` can't render. So one test helper is added, `tests/e2e/icon-gallery.tsx`, which `icons.spec.ts` loads through Vite (already a devDependency), as Vitest does.
Phase: P1
Branch: `feat/p1-brand-primitives`, from `main` at `9b37e6c`
Page tier: T1, the placeholder Home (`lhci` floor ≥ 95), which gets the logo. No effect runs on any page (see the Effect register).

## Goal served
*"A **fast**, **custom-coded** … site … that **proves every claim it makes**."*
- The brand appears from the locked logo file itself, byte for byte, and a gate proves it. There is no redrawn or "optimised" copy.
- The favicon and the manifest end the `/favicon.ico` 404 that costs Best Practices points today ([decision 0014](../decisions/0014-empty-page-baseline-and-js-budget.md)), with zero JavaScript.
- Every later surface (header, mega menu, service pages) draws its icons from one system that enforces the Icon Master Rules by test, not by memory.

## Context
- **The phase** ([04](../ai/04-build-sequence.md) §2): "Logo component (from the locked SVG, unchanged), favicon/manifest, icon system foundations per Icon Master Rules". Exit gate: `verify` green.
- **Sources:**
  - [00](../ai/00-project-master-rules.md) §5: the logo is locked, never edited, reformatted or optimised
  - `Planning Folder/For Ai/DeepZeta Icon Master Rules.md`, and the approved icon prototype `Planning Folder/DeepZeta Signature Icon Prototype.html` ([05](../ai/05-design-system.md) §6, decision 0009)
  - the Design Lab (`docs/design/prototypes/design-lab.html`, reviewed by the owner in 0009): it shows the logo through a byte-identical `logo.svg` cropped with `viewBox`, the method this plan adopts
  - [05](../ai/05-design-system.md) §2 (semantic tokens, the logo needs navy) and §6; [13](../ai/13-experience-design.md) §4.3 and §8; [07](../ai/07-performance-budget.md) §2–§3; [11](../ai/11-i18n-rtl-readiness.md) §1
  - [decision 0015](../decisions/0015-design-tokens-themes-fonts.md), Consequences: "P1 (logo, favicon, `themeColor`): a `viewport` export with `colorScheme: 'dark'` … (check that `global-not-found.tsx` supports it)"
  - [the schema plan](2026-09-29-schema-system.md): the `#logo` ImageObject is "a square PNG ≥ 112×112 exported from the locked logo SVG … Built in P1"
  - `scripts/check-contrast.mjs`, NOT_CHECKED: "pixel colours: the icon plan (P1), against each icon surface"
  - the owner checklist: "Approve the favicon and app icon. Made in Phase 1"
  - the [URL registry](../seo/url-registry.md) §3.8, which lists system files (R170–R173)
- **Lessons:** 5 (a decision is accepted together with its rule edits), L4 (every check is an npm script), L9 (Windows scratch files), L11 (verify config syntax against the docs).

## Verified (installed versions, 2026-09-30)
| What | Evidence |
|---|---|
| `favicon.ico` only in the top-level `app/`; `icon` (`.ico .jpg .png .svg`) and `apple-icon` (`.jpg .png`) anywhere under `app/`. Next writes the `<link>` tags, with `type` and `sizes` taken from the file; the `.ico` gets `sizes="any"` | `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md` (Next.js 16.3.7) |
| `app/manifest.ts` returns a `MetadataRoute.Manifest`; it's a cached route handler served at `/manifest.webmanifest` | `…/01-metadata/manifest.md`; `node_modules/next/dist/lib/metadata/is-metadata-route.js:205` |
| Manifest fields: `display` (`fullscreen`, `standalone`, `minimal-ui`, `browser`), icon `purpose` (`any`, `maskable`, `monochrome`), `id`, `lang`, `dir`, `theme_color`, `background_color` | `node_modules/next/dist/lib/metadata/types/manifest-types.d.ts` |
| `themeColor` and `colorScheme` belong in the `viewport` export (deprecated in `metadata` since 14) | `…/04-functions/generate-viewport.md`; `…/generate-metadata.md:652–658` |
| `global-not-found.js` supports `metadata` and `generateMetadata`. It doesn't mention `viewport` or metadata files | `…/03-file-conventions/not-found.md:185` |
| Playwright 1.63.0 with Chromium 1243 installed; `page.screenshot({ omitBackground })`, `deviceScaleFactor` | `node_modules/playwright-core/types/types.d.ts:13588, 11349`; `%LOCALAPPDATA%/ms-playwright` |
| `outputFileTracingIncludes` exists (for the runtime risk below) | `…/05-config/01-next-config-js/output.md` |
| Vitest runs `tests/unit/**/*.test.ts` in Node; `tsconfig.json` has `jsx: react-jsx` and `allowImportingTsExtensions` | `vitest.config.mts`, `tsconfig.json` |
| **The locked logo:** committed with LF line endings, 23,026 B, SHA-256 `6431c29769786e752a3d2dc972b147e551fea5bc060a717c7feaf48647ee78fc`, blob `589432ea`, about 7.2 KB gzipped. The working copy on this machine is CRLF (23,192 B) | `git ls-files --eol` → `i/lf w/crlf`; `git show HEAD:<path> \| sha256sum` |

**Not verified, so a step checks it on the build:**
- whether `global-not-found.tsx` honours `viewport` and gets the icon links (step 5)
- that the static `app/icon.png` is served at `/icon.png` (step 5)
- that Vitest transforms `.tsx` components without a plugin (step 7)

## What the read found
Each point is handled in the Design.

1. **The logo's line endings.** The committed logo is LF, which is what CI and Vercel check out. The working copy here is CRLF. The drawing is the same; the hash gate compares LF-normalised bytes, so it gives the same answer on every machine.
2. **Hex values in TypeScript fail `check:tokens`,** but the manifest and `theme-color` need a colour literal. → read the token from `tokens.css` at build (C).
3. **Frost lines fail on the light page** (1.35:1). The Icon Master Rules (§5.1) were written for dark only. → lines use the semantic text tokens, which are exactly frost and white on dark (proposed C37).
4. **Some of the logo's pixel colours are under 3:1** on some surfaces (table below). They're the locked logo's colours, so they can't change. → Q2.
5. **The prototype's Tier 2 story lasts 1.45 s** (the glow pulse starts at 0.45 s and runs 1 s). The rule is ≤ 900 ms (Icon Master Rules §7.1). → one 900 ms timeline per story (D5). The rule wins over the prototype.
6. **The prototype's pixel positions are off the 0.25 grid** (13.8, 8.95…), which §3 requires. → snapped to the nearest 0.25: they move at most 0.1 unit, 0.1 px at 24 px.
7. **The prototype predates C6 and the exact catalogue names.** It labels "Booking Automation" and "Speed-to-Lead" and colours them for the dropped "Win" stage. The catalogue names are **Booking Automation System** (1C.1) and **Speed-to-Lead System** (1B.1). All five of its Tier 2 icons are catalogue §1, the AI Automation pillar, so their pixel is `--dz-pixel-ai`.
8. **No Figma master exists** (Icon Master Rules §11: "code is generated from it"), and there's no exported SVG for SVGO to optimise. → proposed C36.
9. **The URL registry lists system files** (R170–R173), and nothing is built without a row. → rows R174–R178 before building (F).
10. **A cluster-only favicon would be a fourth use of the cluster outside icons.** [13](../ai/13-experience-design.md) §8 allows exactly three. → Q1.

**Measured pixel contrast** (WCAG 2.x, computed from the token values; the threshold for UI graphics is 3:1). The lowest of each pixel's three stops:

| Pixel | navy · navy-900 · navy-850 · navy-800 | paper · card (light) |
|---|---|---|
| AI Automation `--dz-pixel-ai` | 7.59 · 7.31 · 6.86 · 6.10 | **1.64 · 1.78** |
| Websites `--dz-pixel-web` | 4.35 · 4.19 · 3.94 · 3.50 | **1.97 · 2.14** |
| Software `--dz-pixel-software` | 3.25 · 3.13 · **2.94 · 2.61** | 4.39 · 4.75 |
| Growth & Ranking `--dz-pixel-ranking` | **2.91 · 2.80 · 2.63 · 2.34** | 5.81 · 6.28 |

Icon lines: frost on the four dark surfaces is 11.21–13.95; on the light page it's **1.35** (finding 3), and `--dz-ink`, the light text colour, is 14.3 (0015).

## Design

### A. The logo (`src/components/ui/Logo.tsx`)
1. **The served file:** `public/brand/deepzeta-logo.svg`, written with `git show HEAD:"Planning Folder/For Ai/deepZeta Ai Logo/Coded Logo SVG Do not touch the code.svg" > public/brand/deepzeta-logo.svg`. These are the committed bytes: the file is never opened in an editor and never formatted (it's added to `.prettierignore`). Next serves only `public/`, so a copy is needed; the locked file is only read.
2. **How it's shown, the Design Lab's method:** an inline `<svg>` whose `viewBox` is the crop, holding one `<image href="/brand/deepzeta-logo.svg" width="1254" height="1254">`.
   - The logo renders as its own document, so its gradient IDs can't collide with the page's.
   - The header and the footer share one cached request.
3. **Variants,** as crops in the logo's own units, taken from the Design Lab:

   | Variant | `viewBox` | Shows | First use |
   |---|---|---|---|
   | `mark` | `372 262 552 432` | the Z ribbon and the four-pixel cluster | Home hero (P5) |
   | `wordmark` | `214 740 832 164` | "Deepzeta" | footer (P2) |
   | `lockup` | the mark and the wordmark in a row; the wordmark is 21/36 of the mark's height, as in the Lab | the mark and the name | placeholder Home (P1), header (P2) |

   Checked against the path data: nothing is clipped. The ribbon spans x 380–853, the cluster ends at x 916.5, and the wordmark covers 222–1038 × 747–896.
4. **Accessibility:**
   - The props require either `label` or `decorative`, so every use makes the choice.
   - With `label`: `role="img"` and `aria-label` on the outer element. With `decorative`: `aria-hidden="true"`.
   - The inner SVGs are always `aria-hidden="true"` and `focusable="false"`.
   - The label is `siteConfig.brandName` ("Deepzeta AI"), never copy written in the component.
   - The logo never flips in RTL (11 §1).
5. **Only on navy:** the white "Deep" needs navy (05 §2). In forced-colours mode the logo keeps its own navy backing (`forced-color-adjust: none`), so "Deep" doesn't vanish on a white system background.
6. **No layout shift:** the SVGs carry the crop's width and height, so the ratio is known before the file loads. The size comes from a Tailwind height class.
7. **Cost:** one image request of 23,026 B (about 7.2 KB gzipped), cached; zero JavaScript.
   - An `<image>` inside an SVG can be an LCP candidate. The lockup is far smaller than the H1, and the existing e2e test asserts the H1 stays the LCP element.
   - The large hero mark (P5) is measured in its own plan.
8. **First use:** the placeholder Home gets a `<header data-theme="dark">` holding the lockup, above `<main>`. It isn't a link, because it's the home page. The copy doesn't change. The real header replaces it in P2.

### B. App icons and the manifest
1. **The files.** Each is drawn from the served logo by one script; nothing is redrawn.

   | File | Pixels | Composition | Why |
   |---|---|---|---|
   | `src/app/favicon.ico` | 16, 32, 48 (PNG entries) | the mark on a navy rounded square | `/favicon.ico` requests; Google Search wants a multiple of 48 |
   | `src/app/icon.png` | 192 | the same | the PNG icon link; Android |
   | `src/app/apple-icon.png` | 180 | the mark on full-bleed navy (iOS rounds the corners itself, and fills transparency with black) | iOS home screen |
   | `public/brand/icon-512.png` | 512 | as `icon.png` | manifest, `purpose: any` |
   | `public/brand/icon-maskable-512.png` | 512 | full-bleed navy, the mark inside the maskable safe zone (the central circle, 80% wide) | manifest, `purpose: maskable` |
   | `public/brand/deepzeta-logo-512.png` | 512 | the whole logo on its own 1254 canvas, on navy (the file's page colour is `#010413`) | the schema `#logo` in P4 (≥ 112×112) |

   **Starting values, tuned in the specimen:**
   - corner radius 20% of the side
   - the mark's width: 88% of the tile at 16–48 px, 76% at 192 and 512, 70% on the apple icon, 62% on the maskable icon (so its diagonal fits the safe circle)
2. **The script:** `scripts/build-brand-icons.mjs`, run as `npm run brand:icons`, by hand. Its outputs are committed.
   - It opens Playwright's Chromium (already a dependency) and draws each crop at its exact final size, which is sharper than shrinking a large image.
   - It screenshots each one with a transparent background where the tile is rounded.
   - It packs the ICO from PNG entries and reads navy from `tokens.css` (C).
   - It prints every file's size.
3. **The owner's review:** `docs/design/prototypes/brand-icons-specimen.html` shows the generated files at real size:
   - on light and dark browser tabs
   - on a phone home screen
   - under the maskable mask
   - next to Q1's alternative, drawn live

   **Work stops here for the owner's verdict** (the checklist's "Approve the favicon and app icon"). Prototypes are never a source (00 §5).
4. **The manifest** (`src/app/manifest.ts`):
   - `name` and `short_name`: `siteConfig.brandName`; `description`: `siteConfig.positioningLine`
   - `id`, `start_url` and `scope`: `/`
   - `display: 'browser'`: it's a website, not an app, so there's no "Install app" prompt and the address bar stays
   - `lang` and `dir` from `locales.en`; Arabic's manifest is a P11 question
   - `theme_color` and `background_color`: navy
   - icons: 192 `any` (`/icon.png`), 512 `any`, 512 `maskable`
5. **Head output,** written by Next (no hand-written head tags, 06 §2.2): `link rel="icon"` for `/favicon.ico` and `/icon.png` (192×192), `link rel="apple-touch-icon"` (180×180), `link rel="manifest"`.

### C. Theme colour and colour scheme
1. `export const viewport: Viewport = { themeColor: <navy>, colorScheme: 'dark' }` in `src/app/(en)/layout.tsx`, and in `global-not-found.tsx` if Next honours it there (step 5; if not, the report says so).
   - Navy is right in both themes: the header stays navy on a light page (05 §2), so the browser bar matches it.
   - P2's theme switch sets `color-scheme` for visitors who choose light (0015); `theme-color` stays navy.
2. **Where navy comes from:** `src/lib/tokens.ts` exports `readToken(name)`. It reads `src/styles/tokens.css` at build and returns a `:root` value, and throws on a missing token.
   - It imports only Node built-ins, so the icon script can import it too, as `next.config.ts` imports `security-headers.ts`.
   - Each colour stays written once, in `tokens.css`, and `check:tokens` is unchanged.

### D. Icon foundations
1. **Scope:** Tier 1 and Tier 2 complete, with the 11 icons already drawn in the approved prototype. Tier 3 waits for its first surface (Out of scope).
2. **One typed registry,** `src/components/icons/registry.ts`. Each icon is data, not free-form markup:
   - **Tier 1:** `name`, `flip`, and its shapes.
   - **Tier 2:** `name` (the exact catalogue name), the `catalogue` number, `pillar` (`ai`, `web`, `software` or `ranking`: the token names, C6), the "The pixel is …" sentence, `motion` (from §7.3), `flip`, its shapes, and one `pixel { x, y, size }`.
   - The pixel is its own field, so "exactly one pixel" holds by type, and the tests can check the grid, the sizes and the budgets.
3. **The component,** `src/components/icons/Icon.tsx`: a Server Component with zero JavaScript.
   - Usage: `<Icon name="arrow" size={20} />`, `<Icon name="whatsapp-ai-agent" size={24} />`.
   - Sizes are typed per tier: Tier 1 16, 20, 24; Tier 2 20, 24, 32, 48, 64.
   - The pillar comes from the registry, not a prop, so an icon can't appear in the wrong pillar colour.
   - Always `aria-hidden="true"` and `focusable="false"`. A meaningful icon's label goes on its button (Icon Master Rules §10).
   - **Tier 1** renders `<svg><use href="#dz-1-arrow"/></svg>`. The stroke settings sit on the outer `<svg>`, because they inherit into the `<use>` content.
   - **Tier 2** renders inline, so CSS can animate its parts.
   - Names: `dz-1-{name}` and `dz-2-{pillar}-{slug}` (§11, with the pillar in place of the stage).
4. **Shared definitions,** `src/components/icons/IconDefs.tsx`: one hidden SVG (zero size, not `display: none`) with:
   - the four pillar pixel gradients, `dz-px-{pillar}`, top to bottom, on the prototype's vector
   - the four glow gradients, `dz-halo-{pillar}`
   - the Tier 1 `<symbol>` sprite

   Stop colours come from tokens through CSS classes, so no colour sits in the SVG. **P2 mounts it in the root layout** (02 §3.8), with the first icons on a page. In P1 no page shows an icon, so the only icon bytes a visitor gets are `icons.css`.
5. **The CSS,** `src/styles/icons.css`, imported by `globals.css`:
   - **Lines:** `stroke: currentColor`, width 1.5, square caps, round joins; soft lines at 42%; dots filled.
   - **Line colour (C37):** rest `--dz-text` (frost on dark, ink on light); hover and focus `--dz-text-strong`; disabled `--dz-slate`; a `--dz-dur-fast` colour transition.
   - **The pixel:** `fill: url(#dz-px-{pillar})`, lit at rest. Its glow goes 0 → 0.6 on hover and focus.
   - **The trigger:** the interactive parent carries `dz-icon-host`; stories run on its `:hover` and `:focus-visible` (focus parity, 13 §2).
   - **The story:** every Tier 2 motion runs on one timeline, `--dz-dur-story` (900 ms, a new token, 05 §5), with its choreography in keyframe percentages, so no story can pass the cap. Transform and opacity only; the last frame equals the rest frame; `transform-box: fill-box`.
   - **Reduced motion:** stories exist only inside `(prefers-reduced-motion: no-preference)` (13 §3.3). Under `reduce`: no animation, pixel lit, glow at 0.45 (§4.4). P2 adds the Reduce effects switch's selector.
   - **RTL:** `[dir='rtl'] .dz-icon--flip { transform: scaleX(-1) }`.
   - No px values (the viewBox sets the units) and no raw colours.
6. **Tokens** (`src/styles/tokens.css`):
   - the 12 pixel stop colours, `--dz-pixel-{pillar}-top|mid|bottom`; the four `--dz-pixel-*` gradients then use them, so each colour is written once
   - `--dz-dur-story: 900ms`, the Tier 2 cap from 05 §5
7. **The pilot icons,** ported from the prototype. Only the pixel positions move (the 0.25 snap).

   | Tier | Name | Pillar | Flips in RTL | The pixel is … (§8.3) | Motion |
   |---|---|---|---|---|---|
   | 1 | Arrow | — | yes | — | state |
   | 1 | Send | — | yes | — | state |
   | 1 | Check | — | no | — | state |
   | 1 | Menu | — | no | — | state |
   | 1 | Close | — | no | — | state |
   | 1 | Globe (language) | — | no | — | state |
   | 2 | WhatsApp AI Agent (1A.1) | AI Automation | yes (bubble tail) | the instant reply | dots blink → pop |
   | 2 | AI Voice Receptionist (1A.2) | AI Automation | no | the voice answering the call | pop |
   | 2 | Booking Automation System (1C.1) | AI Automation | no (calendar) | the booked slot | pop |
   | 2 | Speed-to-Lead System (1B.1) | AI Automation | no (stopwatch) | the moment the reply goes out | pop |
   | 2 | CRM Setup & Automation (1B.6) | AI Automation | yes (text lines) | the lead's updated status | pop |
8. **The contrast gate,** `scripts/check-contrast.mjs`:
   - It adds the 12 pixel stops against every icon surface in both themes (navy, navy-900, navy-850, navy-800, paper, card), and slate (disabled lines) on paper.
   - With Q2's recommended answer, the pixel ratios are printed as a "reported, not gated" list, and the pixel line leaves NOT_CHECKED.
   - Icon lines are already gated: they use `--dz-text`, which the gate checks on `--dz-bg` and `--dz-surface` in both themes.

### E. Tests
- **`tests/unit/brand-assets.test.ts`:**
  - the served logo's LF-normalised SHA-256 equals the locked file's, and both equal `6431c297…78fc`, so an edit to either fails
  - each PNG's size and format, read from its header
  - the ICO holds 16, 32 and 48 px PNG entries
  - size caps, set from the measured sizes with headroom
- **`tests/unit/icons.test.ts`:**
  - Tier 2: one pixel, a pillar, a name from the exact catalogue list, a "pixel is" sentence, a motion from §7.3; Tier 1 has none of these
  - every coordinate on the 0.25 grid (dot radii and the pixel size are the documented exceptions); pixel size 2.6–3.4
  - rendered bytes within the tier budget: 0.4 KB (Tier 1), 1 KB (Tier 2)
  - names follow `dz-{tier}-…`
- **`tests/unit/tokens.test.ts`:** `readToken('--dz-navy')` returns `#010413`; an unknown token throws.
- **`tests/unit/check-contrast.test.ts`:** the pixel pairs are computed and reported; the pending list no longer claims pixels.
- **`tests/e2e/brand.spec.ts`,** on the built site:
  - the Home logo has the accessible name "Deepzeta AI", its file returns 200 as `image/svg+xml`, and the H1 is still the LCP element
  - the head has the four links, a `theme-color` equal to the token and `color-scheme: dark`
  - the manifest parses, and every icon it lists returns 200 at its declared size
  - `/favicon.ico` returns 200 (headless Chromium doesn't request favicons itself, 0014)
  - the 404 page's head holds what step 5 verified
  - in forced-colours mode the logo keeps its navy backing
- **`tests/e2e/icons.spec.ts`:** the test renders `IconDefs` and the pilot icons to markup and injects them into the built Home, so the real CSS applies. No route is added and visitors get no bytes. Then, in Chromium:
  - lines are frost at rest and white while the host is hovered
  - the pixel's fill points to its gradient
  - hovering the host starts the story; with reduced motion, the pixel is lit and the glow is 0.45
  - flip icons mirror under `dir="rtl"`, and the others don't
  - axe finds no serious or critical violations

### F. Protected edits this plan asks you to approve (00 §5)
**In step 1, before building** (04 §1.5, "register before you build"):
- `docs/seo/url-registry.md` §3.8, appended:

  | ID | URL | Type | Index | Notes |
  |---|---|---|---|---|
  | R174 | `/favicon.ico` | System | — | ICO favicon (16, 32, 48 px), P1 |
  | R175 | `/icon.png` | System | — | PNG icon (192 px), P1 |
  | R176 | `/apple-icon.png` | System | — | iOS home-screen icon (180 px), P1 |
  | R177 | `/manifest.webmanifest` | System | — | Web app manifest, P1 |
  | R178 | `/brand/*` | System | — | Brand files: the byte-identical logo, the manifest's 512 px icons, the square logo PNG (the schema `#logo`, P4) |
- `docs/ai/conflict-register.md`, appended:
  - **C36** · Icon Master Rules §11 says "one Figma master file … code is generated from it" and "every SVG goes through SVGO". No Figma master exists, and the icons are written by hand as data, so there's nothing for SVGO to optimise. · **Resolution:** until a Figma master exists, `src/components/icons/registry.ts` is the source of truth. SVGO isn't added. The grid, stroke, one-pixel rule and byte budgets are enforced by `tests/unit/icons.test.ts`. The approved prototype stays the drawing reference; where its timing or coordinates break a rule (the 1.45 s Tier 2 story, pixels off the 0.25 grid), the rule wins.
  - **C37** · Icon Master Rules §5.1 sets the line colours to frost, white and slate, written for dark only; frost on the light page is 1.35:1. · **Resolution:** lines use the semantic tokens `--dz-text` (rest), `--dz-text-strong` (hover and focus) and `--dz-slate` (disabled), because components use semantic tokens (05 §2). On dark they are exactly frost, white and slate.
  - **C38** · 05 §2 asks 3:1 for UI graphics; the logo's pixel colours are locked, and some stops fall below 3:1 (the table above). · **Resolution (Q2):** the pixel is a supplementary accent. Every icon's meaning is carried by its lines (gated) and its text label (Icon Master Rules §10), so WCAG 1.4.11 doesn't apply to it. `check:contrast` reports the pixel ratios on every run without failing.
  - **C39**, only if Q1 is answered (b): the cluster-only small favicon as a fourth permitted use of the cluster outside icons (13 §8).

**In step 10, at the end:**
- [05](../ai/05-design-system.md) §6: how icons are delivered (the registry, `Icon`, `IconDefs` in the root layout, `dz-icon-host`), the line colours (C37) and the pixel rule (C38). §5: `--dz-dur-story` is 900 ms for Tier 2.
- [03](../ai/03-verification-gates.md) §1: `check:contrast` also reports the pixel ratios (C38).
- `.claude/skills/new-icon/SKILL.md`: the pillar in place of the stage, `dz-px-{pillar}`, the registry, no SVGO (C36), the 900 ms timeline.
- `CLAUDE.md`, "Current state": P1 done, next P2.
- Not protected, listed for completeness: `docs/decisions/0018-brand-primitives.md` and its index row.

## Out of scope
- **Tier 3 icons** (the cluster, depth, glass and sweep definitions; AI Front Desk; the four pillar head icons) and **mounting `IconDefs`.** They arrive with their first surface, the P2 mega menu, together with P2's shared IntersectionObserver, which starts Tier 3 stories on scroll-in (13 §7). Under C6 the Tier 3 set also changes, from "6 Systems and 4 stages" to "6 bundles and 4 pillars", and the pillar head metaphors don't exist yet.
- New icon drawings, such as the header's chevron, eye and gauge (P2).
- The header, footer and hero surfaces (P2, P5), and the hero mark's light sweep (P5).
- The schema `#logo` node and Open Graph images (P4); social-profile images (the script can add sizes on request).
- The Reduce effects switch and the light-theme switch (P2).
- The Arabic manifest (P11).
- Industry icons and platform logos (Icon Master Rules §14 items 2 and 3): decided at first use.
- Any edit, reformatting or optimisation of the locked logo.

## Allowed files
| Path | Action | Purpose |
|---|---|---|
| `docs/plans/2026-09-30-p1-brand-primitives.md` | CREATE | This plan |
| `docs/seo/url-registry.md` | APPEND-ONLY (protected) | R174–R178 (F) |
| `docs/ai/conflict-register.md` | APPEND-ONLY (protected) | C36–C38, and C39 if Q1 is (b) (F) |
| `public/brand/deepzeta-logo.svg` | CREATE | The committed logo bytes, written by `git show` (A1) |
| `public/brand/icon-512.png` | CREATE (generated) | Manifest icon, `any` |
| `public/brand/icon-maskable-512.png` | CREATE (generated) | Manifest icon, `maskable` |
| `public/brand/deepzeta-logo-512.png` | CREATE (generated) | Square logo for the schema `#logo` (P4) |
| `src/app/favicon.ico` | CREATE (generated) | 16, 32, 48 px |
| `src/app/icon.png` | CREATE (generated) | 192 px |
| `src/app/apple-icon.png` | CREATE (generated) | 180 px |
| `src/app/manifest.ts` | CREATE | The manifest (B4) |
| `src/app/(en)/layout.tsx` | MODIFY | `viewport` export (C1) |
| `src/app/global-not-found.tsx` | MODIFY | `viewport` export, if supported (C1) |
| `src/app/(en)/page.tsx` | MODIFY | The logo header on the placeholder Home (A8) |
| `src/components/ui/Logo.tsx` | CREATE | The logo component (A) |
| `src/components/icons/Icon.tsx` | CREATE | The icon component (D3) |
| `src/components/icons/IconDefs.tsx` | CREATE | Shared gradients and the Tier 1 sprite (D4) |
| `src/components/icons/registry.ts` | CREATE | Typed icon data and the 11 pilots (D2, D7) |
| `src/lib/tokens.ts` | CREATE | Build-time token reader (C2) |
| `src/styles/tokens.css` | MODIFY | Pixel stop tokens, `--dz-dur-story` (D6) |
| `src/styles/icons.css` | CREATE | Icon lines, pixel, states, stories, reduced motion, RTL (D5) |
| `src/styles/globals.css` | MODIFY | Import `icons.css` |
| `scripts/build-brand-icons.mjs` | CREATE | Renders the app icons and packs the ICO (B2) |
| `scripts/check-contrast.mjs` | MODIFY | Pixel pairs, reported (D8) |
| `package.json` | MODIFY | The `brand:icons` script only; no dependency changes |
| `.prettierignore` | MODIFY | `public/brand/*.svg`, never reformatted |
| `tests/unit/brand-assets.test.ts` | CREATE | Logo hash, PNG and ICO checks (E) |
| `tests/unit/icons.test.ts` | CREATE | Registry rules and budgets (E) |
| `tests/unit/tokens.test.ts` | CREATE | The token reader (E) |
| `tests/unit/check-contrast.test.ts` | MODIFY | Pixel pairs (E) |
| `tests/e2e/brand.spec.ts` | CREATE | Logo, head, manifest, 404 (E) |
| `tests/e2e/icons.spec.ts` | CREATE | Icons in a real browser, injected (E) |
| `docs/design/prototypes/brand-icons-specimen.html` | CREATE | The owner's favicon review (B3); never a source |
| `docs/ai/05-design-system.md` | MODIFY (protected) | §5 and §6 (F) |
| `docs/ai/03-verification-gates.md` | MODIFY (protected) | §1, the `check:contrast` row (F) |
| `.claude/skills/new-icon/SKILL.md` | MODIFY (protected) | The recipe matches the code (F) |
| `CLAUDE.md` | MODIFY (protected) | "Current state" (F) |
| `docs/decisions/0018-brand-primitives.md` | CREATE | The record: sizes, hashes, measurements, the owner's verdicts |
| `docs/decisions/README.md` | APPEND-ONLY | Its index row |

`lighthouserc.cjs` doesn't change: P1 adds no JavaScript, so `OWN_JS_HOME` stays 0.

## Steps
0. Once approved: set `Status: APPROVED (owner, date)` and commit the plan on the branch. → `check:effects` + `check:rules`
1. The protected edits needed before building: registry rows R174–R178; C36–C38. → `check:rules`
2. **Baseline** on the branch head: `npm run verify`. Record Home's `lhci` figures: median LCP, Best Practices (96 in 0014, because of the favicon 404), and HTML, CSS, JS and image bytes. → `verify`
3. **The logo:** the served copy (`git show` redirect), `.prettierignore`, `Logo.tsx`, `src/lib/tokens.ts` and its test, the hash test. → `verify:fast` + `test`
4. **The app icons:** the script, the renders, the specimen. **Stop for the owner's favicon verdict.** Then the final files and the `brand-assets` tests. → `verify:fast` + `test`
5. **Manifest and viewport** (the layout and the 404). Build, then read the head of `/` and of an unknown URL. Record whether the 404 gets the `viewport` metas and the icon links, and the path `icon.png` is served at. → `verify:fast` + `build`
6. **Tokens and the contrast gate:** the stop tokens, `--dz-dur-story`, the pixel pairs. Confirm the gradient tokens still pass the gate's shape check. → `verify:fast` + `test`
7. **Icons:** registry, `Icon`, `IconDefs`, `icons.css`, the 11 pilots, the unit tests. First confirm that Vitest transforms `.tsx`. If it can't without a plugin, the budget test measures a small string serialiser that the component also uses, and no dependency is added. → `verify:fast` + `test` + `build`
8. **Home:** the logo header, then the e2e specs `brand.spec.ts` and `icons.spec.ts`. → `build` + `test:e2e`
9. **Full `verify`,** and `lhci` compared with step 2. The reviewer, the performance and accessibility auditor and the SEO/GEO auditor (head, manifest) review; findings are fixed within the allowed files. → `verify`
10. **Close-out:** the end-of-task protected edits (F), decision 0018 (sizes, hashes, measurements, the owner's verdicts), and the report (02 §5). When the owner says "merge": `git merge --no-ff`, push, and check the Vercel deployment. → `check:rules` + `verify`

## Effect register
| Section | Effect ID | Cost → mitigation | Byte cap (13 §7) | Verify items |
|---|---|---|---|---|
| The Tier 2 icon story in `icons.css` (a foundation: no page shows an icon in P1) | `hover-glow` | CSS keyframes on transform and opacity, ≤ 900 ms, played once per hover or focus of the host, never looped → no JavaScript; runs only under `prefers-reduced-motion: no-preference`; otherwise a lit pixel with glow 0.45 | None listed in 13 §7. `icons.css` is measured in step 9 (expected well under 1 KB gzipped) | None |

The logo and the app icons use no effect.

## Dependencies to add
None. Rasterising uses `@playwright/test` 1.63.0, already a devDependency. `sharp` sits in `node_modules` as a Next.js dependency but isn't in `package.json`, so it isn't used (02 §2.1).

## Risks & mitigations
- **The logo request slows lab LCP.** An image found in the HTML shares Lighthouse's simulated bandwidth, as the font did (0015). → Measured in step 9 against step 2. If median LCP grows by more than 100 ms, or the H1 stops being the LCP element, work stops and the owner gets the numbers and options.
- **Reading `tokens.css` at request time.** Every page is static today, so the layout's `viewport` and the manifest are computed at build. If a route becomes dynamic (P3's nonce CSP, P7's tools), the layout runs on Vercel at request time and needs the file in the function bundle. → The first plan that makes a route dynamic adds `outputFileTracingIncludes` for `src/styles/tokens.css`. Decision 0018 records this.
- **The mark may not read at 16 px.** → The specimen shows it at real size before anything is committed, next to Q1's alternative.
- **Generated PNGs can differ slightly between Chromium versions.** → The committed files are the record. The tests check format and size, not pixels, and the script is re-run only on purpose.
- **PNG entries in an ICO** aren't read by browsers from before Windows Vista. → Every current browser reads them.
- **`global-not-found.tsx` may ignore `viewport` or the metadata files.** → Step 5 records the real output. `/favicon.ico` exists either way, so the 404 can't log a favicon error.
- **Gradients shared across inline SVGs** don't render when the defining SVG is `display: none` (**verify** in step 8). → `IconDefs` is hidden with zero size instead, and `icons.spec.ts` checks that the pixel fill resolves.
- **Drift into P2** (header icons, Tier 3). → The Out of scope list; new icons need P2's plan.

## Gates (03 §2)
- After each code step: `verify:fast`.
- Components and assets: `test` + `build`.
- The Home change (a page change): `build` + `check:schema` + `check:seo` + `check:links` + `test:e2e` + `lhci`. `check:content` doesn't exist until P4: **NOT RUN**, with that reason.
- Phase exit: the full `verify` + owner review.
- Rule edits: `check:rules`.

## Open questions
**Q1 · The favicon and app icon symbol.** Only crops of the locked logo are possible (nothing is redrawn).
- **(a) The Z mark (the ribbon and the cluster) at every size (recommended).** One symbol everywhere, and it's the same crop the Home hero uses (C19).
- **(b) The four-pixel cluster alone for the 16 and 32 px favicons, the mark from 48 px up.** It reads more clearly in a tab, but it's a fourth use of the cluster outside icons, so it needs a rule exception (C39, 13 §8). Also, from the path data, a square crop around the cluster catches a sliver of the ribbon at its lower-left corner.

Either way, the specimen shows both at real size before anything is committed, and you can switch then.

**Q2 · Pixel contrast.** Some of the logo's pixel colours are under 3:1 on some surfaces (the table in "What the read found"), and they can't change.
- **(a) The pixel is a supplementary accent (recommended).** Lines and labels carry every icon's meaning, and the lines are gated. `check:contrast` reports the pixel ratios on every run without failing (C38).
- **(b) Gate the pixel at 3:1.** Then the Growth & Ranking and Software pixels can't sit on cards or raised surfaces in dark mode, and the AI Automation and Websites pixels can't appear in light mode. That rules out the mega menu's pillar columns as designed.

**The owner's answers (2026-09-30):**
- **Q1: (a).** In the owner's words, "Use 'D+4 Pixel' … we must follow the quality": the mark, whose ribbon reads as a D, with the logo's four pixels, and no exception to 13 §8. C39 isn't needed. The specimen (step 4) is the visual confirmation.
- **Q2: (a).** The pixel is a supplementary accent; `check:contrast` reports its ratios without failing (C38).
