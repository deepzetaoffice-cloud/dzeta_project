# 05 · Design System

> **Applies to:** all styling, components, icons, motion tokens · **Precedence:** below 00 · **Last reviewed:** 2026-10-18 (rewritten from the approved Figma file, decision 0033)
> **Source of truth:** Figma "Deepzeta AI · Website v3", file `tYw7bSV9m4zX2vrVs7XYpE`: the Design system page (`1:3`, foundations sheet `30:33`) and its 8 variable collections, 15 text styles, 14 paint styles and 6 effect styles. Where this file and Figma disagree, Figma wins and this file is corrected.
> **Related:** `Planning Folder/For Ai/DeepZeta Icon Master Rules.md` (icons) · [13-experience-design.md](13-experience-design.md) (effects, motion, interaction: the only home for effect rules) · [07-performance-budget.md](07-performance-budget.md) (loading habits) · [docs/design/](../design/README.md) (surface specs)

---

## 1. Principles

1. **Direction B "Spectrum", with direction C's diagrams** (decision 0033).
   - A **light canvas** (`bg/canvas`, ink/50).
   - Each hero sits on **the stage**: a rounded panel filled with the logo's gradient, inset from the viewport by `layout/stage-inset` with `radius/stage`.
   - Colour comes from the stage, the four pillar gradients, the bright slabs and the photos.
   - Explanatory moments use **C's diagram language**: numbered steps, mono labels, the system diagram and the scrubber.
2. **Solid violet is the action colour** (`action/primary`, `#6430FA`; the owner: "use Solid Violet instead of green"). There is no green or lime anywhere. WhatsApp's own green appears only inside the chat mock (`bg/chat/*`).
3. **Light only in V1** (C77). There is no dark mode, no theme switch and no `data-theme`. Inverse surfaces (`bg/inverse`) are local panels, not a theme.
4. **Tokens, never raw values.** Components use Tailwind classes generated from tokens. Raw colour, px and easing values are allowed **only** in `src/styles/tokens.css` (enforced by `check:tokens`). That includes copied KokonutUI and Aceternity components once restyled.
5. **Tailwind v4 is CSS-first.** Tokens are defined with `@theme` in `src/styles/tokens.css`. **There is no `tailwind.config.js`.** Don't create one. Tailwind's default colours, fonts, sizes and radii are removed, so an off-brand value can't be written.
6. **The token names are the Figma names.** Every Figma variable carries WEB code syntax (`var(--dz-…)`), and `tokens.css` defines exactly those custom properties, so a design value and its code are one name.
7. **Logical CSS only** (`ms-/me-/ps-/pe-/start-/end-/text-start/text-end`, `margin-inline`, `inset-inline`) so Arabic RTL works without rework (see [11](11-i18n-rtl-readiness.md)).
8. **Mobile-first.** Every surface is designed at 390 px first, then 1440 px. Each piece is checked side by side with its Figma frames at 390, 834 and 1440 px.

---

## 2. Colour

### 2.1 Primitives (`--dz-p-*`; never used directly in components)

| Group | Tokens (Figma name → value) |
|---|---|
| Pillar · AI Automation | `pillar/ai/1` `#03D4FC` · `/2` `#04C1FD` · `/3` `#09A5FC` |
| Pillar · Websites | `pillar/websites/1` `#21BEFC` · `/2` `#3092FD` · `/3` `#4264FD` |
| Pillar · Software | `pillar/software/1` `#3166FB` · `/2` `#2A4DFC` · `/3` `#3741FD` |
| Pillar · Growth & Ranking | `pillar/growth/1` `#6430FA` (the solid violet) · `/2` `#592BFD` · `/3` `#4C27FB` |
| Stage | `stage/1` `#2563FD` · `stage/2` `#3A4BFD` · `stage/3` `#5A2BFD` |
| Ink | `ink/950` `#0B0A2A` · `/900` `#14133A` · `/700` `#2E2D57` · `/600` `#4B4F66` · `/500` `#6B6F86` · `/400` `#9497AC` · `/300` `#C3C5D3` · `/200` `#DDE0EA` · `/100` `#ECEEF5` · `/50` `#F7F7FF` · `white` `#FFFFFF` |
| Vibrant (slabs) | `vibrant/sun` `#FFE55C` · `/apricot` `#FFB867` · `/blush` `#FFA8DA` · `/peach` `#FFD0B0` · `/ice` `#B8FFF6` · `/orchid` `#FFB0F3` · `/cream` `#FFD9B8` |
| Glow and signal | `glow/cyan` `#03D4FC` · `glow/pink` `#FF4FA3` · `signal/orange` `#FF6B2C` |
| WhatsApp (chat mock only) | `whatsapp/green` `#1DAA61` · `/bubble` `#D9FDD3` · `/wallpaper` `#EFE7DD` |
| Pillar washes | `wash/ai` `#DAF6FE` · `wash/websites` `#DDEAFF` · `wash/software` `#E0E4FF` · `wash/growth` `#E9E0FF` |
| Status | `status/success` `#127A43` · `status/error` `#D93644` · `status/warning` `#B76E00` |
| Alpha and violet | `white/16` `#FFFFFF29` · `white/45` `#FFFFFF73` · `white/92` `#FFFFFFEB` · `ink/shadow` `#0B0A2A24` · `ink/scrim-24` `#0B0A2A3D` · `violet/300` `#B9A2FF` · `violet/100` `#EFE9FF` |

### 2.2 Semantic colour (`--dz-color-*`; components use these)

| Token | → | Role |
|---|---|---|
| `bg/canvas` | ink/50 | The page background |
| `bg/surface` · `bg/surface-muted` | white · ink/100 | Cards, panels · muted panels |
| `bg/inverse` | ink/950 | Inverse panels (the terminal, the code side) |
| `bg/glass-on-color` | white/16 | Chips and buttons on the stage |
| `bg/glass-header` | white/92 | The header pill over light pages |
| `bg/stage/1–3` | stage/1–3 | The stage gradient stops |
| `bg/wash/{pillar}` | wash/* | A pillar's soft section background |
| `bg/chat/wallpaper` · `bg/chat/bubble-own` | whatsapp/* | Inside the chat mock only |
| `bg/violet-soft` · `bg/scrim` | violet/100 · ink/scrim-24 | Soft violet chips · the dim behind dialogs |
| `text/primary` · `text/secondary` · `text/tertiary` | ink/950 · ink/600 · ink/500 | Text on light |
| `text/on-color` · `text/on-vibrant` | white · ink/950 | Text on the stage and pillar fills · text on slabs |
| `text/link` | pillar/software/3 | Links |
| `text/violet` · `text/online` | pillar/growth/1 | Violet text, the rotating phrase, the online state |
| `text/signal` | signal/orange | Never body text (C80): numbers and markers beside a label only |
| `text/error` | status/error | Errors |
| `action/primary` → `action/primary-end` | pillar/growth/1 → /3 | The primary button (solid violet; `-end` for its pressed and hover depth) |
| `action/on-color` · `action/inverse` · `action/whatsapp` | growth/1 · ink/950 · growth/1 | Buttons on the stage · inverse buttons · WhatsApp buttons (violet, never green) |
| `accent/{ai,websites,software,growth}` | the pillar's 3rd, 2nd, 2nd and 2nd stops | A pillar's accent line, border and chip |
| `accent/violet` · `accent/online` · `accent/signal` · `accent/violet-on-dark` | growth/1 · growth/1 · signal/orange · violet/300 | Markers |
| `border/default` · `border/strong` · `border/on-color` | ink/200 · ink/300 · white/45 | Hairlines |
| `border/focus` · `border/error` | pillar/software/3 · status/error | The focus ring · errors |
| `shadow/ink` | ink/shadow | Every elevation shadow |

### 2.3 Gradients and slabs (from the paint styles)

| Token | Stops | Use |
|---|---|---|
| `--dz-grad-pillar-ai` | `#03D4FC` → `#04C1FD` → `#09A5FC` | AI Automation (pixels, door card, chips) |
| `--dz-grad-pillar-websites` | `#21BEFC` → `#3092FD` → `#4264FD` | Websites |
| `--dz-grad-pillar-software` | `#3166FB` → `#2A4DFC` → `#3741FD` | Software |
| `--dz-grad-pillar-growth` | `#6430FA` → `#592BFD` → `#4C27FB` | Growth & Ranking |
| `--dz-grad-logo` | `#03D4FC` → `#3092FD` → `#4C27FB` | The logo spectrum: key words, the footer wordmark spotlight |
| `--dz-grad-stage` | `#2563FD` → `#3A4BFD` → `#5A2BFD` | The stage |
| `--dz-grad-action` | `#6430FA` → `#4C27FB` | The primary button's depth on hover and press only; at rest it is solid |
| `--dz-slab-1` … `--dz-slab-6` | white · sun · blush · ice · peach · orchid | The hero rotator: 01 Business-centric · 02 Growth formula · 03 Branding · 04 Custom-coded websites · 05 AI automation · 06 Social media strategy |

- The pillar gradients are the logo's own pixel colours, unchanged (Icon Master Rules §5.2). Inside a pixel they run top to bottom; elsewhere they run as each Figma frame draws them. `tokens.css` holds the direction, so a component never writes an angle.
- One pillar colour per component. The pillars are the colour code across menus, cards and page heroes (C6).

### 2.4 Contrast rules (`check:contrast`, WCAG 2.x)

- **Text:** 4.5:1; large text (24 px, or 18.66 px bold) and UI parts 3:1. Checked at every gradient stop.
- **Pairs that pass and are gated:**
  - `text/primary`, `/secondary` and `/tertiary` on the canvas and on white
  - white on each stage stop, on `action/primary` and on the Software and Growth pillar fills
  - violet on every slab, as large text: the rotating phrase is display type
  - the focus ring
- **White text fails on the AI Automation and Websites pillar starts**, so text on those fills is ink (`text/on-vibrant`).
- **Three usage rules from the gate (C85):**
  - On the stage's 16% glass fill, only large labels (≥ 18.67 px bold); otherwise an On colour control drops the fill for a `border/on-color` edge.
  - Error text sits only on white surfaces.
  - A form field's edge is `--dz-color-border-field` (ink/500, 4.95:1), never `border/strong` (1.7:1).
- **Reported, never failing:** the pillar pixels and signal orange, which never carry meaning alone (C38, C80).
- **Status colours** are the light-canvas set above.

---

## 3. Typography

| Family | Token | Role |
|---|---|---|
| **Unbounded** (variable) | `--dz-font-family-display` · `font-display` | Display and headings |
| **Figtree** (variable) | `--dz-font-family-body` · `font-body` (the base) | Body and UI |
| **Geist Mono** | `--dz-font-family-mono` · `font-mono` | Labels, steps, code |
| Readex Pro (after launch) | — | Arabic, word-level only, no letter-spacing ([11](11-i18n-rtl-readiness.md) §1) |

- **Self-hosted through `next/font`**, latin subset, `display: swap`, with `next/font`'s own size-adjusted fallbacks. No Google Fonts `<link>`, and no runtime request to Google.
- **Weights in use:** Unbounded 500 and 600; Figtree 400, 500, 600 and 700; Geist Mono 400 and 500 (`--dz-font-weight-regular|medium|semibold|bold`).

**The type scale** (the text styles; the sizes are the Type collection's Mobile / Tablet / Desktop modes, at 390, 834 and 1440 px)

| Style | Tailwind | Font | Size (M / T / D px) | Line height · tracking |
|---|---|---|---|---|
| Display/Hero word | `text-hero-word` | Unbounded 600 | 42 / 64 / 88 | 108% · −4% |
| Display/Hero line | `text-hero-line` | Unbounded 500 | 25 / 40 / 60 | 115% · −3% |
| Heading/H2 | `text-h2` | Unbounded 500 | 32 / 44 / 60 | 110% · −3% |
| Heading/H3 | `text-h3` | Unbounded 500 | 24 / 26 / 30 | 115% · −2% |
| Heading/H4 | `text-h4` | Figtree 700 | 20 / 22 / 24 | 125% · −1% |
| Body/Lead | `text-lead` | Figtree 400 | 17 / 18 / 20 | 155% |
| Body/Default · Body/Strong | `text-body` (+ `font-semibold`) | Figtree 400 · 600 | 16 / 16 / 17 | 160% |
| Body/Small | `text-small` | Figtree 400 | 14 / 14 / 15 | 150% |
| UI/Button L · M | `text-button-l` · `text-button-m` | Figtree 700 | 17 · 15 | 120% |
| UI/Nav | `text-nav` | Figtree 600 | 15 | 120% |
| UI/Caption | `text-caption` | Figtree 500 | 13 | 140% |
| Mono/Label | `text-label` | Geist Mono 400, uppercase | 11 / 11 / 12 | 130% · +3% |
| Mono/Step | `text-step` | Geist Mono 500 | 11 / 11 / 12 | 130% · +2% |

- **Fluid between the modes:** each size runs from its Mobile value at 390 px to its Desktop value at 1440 px with `clamp(min, rem + vw, max)`. The Tablet values fall on that line within 3 px. The rem part keeps browser zoom working (WCAG 1.4.4).
- **Headings:** each page's H1 uses Hero line (Home pairs it with the Hero word); H2–H4 as above. `text-wrap: balance` and `overflow-wrap: break-word` are base styles. The body measure is 60–75 characters.

---

## 4. Layout, spacing, radius, elevation, layers

**Layout** (the Layout collection, Mobile / Tablet / Desktop; fluid like the type)

| Token | M / T / D | Use |
|---|---|---|
| `--dz-layout-gutter` | 16 / 24 / 32 px | The page's side gutter |
| `--dz-layout-section-y` | 56 / 72 / 96 px | A section's block padding |
| `--dz-layout-content-max` | 358 / 786 / 1376 px | The content width (1376 px is the maximum at any width) |
| `--dz-layout-header-height` | 64 / 72 / 88 px | The header's reserved height |
| `--dz-layout-stage-inset` | 8 / 12 / 16 px | The stage's inset from the viewport |
| `--dz-layout-columns` · `-column-gap` | 4 / 8 / 12 · 12 / 16 / 24 px | The grid |
| `--dz-layout-card-gap` | 16 / 16 / 24 px | Between cards |

- **Breakpoints:** base (360–767), `md` 768 (8 columns), `lg` 1024 (12 columns, desktop layouts), `xl` 1280 (the desktop header and the mega menu), `2xl` 1536.
- **Checks:** every component works at 360, 390, 834, 1024, 1280, 1440 and 1536 px, with no sideways scroll.

**Spacing** (`--dz-space-*`, the Tailwind spacing scale): 0 · 1 = 4 px · 2 = 8 · 3 = 12 · 4 = 16 · 5 = 20 · 6 = 24 · 8 = 32 · 10 = 40 · 12 = 48 · 16 = 64 · 20 = 80 · 24 = 96 · 30 = 120. Written in rem in `tokens.css`.

**Radius** (`--dz-radius-*`): `xs` 6 · `sm` 10 · `md` 14 · `lg` 20 · `xl` 28 · `2xl` 34 · `stage` 44 · `full` 999 px.

**Elevation** (the effect styles; colour `shadow/ink`, ink at 14%)

| Token | Shadow | Use |
|---|---|---|
| `--dz-elevation-1` | 0 12 px 30 px | Cards at rest |
| `--dz-elevation-2` | 0 20 px 50 px | Hover, floating panels |
| `--dz-elevation-3` | 0 40 px 80 px | Overlays: the mega menu, dialogs |
| `--dz-glow-violet` · `-white` · `-cyan` | 0 0 60 px, violet at 50%, white and cyan at 55% | The stage's moments only (the phone, the active node) |

- Elevation is a shadow token, never a hand-written `box-shadow`. A shadow is never animated: a hover swaps the token, and the lift is a transform (13 §3).

**Focus** (a base style, and `consent.spec.ts` reads the two widths): `--dz-focus-width` 2 px and `--dz-focus-offset` 2 px. The ring is 2 px of `border/focus` (`#3741FD`) with a 2 px white gap, so it shows on the stage and on light.

**Stacking** (`--dz-layer-*`, used as `z-(--dz-layer-header)`): base 0, raised 10, sticky 20, header 30, overlay 40, sheet 50, toast 60, consent 70.

---

## 5. Motion tokens

The rules for using them live only in [13](13-experience-design.md) (§2–§3).

| Token | Value | Use |
|---|---|---|
| `--dz-motion-duration-press` | 160 ms | Press and release |
| `--dz-motion-duration-fast` | 180 ms | Small state changes |
| `--dz-motion-duration-base` | 220 ms | Hover, accordion, cross-fades |
| `--dz-motion-duration-menu` | 250 ms | The mega menu, the header condensing |
| `--dz-motion-duration-exit` | 320 ms | Exits (the rotator's letters) |
| `--dz-motion-duration-story` | 560 ms | Story steps, the rotator's entry, the industry flip |
| `--dz-motion-duration-sweep` | 900 ms | Single sweeps |
| `--dz-motion-duration-dwell` | 2400 ms | The rotator's dwell per phrase |
| `--dz-motion-stagger-letter` · `-item` | 18 ms · 50 ms | Letter and item staggers |
| `--dz-motion-scale-press` | 0.97 | `press-scale` |
| `--dz-motion-tilt-max-deg` | 6deg | `door-tilt` |
| `--dz-motion-parallax-photo` | 0.9 | Photo depth inside cards (`industry-rail` uses 0.85) |
| `--dz-motion-ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entries, hovers, most UI |
| `--dz-motion-ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | Moves from place to place, exits |
| `--dz-motion-ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | The mobile menu sheet |
| `--dz-motion-ease-hover` | `ease` | Colour-only hovers |

GSAP and Motion read these values from the CSS custom properties (or a typed mirror generated from `tokens.css`), never from literals in component code.

---

## 6. Icons and brand marks

- **UI glyphs:** the 18 Figma glyphs (page Design system, frame `33:33`), each 24 × 24 with a 1.8 stroke and its colour set by its parent: arrow up-right, arrow right, chevron down, menu, close, pause, play, WhatsApp, phone, send, plus, minus, check, search, calendar, mail, globe, sparkle.
  - They are in-house SVG, never an icon library (N2); copied components swap their `lucide-react` icons for these.
  - Decorative unless they stand alone, then `aria-label` on the control.
- **Platform marks:** the WhatsApp glyph uses the official WhatsApp mark's shape in one colour, never a redrawn variant. Other platform names appear as text (the platform strip).
- **Pillar pixels:** the four "Pillar pixels" marks (Figma `Mock/Pillar pixels · {pillar}`) are built from the logo's pixels in the pillar gradients, upright and never rotated or outlined. They mark a pillar in the doors, the mega menu, the mobile menu, the services hub and the service cards.
- **Service icons (Tier 2 and Tier 3):** not used in the v3 screens. If a later surface adds them, they follow the Icon Master Rules redrawn for light (lines in `text/primary`, the pixel in its pillar gradient, C38).
- **The logo:**
  - Header and light surfaces: the owner's `DeepZeta_Wordmark_D_As_Symbol_Plus_Pixels_WhiteBG.svg` (Figma `2:337`). Dark plates: the locked logo.
  - Both are served as they are, scaled only, never edited, recoloured or redrawn.
  - Adding the white-background files to the repo needs the owner's approval (C78).
  - In the stacked and domain lockups the tagline is near-white, so they sit only where the tagline may disappear.

---

## 7. Components (Figma page Design system)

Reuse → extend → create ([06](06-code-standards.md) §3). Each component maps to one Figma component set; its variants are its props.

| Component | Figma | Variants · notes |
|---|---|---|
| Button | `33:213` | Style Primary (solid violet) · Secondary · On colour (glass on the stage) · Inverse · Link; Size L · M; with or without an icon. Press: `press-scale` |
| Icon button | `33:239` | Style Primary · Glass · Inverse · Surface; Size 48 · 32 (the 32 px size gets padding to a 44 px hit area). Send, menu, pause, WhatsApp, carousel arrows |
| Chip | `34:95` | Glass · Outline · Soft violet · Pillar ×4 (with the pillar square) · Mono label; optional dot |
| Status island | `34:105` | Compact · Expanded; "Agent online", shown only while the WhatsApp agent is live (`status-pulse`, `status-expand`) |
| Nav item | `34:126` | Link · Menu; Default · Hover · Active (violet + the Zeta pixel) · Open |
| Text field · Textarea · Select · Checkbox | `34:160` · `34:162` · `34:166` · `34:180` | Label above, a 48 px input, helper or error below (`aria-describedby`); Focus is 2 px `border/focus` |
| AI input | `34:199` | Idle · Typing; a mode chip toggles Website / WhatsApp mode; opens the agent demo (KokonutUI AI-02, restyled) |
| Newsletter field | `34:201` | Email + Subscribe, double opt-in; ships only with its service (C84) |
| Door card | `35:178` | One per pillar: the pillar gradient, the video loop with its poster, `door-tilt`, `door-video` |
| Service card | `35:316` | Per pillar, Default · Hover: the whole card is one link; hover takes the pillar accent, Elevation 2 and `hover-lift` |
| Step card · Concept card | `35:318` · `35:334` | How we work · labelled concepts ("Concept by Deepzeta AI · fictional business", C18) |
| FAQ item | `35:333` | Closed · Open (Radix Accordion, `accordion`); the questions from `faq-bank.ts` |
| Diagram step · Scrubber | `35:364` · `35:417` | Active (signal orange + its number, C80) · Done (violet) · Upcoming (muted); the scrubber's steps are buttons |
| Media block | `35:504` | Photo · Video loop · Screen recording · 3D scene; 16:9 · 4:5 · 3:2; every one through `MediaAsset` (08 §7) |
| Header · Mega menu · Mobile menu · Footer · Footer column | page Header and footer (`36:285`, `37:862`, `38:583`, `39:1070`, `36:287`) | [docs/design/header.md](../design/header.md), [footer.md](../design/footer.md) |

**Every component:**
- is keyboard-operable with visible focus
- has touch targets ≥ 44 × 44 px
- works at the §4 widths
- carries the states that apply: default, hover (only under `(hover: hover) and (pointer: fine)`), focus-visible, active, disabled, loading, error, empty
- uses only tokens; copied KokonutUI and Aceternity components are restyled to the table above, never left in their own look
