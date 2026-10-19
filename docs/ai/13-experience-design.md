# 13 · Experience Design: Effects, Motion & Interaction

> **Applies to:** every visual effect, animation, pointer/scroll/hover behaviour, 3D, video and story graphic · **Precedence:** below 00; tokens live in [05](05-design-system.md), loading habits in [07](07-performance-budget.md) · **Last reviewed:** 2026-10-19 (the build column, §5, §6, §7, §9 and §12 synced with the Phase D build; the owner approved it the same day)
> **Source:** Figma "Deepzeta AI · Website v3" (`tYw7bSV9m4zX2vrVs7XYpE`), page Motion spec (`1:10`, frame `62:33`) · **Decision:** [0033](../decisions/0033-redesign-v3.md) · **Surface specs:** [docs/design/](../design/README.md)

This file is the **only** home for effect definitions, triggers, fallbacks and choreography. Other files cite effect IDs from here and never restate these rules.

---

## 1. The design language: Spectrum, with diagrams

- **Spectrum is how it looks:**
  - a light canvas, with the logo-gradient stage behind each hero
  - the pillar colours as the colour code
  - bright slabs and real UAE photos and video
  - solid violet for every action ([05](05-design-system.md) §1)
- **The diagram language is how it explains** (direction C). Every "how it works" moment is a numbered system diagram with:
  - mono labels
  - a visible step list
  - a scrubber
  - the active step in signal orange, done steps in violet
- **Every motion has a purpose:** to **explain**, to give **feedback**, or to show **state**. "It looks cool" is never a purpose. The purpose is written in each effect's row (§4) and in each plan's effect register (§10).

## 2. Principles

1. **Purpose first.** An effect that explains nothing, confirms nothing and shows no state is cut.
2. **Wow on demand, never in the way.** Heavy experiences (3D, pinned scenes, video, physics) load after the first paint and only in view ([07](07-performance-budget.md) §3). The content is complete without them.
3. **One signature moment per viewport, plus at most two supporting effects.** A signature moment is a named scene in §5. Persistent chrome doesn't count (the header, `reading-progress`).
4. **Loud / quiet rhythm.** A calm section follows every signature section, and two pinned scenes never sit back to back.
5. **The final state exists as real HTML text.** Reduced motion, no-JS, AI crawlers and print all get the complete content.
6. **Progressive enhancement.** Server-rendered content and layout come first. Effects attach afterwards and never hold content hostage.
7. **Proof over decoration.** Where possible, the effect *is* the proof:
   - this visit's real LCP (`lcp-stamp`)
   - the real n8n flow at the end of `workflow-connect`
   - this site's real source code (`code-page-compare`)
   - a real recorded run of this site's checks (`terminal-replay`)
8. **Focus parity.** Keyboard focus gets the same state as hover. Touch gets an equivalent tap state, never a missing feature.
9. **Autoplay comes with a pause** (WCAG 2.2.2). Anything that moves on its own for more than 5 s can be paused:
   - **Content motion has a control in its own section:** the hero rotator, the marquee, every video loop.
   - **Ambient decoration is stopped by the Reduce effects switch:** the status pulse, the beams.
   - Everything pauses off-screen and in a hidden tab.
10. **Reduced motion ≠ none.** Under `prefers-reduced-motion: reduce` or the Reduce effects switch, short opacity cross-fades stay. Movement, parallax, pinning, 3D, smooth scrolling and autoplay go. Each effect's fallback is its "Reduced motion" cell.
11. **The Reduce effects switch** sits in the footer's legal line. It is on when:
    - the visitor turns it on (the choice is remembered)
    - `prefers-reduced-motion: reduce`, `prefers-contrast: more`, `forced-colors: active` or `prefers-reduced-transparency: reduce` (where supported) is set
    - Save-Data or a low `deviceMemory` is reported (Chromium-only hints)
12. **Story arc.** Every page follows the same arc:

    **Hook → Pain → System → Show → Proof → Plan → Action**

    The Hook is the H1 plus the direct answer, so the answer still comes first (10 §5, 08 §2).

## 3. Hard rules for every effect

1. **Animate `transform`, `opacity`, `clip-path` and `filter` only**, plus colour for state changes.
   - Never width, height, top, left or box-shadow. The accordion's `grid-template-rows` is the one named exception, because it never moves other content during reading.
2. **UI timing:** 150–250 ms with `--dz-motion-ease-out` for buttons, chips, menus and popovers. Story scenes may run longer.
3. **Exits are faster than entries.** Never animate from `scale(0)`: enter from 0.95 plus opacity.
4. **Press:** everything you can press scales to `--dz-motion-scale-press` (0.97) on `:active` in 160 ms (`press-scale`).
5. **Hover needs a pointer:** hover effects live only inside `@media (hover: hover) and (pointer: fine)`.
6. **No motion on repeats:** keyboard-repeated actions are instant (arrow keys on sliders, rails and the compare handle; Esc).
7. **The LCP element** (usually the H1) is visible, unclipped and in its final position at first paint. It has no entrance animation and never starts at `opacity: 0`.
8. **Hidden start states** are declared only inside `@media (prefers-reduced-motion: no-preference)`, and only once the effect's script has run. Content can never get stuck invisible.
9. **Off-screen work stops:** loops, videos, 3D render loops and pointer tracking pause outside the viewport and in a hidden tab.
10. **`will-change`** only while an effect is running.
11. **Every effect has** a reduced-motion fallback (§4), an RTL behaviour (inline-start origins mirror; the pixels never mirror), and a row in the behaviour matrix (§6).
12. **Plans cite effects.** Every plan that uses an effect cites its ID, its purpose and its fallback (§10).
13. **Verify items.** Anything marked **verify** in this file is checked against current browser-support data and the installed versions at build time, never from memory (02 §2).

## 4. Effects library

- IDs are kebab-case, **append-only and never reused**, like the analytics taxonomy.
- The columns are the Figma motion spec's.
- A new effect needs a new row here first, added to Figma's Motion spec page in the same change.

### 4.1 Global and UI

| ID | Where | Purpose | Trigger | Timing · easing | Reduced motion | Build |
|---|---|---|---|---|---|---|
| `press-scale` | Every button, chip, card | Feedback | `:active` (pointer, or Enter/Space once) | scale 0.97 · 160 ms · ease-out; release 160 ms | Kept (no movement beyond 3%) | CSS transition on transform |
| `hover-lift` | Service cards, door cards, concept cards | Feedback | Pointer enters (`hover: hover` only) | translateY −4 px + Elevation 2 · 220 ms · ease-out | Shadow change only | CSS |
| `focus-ring` | Everything interactive | State | `:focus-visible` | Instant: 2 px white + 2 px `#3741FD` ring | Same | CSS |
| `section-reveal` | Section headings, card groups | Explain | Enters the viewport once | opacity 0→1, translateY 12→0 · 400 ms · ease-out · 50 ms stagger | Opacity only, 200 ms | IntersectionObserver + CSS; built on the service diagram, which lights its steps once (`src/lib/fx/service.ts`) |
| `smooth-scroll` | Whole page | Feedback | Wheel, trackpad, touch | Lenis, lerp 0.1, synced with ScrollTrigger | Off: native scrolling | Not used in the v3 build: the site scrolls natively (Lenis isn't installed) |

### 4.2 Header, mega menu, mobile menu, footer

| ID | Where | Purpose | Trigger | Timing · easing | Reduced motion | Build |
|---|---|---|---|---|---|---|
| `header-condense` | Header | State | Scroll past 80 px | The pill narrows and shortens via transform/clip · 250 ms · ease-out | Instant swap | CSS clip and transform + a small scroll listener (`src/lib/fx/header.ts`) |
| `reading-progress` | Scrolled header | State | Scroll position | scaleX 0→1 of the violet line, scroll-linked, linear | Shown, static at the current value | CSS scroll timeline; a small script keeps `--dz-progress` where it isn't supported |
| `status-pulse` | Status island dot | State | The agent is live | Opacity 1→0.4→1 · 2 s loop | Off (solid dot) | CSS keyframes |
| `status-expand` | Status island | Feedback | Hover or focus | Width + a second line in · 220 ms · ease-out | Opacity only | CSS |
| `mega-menu-open` | Header → mega menu | State | Click or Enter on Services (never hover-intent alone) | opacity + translateY 8→0 · 250 ms · ease-out, origin at the trigger; Esc closes instantly | Opacity 150 ms | Native popover (`popover="auto"`) + CSS |
| `mega-preview-swap` | Mega menu preview rail | Explain | Hover or focus a pillar column | Poster cross-fade 220 ms, then the pillar loop plays muted | Instant poster swap, no autoplay | CSS + the door photos (`src/lib/fx/mega.ts`); `<video>` once V01–V04 exist |
| `mobile-menu-sheet` | Mobile header → full-screen menu | State | Tap Menu | translateY −4% → 0 + opacity · 300 ms · ease/drawer; links stagger 30 ms | Opacity only | Native `<dialog class="dz-sheet">` + CSS (C83) |
| `accordion` | FAQ, the mobile menu's pillars | State | Click, tap or Enter | grid-template-rows 0fr→1fr · 220 ms · ease-out; the + / − icon cross-fades | Instant | Native exclusive `<details name>` + CSS (`::details-content`) |
| `beams` | Footer audit panel | Explain: points to the audit CTA | The panel in view | Beams fall 3–5 s linear, burst on the edge | Off (static beams) | CSS keyframes, run only in view (`src/lib/fx/footer.ts`) |
| `wordmark-spotlight` | Footer giant wordmark | Feedback | Pointer over (`hover: hover`) | A radial mask of the logo gradient follows the cursor, spring 0.5 s / bounce 0 | Static outline | CSS mask + a small pointer script (`src/lib/fx/footer.ts`) |

### 4.3 Home: signature moments

| ID | Where | Purpose | Trigger | Timing · easing | Reduced motion | Build |
|---|---|---|---|---|---|---|
| `hero-word-rotator` | Hero headline | Explain | Autoplay; pauses on hover/focus, off-screen, in a hidden tab, and by its pause button | Dwell 2.4 s · letters enter rotateX 70°→0 + blur 8→0, 18 ms stagger, 560 ms ease-out · exit 320 ms in-out · slab morph 420 ms · sweep 900 ms · pixel burst 240 ms | Opacity cross-fade 200 ms; the slab swaps without motion | GSAP with one span per letter, in chunks that wrap only between words (`src/lib/fx/home/slab.ts`); no SplitText |
| `background-paths` | Hero stage | Feedback | Pointer moves (`hover: hover`) | Lines part within 120 px of the cursor, spring back | Static lines | SVG paths + a small pointer script (`src/lib/fx/home/effects.ts`) |
| `message-to-booking` | Hero 3D phone scene | Explain | Scroll-pinned ~150 vh; drag rotates the phone | 0–25% the lead drops into the stack · 25–50% the reply types in · 50–75% the slot locks · 75–100% the CRM card fills and "Team notified" lands; drag ±25° with a spring release | No pin; the final state; the phone poster image | CSS 3D phone with real HTML text + GSAP ScrollTrigger; no R3F |
| `pixels-to-doors` | Four doors | Explain | The section enters the viewport | The 4 logo pixels fly along curves into the 4 cards · 600 ms in-out · 80 ms stagger | Cards shown in place | GSAP MotionPath |
| `door-tilt` | Door cards | Feedback | Pointer over (`hover: hover`) | rotateX/Y ≤ 6° toward the pointer + glare, spring (stiffness 150, damping 18) | None | CSS 3D + small JS |
| `door-video` | Door cards | Explain | The card in view | Poster → muted loop; pauses off-screen; a pause control | Poster only, no autoplay | `<video>` + IntersectionObserver, once V01–V04 exist (not built yet) |
| `problem-reveal` | "Sound familiar?" rows | Explain | Hover or tap a row | The "With Deepzeta AI" side wipes in (clip-path) 420 ms ease-out; a strike-through draws on "Today" | Both sides shown | CSS clip-path |
| `workflow-connect` | "See an automation run" | Explain | Scroll-pinned ~200 vh | Nodes appear 01→05; connectors draw in signal orange; the step list and scrubber sync; ends by cross-fading into the real n8n recording | No pin; every node and the recording shown | GSAP ScrollTrigger; the n8n recording joins once SR01 exists |
| `exploded-layers` | "This page is the proof" | Explain | Scroll; the "How AI reads this page" toggle | The Design, Code, Schema and SEO layers separate in depth; the toggle swaps the section into the AI view in 220 ms | Layers flat; toggle instant | CSS 3D |
| `lcp-stamp` | "This page is the proof" | State | After load (PerformanceObserver) | This visit's real LCP counts in over 600 ms ease-out; never a promised score (10 §3.7) | The value appears without counting | JS |
| `industry-rail` | "Built for your industry" | Explain | Desktop: vertical scroll drives the rail (pinned); mobile: swipe with momentum + snap | Photos move 0.85× inside their cards (depth parallax) | Plain horizontal scroll, no parallax | GSAP ScrollTrigger on desktop; native momentum scroll with snap on phones |
| `industry-flip` | Industry cards | State | Click, tap or Enter | rotateY 180° · 560 ms · in-out; the back face lists the automations | Cross-fade 200 ms | CSS 3D |
| `roi-count-up` | ROI calculator | Feedback | Slider drag or input | The result counts to the new value in 400 ms ease-out (tabular figures); the slider fill sloshes (spring); arrow keys update instantly | Instant numbers | Native range inputs + JS (`src/lib/fx/home/interactions.ts`) |
| `marquee` | Platform strip | Explain | Always; pauses on hover, focus and its pause button | A linear loop, 40 s per cycle | A static wrapped list | CSS |

### 4.4 Other pages

| ID | Where | Purpose | Trigger | Timing · easing | Reduced motion | Build |
|---|---|---|---|---|---|---|
| `dot-field` | Services hub hero | Feedback | The pointer; hovering a pillar chip | Dots near the cursor light; the chip lights its pillar's dots | Static dots | CSS dots + a small pointer script (`src/lib/fx/hub.ts`); the chips light their pillar by CSS `:has` |
| `macbook-scroll` | Custom-coded websites hero | Explain | Scroll | The lid opens 75°→0° and scales up; this site fades in on the screen | The laptop open, static | CSS 3D laptop, its screen in HTML + GSAP ScrollTrigger (`src/lib/fx/flagship.ts`) |
| `code-page-compare` | Code ↔ Page | Explain | Drag; ← → move 5% instantly | A clip-path inset follows the handle; one 1.2 s hint on first view | No hint; the handle still works | A native range input + CSS clip-path (`src/lib/fx/flagship.ts`) |
| `terminal-replay` | "Watch this site run its own checks" | Explain | Play | Lines appear one by one at a set pace, commands typing in (the recording keeps no per-line timing); play, pause, replay, next step, a progress bar | The full log shown | JS (`build-run.ts` data; `src/lib/fx/flagship.ts`) |
| `drape` | Privacy hero | Feedback | The pointer pushes the cloth | A gentle cloth simulation | Static pleats | CSS pleats + a small raw-WebGL shader, no library, lazy (`src/lib/fx/privacy.ts`) |
| `shape-throw` | 404 | Feedback | Drag and throw (velocity > 0.11 throws) | Physics with friction; the chips are links | Static; the links work | A small custom physics script (`src/lib/fx/shapes.ts`) |

### 4.5 Retired IDs (Signal & Depth, decision 0008)

Retired from the site's own surfaces by decision 0033 and **never reused**. They stay listed so older plans still pass `check:effects`. A new plan cites only §4.1–§4.4.

The Designer Studio's concept sites have their own looks, so their plans may still cite these IDs. A surface not yet redesigned (Deepzeta Sync, the automation page, the app demo) gets v3 IDs when its Figma design is approved.

| ID | Was |
|---|---|
| `glass-tint` | Translucent navy fill + hairline |
| `glass-frost` | Baked frost texture |
| `glass-live` | Live `backdrop-filter` blur |
| `glass-liquid` | Live glass + rim, sheen and refraction |
| `pointer-spotlight` | A light layer following the pointer in a card |
| `pointer-magnet` | A CTA drifting toward the pointer |
| `pointer-tilt` | A 3D tilt with glare (now `door-tilt`) |
| `pointer-grid-wake` | The blueprint grid brightening near the pointer |
| `hover-underline` | A link underline drawn from inline-start |
| `hover-charge` | The primary CTA's light bead and sheen |
| `hover-outline` | The secondary button's gradient outline |
| `hover-card` | The service card's spotlight, icon story and lift (now `hover-lift`) |
| `hover-window` | The showcase card's image scale and tilt |
| `hover-pixel-hop` | The nav's travelling cluster marker |
| `hover-guide-line` | A pillar line at a row's inline-start |
| `hover-glow` | An icon button's micro-story and glow |
| `hover-peek` | An editorial image shifting toward the pointer |
| `scroll-reveal` | Rise and fade once (now `section-reveal`) |
| `scroll-parallax` | Plane-speed parallax |
| `scroll-scale-dock` | A statement scaling into place |
| `scroll-assemble` | Parts flying in on 35° paths |
| `scroll-pinned-scene` | A sticky scene scrubbed by scroll |
| `scroll-drift` | A row moving while the visitor scrolls |
| `scroll-journey-line` | The page-progress line and its pixel |
| `scroll-signal-beams` | Beams running once along the grid |
| `type-line-rise` | Lines rising from a mask |
| `type-word-stagger` | Words arriving in sequence |
| `type-letter-assemble` | Letters flying in on 35° paths |
| `type-scroll-highlight` | Words brightening at the reading line |
| `type-outline-fill` | Outline text filling with the zeta gradient |
| `type-outline-spotlight` | The Studio hero word's lens and ripple |
| `depth-css` | CSS 3D planes and device frames |
| `depth-layered` | Renders split into depth layers |
| `depth-webgl` | Real-time WebGL |
| `touch-press` | Press scale (now `press-scale`) |
| `touch-stamp` | A success stamp |
| `touch-snap` | Toggles overshooting |
| `touch-nudge` | An error nudge |
| `touch-haptic` | A 10 ms vibration |
| `story-flow` | A workflow diagram (now `workflow-connect`) |
| `story-chat` | A conversation playing out |
| `story-before-after` | A with/without slider (now `code-page-compare`, `problem-reveal`) |
| `story-data` | Charts from the visitor's inputs |
| `story-system-map` | A bundle as an orbit of services |
| `story-terminal` | A typed terminal (now `terminal-replay`) |

## 5. Signature moments per page

| Page | Signature moments (one per viewport) | Supporting |
|---|---|---|
| Home | `message-to-booking` (hero) · `pixels-to-doors` + `door-video` (four doors; the video once V01–V04 exist) · `workflow-connect` · `exploded-layers` + `lcp-stamp` · `industry-rail` + `industry-flip` · `roi-count-up` | `hero-word-rotator` (the hero's headline), `background-paths`, `marquee`, `problem-reveal`, `door-tilt` |
| Services hub | — (a directory, calm) | `dot-field`, `hover-lift`, `accordion` |
| Service template | — (one diagram, calm) | The C diagram (the step list beside the system diagram), lit in order once on view (`section-reveal`), `hover-lift`, `accordion` |
| Custom-coded websites | `macbook-scroll` · `code-page-compare` · `terminal-replay` | `hover-lift`, `accordion` |
| Privacy | — | `drape` (hero background) |
| 404 | `shape-throw` | — |
| Every page | — | The shell: `header-condense`, `reading-progress`, `status-pulse`, `status-expand` (while the agent is live), `mega-menu-open`, `mega-preview-swap`, `mobile-menu-sheet`, `beams`, `wordmark-spotlight`, `press-scale`, `focus-ring`. The site scrolls natively (`smooth-scroll` isn't used) |

**The Home hero's rotator** (decision 0033 §3):
- The H1 is one stable sentence and the accessible name. The rotating phrases are `aria-hidden` and are never part of the H1's text.
- Only the first phrase is in the server HTML, so crawlers read the H1 alone.
- The pause button is an Icon button with a label ("Pause the rotating words" / "Play…").

**Pinned scenes** (`message-to-booking`, `workflow-connect`, `industry-rail` on desktop):
- each ≤ 250 vh, with a calm section between two of them
- ancestors use `overflow: clip` (never `hidden` or `auto`) and no `content-visibility`
- `svh`/`dvh` units
- unpinned on short viewports, at high zoom and under Reduce effects
- every step reachable by keyboard (the scrubber's steps are buttons), and an anchor link lands on a step start

**Story graphics** (every diagram, scene and replay) have:
- a **visible** HTML step list, so HowTo stays honest (08 §3)
- a static final state
- play, pause and step controls when they run longer than 5 s
- a pause if the visitor scrolls away mid-play
- their script stored as typed data in `src/content/`, labelled "Example" where it isn't real

## 6. Behaviour matrix (each plan fills in rows for its own effects)

| Situation | Behaviour |
|---|---|
| Desktop, fine pointer | The full library |
| Touch | No hover or pointer effects; tap states instead; scroll effects and swipe rails still run; `door-tilt`, `background-paths`, `wordmark-spotlight` off |
| Low-end device or Save-Data | Reduce effects on (§2.11): no 3D or WebGL, no autoplay video (posters) |
| No WebGL | The drape keeps its CSS pleats; there are no R3F scenes (the 3D is CSS) |
| Reduced motion / Reduce effects on | Each effect's "Reduced motion" cell; no pinning, parallax, 3D, WebGL or autoplay; short cross-fades stay |
| No JavaScript | Full content and layout; every scene in its final state; native scrolling; the mobile menu's links reachable from the page's own navigation fallback |
| Forced colours / more contrast | Gradients and slabs drop to system colours; borders stay visible; the focus ring stays |
| RTL | Logical properties; inline-start origins mirror (the reading progress grows from inline-start, the compare handle's arrows swap); the pixels and the logo never mirror (Icon Master Rules §9) |
| Hidden tab or off-screen | Loops, videos, render loops and pointer tracking pause |

## 7. Build technique and loading

- **One engine per effect** (as built in Phase D, 2026-10-19):
  - **GSAP** 3.15.0 (ScrollTrigger, CustomEase, MotionPath; no SplitText) runs the scroll scenes and timelines, on Home and the flagship only. Its curves and timings come from the motion tokens (`src/lib/fx/motion.ts`).
  - **CSS** runs everything a transition, keyframe, scroll timeline or 3D transform can do, with the platform's own popover, `<dialog>` and `<details>` for the menus and accordions.
  - **Small scripts** in `src/lib/fx/` handle pointers, physics and the drape's raw WebGL, with no library.
  - Not used: Lenis, React Three Fiber, Radix, Motion and copied KokonutUI or Aceternity components. Decision 0033 still allows them; a plan that adds one names it.
- **Loading** ([07](07-performance-budget.md) §3):
  - A page's scripts load as its scene (`data-fx-scene`, `src/lib/fx/scenes.ts`) once the page is interactive, never before the first paint; GSAP loads inside the scenes that need it.
  - Videos load near the viewport, once they exist.
- **Tokens:** timings, easings, scales and tilts come from 05 §5, read from CSS custom properties.
- **Copied components** (N2, decision 0033): restyled to tokens and logical CSS, their icons swapped for the in-house glyphs, a reduced-motion branch added where they lack one, and no remote assets.

## 8. The Zeta Pixel

- **The pixel marks one of four things:**
  - **value:** the moment the client wins
  - **progress:** the reading progress, the scrubber
  - **the current place:** the active nav item, in violet with its pixel
  - **a pillar:** the Pillar pixels marks
- **It is never a cursor follower.** In `pixels-to-doors` the logo's four pixels become the four pillar doors. In `shape-throw` they are the 404's throwable shapes beside the page links.

## 9. Visual references and the components we copy

The owner's references (animejs.com, media-harbour.com, 71three.com, wassimnasr.com, the Figma Moodboard) are references only. The components below may be copied in under N2 (decision 0033) and restyled. `Planning Folder/Components references/` snippets follow the same rule (06 §5.5). **As built (2026-10-19), none was copied:** each effect below is the site's own code, with the component as its reference.

| Source | Component | Effect ID / component |
|---|---|---|
| KokonutUI | AI-02 AI Input Search | The AI input (05 §7) |
| KokonutUI | NV-09 Status Island | `status-pulse`, `status-expand` |
| KokonutUI | BG-01 Dot field | `dot-field` |
| KokonutUI | BG-02 Background Paths | `background-paths` |
| KokonutUI | BG-03 Shape throw | `shape-throw` |
| KokonutUI | BG-06 Drape | `drape` |
| KokonutUI | TX-02 (text rotator) | `hero-word-rotator` (or GSAP SplitText) |
| KokonutUI | CD-07 (card rail) | `industry-rail` |
| KokonutUI | IN-07 (slider) | `roi-count-up` |
| Aceternity | Background Beams With Collision | `beams` |
| Aceternity | Text Hover Effect | `wordmark-spotlight` |
| Aceternity | Macbook Scroll | `macbook-scroll` |
| Aceternity | Compare | `code-page-compare` |

## 10. Effect register (how plans use this file)

**What every plan includes** (04 §4), when it adds or changes a visual surface, as a table headed "Effect register" with an "Effect ID" column (`check:effects` reads it):
- the section
- the effect IDs used
- for each effect: its purpose, its reduced-motion fallback, its build technique and how it loads, and any **verify** item

**Who checks it:**
- The Reviewer checks the diff against the register.
- The Accessibility & Performance Auditor checks the LCP rule, the pause controls, the reduced-motion and Reduce effects behaviour, keyboard access, and the per-viewport limit. It reports performance for information.

## 11. Imagery and video direction

- **Photos:** UAE places, with only hands, backs, spaces and devices.
  - Natural colour with a subtle cool violet grade. The subject is centred, so every photo crops to 3:2 (desktop) and 4:5 (mobile).
  - The 21 V1 photos were made with ElevenLabs. Owner photos need at least 3000 px on the long edge.
- **Video loops:** image-to-video from the matching photo, with the start frame equal to the end frame.
  - 6 s, silent, 30 fps; `-desktop.mp4` at 1440 × 1080 and `-mobile.mp4` at 1080 × 1350. The owner makes them.
  - The build makes the web MP4, WebM and poster. The photo is always the poster and the fallback.
- **Screen recordings:** real systems with demo data only, 1920 × 1080 at 60 fps, 6–12 s loops. Captioned "Built by Deepzeta AI", or labelled "Example".
- **3D scenes:** built in code, with GLB (Draco) models of about 5 MB at most and a 2400 px poster.
- **Never:**
  - AI-generated people shown as clients or team
  - readable text or logos in images
  - robots, brains, handshakes, or generic stock (Icon Master Rules §8.2 applies)
  - a staged result passed off as real
- **Every asset** is a `MediaAsset` with its SEO file name and per-slot alt text (08 §7). The full list is the Figma media plan (page Media plan, frame `63:33`).

## 12. Verify list (checked at build time, never from memory)

- GSAP's licence for MotionPath (free since 3.13; checked at install). SplitText isn't used: the rotator's letters are the site's own spans, `aria-hidden` beside the stable H1.
- Lenis isn't used; anchors use `scroll-padding` for the header with native scrolling.
- The Content Security Policy (`security-headers.ts`, kept verbatim) against: React's inline `style` attributes from Motion and GSAP, WebGL, `blob:` URLs, and `media-src` for videos. `tracking.spec.ts` fails on any violation on Home or the review page.
- If a plan adds R3F: drei's Draco decoder is self-hosted, since its default fetches from gstatic.com, which the CSP and `tracking.spec.ts` ("nothing else third-party") forbid.
- Muted inline autoplay on iOS Safari, and Low Power Mode (the poster stays).
- `prefers-reduced-transparency` support; scroll-driven animation (`scroll-timeline`) support for `reading-progress`.
- WebGL availability for the drape (it falls back to its CSS pleats) and the `deviceMemory` / Save-Data hints.
- How `content-visibility` interacts with the pinned scenes.
