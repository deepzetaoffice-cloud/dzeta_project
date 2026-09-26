# 0005 · Performance tiers per page type

Status: ACCEPTED (owner jamsheed khalid. date : 26-9-2026)

## Context
`docs/ai/07 §1` sets one Lighthouse mobile Performance floor (≥ 90, target ≥ 95) for every page. The owner wants the highest possible speed on the home page and more design freedom ("wow" effects) on other pages. Service and conversion pages are where search and AI engines send visitors, and prospects test them in PageSpeed Insights, so they keep a high floor. Core Web Vitals are a page-level Google signal, so they stay a hard limit everywhere.

## Decision

| Tier | Pages | Lighthouse mobile Performance floor | Motion toolkit allowed |
|---|---|---|---|
| **T1** | Home | **≥ 95** | Native only at first load (CSS transitions, CSS scroll-driven animations, View Transitions, `@property`, SVG). One WebGL hero moment only if it loads after LCP on capable devices, the LCP element is static (SVG/CSS), and `lhci` still passes ≥ 95; otherwise it starts on first scroll or tap. |
| **T2** | Services hub and service pages, book-audit, pricing, contact | **≥ 90** | Native + GSAP islands loaded when the section becomes visible |
| **T3** | Case studies, about, resources, a `/lab` showcase (if built) | **≥ 70** | GSAP + ScrollTrigger, WebGL, Rive. Heavy effects gated on device capability, `prefers-reduced-motion` and Save-Data. |

**All tiers:**
- Core Web Vitals hard limits: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 (test conditions per `07`: mobile, budget Android, slow 4G)
- Accessibility / Best Practices / SEO ≥ 95
- transform/opacity animation only
- static final state under `prefers-reduced-motion: reduce`
- no scroll-jacking or smooth-scroll libraries
- every effect's plan states its cost and mitigation

These are **page tiers**, not the icon story tiers (Tier 1–3) in the Icon Master Rules; rule text says "page tier T2" to avoid confusion. A page's tier is set in the plan that builds it. A page not listed defaults to **T2**.

**Regression rule:** `07 §5` applies per tier. A change that drops a page more than 2 points, or below its tier floor, or breaks a Core Web Vitals limit, blocks the merge.

## Consequences
- **Overrides part of the standing performance constraint** (`Planning Folder/For Ai/ADDITIONAL PLANNING CONSTRAINT…`): it allowed a single WebGL hero moment and no heavy JS animation libraries. T3 now allows WebGL and GSAP, and T2 allows GSAP. The constraint's CWV targets, no-scroll-jacking rule and "state cost and mitigation" rule still apply in full. This is recorded as a proposed conflict-register entry.
- `07 §1` and `§5`, `05 §5` (rules 2 and 5) and `06 §5` (GSAP) need owner edits: see `docs/plans/2026-09-26-stack-rule-changes.md`.
- Lighthouse CI config (P0) holds per-route assertions by tier.
- The live speed badge will show real numbers on T3 pages too. T3 pages must still look credible on it, which is why Core Web Vitals stay a hard limit there.
