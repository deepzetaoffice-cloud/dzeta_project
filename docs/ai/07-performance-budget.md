# 07 · Performance Budget

> **Applies to:** every page, component, asset and third-party script · **Precedence:** below 00 (N1 makes this a non-negotiable) · **Last reviewed:** 2026-09-30

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
| Lighthouse Performance (mobile) | per tier | T1 Home ≥ 95 · T2 money and content pages ≥ 90 (including About, the founder profile, case studies, resources and legal pages; [decision 0011](../decisions/0011-content-pages-t2.md)) · T3 experience pages ≥ 70 (Studio concepts, the App demo) (decisions 0005, 0011). Unlisted pages = T2. |
| Lighthouse Accessibility / Best Practices / SEO | 100 | ≥ 95 |

*Tiers:* Core Web Vitals hard limits (LCP, INP, CLS) apply to **every** tier. The tier only changes the Lighthouse score floor and the motion toolkit allowed.

*Reconciliation:* the advisory said LCP < 1.5 s, INP < 100 ms, CLS < 0.05; the performance constraint says < 2.5 s / < 200 ms / < 0.1. We aim for the first and never cross the second (blueprint decision). FID is obsolete; INP replaces it.

---

## 2. Page weight (compressed)

| Budget | Limit | Status |
|---|---|---|
| HTML + CSS + JS loaded before the first interaction | ≤ framework baseline + 50 KB (≈ 186 KB today) | Hard limit (decision 0014). Code started by an explicit visitor action ("Launch", "Play", "Open") never loads on first view and is budgeted per feature in its plan (decision 0008) |
| JavaScript on first load | Framework baseline (136.4 KB) + ≤ 5 KB growth, plus our own code: ≤ 10 KB on Home, ≤ 25 KB on T2 and T3 pages | Hard limit: the baseline + 5 KB growth (decision 0014), asserted by `lhci` on each tested page (Home today). Home's 10 KB is provisional until the feasibility gate (next row, [13](13-experience-design.md) §7) |
| First-party effect/UI JS on Home at first load | ≤ 10 KB (provisional) | Validated by the effects feasibility gate ([04](04-build-sequence.md) §2; caps in [13](13-experience-design.md) §7) |
| Fonts (subset; variable, or one static weight when that keeps the target, 0015) | ≈ 60 KB total | Hard limit 70 KB on deepzeta pages. Studio concept routes load their own fonts within their T3 page budget (decision 0008) |
| Images per page (above the fold) | ≤ 200 KB, hero ≤ 120 KB | Hard limit |
| Render-blocking third-party or font files | 0 | Hard limit |
| Third-party scripts before consent/interaction | GTM only | Hard limit |

**The framework baseline (decision 0014, C8 resolved).**
- P0 measured an empty page: the Next.js 16.3.7 / React 19.3 runtime alone is 136.4 KB of JavaScript, so the old 50 KB target can't be met with Next.js.
- The runtime is a fixed, watched baseline. `lhci` fails if it grows by more than 5 KB, so every Next.js upgrade shows its cost. Raising the baseline needs the owner's approval in a new decision.
- Our own first-load JavaScript is budgeted on top of it, per page. Each plan that adds client code states its measured size and raises that page's `lhci` allowance, within the limits above.

**Units (decision 0014).** The KB in the first two rows are KiB (1,024 bytes) of transfer size, as Lighthouse reports it: compressed, HTTP response headers included. The lab figures come from `next start` (gzip). Vercel serves Brotli, which is smaller, so the lab is expected to be the stricter measure (the live figure isn't measured yet).

---

## 3. Rules that keep us inside the budget

**Images and media**
- AVIF/WebP via `next/image`, explicit dimensions, correct `sizes`. `priority` only on the LCP image.
- The hero visual is SVG/CSS (the locked logo's Z mark and the CSS-built Assembly, [13](13-experience-design.md) §5), so it's light and sharp and never competes with the text LCP element.
- No autoplay video. Video only on interaction, with a poster image.

**Fonts**
- `next/font/local` with the committed font files (0015), variable or one static weight, subset to the characters needed, `display: swap`. No Google Fonts `<link>`.

**JavaScript**
- Server Components by default; client components small and deep in the tree.
- Heavy widgets load on interaction/visibility: chat agent on tap, booking on open, calculator only on pages that use it.
- Before adding a dependency, check its compressed size (in the plan).
- No blocking work on the main thread in event handlers; break up long tasks.

**CSS and motion**
- Transform/opacity only; no animating layout properties; no infinite animations; live `backdrop-filter` only within the glass-ladder limits ([05](05-design-system.md) §5 rule 6, [13](13-experience-design.md) §4.1).
- Reserve space for anything that loads late (aspect-ratio boxes, min-heights) so CLS stays near 0.

**Third parties**
- GTM loads with normal priority (see [09](09-analytics-tracking.md)); other vendors load after consent and/or idle. Nothing else in the head.
- Every third party added needs a plan with its measured cost.

---

## 4. Live demo and effect costs (targets; each plan must measure and confirm them)

| Demo / effect | Cost | Mitigation |
|---|---|---|
| deepzeta AI agent | 60–150 KB chat script | Light button first; load chat only on tap |
| ROI calculator | ~5 KB | Plain JS, only on pages that use it |
| Workflow explorer (`story-flow`) | Main-thread animation risk on low-end phones | Home: SVG + CSS only (T2 pages may use GSAP islands); plays once, pauses if scrolled away mid-play; static when reduced motion |
| 60-second speed-to-lead test | ~0 on page (server-side) | Consent wording, rate limits, spam protection |
| Header speed chip + Page Nutrition Label | ~1 KB chip + `web-vitals`; the label's code on open | Reads browser performance data after load; the chip reserves its space; the label loads when opened |
| AI View ("See how AI reads this page") | A small script on first use + one `llms.txt` fetch | Built when opened; reads the page's own JSON-LD; no duplicate indexable text |
| Shared pointer controller | ≤ 1.5 KB | Fine pointers only, while a target is in view; rAF-batched; stops when the tab is hidden |
| Story graphics (`story-*`) | ≤ 2 KB shared controls + ≤ 6 KB each | CSS/SVG on Home; play once; controls for stories longer than 5 s |
| The Assembly (Home hero) | ~0 KB beyond the shared observer (CSS 3D) | Starts on first scroll; static cluster under Reduce effects |
| `glass-live` / `glass-liquid` | GPU cost while content scrolls behind | Capped count per viewport; falls back to `glass-frost` |
| Designer Studio: Device Stage and concept sites | Each concept's full weight | Loads only on open, inside a sandboxed iframe; concepts are T3 with Core Web Vitals hard limits |
| Deepzeta Sync (tools) | Server-side checks and AI calls; small client wizard | Server work only; rate limit + Turnstile; the report renders after results |
| App demo | The app shell | Loads only on "Launch"; its budget is set in its plan |

---

## 5. Regression rule

Once a page has a Lighthouse baseline, a change that drops its mobile Performance score by **more than 2 points**, takes it below its **tier floor**, or breaks any hard limit **blocks the merge** (`lhci` assertions), unless the owner approves an exception recorded in the conflict register.
