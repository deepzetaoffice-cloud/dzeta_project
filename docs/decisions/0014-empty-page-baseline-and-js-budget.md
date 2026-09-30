# 0014 · Empty-page baseline and the JavaScript budget (C8)

Status: PROPOSED (measured 2026-09-30; the owner chooses an option below)

## Context

[07](../ai/07-performance-budget.md) §2 sets two numbers:
- **≤ 50 KB JavaScript** on first load, a *target* to validate in P0
- **≤ 150 KB HTML + CSS + JS** before the first interaction, a *hard limit* (confirmed in decision 0008 and C21)

07 said P0 must measure an empty page, and that if the framework alone exceeds 50 KB the owner decides (conflict C8). Until then no agent may claim the target is met or impossible.

**What was measured:** the P0 placeholder Home. It's one H1 and two paragraphs, with no fonts, no images and **no JavaScript of our own**; every script on it is the Next.js 16.3.7 / React 19.3 runtime. Built with `next build`, served with `next start` (gzip), and measured with Lighthouse 12.6.1 in its default mobile emulation with simulated slow 4G and 4× CPU slowdown.

**Units:** every "KB" here is **KiB (1,024 bytes) of transfer size**, as Lighthouse reports it: compressed, **HTTP response headers included** (about 1 KB per request). The limit is tight enough that the unit decides pass or fail, so 07 §2 should say which unit it means.

## Measurements

**CI record** (GitHub Actions, ubuntu-24.04, Chrome 153, 5 runs, commit `8680b7a`; posted as check-run annotations):

| Run | Performance | LCP | TBT | CLS | JavaScript | CSS | HTML | HTML+CSS+JS | Benchmark index |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 99 | 1666 ms | 79 ms | 0 | 136.4 KB | 2.6 KB | 3.1 KB | 142.1 KB | 2490 |
| 2 | 100 | 1518 ms | 80 ms | 0 | 136.4 KB | 2.6 KB | 3.1 KB | 142.1 KB | 2416 |
| 3 | 99 | 1666 ms | 78 ms | 0 | 136.4 KB | 2.6 KB | 3.1 KB | 142.1 KB | 2441 |
| 4 | 100 | 1513 ms | 86 ms | 0 | 136.4 KB | 2.6 KB | 3.1 KB | 142.1 KB | 2485 |
| 5 | 93 | 1676 ms | 302 ms | 0 | 136.4 KB | 2.6 KB | 3.1 KB | 142.1 KB | 2171 |

- **Every run:** Accessibility 100, Best Practices 96 and SEO 100.
- **The gate:** median Performance is 99, and every assertion passed.
- **Run 5:** the CI machine was slower during it. Its benchmark index was 2171, against 2416–2490 for the other runs. Run 5 was also the outlier in the two earlier CI runs.
- **Best Practices 96** is one failing audit, `errors-in-console`: `/favicon.ico` returns 404. The favicon comes with P1. Playwright's headless browser doesn't request favicons, so the e2e console test can't see this.

**Owner's machine** (Windows, Chrome 154, 5 runs, same commit): Performance 99–100, LCP 1.88–2.04 s, TBT 10–28 ms, CLS 0. The bytes were identical.

**Before the CSS fix** (commit `ca6c4c2`): the CSS was 8.5 KB and the total 148.0 KB. Tailwind was also scanning `Planning Folder/` and `docs/`. It now scans `src/` only, which saved 5.9 KB.

**Where the JavaScript goes:**
- **Six framework files,** 136.4 KB (gzip, headers included), about 440 KB uncompressed. The two largest are 70.9 KB and 45.0 KB, most likely React DOM and the App Router runtime (the file names are hashed).
- **Waste inside them, per Lighthouse:**
  - 13.4 KiB of polyfills for old browsers (`legacy-javascript`)
  - 54.7 KiB that this page doesn't use (`unused-javascript`)

  Whether Next.js 16.3.7 has a supported way to drop them is not verified.
- **Not counted:** a separate 110 KB (uncompressed; 39.5 KB gzip) polyfill file is marked `nomodule`, so modern browsers never download it.

**With Brotli** (what Vercel serves), by compressing the same files, **bodies only** (no headers):

| Compression | JavaScript | HTML+CSS+JS |
|---|---|---|
| gzip level 9 | 130.4 KB | 134.1 KB |
| Brotli quality 5 | 123.1 KB | 126.5 KB |
| Brotli quality 11 (maximum) | 111.8 KB | 114.9 KB |

Which Brotli quality Vercel uses isn't verified. Headers add about 8 KB on top. The live figure is measured on `deepzeta.ai` after the P0 merge.

**LCP:** the H1 is the LCP element.
- **Hard limit** (2.5 s): met in every run.
- **Target** (1.5 s): missed in every run. CI measured 1513–1676 ms, and locally it was 1.88–2.04 s.
- **Where the time goes:** Lighthouse puts most of LCP down to "render delay" (1,422 ms of 1,875 ms locally) after a TTFB of 452 ms. In the simulation, that delay is the render-blocking CSS request (about 130 ms) plus the framework scripts, which start before the first paint.
- **So every KB of JavaScript added at first load moves lab LCP towards the 2.5 s limit.**

**What this means:**
- **The 50 KB target isn't reachable with Next.js.** The framework alone is 2.7× it (about 2.2× with the best Brotli).
- **The 150 KB hard limit has about 8 KB of headroom** on an empty page as measured here. With Brotli it's about 15–27 KB (headers included), depending on the quality Vercel uses.
- **Real pages add a lot:**
  - the header and the footer
  - section content
  - the RSC payload that Next.js inlines into the HTML
  - our own effect code (≤ 10 KB on Home)
  - link prefetching, once the header links exist
- **What visitors and PageSpeed see is strong today:** Performance 99–100, CLS 0 and low TBT. It isn't perfect, since LCP misses its 1.5 s target.

## Options

**A · Keep Next.js and make the framework runtime a fixed, watched baseline (recommended).**
- **The baseline:** the measured runtime (136.4 KB in the lab) is recorded here. `lhci` fails if it grows by more than 5 KB, so every Next.js upgrade shows its cost.
- **Our own code gets a strict budget on top, per page:**
  - JavaScript: ≤ 25 KB on T2 and T3 pages; ≤ 10 KB on Home (unchanged from 0008)
  - HTML + CSS + JS before the first interaction: ≤ **baseline + 50 KB**, about 186 KB in lab terms (136.4 + 50)
- **Everything else stays:**
  - the Lighthouse tier floors (Home ≥ 95)
  - the Core Web Vitals hard limits, LCP ≤ 2.5 s included, which caps the JavaScript we can add in practice
  - the font and image limits
  - wow-on-demand loading (0008)
- **Cost:** 07 §2 is rewritten to these numbers and to the unit above, and C8 is resolved. No rework.

**B · Keep 50 KB / 150 KB as written, and change the framework.**
- Switch to a framework that ships no JavaScript by default (for example Astro, with small islands only where a page is interactive). Home would likely weigh well under 50 KB, and lab LCP would drop.
- **Cost:**
  - supersedes decision 0004
  - rewrites the Next.js-specific rules in 06, 08 and 11 and the schema-system plan
  - redoes P0
  - swaps the Next.js features the plans rely on (Server Actions forms, the Metadata API, `next/font`, `next/image`)
- This is a large detour. It would buy the most speed headroom, but the visible score is already 99–100.

**C · Keep Next.js and tune it within 150 KB (not a full answer).**
- **What it can do:**
  - inline the CSS (Next.js `experimental.inlineCss`), which removes the render-blocking request and helps LCP
  - trim Tailwind's default theme (part 2)
  - look for a supported way to drop the legacy polyfills
- **What it can't do:** there's no supported way to remove the React runtime from App Router pages. So C can't reach 50 KB, and on content-rich pages it probably can't hold 150 KB either.
- The tuning is worth doing under A anyway, in part 2.

## Decision

*(The owner's choice goes here. Then this record becomes ACCEPTED, C8 is resolved in the conflict register, 07 §2 gets the chosen numbers and unit, and `lighthouserc.cjs` gets the matching assertions.)*

## Consequences

To be written with the decision.
