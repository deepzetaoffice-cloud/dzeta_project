# deepzeta — Icon Master Rules

**Version 1 · September 2026 · Status: approved direction (mix), values open for review**

This file is the single source of truth for every icon on the deepzeta website, proposals and social graphics. Anyone (designer, developer or AI assistant) creating or changing an icon must follow it.

Visual references:
- [DeepZeta Icon Directions.html](../DeepZeta%20Icon%20Directions.html): the three directions compared
- [DeepZeta Signature Icon Prototype.html](../DeepZeta%20Signature%20Icon%20Prototype.html): the chosen mix, all three tiers, in context

Related rules: [DeepZeta Services Catalogue.md](DeepZeta%20Services%20Catalogue.md) (names), `ADDITIONAL PLANNING CONSTRAINT Perf from Claude planning chat.txt` (performance).

---

## 1. The idea

**The Zeta Pixel.** Every service icon is a clean frost line drawing with **one glowing square pixel taken from the logo**, placed at the exact point where deepzeta's work creates value: the reply being sent, the booking landing, the invoice being paid.

The system is a **mix** of the three tested directions:

| From | What we take | Where it's used |
|---|---|---|
| **A · Zeta Pixel** | Line drawing + one pixel | The whole system (all tiers) |
| **B · Pixel-Built** | The logo's four-pixel cluster, in its exact colours, sizes and arrangement | Tier 3 signature icons only |
| **C · Glass Gradient** | Brand-colour depth layer, frosted glass fill, one light sweep | Tier 3 signature icons only, 64px and larger |

Rule of thumb: **simple where people scan, rich where we want them to stop.**

---

## 2. Three tiers

| | Tier 1 · Interface | Tier 2 · Service | Tier 3 · Signature |
|---|---|---|---|
| **Count (launch)** | ~25 | ~30 | ~10 |
| **Used for** | Arrows, menu, close, check, language, social, form states | The ~24 solutions, industries, feature lists | The 6 Systems and 4 stages |
| **Sizes** | 16, 20, 24 | 20, 24, 32, 48, 64 | 64, 96, 128, 160 |
| **Grid** | 24 | 24 | 48 |
| **Pixel** | None | Exactly one | The logo's four-pixel cluster (main pixel on the moment of value) |
| **Colour** | `currentColor` only | Frost lines + stage pixel | Frost lines + stage pixel + depth layer + glass |
| **Motion** | State change 150–200ms | Micro-story ≤ 900ms on hover/focus | Story ≤ 1.6s, once on scroll-in, replay on hover |
| **Code budget** | ≤ 0.4 KB | ≤ 1 KB | ≤ 4 KB |

A Tier 2 icon is never used above 64px. Anywhere an icon is shown larger, it needs a Tier 3 version.

---

## 3. Grid and geometry

### Tier 1 and 2 (24 grid)
- **Canvas:** 24 × 24, **live area** 20 × 20 (2 units padding). Nothing may cross the padding except a pixel's glow.
- **Keyline shapes** (so every icon looks the same size):
  - Circle: diameter 20
  - Square: 18 × 18
  - Portrait rectangle: 16 × 20
  - Landscape rectangle: 20 × 16
- **Corner radius:** 2.25 on large rectangles (≥ 12 units), 1.25 on small ones (nodes, ear cups).
- **Coordinates:** snap to 0.25 units. Line centres sit on .75 or .25 positions so a 1.5 stroke lands crisply on the pixel grid at 24px and 48px.

### Tier 3 (48 grid)
- **Canvas:** 48 × 48, **live area** 40 × 40 (4 units padding).
- **Corner radius:** 4 on large shapes, 3 on medium.
- The pixel cluster is the **only** thing allowed to break out of a shape's frame (see 4.3).

### Angles
- Use 0°, 90° and 45° for icon lines.
- **35°** (the logo's Z-fold angle) is reserved for motion paths and Tier 3 compositions.

---

## 4. The Zeta Pixel

### 4.1 Pixel shape (measured from the logo)
- **Upright square**, never rotated, never a circle, never a diamond.
- **Corner radius = 12.5% of its size** (logo pixels measure 11–14%).
- **Size on the 24 grid:** 2.6–3.4 units (default 2.6). On the 48 grid: main pixel 5–6 units.
- **Gradient:** light at the top to deep at the bottom, using the exact logo stops (section 5).

### 4.2 Placement (the rule that makes the system work)
1. **Exactly one pixel per Tier 1–2 icon.** Never zero, never two.
2. **The pixel marks the moment of value:** the outcome for the client, not decoration. Before drawing, write one sentence: *"The pixel is …"*. If you can't finish it, the metaphor is wrong.
3. **At rest the pixel is lit** (full colour, no glow), so an icon never looks incomplete. Glow only appears on hover/focus or during the story.
4. The pixel never touches a line without clearance: keep at least 0.75 units of space, or use a knockout (4.3).

### 4.3 Cluster (Tier 3 only)
- The cluster is **the logo's own four pixels**, reproduced exactly: same colours, same gradients, same corner radii, same relative sizes and positions, scaled as one unit.
- Starting from the largest pixel's top-left corner (size *S*):

  | Pixel | Colour (logo gradient) | Size | Offset x | Offset y | Corner radius |
  |---|---|---|---|---|---|
  | Main (logo pixel 2) | Cyan-blue `#21BEFC → #3092FD → #4264FD` | S | 0 | 0 | 13.2% |
  | Upper-right (logo pixel 3) | Light cyan `#03D4FC → #04C1FD → #09A5FC` | 0.7206 S | +1.1741 S | −0.7206 S | 10.7% |
  | Lower-right (logo pixel 4) | Royal blue `#3166FB → #2A4DFC → #3741FD` | 0.5162 S | +1.5891 S | +0.5911 S | 11.8% |
  | Bottom (logo pixel 1) | Purple `#6430FA → #592BFD → #4C27FB` | 0.7126 S | +0.7895 S | +1.2186 S | 14.2% |

- Each pixel keeps the **exact gradient direction** from the logo (converted from the logo's coordinates to the pixel's own box):

  | Pixel | x1 | y1 | x2 | y2 |
  |---|---|---|---|---|
  | Logo pixel 2 | .536 | .044 | .457 | .954 |
  | Logo pixel 3 | .542 | .090 | .470 | .910 |
  | Logo pixel 4 | .645 | .065 | .335 | .915 |
  | Logo pixel 1 | .759 | .045 | .230 | .962 |

- The main pixel sits on the moment of value. The smaller pixels may **break out of the frame**, just as the logo pixels break away from the Z.
- **No borders or outlines** on cluster pixels. Separation from lines comes from placement, not strokes.
- The cluster is the brand mark, so it **always uses the logo's four colours**, whatever the icon's stage. Stage colour is carried by the depth layer and the single pixels in Tier 2.

### 4.4 Glow
- The glow is a **radial gradient** square (3.2 × the pixel size) behind the pixel, never a CSS or SVG blur filter.
- Glow opacity: 0 at rest, 0.6 on hover/focus, pulse to 1 during a story, 0.45 static with reduced motion.

---

## 5. Colour

### 5.1 Lines
| State | Colour | Token |
|---|---|---|
| Rest | Frost `#C9D4FF` | `--frost` |
| Hover / focus / active | White `#F4F6FB` | `--white` |
| Secondary line (alternative route, background layer) | Frost at 42% opacity | — |
| Disabled | Slate `#5D73B8` | `--slate` |

- Lines use `currentColor`, so colour is set by CSS, never inside the SVG.
- **No gradients on 1.5-unit lines.** Thin gradient strokes look muddy and uneven. Gradients are only for the pixel, filled shapes and Tier 3 layers.
- Contrast: lines must reach at least 3:1 against their background (frost on navy passes easily).

### 5.2 Pixel gradients (exact logo stops)
| Stage | Gradient stops (top → bottom) | Glow colour | Solid (below 20px) | Token |
|---|---|---|---|---|
| **Get Found** | `#6430FA` → `#592BFD` → `#4C27FB` | `#7946FC` | `#5A2CFB` | `--dz-pixel-ranking` |
| **Win Customers** | `#21BEFC` → `#3092FD` → `#4264FD` | `#3092FD` | `#3092FD` | `--dz-pixel-web` |
| **Run Operations** | `#3166FB` → `#2A4DFC` → `#3741FD` | `#2F6BFF` | `#2F55FC` | `--dz-pixel-software` |
| **Get Paid & Keep** | `#03D4FC` → `#04C1FD` → `#09A5FC` | `#08C6FD` | `#04C1FD` | `--dz-pixel-ai` |

- **One stage per icon.** Never mix stage colours in one icon, so colour always tells the visitor where they are.
- Below 20px, the pixel switches from gradient to its solid colour and the glow is removed.
- ⚠️ The stage mapping follows the proposed four-stage site structure (Get Found / Win / Run / Get Paid & Keep), which **is not yet approved**. If the old pillars (AI / Websites / Software / Growth) are kept, only this table changes: the tokens stay the same.

### 5.3 Tier 3 layers (from Direction C)
- **Depth layer:** the main shape filled with the stage gradient at 50–62% opacity, offset +1.5 / +1.8 units (down-right).
- **Glass layer:** the main shape filled with frost at 6–9% opacity, with the frost outline on top.
- **Light sweep:** one white band (0 → 40% → 0 opacity), clipped to the main shape, crossing once per story.
- Occluding shapes (e.g. a bubble in front of a calendar) are filled with the surface colour token so lines behind them are hidden.

---

## 6. Stroke

| | Tier 1–2 (24 grid) | Tier 3 (48 grid) |
|---|---|---|
| Width | 1.5 | 1.75 |
| Caps | Square (echoes the pixel) | Square |
| Joins | Round (echoes the Z ribbon curves) | Round |
| Dots | Filled circles, radius 0.7–1 | Filled circles, radius 1.1 |

Every icon in a tier uses the same stroke width. Never scale a Tier 2 icon to fake a Tier 3 size; strokes would get too heavy.

---

## 7. Motion

All motion follows the performance constraint: **deliberate, sparse, purposeful.** For every animated element: the cost is CSS only on the compositor, and the fallback is the static final frame.

### 7.1 Hard rules
| Rule | Value |
|---|---|
| Properties | `transform` and `opacity` only (plus colour transitions on hover) |
| Technology | CSS keyframes and transitions. No animation libraries, no Lottie, no GIF/video, no WebGL |
| JavaScript | None for Tier 1–2. Tier 3: one shared IntersectionObserver (< 0.5 KB) that adds a class when the icon scrolls into view |
| Loops | **Never.** No endless or idle animation |
| Triggers | Tier 1: state change. Tier 2: hover/focus. Tier 3: once on scroll-in + hover/focus/click replay |
| Durations | Colour/state 150–200ms · Tier 2 story ≤ 900ms · Tier 3 story ≤ 1.6s |
| End state | The last frame of every animation is identical to the rest state |
| Reduced motion | `prefers-reduced-motion: reduce` → no animation; static icon, pixel lit, glow at 0.45 |
| Off-screen | Stories only start when visible; nothing animates off-screen |
| Pivot | `transform-box: fill-box` on every animated element, so it pivots on itself |

### 7.2 Easing tokens
| Token | Curve | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(.2,.8,.2,1)` | Lines drawing, layers settling, colour |
| `--ease-pop` | `cubic-bezier(.2,.9,.3,1.35)` | Pixel arriving (slight overshoot) |
| `--ease-travel` | `cubic-bezier(.65,0,.3,1)` | Pixel moving along a path |

### 7.3 Pixel motion vocabulary
Every Tier 2 story uses one of these five pixel motions, so the site feels consistent:

| Motion | Meaning | Example |
|---|---|---|
| **Pop** | Something appears / is answered | WhatsApp reply, search citation |
| **Drop** | Something lands in place | Map pin (Local AI Dominance) |
| **Stamp** | Something is confirmed | Invoice paid |
| **Travel** | Something is carried through a process | AI agent moving a task |
| **Assemble** (Tier 3) | A result is built from parts | Cluster flying in at 35° |

Supporting line motions: lines draw from their start (`scaleX`), elements nudge ≤ 1 unit, dots blink once, bars bounce once.

---

## 8. Metaphors

### 8.1 Rules
- Show the **outcome for the client**, not the technology. "A missed call becomes a booking," not "AI."
- One idea per icon. If it needs a caption to be understood, simplify.
- Use objects a UAE business owner recognises (calendar, WhatsApp-style bubble, invoice, map pin).

### 8.2 Banned
Robot heads · brains · light bulbs · gears or cogs for "automation" · rockets for "growth" · handshakes · magic wands · sparkles ✨ as "AI" · circuit-board patterns · generic clouds · dollar signs · trophies. Every competitor uses these; they make us look like everyone else.

### 8.3 Approved so far
| Icon | Tier | Stage | The pixel is… | Motion |
|---|---|---|---|---|
| AI Search Visibility | 2 | Get Found | your business, cited inside the AI answer | Lines draw → pop |
| Local AI Dominance | 2 | Get Found | you, dropping onto the map | Drop + ground spreads |
| Custom-Coded Website | 2 | Win | the pixel-perfect result of hand-written code | Brackets nudge → pop |
| WhatsApp AI Agent | 2 | Win | the instant reply | Dots blink → pop |
| AI Voice Receptionist | 2 | Win | the voice answering the call | Pop |
| Booking Automation | 2 | Win | the booked slot | Pop |
| Speed-to-Lead | 2 | Win | the moment the reply goes out | Pop |
| CRM Setup & Automation | 2 | Win | the lead's updated status | Pop |
| Custom AI Agents | 2 | Run | the agent carrying a task to done | Travel |
| Invoicing & Payment Collection | 2 | Get Paid & Keep | the "paid" stamp | Stamp |
| **AI Front Desk** | 3 | Win | the booking landing in the calendar (cluster) | Full story, 1.55s |

---

## 9. Right-to-left (Arabic)

Every icon has a `flip` flag, set when it is created.

| Flips in Arabic (`flip: true`) | Never flips (`flip: false`) |
|---|---|
| Arrows, chevrons, back/next | Checkmarks, close, plus, minus |
| Send, reply, forward | Clocks, stopwatches (time runs clockwise everywhere) |
| Progress, steps, timelines, bar-chart growth direction | Globe, search lens, map pin, calendar |
| Text-line placeholders inside documents and bubbles | Logos, brand marks, platform icons (WhatsApp, Google…) |
| Chat-bubble tails | **The pixel and the cluster** (the brand mark never mirrors) |

- Flipping is done in CSS: `[dir="rtl"] .icon--flip { transform: scaleX(-1); }`.
- In a flipped icon, the pixel's position mirrors with the drawing, but the pixel itself is symmetric so it looks identical.
- Line-drawing animations that start from the left must start from the right in RTL (swap `transform-origin`).

---

## 10. Accessibility

- **Decorative icons** (next to a visible label): `aria-hidden="true"` and `focusable="false"`.
- **Meaningful icons** (icon-only buttons): the button carries an `aria-label`; the SVG stays hidden.
- Never rely on colour alone: stage colour is always backed by a text label.
- Interactive icons have a 44 × 44px minimum touch target, even when the icon is 20px.
- Focus shows the same glow and colour change as hover.

---

## 11. Code and delivery (Next.js)

- **Tier 1:** one SVG sprite of `<symbol>`s, used with `<use href="#dz-1-arrow">`. Colour via `currentColor`.
- **Tier 2 and 3:** **inline SVG React components**, rendered on the server (no client JavaScript). They must be inline because CSS cannot animate elements inside a `<use>` sprite.
- **Shared definitions:** the four pixel gradients, four glow gradients, glass stroke and sweep gradients are defined **once** in the root layout, never inside each icon.
- **No colour values inside icons:** lines use `currentColor`, pixels use `url(#px-{stage})`.
- **Optimise:** every SVG goes through SVGO (keep `viewBox`, keep classes, remove metadata, precision 2).
- **Component API:** `<Icon name="booking" stage="win" size={24} />`, with `stage` controlling pixel colour, `size` limited to the allowed sizes, and `solid` pixel applied automatically below 20px.
- **Naming:** `dz-{tier}-{stage}-{name}` for files and symbols, e.g. `dz-1-arrow`, `dz-2-win-booking`, `dz-3-win-ai-front-desk`.
- **Source of truth:** one Figma master file with components; code is generated from it and never hand-edited without updating Figma.
- **The logo SVG is never modified.** Pixel values in this document were measured from it, read-only.

---

## 12. Quality checklist (before any icon ships)

- [ ] Correct grid, padding and keyline shape for its tier
- [ ] Stroke width, square caps, round joins
- [ ] Tier 2: exactly one pixel · Tier 3: the four logo pixels, exact colours and arrangement, no outlines
- [ ] "The pixel is …" sentence written and makes sense to a non-designer
- [ ] No banned metaphor
- [ ] One stage colour only, taken from tokens
- [ ] Checked at every allowed size, including 16/20px with solid pixel
- [ ] Animation uses transform/opacity only, ends on the rest frame, within duration limit
- [ ] Reduced-motion state checked
- [ ] `flip` flag set and checked in RTL
- [ ] Accessibility attributes set
- [ ] Within code budget after SVGO
- [ ] Name matches the Services Catalogue exactly

---

## 13. Production plan

| Step | Scope | Output |
|---|---|---|
| 1 | Approve this document and the stage mapping (5.2) | Rules locked |
| 2 | Tier 3: 6 Systems + 4 stages | Homepage-ready signature icons |
| 3 | Tier 2: remaining ~20 solution icons + industries | Mega-menu and service pages |
| 4 | Tier 1: ~25 interface icons | Sprite |
| 5 | Build the `<Icon>` component, shared defs and sprite in the Next.js project | Production code |

## 14. Open decisions

1. **Stage mapping:** confirm the four-stage structure (Get Found / Win / Run / Get Paid & Keep), or keep the four original pillars.
2. **Industry icons:** Tier 2 style with the pixel, or plain Tier 1 style so they don't compete with service icons? *Recommendation: plain Tier 1 style. The pixel stays reserved for what deepzeta does, not who the client is.*
3. **Platform logos** (WhatsApp, Google, Meta…): always shown as official monochrome marks, never redrawn in our style (brand-guideline requirement).
