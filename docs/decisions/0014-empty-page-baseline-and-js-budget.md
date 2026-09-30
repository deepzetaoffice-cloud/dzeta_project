# 0014 · Empty-page baseline and the JavaScript budget (C8)

Status: PROPOSED (measured 2026-09-30; the owner chooses an option below)

## Context

[07](../ai/07-performance-budget.md) §2 sets two numbers:
- **≤ 50 KB JavaScript** on first load, a *target* to validate in P0
- **≤ 150 KB HTML + CSS + JS** before the first interaction, a *hard limit* (confirmed in decision 0008 and C21)

07 said P0 must measure an empty page, and that if the framework alone exceeds 50 KB the owner decides (conflict C8). Until then no agent may claim the target is met or impossible.

**What was measured:** the P0 placeholder Home. It's one H1 and two paragraphs, with no fonts, no images and **no JavaScript of our own**; every script on it is the Next.js 16.3.7 / React 19.3 runtime. Built with `next build`, served with `next start` (gzip), and measured with Lighthouse 12.6.1 in its default mobile emulation with simulated slow 4G and 4× CPU slowdown.

## Measurements

**CI record** (GitHub Actions, ubuntu-24.04, 5 runs, commit `ca6c4c2`; posted as check-run annotations):

| Run | Performance | LCP | TBT | CLS | JavaScript | CSS | HTML | HTML+CSS+JS |
|---|---|---|---|---|---|---|---|---|
| 1 | 99 | 1553 ms | 84 ms | 0 | 136.4 KB | 8.5 KB | 3.1 KB | 148.0 KB |
| 2 | 99 | 1667 ms | 78 ms | 0 | 136.4 KB | 8.5 KB | 3.1 KB | 148.0 KB |
| 3 | 100 | 1518 ms | 84 ms | 0 | 136.4 KB | 8.5 KB | 3.1 KB | 148.0 KB |
| 4 | 100 | 1519 ms | 84 ms | 0 | 136.4 KB | 8.5 KB | 3.1 KB | 148.0 KB |
| 5 | 93 | 1698 ms | 296 ms | 0 | 136.4 KB | 8.5 KB | 3.1 KB | 148.0 KB |

- Accessibility 100, Best Practices 96 and SEO 100 in every run. The median-run assertions passed.
- Run 5 was slowed by the shared CI machine, which is why every assertion uses the median run.

**Owner's machine** (Windows, Chrome 154, 5 runs): Performance 99, LCP 2.03–2.05 s, TBT 21–30 ms, CLS 0. The bytes were identical.

**Where the JavaScript goes:** six framework files, 136.4 KB compressed (gzip), about 440 KB uncompressed. The two largest are 70.9 KB and 45.0 KB (most likely React DOM and the App Router runtime; the file names are hashed).

**With Brotli** (what Vercel serves), estimated by compressing the same files at maximum quality: about **112 KB JavaScript** and about **120 KB HTML+CSS+JS**. The live number is measured on `deepzeta.ai` after the P0 merge.

**Not counted:** a 110 KB legacy-browser polyfill file is marked `nomodule`, so modern browsers never download it.

**What this means:**
- The **50 KB target isn't reachable with Next.js**: the framework alone is 2.7× it (2.2× with Brotli).
- The **150 KB hard limit has about 2 KB of headroom** on an empty page as measured here (about 30 KB with Brotli). Real pages add the header, the footer, section content, the RSC payload that Next.js inlines into the HTML, and our own effect code (≤ 10 KB on Home).
- **Speed as visitors and PageSpeed see it is already excellent.** Performance is 99–100 and CLS 0. TBT is low, because the runtime loads asynchronously and doesn't block the page.

## Options

**A · Keep Next.js and make the framework runtime a fixed, watched baseline (recommended).**
- The measured runtime (136.4 KB gzip in the lab) is recorded here. `lhci` fails if it grows by more than 5 KB, so every Next.js upgrade shows its cost.
- **Our own code gets a strict budget on top, per page:**
  - JavaScript: ≤ 25 KB compressed on T2 and T3 pages; ≤ 10 KB on Home (unchanged from 0008)
  - HTML + CSS + JS before the first interaction: ≤ **baseline + 50 KB**, about 186 KB in lab gzip terms (136.4 + 50)
- **Everything else stays:** the Lighthouse tier floors (Home ≥ 95), the Core Web Vitals hard limits, the font and image limits, and wow-on-demand loading (0008).
- **Cost:** 07 §2 is rewritten to these numbers, and C8 is resolved. No rework.

**B · Keep 50 KB / 150 KB as written, and change the framework.**
- Switch to a framework that ships no JavaScript by default (for example Astro, with small islands only where a page is interactive). Home would likely weigh well under 50 KB.
- **Cost:**
  - supersedes decision 0004
  - rewrites the Next.js-specific rules in 06, 08 and 11 and the schema-system plan
  - redoes P0, and swaps the Next.js features the plans rely on (Server Actions forms, the Metadata API, `next/font`, `next/image`)
- This is a large detour for a gain visitors mostly won't feel: today's score is already 99–100.

**C · Keep Next.js and tune it within 150 KB (not a full answer).**
- Inlining the CSS (Next.js `experimental.inlineCss`) and trimming Tailwind's default theme (part 2) would cut a render-blocking request and a few KB of CSS. That helps LCP.
- There's no supported way to remove the React runtime from App Router pages, so C can't reach 50 KB. On content-rich pages it probably can't hold 150 KB either.
- The CSS tuning is worth doing under A anyway.

## Decision

*(The owner's choice goes here. Then this record becomes ACCEPTED, C8 is resolved in the conflict register, 07 §2 gets the chosen numbers, and `lighthouserc.cjs` gets the matching assertions.)*

## Consequences

To be written with the decision.
