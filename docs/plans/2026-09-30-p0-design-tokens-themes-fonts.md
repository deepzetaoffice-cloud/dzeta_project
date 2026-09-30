# Plan: P0 Foundation, part 2 of 2: design tokens, themes and fonts
Status: APPROVED (owner, 2026-09-30: approved with the protected-file edits it lists; Q1–Q5 answered with the recommended options; answers under Open questions)
Progress (2026-09-30):
- Step 0: the close-out and DeepSeek branches aren't merged yet (no PR was opened for them). So that the work can start, `docs/deepseek-ai-provider` (which contains `chore/p0-close-out`) is merged into this branch. This PR's diff shrinks to this plan's files once the owner merges those two. The Vercel setting is fixed: the DeepSeek branch's preview built (`fbb904d`, "Deployment has completed").
- Step 1 is done:
  - **Baseline:** CI `fbb904d` median LCP 1513 ms; locally, with the CI environment, 2031 ms. HTML + CSS + JS is 145,472 B.
  - **Fonts, following Risks "Fonts over budget":** Montserrat's latin file is the same 37,956 B for any weight range. JetBrains Mono 400–600 is 31,432 B, which puts the pair at 69,388 B, over the ≈ 60 KB target. So the mono is a single 500 weight (21,832 B), and the pair is 59,788 B.
  - **Filename:** the allowed file `jetbrains-mono-latin-wght.woff2` is therefore `jetbrains-mono-latin-500.woff2`, because a static file has no `wght` axis.
- Steps 2–4 are done: see the branch commits.
- Step 5 is done:
  - **`scripts/page-weight-budget.cjs` isn't created.** The lint gate forbids `require()`, also in `.cjs` files, and `lighthouserc.cjs` can't read a module any other way.
  - **What replaces it:** the budget stays in `lighthouserc.cjs` and is exported next to `ci` as `budget` (lhci reads only `ci`). `check-page-weight.mjs` imports it, so both checks still use the same numbers.
  - **After the fonts,** locally with the CI environment: LCP 2180 ms (+149 ms, all render delay: the preloaded font shares the simulated bandwidth with the scripts), CLS 0, fonts 38,823 B (1 file), HTML + CSS + JS 147,507 B.
- Steps 6 and 7 are done:
  - **G1, `inlineCss`: not adopted.** Median LCP 2176 ms against 2180 ms, 4 ms better (the rule needs ≥ 100 ms). FCP improved from 756 to 620 ms. `next.config.ts` is unchanged.
  - **G2, polyfills:** measured only. Lighthouse flags 13,697 B of `legacy-javascript` in one framework chunk (`Array.prototype.at`, `flat`, `flatMap`, `Object.fromEntries`, `Object.hasOwn`, `trimEnd`), which the default targets already support.
- Step 8: the specimen is written, and the owner's review is next.
Phase: P0
Branch: `feat/p0-tokens-themes-fonts`, from `main` after the close-out PR (`chore/p0-close-out`) is merged (stacked on `docs/deepseek-ai-provider` until then, see Progress)
Page tier: T1 for the placeholder Home (`lhci` floor ≥ 95). No effects.

## Goal served
*"A **fast**, **custom-coded** … site … that **proves every claim it makes**."*
- Every later page is built from one set of brand tokens, so it's on-brand and has no raw values (N7).
- Contrast becomes a gate, so "accessible in both themes" is proven, not claimed (N10).
- The fonts arrive under a measured budget, and every page-weight limit in 07 §2 is asserted separately (decision 0014).

## Context
- **Part 1** ([plan](2026-09-30-p0-foundation.md), "Why P0 is split into two plans") left the tokens, themes, fonts and the contrast gate to this plan. The P0 exit gate is "`verify` green; baseline recorded in a decision" (04 §2).
- **Sources:**
  - [05](../ai/05-design-system.md) §2–§5: token names and values (05's names win, conflict C22)
  - the colour system (`Planning Folder/For Ai/deepzeta-colour-system.html`): values
  - [decision 0009](../decisions/0009-design-lab-v1-verdicts.md): the owner's Lab tuning
  - [13](../ai/13-experience-design.md) §4.2 (light mode, forced colours) and §7 (byte caps)
  - [07](../ai/07-performance-budget.md) §2: fonts ≈ 60 KB, hard limit 70 KB
  - [decision 0014](../decisions/0014-empty-page-baseline-and-js-budget.md): "part 2 replaces [the `total:size` check] with per-type budgets in the same change that adds fonts"
- **Close-out audit notes used here:**
  - `total` counts every resource type, so fonts would break it
  - lhci can't add resource types together
  - resource checks use the largest value of any run
  - the `OWN_JS_HOME` guard
  - LCP must be recorded before and after the fonts
- **Lessons:** 1 (no Google Fonts `<link>`), 5 (a decision is accepted together with its rule edits), L4 (every check is an npm script), L9 (Windows scratch files), L11 (verify config syntax).

## Verified (installed versions, 2026-09-30)
| What | Evidence |
|---|---|
| `next/font` self-hosts Google fonts: "downloaded at build time … **No requests are sent to Google by the browser**" | `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md` (Next.js 16.3.7) |
| Tailwind v4 with `next/font`: `@theme inline { --font-sans: var(--font-…) }` | Same file, "With Tailwind CSS" |
| A shared font definitions file (`styles/fonts.ts`) keeps one instance per font | Same file, "Using a font definitions file" |
| `next/font/local` options: `src`, `display`, `preload`, `adjustFontFallback` (default `'Arial'`), `variable`, `declarations` | Same file, reference table |
| Montserrat: variable `wght` 100–900, subset `latin`. JetBrains Mono: variable `wght` 100–800, `latin`. Readex Pro: `wght` 160–700 plus `HEXP` | `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json` |
| `experimental.inlineCss` exists, is **experimental**, is global only, and duplicates styles into the RSC payload on first load | `node_modules/next/dist/docs/…/next-config-js/inlineCss.md`; `config-shared.d.ts:1051` |
| Polyfills: the default Browserslist targets Chrome/Edge/Firefox 111 and Safari 16.4. The `nomodule` polyfills only load in old browsers. Browserslist in `package.json` is the only documented lever | `node_modules/next/dist/docs/03-architecture/supported-browsers.md` |
| Tailwind 4.3.3 supports the `inline`, `static` and `reference` theme options and `@custom-variant`. It builds through Lightning CSS 1.32.0 with targets Safari 16.4, Chrome 111 and Firefox 128 | `node_modules/tailwindcss/dist/lib.js`, `node_modules/@tailwindcss/node/dist/index.js` |

**Not verified, so step 2 checks it on the built CSS:** that `--color-*: initial` removes Tailwind's whole default palette while `bg-transparent` and `text-current` keep working.

## Measured contrast (WCAG 2.x, computed 2026-09-30 from the token hex values)

| Pair | Ratio | Result |
|---|---|---|
| `--dz-white` / `--dz-frost` / `--dz-mist` text on navy, navy-850, navy-800 | 18.9 · 13.9 · 7.6 at the lowest | AA+ |
| `--dz-slate` on navy / navy-800 | **4.48** / 3.60 | Large text and disabled states only |
| `--dz-sky` links on navy / navy-800 | 8.05 / 6.47 | AA |
| `--dz-ice` focus ring on navy | 15.7 | UI 3:1 met |
| `--dz-border` on navy (a form-field edge needs 3:1) | **2.24** | Fails as a UI boundary (P6 forms) |
| `--dz-white` on solid `--dz-signal` | **4.16** | Large text only |
| Navy on `--dz-signal` / on `--dz-grad-action`'s stops | 4.54 / 10.22 and 4.54 | AA |
| `--dz-white` on `--dz-grad-action-deep`'s stops (azure, royal) | 3.37 / 6.52 | Large text only (05 already says so) |
| Glass, `--dz-glass-tint-min` 0.62 of navy-850 over a white background: white text / frost text | 5.07 / **3.74** | Frost body text needs a 0.68 tint; mist needs 0.79 (P2) |
| Light: `#16224A` body on `#F4F6FB` / `#FFFFFF` | 14.3 / 15.4 | AAA |
| Light: secondary `#34446F` (the Lab's light value) on page / card | 8.82 / 9.54 | AAA |
| Light: links `#1557C9` / accent `#0A6BE0` on the page | 6.00 / 4.63 | AA |
| Light: `--dz-ice` focus ring on the page | **1.20** | Fails; light needs its own focus colour (Q4) |
| Light: `--dz-ok` / `--dz-warn` / `--dz-bad` on the page | **1.78 / 1.62 / 2.80** | All fail; darker light variants are chosen when first used (out of scope) |

## Design

### A. Token architecture (`src/styles/tokens.css`, the only file with raw values, 05 §1)
1. **Brand primitives** in `:root`, with exactly the 05 §2 names and values:
   - all colours
   - `--dz-info` (the colour system's info tone, = `--dz-sky`, added under C22)
   - the gradients, `--dz-glow-hero`, and the grid (`--dz-grid-line`, `--dz-grid-size`)
   - the four `--dz-pixel-*` gradients, **3-stop, top → bottom**, plus each pixel's solid (below 20 px) and glow colour (Icon Master Rules §5.2)
   - the light-mode values from 05 §2 as primitives (`--dz-paper`, `--dz-card-light`, `--dz-ink`, `--dz-link-light`, `--dz-accent-light`, `--dz-grad-zeta-light`)
2. **Semantic tokens** that switch with the theme. Components use these, never a primitive that changes meaning between themes.

   | Token | Dark | Light | Source |
   |---|---|---|---|
   | `--dz-bg` | `--dz-navy` | `#F4F6FB` | 05 §2 |
   | `--dz-surface` | `--dz-navy-850` | `#FFFFFF` | 05 §2 |
   | `--dz-text` | `--dz-frost` | `#16224A` | 05 §2 |
   | `--dz-text-strong` | `--dz-white` | `#010413` | 05 §2 |
   | `--dz-text-muted` | `--dz-mist` | `#34446F` | 05 §2 (dark); the Lab (light, **proposed**, Q4) |
   | `--dz-link` | `--dz-sky` | `#1557C9` | 05 §2 |
   | `--dz-focus` | `--dz-ice` | **Q4** | 05 §2, 05 §7 |
   | `--dz-hairline` | `--dz-navy-700` | `#16224A` at 14% | 05 §2; the Lab (light, proposed) |
   | `--dz-grad-headline` | `--dz-grad-zeta` | `--dz-grad-zeta-light` | 05 §2 |

3. **Tailwind mapping** in `@theme inline`, so the utilities read the variables and follow the theme:
   - semantic: `bg-bg`, `bg-surface`, `text-fg`, `text-fg-strong`, `text-fg-muted`, `text-link`, `outline-focus`, `border-hairline`
   - brand primitives, for surfaces that never switch: `bg-navy`, `bg-navy-850` …
   - **Default theme trimmed as a guardrail:**
     - `--color-*: initial`, `--font-*: initial`, `--text-*: initial` and `--radius-*: initial` remove Tailwind's defaults, so an off-brand colour, font or size can't be written
     - Tailwind's spacing scale and breakpoints stay (05 §4, §7)

### B. Themes (CSS only in this plan)
- **Dark block:** `:root, [data-theme='dark']`, with `color-scheme: dark`.
- **Light block:** `[data-theme='light']`, with `color-scheme: light`. It's written twice:
  - as the attribute block
  - inside `@media (prefers-color-scheme: light)` for `:root:not([data-theme='dark'])`, so the first visit follows the visitor's system (05 §1)
  
  `check:contrast` fails if the two copies differ.
- **Any element can carry `data-theme='dark'`:** the header, the CTA band and the footer stay navy in both themes (05 §2, `footer.md`), and P2 uses this.
- **No JavaScript now.** The switch, its storage and a no-flash script come with the header in P2.

### C. Type, spacing, layers, radius, motion
The values are **proposed**. The owner confirms them in the specimen (step 8).
- **Fluid sizes:** each size runs from 360 to 1280 px wide, with `clamp(min, rem + vw, max)`. The rem part keeps browser zoom working (WCAG 1.4.4).

| Token | Min → max | Weight / leading / tracking | Source |
|---|---|---|---|
| `--dz-text-statement` | 2.6rem → **5.58rem** (Q1) | 800–900 / 0.98 / −0.035em | The Lab's hero H1 at its 9 setting (see Q1) |
| `--dz-text-display` | 2.2rem → 4.2rem | 800 / 1.02 / −0.035em | The Lab's Landing H2 |
| `--dz-text-h1` | 2rem → 3.2rem | 700 / 1.05 / −0.03em | The Lab's chapter H2 |
| `--dz-text-h2` | 1.6rem → 2.4rem | 700 / 1.1 / −0.02em | Proposed |
| `--dz-text-h3` | 1.3rem → 1.9rem | 700 / 1.25 / −0.02em | The Lab's highlight line |
| `--dz-text-h4` | 1.25rem | 700 / 1.3 | Proposed |
| `--dz-text-lead` | 1.125rem → 1.3rem | 400 / 1.55 | Proposed |
| `--dz-text-body` | 1rem | 400 / 1.6 | The Lab's body |
| `--dz-text-small` | 0.875rem | 400–500 / 1.5 | Proposed |
| `--dz-text-caption` | 0.75rem | JetBrains Mono 500 / 1.4 / +0.04em | Proposed (eyebrows, labels) |

- **Spacing, fluid:**
  - `--dz-space-section` 3rem → 6rem (proposed)
  - `--dz-space-chapter` 4.5rem → 8.75rem (the Lab's 72 → 140 px)
  - `--dz-space-statement` 6rem → 12rem (proposed)
  - `--dz-gutter` 1rem → 2.5rem (the Lab)
  - `--dz-container` 1140px (05; the Lab used 1180 px, and 05 wins)
  - `--dz-measure` 65ch (05: 60–70 characters)
- **Layers:** `--dz-layer-base` 0 · `raised` 10 · `sticky` 20 · `header` 30 · `overlay` 40 · `sheet` 50 · `toast` 60 · `consent` 70 (the order is 05 §4's; the values are proposed). Used as `z-(--dz-layer-header)`.
- **Radius:** exactly as in 05 §4. **Motion:** 05 §5 `--dz-ease-out`, `--dz-ease-pop`, `--dz-ease-travel`, `--dz-dur-fast` 150ms, `--dz-dur-base` 250ms, `--dz-tilt-max` 5deg, `--dz-magnet-max` 7px.

### D. Fonts (`src/styles/fonts.ts`, used by both root layouts)
- **Montserrat:** variable, `wght` 400–900, latin subset, `display: 'swap'`, preloaded (the H1 is the LCP element).
- **JetBrains Mono:** variable, `wght` 400–600, latin subset, `display: 'swap'`, `preload: false`. The Lab used 400 and 500. If it pushes the fonts over budget, it becomes a single 500 weight.
- **Loader (Q3):** `next/font/local` (recommended) or `next/font/google`.
  - **Local:**
    - the two latin woff2 files are downloaded once from Google Fonts, with their SIL OFL 1.1 licence files next to them
    - where each file came from, its date and its SHA-256 are recorded in decision 0015, and no Google host appears in `src/`
    - every build has the same bytes, the build doesn't depend on Google, and the specimen can use the same files
  - **Google:** simpler, but every build downloads the fonts, and a silent Google update can change their size.
- **Wiring:** the `variable` classes go on `<html>` in `(en)/layout.tsx` and `global-not-found.tsx`, and `@theme inline` maps `--font-sans` and `--font-mono` to them. The automatic fallback font (`adjustFontFallback`) keeps CLS at 0.
- **Readex Pro is P11.** Its maximum weight is 700, so the Arabic statement weight (800–900 in 05 §3) needs a decision in P11.

### E. `check:contrast` (`scripts/check-contrast.mjs`, no dependencies)
- **How it works:**
  - reads `tokens.css`: the dark block, the light block, and the media-query copy (which must match)
  - resolves `var()`, and composites any `rgba()` over the pair's background
  - checks a list of pairs kept in the script, each tagged `text` (4.5:1), `large` (3:1) or `ui` (3:1)
- **What it checks:**
  - every semantic text/background pair, in both themes
  - the link and focus pairs
  - CTA text on **every stop** of `--dz-grad-action` and `--dz-grad-action-deep`
  - `--dz-signal` fills
  - `--dz-slate` (large only)
  - the status colours on dark
- **Output:** prints every pair and its ratio, lists what it doesn't check yet (glass: P2; light status colours: first use), and exits 1 below the threshold.
- **Gate rules:** a pure function with unit tests on failing fixtures. Part of `verify:fast`, since it's instant.

### F. Page weight: per-type budgets (decision 0014, perf audit)
- **`lighthouserc.cjs`:** `total:size` is removed. It adds:
  - `font:size` ≤ 71,680 B (07 hard limit; the ≈ 60 KB target in a comment)
  - `font:count` ≤ 2
  - `image:size` ≤ 204,800 B
  
  All of these use `pessimistic`. `script:size` stays.
- **HTML + CSS + JS ≤ baseline + 50 KB:** checked by `scripts/check-page-weight.mjs`, which runs after `lhci autorun` in the `lhci` npm script.
  - It adds `document` + `stylesheet` + `script` for each run in `.lighthouseci/lhr-*.json` and fails on the largest.
  - The shared constants (baseline, growth, `OWN_JS_HOME`) move to `scripts/page-weight-budget.cjs`, which both files read.
- **Recorded in decision 0015:** LCP, CLS and every byte figure, **before and after** the fonts (CI median of 5 runs, plus one local run).

### G. Two measured experiments (the option C tuning in 0014)
1. **`experimental.inlineCss`:**
   - Build and run `lhci` with and without it.
   - **Adopt it only if** lab LCP improves by ≥ 100 ms at the median and every budget still passes. Inlined CSS moves into `document`, and styles are duplicated in the RSC payload.
   - Being experimental is a risk: if a Next.js upgrade breaks it, it's switched off.
   - Recorded in 0015 either way.
2. **Legacy polyfills (13.4 KiB):**
   - The only documented lever is Browserslist, which **changes which browsers are supported**, so this plan **measures and reports only**.
   - Any change is a separate owner decision and a new framework baseline.

### H. Owner review: `docs/design/prototypes/tokens-specimen.html`
- A static page, never shipped and never a source (00 §5). It links the real `src/styles/tokens.css` (browsers skip the `@theme` blocks) and, with local fonts, the real font files.
- It shows every swatch with its live contrast ratio, the type scale at a slider-set width, the spacing rhythm, the layers and radii. It has a dark/light toggle.
- You open it from the repo folder; it needs no server. Values are changed in `tokens.css` only.

## Out of scope
- Glass tokens and the grain texture: P2, with the glass effects. That plan starts from the tint finding above.
- The theme switch, its storage and the no-flash script: P2 header.
- Light-mode values for accent, status colours, raised surfaces, shadows and glass: the first plan that uses them on a light surface.
- `--dz-dur-story` and `--dz-dur-flow-step`: the first icon or story plan.
- Logo, favicon, manifest, `themeColor`, icons: P1.
- Arabic fonts: P11. A Browserslist change: owner decision (G2).
- Form-field boundary contrast (`--dz-border` 2.24:1): P6 forms.
- Any change to the placeholder copy.

## Allowed files
| Path | Action | Purpose |
|---|---|---|
| `src/styles/tokens.css` | CREATE | Sections A–C |
| `src/styles/globals.css` | MODIFY | Import `tokens.css`; base `html`/`body` styles from semantic tokens (background, text, font, `text-wrap: balance` on headings) |
| `src/styles/fonts.ts` | CREATE | Section D |
| `src/styles/fonts/montserrat-latin-wght.woff2`, `src/styles/fonts/jetbrains-mono-latin-wght.woff2`, `src/styles/fonts/OFL-Montserrat.txt`, `src/styles/fonts/OFL-JetBrainsMono.txt` | CREATE | Only if Q3 = local |
| `src/app/(en)/layout.tsx` | MODIFY | Font variable classes on `<html>` |
| `src/app/global-not-found.tsx` | MODIFY | The same, plus token classes instead of `text-3xl` (removed by the reset) |
| `src/app/(en)/page.tsx` | MODIFY | Token classes only; copy unchanged |
| `next.config.ts` | MODIFY | Only if G1 adopts `inlineCss` |
| `scripts/check-contrast.mjs` | CREATE | Section E |
| `scripts/check-page-weight.mjs`, `scripts/page-weight-budget.cjs` | CREATE | Section F |
| `lighthouserc.cjs` | MODIFY | Section F |
| `package.json` | MODIFY | Scripts only: `check:contrast`; `verify:fast` adds it; `lhci` runs the page-weight check. No dependencies |
| `.github/workflows/ci.yml` | MODIFY | The Lighthouse annotation line also prints font KB |
| `tests/unit/check-contrast.test.ts`, `tests/unit/check-page-weight.test.ts` | CREATE | Unit tests with failing fixtures |
| `tests/e2e/themes.spec.ts` | CREATE | Dark by default; light under emulated `prefers-color-scheme: light` and under `data-theme`; a `data-theme='dark'` subtree stays navy; fonts come from our own origin with `font-display: swap`; axe finds 0 serious/critical issues in both themes; the H1 is still the LCP element and visible at first paint |
| `docs/design/prototypes/tokens-specimen.html` | CREATE | Section H |
| `docs/decisions/0015-design-tokens-themes-fonts.md` | CREATE | Final values, the owner's specimen verdict, font sources and bytes, before/after measurements, the G1/G2 results |
| `docs/decisions/README.md` | MODIFY | The 0015 row |
| `docs/plans/2026-09-30-p0-design-tokens-themes-fonts.md` | MODIFY | Status updates only |

**Protected files. Edited only with the owner's explicit OK, given with the approval of this plan (00 §5):**

| Path | Change |
|---|---|
| `docs/ai/05-design-system.md` | §2: the semantic token table, `--dz-info`, the light values marked final, the white-on-signal rule (Q2), a slate usage note. §3: the final scale and the statement maximum (Q1). §4: spacing, container, gutter, measure and layer values. "Names final (P0, 0015)" |
| `docs/ai/03-verification-gates.md` | §1: the `check:contrast` row; `verify:fast` includes it; the `lhci` row mentions the page-weight check |
| `docs/ai/conflict-register.md` | New C34: the statement size (the Lab rendered at most 5.58 rem, while 05 and 0009 say 9 rem), resolved by Q1. C22 gets "applied in `tokens.css` (0015)" |
| `.claude/agents/perf-a11y-auditor.md` | Line 11: "≤ 150 KB" → "≤ framework baseline + 50 KB (decision 0014)", the close-out review's proposal |
| `CLAUDE.md` | "Current state": P0 done, next P1 |

## Steps
Each step is committed on the branch after its gate passes (12 §2).
0. **Owner prerequisites:**
   - Merge the close-out PR.
   - Answer Q1–Q5.
   - Fix the Vercel build setting (`NEXT_PUBLIC_SITE_URL`, setup guide step 3), so this PR's preview builds.
   
   → gate: `main` contains `chore/p0-close-out`.
1. Create the branch. Record today's baseline: `lhci` bytes, LCP and CLS locally, and the CI figures from the close-out run. If Q3 = local, download the two woff2 files and licences, and record their source, SHA-256 and size. → gate: `verify:fast`.
2. Write `tokens.css` (A–C) and import it in `globals.css`. → gate:
   - `verify:fast` and `build`
   - **the built CSS** has no Tailwind default palette, the `var()` mappings are present, and `bg-transparent` still works (the unverified item above)
3. Write `fonts.ts` and wire both layouts. Move the placeholder Home and the 404 to token classes. → gate: `verify:fast`, `build`, `test:e2e` (the existing 9 tests).
4. Write `check-contrast.mjs` and its tests. → gate:
   - `test`
   - `check:contrast` passes on the real tokens
   - it fails on the fixtures (white on solid signal as `text`, ice on paper, light blocks that differ)
5. Write the page-weight script, the budget module, and the `lighthouserc.cjs`, `package.json` and `ci.yml` edits. → gate:
   - `test`
   - `npm run lhci` passes, and the page-weight check fails on a fixture that's 1 byte over
   - the before/after figures are recorded
6. Write `themes.spec.ts`. → gate: `test:e2e`.
7. Run the G1 and G2 measurements. Keep `inlineCss` only by the G1 rule. → gate: `lhci` (both runs recorded).
8. Write the specimen. **Owner review:** you open it and adjust values with me until you're happy. Only `tokens.css` changes. → gate: your verdict in chat, recorded in 0015.
9. Write decision 0015, the index row and the approved protected edits. → gate: `check:rules`.
10. **P0 exit:**
    - full `verify`, locally and in CI
    - reviews by `reviewer`, `qa-verifier`, `perf-a11y-auditor` and `seo-geo-auditor`
    - `git diff --stat main` matches this table
    - report in the 02 §5 format; you merge. **P0 is then complete, and P1 is next.**

## Effect register
None: tokens only, no effects.

## Dependencies to add
None. `next/font` is part of `next`. The gates are dependency-free Node scripts.

## Risks and mitigations
- **Fonts over budget.** Two variable fonts may exceed about 60 KB. Mitigations, in order:
  - narrow the weight ranges
  - make the mono a single 500 weight
  - if still over, the owner decides (07's hard limit is 70 KB)
- **LCP.** The H1 is set in Montserrat 800, local LCP is 2.03 s (470 ms below the limit), and CI is 1.5–1.7 s.
  - Mitigations: preload the Montserrat file only, and the size-adjusted fallback (no CLS).
  - `display: 'optional'` would protect LCP but breaks 05's `swap` rule, so it's used only with owner approval.
- **Contrast gate parsing.** `tokens.css` follows one documented shape (flat blocks, one declaration per line), and the gate fails loudly on anything it can't parse, rather than skipping it.
- **The default-theme reset** could remove a utility someone expects. Step 2 checks the built CSS; the reset is a guardrail, not a byte saving.
- **`inlineCss` is experimental.** It's adopted only by the G1 rule and is one line to switch off.
- **CSS growth.** The tokens add CSS to every page, inside the baseline + 50 KB check (45 KB of room today).
- **`next/font/google` (if chosen)** makes builds depend on Google being reachable, and a Google update can change the bytes. `lhci` catches the size.

## Gates (03 §2)
- Phase exit: `verify` (all gates, now including `check:contrast` and the page-weight check)
- Owner review of the specimen and of the PR

## Open questions
1. **Q1 · Statement headline size.**
   - In the Lab, the slider read "9 rem", but the hero headline used `9 × 0.62 rem`, so the largest size you saw was **5.58 rem (about 89 px)**. 05 and 0009 recorded 9 rem (144 px), which is 60% larger.
   - **(a) (recommended)** Use what you approved visually, 5.58 rem, and record the correction as C34.
   - **(b)** Use 9 rem as written; display then grows to about 6.5 rem.
2. **Q2 · White text on solid `--dz-signal` is 4.16:1** (it needs 4.5:1).
   - **(a) (recommended)** Solid signal fills carry navy text (4.54:1), and white is used on them only for large text (24 px, or 19 px bold). This matches the primary CTA, which already uses navy text on `--dz-grad-action`.
   - **(b)** Choose a darker signal shade for white-text fills. That's a new colour, and you'd pick it in the specimen.
3. **Q3 · How fonts are loaded.**
   - **(a) (recommended)** `next/font/local` with the committed latin files and their OFL licences.
   - **(b)** `next/font/google`, downloaded on every build.
4. **Q4 · Light-mode colours without a source value.**
   - Focus ring: `--dz-ice` is 1.20:1 on light. Choose **`--dz-royal` `#2139F6` (6.52:1, recommended)** or the light accent `#0A6BE0` (4.63:1).
   - Also confirm the Lab's light secondary text, `#34446F` (8.82:1), and its hairline, `#16224A` at 14%.
5. **Q5 · The `inlineCss` rule.** Do you approve "adopt only if lab LCP improves by ≥ 100 ms and every budget passes"?

**Owner answers (2026-09-30)**
- **Q1:** (a) 5.58 rem, what the owner saw in the Lab. The correction is recorded as C34.
- **Q2:** (a) solid signal fills carry navy text; white only for large text.
- **Q3:** (a) `next/font/local` with the committed latin files and their OFL licences.
- **Q4:** the focus ring in light mode is `--dz-royal` `#2139F6`. The Lab's light secondary text `#34446F` and hairline `#16224A` at 14% are confirmed.
- **Q5:** approved: `inlineCss` is adopted only if lab LCP improves by ≥ 100 ms at the median and every budget passes.

**Findings for later plans (no decision needed now):**
- `--dz-slate` is 4.48:1 on navy, so it's for disabled states and large text only; 05 gets a usage note.
- Frost text on glass needs a 0.68 tint (P2).
- The light status colours fail and need darker variants.
- `--dz-border` (2.24:1) can't be a form field's only boundary (P6).
- Readex Pro stops at weight 700 (P11).
