# 0011 · Content pages are page tier T2

Status: ACCEPTED (owner, 2026-09-30)

## Context

[Decision 0005](0005-performance-tiers.md) put case studies, About and resources in **T3** (Lighthouse mobile ≥ 70), next to experience pages. But these are the pages that search engines and AI engines cite most often, and that buyers read before booking. A slow guide contradicts the site's core claim. The SEO/GEO Domination Engine (`docs/seo/seo-geo-domination-engine.md`) makes them central to ranking.

## Decision

| Tier | Pages | Floor | Change |
|---|---|---|---|
| T1 | Home | ≥ 95 | unchanged |
| **T2** | Hubs, pillars, services, solutions, industries, the free audit, Deepzeta Sync tools, contact, pricing, **About, the founder profile, case studies, resources (guides, comparisons, glossary), the editorial policy, legal pages** | **≥ 90** | the pages in bold move from T3 to T2 |
| T3 | Real experience pages only: Designer Studio concepts (`/studio/<slug>`), the App demo | ≥ 70 | narrowed |

Everything else in 0005 still applies: Core Web Vitals hard limits everywhere, the motion toolkit per tier, and the regression rule.

## Consequences

- **Rule changes:** [07](../ai/07-performance-budget.md) §1 names the new T2 and T3 lists. The URL registry sets each row's tier.
- **Motion:** content pages may still use GSAP islands (a T2 allowance, loaded when visible), but not WebGL.
- **Lighthouse CI:** the tier assertions in P0 follow this table.
