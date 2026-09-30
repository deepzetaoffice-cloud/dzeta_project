# Plan: P2 Layout shell: header, mega menu, mobile sheet, footer, conversion path, effect controllers
Status: APPROVED (owner, 2026-09-30), with the protected-file edits it lists. Q1–Q5 answered (a), Q2 with a placement note; the answers are under Open questions.
Progress:
- 2026-09-30 · Step 0 is done on `feat/p2a-shell-foundations`: the plan, then conflict entries C40–C42 and registry row R165. Step 1 starts in a new session (the owner's choice).
- 2026-10-01 · **Step 1 (baseline) is done** on `bfd63d4`. `npm run verify` in the CI environment: exit 0 (162 unit tests, 42 e2e, the HTML gates, `lhci` and page weight).
  - **Home's `lhci` baseline** (local, 5 runs, Chrome 154, Lighthouse 12.6.1): median LCP **2333 ms** (runs 2277–2346), FCP 755 ms, TBT 13 ms, CLS 0, Performance 98, the other three categories 100. Bytes: script 139,668 · font 38,823 · image 24,074 (the logo) · other 7,080 · CSS 5,495 · HTML 3,990. **HTML + CSS + JS 149,153 B** of 190,868 B: the P1 merge's figure (the Risks line's 148,912 B is 0018's earlier one). These are the reference for step 5 and the Risks stops. Locally only 167 ms is left under the 2.5 s LCP limit.
  - **The first-paint trace (E3):** Playwright's Chromium 153, a new context per load, 412 × 823 at 1.75, CPU 4×, localhost; the logo request blocked or not, interleaved. First paint, FCP and LCP (the H1, text) are the same frame in every run. Over 10 pairs, the median first paint is 201.1 ms with the logo and 206.6 ms without (paired median −2.5 ms; a first batch of 5 pairs gave +15 ms, which was noise). **The logo doesn't delay the first frame. 0018's 60–80 ms isn't reproduced, so the E3 stop (> 50 ms) doesn't apply.** The logo arrives before the first paint (≈ 42 ms) and costs, before it: parsing its SVG document ≈ 6 ms and painting it ≈ 2.5 ms (main thread, 4×), raster ≈ 0.4 ms, and no image-decode task. **Not covered:** DevTools CPU throttling slows the main thread only, so raster (where the blur filter is drawn) isn't slowed. The budget phone covers that (owner checklist). The script is deleted at part A's close (02 §4) and written again for step 9.
  - **For step 3:** on `next start` the logo is served with `cache-control: s-maxage=31536000` (0018's `max-age=0, must-revalidate` is presumably Vercel's; step 5 checks the preview).
  - **Open (for the owner):** `check:links` prints "nav and footer hrefs equal canonicals, duplicate targets (enabled in P2, with the layout shell)", but no part's table lists `tests/gates/links.spec.ts`. Part B needs either that file added to its table or the line moved to P4.
Phase: P2
Branch: three parts, one merge each (Q5): `feat/p2a-shell-foundations`, `feat/p2b-header`, `feat/p2c-footer` (each from `main` after the previous merge)
Page tier: T1. The shell renders on every page. It's measured on Home (`lhci` ≥ 95) and, from part B, on the review page (A3), which shows the complete shell.

**The three parts** (Q5):
- **A · Foundations:** the fallback-font fix, the logo's caching and first-paint trace, the shared document (viewport, 404, error page). Nothing visible changes except steadier text.
- **B · Header:** preferences and Reduce effects, the effect controllers, the glass, Tier 3 icons, the header, the mega menu, the mobile sheet, the review page.
- **C · Footer and exit:** the footer "The Landing", the conversion path, the effects feasibility gate, the phase's rule edits and decision 0019.

## Goal served
*"A **fast**, **custom-coded**, AI-search-ready site that **turns UAE business owners into booked AI audits**, and **proves every claim it makes**."*
- Every page gets one path to **Book a free AI audit**: the header CTA, the mobile thumb zone, the sticky mobile bar and the footer finale (conversion-path.md).
- The shell proves the speed claim while it's built. Every effect is measured against the T1 caps on Home and on a budget Android phone (the effects feasibility gate, 04 §2) before P5 builds on it.
- Visitors choose less motion or a light page, and the choice holds on every visit without a flash (13 §2.11, decision 0015).

## Context
- **The phase** ([04](../ai/04-build-sequence.md) §2): "Header 'Proof Bar', mega-menu, mobile nav, footer 'The Landing', conversion-path elements (built once, shared), shared effect controllers (`src/lib/fx/`), Reduce effects switch, language-switch placeholder (hidden until Arabic)".
  - **Exit gate:** `verify` + e2e keyboard nav at 360/390/768/1280 + the **effects feasibility gate**: the shell with every T1 effect on, measured with `lhci` on Home (≥ 95) and on a budget Android phone, within the caps in [13](../ai/13-experience-design.md) §7.
- **Surface specs (CONFIRMED):** [header.md](../design/header.md), [footer.md](../design/footer.md), [conversion-path.md](../design/conversion-path.md).
- **Carried into P2 by earlier decisions:**
  - [0018](../decisions/0018-brand-primitives.md) Consequences, "P2":
    - mount `IconDefs` once (and in `global-not-found.tsx`), with one shared `viewport` constant
    - cache the logo: a versioned URL, `immutable` through `next.config.ts`, checked on `next start` and Vercel
    - trace the first paint (the audit saw the first frame 60–80 ms later in 4 of 5 local runs)
    - Tier 3: the cluster, depth, glass and sweep definitions, AI Front Desk and the four pillar heads, with the shared IntersectionObserver
    - add the Reduce effects selector to `icons.css`
    - brand the built-in error page; optionally `appleWebApp.title`
  - [0015](../decisions/0015-design-tokens-themes-fonts.md) Consequences, "P2" and §5's known gap:
    - **the fallback-font fix** (the fallback is sized for Montserrat Thin, so a swap can re-wrap lines) and a rem-based `--dz-measure`, with an e2e test that delays the font and records layout shifts
    - the theme switch, stored, with a no-flash script (also in `global-not-found.tsx`) that sets `data-theme` and the `color-scheme` meta
    - glass tokens from the finding "frost text needs a 0.68 tint, mist 0.79"
    - a forced-colours e2e test (2 px solid focus ring, axe)
    - `data-theme` on non-focusable containers only
    - headings get `overflow-wrap: break-word`
    - the statement and display sizes at 200% zoom: a smaller `vw` slope, or record the gap
    - one shared axe helper for the e2e specs (listed for later plans; P2 adds many axe checks)
- **Rules:** [05](../ai/05-design-system.md) §1–§7, [06](../ai/06-code-standards.md) §2–§4, [07](../ai/07-performance-budget.md) §2–§4, [08](../ai/08-seo-geo-aeo-schema.md) §1–§2, [09](../ai/09-analytics-tracking.md) (no events fire in P2), [10](../ai/10-content-voice.md), [11](../ai/11-i18n-rtl-readiness.md) §1, [13](../ai/13-experience-design.md), the [URL registry](../seo/url-registry.md), [engine](../seo/seo-geo-domination-engine.md) §5.1 and §5.3 rule 5, the Icon Master Rules, facts §2 and §2.1.
- **Lessons:** 2 (the LCP element at first paint), 3 (metrics only from real APIs), 4 (keyboard patterns for menus, drawers and sheets), 5 (a decision is accepted with its rule edits), L9 (scratch files on Windows), L11 (verify syntax against the docs).

## Verified (2026-09-30)
| What | Evidence |
|---|---|
| The no-flash pattern: an inline `<script>` in `<head>` through `dangerouslySetInnerHTML`, `suppressHydrationWarning` on `<html>`, `try/catch` around `localStorage` | `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md` §Themes (Next.js 16.3.7) |
| An inline script needs `'unsafe-inline'`, a nonce (which forces dynamic rendering) or a hash under an enforced CSP | the same guide; `…/02-guides/content-security-policy.md` |
| `next/font/local`: `adjustFontFallback` is `'Arial'`, `'Times New Roman'` or `false` (default `'Arial'`); `declarations` adds descriptors to the generated face | `…/02-components/font.md` |
| The fallback next/font builds today: **one** face, `local(Arial)`, `size-adjust: 110.19%`, ascent 87.85%, descent 22.78%, for every weight | the built CSS, `.next/static/chunks/2zll4s9on_v1w.css` |
| `headers()` can set `Cache-Control` on any response except Next's own hashed immutable assets | `…/05-config/01-next-config-js/headers.md` §Cache-Control |
| `global-error.tsx` is a Client Component with its own `<html>` and `<body>`; no global styles or theme reach it; no `metadata` export (React `<title>` instead) | `…/03-file-conventions/error.md` §Global Error |
| `appleWebApp.title` is a `metadata` field | `…/04-functions/generate-metadata.md:779` |
| `@custom-variant`, `@variant` and `@slot` exist in Tailwind 4.3.3 | `node_modules/tailwindcss/dist/lib.js` |
| `scripts/check-page-weight.mjs` already checks every lhci URL | `scripts/check-page-weight.mjs` (`checkRuns`) |
| Python 3.13.15 is installed; fontTools is not | `python --version`; `import fontTools` fails |

**Browser support** (web-features 3.40.0, MDN browser-compat-data 8.1.3 of 2026-09-24, webstatus.dev, WebKit and Mozilla bug trackers; read 2026-09-30 by a research subagent):

| Feature | Status | Consequence here |
|---|---|---|
| Popover API (`popover`, `popovertarget`) | Newly available 2025-01 (Chrome 114, Firefox 125, Safari 17, iOS 18.3) | The mega menu is a popover: Esc and light dismiss for free, no JavaScript |
| Implicit `aria-expanded` on a `popovertarget` button | HTML-AAM; Chrome, Firefox and WebKit implement it (first versions not verified). ARIA in HTML: authors **must not** add `aria-expanded` to it | The disclosure's expanded state comes from the platform; e2e reads Chromium's accessibility tree |
| `<dialog>` + `showModal()` | Widely available: the page behind is inert, Esc closes it | The mobile sheet is a modal dialog: focus trapped for free |
| `closedby` | Limited (no Safari) | Not used |
| Invoker commands (`commandfor`, `command="show-modal"`) | Newly available 2025-12 (Chrome 135, Firefox 144, Safari 26.2) | The menu button opens the sheet without JavaScript; the runtime covers older browsers. No expanded mapping, so the button carries `aria-haspopup="dialog"` |
| Scroll-driven animations | Limited: Chrome 115, Safari 26; Firefox only behind a flag | `scroll-journey-line` only, inside `@supports`; the header condense uses the observer instead |
| `backdrop-filter` | Newly available 2024-09 (Safari 18 unprefixed, `-webkit-` from 9) | `glass-live`, with the prefix checked in the built CSS |
| `backdrop-filter: url()` | Broken in Firefox (bug 1961378) and Safari (bug 245510; a crash loop reported 2026-09) | **`glass-liquid` ships without the refraction extra** (finding 9) |
| `prefers-reduced-transparency`; `deviceMemory`; `saveData` | Limited: Chromium only | Read by the init script, never in a CSS condition that other browsers would treat as false |
| Anchor positioning | Limited | Not used: the menu is positioned from the header's own tokens |
| `@starting-style`, `transition-behavior: allow-discrete` | Newly available 2024-08 | Open and close transitions for the popover and the dialog; instant where unsupported |
| `size-adjust` | Safari 17+, Chrome and Firefox 92 | The width fix works in every current browser |
| `ascent-override`, `descent-override` | Limited: **not in Safari or iOS** | Line boxes keep their explicit `line-height`, so Safari's layout isn't affected; only glyph placement differs |
| `local('Arial')` on Android | Not present; Roboto is Android's system font (Chrome's font-fallback posts) | A second fallback family, `local('Roboto')` (Q4) |
| `:has()`, `inert`, `IntersectionObserver`, `prefers-contrast`, `forced-colors` | Widely available | Used freely |
| `requestIdleCallback` | Not in Safari | Not used |
| `interestfor` (hover-intent popovers) | Limited, experimental | The mega menu opens on click only (the spec allows hover-intent; it's left out) |

**Not verified, so a step checks it on the build:**
- the exact CSS Tailwind 4.3.3 writes for the `fx` custom variant (step 6)
- whether `next start` keeps a `Cache-Control` set in `headers()` for the force-static logo route, and what Vercel sends (steps 3 and 5)
- whether `notFound()` in the review page returns a 404 on a production build (`VERCEL_ENV=production`, built locally; step 6)
- whether `next/link` adds JavaScript to Home's first load (Home has no `Link` today; the 404 does) (step 9)
- Roboto's `local()` name on Android versions, and Roboto's width metrics (step 2, Q4)
- the first Chrome and Firefox versions that expose the popover's implicit `aria-expanded` (e2e checks the current Chromium)
- iOS `:active` for `touch-press`, and safe areas on iOS (the owner checklist)

## What the read found
Each point is handled in the Design.

1. **No page but the placeholder Home exists.** Every nav, mega-menu and footer target is `planned` in the registry. 04 §1.4 and engine §5.1 forbid links to unshipped pages. Engine §5.3 rule 5 wants every href from a typed route helper fed by the registry (P4 builds the full helper). → A, Q1.
2. **The header and the CTA handoff were never reviewed in the Design Lab.** 0009 lists them as "not yet reviewed … re-offered in Lab v2", and there has been no Lab v2. → A stop for the owner's review of the real shell (step 11).
3. **No spec places the theme switch.** 0015 and 05 §1 say "the header switch (P2)". header.md lists no theme switch; the mobile sheet and the footer list only Reduce effects. → Q2.
4. **The no-flash script needs an inline script** (the Next.js guide), but 06 §4 allows `dangerouslySetInnerHTML` only for JSON-LD. → proposed C40.
5. **footer.md puts a "statement headline" in the finale of every page.** 13 §2.6 allows one statement headline per page, and on Home it's the hero H1 (home.md). → proposed C41: the finale uses the display size.
6. **Two gradient CTAs in one view.** On mobile the header CTA handoff (header.md) and the sticky CTA bar (conversion-path.md) switch to the gradient at the same moment. At the end of any page the finale CTA and the charged header CTA would both show it. 05 §2 allows one per view. → proposed C42.
7. **The fallback font is wrong in two ways.** next/font builds one `local(Arial)` face at `size-adjust: 110.19%`, measured on weight 100, for every weight, so it's too narrow by about 3.4% at 400, 9% at 700 and 11% at 800 (0015). And Android has no Arial, so Android gets no size-matched fallback at all, on the budget phone the site is measured on. → D, Q4.
8. **`--dz-measure` is 65ch,** and `ch` changes with the font swap (0015). → rem (D).
9. **Glass.** 0015's finding sets the text tints (0.68, mist 0.79). The Lab prototype gives starting values for the rest (edge, highlight, saturation). `backdrop-filter: url()`, the `glass-liquid` refraction that 0009 kept as a Chromium-only extra, is broken in Safari, where a crash loop was reported this month, and `@supports` can't detect it (13 §4.1). → F: `glass-liquid` ships with the rim and the sheen, without the refraction.
10. **The mono font.** Eyebrows are JetBrains Mono (05 §3). Mono labels in the shell would make every page download it (21.8 KB), and in the lab every byte before LCP counts (0015 §7). → The shell uses no mono text in P2.
11. **Pages that skip the layout.** `global-not-found.tsx` bypasses it (0018), and `global-error.tsx` renders its own document without global styles. → B: one shared document component.
12. **The logo is served `max-age=0, must-revalidate`** (0018). → E.
13. **Icons.** AI Front Desk is drawn in the approved prototype (a 1.55 s story). The four pillar heads have no metaphor yet: the Icon Master Rules (§13) planned "4 stages", which C6 replaced with pillars. The shell also needs two new Tier 1 icons, chevron and external-link. Eye and gauge wait for P7. → K.
14. **Contact facts.** The social profiles are CONFIRMED (facts §2.1), but no official marks are in the repo. The phone and WhatsApp numbers are PENDING (expected around 2026-10-09). → The WhatsApp float and WhatsApp actions wait for the number (Out of scope); Q3 for the marks.
15. **header.md says Reduce effects gives the header "a solid surface, no blur";** 13 §2.11 says `glass-frost` instead of live blur. Both drop the live blur, and 13 ranks higher. → `glass-frost`, with a wording fix to header.md proposed at the end.

## Design

### A. What ships while no page is live (Q1 (a), the owner's answer)
1. **Live links only.** `src/lib/routes.ts` seeds the typed route helper with the registry rows the shell links to: `{ id, path, live }`.
   - A nav item renders only when its row is `live`. Today only R001 `/` (the placeholder Home) is.
   - Each page plan that ships a page flips its row's `live` flag in the same change, and the link appears in the header, the mega menu and the footer at once.
   - `tests/unit/routes.test.ts` checks that every path equals its registry row, and that `live` is true exactly when the page file exists.
   - P4 extends the file to every row.
2. **What a visitor sees in production after P2:**
   - the header with the logo (a link home) and **Book a free AI audit**. Until R002 `/free-ai-audit` ships, the CTA is an email link to `hello@deepzeta.ai` with the subject "Free AI audit" (facts §2)
   - on mobile, the menu button and the sheet: the display controls and the thumb-zone CTA
   - the footer finale (The Landing), the company block, the social links, the display controls and the legal line
   - "Services ▾", the columns and the rail stay hidden until their pages ship. Nothing links to a page that doesn't exist.
3. **The review page, `/shell-review`,** proves the rest:
   - It shows the complete header, mega menu, mobile sheet and footer from the same components, with every item shown and each link pointing at a fragment of the page itself. A banner says "Review build: links are placeholders".
   - It has a placeholder hero with a primary CTA, so the CTA handoff runs, enough sections to scroll, and an icon section (K).
   - It's built on local, CI and preview builds. On a production build (`VERCEL_ENV=production`) it returns 404 (`notFound()`).
   - It's never linked, so it's absent from the sitemap and `llms` files. Previews already send `noindex` (0013).
   - It has its own root layout (`src/app/(review)/`), because the root layout can't read the path without going dynamic (C30).
   - Registry row R165 (protected edit, P).
   - e2e and `lhci` test it; you click through it on every Vercel preview.

### B. The document shell
1. **`SiteDocument`** (`src/components/layout/SiteDocument.tsx`) renders `<html>`, `<head>` and `<body>` for both root layouts and the 404. It holds:
   - the fonts' classes, and `lang` and `dir` from the locale
   - `suppressHydrationWarning` on `<html>`, because the init script sets attributes before React hydrates
   - the init script (C) as the first thing in `<head>`
   - `IconDefs` once, the first thing in `<body>` (0018; 02 §3.8)
   - `SiteShell` (the skip link, the header, `<main id="main">`, the footer, the sticky CTA) and `FxRuntime` (G)
2. **`<main>` moves into the shell,** so every page has exactly one, and the skip link ("Skip to content") has a target. Pages render their content without their own `<main>`. `scroll-padding-block-start` keeps anchors clear of the sticky header.
3. **One `viewport` constant** (`src/lib/viewport.ts`), exported by both layouts and the 404: navy `themeColor` and `colorScheme: 'dark'`. Part C adds `viewportFit: 'cover'` with the sticky bar and its safe-area padding (verify on iOS, owner checklist).
4. **The 404** (`global-not-found.tsx`) gets the same document and shell, so a lost visitor has the menu and the CTA. Its home link gets a 44 px target (0015).
5. **The error page** (`global-error.tsx`, new): its own document (it can't use the layout), the site's CSS, the navy theme, the logo, a "Try again" button (`reset`), and the home link. Copy in `src/content/en/error.ts`.
6. **`appleWebApp.title`:** `siteConfig.brandName` in the English layout's `metadata` (0018, optional; one line).
7. **Headings** get `overflow-wrap: break-word` (a base style, WCAG 1.4.10).
8. **`data-theme`** goes only on non-focusable containers: the header, the footer and the sheet's panel (0015). An e2e test checks it.

### C. Preferences: theme and Reduce effects
1. **One state per preference,** on `<html>`:
   - `data-theme='light'`, or none (dark, the default: every first visit is dark, 05 §1)
   - `data-effects='reduced'`, or none
2. **The init script** (`src/lib/fx/init-script.ts`: a static string of about 0.5 KB, built from constants shared with the runtime, never from request data) runs before the first paint. It:
   - reads `localStorage` inside `try/catch`: `dz-theme` (`light` or `dark`) and `dz-effects` (`reduced` or `full`)
   - sets `data-theme='light'` and the `color-scheme` meta to `light` for visitors who chose light (0015); `theme-color` stays navy (0018)
   - sets `data-effects='reduced'` when the visitor chose it, or when they made no choice and a Chromium-only hint applies: Save-Data, `deviceMemory` ≤ 2, or `prefers-reduced-transparency: reduce` (13 §2.11). The threshold is confirmed on the budget phone (feasibility gate).
   - A unit test runs the string against fake `document`, `localStorage`, `navigator` and `matchMedia` objects.
3. **The CSS contract** (`src/styles/effects.css` and `icons.css`):
   - **Static is the default** for every effect.
   - Motion, live glass and pointer effects exist only inside one Tailwind custom variant, `fx`: `@media (prefers-reduced-motion: no-preference) and (prefers-contrast: no-preference) and (forced-colors: none)`, and `:root:not([data-effects='reduced'])`. Hidden start states live only there too (13 §3.3).
   - Pointer effects also need `(hover: hover) and (pointer: fine)` (13 §4.2).
   - The Chromium-only hints never appear in a CSS condition, because other browsers would read an unknown media feature as false and turn every effect off.
   - `icons.css` (0018): the Tier 2 stories move into `fx`, and its static rules also match `[data-effects='reduced']`.
4. **The switches** (`src/components/ui/Switch.tsx`: a `<button role="switch" aria-checked>` with a visible label; `touch-snap`):
   - **Reduce effects** shows *on* whenever any trigger is active.
     - A device setting that the visitor can't override here (reduced motion, more contrast, forced colours, reduced transparency): the switch is on and `aria-disabled`, with the note "Your device settings turn this on."
     - A low-end hint: the switch is on, and turning it off is stored as `full`.
   - **Light theme** (Q2).
   - Both live in `DisplayControls`, and **never in the header bar itself** (Q2, the owner's answer). They sit inside the menus and in the footer:
     - the mobile sheet (header.md)
     - on desktop, the mega menu's side rail (I3); this also matches 13 §2.11, "a Reduce effects switch in the header menu and the footer"
     - the footer, on every screen size (footer.md)
   - Every first visit stays dark (05 §1); light comes only from the switch.
   - The runtime keeps every copy of a switch in sync, and follows `matchMedia` changes.
5. **Privacy:** the two keys hold display preferences only, no personal data. P3's consent banner lists them as strictly necessary.
6. **CSP (P3):** the script is static, so P3 allows it by its SHA-256 hash, and every page stays static (recorded in 0019).

### D. Fonts: the fallback fix and the rem measure (Q4 (a), the owner's answer)
1. **Hand-written fallback faces per weight,** in `src/styles/font-fallbacks.css`, and `adjustFontFallback: false` on Montserrat, so next/font stops writing its single Arial face.
   - Two families, one per platform font: `dz-sans-fallback-arial` (`local('Arial')`, `local('Arial Bold')` for 700 and 800) and `dz-sans-fallback-roboto` (`local('Roboto')`, the Android system font).
   - One face per weight the site uses (400, 500, 700, 800), each with its own `size-adjust`. `ascent-override` and `descent-override` come from Montserrat's own metrics (next/font measured 87.85% and 22.78%); Safari ignores them, which is harmless because every line box has an explicit `line-height`.
   - `--dz-font-sans` becomes `var(--font-montserrat), 'dz-sans-fallback-arial', 'dz-sans-fallback-roboto', ui-sans-serif, system-ui, sans-serif`.
2. **Where the numbers come from:** `scripts/measure-font-fallback.mjs` (`npm run fonts:fallback`), run by hand like `brand:icons`.
   - It opens Playwright's Chromium and measures the same English sample text in Montserrat at each weight and in each fallback font at the matching weight. `size-adjust` is the width ratio.
   - It measures Montserrat's `0` advance at 400, and writes the rem that equals 65ch: the new `--dz-measure`, rounded to 0.25rem.
   - Arial is on this machine. **Roboto isn't:** the script measures Roboto files placed in `.scratch/` (weights 400, 500 and 700, or its one variable file). Q4: I download them from Google's own Roboto repository only after you approve the files, the source and the sizes. They're never committed.
   - Arial has no 500 or 800: the 500 face uses Arial's regular and the 800 face Arial Bold, each with its own `size-adjust`.
   - It prints the values; the committed CSS is the record.
3. **The e2e test** (`tests/e2e/fonts.spec.ts`):
   - It holds the Montserrat request back until the fallback has painted, then releases it.
   - It records `layout-shift` entries and compares the H1's and a body paragraph's line count and height before and after the swap.
   - Pass: the same line counts and a CLS under 0.01, at 360 and 1280 px, with the Arial family. The Roboto family can't be tested on this machine; the owner checklist covers Android.
4. **The mono** keeps next/font's default fallback: it isn't on any shell surface (finding 10). Noted in 0019.
5. **The type scale at 200% zoom** (0015): P2's only large type is the finale's display headline (C41). It keeps the approved slope, and 0019 records the gap (Chrome and Firefox reach 200%, Safari's 300% maximum doesn't). P5 decides for the statement headline.

### E. The logo: caching and the first paint
1. **A versioned URL:** `src/lib/brand.ts` adds `LOGO_VERSION`, the first 8 hex digits of the locked file's SHA-256 (`6431c297`), and `Logo` requests `/brand/deepzeta-logo.svg?v=6431c297`. `brand-assets.test.ts` checks the version against the file, so a logo change forces a new URL.
2. **`Cache-Control: public, max-age=31536000, immutable`** for `/brand/deepzeta-logo.svg` through `next.config.ts` `headers()`. If `next start` drops it for the static route (not verified), the route's own `Response` sets it instead. Checked with a request on `next start` (step 3) and on the Vercel preview (step 5).
3. **The first-paint trace** (0018): step 1 records Chromium traces of a cold Home load (5 runs, 4× CPU slowdown) with and without the logo request (blocked), and counts first-frame time and the image's decode and raster events. A scratch script in `.scratch/`, deleted afterwards. Step 9 repeats it with the shell's header.
   - **If the logo delays the first frame by more than 50 ms** (for example because its blur filter is drawn once per crop), work stops and you get the numbers and the options. Nothing is changed in the locked file either way.
   - The budget-phone measurement is in the owner checklist.

### F. Glass tokens and the contrast gate
1. **Tokens** in `tokens.css` (05 §4 names). The semantic ones get both themes, as `check:contrast` requires; P2's glass surfaces (the header, the menu, the sheet) are always dark.

   | Token | Dark | Light | Source |
   |---|---|---|---|
   | `--dz-glass-tint` (behind body and strong text) | navy-850 at the lowest alpha where frost and white text keep 4.5:1 over a white backdrop (≈ 0.68) | white at the lowest alpha where ink keeps 4.5:1 over navy | 0015 finding; the Lab's glass colours |
   | `--dz-glass-tint-muted` (panels with secondary text: the mega menu, the sheet) | the same, for mist text (≈ 0.79) | the same, for ink-muted | 0015 finding |
   | `--dz-glass-edge` | `rgba(201,212,255,.14)` | `rgba(22,34,74,.14)` | the Lab |
   | `--dz-glass-highlight` | `rgba(255,255,255,.10)` | `rgba(255,255,255,.9)` | the Lab |
   | `--dz-glass-blur` | 17px | 17px | 0009 |
   | `--dz-glass-saturate` / `-liquid` | 1.4 / 1.6 | the same | the Lab |
   | `--dz-grain` | `url('/brand/glass-grain.svg')` | the same | 13 §4.1 |

   The tint alphas are computed by the gate and rounded up to 0.01, so the table's ≈ values are what the gate confirms.
2. **The grain:** `public/brand/glass-grain.svg`, a small `feTurbulence` tile (planned ≤ 0.5 KB; cap 2 KB, 13 §7). A browser rasterises a background image once, so there's no per-frame cost. It loads only when a frost surface shows. Checked in Safari and Firefox by the owner checklist.
3. **`check:contrast`** adds the glass pairs: text and strong text on `--dz-glass-tint`, muted text on `--dz-glass-tint-muted`, each composited over the worst backdrop (white for dark glass, navy for light), in both themes. The "glass: P2" line leaves NOT_CHECKED.
4. **The ladder** (13 §4.1): `glass-live` (blur + saturation), falling back to `glass-frost` (tint + highlight edge + grain) under Reduce effects, and to `glass-tint` as a solid system surface in forced colours and more contrast (13 §6).

### G. Shared effect controllers (`src/lib/fx/`)
One Client Component, `FxRuntime`, mounted once in `SiteDocument`, starts them after hydration. They're plain modules with delegated listeners and no React state per event (13 §4.2).

| Module | Does | Cap (13 §7) |
|---|---|---|
| `observer.ts` | The one IntersectionObserver: adds `.is-in` once (Tier 3 stories, The Landing), and reports visibility for the CTA handoff and the header's scroll sentinel | ≤ 0.5 KB |
| `pointer.ts` | The pointer controller: fine pointers only, only while a target is in view, rAF-batched writes, rects cached, stops when the tab is hidden. P2 uses it for `pointer-magnet` and the `hover-charge` bead | ≤ 1.5 KB |
| `preferences.ts` | Reads, stores and applies theme and effects; syncs the switches; follows `matchMedia` | inside the 10 KB total |
| `header.ts` | The condense state, the pixel-hop marker, `aria-current` from the current path (`FxRuntime` reads `usePathname()`), the sheet's fallback for browsers without invoker commands, and the scroll lock while the sheet is open | inside the 10 KB total |
| `cta.ts` | The gradient hand-off (C42): the header CTA in part B, the finale and the sticky mobile bar in part C | inside the 10 KB total |

- **Budget:** about 5 KB compressed in total, planned; measured at each part's close, and `OWN_JS_HOME` in `lighthouserc.cjs` is raised to the measured size, never above 10 KB (07 §2).
- **INP:** handlers only toggle attributes or classes; layout is read once per hover or resize, never per pointer move.

### H. Header "Proof Bar" (header.md)
1. **Desktop (≥ 1024 px):** a sticky pill inset from the viewport edges, `glass-live`, `data-theme="dark"`.
   - **Order** from inline-start: logo · nav · CTA. The speed chip and AI View arrive in P7, in their places.
   - **Condense on scroll:** transform only, no height change. The shared observer watches a sentinel at the top of the page.
   - **Nav** (header.md's table): Services ▾, Automation, Studio, Deepzeta Sync, Work, Pricing, each only when live (A).
   - **The current page:** `aria-current="page"` plus the mini cluster marker; `hover-pixel-hop` moves it to the hovered or focused item, and its small pixels settle a beat later.
2. **Mobile (< 1024 px):** a compact bar: logo · CTA · menu button. The menu icon morphs into close.
3. **The CTA** (`src/components/ui/CtaButton.tsx`): primary (the action gradient, with the Lab's pixel and arrow) or outline. The hand-off rule (C42):
   - **The gradient is on at most one CTA at a time:** an in-page primary CTA (a hero CTA from P5, the finale CTA) while one is on screen; otherwise the header CTA on desktop, or the sticky bar on mobile.
   - On mobile the header CTA stays outline, because the sticky bar carries the gradient.
   - The switch is a cross-fade of the gradient layer (opacity), with no layout change.
4. **The logo** is always a link home, named `siteConfig.brandName`, with `aria-current="page"` on Home.
5. **The language switch placeholder** renders nothing while `locales` has one entry (globe icon, 11 §2).

### I. Mega menu (Services ▾)
1. **A popover:** the button has `popovertarget`, the panel `popover="auto"`. Esc and a click outside close it, and focus returns to the button (the platform's behaviour, checked by e2e). The platform exposes the expanded state; the markup never adds `aria-expanded` (ARIA in HTML). It opens on click only (the verified table). Never `role="menu"` (06 §3).
2. **Surface:** `glass-live` with `--dz-glass-tint-muted`, positioned below the pill from the header's own tokens (no anchor positioning). It opens with a short drop: transform and opacity through `@starting-style`, instant where unsupported.
3. **Content** (`src/content/en/navigation.ts`, one source for the menu and the footer):
   - **Four columns,** one per pillar in catalogue order, each in its pixel colour: a Tier 3 head icon (K), the pillar name, the catalogue's promise line, then items, then "All … services" to the pillar page.
   - **Items:** the pillar's lead 🔥 services in catalogue order (Websites and Software also list their ⭐ services, since they have one lead service or none), each with its Tier 2 icon where one exists and a one-line outcome. The other Tier 2 icons arrive with their service pages (P6).
   - **The Solutions row:** the six bundles (catalogue §5).
   - **The rail:** the `glass-liquid` "Try a live demo" card (once a demo ships, P7), Deepzeta Sync, Studio, About, Contact and Resources, then `DisplayControls` (Q2).
4. **The button hides** while no column has a live item. Until then, desktop visitors find the display controls in the footer.

### J. Mobile sheet
1. **A modal `<dialog>`,** full screen, `glass-live`, `data-theme="dark"` on its panel. The menu button opens it with `commandfor` and `command="show-modal"` (no JavaScript needed), and the runtime covers older browsers. The page behind is inert, focus is trapped, and Esc and the close button close it (lesson 4). The page doesn't scroll behind it (`:has(dialog[open])`, with `scrollbar-gutter: stable`).
2. **Content:** the live nav items at statement size with `type-word-stagger`; the pillar-colour bars (with the Services items once they ship); `DisplayControls`; the thumb zone with the CTA. WhatsApp joins it when the number arrives.
3. **The sticky CTA bar** hides while the sheet or any modal is open (conversion-path.md).

### K. Icons: Tier 3 and two Tier 1
1. **Tier 3 definitions** join `IconDefs` (Icon Master Rules §4.3, §5.3, §11):
   - the cluster's four gradients, each with its own logo vector (the §4.3 table)
   - the pillar depth gradients, the glass fill, and the sweep gradient (white 0 → 40% → 0, from `--dz-white` through classes)
   - one clip path per Tier 3 icon, so the sweep stays inside its shape and no ID repeats on a page
2. **`Cluster`** (`src/components/icons/Cluster.tsx`): the logo's four pixels, exactly as in §4.3 (sizes, offsets, radii, gradient vectors), upright, no outlines. It's used by Tier 3 icons, the nav marker (13 §8) and The Landing (C20, C25).
3. **Tier 3 in the registry and `Icon`:** 48 grid, stroke 1.75, sizes 64, 96, 128 and 160, ≤ 4 KB each. The story is ≤ 1.6 s (a new token, `--dz-dur-story-signature`, 05 §5): the depth layer settles, the glass fades in, the cluster assembles on 35° paths, the sweep crosses once. It plays once when the icon scrolls into view (the shared observer), replays on hover and focus, and is static under Reduce effects.
4. **The five Tier 3 icons:**

   | Icon | Pillar colour (depth layer) | The pixel is … | Source |
   |---|---|---|---|
   | AI Front Desk (5.1) | AI Automation. The prototype used the dropped "Win" stage's colour; like P1's Tier 2 icons, it moves to its pillar (C6) | the booking landing in the calendar | the approved prototype (Icon Master Rules §8.3) |
   | AI Automation (pillar head) | AI Automation | the job finished without anyone touching it: a request travels message → step → done | new, proposed |
   | Websites (pillar head) | Websites | the finished page, the result of hand-written code (after §8.3's Custom-Coded Website) | new, proposed |
   | Software (pillar head) | Software | the tool that fits how the team works: a panel of modules | new, proposed |
   | Growth & Ranking (pillar head) | Growth & Ranking | your business, chosen first: a list of results or an AI answer | new, proposed |

   None uses a banned metaphor (§8.2). The cluster always keeps the logo's four colours; only the depth layer carries the pillar (§4.3).
5. **Tier 1:** chevron (down, doesn't flip) and external-link (flips), drawn to §3, including the .25/.75 line centres (C39 covers only P1's 11 icons).
6. **Your review:** all seven are drawn on the review page's icon section at every allowed size, with their stories. **Work stops there for your verdict** (step 8).
7. **Tests:** `icons.test.ts` checks the Tier 3 rules (grid, stroke, sizes, cluster geometry equal to §4.3, the main pixel 5–6 units, radii 4 and 3, the budget); `icons.spec.ts` extends the clearance check to the cluster (0.75 units on the 24 grid is 1.5 on the 48 grid).

### L. Footer "The Landing" (footer.md)
1. **Always navy** (`data-theme="dark"`), in both themes.
2. **The finale:**
   - `scroll-journey-line` lands: a progress line on the inline-start edge, driven by a scroll timeline, whose pixel reaches the end as the page does. Without scroll-driven support, and under Reduce effects, it isn't drawn (the static final state is the landed pixel on the CTA).
   - Then The Landing: `scroll-assemble` of the cluster, once, when the finale enters.
   - The headline at the **display** size (C41), then **Book a free AI audit** (`hover-charge`, `pointer-magnet`, `touch-press`). WhatsApp joins as the secondary action when the number arrives.
3. **The body:**
   - **Link columns** in the four pixel colours (one per pillar), then Company, Resources and Legal. They come from `navigation.ts`, and only live links render (A); a column with no live link isn't shown.
   - **The company block:** `siteConfig.brandName`, the one-line address, and `hello@deepzeta.ai` (facts §2, all CONFIRMED). The phone is omitted while it's PENDING, never filled (footer.md).
   - **Social links:** the nine profiles from facts §2.1, copied exactly, in a new tab with `rel="noopener noreferrer"`, named "Deepzeta AI on LinkedIn" and so on (facts §2.1 rules). Each link shows the platform's official mark (Q3 (a)), downloaded at step 13 after you approve the list.
   - **Controls:** `DisplayControls`, and the language switch placeholder (hidden).
   - **The legal line:** "© 2026 Deepzeta Digital Solutions L.L.C." The year is the founding year (facts §1), written by hand, never computed at build (02 §1.5).
4. **No headings but the finale's `<h2>`:** column titles label their lists (`aria-labelledby`), so the footer doesn't add to each page's outline.
5. **No mono text** (finding 10). The footer's own links use `hover-underline`.

### M. Conversion path (conversion-path.md)
- **The sticky mobile CTA bar** (< 1024 px): the gradient CTA (C42), shown while no in-page primary CTA is on screen, hidden while the sheet or a modal is open, with safe-area padding. It slides in with a transform. Layer: `--dz-layer-sticky`.
- **The floating WhatsApp button** is out of scope until the number is CONFIRMED (facts §2 says it hides while `null`). The sticky bar leaves room for it at the inline-end, per the 360 px priority list.

### N. Copy (for your approval; the Content Writer writes the files from these)
| Where | Text | Source |
|---|---|---|
| Skip link | Skip to content | accessibility |
| Nav | Services · Automation · Studio · Deepzeta Sync · Work · Pricing (each once live) | header.md |
| CTA, everywhere | Book a free AI audit | header.md; facts §3 |
| CTA email subject (until R002 ships, Q1) | Free AI audit | new |
| Menu button / close | Menu / Close menu (accessible names) | new |
| Mega-menu columns | AI Automation · Websites · Software · Growth & Ranking, with the promises "Make the business run itself" · "Custom-coded, high-performance sites built to rank and convert" · "Custom tools that scale" · "Get found, get chosen" | the catalogue's pillar table |
| Mega-menu items | Exact catalogue names; one-line outcomes (≤ 8 words, no numbers) written from each service's catalogue entry; you approve them on the review page | the catalogue |
| Column link | All AI Automation services (and so on) | new |
| Solutions row | Solutions: AI Front Desk · Quote-to-Cash System · Get Found by AI · E-Commerce Growth Engine · Launch Pack · E-Invoicing Ready | catalogue §5; registry R090 |
| Rail | Deepzeta Sync · Studio · About · Contact · Resources; "Try a live demo" comes with P7's demos | header.md |
| Display controls (mobile sheet, desktop mega-menu rail, footer) | Reduce effects · Light theme; the note "Your device settings turn this on." | 13 §2.11; Q2 |
| Finale headline (draft) | Find out what to automate first. | catalogue 0.1 ("shows what to automate first") |
| Finale line (draft) | A free AI automation audit maps your sales, operations and admin, and shows which automations pay back first. | catalogue 0.1 (no numbers, so nothing needs the allowlist) |
| Footer column titles | AI Automation · Websites · Software · Growth & Ranking · Company · Resources · Legal | the catalogue; the registry |
| Company / Resources / Legal | About · Contact · Deepzeta Sync · Editorial policy / Resources · Glossary / Privacy · Terms (each once live) | registry R003, R005, R110, R008, R120, R121, R006, R007 |
| Company block | Deepzeta AI · Office #202, Al Hilal Bank Building, Al Qusais 2, Dubai, United Arab Emirates · hello@deepzeta.ai | facts §1–§2, from the site config |
| Social link names | Deepzeta AI on LinkedIn (Instagram, Facebook, YouTube, TikTok, X, Threads, Snapchat, Pinterest) | facts §2.1 |
| Legal line | © 2026 Deepzeta Digital Solutions L.L.C. | facts §1; 10 §2 |
| Error page | "Something went wrong" · "This page didn't load. Try again, or go to the home page." · Try again · Go to the Deepzeta AI home page | new; the 404's link |
| Review page | "Shell review" (title), a one-line description, the banner "Review build: links are placeholders", neutral section headings | internal, never in production |

Names and the address come from `siteConfig`, never typed into copy (10 §2). The site config gains the address, the social profiles, and `phone` and `whatsapp` as `null` (facts §2); `tests/unit/site-config.test.ts` checks every value against the facts file.

### O. Tests
- **Unit:** `routes.test.ts` (registry parity; `live` equals the page file existing), `site-config.test.ts` (values equal facts §1–§2.1), `init-script.test.ts` (every combination of stored choice, hint and theme), `icons.test.ts` (Tier 3, the new Tier 1), `brand-assets.test.ts` (`LOGO_VERSION`), `check-contrast.test.ts` (glass pairs), `global-error.test.ts` (the error page rendered to a string: its document, title, copy and home link; no route can make it appear in e2e).
- **e2e** (the production build), with one shared axe helper (`tests/e2e/helpers/axe.ts`; `foundation.spec.ts` and `themes.spec.ts` switch to it):
  - `fonts.spec.ts` (D3)
  - `preferences.spec.ts`: no flash for a stored light choice (the first paint is already light); the choice persists across a reload; each device setting turns Reduce effects on and disables the switch; a low-end hint can be overridden; the `color-scheme` meta follows light; the 404 honours both; **forced colours:** glass is solid, and the focus ring stays a 2 px solid outline; axe passes (0015)
  - `shell.spec.ts`, on `/` and `/shell-review` at **360, 390, 768 and 1280 px** (the exit gate) and 1024 and 1536 for layout:
    - the skip link is the first tab stop and lands on `main`
    - keyboard: the mega menu opens with Enter and Space, Tab walks it in order, Esc closes it and focus returns to the button; Chromium's accessibility tree shows the expanded state
    - the sheet traps focus, Esc and the close button close it, focus returns to the menu button, the page behind is inert
    - production shows no link to an unshipped page (every internal href resolves; `check:links` also)
    - the CTA hand-off: exactly one gradient CTA on screen at every scroll position, on desktop and mobile (C42)
    - the sticky bar hides while the sheet is open
    - no focusable element carries `data-theme`; touch targets ≥ 44 px; no horizontal scroll at 320 px
    - RTL (`dir="rtl"` injected): the order mirrors, the marker moves along the mirrored axis, the logo and the cluster never mirror
    - JavaScript off: the full content, the links and the footer render, and the mega menu still opens (popover)
    - the H1 stays the LCP element and doesn't move (the existing foundation test)
    - axe: no serious or critical violations in every state (menu open, sheet open, light, reduced)
  - `icons.spec.ts`: Tier 3 stories play once on scroll-in and are static under Reduce effects; the cluster's clearance; axe
  - `brand.spec.ts`: the logo in the shell's header; its cache header; the 404's head
- **`lhci`:** Home and, from part B, `/shell-review`, 5 runs each, T1 assertions on both; the page-weight check covers both.

### P. Protected edits this plan asks you to approve (00 §5)
**Before building (step 0):**
- `docs/ai/conflict-register.md`, appended:
  - **C40** · 06 §4 allows `dangerouslySetInnerHTML` only for JSON-LD. The no-flash preferences script (0015) must run before the first paint, which needs an inline script (the Next.js 16.3.7 guide). · **Resolution:** one more named exception: the static string in `src/lib/fx/init-script.ts`, built only from our own constants (never request or visitor data), mounted once per document by `SiteDocument`. P3 allows it by hash.
  - **C41** · footer.md puts a "statement headline" in every page's finale; 13 §2.6 allows one statement per page, and Home's is the hero H1. · **Resolution:** the finale headline uses `--dz-text-display`; the statement size stays for each page's one statement.
  - **C42** · header.md switches the header CTA to the action gradient when the hero CTA leaves; conversion-path.md shows the gradient sticky bar at the same moment; the finale CTA is gradient too. 05 §2 allows one gradient CTA per view. · **Resolution:** the gradient is on at most one CTA at a time: an in-page primary CTA while one is on screen; otherwise the header CTA on desktop, or the sticky bar on mobile, where the header CTA stays outline.
- `docs/seo/url-registry.md` §3.8, appended (Q1 (a)): **R165** · `/shell-review` · Utility · noindex · "The complete shell for review and tests. Local, CI and preview builds only; 404 in production. Never linked, never in the sitemap or `llms` files." And a change-log row.

**At the end (step 16):**
- [05](../ai/05-design-system.md): §1 (the theme switch lives in the mobile sheet, the desktop mega-menu rail and the footer, never in the header bar; Q2), §3 (the fallback faces make "size-matched" true; `--dz-measure` in rem), §4 (the glass token values), §5 (`--dz-dur-story-signature` and the other new motion tokens), §6 (Tier 3 delivery; `IconDefs` mounted; `Cluster`).
- [06](../ai/06-code-standards.md) §4: the C40 exception.
- [03](../ai/03-verification-gates.md) §1: `check:contrast` checks glass; `lhci` covers the review page.
- [13](../ai/13-experience-design.md) §7: the caps confirmed or corrected by the feasibility gate, with the measured sizes.
- `docs/design/header.md` (the display controls in the mobile sheet and the mega-menu rail, never in the bar, Q2; "Reduce effects on: `glass-frost`, no live blur"; the C42 hand-off), `footer.md` (the display headline, C41; the theme switch beside Reduce effects, Q2), `conversion-path.md` (C42), and the `docs/design/README.md` change log.
- `.claude/skills/new-icon/SKILL.md`: the Tier 3 recipe (48 grid, `Cluster`, the definitions, the signature timeline).
- `CLAUDE.md`, "Current state": P2 done, next P3.
- Not protected, listed for completeness: `docs/decisions/0019-layout-shell.md` and its index row.

## Out of scope
- **P7:** the speed chip, the Page Nutrition Label, AI View, and "See how AI reads this page" in the footer; the "Try a live demo" card's content. Their places in the header and footer are left for P7's plan.
- **P3:** `trackEvent()` calls on the CTAs and links (the events already exist in 09 §3, so P3 only wires them), the consent banner, and enforcing the CSP.
- **The floating WhatsApp button and every WhatsApp action,** until the number is CONFIRMED (facts §2): a small plan then, with the official WhatsApp mark.
- The phone in the footer, until CONFIRMED.
- New Tier 2 icons for the other services (each with its service page, P6); the other five bundles' Tier 3 icons (with their first surface); eye and gauge (P7).
- `type-outline-fill` on the finale headline (footer.md says "optionally"; not added).
- Hover-intent opening of the mega menu (allowed, not required; the platform support is limited).
- The `glass-liquid` refraction (finding 9).
- Any page (Home stays the placeholder until P5); the Arabic switch's behaviour (P11).
- The mono font's fallback (D4); the statement size's zoom slope (P5, D5).
- The Tier 2 pixel gradient's slight diagonal (0018: it can't be seen at icon sizes).
- Any edit, reformatting or optimisation of the locked logo.

## Allowed files

A file listed in an earlier part may be modified again in a later part only where that part's table lists it.

**Part A · `feat/p2a-shell-foundations`**

| Path | Action | Purpose |
|---|---|---|
| `docs/plans/2026-09-30-p2-layout-shell.md` | CREATE | This plan (and its Progress notes in every part) |
| `docs/ai/conflict-register.md` | APPEND-ONLY (protected) | C40–C42, before any part builds (P) |
| `docs/seo/url-registry.md` | APPEND-ONLY (protected) | R165 and a change-log row (Q1 (a), P) |
| `src/app/(en)/layout.tsx` | MODIFY | `SiteDocument`; the shared viewport; `appleWebApp.title` (B) |
| `src/app/global-not-found.tsx` | MODIFY | `SiteDocument`; the 44 px home link (B4) |
| `src/app/global-error.tsx` | CREATE | The branded error page (B5) |
| `src/components/layout/SiteDocument.tsx` | CREATE | The shared document (B1) |
| `src/lib/viewport.ts` | CREATE | The one `viewport` constant (B3) |
| `src/lib/brand.ts` | MODIFY | `LOGO_VERSION` and the versioned URL (E1) |
| `src/components/ui/Logo.tsx` | MODIFY | Requests the versioned URL (E1) |
| `next.config.ts` | MODIFY | The logo's `Cache-Control` (E2) |
| `src/app/brand/deepzeta-logo.svg/route.ts` | MODIFY | Only if `next start` drops the config header (E2) |
| `src/styles/tokens.css` | MODIFY | The font stack; `--dz-measure` in rem (D) |
| `src/styles/globals.css` | MODIFY | Imports `font-fallbacks.css`; heading wrap (B7) |
| `src/styles/fonts.ts` | MODIFY | `adjustFontFallback: false` on Montserrat (D1) |
| `src/styles/font-fallbacks.css` | CREATE | The per-weight fallback faces (D1) |
| `src/content/en/error.ts` | CREATE | The error page's copy (B5, N) |
| `scripts/measure-font-fallback.mjs` | CREATE | The fallback and measure numbers (D2) |
| `package.json` | MODIFY | The `fonts:fallback` script only; no dependency changes |
| `lighthouserc.cjs` | MODIFY | `OWN_JS_HOME`, only if the custom error page adds first-load JavaScript (measured) |
| `tests/unit/brand-assets.test.ts` | MODIFY | `LOGO_VERSION` (O) |
| `tests/unit/global-error.test.ts` | CREATE | The error page's markup, rendered to a string (O) |
| `tests/e2e/helpers/axe.ts` | CREATE | The shared axe helper (O) |
| `tests/e2e/foundation.spec.ts` | MODIFY | Uses the shared helper |
| `tests/e2e/themes.spec.ts` | MODIFY | Uses the shared helper |
| `tests/e2e/brand.spec.ts` | MODIFY | The versioned logo URL and its cache header (O) |
| `tests/e2e/fonts.spec.ts` | CREATE | The delayed-font test (D3) |

**Part B · `feat/p2b-header`**

| Path | Action | Purpose |
|---|---|---|
| `src/app/(en)/layout.tsx` | MODIFY | The shell and the live nav (A, B1) |
| `src/app/(en)/page.tsx` | MODIFY | The P1 placeholder header goes; `<main>` moves to the shell (B2) |
| `src/app/global-not-found.tsx` | MODIFY | The shell (B4) |
| `src/app/(review)/layout.tsx` | CREATE | The review page's root layout (A3) |
| `src/app/(review)/shell-review/page.tsx` | CREATE | The review page (A3) |
| `src/components/layout/SiteDocument.tsx` | MODIFY | The init script, `IconDefs`, `FxRuntime` (B1) |
| `src/components/layout/SiteShell.tsx` | CREATE | The skip link, the header, `main` (B1, B2) |
| `src/components/layout/SiteHeader.tsx` | CREATE | The pill and the compact bar (H) |
| `src/components/layout/MegaMenu.tsx` | CREATE | (I) |
| `src/components/layout/MobileSheet.tsx` | CREATE | (J) |
| `src/components/layout/DisplayControls.tsx` | CREATE | Reduce effects and the theme switch (C4) |
| `src/components/layout/LanguageSwitch.tsx` | CREATE | The hidden placeholder (H5) |
| `src/components/layout/FxRuntime.tsx` | CREATE | The one client island that starts `src/lib/fx/` (G) |
| `src/components/ui/Switch.tsx` | CREATE | The `role="switch"` button (C4) |
| `src/components/ui/CtaButton.tsx` | CREATE | The primary and outline CTA (H3) |
| `src/components/icons/Cluster.tsx` | CREATE | (K2) |
| `src/components/icons/registry.ts` | MODIFY | The Tier 3 type and five icons; chevron and external-link (K) |
| `src/components/icons/Icon.tsx` | MODIFY | Tier 3 rendering and sizes (K3) |
| `src/components/icons/IconDefs.tsx` | MODIFY | The Tier 3 definitions (K1) |
| `src/lib/fx/init-script.ts` | CREATE | The no-flash script (C2) |
| `src/lib/fx/preferences.ts` | CREATE | (G) |
| `src/lib/fx/observer.ts` | CREATE | (G) |
| `src/lib/fx/pointer.ts` | CREATE | (G) |
| `src/lib/fx/header.ts` | CREATE | (G) |
| `src/lib/fx/cta.ts` | CREATE | The header CTA's hand-off (G, C42) |
| `src/lib/routes.ts` | CREATE | The typed route seed with `live` flags (A1) |
| `src/styles/tokens.css` | MODIFY | Glass tokens; motion tokens (F, K3) |
| `src/styles/globals.css` | MODIFY | The `fx` variant; imports `effects.css`; scroll padding (B2, C3) |
| `src/styles/effects.css` | CREATE | The glass ladder and every effect's CSS, static by default (C3, F4) |
| `src/styles/icons.css` | MODIFY | The Reduce effects selector; stories inside `fx`; Tier 3 (C3, K) |
| `public/brand/glass-grain.svg` | CREATE | The frost grain (F2) |
| `scripts/check-contrast.mjs` | MODIFY | Glass pairs (F3) |
| `src/content/en/navigation.ts` | CREATE | Nav, mega-menu and footer links with registry IDs (I3) |
| `src/content/en/shell.ts` | CREATE | Skip link, CTA, menu labels, switches (N) |
| `src/content/en/shell-review.ts` | CREATE | The review page's copy (N) |
| `lighthouserc.cjs` | MODIFY | `OWN_JS_HOME` measured; the review page's URL |
| `tests/unit/init-script.test.ts` | CREATE | (O) |
| `tests/unit/routes.test.ts` | CREATE | (O) |
| `tests/unit/icons.test.ts` | MODIFY | Tier 3; the new Tier 1 (K7) |
| `tests/unit/check-contrast.test.ts` | MODIFY | Glass pairs (O) |
| `tests/e2e/foundation.spec.ts` | MODIFY | `main` comes from the shell |
| `tests/e2e/brand.spec.ts` | MODIFY | The logo in the shell's header |
| `tests/e2e/icon-gallery.tsx` | MODIFY | Tier 3 and the new Tier 1 |
| `tests/e2e/icons.spec.ts` | MODIFY | (K7) |
| `tests/e2e/preferences.spec.ts` | CREATE | (O) |
| `tests/e2e/shell.spec.ts` | CREATE | (O) |

**Part C · `feat/p2c-footer`**

| Path | Action | Purpose |
|---|---|---|
| `src/components/layout/SiteFooter.tsx` | CREATE | (L) |
| `src/components/layout/JourneyLine.tsx` | CREATE | `scroll-journey-line` (L2) |
| `src/components/layout/StickyCta.tsx` | CREATE | (M) |
| `src/components/layout/SiteShell.tsx` | MODIFY | Adds the footer and the sticky bar |
| `src/lib/fx/cta.ts` | MODIFY | The finale and the sticky bar join the hand-off (C42) |
| `src/lib/fx/header.ts` | MODIFY | Only if the sheet's state must reach the sticky bar through it |
| `src/components/layout/FxRuntime.tsx` | MODIFY | Only if the sticky bar needs its own start call |
| `src/lib/viewport.ts` | MODIFY | `viewportFit: 'cover'`, with the sticky bar's safe-area padding (B3) |
| `src/lib/site-config.ts` | MODIFY | The address, the social profiles, `phone` and `whatsapp` as `null` (N) |
| `src/content/en/navigation.ts` | MODIFY | The footer's Company, Resources and Legal columns |
| `src/content/en/shell.ts` | MODIFY | The finale, the company block's labels, the legal line (N) |
| `src/styles/effects.css` | MODIFY | The journey line, The Landing, the sticky bar |
| `src/styles/tokens.css` | MODIFY | Only if a footer effect needs a new token |
| `public/brand/social/*.svg` | CREATE | The nine official marks (Q3 (a)), each approved with its source before download |
| `lighthouserc.cjs` | MODIFY | `OWN_JS_HOME` measured |
| `tests/unit/site-config.test.ts` | CREATE | (O) |
| `tests/e2e/shell.spec.ts` | MODIFY | The footer, the sticky bar, the full hand-off |
| `tests/e2e/preferences.spec.ts` | MODIFY | The footer's switches |
| `docs/ai/05-design-system.md` | MODIFY (protected) | End-of-phase edits (P) |
| `docs/ai/06-code-standards.md` | MODIFY (protected) | The C40 exception (P) |
| `docs/ai/03-verification-gates.md` | MODIFY (protected) | (P) |
| `docs/ai/13-experience-design.md` | MODIFY (protected) | §7, the confirmed caps (P) |
| `docs/design/header.md` | MODIFY (protected) | (P) |
| `docs/design/footer.md` | MODIFY (protected) | (P) |
| `docs/design/conversion-path.md` | MODIFY (protected) | (P) |
| `docs/design/README.md` | MODIFY (protected) | The change log (P) |
| `.claude/skills/new-icon/SKILL.md` | MODIFY (protected) | The Tier 3 recipe (P) |
| `CLAUDE.md` | MODIFY (protected) | "Current state" (P) |
| `docs/decisions/0019-layout-shell.md` | CREATE | The record: measurements, caps, your verdicts |
| `docs/decisions/README.md` | APPEND-ONLY | Its index row |

Temporary scripts (the first-paint trace) live in `.scratch/` and are deleted before each part ends (02 §4).

## Steps

**Part A · Foundations**
0. Once approved: set `Status: APPROVED (owner, date)`, create `feat/p2a-shell-foundations`, commit the plan, and make the step-0 protected edits (P). → `check:effects` + `check:rules`
1. **Baseline** on the branch head: `npm run verify`. Record Home's `lhci` figures (median LCP and FCP, bytes by type) and the first-paint trace (E3). → `verify`
2. **Fonts:** Q4's download (your OK first, at this step), the measurement script, the fallback faces, `--dz-measure` in rem, `fonts.spec.ts`. → `verify:fast` + `build` + `test:e2e`
3. **The logo's caching:** `LOGO_VERSION`, the header, the tests. Check the header with a request on `next start`. → `verify:fast` + `test` + `build`
4. **The document:** `SiteDocument`, the viewport constant, the 404's link, the error page and its test, `appleWebApp.title`, the heading wrap, the shared axe helper. → `verify:fast` + `test` + `build` + `test:e2e`
5. **Part A close:** full `verify`; `lhci` against step 1; the logo's header on the Vercel preview; reviewer and performance/accessibility audit, with findings fixed within the allowed files; the report. **Merge on your "merge".** → `verify`

**Part B · Header**
6. **Preferences and the CSS contract:** the init script (C40) and its test, `preferences.ts`, `FxRuntime`, the `fx` variant (read the compiled CSS), `effects.css`, `icons.css`, the glass tokens, the grain and the contrast gate, `observer.ts`, `pointer.ts`. The review page and its layout, with one build at `VERCEL_ENV=production` to check that `/shell-review` returns 404. `preferences.spec.ts` (states set through `localStorage` until the switches exist). → `verify:fast` + `test` + `build` + `test:e2e`
7. **Routes and content:** `routes.ts`, `navigation.ts`, `shell.ts`, and the mega-menu outcomes (Content Writer, from the catalogue). → `verify:fast` + `test`
8. **Icons:** the Tier 3 definitions, `Cluster`, and the five Tier 3 and two Tier 1 drawings on the review page. **Stop for your verdict on the drawings.** Then the registry tests, the gallery and `icons.spec.ts`. → `verify:fast` + `test` + `build`
9. **The desktop header:** `SiteShell` (the skip link; `main` moves), `SiteHeader`, `CtaButton`, `header.ts`, `cta.ts` with the review page's hero CTA, `IconDefs` mounted, the 404 with the shell. Repeat the first-paint trace (E3), and measure `next/link`'s JavaScript on Home. → `verify:fast` + `build`
10. **The mega menu and the mobile sheet,** with `Switch`, `DisplayControls` and the language placeholder. → `verify:fast` + `build`
11. **Stop for your review of the shell** on the Vercel preview's `/shell-review`: the pill, the condense, the marker, the CTA hand-off, the menu, the sheet and the glass, at 360, 390, 768 and 1280 px, in both themes and with Reduce effects. Changes you ask for are made within the allowed files.
12. **Part B close:** `shell.spec.ts`; `lhci` on Home and the review page; `OWN_JS_HOME` set to the measured size; full `verify`; reviewer and performance/accessibility audit; the report. **Merge on your "merge".** → `verify`

**Part C · Footer, conversion path, phase exit**
13. **The social marks (Q3 (a)):** I list each file (platform, official source page, file, size) and download only after your OK. → `verify:fast`
14. **The footer and the conversion path:** `SiteFooter`, `JourneyLine`, `StickyCta`, `cta.ts` (the finale and the sticky bar), the site config and its test, the footer columns, the copy. → `verify:fast` + `test` + `build` + `test:e2e`
15. **The effects feasibility gate:** `lhci` on Home and the review page with every T1 effect on (≥ 95, every hard limit, each 13 §7 cap measured), then the owner checklist on the budget Android phone. If a cap or the floor fails, work stops with the numbers and the options. → `lhci`
16. **Phase exit:** full `verify`; reviewer, performance/accessibility and SEO/GEO audits (the footer's NAP, links and social URLs); the end-of-phase protected edits (P); decision 0019; the report (02 §5). **Merge on your "merge"**, push, and check the Vercel deployment. → `check:rules` + `verify`

## Effect register
| Section | Effect ID | Cost → mitigation | Byte cap (13 §7) | Verify items |
|---|---|---|---|---|
| Header pill (every page) | `glass-live` | GPU work while content scrolls behind the pill → one live surface in the header; `glass-frost` under Reduce effects and low-end hints; solid in forced colours | none (CSS) | `-webkit-backdrop-filter` in the built CSS |
| Mega menu panel; mobile sheet | `glass-live` | They cover the page while open, and only one is open at a time → the same fallbacks | none (CSS) | popover and dialog transitions (`@starting-style`) |
| Every glass surface under Reduce effects | `glass-frost` | ~0: a tint, an edge and one cached grain tile, loaded only when shown | grain ≤ 2 KB (planned ≤ 0.5 KB) | the SVG grain in Safari and Firefox (owner checklist) |
| Glass in forced colours and more contrast | `glass-tint` | 0 | — | — |
| Mega-menu demo card (review page until P7) | `glass-liquid` | The one per view; desktop fine pointer only; the sheen crosses once on hover; no refraction (finding 9) | none (CSS) | — |
| Nav items | `hover-pixel-hop` | One transform transition on the marker; offsets read once per hover, focus or resize → in `header.ts` | inside the 10 KB Home total | — |
| Header CTA while another primary CTA is on screen | `hover-outline` | CSS only | — | — |
| The gradient CTA (header on desktop, sticky bar, finale) | `hover-charge` | Gradient layers and one sheen, transform and opacity; the bead follows the shared pointer controller | pointer ≤ 1.5 KB (shared) | — |
| The same | `pointer-magnet` | The pointer controller: fine pointers, in view only, rAF-batched, cached rects, stops on a hidden tab; drift ≤ `--dz-magnet-max` | ≤ 1.5 KB (shared) | — |
| CTAs and the menu button | `touch-press` | CSS `:active` scale | — | iOS `:active` (owner checklist) |
| Mega-menu items (review page until P6) | `hover-glow` | P1's Tier 2 stories, CSS only | ≤ 1 KB per icon | — |
| Mega-menu column heads (Tier 3) | `scroll-assemble` | The Tier 3 story ≤ 1.6 s, once in view (shared observer), replay on hover and focus; static under Reduce effects | ≤ 4 KB per icon; observer ≤ 0.5 KB | — |
| Mobile sheet items | `type-word-stagger` | CSS delays on whole items (no word is split), ≤ 12 words, ≤ 600 ms, once per open | none (CSS) | screen readers read each link once (no split within an accessible name) |
| Display switches | `touch-snap` | A short transition with `--dz-ease-pop` | — | — |
| Footer links; mega-menu rail links | `hover-underline` | CSS `scaleX` from inline-start | — | — |
| Page edge (sitewide chrome) | `scroll-journey-line` | Native scroll timeline, compositor only, inside `@supports`; not drawn without support or under Reduce effects | 0 JS | scroll-driven support (Chrome, Safari 26; not Firefox) |
| Footer finale, The Landing | `scroll-assemble` | The four pixels fly in on 35° paths once when the finale enters (shared observer); the assembled cluster otherwise | observer ≤ 0.5 KB (shared) | — |

**Per viewport** (13 §2.3): the header and the journey line are chrome and don't count. The open mega menu's signature is the `glass-liquid` card; the finale's is The Landing.

## State changes (no effect ID; 13 §3 rules apply)
| Change | How | Reduce effects |
|---|---|---|
| Header condense | Transform on the pill's layers; a sentinel through the shared observer | Instant |
| Mega menu open and close (the Drop vocabulary) | Transform and opacity with `@starting-style` | Instant |
| Sheet open and close | The same | Instant |
| Menu icon → close | Tier 1 state change, ≤ 200 ms (Icon Master Rules §7.1) | Instant |
| CTA outline ↔ gradient | Opacity of the gradient layer | Instant |
| Sticky bar in and out | Transform | Instant |

## Behaviour matrix (13 §6, for this plan's effects)
| Situation | The shell |
|---|---|
| Desktop, fine pointer | Everything in the register |
| Touch | No `pointer-magnet` or bead; `hover-charge` shows its sheen on tap; stories play on focus and tap; `touch-press` |
| Low-end hint or Save-Data | Reduce effects on (the visitor may turn it off): `glass-frost`, static states |
| Reduced motion, more contrast, Reduce effects | Static final states; `glass-frost`; the journey line not drawn; the cluster assembled; stories static |
| No JavaScript | The header, the footer and every live link; the mega menu opens (popover); the sheet opens where invoker commands exist (the footer links cover the rest); the default theme; one-shot effects in their final state |
| Forced colours | Glass becomes solid system surfaces; gradients drop (the CTA's gradient too); focus rings stay 2 px solid |
| RTL | Logical properties; the marker travels the mirrored axis; the journey line on the right; the logo, the pixel and the cluster never mirror; chevron doesn't flip, external-link does |
| Light theme | The header, the sheet and the footer stay navy; page content is light |

## Dependencies to add
None. Measuring uses Playwright's Chromium (a devDependency). Roboto (Q4) is a measurement input in `.scratch/`, never committed or shipped.

## Risks & mitigations
- **The shell slows Home's lab LCP.** More HTML, CSS and JavaScript before the H1 paints, and every byte counts in the lab (0015 §7). → Measured at each part's close against step 1. **If median LCP grows by more than 100 ms, the H1 stops being the LCP element, or HTML + CSS + JS passes 190,868 B (148,912 B today), work stops** with the numbers and options.
- **`next/link` adds framework JavaScript to Home** (unverified). → Measured at step 9. If it passes the 5 KB growth guard, work stops: plain `<a>` for the few shell links, or a baseline decision.
- **`glass-live` on a sticky header costs GPU on the budget phone.** → The feasibility gate measures it; the `deviceMemory` threshold is confirmed or changed there; `glass-frost` is always the fallback.
- **The fallback faces can't be tested on Android here.** → The owner checklist loads a page on the phone with the network throttled and looks for re-wrapped lines.
- **The review page reaches production.** → `notFound()` on production builds, checked at step 6 with `VERCEL_ENV=production`; the registry row says so; nothing links to it.
- **The popover's implicit expanded state may differ in older browsers.** → The e2e test reads Chromium's accessibility tree; the spec's versions are recorded as not verified.
- **Drift into P3 and P7** (tracking, the chip, AI View). → Out of scope; their places are left free, not pre-built.
- **`viewportFit: 'cover'` (part C) lets content reach under an iPhone's notch in landscape.** → The shell pads its fixed and sticky edges with the safe-area insets; the owner checklist checks it on an iPhone. If it can't be verified, the setting is dropped and the sticky bar keeps a fixed bottom margin instead.
- **Scope:** P2 is large. → Three parts, each verified, reviewed and merged on its own (Q5).

## Gates (03 §2)
- After each code step: `verify:fast`.
- Components with logic: `test` + `build`.
- Page and layout changes (every page gets the shell): `build` + `check:schema` + `check:seo` + `check:links` + `test:e2e` + `lhci`. `check:content` doesn't exist until P4: **NOT RUN**, with that reason.
- Each part's close and the phase exit: the full `verify`, and the owner's review.
- Rule edits: `check:rules`.

## Owner checklist (the feasibility gate and what can't be automated here, 03 §4)
On the part C Vercel preview, on the budget Android phone (Chrome, 4G) and, if you have one, an iPhone (Safari):
1. PageSpeed Insights (mobile) for `/` and `/shell-review`: the scores and LCP, INP, CLS.
2. On the phone: open the menu, scroll to the footer, switch Reduce effects and Light theme; note any stutter while scrolling under the glass header.
3. On the phone with Chrome's network throttled (or a slow connection): reload `/` and watch whether lines re-wrap when the font arrives.
4. On the iPhone: the CTA's press feedback, the sticky bar clear of the home indicator, the grain on a frost surface (turn Reduce effects on).
5. Tell me the phone model and its memory, so 0019 records the device class and the `deviceMemory` threshold.

## Open questions
**Q1 · What the shell shows while no page is live.**
- **(a) Live links only, plus a review page (recommended).** Production shows the logo, the CTA (an email to hello@deepzeta.ai until `/free-ai-audit` ships), the mobile sheet with the display controls, and the footer's finale, company block, social links and legal line. Every other link appears by itself when its page ships (one `live` flag). `/shell-review`, never linked and 404 in production, shows the complete shell with placeholder links, so you can click through it on each preview, and the tests and `lhci` measure it. Needs registry row R165.
- **(b) Build the nav later.** P2 builds the foundations, the CTA, the display controls and the footer's company block. The header nav, the mega menu and the footer columns are built with the first pages in P6. Less now, but the menu's design and cost are proven only under P6's page work, and P2's exit gate measures part of the shell.

**Q2 · Where the theme switch goes.** No spec places it (finding 3).
- **(a) Next to Reduce effects, in the mobile sheet and the footer (recommended).** One "display" group in two places; the header pill stays as header.md orders it; no new icons.
- **(b) Also in the desktop header pill,** as an icon button: two new Tier 1 icons (sun and moon) and one more item in the pill.

**Q3 · The social links' marks.** The spec asks for official monochrome marks (never redrawn); none is in the repo.
- **(a) I download each platform's official mark from its own brand-resources page at step 13 (recommended),** after you approve the list: platform, source page, file and size. They're shown unmodified (white on the navy footer).
- **(b) You supply the nine files,** and I use them as they are.
- **(c) Text links for now** ("LinkedIn", and so on), marks in a later plan.

**Q4 · The fallback-font fix** (0015 left the method open).
- **(a) Per-weight fallback faces for Arial and Roboto, measured in Chromium (recommended).** It fixes every weight the site uses, and Android, which today gets no size-matched fallback at all. It needs one download at step 2: Roboto's 400, 500 and 700 files (or its variable file) from Google's own Roboto repository, into `.scratch/`, for measuring only, never committed. I'll state the exact files, source and sizes then and wait for your OK.
- **(b) The same, Arial only.** No download; Android keeps the unadjusted system font.
- **(c) A re-instanced Montserrat file whose default is weight 400.** It needs Python's fontTools (not installed) and changes the font file (0015's hash); it fixes weight 400 only, so headings would still shift, and Android is still uncovered.

**Q5 · One merge or three.**
- **(a) Three parts, each merged on your "merge" (recommended):** foundations, header, footer. Smaller reviews; the font fix and the logo cache reach production first.
- **(b) One branch, one merge at the end,** with the same stops.

**The owner's answers (2026-09-30):**
- **Q1: (a).** Live links only, plus the review page `/shell-review` (registry row R165). Until `/free-ai-audit` ships, the CTA emails hello@deepzeta.ai.
- **Q2: (a), with a placement note:** "the switch inside the mobile menu and in desktop also; never display on the first place". Read as: the theme switch and Reduce effects are never shown in the header bar itself. They live inside the mobile sheet, inside the desktop mega menu's rail, and in the footer (C4, I3). Every first visit stays dark.
- **Q3: (a).** I download each platform's official mark at step 13, after you approve the list (platform, source page, file, size).
- **Q4: (a).** Per-weight fallback faces for Arial and Roboto. The Roboto files for measuring are downloaded to `.scratch/` at step 2, after you approve the exact files, source and sizes.
- **Q5: (a).** Three parts, each merged on your "merge".
