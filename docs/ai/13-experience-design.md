# 13 · Experience Design: Effects, Motion & Interaction

> **Applies to:** every visual effect, animation, pointer/scroll/hover behaviour, 3D, glass and story graphic · **Precedence:** below 00; tokens live in [05](05-design-system.md), costs in [07](07-performance-budget.md) · **Last reviewed:** 2026-09-29
> **Decision:** [0008](../decisions/0008-design-language-signal-and-depth.md) (Design Direction v2 "Signal & Depth") · **Surface specs:** [docs/design/](../design/README.md)

This file is the **only** home for effect definitions, limits, fallbacks and choreography. Other files cite effect IDs from here and never restate these rules.

---

## 1. The design language: Signal & Depth

**Depth is how it looks.** The site is a deep-navy space with four depth planes:

| Plane | Holds |
|---|---|
| **Z0** Deep field | Navy, the blueprint grid, static signal glows |
| **Z1** Content | Text and sections |
| **Z2** Glass | Panels and cards |
| **Z3** Signal | The pixel, CTAs, highlights |

- Parallax speed and glass level follow the plane.
- Light comes **from above**. This is direction-neutral, so LTR and RTL match.
- On fine-pointer devices, the visitor's pointer is a second light.

**Signal is how it moves.**
- The Zeta Pixel travels through workflows, lands on CTAs, and assembles into the logo's four-pixel cluster at key moments.
- Every motion is *trigger → action → result*, like the automations deepzeta sells.
- The icon motion vocabulary (Pop · Drop · Stamp · Travel · Assemble, Icon Master Rules §7.3) is the motion vocabulary of the whole site.

The language combines the blueprint's direction A "Signal Grid" (brand surfaces) with direction B "Control Room" (data surfaces: demos, tools, reports).

## 2. Principles

1. **Responsive motion** (owner decision, 2026-09-29). Nothing moves unless the visitor scrolls, hovers, taps or focuses. There is no ambient, idle or looping animation anywhere. Stories play once, and a replay control is offered.
2. **Wow on demand.** Heavy experiences never load on first view: WebGL, concept sites, the app demo, GSAP scenes. They start after LCP on capable devices, or when the visitor taps "Play", "Launch" or "Open".
3. **One signature moment per viewport, plus at most two supporting effects.**
   - A signature moment is a `glass-liquid` element, a `depth-*` scene, a `scroll-pinned-scene`, `type-letter-assemble`, or a playing `story-*`.
   - Persistent chrome doesn't count (the header, `scroll-journey-line`).
4. **Loud / quiet rhythm.** A calm, spacious section follows every statement section (spacing tokens in 05 §4).
5. **The pixel marks value, progress or the current place, never decoration** (§8).
6. **Big type is a material.** One statement headline per page (`--dz-text-statement`, 05 §3).
7. **The final state exists as real HTML text.** Reduced motion, no-JS, AI crawlers and print all get the complete content.
8. **Progressive enhancement.** Server-rendered content and layout come first. Effects attach afterwards and never hold content hostage.
9. **Proof over decoration.** Where possible, the effect *is* the proof: real speed numbers, real audit data, flows that mirror real automations.
10. **Focus parity.** Keyboard focus gets the same state as hover. Touch gets an equivalent, never a missing feature.
11. **Reduce effects.** Visitors get a "Reduce effects" switch in the header menu and the footer.
    - **Turned on by:** the switch itself, or any of these:
      - `prefers-reduced-motion: reduce`
      - `prefers-contrast: more`
      - `forced-colors: active`
      - `prefers-reduced-transparency: reduce` (where supported)
      - low-end device hints: Save-Data and `deviceMemory` (Chromium-only hints)
    - **When on:**
      - static final states
      - `glass-frost` instead of live blur
      - no pointer effects
      - no 3D motion
12. **Story arc.** Every page follows the same arc:

    **Hook → Pain → System → Show → Proof → Plan → Action**

    - The Hook is the H1 plus the direct answer, so the answer still comes first (10 §5, 08 §2).
    - Calm sections sit between the loud ones.
13. **Density by page tier:**

    | Tier | Effects allowed |
    |---|---|
    | T1 | Native CSS plus first-party JS within the caps in §7, at first load |
    | T2 | T1 plus GSAP islands, loaded when visible |
    | T3 | The full toolkit, including `depth-webgl` |

## 3. Hard rules for every effect

1. **Animate `transform` and `opacity` only**, plus colour transitions for state changes.
2. **The LCP element** (usually the H1) is visible, unclipped and in its final position at first paint. It has no entrance animation and never starts at `opacity: 0`.
3. **Hidden start states** are declared only inside `@media (prefers-reduced-motion: no-preference)`, and inside `@supports` for scroll-driven effects. Content can never get stuck invisible.
4. **Fallbacks:**
   - **Scrubbed effects** (linked to scroll position) fall back to the static final state. There is no JavaScript polyfill on T1.
   - **One-shot effects** may fall back to the one shared IntersectionObserver that adds `.is-in`.
5. **`will-change`** only while an effect is running.
6. **Every effect has** a light-mode variant, an RTL behaviour, and a row in the behaviour matrix (§6).
7. **Plans cite effects.** Every plan that uses an effect cites its ID, its page tier, and its cost and mitigation (§10).
8. **Verify items.** Anything marked **verify** in this file is checked against current browser-support data and the installed versions at build time, never from memory (02 §2).

## 4. Effects library

- IDs are kebab-case, **append-only and never reused**, like the analytics taxonomy.
- Page tiers (decision 0005): T1 Home, T2 money pages, T3 experience pages.

### 4.1 Glass

| ID | Effect | Where / limits | Fallback |
|---|---|---|---|
| `glass-tint` | Translucent navy fill + hairline border | Everywhere | — |
| `glass-frost` | **Baked frost.** The frosted look comes from a shared grain/pre-blurred texture plus an inner highlight edge; no runtime blur | The default "glass", everywhere | `glass-tint` |
| `glass-live` | `backdrop-filter` blur + saturation | Header, mega menu, modals and sheets, and ≤ 2 feature panels per viewport; never over long scrolling lists | `glass-frost` |
| `glass-liquid` | `glass-live` + a specular rim on the top edge + a reflection sheen that follows the pointer or sweeps once on hover + edge refraction via SVG displacement where supported (**verify**: Chromium-only, and `@supports` can't detect it reliably) | One per view: hero proof card, mega-menu demo card, Tools "full report" panel, Studio device frame. Desktop fine-pointer only | `glass-live`, then `glass-frost` |

Text on any glass sits on at least the minimum tint (`--dz-glass-tint-min`, 05 §4). That tint keeps WCAG AA contrast whatever passes behind it.

### 4.2 Pointer: "the visitor carries the light"

**When it runs:** only under `(hover: hover) and (pointer: fine)`, and only while a target is in view. It stops when the tab is hidden.

**How it works:** one shared controller.
- Writes are batched with requestAnimationFrame.
- Rects are cached, so there are no layout reads per move.
- No React state per move.
- It moves pre-painted layers with `translate` inside an `overflow: clip` parent, writing only to that layer.

**Two notes:**
- `passive` has no effect on `pointermove`.
- INP doesn't count pointermove, but work done there can delay the next tap.

| ID | Effect | Where |
|---|---|---|
| `pointer-spotlight` | A soft light layer follows the pointer inside a card | Service cards, Home doors, tool panels |
| `pointer-magnet` | Drifts ≤ `--dz-magnet-max` toward the pointer, snaps back with `--dz-ease-pop` | Primary CTA and a few key controls |
| `pointer-tilt` | 3D tilt ≤ `--dz-tilt-max`, with an opposing glare layer | Showcase and feature cards |
| `pointer-grid-wake` | The blueprint grid brightens near the pointer (a masked layer moved by counter-transform) | Hero, chapter openers |

On touch devices none of these run; the static state is complete on its own.

### 4.3 Hover (one behaviour per element type)

Hover effects run 150–250 ms and use the easing tokens. `:focus-visible` triggers the same state.

| ID | Element | Behaviour |
|---|---|---|
| `hover-underline` | Text link | The underline draws from inline-start (`scaleX`; the origin mirrors in RTL) |
| `hover-charge` | Primary CTA | A sheen crosses once, the arrow nudges, the pixel pops |
| `hover-outline` | Secondary button | A gradient outline fades in; the label shifts 2 px |
| `hover-card` | Service card | `pointer-spotlight` + the Tier 2 icon story + a 4 px lift |
| `hover-window` | Showcase card | The image scales inside a fixed frame + `pointer-tilt` + the caption rises |
| `hover-pixel-hop` | Nav item | The current-page pixel hops to the hovered item |
| `hover-guide-line` | List or table row | A stage-colour line grows at inline-start |
| `hover-glow` | Icon-only button | Pixel glow 0 → 0.6 (Icon Master Rules §4.4) |
| `hover-peek` | Editorial image | Shifts ≤ 8 px toward the pointer |

### 4.4 Scroll

**Technique**
- Native CSS scroll-driven animations (`animation-timeline: view()` / `scroll()`), inside `@supports`.
- **verify** support. At the time of writing: Chromium and Safari 26+; Firefox only behind a flag.
- Declare `animation-timeline` **after** the `animation` shorthand, because the shorthand resets it.
- GSAP ScrollTrigger only on T2/T3, and only when native CSS can't express the effect.
- **No scroll-jacking, no smooth-scroll libraries** (decision 0004).

| ID | Effect | Limits |
|---|---|---|
| `scroll-reveal` | Rise 24 px + fade in, once | The default for sections |
| `scroll-parallax` | Z0/Z2 layers move at their plane's speed, ≤ ±60 px | Images and decoration only; body text never moves while being read |
| `scroll-scale-dock` | A statement or image changes scale as it reaches the reading position | — |
| `scroll-assemble` | Parts fly in on 35° paths and lock into place | Uses the "Assemble" vocabulary |
| `scroll-pinned-scene` | A native `position: sticky` scene whose story scrubs with scroll | See the pinned-scene rules below |
| `scroll-drift` | A row moves only while the visitor scrolls | Replaces marquees |
| `scroll-journey-line` | A page-progress line on the inline-start edge, with a travelling pixel that lands on the footer CTA | Sitewide chrome |
| `scroll-signal-beams` | Beams run once along the grid lines when a chapter enters | **Lab** (not confirmed) |

**`scroll-pinned-scene` rules**
- At most 1 per page on T1/T2, and ≤ 250vh long.
- Ancestors use `overflow: clip` (never `hidden` or `auto`) and no `content-visibility`.
- Use `svh`/`dvh` units.
- Unpins on short viewports, at high zoom, and when Reduce effects is on.
- Every step is reachable by keyboard, and anchor links land on a step start.

### 4.5 Kinetic type

**Rules**
- Text is split on the server (0 client JS), at **word** level by default.
- The accessible name stays one plain text source. Never add a duplicated visually-hidden copy; crawlers would read it twice.
- Split spans are verified with VoiceOver, NVDA and TalkBack (**verify**).
- Arabic: word-level splitting only, and no letter-spacing (11 §1).
- One kinetic statement per viewport.
- Never on body text; never an entrance animation on the LCP element.

| ID | Effect | Limits |
|---|---|---|
| `type-line-rise` | Lines rise from a mask | — |
| `type-word-stagger` | Words arrive in sequence | ≤ 12 words, ≤ 600 ms |
| `type-letter-assemble` | Letters fly in on 35° paths | One per page, ≤ 24 characters, Latin only |
| `type-scroll-highlight` | Words brighten from mist to white as they cross the reading line | An opacity cross-fade of two layers, not a colour animation |
| `type-outline-fill` | Outline text cross-fades to the `--dz-grad-zeta` fill | — |
| `type-outline-spotlight` | Giant outline letters light up under the pointer | Studio hero; fine pointer only; a static fill otherwise |

### 4.6 3D

| ID | Effect | Where |
|---|---|---|
| `depth-css` | CSS 3D transforms: tilt planes, perspective-stacked glass, device frames, the laptop lid, pixel cubes | Everywhere |
| `depth-layered` | In-house renders (AVIF/WebP) split into 2–3 depth layers, moved by pointer or scroll ("fake 3D") | Everywhere, within the image budget |
| `depth-webgl` | Real-time WebGL (05 §5 rule 5) | T3 only; see the rules below |

**`depth-webgl` rules**
- Gated on the device: WebGL2, device hints, Save-Data, and Reduce effects.
- Render-on-demand; stops when idle or off-screen.
- Starts on the first real input, because shader compilation is a long task.
- Uses an SVG/CSS poster, so it can never be the LCP element.
- **Never used for brand marks** (the logo, the pixel, the cluster).

### 4.7 Tactile

| ID | Effect |
|---|---|
| `touch-press` | `scale(.97)` while pressed (**verify** how iOS handles `:active`) |
| `touch-stamp` | Success confirmation (form sent, slot booked), with `--dz-ease-pop` |
| `touch-snap` | Toggles and sliders overshoot slightly |
| `touch-nudge` | Error: ±4 px over 240 ms; a colour change only when Reduce effects is on |
| `touch-haptic` | A 10 ms vibration on key confirmations, after a user gesture, where supported (**verify**: Android Chromium). Never the only feedback. **Lab** |

### 4.8 Story graphics (animated explainers)

| ID | Graphic | Rules |
|---|---|---|
| `story-flow` | Data-driven workflow diagram (trigger → AI → actions → outcome). **The pixel is the customer's request travelling through the automation.** Glass nodes, frost connectors, official monochrome platform marks | The Home version is CSS/SVG only |
| `story-chat` | A conversation plays out: typing → reply pops → a booking card stamps → a calendar drop | deepzeta's own chat styling, never a copy of WhatsApp's interface; the official mark only as a label; labelled "Example conversation" |
| `story-before-after` | One scenario with and without automation, or "Code ↔ Page" | A keyboard-operable slider (arrow keys), or scroll-scrubbed |
| `story-data` | Charts and gauges | Only the visitor's own inputs (with the formula shown) or real measurements |
| `story-system-map` | A bundle's service nodes light up on hover or focus | — |
| `story-terminal` | A typed terminal of commands and logs | Real commands and output (our build, our Lighthouse CI, a tool's real steps), or labelled "Example" |

**Every story has:**
- a **visible** HTML step list, so HowTo schema stays honest (08 §3)
- a static final state
- Play / Pause / Replay / step controls when it runs longer than 5 s (WCAG 2.2.2), keyboard-operable
- a pause if the visitor scrolls away mid-play
- its script stored as typed data in `src/content/`, written by the Content Writer

## 5. Named compositions (built only from the library)

| Name | Where | Built from |
|---|---|---|
| **The Assembly** | Home hero | `depth-css` pixel cubes + `scroll-assemble` (see below) |
| **The Landing** | Footer finale | `scroll-journey-line` lands, then `scroll-assemble` of the cluster |
| **Watch this page build itself** | Home §06 | `scroll-pinned-scene` + a `depth-css` laptop. Grid → wireframe → type → glass → content → schema tags → a stamp showing this visit's real LCP |
| **AI View** | Header | X-ray mode (`docs/design/header.md`) |
| **Page Nutrition Label** | Footer | `story-data` from this visit's real measurements (`docs/design/footer.md`) |
| **Device Stage** | Studio | A `glass-liquid` device frame around a sandboxed iframe |
| **Control Room board** | Automation, Tools | `story-flow` / `story-terminal` in direction-B styling |

**How The Assembly works**
- The four cluster pixels fly in on 35° paths on the first scroll and lock beside the headline.
- They stay upright and are never rotated, in the exact `--dz-pixel-*` gradients, with no outlines.
- The pointer moves them in depth only.
- CSS only.

## 6. Behaviour matrix (summary; each plan fills in rows for its own effects)

| Situation | Behaviour |
|---|---|
| Desktop, fine pointer | The full library, within the page tier |
| Touch | No pointer effects; hover states become tap and focus states; scroll effects still run |
| Low-end device or Save-Data | Reduce effects on (§2.11): no `glass-live` or `glass-liquid`, no `depth-webgl` |
| Reduced motion / Reduce effects on | Static final states; `glass-frost`; stories show the final frame and the step list |
| No JavaScript | Full content and layout; one-shot effects shown in their final state; scroll-driven CSS still works where supported |
| Forced colours / more contrast | Glass becomes solid surfaces in system colours; gradients drop; focus rings stay visible |
| RTL | Logical properties; inline-start origins mirror; the pixel and the cluster never mirror (Icon Master Rules §9) |
| Light mode | Glass becomes frosted white; depth uses soft shadows instead of glow; darker gradient variants (05 §2) |

## 7. Provisional byte caps (compressed)

The feasibility gate confirms these (04 §2).

| Item | Cap |
|---|---|
| All first-party effect/UI JS on Home at first load (T1 "native", decision 0008) | ≤ 10 KB |
| Shared pointer controller | ≤ 1.5 KB |
| Shared IntersectionObserver (reveals, icons, CTA handoff) | ≤ 0.5 KB |
| Story controls (shared) | ≤ 2 KB |
| Each `story-*` (data + SVG) | ≤ 6 KB |
| Glass grain texture | ≤ 2 KB |
| Speed chip (with `web-vitals`) | Measured in its plan |
| AI View, Nutrition Label, Device Stage, tools, app demo | Load on open or tap; budgeted in their own plans (07 §2) |

## 8. The Zeta Pixel as a sitewide marker

- The pixel always marks one of three things:
  - **value:** the moment the client wins
  - **progress:** the journey line
  - **the current place:** the nav

  It is never decoration and never a cursor follower.
- The signature motifs (the Z ribbon, the four-pixel cluster, the blueprint grid) follow 05 §1.
- The four-pixel cluster appears outside Tier 3 icons in exactly two brand moments, **The Assembly** and **The Landing** (decision 0008).

## 9. Visual references from the owner

The files in `Planning Folder/Components references/` are **visual references only**.
- They are never copied. They depend on `motion/react`, remote assets and a UI-kit structure, which N2 and decision 0004 rule out.
- Each one maps to a native rebuild:

| Reference | Native rebuild |
|---|---|
| Compare | `story-before-after`: "Code ↔ Page" on the Websites page; Home §03; Automation |
| Mac-style terminal | `story-terminal`: Websites page, Automation, the Tools live log |
| Apple card carousel | The Studio gallery + Device Stage |
| Macbook Scroll | The `depth-css` laptop in "Watch this page build itself" |
| Text Hover Effect | `type-outline-spotlight` (Studio hero) |
| Background Beams With Collision | `scroll-signal-beams`, once per chapter (**Lab**); its endless loop is rejected |

## 10. Effect register (how plans use this file)

**What every plan includes** (04 §4), when it adds or changes a visual surface:
- the page tier
- the effect IDs used, per section
- for each effect: its cost and mitigation, its byte cap, and any **verify** item

**Who checks it:**
- The Reviewer checks the diff against the register.
- The Performance & Accessibility Auditor checks the byte caps, the per-viewport limit, the live-blur limit, the LCP rule, the Reduce effects modes and the pause controls.

**New effects:** a new effect needs a new ID added here first (append-only).

## 11. Imagery direction

**Three families only:**
1. **Brand 3D renders**, made in-house and lit from above: glass pixels, Z-ribbon light, navy depth.
2. **Product/UI screens**: real, or clearly labelled demo screens.
3. **UAE context photography**, licensed or commissioned, with one baked "Signal grade" (navy shadows, cyan–violet highlights).

**Never:**
- robots, brains, handshakes, or generic stock (Icon Master Rules §8.2 applies to imagery too)
- AI-generated people shown as clients or team

Formats and sizes: 07 §3. Text in images: 11 §1.

## 12. Verify list (checked at build time, never from memory)

- Scroll-driven animation support.
- `backdrop-filter: url()` support.
- `prefers-reduced-transparency` support.
- How screen readers handle split text.
- How iOS handles `:active`.
- `navigator.vibrate` support.
- Glass inside 3D transforms (engine bugs).
- Which Core Web Vitals each browser reports (for the Nutrition Label).
- How `content-visibility` interacts with sticky scenes and overflowing effects.
