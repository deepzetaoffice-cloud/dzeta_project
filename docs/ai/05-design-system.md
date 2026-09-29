# 05 · Design System

> **Applies to:** all styling, components, icons, motion · **Precedence:** below 00 · **Last reviewed:** 2026-09-29
> **Related:** `Planning Folder/For Ai/DeepZeta Icon Master Rules.md` (icons) · [07-performance-budget.md](07-performance-budget.md) (motion cost limits)

---

## 1. Principles

1. **Brand world:** dark navy is the default look, with a full light mode built from the same tokens (visitor can switch; `prefers-color-scheme` respected on first visit).
2. **70 / 20 / 10 balance:** 70% navy surfaces, 20% white/frost text, 10% brand colour.
3. **Tokens, never raw values.** Components use Tailwind classes generated from tokens. Raw hex/rgb/px values are allowed **only** in `src/styles/tokens.css` (enforced by `check:tokens`).
4. **Tailwind v4 is CSS-first.** Tokens are defined with `@theme` in `src/styles/tokens.css`. **There is no `tailwind.config.js`.** Don't create one.
5. **Logical CSS only** (`ms-/me-/ps-/pe-/start-/end-/text-start/text-end`, `margin-inline`, `inset-inline`) so Arabic RTL works without rework (see [11](11-i18n-rtl-readiness.md)).
6. **Signature, not decoration:** the logo's Z ribbon, four pixels and blue grid are the brand's motifs. Use 1–3 per page, purposefully.

---

## 2. Colour tokens (source values: blueprint v1; names final in Phase 0)

| Token | Value | Role |
|---|---|---|
| `--dz-navy` | `#010413` | Page background (dark) |
| `--dz-navy-900` | `#050A1C` | Deep surface |
| `--dz-navy-850` | `#08122E` | Card surface |
| `--dz-navy-800` | `#0B1C4A` | Raised / hover surface |
| `--dz-navy-700` | `#16224A` | Hairline borders |
| `--dz-border` | `#33457F` | Emphasised border |
| `--dz-slate` | `#5D73B8` | Labels, disabled |
| `--dz-mist` | `#9FB0E0` | Secondary text |
| `--dz-frost` | `#C9D4FF` | Body text on dark, icon lines |
| `--dz-white` | `#F4F6FB` | Headings / primary text (never pure `#FFF`) |
| `--dz-cyan` | `#08C6FD` | Accent, focus ring partner |
| `--dz-azure` | `#1A84FD` | Accent |
| `--dz-royal` | `#2139F6` | Accent |
| `--dz-violet` | `#7946FC` | Accent |
| `--dz-ice` | `#7CF3FF` | Focus ring |
| `--dz-sky` | `#3DA9FC` | Links |
| `--dz-ok` / `--dz-warn` / `--dz-bad` | `#22D3A6` / `#FFB547` / `#FF5A6E` | Status only |

**Gradients**
| Token | Value | Use |
|---|---|---|
| `--dz-grad-signal` | `linear-gradient(135deg,#08C6FD 0%,#1A84FD 50%,#7946FC 100%)` | Borders of feature cards, highlights |
| `--dz-grad-zeta` | `linear-gradient(150deg,#09E8FE 0%,#00B5FC 25%,#147BFC 50%,#4639F9 75%,#602CFA 100%)` | Wordmark "zeta", key headline words |
| `--dz-grad-action` | `linear-gradient(90deg,#08C6FD,#2F6BFF)` | **Primary CTA only** |
| `--dz-pixel-ai` | `#03D4FC → #04C1FD → #09A5FC` | Stage/pillar colour (see icon rules) |
| `--dz-pixel-web` | `#21BEFC → #3092FD → #4264FD` | Stage/pillar colour |
| `--dz-pixel-software` | `#3166FB → #2A4DFC → #3741FD` | Stage/pillar colour |
| `--dz-pixel-ranking` | `#6430FA → #592BFD → #4C27FB` | Stage/pillar colour |

**Rules**
- **One primary CTA style per view:** `--dz-grad-action` is reserved for the main action ("Book a free AI audit"). A second action uses an outline style.
- Pixel colours are the colour code for the four stages/pillars across menus, icons and page headers. One stage colour per component.
- Text contrast: WCAG AA (4.5:1 body, 3:1 large text and UI graphics). Check light mode separately.
- The logo's exact gradients live only in the logo component; never re-create the logo from tokens.

---

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Display & body (Latin) | Montserrat (variable) | Display 800, headings 700, body 400/500 |
| Arabic (after launch) | Readex Pro (variable) | Geometric match for Montserrat; Arabic subset |
| Data / labels | JetBrains Mono (variable) | Eyebrows, stats, code-like labels |

- Self-hosted via `next/font`, **variable files, subset**, `display: swap`. Never a Google Fonts `<link>`.
- Fluid type scale with `clamp()`, defined once as tokens (`--dz-text-display`, `--dz-text-h1`…`--dz-text-caption`). Final values set in Phase 0.
- Long headings use `text-wrap: balance`; body measure 60–70 characters.

---

## 4. Spacing, radius, elevation

- Spacing uses the Tailwind scale (4px base). Section rhythm and container widths are tokens (`--dz-container: 1140px` from the blueprint; others set in Phase 0).
- Radius tokens: `--dz-radius-sm` 8px, `--dz-radius-md` 12px, `--dz-radius-lg` 18px (cards), `--dz-radius-xl` 22px (feature panels), `--dz-radius-pill` 999px.
- Elevation is expressed with surface steps (navy-900 → 850 → 800) and borders, not heavy shadows. Glow effects use radial gradients, not `box-shadow` animation.

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

**Rules (from the performance constraint, enforced)**
1. Animate **`transform` and `opacity` only** (plus colour transitions).
2. **Native first.** CSS transitions, CSS scroll-driven animations, View Transitions, `@property`, SVG. GSAP only on page tier T2/T3 (not the icon story tiers above), loaded when visible. No `motion`/Framer Motion, no Lottie (decision 0005).
3. **Scroll storytelling, never scroll-jacking.** Never override the user's scroll.
4. **No endless loops** or constant background animation. Stories play once, triggered on view or interaction.
5. **Real-time 3D (WebGL):** at most one moment on Home, loaded after LCP (or on first scroll or tap) on capable devices, with a static SVG/CSS LCP element, and only while `lhci` still shows ≥ 95; allowed on page tier T3. Always a complete static fallback, gated on device capability, reduced motion and Save-Data (decision 0005). CSS 3D transforms are not "real-time 3D" and follow the normal motion rules.
6. **Glass blur** (`backdrop-filter`) only on the menu bar, modals and a few feature cards.
7. **`prefers-reduced-motion: reduce`** shows the final static state for everything.
8. Every animated or interactive element in a plan states **(a) its performance cost and (b) the mitigation.** Never present an effect as free.

---

## 6. Icons

Follow `Planning Folder/For Ai/DeepZeta Icon Master Rules.md` exactly: three tiers, the Zeta Pixel, the logo's four-pixel cluster for Tier 3, frost lines, CSS-only motion, RTL flip flags. Don't use a generic icon library for brand/service icons. A small set of plain UI icons (Tier 1) may be drawn in-house to the same rules.

---

## 7. Components

- Reuse → extend → create (see [06](06-code-standards.md) §3).
- Every component works at 360, 390, 768, 1024, 1280 and 1536px wide, keyboard-operable, with visible focus (`--dz-ice` ring).
- Touch targets ≥ 44×44px.
- States required where relevant: default, hover, focus-visible, active, disabled, loading, error, empty.
