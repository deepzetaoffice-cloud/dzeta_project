# Plan: Design Lab prototype (Signal & Depth)
Status: APPROVED (owner, 2026-09-29: "please proceed to Design lab to visually validate")
Phase: P-1 (prototype only, not production code)
Branch: docs/design-direction-v2 (no commit unless the owner asks)
Page tier: n/a (prototype)

## Goal served
*"… proves every claim it makes."* The owner sees every confirmed effect before any production code is written. Their keep/change/drop verdicts and token tuning then update `docs/ai/13` and `docs/design/`.

## Context
Decision 0008 and `docs/plans/2026-09-29-design-direction-v2.md` (Part C step 6).

## Out of scope
- production components
- `depth-webgl` (shown later with the Studio concepts)
- real site copy (the Lab uses labelled sample copy and real catalogue names only)

## Allowed files
| Path | Action | Purpose |
|---|---|---|
| `docs/design/prototypes/design-lab.html` | CREATE | The Lab page, published as a private Artifact |
| `docs/plans/2026-09-29-design-lab.md` | CREATE | This plan |

The locked logo is **referenced unchanged** (published alongside the page as `logo.svg`, byte-identical). It is never edited or recreated.

## Effects shown (IDs from docs/ai/13)
- All glass, pointer, hover, scroll, kinetic type, tactile and story effects.
- `depth-css` and `depth-layered`.
- The named compositions: header "Proof Bar", AI View, CTA handoff, The Assembly, The Landing, the Page Nutrition Label.
- Lab decisions: `touch-haptic`, `scroll-signal-beams`, `glass-liquid` refraction, and token values (tilt, magnet, blur, tint, statement size).

## How verdicts are kept
The page's `db` capability stores:
- `verdicts/<effect-id>`: `{verdict, note, updatedAt}`
- `tuning/values`

Claude reads them back with `ArtifactData`. Without `db`, verdicts stay in the browser and the owner reports them in chat.

## Deviations (stated, not hidden)
- **Fonts:** loaded from Google Fonts for preview fidelity. Production self-hosts them via `next/font` (05 §3).
- **Scroll effects:** use one small script, so they work in every browser. Production uses native CSS scroll timelines first (13 §4.4).

## Risks & mitigations
The Lab is heavier than a real page, which is acceptable for a prototype and never shipped. It still includes:
- reduced-motion support
- a Reduce effects toggle
- a low-end toggle
- RTL and light-mode toggles

## Gates
Open the page and check that it renders with no console errors, at phone and desktop width, in both themes.

## Open questions
none
