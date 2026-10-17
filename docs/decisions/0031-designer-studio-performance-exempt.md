# 0031 · Designer Studio is exempt from performance floors (limitless design)

Status: ACCEPTED (owner, 2026-10-16)

## Context

The performance tiers ([0005](0005-performance-tiers.md), [0011](0011-content-pages-t2.md)) and the performance budget ([07](../ai/07-performance-budget.md)) assign the Designer Studio index (`/studio`) a Lighthouse floor of ≥ 90 (T2) and its concept pages (`/studio/<slug>`) a floor of ≥ 70 (T3), with Core Web Vitals hard limits everywhere. [07](../ai/07-performance-budget.md) §4 also budgets the Studio's Device Stage and concept sites.

The owner (2026-10-16) decided these pages don't need a performance score and their speed doesn't matter. They exist to demonstrate craft, and the approach is a **limitless design showcase** ("wow on demand"). They are also `noindex`, so their speed carries no search-ranking consequence.

## Decision

- The **Designer Studio index** (`/studio`) and **every concept page** (`/studio/<slug>`) are **exempt from performance-score floors and page-speed targets**: no Lighthouse Performance floor, no page-weight ceiling, no Core Web Vitals lab gate, and no lab `lhci` assertion.
- The design approach on these pages is **limitless** — heavy visuals, animation libraries, WebGL and effects are allowed without a performance budget, within the design system.
- This exemption does **not** relax what isn't speed: the honesty rules (C18), accessibility and `prefers-reduced-motion`, contrast, tokens, and effects-by-ID still apply. Concept pages stay `noindex`, excluded from the sitemap and the `llms` files, with no business schema ([08](../ai/08-seo-geo-aeo-schema.md)).

## Consequences

- 0005 and 0011 no longer assign a tier floor to Studio pages; the Studio pages are scoped out of [07](../ai/07-performance-budget.md)'s tier table, page-weight and Core Web Vitals assertions.
- `docs/design/studio.md`, `docs/ai/07-performance-budget.md` and `docs/ai/00-project-master-rules.md` (N1) reflect the exemption; the conflict register records it as C75.
- The URL registry's Studio rows keep their `noindex` status, phase and wave; the index row's tier column is noted as exempt.
