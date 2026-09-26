# Conflict Register

> **Applies to:** conflicts between sources, rules and owner decisions · **Precedence:** records how conflicts were resolved; the owner's decisions here override source documents · **Last reviewed:** 2026-09-26

Format: **ID · Conflict · Resolution · Decided by · Date**. Agents propose entries; the owner approves them. Status `OPEN` means agents must ask before acting in that area.

| ID | Conflict | Resolution | Decided by | Date | Status |
|---|---|---|---|---|---|
| C1 | Language at launch: the blueprint (D6) and the performance constraint say bilingual EN + AR at launch. | **English first; Arabic after launch**, written natively (GCC writer quality, not translation). The "built natively into the layout system" requirement is met by RTL-ready architecture from day one ([11](11-i18n-rtl-readiness.md) §1). | Owner | 2026-09-26 | Resolved |
| C2 | Core Web Vitals: the advisory says LCP < 1.5 s / INP < 100 ms / CLS < 0.05; the performance constraint says < 2.5 s / < 200 ms / < 0.1. | The first set is the **target**, the second is the **hard limit** ([07](07-performance-budget.md) §1). | Blueprint recommendation, adopted | 2026-09-26 | Resolved |
| C3 | The advisory says to "defer third-party scripts past LCP, reuse the idle AnalyticsLoader". | **GTM is never idle-deferred** (this caused lost GA4 data in the reference project); only non-GTM vendor scripts may be deferred ([09](09-analytics-tracking.md) §2). | Technical correction | 2026-09-26 | Resolved |
| C4 | The advisory says "one `tailwind.config.ts` equivalent". | Tailwind v4 is CSS-first: tokens in `@theme` in `src/styles/tokens.css`, **no config file** ([05](05-design-system.md) §1). | Technical correction | 2026-09-26 | Resolved |
| C5 | The blueprint tech stack says "next-intl with /en and /ar routes"; the reference lesson says keep English URLs unprefixed. | Proposed: English at root, Arabic under `/ar/`. Library and routing are **decided by decision record in P11**. | Pending owner | 2026-09-26 | OPEN (P11) |
| C6 | Service structure: blueprint = 4 pillars (AI / Websites / Software / Growth); later proposal = 4 buyer stages (Get Found / Win / Run / Get Paid & Keep). This affects navigation and icon colours. | Awaiting owner approval. Until then, don't build navigation or colour-coded components that depend on it. | Pending owner | 2026-09-26 | OPEN |
| C7 | The approved pre-build plan named Roo Code as the second tool. | Roo Code shut down on 2026-05-15. **Claude Code only, plus `AGENTS.md`** as the tool-neutral entry for any future tool. | Owner | 2026-09-26 | Resolved |
| C8 | JavaScript first-load budget of 50 KB vs the unmeasured React/Next.js runtime baseline. | Measure an empty page in P0; the owner decides per [07](07-performance-budget.md) §2. | Pending P0 | 2026-09-26 | OPEN (P0) |
| C9 | The blueprint lists a case study for another business the owner runs. The blueprint's D1 also says "never reuse that business's organization data". | A case study is allowed only with the owner's explicit confirmation and real, publishable numbers. **No entity data, `@id`, NAP or schema from the other business is reused.** | Rule | 2026-09-26 | Resolved |
| C10 | The blueprint says "An Arabic reviewer for the translation". | Arabic is **written natively from the English brief**; the reviewer is a native GCC reviewer of original Arabic copy ([11](11-i18n-rtl-readiness.md) §3). | Owner | 2026-09-26 | Resolved |
| C11 | The blueprint says "FAQ, HowTo and Breadcrumb on every service page". | Use each schema type only when the matching content is visible on the page. Validate correctness, not rich-result eligibility ([08](08-seo-geo-aeo-schema.md) §3). | Technical correction | 2026-09-26 | Resolved |
