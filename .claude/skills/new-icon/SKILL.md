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
5. **Pixel:** upright square, 2.6–3.4 units, radius 12.5% (Tier 2); inside the live area; at least 0.75 from every line, or `knockout: true`. Tier 3 cluster uses the exact logo sizes, offsets, radii and gradient vectors from §4.3, with no outlines: place it with `ClusterPixels` from `src/components/icons/Cluster.tsx` (the main pixel 5–6 units), never by hand.
6. **Code:** add the icon as data to `src/components/icons/registry.ts` (the source of truth until a Figma master exists, C36). `<Icon>` renders it; `<IconDefs>` provides `url(#dz-px-{pillar})`, the glow and the knockout. No colour values in the icon. No SVGO: there is no exported SVG to optimise.
   - **Tier 3 (P2, decision 0019):** the 48 grid with the live area 4–44 (every point and the whole cluster); frame `rx` 4, parts 3 or 4; dots 1.1; markup classes `dz-3-{pillar}-*`, `data-fx-once`, four cluster pixels and one glow. `<IconDefs>` also needs the icon's clip and its knockouts: on the 48 grid a knockout cuts 1.8 units (1.5 left a stub of frame line between two cluster pixels). Sizes 64, 96, 128 or 160; the budget is 4 KB at 160 px.
7. **Motion:** one pixel motion from §7.3, in `src/styles/icons.css`, on the one `--dz-dur-story` timeline (900 ms for Tier 2) with the choreography in keyframe percentages; transform/opacity only; ends on the rest (or hover) frame; static under reduced motion, more contrast and forced colours.
   - **Tier 3:** one `--dz-dur-story-signature` timeline (1.6 s; every part ends by 1.55 s): depth settles, glass fades in, details arrive, the cluster assembles on 35°, the glow pulses as the sweep crosses. It plays once when the shared observer adds `.is-in`, and again on hover and focus through a **replay twin** of each part (`…-again`, listed after the first, so leaving doesn't replay). Under Reduce effects it's static with the glow at 0.45. In `icons.css`, put Tier 3 rules before the forced-colours block, so forced colours win (P2 step 8 found the glass fill surviving otherwise).
8. **RTL:** set the `flip` flag per §9. **Tier 3 never mirrors** (C45), whatever it draws.
9. **Accessibility:** icons are always decorative (`aria-hidden`, `focusable="false"`); a meaningful icon's label goes on its button. The host (`dz-icon-host`) plays the story on hover and keyboard focus. A card holding a Tier 3 head above links with their own icons uses `dz-t3-host`, which plays only the Tier 3 icon.
10. Run the §12 quality checklist and the gates: `tests/unit/icons.test.ts` (catalogue name, grid, radii, budget) and `tests/e2e/icons.spec.ts` (clearance, painting, states, RTL, axe). Then report with evidence.
