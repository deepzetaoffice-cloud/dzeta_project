# Plan: Fix "Watch this page build itself" (Home §06) so the laptop actually pins and builds
Status: APPROVED (owner, 2026-10-09)
Phase: P6 (Home polish)
Branch: fix/home-watch-build-itself
Page tier: T1 (decision 0005) — Home ≥ 95; keep the current 100 Performance score

## Goal served
"Prove every claim it makes" (North Star, 00 §1) — the §06 signature moment is meant to *demonstrate*
the site builds itself, but today it is nearly static, which reads as an empty grid and undercuts the
section's whole point. This makes it deliver the scroll-pinned build animation it was designed to show.

## Context
- §06 is the page's one pinned scene (`scroll-pinned-scene` + `depth-css` laptop), per
  [`docs/design/home.md`](docs/design/home.md:22) and [`docs/ai/13-experience-design.md`](docs/ai/13-experience-design.md:236):
  grid → wireframe → type → glass → content → schema tags → a stamp showing this visit's real LCP.
- Two defects make it inert today:
  1. **No pinning.** The CSS comment on `.dz-pin-stage` ([`src/styles/effects.css`](src/styles/effects.css:1994))
     says "position: sticky inside a ≤ 250vh stage", but the rule only sets `min-block-size: 200vh`.
     No `position: sticky` exists for this scene (the only sticky in the file is the FAQ intro column at
     line 1366), and `.dz-pinned-scene` has no rule at all. The laptop scrolls past like any other element.
  2. **No visible build.** The five layers are empty `<span>`s ([`src/components/sections/home/MidSections.tsx`](src/components/sections/home/MidSections.tsx:60))
     styled only as dashed-border rectangles ([`.dz-lap-layer`](src/styles/effects.css:2042)); their only
     animation is opacity 0 → 1 ([`src/styles/effects.css`](src/styles/effects.css:2106)). No wireframe,
     type, glass, content or schema tags are ever drawn.
- The approved reference prototype ([`docs/design/prototypes/design-lab.html`](docs/design/prototypes/design-lab.html:953))
  already shows the intended visuals (`.ly-grid`, `.wire`, `.ly-type`, `.ly-glass .gl`, `.ly-content`,
  `.ly-schema`, `.ly-stamp`) and the pin recipe (`.scene{height:240vh}` + `.scene-inner{position:sticky}`).
- **Owner decision (2026-10-09):** native CSS scroll-driven animation — pin with `position: sticky` and
  scrub with `animation-timeline: scroll()`. Zero JavaScript, keeps the score and byte budget untouched.
  Chromium-only; Firefox/Safari show the finished static state (all layers visible), matching the rule
  that content is never hostage to the effect (13 §2.7–2.8).

## Out of scope
- No new JavaScript, no dependencies, no images, no canvas/WebGL, no animation libraries.
- No change to the live LCP stamp's behaviour (it already fills via the lazy home enhancement).
- No change to the illustrative proof cards added under §06 (previous task).
- No change to the H2 order or the section list (the e2e test asserts both).
- No change to the LCP element (the hero H1/answer stays the LCP).

## Allowed files
| Path | Action | Purpose |
|---|---|---|
| `src/styles/effects.css` | MODIFY | Replace the inert `.dz-pin-stage`/`.dz-lap-layer` block with: (a) a sticky pin stage ≤ 250vh; (b) real layer visuals; (c) scroll-driven layer scrub; (d) the no-support/Reduce-effects finished state |
| `src/components/sections/home/MidSections.tsx` | MODIFY | Give the five `.dz-lap-layer` spans their visual children (wireframe, type, glass, content, schema tags) instead of empty spans |

No other files change.

## Design (implementation notes)
- **Pin:** a wrapper gets `position: sticky; inset-block-start: <header clear>` and a stage height
  `min-block-size` capped at 250vh (13 §4.4). Mirrors the prototype's `.scene` + `.scene-inner`.
- **Layers:** the five layers become `.dz-lap-layer--wire`, `--type`, `--glass`, `--content`, `--schema`,
  each drawing its step with CSS-only primitives already in the token set (`--dz-grid-line`,
  `--dz-glass-tint-min`/`--dz-glass-edge`, `--dz-grad-action`, `--dz-pixel-*`, `--dz-text-*`,
  `--dz-font-mono`). All transforms/opacity only; no paint-heavy properties beyond what already exists.
- **Scrub:** reuse the codebase's proven native pattern ([`.dz-journey`](src/styles/effects.css:867)) —
  declare `animation-timeline` *after* the `animation` shorthand, inside
  `@supports (animation-timeline: scroll())`, inside `@variant fx`. Layers fade in on a stepped range so
  each of the 6 steps lights up in sequence as the scene crosses the viewport.
- **Fallback:** without scroll-timeline support or under Reduce effects, every layer shows in its final
  state (like the current [`src/styles/effects.css`](src/styles/effects.css:2116) rule, which the new
  markup keeps working).

## Effect register (visual work only)
| Section | Effect ID | Cost → mitigation | Byte cap (13 §7) | Verify items |
|---|---|---|---|---|
| §06 pinned scene | `scroll-pinned-scene` + `depth-css` (13 §5) | transform/opacity only, compositor-driven, no JS | no first-load JS added | axe clean; CLS 0; LCP unchanged; Reduce-effects static state |

## Dependencies to add
None.

## Risks & mitigations
- **Sticky pin vs LCP** — the sticky wrapper must not become the LCP element or shift layout. Mitigation:
  the hero H1/answer remains the LCP; the stage is below the fold; sticky is transform-free (position only).
- **Chromium-only scrub** — Firefox/Safari won't animate. Mitigation: `@supports` gate + finished static
  state, so nothing is hidden and the content is still complete there.
- **CLS** — `min-block-size: 200vh` on the stage reserves the scroll room up front. Mitigation: set the
  height unconditionally (inside `@variant fx` as today) so no late layout change occurs.
- **Axe** — the laptop stays `aria-hidden="true"`; the visible step list remains the accessible text layer.

## Gates (from 03 §2)
- `verify:fast` (`typecheck` + `lint` + `check:tokens` + `check:contrast`)
- `check:facts`
- `build`
- `test:e2e` (Home)
- `lhci` (Home profile, unchanged budgets)

## Manual checklist (owner)
- Visually confirm the laptop pins and the six steps light up in order while scrolling on desktop
  Chrome, and that Firefox/Safari show the finished screen.

## Open questions
None.
