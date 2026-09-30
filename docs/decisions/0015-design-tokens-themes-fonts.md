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
  - Montserrat is preloaded, because the H1 is the LCP element. The mono isn't preloaded, so a page downloads it only when it shows mono text.
  - Both use `display: swap` with next/font's size-matched Arial fallback (CLS 0).
  - No request goes to Google, and every build uses the same bytes.

### 6. Gates
- **`check:contrast`** (`scripts/check-contrast.mjs`, part of `verify:fast`):
  - checks 44 pairs, both themes, gradients at every stop
  - fails on a semantic token without a value in both themes, on an `@media` block, and on anything outside the file's documented shape
  - prints what it doesn't check yet
- **Page weight:**
  - `lighthouserc.cjs` drops `total:size` (fonts would break it). It asserts fonts ≤ 70 KB and ≤ 2 files, and images ≤ 200 KB, on every run.
  - `scripts/check-page-weight.mjs`, run by the `lhci` script, checks HTML + CSS + JS ≤ the framework baseline + 50 KB on every run, because lhci can't add resource types together.
  - The budget numbers stay in `lighthouserc.cjs`, exported as `budget` for the script. The lint gate forbids `require()`, so the planned shared `.cjs` module wasn't possible.

### 7. The option C tuning from 0014
- **G1 · `experimental.inlineCss`: not adopted.** The rule (Q5) was ≥ 100 ms better lab LCP at the median with every budget passing.
  - Median LCP was 2176 ms against 2180 ms without it, 4 ms better. FCP improved from 756 to 620 ms.
  - LCP here is set by the framework scripts, not by the stylesheet request.
- **G2 · Legacy polyfills: measured only.**
  - Lighthouse flags 13,697 B of `legacy-javascript` in one framework chunk: `Array.prototype.at`, `flat`, `flatMap`, `Object.fromEntries`, `Object.hasOwn`, `String.prototype.trimEnd`. Next's default targets (Chrome/Edge/Firefox 111, Safari 16.4) already support all of them.
  - Browserslist is the only documented lever, and it changes which browsers are supported. This code ships in Next's prebuilt runtime, so a Browserslist change may not remove it (not verified).
  - Any change is a separate owner decision.

## Measurements (placeholder Home, 5 Lighthouse runs, mobile, simulated slow 4G)

| | Before (no tokens, no fonts) | After (tokens, themes, fonts) |
|---|---|---|
| CI median LCP | 1513 ms (`fbb904d`, Chrome 153, benchmark index 2605–3023) | 1709 ms (`c993ae6`, Chrome 153, 2157–2470). A slower runner on `efb41ca` (Chrome 154, 1779–2400) gave 2255 ms, still within the gate |
| Local median LCP (Windows, Chrome 154, CI environment) | 2031 ms | 2180 ms |
| CLS | 0 | 0 |
| Performance (median) | 99–100 | 98–99 |
| JavaScript | 139,668 B | 139,668 B |
| CSS | 2,667 B | 4,535 B |
| HTML | 3,137 B | 3,304 B (the font preload link) |
| Fonts | 0 | 38,823 B, 1 file (Montserrat) |
| HTML + CSS + JS | 145,472 B | 147,507 B of 190,868 B (42.3 KB left) |

- **Why LCP grew, locally +149 ms and on CI about +200 ms at the median:** it's all render delay. On localhost the preloaded font finishes before the first paint, so Lighthouse's simulation puts its download on the way to LCP, and it shares the simulated bandwidth with the scripts.
- **The limit:** LCP stays under the 2.5 s hard limit. The 1.5 s target was already missed before this change (0014).

## Consequences
- **Rule edits** (approved with the plan and the specimen answers):
  - 05 §1: every first visit is dark
  - 05 §2: the semantic tokens, `--dz-info`, the final light values and the colour rules above
  - 05 §3: the fonts and the final scale
  - 05 §4: spacing, layout and layer values
  - 05 §7: the focus ring is `--dz-focus`
  - 03 §1: `check:contrast`, and the page-weight check in `lhci`
  - conflict register: C34 (statement size), and C22 applied
- **P2 (header and glass):**
  - The theme switch stores the visitor's choice, and a no-flash script sets `data-theme='light'` before the first paint.
  - Glass tokens start from this plan's finding: frost text on `--dz-glass-tint-min` 0.62 is 3.74:1 over a white background, so it needs 0.68, and mist needs 0.79.
- **Later plans:**
  - Light-mode status colours fail on the light page (`--dz-ok` 1.78:1, `--dz-warn` 1.62:1, `--dz-bad` 2.80:1). They get darker light variants in the first plan that uses them.
  - `--dz-border` (2.24:1 on navy) can't be a form field's only boundary (P6).
  - Readex Pro stops at weight 700, so the Arabic statement weight is decided in P11.
- **07 §2 wording:** it reads "Fonts (3 variable, subset)", while the mono is now one static weight. A wording change is proposed to the owner, and 07 isn't edited here.
