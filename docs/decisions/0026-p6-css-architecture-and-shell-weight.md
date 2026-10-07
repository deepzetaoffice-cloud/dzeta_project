# 0026 · P6's CSS architecture and the shell's weight

Status: ACCEPTED (owner, 2026-10-07: the P6 part A plan, "approve, 1 yes, 2 yes, 3 Speed-to-Lead"; the plan's S5 rule decides the CSS option)

## Context

- **Home was over the limit for real visitors.** Production measured 198,396 B for Home's first load (C65), over 07 §2's 190,868 B hard limit. Of it, 153,306 B (149.7 KiB) was JavaScript in 7 files. The CSS is one shared stylesheet (14,946 B gzip in the lab, 14.6 KiB) that grows with every template.
- **What P6 adds.** About 99 pages and their templates, and the first live mega-menu column (decision 0019: about 8 KB in the lab on every page).
- **Measured in P6 part A** (local builds and Vercel previews, 2026-10-07):
  - **The root error page** ships with every page. Turbopack ships whole modules, so through `site-config.ts` and `routes.ts` it carried every business fact (the founder's other companies included) and every registry row.
  - **`next/link`'s client code** was 3,292 B gzip of Home's own runtime chunk.
  - **Merging chunks.** `experimental.turbopackChunking` merges the framework and router chunks only with all three settings: `minChunkSize` above the merged size, `maxChunkCountPerGroup` 1, and `maxMergeChunkSize` above the largest chunk.
  - **CSS.** Coverage on Home leaves about 2.4 KB gzip of the shared sheet unused, almost all of it needed elsewhere or by state.
  - **A Home-only stylesheet** cost about 75 ms of lab LCP for its second render-blocking request (P5).
  - **Inline CSS** (`experimental.inlineCss`) is still being measured by another session. Next.js documents that it sends the styles twice: `<style>` and the RSC payload.

## Decision

1. **Every internal link is a plain `<a href>`** built from the route helpers. `next/link` isn't used ([C67](../ai/conflict-register.md); 06 §2.4).
2. **The framework chunks merge** (`turbopackChunking { minChunkSize 1,000,000, maxChunkCountPerGroup 1, maxMergeChunkSize 1,000,000 }`). Dynamic imports keep their own groups, so lazy modules stay lazy.
3. **The root error page imports only what it shows:** the brand name from `src/lib/brand.ts`, and Home's path from the locale's prefix (both exceptions to 06's wording, proposed in [C68](../ai/conflict-register.md)). *Proposed for 06, for the owner:* every client component in the first load follows the same rule, importing no module that carries data it doesn't use.
4. **CSS: one shared stylesheet (option A)** until the inline-CSS measurement shows option C qualifies under the plan's rule. That rule needs Home's production first load at least 1 KB lower, lab LCP no higher, and the owner's approval of the lab weight method. With A:
   - The shared sheet holds the tokens, the base, the shell, the modules used by two or more templates, and Home's own CSS (Home is T1: one request).
   - **T2 templates lay out with Tailwind utilities** (shared, atomic). Their own rules live in `src/styles/templates/<template>.css`, and a template's stylesheet stays only while its lab LCP holds 2.5 s.
   - **Every part's exit reports the shared sheet's size**, measured as production's response, headers included (07 §2 Units). Past 16 KiB, it goes to the owner. At C65 it was 16,413 B (16.0 KiB). **At A1's exit it is 16,706 B (16.3 KiB) on the preview: past the point, and reported to the owner.** Its body is 16,021 B; the rest is Vercel's headers.
5. **The mega menu's full panel loads on intent, with a server-rendered lite panel** (the hub and the pillar pages) for no-JS visitors and crawlers. **The footer links the pillar pages and the hub, not every service.** Both ship in part A2, before the pilot service makes the first menu column live.

## Consequences

- **Measured result.** Home's first-load JS is −7,064 B gzip (5 files, was 7). On the preview, Home's first load is 189,456 B by C65's method, under the hard limit (the baseline preview: 199,151 B). In the lab it is 192,349 B (C64 allows 204,800).
- **No client-side navigation** or background prefetch: every internal link is a normal page load (C67).
- **Turbopack options are experimental.** Next.js stays pinned (0012), and an upgrade re-measures the chunks and the baseline guard.
- **The CSS option is reopened** only by the inline-CSS measurement, with the owner.
