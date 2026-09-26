---
name: new-icon
description: Recipe for designing and coding a deepzeta icon that follows the Icon Master Rules (tiers, Zeta Pixel, logo cluster, colour, motion, RTL, accessibility, code budget). Use only inside an approved plan that lists the icon's files.
argument-hint: "[icon name, tier, stage]"
---

Icon: $ARGUMENTS. First confirm an **approved plan** lists the files. If not, stop and run `/plan-task`.

Read `Planning Folder/For Ai/DeepZeta Icon Master Rules.md` in full before drawing. It is authoritative.

1. **Tier:** 1 (interface: plain line, no pixel), 2 (service: lines + exactly one pixel), or 3 (signature: the logo's four-pixel cluster, depth layer, sweep; 64px and up).
2. **Metaphor:** write "The pixel is …" in one sentence. Check the banned-metaphor list (§8.2).
3. **Geometry:** 24 grid (Tier 1–2) or 48 grid (Tier 3); padding; keyline shapes; stroke 1.5 (1.75 on Tier 3); square caps, round joins.
4. **Pixel:** upright square, radius 12.5% (Tier 2); Tier 3 cluster uses the exact logo sizes, offsets, radii and gradient vectors from §4.3, with no outlines.
5. **Colour:** lines `currentColor`; pixel `url(#px-{stage})` from shared defs; no colour values inside the icon.
6. **Motion:** one pixel motion from §7.3; transform/opacity only; ends on the rest frame; within duration limits; reduced-motion static.
7. **RTL:** set the `flip` flag per §9.
8. **Accessibility:** decorative → `aria-hidden="true"` `focusable="false"`; meaningful → label on the parent control.
9. **Code:** Tier 1 in the sprite; Tier 2–3 as server-rendered inline React components; SVGO; within the byte budget (≤ 0.4 / 1 / 4 KB).
10. Run the §12 quality checklist and the gates, then report with evidence.
