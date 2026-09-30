# 05 · Design System

> **Applies to:** all styling, components, icons, motion · **Precedence:** below 00 · **Last reviewed:** 2026-09-30
> **Related:** `Planning Folder/For Ai/DeepZeta Icon Master Rules.md` (icons) · [13-experience-design.md](13-experience-design.md) (effects, motion, interaction: the only home for effect rules) · [07-performance-budget.md](07-performance-budget.md) (motion cost limits) · [docs/design/](../design/README.md) (surface specs)

---

## 1. Principles

1. **Brand world:** dark navy is the default look, and every first visit is dark, whatever the system setting. A full light mode is built from the same tokens. The visitor switches to it, and the choice is remembered (P2 header). Browsers report "no preference" as light, so following the system would show most first visits the light theme (decision 0015).
2. **70 / 20 / 10 balance:** 70% navy surfaces, 20% white/frost text, 10% brand colour.
3. **Tokens, never raw values.** Components use Tailwind classes generated from tokens. Raw hex/rgb/px values are allowed **only** in `src/styles/tokens.css` (enforced by `check:tokens`).
4. **Tailwind v4 is CSS-first.** Tokens are defined with `@theme` in `src/styles/tokens.css`. **There is no `tailwind.config.js`.** Don't create one.
5. **Logical CSS only** (`ms-/me-/ps-/pe-/start-/end-/text-start/text-end`, `margin-inline`, `inset-inline`) so Arabic RTL works without rework (see [11](11-i18n-rtl-readiness.md)).
6. **Signature, not decoration:** the logo's Z ribbon, the four-pixel cluster and the blue grid are the brand's motifs. The grid is the Z0 background and doesn't count; use 1–3 **signature moments** per page, purposefully (e.g. the hero Z mark, The Assembly, The Landing). The single Zeta Pixel as a marker follows [13](13-experience-design.md) §8.
7. **Design language "Signal & Depth"** (decision 0008). Effect, motion and interaction rules live only in [13](13-experience-design.md); this file holds the tokens they use.

---

## 2. Colour tokens (source values: blueprint v1 and the colour system; where names differ, this file's names win (conflict C22); names and values final in P0, decision 0015, in `src/styles/tokens.css`)

| Token | Value | Role |
|---|---|---|
| `--dz-navy` | `#010413` | Page background (dark) |
| `--dz-navy-900` | `#050A1C` | Deep surface |
| `--dz-navy-850` | `#08122E` | Card surface |
| `--dz-navy-800` | `#0B1C4A` | Raised / hover surface |
| `--dz-navy-700` | `#16224A` | Hairline borders |
| `--dz-border` | `#33457F` | Emphasised border |
| `--dz-slate` | `#5D73B8` | Large labels and disabled states only (4.48:1 on navy, 0015) |
| `--dz-mist` | `#9FB0E0` | Secondary text |
| `--dz-frost` | `#C9D4FF` | Body text on dark, icon lines |
| `--dz-white` | `#F4F6FB` | Headings / primary text (never pure `#FFF`) |
| `--dz-cyan` | `#08C6FD` | Accent, focus ring partner |
| `--dz-azure` | `#1A84FD` | Accent |
| `--dz-royal` | `#2139F6` | Accent |
| `--dz-violet` | `#7946FC` | Accent |
| `--dz-ice` | `#7CF3FF` | Focus ring |
| `--dz-sky` | `#3DA9FC` | Links |
| `--dz-signal` | `#2F6BFF` | Solid primary fill: navy text (4.54:1); white text only in large text (4.16:1, 0015) |
| `--dz-violet-soft` | `#A78BFF` | Violet text on dark |
| `--dz-magenta` | `#A040F2` | Rare accent: gradient tails, tags |
| `--dz-ok` / `--dz-warn` / `--dz-bad` | `#22D3A6` / `#FFB547` / `#FF5A6E` | Status only. On dark only: they fail on the light page, so light variants come with their first use (0015) |
| `--dz-info` | `#3DA9FC` | Info status: the colour system's info tone (C22) |

**Gradients**
| Token | Value | Use |
|---|---|---|
| `--dz-grad-signal` | `linear-gradient(135deg,#08C6FD 0%,#1A84FD 50%,#7946FC 100%)` | Borders of feature cards, highlights |
| `--dz-grad-zeta` | `linear-gradient(150deg,#09E8FE 0%,#00B5FC 25%,#147BFC 50%,#4639F9 75%,#602CFA 100%)` | Wordmark "zeta", key headline words |
| `--dz-grad-action` | `linear-gradient(90deg,#08C6FD,#2F6BFF)` | **Primary CTA only** |
| `--dz-grad-action-deep` | `linear-gradient(90deg,#1A84FD 0%,#2139F6 100%)` | Primary CTA hover state (white text only at large sizes: about 3.6:1) |
| `--dz-grad-fold` | `linear-gradient(160deg,#006DE5 0%,#16C5FF 33%,#516CFC 67%,#7946FC 100%)` | Feature panels, illustrations, large shapes |
| `--dz-grad-line-cyan` | `linear-gradient(90deg,#00D8EE 0%,#058FEE 50%,#0D48E6 100%)` | Dividers and underlines (pairs with the violet line) |
| `--dz-grad-line-violet` | `linear-gradient(90deg,#4A22EA 0%,#662DE8 50%,#A040F2 100%)` | Dividers and underlines (pairs with the cyan line) |
| `--dz-glow-hero` | `radial-gradient(ellipse 48% 55% at 50% 40%, rgba(24,70,210,.55) 0%, rgba(12,34,120,.26) 45%, rgba(1,4,19,0) 78%)` | Static signal glow on the Z0 plane (hero, chapter openers) |
| `--dz-grid` | 1px lines `rgba(26,132,253,.07)` every 80px | The Z0 blueprint grid |
| `--dz-pixel-ai` | `#03D4FC → #04C1FD → #09A5FC` | Pillar colour (see icon rules) |
| `--dz-pixel-web` | `#21BEFC → #3092FD → #4264FD` | Pillar colour |
| `--dz-pixel-software` | `#3166FB → #2A4DFC → #3741FD` | Pillar colour |
| `--dz-pixel-ranking` | `#6430FA → #592BFD → #4C27FB` | Pillar colour |

Each pixel gradient runs top to bottom and has a `-solid` colour (used below 20 px) and a `-glow` colour, from the Icon Master Rules §5.2 (for example `--dz-pixel-ai-solid`, `--dz-pixel-ai-glow`).

**Rules**
- **One primary CTA style per view:** `--dz-grad-action` is reserved for the main action ("Book a free AI audit"). A second action uses an outline style.
- Pixel colours are the colour code for the four pillars (C6) across menus, icons and page headers. One pillar colour per component.
- Text contrast: WCAG AA (4.5:1 body, 3:1 large text and UI graphics), in both themes. `check:contrast` checks every token pair ([03](03-verification-gates.md)).
- **Gradient headline words** (`--dz-grad-headline`) sit on the page background, never on a card: the zeta gradient's violet stop is 3.13:1 on navy but 2.83:1 on `--dz-navy-850` (0015).
- The logo's ribbon and wordmark gradients live only in the logo component; never re-create the logo from tokens. The four pixel gradients are tokens (`--dz-pixel-*`) used by icons, The Assembly and The Landing (decision 0008).

**Light mode ("paper blueprint")** · final (P0, decision 0015), contrast-checked by `check:contrast`

| Role | Light value | Token |
|---|---|---|
| Page background | `#F4F6FB` | `--dz-paper` |
| Card surface | `#FFFFFF` | `--dz-card-light` |
| Body text | `#16224A` | `--dz-ink` |
| Secondary text | `#34446F` | `--dz-ink-muted` |
| Headings | `#010413` | `--dz-navy` |
| Links | `#1557C9` | `--dz-link-light` |
| Accent | `#0A6BE0` | `--dz-accent-light` |
| Hairline | `#16224A` at 14% | `--dz-hairline-light` |
| Focus ring | `#2139F6` | `--dz-royal` |
| Zeta gradient (light) | `linear-gradient(150deg,#0094D3,#0A6BE0,#4639F9,#602CFA)`: the first stop moved from `#0098D8`, which was 2.996:1 on the page (0015) | `--dz-grad-zeta-light` |

The header, the CTA band and the footer stay navy in both themes, because the logo's white "Deep" needs navy.

**Semantic tokens** (they switch with the theme; components use these, never a primitive that changes meaning between themes)

| Token | Dark | Light | Tailwind |
|---|---|---|---|
| `--dz-bg` | `--dz-navy` | `--dz-paper` | `bg-bg` |
| `--dz-surface` | `--dz-navy-850` | `--dz-card-light` | `bg-surface` |
| `--dz-text` | `--dz-frost` | `--dz-ink` | `text-fg` |
| `--dz-text-strong` | `--dz-white` | `--dz-navy` | `text-fg-strong` |
| `--dz-text-muted` | `--dz-mist` | `--dz-ink-muted` | `text-fg-muted` |
| `--dz-link` | `--dz-sky` | `--dz-link-light` | `text-link` |
| `--dz-focus` | `--dz-ice` | `--dz-royal` | `outline-focus` |
| `--dz-hairline` | `--dz-navy-700` | `--dz-hairline-light` | `border-hairline` |
| `--dz-grad-headline` | `--dz-grad-zeta` | `--dz-grad-zeta-light` | none (a background-clip text fill) |

- **Dark** is `:root` and `[data-theme='dark']`. **Light** is `[data-theme='light']` only; `tokens.css` has no `prefers-color-scheme` block (§1).
- **Any element can carry `data-theme`.** It then paints its own `--dz-bg` and `--dz-text`: the header, the CTA band and the footer use `data-theme='dark'`.
- **Brand primitives are utilities too** (`bg-navy-850`, `text-white`, `bg-signal`…), for surfaces that never switch.
- **Tailwind's default colours, fonts, sizes and radii are removed,** so an off-brand value can't be written.

---

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Display & body (Latin) | Montserrat (variable) | Display 800, headings 700, body 400/500 |
| Arabic (after launch) | Readex Pro (variable) | Geometric match for Montserrat; Arabic subset |
| Data / labels | JetBrains Mono, one static 500 weight (0015) | Eyebrows, stats, code-like labels |

- **Self-hosted** through `next/font/local` (`src/styles/fonts.ts`), from the latin files in `src/styles/fonts/` with their OFL licences, `display: swap`, with the size-matched fallback.
  - Only Montserrat is preloaded; the mono loads only on pages that show it.
  - Never a Google Fonts `<link>`, and no request goes to Google.
  - The mono is one static weight, because the variable 400–600 file put the fonts over the ≈ 60 KB target ([07](07-performance-budget.md) §2).
- **The type scale** (final, P0, decision 0015). Sizes run fluidly from 360 to 1280 px wide with `clamp(min, rem + vw, max)`; the rem part keeps browser zoom working (WCAG 1.4.4).

  | Token | Size (360 → 1280 px) | Weight / leading / tracking | Tailwind |
  |---|---|---|---|
  | `--dz-text-statement` | 2.6 → 5.58rem | 800 / 0.98 / −0.035em | `text-statement` |
  | `--dz-text-display` | 2.2 → 4.2rem | 800 / 1.02 / −0.035em | `text-display` |
  | `--dz-text-h1` | 2 → 3.2rem | 700 / 1.05 / −0.03em | `text-h1` |
  | `--dz-text-h2` | 1.6 → 2.4rem | 700 / 1.1 / −0.02em | `text-h2` |
  | `--dz-text-h3` | 1.3 → 1.9rem | 700 / 1.25 / −0.02em | `text-h3` |
  | `--dz-text-h4` | 1.25rem | 700 / 1.3 | `text-h4` |
  | `--dz-text-lead` | 1.125 → 1.3rem | 400 / 1.55 | `text-lead` |
  | `--dz-text-body` | 1rem | 400 / 1.6 | `text-body` |
  | `--dz-text-small` | 0.875rem | 400–500 / 1.5 | `text-small` |
  | `--dz-text-caption` | 0.75rem | JetBrains Mono 500 / 1.4 / 0.04em. Uppercase eyebrows use `--dz-text-eyebrow-tracking`, 0.16em (`tracking-eyebrow`) | `text-caption` |

- **Statement type:** `--dz-text-statement`, a size above `--dz-text-display` for the one statement headline per page ([13](13-experience-design.md) §2). Montserrat 800–900, tight leading and tracking. Arabic statements use Readex Pro with no letter-spacing ([11](11-i18n-rtl-readiness.md) §1).
  - Readex Pro stops at weight 700, so the Arabic statement weight is decided in P11.
  - The maximum is 5.58rem, the largest size the owner saw in the Lab (conflict C34 corrects 0009's 9rem).
- Headings use `text-wrap: balance` (a base style); body measure 60–70 characters (`--dz-measure`, 65ch).

---

## 4. Spacing, radius, elevation

- Spacing uses the Tailwind scale (4px base). The layout tokens (P0, 0015):
  - `--dz-container` 1140px (`max-w-page`, from the blueprint)
  - `--dz-measure` 65ch (`max-w-measure`)
  - `--dz-gutter` 1 → 2.5rem (`px-gutter`)
- Radius tokens: `--dz-radius-sm` 8px, `--dz-radius-md` 12px, `--dz-radius-lg` 18px (cards), `--dz-radius-xl` 22px (feature panels), `--dz-radius-pill` 999px.
- Elevation is expressed with surface steps (navy-900 → 850 → 800) and borders, not heavy shadows. Glow effects use radial gradients, not `box-shadow` animation.
- **Breathing room:** `--dz-space-section` < `--dz-space-chapter` < `--dz-space-statement`, for the loud/quiet rhythm ([13](13-experience-design.md) §2): 3 → 6rem, 4.5 → 8.75rem (the Lab's 72 → 140 px) and 6 → 12rem (`py-section`, `py-chapter`, `py-statement`; 0015).
- **Glass tokens** (used by the glass ladder, 13 §4.1): `--dz-glass-tint`, `--dz-glass-tint-min` (the minimum tint behind text that keeps AA contrast whatever passes behind it), `--dz-glass-edge` (hairline), `--dz-glass-highlight` (top-edge light), `--dz-glass-blur` (`glass-live` only), `--dz-grain` (the shared `glass-frost` texture, ≤ 2 KB).
  - Lab-confirmed values (0009): `--dz-glass-blur` 17px and `--dz-glass-tint-min` 0.62. P0 re-checks contrast in both themes and GPU cost on a budget Android phone.
  - **P0 finding (0015):** at 0.62, frost text over a white background is 3.74:1. Frost body text needs a tint of 0.68, and mist needs 0.79. The glass tokens arrive with the glass effects in P2.
- **Stacking:** a `--dz-layer-*` z-index scale: base 0, raised 10, sticky 20, header 30, overlay 40, sheet 50, toast 60, consent 70 (0015), used as `z-(--dz-layer-header)`. It is separate from the visual depth planes Z0–Z3.

---

## 5. Motion (performance-first)

| Token | Value | Use |
|---|---|---|
| `--dz-ease-out` | `cubic-bezier(.2,.8,.2,1)` | Reveals, settling, colour |
| `--dz-ease-pop` | `cubic-bezier(.2,.9,.3,1.35)` | Small arrivals (pixels, badges) |
| `--dz-ease-travel` | `cubic-bezier(.65,0,.3,1)` | Movement along a path |
| `--dz-dur-fast` | 150ms | Hover, focus, state |
| `--dz-dur-base` | 250ms | Small transitions |
| `--dz-dur-story` | ≤ 900ms (Tier 2), ≤ 1.6s (Tier 3) | Icon/illustration stories |
| `--dz-dur-flow-step` | set in P0 / the Design Lab | One step of a story graphic (13 §4.8) |
| `--dz-tilt-max` | 5deg (Lab-confirmed, 0009) | `pointer-tilt` |
| `--dz-magnet-max` | 7px (Lab-confirmed, 0009) | `pointer-magnet` |

**Rules (from the performance constraint, enforced)**
1. Animate **`transform` and `opacity` only** (plus colour transitions).
2. **Native first.** CSS transitions, CSS scroll-driven animations, View Transitions, `@property`, SVG. GSAP only on page tier T2/T3 (not the icon story tiers above), loaded when visible. No `motion`/Framer Motion, no Lottie (decision 0005). On T1, "native" also covers first-party vanilla JavaScript within the caps in [13](13-experience-design.md) §7 (decision 0008).
3. **Scroll storytelling, never scroll-jacking.** Never override the user's scroll.
4. **No endless loops** or constant background animation. Stories play once, triggered on view or interaction (responsive motion, 13 §2).
5. **Real-time 3D (WebGL):** at most one moment on Home, loaded after LCP (or on first scroll or tap) on capable devices, with a static SVG/CSS LCP element, and only while `lhci` still shows ≥ 95; allowed on page tier T3. Always a complete static fallback, gated on device capability, reduced motion and Save-Data (decision 0005). CSS 3D transforms are not "real-time 3D" and follow the normal motion rules.
6. **Glass follows the glass ladder** (13 §4.1). Live blur (`glass-live`, `backdrop-filter`) only on the menu bar, the mega menu, modals and sheets, and ≤ 2 feature panels per viewport. Everywhere else the frosted look is baked (`glass-frost`), at almost no cost.
7. **`prefers-reduced-motion: reduce`** and the Reduce effects switch (13 §2) show the final static state for everything.
8. Every animated or interactive element in a plan states **(a) its performance cost and (b) the mitigation.** Never present an effect as free.
9. **Effects come only from the library** in 13 §4, cited by ID in the plan's effect register (13 §10).

---

## 6. Icons

Follow `Planning Folder/For Ai/DeepZeta Icon Master Rules.md` exactly: three tiers, the Zeta Pixel, the logo's four-pixel cluster for Tier 3, frost lines, CSS-only motion, RTL flip flags. Don't use a generic icon library for brand/service icons. A small set of plain UI icons (Tier 1) may be drawn in-house to the same rules. Outside icons, the four-pixel cluster appears only in The Assembly, The Landing and the miniature nav marker (13 §8). Icons are drawn to the approved prototype (`Planning Folder/DeepZeta Signature Icon Prototype.html`, decision 0009). Each surface spec in `docs/design/` lists its icons.

---

## 7. Components

- Reuse → extend → create (see [06](06-code-standards.md) §3).
- Every component works at 360, 390, 768, 1024, 1280 and 1536px wide, keyboard-operable, with visible focus (the `--dz-focus` ring: ice on dark, royal on light; a base style, 0015).
- Touch targets ≥ 44×44px.
- States required where relevant: default, hover, focus-visible, active, disabled, loading, error, empty.
