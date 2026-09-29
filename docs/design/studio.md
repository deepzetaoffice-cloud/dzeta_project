# Designer Studio

Status: CONFIRMED (frame); the 15+ concepts are LATER (owner session) · Decision 0008 · Effects: [13](../ai/13-experience-design.md)

**Page tiers:** index **T2**, concept pages **T3**.

## Idea

The Studio is a gallery of 15+ complete concept worlds for different businesses. Each is built in its own design language, to prove the range and craft of our custom code.

The heavy experiences load only when the visitor opens one ("wow on demand"), so the Studio page itself stays fast in PageSpeed.

## Index (`/studio`)

1. **Hero:** a giant `type-outline-spotlight` word (decision 0009).
   - The word is filled with the zeta gradient.
   - A frosted-glass lens follows the pointer.
   - The letter edges ripple a few pixels toward the direction the pointer moves (a "water touch"), then settle.
   - The word underneath drifts its gradient slightly.
   - On touch devices and with Reduce effects on, it's a static gradient word.
2. **Gallery:** an expanding card carousel of "worlds".
   - `depth-layered` posters, `hover-window`, `pointer-tilt`.
   - Filters by industry and by style: App-style UI · 3D · Editorial · Luxury · Playful · Data-rich · Minimal.
3. **Device Stage:** opening a card shows a `glass-liquid` device frame with a phone / tablet / desktop toggle.
   - The concept loads in a sandboxed iframe, so its code never runs in the Studio page.
   - "Open full experience" goes to the concept's own page.
4. **How we design:** a calm section.
5. **"Our icon system":** a showcase of our three icon tiers and their stories, as proof of in-house design.
6. **CTA** (conversion-path.md).

## Concept pages (`/studio/<slug>`)

- **Own design:** scoped design tokens and fonts, with their own budget within T3. deepzeta tokens don't apply inside.
- **Search:** `noindex, follow`; not in the sitemap or the `llms` files; no business schema (08).
- **Chrome:** a small "Concept by Deepzeta AI · fictional business" bar with a back link. The deepzeta header instruments don't appear.
- **Honesty:** fictional names are checked against real UAE businesses and trademarks. No fake reviews or stats (10 §3).
- **Speed:** Core Web Vitals hard limits still apply.

## Concept spec template

One per concept, filled in during the Studio session:
- industry
- fictional business name
- audience
- design idea
- signature effect
- layout
- palette
- type
- imagery
- effect IDs (13)
- tech (GSAP? WebGL?)
- weight budget
- poster assets

## Concepts

LATER: the owner will plan the 15+ concepts one by one. The range to cover: app-style UIs, 3D, animation-rich pages, scroll and parallax.
