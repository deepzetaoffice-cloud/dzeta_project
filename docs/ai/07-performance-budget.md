# 07 · Performance Budget

> **Applies to:** every page, component, asset and third-party script · **Precedence:** below 00 (N1 makes this a non-negotiable) · **Last reviewed:** 2026-09-26

The site is deepzeta's proof of work. **A page that fails a hard limit does not ship.**

**Test conditions:** mobile, budget Android class device, slow 4G. Lighthouse mobile emulation in CI (`lhci`), and PageSpeed Insights/CrUX field data after launch. Studio-laptop results don't count.

---

## 1. Core Web Vitals

| Metric | Target (internal) | Hard limit (never cross) |
|---|---|---|
| **LCP** (largest contentful paint) | ≤ 1.5 s | ≤ 2.5 s |
| **INP** (interaction to next paint) | ≤ 100 ms | ≤ 200 ms |
| **CLS** (cumulative layout shift) | ≤ 0.05 | ≤ 0.1 |
| TTFB | ≤ 200 ms (static/edge) | ≤ 600 ms |
| TBT (lab proxy for INP) | ≤ 100 ms | ≤ 200 ms |
| Lighthouse Performance (mobile) | ≥ 95 | ≥ 90 |
| Lighthouse Accessibility / Best Practices / SEO | 100 | ≥ 95 |

*Reconciliation:* the advisory said LCP < 1.5 s, INP < 100 ms, CLS < 0.05; the performance constraint says < 2.5 s / < 200 ms / < 0.1. We aim for the first and never cross the second (blueprint decision). FID is obsolete; INP replaces it.

---

## 2. Page weight (compressed)

| Budget | Limit | Status |
|---|---|---|
| HTML + CSS + JS per page | ≤ 150 KB | Hard limit |
| JavaScript on first load | ≤ 50 KB target | **To be validated in Phase 0** (see below) |
| Fonts (3 variable, subset) | ≈ 60 KB total | Hard limit 70 KB |
| Images per page (above the fold) | ≤ 200 KB, hero ≤ 120 KB | Hard limit |
| Render-blocking third-party or font files | 0 | Hard limit |
| Third-party scripts before consent/interaction | GTM only | Hard limit |

**Honest caveat on the 50 KB JavaScript target.** The React/Next.js App Router runtime has its own baseline size, which we have **not yet measured** for the chosen version. Phase 0 measures an empty page. If the framework baseline alone exceeds 50 KB, the owner decides between (a) accepting the measured baseline plus a strict **per-page JS budget above baseline** (proposed ≤ 25 KB), or (b) other options the Architect presents. The decision is recorded in `docs/decisions/`. Until then, no agent may claim the 50 KB target is met or impossible.

---

## 3. Rules that keep us inside the budget

**Images and media**
- AVIF/WebP via `next/image`, explicit dimensions, correct `sizes`. `priority` only on the LCP image.
- The hero visual is SVG/CSS where possible (the Z ribbon), so it's light and sharp.
- No autoplay video. Video only on interaction, with a poster image.

**Fonts**
- `next/font`, variable, subset to the characters needed, `display: swap`. No Google Fonts `<link>`.

**JavaScript**
- Server Components by default; client components small and deep in the tree.
- Heavy widgets load on interaction/visibility: chat agent on tap, booking on open, calculator only on pages that use it.
- Before adding a dependency, check its compressed size (in the plan).
- No blocking work on the main thread in event handlers; break up long tasks.

**CSS and motion**
- Transform/opacity only; no animating layout properties; no infinite animations; `backdrop-filter` rarely (see [05](05-design-system.md) §5).
- Reserve space for anything that loads late (aspect-ratio boxes, min-heights) so CLS stays near 0.

**Third parties**
- GTM loads with normal priority (see [09](09-analytics-tracking.md)); other vendors load after consent and/or idle. Nothing else in the head.
- Every third party added needs a plan with its measured cost.

---

## 4. Live demo costs (from the blueprint; each demo's plan must confirm them)

| Demo | Cost | Mitigation |
|---|---|---|
| deepzeta AI agent | 60–150 KB chat script | Light button first; load chat only on tap |
| ROI calculator | ~5 KB | Plain JS, only on pages that use it |
| Workflow explorer | Main-thread animation risk on low-end phones | SVG + CSS only; pause off-screen; static when reduced motion |
| 60-second speed-to-lead test | ~0 on page (server-side) | Consent wording, rate limits, spam protection |
| Live speed badge | ~1 KB | Reads browser performance data after load |
| "See how AI reads this page" | ~0 | Hidden until opened; data already in page |

---

## 5. Regression rule

Once a page has a Lighthouse baseline, a change that drops its mobile Performance score by **more than 2 points** or breaks any hard limit **blocks the merge** (`lhci` assertions), unless the owner approves an exception recorded in the conflict register.
