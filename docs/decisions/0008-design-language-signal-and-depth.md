# 0008 · Design language: Signal & Depth (Design Direction v2)

Status: ACCEPTED (owner, 2026-09-29, by approving `docs/plans/2026-09-29-design-direction-v2.md`)

## Context

On 2026-09-29 the owner opened the design discussion. They asked for:
- a premium, futuristic design with glass, frosted and liquid glass, 3D, parallax, kinetic and scroll-reactive type, bold display type, rich pointer and hover effects, tactile feedback, story-driven motion, animated explainer graphics, and custom static and animated icons
- a unique header and footer
- four new pages: Designer Studio, Automation, deepzeta Tools and an App demo

**The constraints:**
- The site must stay inside the speed budget (N1), remain custom-coded (N2) and prove every claim it makes (N3).
- Homepage mockup v1, "Signal Grid", was honest and light but visually restrained.
- The owner's component references in `Planning Folder/Components references/` are built on `motion/react`, which decision 0004 does not adopt.

## Decision

1. **Design language "Signal & Depth".** The site is a deep-navy space with four depth planes (Z0–Z3), lit from above, with the visitor's pointer as a second light.
   - The Zeta Pixel is the signal. The icon motion vocabulary (Pop · Drop · Stamp · Travel · Assemble) becomes the motion vocabulary of the whole site.
   - It combines blueprint direction A "Signal Grid" (brand) with direction B "Control Room" (data surfaces).
   - Its rules, effects library and choreography live in `docs/ai/13-experience-design.md`. The surface specs live in `docs/design/`.
2. **Responsive motion only.** Nothing moves unless the visitor scrolls, hovers, taps or focuses. There is no ambient, idle or looping animation. Stories play once, with a replay control.
3. **The 150 KB limit (07 §2) covers everything loaded before the first interaction.** Code started by an explicit visitor action ("Launch", "Play", "Open") never loads on first view and is budgeted per feature in its own plan. Core Web Vitals stay hard limits on every page.
4. **Pages, names, URLs and page tiers**, registered here per 04 §1.5:

   | Page | URL | Page tier |
   |---|---|---|
   | Designer Studio | `/studio` | T2 |
   | Studio concepts | `/studio/<slug>` | T3, `noindex` |
   | deepzeta Tools | `/tools` | T2 |
   | Website & AI Search Health Check (a tool: the free, instant preview of catalogue service 0.3) | `/tools/<slug>` (the slug is set in its plan) | T2 |
   | Social Media Content Planner (a tool) | `/tools/<slug>` | T2 |
   | Automation ("Control Room") | `/services/ai-automation` if C6 keeps the pillars; `/automation` if C6 picks the stages | T2 |
   | App demo | set in its own owner session | T3 |

   The Studio's concept routes are the "/lab showcase" foreseen in decision 0005.
5. **T1 "native" is defined.** Decision 0005 allows only native techniques on Home at first load. "Native" means platform features plus first-party vanilla JavaScript, with no third-party animation libraries.
   - Provisional cap: ≤ 10 KB compressed of effect/UI JavaScript on Home at first load.
   - The cap is validated by the feasibility gate in P2/P5. C8 (the framework baseline) stays open.
6. **The pixel marks value, progress or the current place, never decoration.** The idea of a "pixel companion cursor" is dropped.
7. **The four-pixel cluster** may be used outside Tier 3 icons in exactly two brand moments: **The Assembly** (Home hero) and **The Landing** (footer finale).
   - The pixels stay upright, use the exact `--dz-pixel-*` gradients and have no outlines.
   - They are built in CSS only, never WebGL.
   - The logo file is never touched.
8. **Token names.** Where 05 and the colour-system file disagree, 05's names win and the values come from the colour system. Pixel gradients stay 3-stop, as in the Icon Master Rules. Final names and values are set in P0.
9. **The owner's component references are visual references only.** Each is rebuilt natively (13 §9). No copied library code.
10. **Header "Proof Bar" and footer "The Landing".**
    - On desktop, the live speed badge and "See how AI reads this page" (blueprint demos 5 and 6) move into the header, as the speed chip and AI View.
    - The footer keeps the full Page Nutrition Label, and on mobile it also holds AI View.

## Consequences

- **New files:**
  - rule file `docs/ai/13-experience-design.md`
  - surface specs in `docs/design/`, protected as `docs/design/*.md`
- **Rule files updated:** 00, 01, 03, 04, 05, 06, 07, 08, 10 and 11, plus `CLAUDE.md`, `AGENTS.md`, and the `.claude` rules, skills and agents.
- **Conflict register:** C16–C24 record where this decision supersedes the blueprint, the colour system, the Icon Master Rules, the performance constraint, 07 and 11.
- **Parked for later owner sessions:**
  - the 15+ Studio concepts
  - the "mega automation" sales flow behind the Tools
  - the App demo: name, branding, honest provenance wording, features and localisation
  - conflict C6
- **Design Lab:** a prototype (with its own plan) decides the items marked **Lab** in 13 and the token values.
- **New icons** proposed in the surface specs enter Icon Master Rules §8.3 through the P1 icon plan.
