# Plan: Design Direction v2 "Signal & Depth", with every confirmed decision written into the rules

Status: APPROVED (owner, 2026-09-29) · Phase: P-1 (design and rules only, no application code)

**Out of scope:** application code; installing packages; the Design Lab prototype (its own plan); the 15+ Studio concepts; the Tools sales automation; the App demo decisions; conflict C6; any edit to `Planning Folder/**` or the logo.

Branches:
- `docs/facts-social-profiles`
- `docs/stack-decision`
- `docs/design-direction-v2`

They are stacked in that order. Nothing is pushed.

## Context

**The request (2026-09-29).** You opened the design discussion:
- the complete visual and motion language: effects, pointer and hover, parallax, 3D, glass/frost/liquid glass, tactile feedback, kinetic and scroll-reactive type, bold display type, breathing room, story-driven motion, animated explainers, custom animated icons
- a unique header and footer
- four new pages: **Designer Studio, Automation, deepzeta Tools, App demo**

Every confirmed decision must land in the rule system, so AI builders follow it.

**What the research found:**
- The rules drifted from accepted decisions:
  - 05 §5 still bans GSAP and allows one 3D moment sitewide, although 0005 allows both per page tier. The fix, the stack-rule-changes plan, was never applied.
  - The decisions index is stale.
  - CLAUDE.md says Node isn't installed, but v24.19.0 is.
- **0006 is used twice:**
  - On `main` it is the Roo Code decision, still PROPOSED.
  - On the unmerged branch `docs/d1-domain-and-component-refs` it is the domain decision, ACCEPTED. That branch also holds your 6 component references.
- **Homepage mockup v1 "Signal Grid"** is honest and light, but restrained.
- **The Deepzeta Sync App folder** is currently the open-source "Forge Growth" (MIT).

**Outcome:** one coordinated, premium, futuristic language that stays inside the speed budget, proves our claims, and is recorded so builders can't drift.

**Goal served:** *"A fast, custom-coded … site that turns UAE business owners into booked AI audits, and proves every claim it makes."*

---

## Decisions you confirm by approving this plan

1. **Direction:** "Signal & Depth" (A below), its principles, the effects library, the choreography rules and the surface designs.
2. **Motion:** responsive only. Nothing moves unless the visitor acts; stories play once and can be replayed *(your answer)*.
3. **150 KB hard limit** covers everything loaded **before the first interaction**. Code started by an explicit tap ("Launch", "Play", "Open") never loads on first view and gets its own budget in its plan. Core Web Vitals stay hard limits on every page *(your answer)*.
4. **Names, URLs and page tiers:**

   | Name | URL | Page tier |
   |---|---|---|
   | **Designer Studio** | `/studio` | T2 |
   | Studio concepts | `/studio/<slug>` | T3, `noindex` |
   | **deepzeta Tools** | `/tools` | T2 |
   | **Website & AI Search Health Check** | tool (your answer) | T2 |
   | **Social Media Content Planner** | tool | T2 |
   | **Automation** page | depends on C6 | T2 |
   | **App demo** | set in its own session | T3 |

   The Studio is the "/lab showcase" that 0005 already foresaw.
5. **T1 "native"** means platform features plus first-party vanilla JS, with no animation libraries.
   - Provisional cap: **≤ 10 KB compressed** of effect/UI JS on Home at first load.
   - This is validated by a feasibility gate (P2/P5). C8 stays open for the framework baseline.
6. **The pixel's meaning:** the pixel always marks **value, progress or the current place, never decoration.** Because of this, the "pixel companion cursor" idea is **dropped**.
7. **Cluster use outside icons:** the logo's four-pixel cluster may appear in exactly two brand moments, the **Home hero "Assembly"** and the **footer finale**.
   - Pixels stay upright, never rotated. They use the exact `--dz-pixel-*` gradients and have no outlines.
   - Built in CSS only: never WebGL for brand marks.
8. **Token names:** 05's names win (e.g. `--dz-grad-signal`, `--dz-ok/warn/bad`), with values from the colour system. Pixel gradients stay 3-stop, per the Icon Master Rules.
9. **Your component references** are **visual references only**, rebuilt natively (map in A9). No copy-pasted library code (N2, 0004).
10. **Git pre-flight** as you chose. The design decision becomes **0008**.

---

# Part A — The design

## A1. Big idea: Signal & Depth

It combines the blueprint's direction A "Signal Grid" (brand) and direction B "Control Room" (data surfaces), and adds depth.

**Depth is how it looks.** A deep-navy space with four planes:

| Plane | Name | Holds |
|---|---|---|
| **Z0** | Deep field | Navy, the blueprint grid, static signal glows |
| **Z1** | Content | Text and sections |
| **Z2** | Glass | Panels and cards |
| **Z3** | Signal | The pixel, CTAs, highlights |

- Scroll moves you through the planes.
- **Light comes from above**, which works the same in LTR and RTL.
- On desktop, **the visitor's pointer is a second light.**

**Signal is how it moves.**
- The Zeta Pixel **travels** through workflows, **lands** on CTAs and **assembles** into the cluster at key moments.
- Every motion is *trigger → action → result*, like the automations we sell.
- The icon motion words (Pop · Drop · Stamp · Travel · Assemble) become the whole site's motion vocabulary.

**Kept from v1:** navy + grid, one gradient word per headline, "EXAMPLE" labels, live proof elements, the "see how AI reads this page" reveal, logical CSS.

**Fixed from v1** (each becomes a lesson):
- the render-blocking font link
- the hero mark fading in from opacity 0 (it competed for LCP)
- wrong CLS maths
- tab and drawer accessibility gaps

## A2. Principles

1. **Responsive motion.** No ambient or idle animation anywhere.
2. **Wow on demand.** Heavy experiences start after LCP on capable devices, or on "Play", "Launch" or "Open".
3. **Per viewport:** 1 signature moment + ≤ 2 supporting effects. Persistent chrome (header, journey line) doesn't count.
4. **Loud / quiet rhythm**, with generous breathing room after every statement section.
5. **The pixel marks value, progress or the current place.**
6. **Big type is a material.** One statement headline per page.
7. **The final state always exists as real HTML text.** This covers reduced motion, no-JS, AI crawlers and print.
8. **Progressive enhancement.** Server-rendered content first; effects attach later.
9. **Proof over decoration:** real speed numbers, real audit data, flows that mirror real automations.
10. **Focus parity.** Keyboard focus gets the hover state; touch gets an equivalent.
11. **A "Reduce effects" switch** for visitors (header menu + footer). It also follows the OS settings (reduced motion, contrast, forced colours) and turns on for low-end devices.

## A3. Effects library (kebab-case IDs, append-only, never reused)

**Rules for every effect:**
- **Animate** `transform`/`opacity` only (plus colour transitions for state).
- **Scrubbed effects** fall back to the static final state. One-shot effects may use one shared IntersectionObserver.
- **The LCP element** is visible, unclipped and in its final position at first paint.
- **Each effect has** a provisional byte cap in 13 and a behaviour row: desktop / touch / low-end / reduced motion / no-JS / forced colours / RTL / light.
- **Browser-dependent parts** are flagged **"verify support at build time"**.

**Page tiers:** T1 Home ≥ 95 · T2 money pages ≥ 90 · T3 experience pages ≥ 70.

**Glass: frosted and liquid glass without the usual cost**

| ID | Effect | Where / limits |
|---|---|---|
| `glass-tint` | Translucent navy + hairline | Everywhere |
| `glass-frost` | **Baked frost:** shared grain/pre-blurred texture, inner highlight edge, no runtime blur | Default glass, everywhere, ~0 cost |
| `glass-live` | `backdrop-filter` blur + saturation | Header, mega menu, modals/sheets, ≤ 2 feature panels per viewport; never over scrolling lists; falls back to `glass-frost` |
| `glass-liquid` | Live frost + light rim + a reflection sheen that follows the pointer or sweeps once + edge refraction where supported (Chromium-only extra; verify) | One per view; desktop fine-pointer; falls back to live/baked frost |

Text on glass sits on a **minimum tint** (value set in P0/Lab) that keeps AA contrast whatever is behind it.

**Pointer: "the visitor carries the light"**

- Only when `(hover: hover) and (pointer: fine)` and a target is in view.
- One shared controller, rAF-batched.
- It moves pre-painted layers with `translate`: no React state, no layout reads per move.
- It stops when the tab is hidden.

| ID | Effect | Where |
|---|---|---|
| `pointer-spotlight` | Soft light layer follows the pointer inside cards | Service cards, doors, tool panels |
| `pointer-magnet` | Drifts ≤ 6 px toward the pointer, snaps back | Primary CTA, a few key controls |
| `pointer-tilt` | ≤ 5° tilt + opposing glare | Showcase and feature cards |
| `pointer-grid-wake` | The grid brightens near the pointer | Hero, chapter openers |

**Hover: one behaviour per element type**

All hover states run 150–250 ms, and keyboard focus gets the same state.

| ID | Element | Behaviour |
|---|---|---|
| `hover-underline` | Text link | Underline draws from inline-start |
| `hover-charge` | Primary CTA | Sheen crosses once, arrow nudges, pixel pops |
| `hover-outline` | Secondary button | Gradient outline fades in |
| `hover-card` | Service card | Spotlight + Tier 2 icon story + 4 px lift |
| `hover-window` | Showcase card | Image scales inside its frame + tilt + caption rises |
| `hover-pixel-hop` | Nav item | The current-page pixel hops to the hovered item |
| `hover-guide-line` | List/table row | Stage-colour line grows at inline-start |
| `hover-glow` | Icon button | Pixel glow 0 → 0.6 |
| `hover-peek` | Editorial image | Shifts ≤ 8 px toward the pointer |

**Scroll**

- Built with native CSS scroll-driven animations inside `@supports`. Declare `animation-timeline` *after* the `animation` shorthand.
- Hidden start states are set only under `prefers-reduced-motion: no-preference`.
- GSAP ScrollTrigger only on T2/T3.
- **No scroll-jacking, no smooth-scroll libraries.**

| ID | Effect | Notes |
|---|---|---|
| `scroll-reveal` | Rise 24 px + fade, once | Default |
| `scroll-parallax` | Z0/Z2 layers move at their plane's speed (≤ ±60 px) | Images/decoration only; **body text never moves while being read** |
| `scroll-scale-dock` | Statements and images change scale as they reach reading position | "Changes scale" |
| `scroll-assemble` | Parts fly in on 35° paths and lock | "Literally assembles into it" |
| `scroll-pinned-scene` | Native `position: sticky` scene that scrubs with scroll | ≤ 1 per page on T1/T2; ≤ 250vh; uses `overflow: clip`, not hidden; unpins on short viewports, high zoom and reduced motion; steps reachable by keyboard |
| `scroll-drift` | A row moves only while you scroll | Replaces marquees |
| `scroll-journey-line` | Page-progress line with a travelling pixel, landing on the footer CTA | Sitewide |
| `scroll-signal-beams` | Beams run once along the grid lines when a chapter enters | *(Lab; from your "Background Beams" reference, without the loop)* |

**Kinetic type**

- Split on the server into word spans (0 client JS).
- Letter splitting only where noted.
- **Arabic: word-level only, no letter-spacing** (rules in 11).
- No entrance animation on the LCP element.

| ID | Effect |
|---|---|
| `type-line-rise` | Line rises from a mask |
| `type-word-stagger` | ≤ 12 words, ≤ 600 ms |
| `type-letter-assemble` | Letters fly in on 35° paths; one per page, ≤ 24 characters, screen-reader tested |
| `type-scroll-highlight` | Words brighten from mist to white as they cross the reading line (opacity layers) |
| `type-outline-fill` | Outline text cross-fades to the zeta gradient |
| `type-outline-spotlight` | Giant outline letters light up under the pointer *(your "Text Hover" reference, for the Studio)* |

**3D**

| ID | Effect | Where |
|---|---|---|
| `depth-css` | CSS 3D: tilt planes, perspective-stacked glass, device frames, the laptop lid, pixel cubes | Everywhere |
| `depth-layered` | In-house renders split into 2–3 layers ("fake 3D") | Everywhere, within the image budget |
| `depth-webgl` | Real-time WebGL: device-gated, render-on-demand, starts on first input, SVG/CSS poster | **T3 only**; never for brand marks |

**Tactile**

| ID | Effect |
|---|---|
| `touch-press` | `scale(.97)` on press (iOS behaviour: verify) |
| `touch-stamp` | Success confirmation |
| `touch-snap` | Toggles and sliders overshoot slightly |
| `touch-nudge` | Error ±4 px, 240 ms; colour only under reduced motion |
| `touch-haptic` | 10 ms vibration, Android after a gesture only; never the only feedback *(Lab)* |

**Story graphics: the animated explainers**

| ID | Graphic | Example |
|---|---|---|
| `story-flow` | Data-driven workflow; **the pixel is the customer's request travelling through the automation** | WhatsApp booking: message → AI reply → calendar → booked → reminder → review request |
| `story-chat` | A conversation plays out in **deepzeta's own chat styling** (never a copy of WhatsApp's look), official mark as a label, "Example conversation" | Hero, WhatsApp AI Agent page |
| `story-before-after` | Keyboard-operable slider or scroll | Home, Automation, Websites page |
| `story-data` | Charts from the visitor's own inputs or real measurements only | ROI calculator, Nutrition Label, Health Check |
| `story-system-map` | A bundle's service nodes light up | AI Front Desk, Quote-to-Cash |
| `story-terminal` | Typed terminal of **real** commands/logs, or labelled Example *(your terminal reference)* | Websites page, Automation, the Tools live log |

**Every story:**
- has a visible HTML step list, which keeps HowTo schema honest
- has a static final state
- has Play/Pause/Replay/step controls for stories longer than 5 s (WCAG 2.2.2)
- lives in `src/content` as typed data, with scripts written by the content writer

## A4. Choreography

- **Story arc for every page:** Hook (= H1 + direct answer, so answer-first is kept) → Pain → System → Show → Proof → Plan → Action.
- **Density by tier:**
  - T1: native CSS + first-party JS only at first load
  - T2: adds GSAP islands, loaded when visible
  - T3: full toolkit
- **Effect register:** every page plan lists its effect IDs, page tier and costs. The reviewer checks them against 13.

## A5. Surfaces (the signature moment first, then the supporting effects)

### A5.1 Header: "Proof Bar"

**Form:** a floating `glass-live` pill that condenses on scroll through a transform only, so it never jumps.

**Desktop layout**
- logo (the locked SVG component)
- nav: **Services ▾ · Automation · Studio · Tools · Work · Pricing**
  - Work appears only once a real case study exists; Pricing only once prices are confirmed.
- ⚡ **speed chip:** this visit's real LCP; it opens the Nutrition Label
- **AI View** toggle
- the CTA

**CTA handoff**
- The header CTA is an outline button while the hero CTA is on screen.
- It "charges" to the gradient afterwards, so there is one gradient CTA per view.

**AI View (X-ray)**
- The page turns into a blueprint wireframe.
- Sections show their heading level and schema entity.
- A panel shows the page's real JSON-LD, plus `llms.txt` fetched when the panel opens.
- The panel is built on open, so it never duplicates indexable text.

**Mega menu**
- A `glass-live` sheet with 4 pixel columns (grouping per C6).
- Tier 3 column heads; Tier 2 items with outcomes.
- A 6-Systems row.
- A `glass-liquid` "Try a live demo" card.
- Keyboard: disclosure buttons, Esc closes, never `role="menu"`.

**Mobile**
- Compact bar: logo, CTA and a menu button that morphs into close.
- A full-screen sheet with statement-size items (`type-word-stagger`), the proof instruments and the Reduce effects switch.

### A5.2 Footer: "The Landing"

**Finale**
- The journey line lands; the cluster assembles (`scroll-assemble`).
- A statement headline, then the CTA and WhatsApp.

**Page Nutrition Label** (real numbers from this visit)
- Page weight, requests, JS/CSS/font KB.
- LCP / CLS / INP via `web-vitals`.
- The method is stated: "cross-origin and cached files may show 0 KB".
- Where a browser can't measure a metric, it says "not measured in this browser".

**Also in the footer**
- Link columns in the pixel colours.
- Official monochrome social marks (facts §2.1).
- Legal links.
- A language placeholder, hidden until Arabic exists.
- The Reduce effects switch.
- NAP only once it is CONFIRMED in the facts file.
- Header, CTA band and footer stay navy in light mode.

### A5.3 Conversion path (new spec)

**Book a free AI audit**
- It goes to the book-audit page.
- The form has states: idle, validating, sending, success (`touch-stamp`), error.
- The Cal.com slot picker opens on demand in a sheet.

**Always-available contact**
- The floating WhatsApp button (D5).
- A sticky mobile CTA that appears after the hero CTA leaves the screen.

**Floating-element placement at 360 px**
- Priority: consent banner, then sticky CTA, then the WhatsApp float (lifts above the CTA), then panels as sheets.
- Stacking uses a z-index token scale `--dz-layer-*`. It is separate from the visual planes Z0–Z3.

**Every showcase ends in the audit:** Studio, Tools (after the report request), the Automation builder (prefilled request), and the end of the App tour.

### A5.4 Home (T1): the blueprint's 12 sections

| # | Section | Treatment |
|---|---|---|
| 01 | Hero | Statement H1 visible at first paint. The direct answer, `hover-charge` + `pointer-magnet` CTA, and "Try our AI agent". **Signature:** `story-chat` in a `glass-liquid` card, then **The Assembly**: CSS pixel cubes, upright, fly in on 35° on the first scroll; the pointer moves them in depth, never rotating them. Z0: grid + `pointer-grid-wake` + the locked logo's Z mark (cropped with `viewBox`; file untouched) with one light sweep. |
| 02 | Proof strip | Tool names as plain text, `scroll-drift`. Logos and badges only once confirmed. |
| 03 | Problem → outcome | `story-before-after` rows; the pixel travels each connector. Uses allowlisted design targets until measured results exist. |
| 04 | Four doors | `glass-frost` cards with Tier 3 icon stories, `hover-card` + `pointer-tilt`. |
| 05 | Workflow explorer (demo 3) | Accessible tabs → `story-flow` (CSS/SVG only). |
| 06 | Proof | Real case-study figures once they exist. Until then, **"Watch this page build itself"**: a `scroll-pinned-scene` with a CSS laptop (`depth-css`, from your Macbook Scroll reference). grid → wireframe → type → glass → content → schema tags → a stamp with this visit's real LCP. |
| 07 | How we work | Tier 2 step icons, a journey-line segment; timeframes only once confirmed. |
| 08 | ROI calculator (demo 2) | `story-data` from the visitor's inputs, `touch-snap` sliders. |
| 09 | Industries | Calm tiles, `hover-window`. |
| 10 | FAQ | Calm: sticky heading, `<details>`, space. |
| 11 | Final CTA | The Landing + audit form + 60-second WhatsApp test. |
| 12 | Footer | As in A5.2. |

### A5.5 Service page template (T2): visual treatment only

Structure stays owned by 10 §5 and 08 §2.

- Hero with a Tier 2 icon at 64 px (Tier 3 for Systems).
- One `story-flow` or `story-chat` for the service.
- `hover-card` lists.
- One statement headline.
- **Websites page extras:** a "Code ↔ Page" `story-before-after` slider (drag to reveal the hand-written code behind the rendered page; your Compare reference) and a `story-terminal` of our real build/Lighthouse output.

### A5.6 Automation page: "Control Room" (T2; one page, URL per C6)

1. Hero: a statement headline + an EXAMPLE operations board.
2. **"Pick your bottleneck"** (missed calls, slow replies, no-shows, stuck quotes, unpaid invoices, reviews). Each loads its `story-flow`.
3. `story-before-after`.
4. **"Build your automation":** pick a trigger and actions; the flow assembles; "Send this to our team" with consent.
5. The 6 Systems as `story-system-map`.
6. Industry rail.
7. Platforms we connect, via `scroll-drift`.
8. ROI calculator, FAQ, CTA.

### A5.7 Designer Studio (index T2; concepts T3)

**Index**
- A giant `type-outline-spotlight` hero (your Text Hover reference).
- A gallery of 15+ "worlds": `depth-layered` posters with `hover-window` and `pointer-tilt`. It is an expanding card carousel (your Apple cards reference).
- Filters by industry and style.
- **Device Stage:** a `glass-liquid` device frame with a phone/tablet/desktop toggle.
  - The concept loads in a sandboxed iframe.
  - "Open full experience" goes to the concept's own page.
- The "Our icon system" showcase.
- CTA.

**Each concept**
- `/studio/<slug>`, with its own scoped tokens and fonts (its own budget, T3).
- `noindex`, not in the sitemap or `llms` files, no business schema.
- A small "Concept by deepzeta · fictional business" bar with a back link, and no deepzeta proof chrome.

**The 15+ concepts: *(later session)*.**

### A5.8 deepzeta Tools (T2)

**Tool page anatomy**
1. Answer-first intro, including what data is used and privacy.
2. A 1–3 step wizard.
3. A **live log of the real steps** (`story-terminal`).
4. A report sheet with `story-data` gauges.
   - Visible parts are real.
   - Masked parts are neutral "ghost" layouts under frost. **Masked data never reaches the browser**, not even in page props.
5. A "Get the full report" panel with consent.
6. A Stamp confirmation, then an audit offer.

**The two tools you named**

| Tool | Visitor gives | Visible (real) | Masked → contact |
|---|---|---|---|
| **Website & AI Search Health Check** (free preview of catalogue 0.3) | URL | Speed/CWV (PageSpeed/CrUX, run on the server) + AI-readiness checks (title/meta, schema, `llms.txt`, AI-bot rules) | Ranked fix list, competitor comparison |
| **Social Media Content Planner** | Business, audience, goal, platforms, language | Week 1, written by AI (Claude via the AI SDK) | Weeks 2–4, Arabic captions, hashtags |

**More tool ideas** (you pick later):
- Automation Opportunity Finder (→ the audit)
- AI Visibility Snapshot (the model and date shown)
- Quote Builder demo
- E-Invoicing Readiness Check (official dates cited)
- Review Reply Drafter

**Guards** (written into 06)
- An SSRF guard on the URL fetcher.
- Turnstile + rate limit.
- AI token caps and prompt-injection handling.
- PDPL consent; no personal data in URLs or the dataLayer; a retention rule.
- Events registered in the taxonomy before building. Proposed names: `health_check_start`, `tool_result_view`, `report_request`.

**The complete "mega automation" sales flow: *(later session)*.**

### A5.9 App demo (T3)

**What exists today:** `D:\Deepzeta Sync App` is **Forge Growth** (MIT, by Forgemind), a WhatsApp CRM with:
- ad → chat → lead → payment attribution
- an inbox with bot/human take-over
- an AI agent test chat with a trace
- an automation builder, a funnel board and a dashboard

It is India-first (₹, Razorpay) with no RTL. **Its README asks forks to rename and not use the Forgemind name or logo.**

**Page concept**
1. A light intro.
2. **"Launch the live demo"** loads an app shell running on fictional UAE sample data (AED).
3. A guided tour follows one story: ad → chat → AI reply → human take-over → the lead moves → payment → revenue attribution.
4. Free explore afterwards.

It is labelled "Demo · sample data · nothing is sent".

**Open items *(later session)*:** name and branding, honest provenance wording, features that exist in the rebuild, the product's design language, localisation, place in the nav.

## A6. Type, space, imagery, light mode

**New tokens** (names in 05, values in P0/Lab):

| Kind | Tokens |
|---|---|
| Statement type | `--dz-text-statement` |
| Breathing room | `--dz-space-section` < `-chapter` < `-statement` |
| Glass | `--dz-glass-*` (incl. the minimum tint), `--dz-grain` |
| Pointer limits | `--dz-tilt-max`, `--dz-magnet-max` |
| Story timing | `--dz-dur-flow-step` |
| Stacking | `--dz-layer-*` |

**Colour-system tokens added under 05's naming:**
- `--dz-signal`, `--dz-violet-soft`, `--dz-magenta`
- the action-deep, fold and tagline-line gradients
- `--dz-glow-hero`, `--dz-grid`

**Light "paper blueprint" tokens** are added as PROPOSED, taken from v1, and contrast-checked in P0 before any effect ships.

**Imagery: three families**
1. In-house brand 3D renders (lit from above).
2. Real or labelled-demo product screens.
3. UAE context photography with a baked "Signal grade".

Never robots, brains or handshakes. Never AI-generated people shown as clients or team.

UI screenshots and posters are the only images that may contain text, and meaningful text always lives in HTML (a clarification to 11).

## A7. Icons (static and animated)

- The Icon Master Rules stay authoritative.
- "Animated icons" means Tier 2 hover stories (≤ 0.9 s) and Tier 3 scroll-in stories (≤ 1.6 s).
- **Each surface spec lists its own icons** (no separate placement file that could compete with the Icon Rules).
- **Proposed new icons** enter Icon Rules §8.3 through the P1 icon plan:

  | Tier | Icon | "The pixel is…" |
  |---|---|---|
  | Tier 2 | Health Check | *the fix that matters most* |
  | Tier 2 | Content Planner | *the next post going live* |
  | Tier 2 | Opportunity Finder | *the first thing to automate* |
  | Tier 2 | Audit, Build, Launch, Improve | — |
  | Tier 1 | play, pause, replay, step, lock, phone, tablet, desktop, filter, expand, external, eye, gauge | — |

## A8. Showcase honesty (each rule lives in its topic file)

**10 §3 (claims)**
- Labels: "Example", "Demo · sample data", "Concept · fictional business".
- Fictional names are checked against real UAE businesses and trademarks.
- No fake reviews or stats in concepts.
- Tools: no invented findings or fake urgency.
- Money figures only from the visitor's own inputs, with the formula shown.
- Terminal and log content is real, or labelled Example.

**08 (search)**
- Concepts and tool result views are `noindex` and excluded from the sitemap and `llms` files.
- No business schema for fictional businesses.
- Story step lists are visible.
- The AI View panel is built on open.

**06 (code)**
- Masked data is never serialised to the client.
- The tool security guards (A5.8).

## A9. Your component references → native rebuilds

| Your reference (on `docs/d1-…`) | Becomes | Where |
|---|---|---|
| Compare | `story-before-after`, keyboard-operable | Websites page "Code ↔ Page", Home 03, Automation |
| Mac-style terminal | `story-terminal` (real commands/logs) | Websites page, Automation, Tools live log |
| Apple card carousel | Studio gallery + Device Stage | Studio |
| Macbook Scroll | `depth-css` laptop in a `scroll-pinned-scene` | Home 06 "Watch this page build itself" |
| Text Hover Effect | `type-outline-spotlight` | Studio hero |
| Background Beams | `scroll-signal-beams`, once per chapter (the endless loop is rejected) | *(Lab)* |

All of these are rebuilt without `motion/react`, Tabler icons or remote assets.

---

# Part B — Files (grouped by commit; every commit asks you first)

`docs/ai/**`, `docs/decisions/**`, `docs/facts/**`, `CLAUDE.md`, `AGENTS.md` and `.claude/**` are protected, and each edit prompts you. Your instruction in this chat is the authority (00 §5, precedence 1).

**Commit 0 · pre-flight** (branches as listed above)
- `main`: fast-forward to `docs/d1-domain-and-component-refs`. This brings in 0006 (domain) and your 6 references.
- `docs/facts-social-profiles`:
  - `docs/facts/company-facts.md`: your pending edits, as they are.
  - `docs/ai/08-seo-geo-aeo-schema.md`: your pending `sameAs` line, and "Last reviewed" bumped to 2026-09-29.

**Commit 1 · `docs/stack-decision`**

| Path | Action |
|---|---|
| `docs/decisions/0006-roo-code-as-implementer.md` → `0007-roo-code-as-implementer.md` | Rename (`git mv`); update its title and its three self-references (§6) to 0007. Still PROPOSED; the C7 contradiction is flagged, not decided. Nothing else references it |
| `docs/plans/2026-09-26-stack-rule-changes.md` | Amend: "accepted", "real-time 3D (WebGL)" wording, C14 also cites blueprint §6, add 03 lhci-per-tier, drop the Node step. Status APPROVED, then DONE |
| `docs/ai/06` §1 and §5 · `docs/ai/05` §5 rules 2 and 5 · `docs/ai/07` §1 and §5 · `docs/ai/09` §1 · `docs/ai/03` (lhci per tier) · `CLAUDE.md` current state | Exactly as in the amended stack plan |
| `docs/ai/conflict-register.md` | Append C12–C15 |
| `docs/decisions/README.md` | 0004/0005 → ACCEPTED; add 0007 (PROPOSED) |

**Commit 2 · `docs/design-direction-v2`: protect first**

| Path | Action |
|---|---|
| `.claude/settings.json` | Add `Edit(/docs/design/*.md)` to "ask" (prototypes stay prompt-free) |
| `docs/ai/00` §5 | Add `docs/design/*.md` to the protected list |
| `AGENTS.md` | Never-edit list: add `docs/design/*.md`, `docs/decisions/**`, `docs/facts/**` |

**Commit 3 · additive**

| Path | Action |
|---|---|
| `docs/plans/2026-09-29-design-direction-v2.md` | This plan, `Status: APPROVED (owner, 2026-09-29)` |
| `docs/decisions/0008-design-language-signal-and-depth.md` | Decisions 1–10 above |
| `docs/decisions/README.md` | Add the 0008 row (ACCEPTED, owner, 2026-09-29) |
| `docs/ai/13-experience-design.md` | Principles, the library, the behaviour matrix, byte caps, choreography, technical guards, the effect register + ID governance, the reference map, imagery. Standard header |
| `docs/design/README.md` | Index, status legend (CONFIRMED / LAB / LATER), rank (00 §3 level 5), change log |
| `docs/design/header.md`, `footer.md`, `conversion-path.md`, `home.md`, `service-page.md`, `automation.md`, `studio.md`, `tools.md`, `app-demo.md` | Surface specs: effect IDs, content slots, states, breakpoints, icons. Never restated rules |
| `docs/ai/conflict-register.md` | Append entries, one per source conflict, each "Resolved — owner (plan approval)" unless marked OPEN: C16 effects vs glass/3D/pointer limits (05, constraint, blueprint, colour-system G9) · C17 new pages vs page map · C18 showcase content vs N3 · C19 blueprint header/footer/hero/proof-strip changes · C20 Icon Rules (cluster outside icons, pixel meaning) · C21 150 KB and T1 "native" · C22 token names · C23 component references · C24 text in UI images |
| `docs/ai/lessons-learned.md` | First project entries: v1 mockup mistakes ×4; rules drifting from accepted decisions (with a prevention) |

**Commit 4 · existing rule files** (each gets "Last reviewed" bumped)

| File | Changes |
|---|---|
| **00** | §3 item 5 (+`docs/design`); "01–12" → "01–13"; §4 row; §6 map (`docs/design/`, `src/lib/fx/`, `src/components/fx/`); §7 glossary + ID namespace table |
| **01** | Architect may also edit `docs/design/*.md`; reviewer/auditor checklists |
| **03** | `check:rules` runs now (`node scripts/check-rules.mjs`); planned effect e2e modes; an "LCP not hidden" assertion |
| **04** | New pages placed in phases; P2/P5 feasibility gate; template rows "Page tier" and "Effects used (IDs + cost)" |
| **05** | §1 motif rule + pointer to 13; §2 tokens + light PROPOSED; §3 statement; §4 spacing, glass, layer; §5 rule 2 native definition, rule 6 → glass ladder; logo-gradient clarification |
| **06** | §2.7 WebGL loading; §5 visual-reference rule; tools security; masked data |
| **07** | §2 the 150 KB definition + font exception for concepts; §3 hero/glass lines; §4 costs for every new instrument/effect/demo |
| **08** | `noindex`/sitemap/`llms` exclusions; visible story steps; AI View rule; schema for new page types marked OPEN (decided in their page plans) |
| **10** | §3 showcase honesty; §5 story-arc mapping |
| **11** | §1: Arabic word-level split, no letter-spacing, the UI-image exception, lit-from-above |

**Commit 5 · entry points**

| Path | Changes |
|---|---|
| `CLAUDE.md` | Rows for 13 and `docs/design/README.md`; Node fact; wording of the "never edit rules" line; open decisions |
| `AGENTS.md` | Summary line |
| `.claude/rules/styling-and-components.md` | Paths + `src/lib/fx/**`; pointer to 13 |
| `.claude/skills/{new-component,new-page,plan-task}/SKILL.md` | Effect IDs, page tier, LCP rule, surface spec |
| `.claude/agents/{architect,reviewer,perf-a11y-auditor,content-writer-en,seo-geo-auditor}.md` | 1–2 lines each |

**Outside the repo:** memory files and `MEMORY.md`.

**Never touched:**
- `Planning Folder/**`. The only exception is the six reference files that the fast-forward brings in from your own branch.
- the logo, `.env*`, lockfiles
- your untracked items (the mockup zip, the three untracked reference notes, the visibility guide)

# Part C — Steps

1. **Memory.** Save the parked topics, each with a "remind the owner" note:
   - Studio: 15+ concepts
   - Tools: mega automation
   - App demo: Forge Growth facts + licence/branding

   Also:
   - Save the process feedback: every confirmed design decision is written into the rules.
   - Fix `deepzeta-website-project.md`: Node v24 is installed, and 0006-domain lives on the unmerged branch.
2. **Pre-flight (commit 0)**, then `git log` to confirm.
3. **Stack decision (commit 1).**
4. **Design commits 2 → 5**, in order. Before each commit:
   - `node scripts/check-rules.mjs`
   - a manual check of every `Planning Folder/…` path referenced from entry files (the gate skips paths with spaces)
   - a consistency grep (no remaining "no GSAP", "one WebGL moment on the whole site", "glass only…", "Node.js is not installed", or "CSS first" wording that contradicts 0005/0008/13)
   - `git diff --stat` compared with the commit's list
   - a re-read of the changed lines
5. **Report** in the 02 §5 format with real gate output. Offer to fast-forward `main` through the branches once you're happy.
6. **Next, as its own short plan: the Design Lab** (`docs/design/prototypes/design-lab.html`).
   - Self-contained: no CDN fonts or libraries.
   - The logo is shown only by referencing the locked file.
   - A "prototype" banner.
   - Toggles: dark/light, LTR/RTL, reduced motion, low-end.
   - Keep/change/drop controls per effect.
   - Checked on a phone.
   - Decides the *(Lab)* items (`touch-haptic`, `scroll-signal-beams`, `glass-liquid` refraction) and the token values.

# Part D — Parked (saved to memory; I'll remind you)

1. **Designer Studio:** the 15+ concept designs, one by one.
2. **Tools:** the complete "mega automation" sales flow.
3. **App demo:** name, branding, provenance, which features, localisation.
4. **C6 pillars vs stages:** mega-menu grouping, stage colours, the Automation URL.
5. **The Lab decisions**, then the P1 icon plan.

## Risks & mitigations

- **Effects creep:** effect register, byte caps, per-viewport caps, `lhci` per tier, the feasibility gate, reviewer and auditor checks.
- **Rule duplication (L2):** one topic per file; specs cite IDs and never restate rules.
- **Browser gaps:** verification flags; everything degrades to the static final state; the Reduce effects switch.
- **Honesty:** the A8 rules, `noindex`, masked data never shipped, "Example" labels.
- **App licence and branding:** parked as an explicit decision; no Forgemind branding.
- **~40 approval prompts:** each is one coherent file diff. You may allow edits for the session at the first prompt if you prefer.

## Verification

- **`node scripts/check-rules.mjs`** (Node v24.19.0 is installed): it must print `check:rules passed` after every commit.
- **The manual path check** for `Planning Folder/…` references, and the consistency grep above.
- **`git status`:** only your untracked items remain after the final commit. `git log` shows the stacked commits.
- **The new files:**
  - 13 and 0008 open with the right headers.
  - Every file referenced from CLAUDE.md exists.
  - The decisions index matches the file statuses.

## Noticed along the way (flagged, not fixed here)

- **0007 (Roo Code)** contradicts C7 ("Roo Code shut down"). It's your call whether to keep or withdraw it.
- **`origin/main`** has unrelated history (just a LICENSE commit). Pushing needs your decision; force-push is banned.
- **The Google tag snippet** mixes gtag.js and GTM, which conflicts with 09 §2.1. Handle it in P3.
- **Contrast:** white text on the Deep Action gradient (G4) is about 3.6:1; fix when tokens are finalised in P0.
- **Social handles** are inconsistent.
- **`check:rules` blind spot:** it can't check paths that contain spaces. Extending it deserves its own small plan.
