# 0015 · Design tokens, themes and fonts (P0 part 2)

Status: ACCEPTED (owner, 2026-09-30: the plan's Q1–Q5 and the specimen review, both with the recommended options)

## Context

[The P0 part 2 plan](../plans/2026-09-30-p0-design-tokens-themes-fonts.md) turns [05](../ai/05-design-system.md) §2–§5 into code:
- one tokens file
- a light theme next to the dark one
- self-hosted fonts
- a contrast gate
- per-type page-weight budgets, which [decision 0014](0014-empty-page-baseline-and-js-budget.md) asked for "in the same change that adds fonts"

The owner answered the plan's questions and then reviewed every value in the tokens specimen (`docs/design/prototypes/tokens-specimen.html`, which links the real files).

## Decision

### 1. Tokens (`src/styles/tokens.css`, the only file with raw values)
- **Brand primitives** in `:root`, with 05's names and values (C22):
  - `--dz-info` (the colour system's info tone) is added
  - the pillar pixels are 3-stop gradients, top to bottom, each with a `-solid` colour (below 20 px) and a `-glow` colour (Icon Master Rules §5.2)
- **Semantic tokens,** which switch with the theme:
  - `--dz-bg`, `--dz-surface`
  - `--dz-text`, `--dz-text-strong`, `--dz-text-muted`
  - `--dz-link`, `--dz-focus`, `--dz-hairline`, `--dz-grad-headline`

  Components use these, never a primitive that changes meaning between themes. The values are in 05 §2.
- **The Tailwind mapping** is in `@theme inline`, so every utility reads its variable and follows the theme: `bg-bg`, `text-fg`, `text-link`, `outline-focus`, `text-statement`, `py-section`, `max-w-page`, `rounded-lg`…
- **Tailwind's default theme is trimmed:** the default colours, fonts, sizes and radii are removed, so an off-brand value can't be written.
  - `bg-transparent`, `text-current` and the font weights still work (checked on the compiled CSS).
  - The spacing scale and the breakpoints stay.

### 2. Themes
- **Every first visit is dark, whatever the system setting** (owner, specimen review). Light comes only from the visitor's choice, `data-theme='light'`, which the header switch sets in P2.
  - **Why:** browsers report "no preference" as light (Media Queries 5), so following the system (05 §1 before this decision) would have shown most first visits the light theme, not the navy brand the design is built around.
  - **How it's enforced:** `tokens.css` has no `prefers-color-scheme` block, and `check:contrast` fails on any `@media` block there.
- **Any element can carry `data-theme`.** It then paints its own `--dz-bg` and `--dz-text` (a base style in `globals.css`), so the header, the CTA band and the footer stay navy on a light page.

### 3. Colour rules
| Rule | Evidence (WCAG 2.x) | Source |
|---|---|---|
| Solid `--dz-signal` fills carry navy text; white text on them is large text only | Navy 4.54:1, white 4.16:1 | Q2 |
| Light-mode focus ring: `--dz-royal` `#2139F6` | 6.52:1 on the light page. `--dz-ice` was 1.20:1 | Q4 |
| Light secondary text `#34446F` (`--dz-ink-muted`) and hairline `#16224A` at 14% (`--dz-hairline-light`) | 8.82:1 | Q4, from the Lab |
| Light zeta gradient: first stop `#0094D3`, replacing `#0098D8` | 3.14:1 on the light page. `#0098D8` was 2.996:1, under 3:1 for large text | Specimen review |
| Gradient headline words sit on `--dz-bg`, never on a card | The dark zeta gradient's violet stop is 3.13:1 on navy, 2.83:1 on `--dz-navy-850` | Contrast gate |
| `--dz-slate` is for large labels and disabled states only | 4.48:1 on navy, 3.60:1 on navy-800 | Contrast gate |

### 4. Type, spacing, layers, radius, motion
- **Type scale:** the table in 05 §3.
  - Sizes run fluidly from 360 to 1280 px wide with `clamp(min, rem + vw, max)`; the rem part keeps browser zoom working (WCAG 1.4.4).
  - **Statement: 2.6 → 5.58rem** (Q1; conflict C34 corrects 0009's 9rem).
  - **Headings h1–h4 are 700,** as 05 says (specimen review); the statement and display sizes are 800.
  - **Eyebrows:** uppercase eyebrows use `--dz-text-eyebrow-tracking` 0.16em (`tracking-eyebrow`), as in the Lab (specimen review). Other caption text keeps 0.04em.
- **Spacing and layout:**
  - `--dz-space-section` 3 → 6rem, `--dz-space-chapter` 4.5 → 8.75rem, `--dz-space-statement` 6 → 12rem
  - `--dz-gutter` 1 → 2.5rem
  - `--dz-container` 1140px, `--dz-measure` 65ch
- **Layers:** `--dz-layer-base` 0, raised 10, sticky 20, header 30, overlay 40, sheet 50, toast 60, consent 70.
- **Radius and motion:** exactly as in 05 §4 and §5.
- **Focus ring:** `--dz-focus`, 2 px wide (`--dz-focus-width`), 2 px out (`--dz-focus-offset`), on every `:focus-visible`.

### 5. Fonts (`src/styles/fonts.ts`, `next/font/local`, Q3)
| File | Source (downloaded once, 2026-09-30, from the latin block of the Google Fonts CSS) | Bytes | SHA-256 |
|---|---|---|---|
| `montserrat-latin-wght.woff2` | `fonts.gstatic.com/s/montserrat/v31/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2` (variable; the same file for any weight range) | 37,956 | `06b16db7a969135d48d38c49183be7fb88d4452e2a3011957c7851941f4e4879` |
| `jetbrains-mono-latin-500.woff2` | `fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8-qxTOlOV.woff2` (static 500) | 21,832 | `cb182feeed4d798ff6961d3c79f7026279448fca0676438aaecb21f3fc39553a` |
| `OFL-Montserrat.txt` | `github.com/google/fonts/blob/main/ofl/montserrat/OFL.txt` (SIL OFL 1.1) | 4,400 | `8b7141c03fa4f8d44e6345d5d4931709290f0f67875e452e95ac1fd3a027802e` |
| `OFL-JetBrainsMono.txt` | `github.com/google/fonts/blob/main/ofl/jetbrainsmono/OFL.txt` (SIL OFL 1.1) | 4,399 | `b2fe5e8987594e9ffd1d2ca52a2f5d73eb8335243893c5d6254b5ad69269591d` |

- **Why the mono is a single 500 weight** (the plan's Risks):
  - The variable JetBrains Mono 400–600 file is 31,432 B; 400–500 is the same file. With Montserrat that's 69,388 B, over the ≈ 60 KB target in 07 §2.
  - The static 500 file makes the pair 59,788 B.
- **Loading:**
  - Montserrat is preloaded, so the fallback period before it replaces the fallback font is short. With `swap`, the H1's LCP is its fallback paint, so the preload doesn't make LCP earlier. The mono isn't preloaded, so a page downloads it only when it shows mono text.
  - Both use `display: swap` with next/font's Arial fallback. No request goes to Google, and every build uses the same bytes.
  - **Transfer size:** 07 counts bytes with headers. Montserrat's response is 38,823 B for a 37,956 B file, so a page that also shows mono text would transfer about 61.5 KB (an estimate: no page uses the mono yet). That's at the ≈ 60 KB target and under the 70 KB limit.
- **Known gap: the fallback is sized for Montserrat Thin** (P0 exit audit, confirmed on the file).
  - next/font measures the file's default instance, and this variable file's default is weight 100 (`fvar` 100–900, default 100). The built fallback has `size-adjust: 110.19%`, which matches weight 100's average width of 0.5028 em.
  - The weights the site uses are wider: about 3.4% at 400, 9% at 700 and 11% at 800 (the audit's calculation from the file). So when Montserrat replaces the fallback, lines can re-wrap and content can move.
  - **The lab shows CLS 0 only because no swap happened:** in every run the font finished before the first paint.
  - `--dz-measure` (65ch) changes width with the swap too, because `ch` is measured in whichever font is showing.
  - **The owner's decision (P0 exit): fix it in P2, with the content pages.** The options are a re-instanced font file whose default is 400, or hand-written fallback faces per weight. Either way, an e2e test delays the font and records layout shifts, and `--dz-measure` moves to rem.

### 6. Gates
- **`check:contrast`** (`scripts/check-contrast.mjs`, part of `verify:fast`):
  - checks 33 listed pairs (44 checks), both themes, gradients at every stop
  - fails on a semantic token without a value in both themes, on an `@media` block, on anything outside the file's documented shape, and on colour syntax it can't read (`hsl()`, `oklch()`, `transparent`…) in a checked value
  - prints what it doesn't check yet
- **Page weight:**
  - `lighthouserc.cjs` drops `total:size` (fonts would break it). It asserts fonts ≤ 70 KB and ≤ 2 files, and images ≤ 200 KB, on every run.
  - `scripts/check-page-weight.mjs`, run by the `lhci` script, checks HTML + CSS + JS ≤ the framework baseline + 50 KB on every run, because lhci can't add resource types together.
  - The budget numbers stay in `lighthouserc.cjs`, exported as `budget` for the script. The lint gate forbids `require()`, so the planned shared `.cjs` module wasn't possible.

### 7. The option C tuning from 0014
- **G1 · `experimental.inlineCss`: not adopted.** The rule (Q5) was ≥ 100 ms better lab LCP at the median with every budget passing.
  - Median LCP was 2176 ms against 2180 ms without it, 4 ms better. FCP improved from 756 to 620 ms.
  - **Why lab LCP barely moved:** on localhost every request finishes before the first paint, so Lighthouse's simulation counts all of them (about 147 KB, framework scripts included) on the way to LCP. The lab LCP here works like a byte budget and can't see an earlier paint of the H1. The H1 paints at first paint, so the FCP gain is closer to what inlining changes (P0 exit audit).
  - It stays not adopted: the rule is the owner's (Q5), and the option is experimental, duplicates CSS into the RSC payload and can't be cached. It can be re-measured against field data once the Vercel preview has some.
- **G2 · Legacy polyfills: measured only.**
  - Lighthouse flags 13,697 B of `legacy-javascript` in one framework chunk: `Array.prototype.at`, `flat`, `flatMap`, `Object.fromEntries`, `Object.hasOwn`, `String.prototype.trimEnd`. Next's default targets (Chrome/Edge/Firefox 111, Safari 16.4) already support all of them.
  - Browserslist is the only documented lever, and it changes which browsers are supported. This code ships in Next's prebuilt runtime, so a Browserslist change may not remove it (not verified).
  - Any change is a separate owner decision.

## Measurements (placeholder Home, 5 Lighthouse runs, mobile, simulated slow 4G)

The CI figures come from each run's "Lighthouse run" annotations (GitHub Actions, workflow "CI", job "verify"). "After" is the branch head, `8e99f01`, unless the row says otherwise.

| | Before (no tokens, no fonts) | After (tokens, themes, fonts) |
|---|---|---|
| CI median LCP | 1513 ms (`fbb904d`, run 36720612524, Chrome 153, benchmark index 2605–3023) | **2216 ms** (`8e99f01`, run 36735955371, Chrome 154, 1774–3073). Earlier runs on this branch: 1709 ms (`c993ae6`, run 36732796940, Chrome 153, 2157–2470) and 2255 ms (`efb41ca`, run 36731693960, Chrome 154, 1779–2400) |
| Local median LCP (Windows, Chrome 154, CI environment) | 2031 ms | 2180 ms (2179 ms at the head) |
| CLS | 0 | 0 |
| Performance (CI median) | 100 | 99 (98–99 across the three runs above) |
| JavaScript | 139,668 B | 139,668 B |
| CSS | 2,667 B | 4,515 B |
| HTML | 3,137 B | 3,304–3,306 B (the font preload link; it varies by 2 B between builds) |
| Fonts | 0 | 38,823 B, 1 file (Montserrat) |
| HTML + CSS + JS | 145,472 B | 147,487–147,489 B of 190,868 B (42.4 KB left) |

- **Why LCP grew, locally +149 ms:** it's all render delay. On localhost the preloaded font finishes before the first paint, so Lighthouse's simulation puts its download on the way to LCP, and it shares the simulated bandwidth with the scripts.
- **On CI, single runs of the same commit vary a lot,** so the median moves between runs: `c993ae6` 1667–2118 ms, `efb41ca` 1661–2546 ms, the head 1666–2498 ms. The two Chrome 154 runs have medians near 2.2 s. Runner speed doesn't explain it, because 4 of the head's 5 runs had a faster runner than any of `c993ae6`'s. The cause isn't verified. Every local run (Chrome 154) is near 2.18 s.
- **The limit:** the head's median is 2216 ms, 284 ms under the 2.5 s hard limit, which the gate asserts on the median run. The slowest single CI run was 2498 ms (the head's run 1, benchmark index 1774, TBT 576 ms). The 1.5 s target was already missed before this change (0014).

## Consequences
- **Rule edits** (approved with the plan and the specimen answers):
  - 05 §1: every first visit is dark
  - 05 §2: the semantic tokens, `--dz-info`, the final light values and the colour rules above
  - 05 §3: the fonts and the final scale
  - 05 §4: spacing, layout and layer values
  - 05 §7: the focus ring is `--dz-focus`
  - 03 §1: `check:contrast`, and the page-weight check in `lhci`
  - conflict register: C34 (statement size), and C22 applied
- **Rule corrections at the P0 exit** (owner, 2026-09-30, after the reviews):
  - 05 §2: the CTA hover contrast (3.37:1), the grid token names, and what `check:contrast` checks
  - 05 §3: the font family tokens and the caption utilities
  - 05 §7: the focus ring's width and offset tokens
  - 07 §2 and §3: fonts can be variable or one static weight
  - conflict register: C35 (the removed `total:size` check)
- **P1 (logo, favicon, `themeColor`):** a `viewport` export with `colorScheme: 'dark'`, next to `themeColor`, so a slow first load shows a dark canvas before the stylesheet arrives (check that `global-not-found.tsx` supports it).
- **P2 (header and glass):**
  - The fallback-font fix and a rem-based `--dz-measure` (the known gap in §5, the owner's decision). 05 §3's "size-matched fallback" becomes true with it.
  - The theme switch stores the visitor's choice, and a no-flash script sets `data-theme='light'` before the first paint. It also goes into `global-not-found.tsx`, which skips the layout. The script sets the `color-scheme` meta for visitors who choose light.
  - Glass tokens start from this plan's finding: frost text on `--dz-glass-tint-min` 0.62 is 3.74:1 over a white background, so it needs 0.68, and mist needs 0.79.
  - A forced-colours e2e test: the focus ring stays a 2 px solid outline, and axe passes (13 §6).
  - `data-theme` goes on non-focusable containers only, because a focusable element's ring would take its own theme's colour but be drawn on its parent's background.
  - Headings get `overflow-wrap: break-word`, so a long word at the statement size doesn't scroll sideways at 320 px (WCAG 1.4.10).
  - The statement and display sizes grow about 126% and 134% at 200% zoom on a 1280 px screen. They reach 200% in Chrome and Firefox, but not in Safari (maximum 300%). The type components decide on a smaller `vw` slope or record the gap (WCAG 1.4.4).
- **Later plans:**
  - Light-mode status colours fail on the light page (`--dz-ok` 1.78:1, `--dz-warn` 1.62:1, `--dz-bad` 2.80:1). They get darker light variants in the first plan that uses them.
  - `--dz-border` (2.24:1 on navy) can't be a form field's only boundary (P6).
  - Readex Pro stops at weight 700, so the Arabic statement weight is decided in P11.
  - The first dynamic route adds `(en)/not-found.tsx`.
  - The 404's lone "home page" link gets a 44 px target (05 §7); 05 may add WCAG's exception for links inside running text.
  - `check:contrast` samples gradients between their stops (the dark zeta gradient dips to about 3.12:1 between `#4639F9` and `#602CFA`, against 3.13:1 at the stop), and the hero plan adds a pair for headline words over `--dz-glow-hero`.
  - The axe helper shared by `foundation.spec.ts` and `themes.spec.ts` moves to one file.
