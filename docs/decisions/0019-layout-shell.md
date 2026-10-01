# 0019 · Layout shell (P2): the header, mega menu, mobile sheet, footer, conversion path and effect controllers; the effects feasibility gate

Status: ACCEPTED (owner: the P2 plan with its protected edits, 2026-09-30, Q1–Q5 (a); the verdicts at steps 8, 11, 13, 14 and 15 recorded in the plan; parts A and B merged on the owner's "merge"; part C merges the same way)

## Context

[The P2 plan](../plans/2026-09-30-p2-layout-shell.md) builds the layout shell from [04](../ai/04-build-sequence.md) §2 in three parts, each merged on its own (Q5): A, foundations (`34a7f59`); B, the header (`55d1086`); C, the footer, the conversion path and the phase exit. Its Progress block records every step, measurement, owner answer and deviation; this record keeps what later phases need.

## Decision

### 1. What ships while no page is live (Q1 (a))
- **Live links only.** `src/lib/routes.ts` seeds the typed route helper with the 43 registry rows the shell links to. A nav, mega-menu or footer item renders only when its row is `live`; today only R001 (`/`) is. Each page plan flips its row, and the link appears everywhere at once. `routes.test.ts` checks every path against the registry and `live` against the page files.
- **Production today:** the header (the logo and "Book a free AI audit"), the mobile sheet with the display controls and the CTA, the footer's finale, company block, social tiles, display controls and legal line, the sticky CTA bar on mobile. Until R002 `/free-ai-audit` ships, the CTA emails hello@deepzeta.ai with the subject "Free AI audit".
- **The review page** `/shell-review` (R165) shows the complete shell with fragment links, for the owner's reviews, e2e and lhci. It returns 404 on production builds, is never linked, and has its own root layout.

### 2. The document and the display preferences
- **`SiteDocument`** renders `<html>` and `<body>` for both root layouts and the 404, with the fonts, `lang` and `dir`, one shared `viewport`, `IconDefs` and the no-flash script. The branded `global-error.tsx` has its own document.
- **The no-flash script** (C40, 0.6 KB, in `<head>`) sets `data-theme` and `data-effects` before the first paint. Every first visit is dark (0015).
- **Reduce effects** turns on by the visitor's switch, or by reduced motion, more contrast, forced colours or reduced transparency (device settings the switch can't override), or by Save-Data or `deviceMemory` ≤ **2 GB** (hints the visitor may override). The threshold stays at 2 GB until a budget phone is tested (C51).
- **The display controls** (Reduce effects and the theme switch, one group) live in the mobile sheet, the mega menu's strip and the footer, never in the header bar (Q2; 05 §1).

### 3. Fonts (Q4 (a))
- Per-weight fallback faces (400, 500, 700, 800) for Arial (also naming Liberation Sans) and Roboto, sized from Chromium measurements (`npm run fonts:fallback`). On Home the swap moves nothing at 320–1024 px (CLS 0.0022 at 1280 px). `fonts.spec.ts` gates it and runs with `--font-render-hinting=none`, because headless Chromium's default hinting changes glyph widths on Linux.
- `--dz-measure` is 43rem (65 characters of Montserrat 400), so it doesn't change when the font swaps in.

### 4. The logo
- `Logo` requests `/brand/deepzeta-logo.svg?v=6431c297`; that exact URL gets `public, max-age=31536000, immutable` (checked on `next start` and Vercel). The header uses `Logo variant="inline"`: the mark set where the D was, then "eepzeta" (step 11).
- **The first-paint trace** (E3, twice): the logo doesn't delay the first frame (first paint, FCP and LCP are the same frame; paired medians −4 to +14 ms). 0018's 60–80 ms wasn't reproduced.

### 5. Glass
- The ladder's tokens are final (05 §4): `--dz-glass-tint-min` 0.73 dark / 0.66 light, `--dz-glass-tint-muted` 0.89 / 0.70, from `check:contrast`, which now gates text on glass over the worst backdrop.
- `glass-live` on the header pill, the mega menu and the sheet; `glass-frost` for the sticky bar and everything under Reduce effects; solid surfaces in forced colours. **`glass-liquid` ships without the refraction extra** (`backdrop-filter: url()` is broken in Firefox and Safari).

### 6. The effect controllers (`src/lib/fx/`)
- `preferences.ts` (the switches, storage, other tabs, device changes), `observer.ts` (the one IntersectionObserver: reveals, icon stories, the CTA hand-off, the header condense), `pointer.ts` (`pointer-magnet` and the bead: fine pointers, in view only, rAF-batched, stopped on a hidden tab), `header.ts` (condense, `aria-current`, `hover-pixel-hop`, the sheet), `cta.ts` (the C42 hand-off and the sticky bar). `FxRuntime` starts them and re-runs the per-page parts after each client navigation.
- The CSS contract: the `fx` variant applies an effect only while the device allows effects and `data-effects` isn't `reduced`.

### 7. The header, mega menu and mobile sheet
- As [header.md](../design/header.md) now records: the glass pill that condenses by transform; the mini-cluster marker; the mega menu as a `popover="auto"` panel (the platform gives Esc, light dismiss, focus return and the expanded state; no `role="menu"`), four full-width pillar columns and a strip below; the sheet as a modal `<dialog>` opened by invoker commands, with a script fallback.
- The owner's step 11 review: three services out of the menu (still in the footer), "Designer Studio", heading-size items in the sheet, the 19 outcomes approved, the inline logo.

### 8. Icons
- Five Tier 3 icons (AI Front Desk and the four pillar heads) and two Tier 1 icons (chevron, external-link), approved as drawn at step 8. Tier 3 delivery is in 05 §6 and the new-icon skill.
- **No Tier 3 icon mirrors in Arabic** (C45).

### 9. The footer and the conversion path
- As [footer.md](../design/footer.md) and [conversion-path.md](../design/conversion-path.md) now record: the finale (The Landing, the display-size `<h2>`, C41; the primary CTA), the live-only link columns, the `<address>` from `siteConfig`, the nine social letter tiles (C49), the display controls and the legal line; `scroll-journey-line` on the page's inline-start edge (scroll-driven support and effects on only); the sticky CTA bar below 1024 px.
- **One gradient CTA in view** (C42): an in-page primary CTA while one is on screen; otherwise the header CTA on desktop or the sticky bar on mobile.
- **`viewportFit: 'cover'` stays** (the owner, step 15), with safe-area padding on the bar, the body and the sheet. No iPhone was available, so an iPhone check is on the pre-launch list (below).
- `<main>` fills at least the first screen, so on short pages the footer starts below the fold: that removed a 0.02 CLS from the font swap and keeps the finale's headline from competing with the H1 for LCP.

### 10. The effects feasibility gate (step 15)
The shell with every T1 effect on (Lighthouse emulates no media features or `deviceMemory`; checked under its emulation in Chrome 154 and Chromium 153).

| Measure | Home | The review page (the complete shell) |
|---|---|---|
| lhci, local (5 runs; Lighthouse 12.6.1, slow 4G, CPU 4×), after the phase-exit fixes | LCP 2,328–2,414 ms (median 2,334; the phase-exit `verify` before the fixes: median 2,406), Performance 98, TBT ≤ 17 ms, CLS 0 | LCP 2,479–2,491 ms (median 2,482), Performance 98, CLS 0 |
| HTML + CSS + JS (cap 190,868 B) | 171,754 B | 186,668 B (the gallery at one size, step 15) |
| The Vercel preview, measured from the UAE | LCP 1.90–1.92 s, Performance 100 | LCP 1.98 s, Performance 99 |
| PSI on production (part B's shell; Lighthouse 13.5.0) | Performance 99, LCP 2.0 s, TBT 50 ms, CLS 0 | — (404 in production) |

- **The 13 §7 caps,** confirmed: first-party JavaScript on Home 8,052 B (cap 10 KB; `OWN_JS_HOME`); the pointer controller 604 B (1.5 KB); the observer 293 B (0.5 KB); the grain 304 B (2 KB). No story controls or `story-*` yet.
- **At runtime** (CPU 4×, Event Timing as INP's proxy): every tap 56–88 ms on a phone-sized page; on desktop the slowest is the theme switch with the glass menu open, 112–136 ms. All under the 200 ms limit. Scrolling drops no frames on Home; the review page dropped frames only when its gallery started twenty Tier 3 stories at once (05 §6 "Rhythm").
- **PSI can't test a protected preview:** through a Vercel share link it was redirected to Vercel's login page and measured that. Preview numbers come from local Lighthouse with the share cookie; PSI runs on production.
- **The budget phone:** the owner's phone is a Samsung Galaxy S23 Ultra (8 GB), a flagship. It showed no stutter, but it can't stand in for a budget phone's GPU. The budget-phone check moves to before launch (C51).
- **Hover timings past 13 §4.3's 150–250 ms,** kept from the Design Lab and now written there: `hover-pixel-hop` 450 ms plus stagger, the `hover-charge` sheen 700 ms, the `glass-liquid` sheen 1,100 ms.

### 11. The phase-exit audits (step 16)
The reviewer, the SEO/GEO auditor and the performance/accessibility auditor found nothing blocking. Fixed within part C's files:
- **The footer's address** is one block per line: inline spans reached crawlers and text readers that ignore CSS as one run (the brand glued to the address).
- **The social tiles' names** ("Deepzeta AI on LinkedIn" …) are real text in the link, not only an `aria-label`, and the tooltip that repeated them is gone. The letters are a logotype and stay hidden from assistive technology.
- **The tiles' letters are 19 px** (were 17): at weight 800 that's large text, so their 3.49–21:1 contrast meets AA; `check:contrast` gates them as large text.
- **The hand-off's first state is instant** (`data-cta-armed`): the sticky bar and the header CTA no longer slide or fade in at load by themselves (13 §2.1); `shell.spec.ts` checks it.
- **The sticky bar** stays shown while it holds focus, and the scroll reserve adds its edge and the focus ring, so a focused control never ends under it (WCAG 2.4.11; a Tab-walk test on Home and the review page).
- **The footer's display switches** keep their space before the runtime starts (hidden, not removed), so the legal line can't shift.
- **The footer's page links** don't prefetch (`prefetch={false}`): once live, some thirty links entering the view together would each fetch on a slow phone.
- **Safe-area padding** takes the larger side inset on both sides, so RTL can't swap a physical inset.
- `OWN_JS_HOME` is the measured 8,052 B; two stale comments corrected.

Recorded, not changed:
- **The journey line** completes at the page's end (the legal line), on the root scroll timeline, a little after The Landing plays at the finale. 13 §4.4 and footer.md describe it landing on the footer CTA; a named view timeline could end it at the finale (a later change if wanted). On mobile The Landing's flight plays partly under the sticky bar, and a jump with the End key replays it.
- **The journey line in the light theme** draws the dark theme's signal gradient (13 §3 rule 6 asks for a light variant): for P5's light review of Home.
- The safe-area rules for `body` and `html` sit in `effects.css`, because `globals.css` wasn't in part C's table.
- The review page's frame drops at CPU 4× (twenty Tier 3 stories at once) weren't re-measured after the gallery went to one size.
- The sticky bar sits outside every landmark (axe's moderate `region` rule); new-tab links aren't announced as such. Both need copy, for P6.

### 12. Exceptions recorded during P2
C40 (the no-flash script), C41 (the finale's display headline), C42 (one gradient CTA in view), C43/0020 (the exception limit), C44 (`no-head-element` on SiteDocument), C45 (no Tier 3 mirroring), C46 (the error page's plain home link), C47 (Home's LCP up to 2,410 ms), C48 and C50 (the review page's LCP up to 2,700 ms), C49 (the social letter tiles), C51 (the budget phone before launch).

## Consequences

- **Rule edits** (approved with the plan): 05 §1, §3, §4, §5, §6; 06 §4 (C40); 03 §1; 13 §4.3 and §7; header.md, footer.md, conversion-path.md and the design change log; the new-icon skill; `CLAUDE.md`; the conflict register C40–C51; the URL registry R165.
- **Before launch (P10), on the owner's pre-launch list:**
  - a budget Android phone (3–4 GB): the menu, scrolling under the glass header, Reduce effects and the theme switch; its memory sets the `deviceMemory` threshold (C51)
  - an iPhone: the sticky bar clear of the home indicator, the safe areas in landscape, `touch-press` (`:active`), the grain in Safari
  - a slow connection on a phone: whether lines re-wrap when the font arrives
  - PSI on production for Home and one page of each type
- **Home's LCP margin is thin:** its lab runs fall in two groups, about 2.33 and 2.41 s, so a median lands at 2,334 or 2,406 ms from run to run, against C47's 2,410 and the 2.5 s limit. P5 must not add bytes before the H1 without a measured trade.
- **The full shell on real pages** (the performance audit): once the footer columns and the first mega-menu column are live, each service link is in the HTML three times (menu, sheet, footer), and again in React's page data. Home's room under the page-weight cap (about 19 KB now) would fall to about 8 KB and its lab LCP rise by roughly 100 ms before any real Home section exists. Decide before P6: footer columns that list only the pillar pages and "All … services" (a footer.md change, the owner's call), or a budget decision.
- **Small fixes outside part C's table, proposed** (each needs the owner's OK or a later plan): a space between the service name and its outcome in the mega menu's links (they read as one run to text readers); the home links typed as `href="/"` in `SiteHeader`, `global-not-found` and `global-error` through the route helper; the sheet's bottom safe-area inset (`MobileSheet.tsx`); a unit test that `/shell-review` calls `notFound()` on production; the footer lists in `routes.test.ts`'s duplicate check; a 768 px and a forced-colours case for the tiles in `shell.spec.ts`; the tile letter's weight as a token.
- **For P4** (the SEO audit): the registry's index flag carried into `routes.ts`, so a sitemap never lists `/shell-review`; the address's parts in `siteConfig` (street, locality, region, country) with the one-line form derived from them; P4's content and link checks scoped to `<main>`, so the shell isn't counted on every page; digits-only `tel:` and `wa.me` links when the number arrives; whether the footer shows the opening hours (they're CONFIRMED, and sitewide markup may only include what's visible).
- **For P3 and P5** (the performance audit): the sticky bar gives way to the consent banner (conversion-path.md); on pages with forms it hides while a text field has focus, so the on-screen keyboard can't put it over the field.
- **P3:** the init script is allowed by its hash in the CSP; the logo's `<image>` needs `img-src 'self'`. Consent defaults are set in the code before GTM, never also by a GTM template. Tracking names come from one taxonomy, and GTM and GA4 are configured from it (the owner's tracking-parity rule).
- **P4:** `siteConfig` is the one source of the NAP and the social profiles that the `#organization` node uses; `routes.ts` grows to every registry row.
- **P5:** re-run the feasibility gate on the full Home (with a budget phone if one is available); plan sections so few Tier 3 stories start in one viewport.
- **P6:** the first live mega-menu column adds about 8 KB to every page (its markup is about 3.9 KB gzip, repeated in React's page data). Trim the panel before (Tier 3 heads by `<use>` from `IconDefs`) and re-run lhci with it. The sheet's `aria-current` link has no visual mark yet.
- **P7:** the real `glass-liquid` demo card (on the review page it blurs inside the blurred panel, its backdrop root, so its own blur shows nothing).
- **Known gaps, not changed:** errors outside React's render get Next.js's built-in static 500 page (no `lang`, a 32 px button; re-check on Next.js upgrades); `scrollbar-gutter: stable` applies only while the sheet is open; the cluster's 2.1053 S box repeats in `header.ts` and `effects.css`.
