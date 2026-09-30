---
name: new-icon
description: Recipe for designing and coding a deepzeta icon that follows the Icon Master Rules (tiers, Zeta Pixel, logo cluster, colour, motion, RTL, accessibility, code budget). Use only inside an approved plan that lists the icon's files.
argument-hint: "[icon name, tier, pillar]"
---

Icon: $ARGUMENTS. First confirm an **approved plan** lists the files. If not, stop and run `/plan-task`.

Read `Planning Folder/For Ai/DeepZeta Icon Master Rules.md` in full before drawing. It is authoritative. Then read `docs/ai/05-design-system.md` §6 (how icons are delivered) and conflicts C36–C38.

1. **Tier:** 1 (interface: plain line, no pixel), 2 (service: lines + exactly one pixel), or 3 (signature: the logo's four-pixel cluster, depth layer, sweep; 64px and up).
2. **Name and pillar:** the exact Services Catalogue name and number. The pillar is the catalogue section (1 AI Automation `ai`, 2 Websites `web`, 3 Software `software`, 4 Growth & Ranking `ranking`; C6), never the old stages.
3. **Metaphor:** write "The pixel is …" in one sentence. Check the banned-metaphor list (§8.2).
4. **Geometry:** 24 grid (Tier 1–2) or 48 grid (Tier 3); padding; keyline shapes; the §3 corner radii (2.25 large, 1.25 small); stroke 1.5 (1.75 on Tier 3); square caps, round joins; positions on the 0.25 grid; horizontal and vertical line centres on .25 or .75 (§3; only the 11 P1 prototype icons are exempt, C39).
5. **Pixel:** upright square, 2.6–3.4 units, radius 12.5% (Tier 2); inside the live area; at least 0.75 from every line, or `knockout: true`. Tier 3 cluster uses the exact logo sizes, offsets, radii and gradient vectors from §4.3, with no outlines.
6. **Code:** add the icon as data to `src/components/icons/registry.ts` (the source of truth until a Figma master exists, C36). `<Icon>` renders it; `<IconDefs>` provides `url(#dz-px-{pillar})`, the glow and the knockout. No colour values in the icon. No SVGO: there is no exported SVG to optimise.
7. **Motion:** one pixel motion from §7.3, in `src/styles/icons.css`, on the one `--dz-dur-story` timeline (900 ms for Tier 2) with the choreography in keyframe percentages; transform/opacity only; ends on the rest (or hover) frame; static under reduced motion, more contrast and forced colours.
8. **RTL:** set the `flip` flag per §9.
9. **Accessibility:** icons are always decorative (`aria-hidden`, `focusable="false"`); a meaningful icon's label goes on its button. The host (`dz-icon-host`) plays the story on hover and keyboard focus.
10. Run the §12 quality checklist and the gates: `tests/unit/icons.test.ts` (catalogue name, grid, radii, budget) and `tests/e2e/icons.spec.ts` (clearance, painting, states, RTL, axe). Then report with evidence.
