---
name: new-component
description: Recipe for creating or extending a UI component on the deepzeta website (reuse, extend, create; tokens; logical CSS; accessibility; performance). Use only inside an approved plan that lists the component's files.
argument-hint: "[component name and purpose]"
---

Component: $ARGUMENTS. First confirm an **approved plan** lists the files. If not, stop and run `/plan-task`.

1. **Reuse → extend → create.** Search `src/components/` for anything similar. State what you found. Extend with a prop/variant if it's about 80% right; create new only if nothing is close.
2. **Placement and naming:** `ui/` · `sections/` · `layout/` · `icons/` · `demos/`; PascalCase by role; one component per file; export `<Name>Props`.
3. **Server Component by default.** `'use client'` only for state/effects/events/browser APIs, as low in the tree as possible.
4. **Styling:** Tailwind classes from tokens in `src/styles/tokens.css` only; no raw hex/px; logical properties only (`ms-/me-/ps-/pe-/start-/end-`).
5. **Content:** via props; no hardcoded copy.
6. **Accessibility:** semantic element first; keyboard operable; visible focus (`--dz-ice` ring); labels/aria where needed; touch targets ≥ 44px; works at 360/390/768/1024/1280/1536px.
7. **Motion:** transform/opacity only, CSS first, no loops, reduced-motion static state; state the performance cost and mitigation in the plan.
8. **States:** hover, focus-visible, active, disabled, loading, error, empty as relevant.
9. **Gates:** `verify:fast` (+ `test` if it has logic, + `build`), then report with evidence.
