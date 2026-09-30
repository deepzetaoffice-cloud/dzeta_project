# Decision Records

One file per decision: `NNNN-short-title.md`, never edited after acceptance (a new decision supersedes an old one). Agents propose decisions; the owner accepts them.

**Template**

```markdown
# NNNN · <title>
Status: PROPOSED | ACCEPTED (owner, date) | SUPERSEDED by NNNN
## Context
## Decision
## Consequences
```

## Index

| # | Decision | Status |
|---|---|---|
| [0001](0001-ai-rule-system.md) | AI rule system: `docs/ai` as single source; Claude Code primary; `AGENTS.md` for other tools | ACCEPTED |
| [0002](0002-english-first-arabic-after-launch.md) | English at launch; native GCC Arabic after launch; RTL-ready now | ACCEPTED |
| [0003](0003-plan-first-workflow.md) | Plan first, then execute; Git + GitHub with protected `main` | ACCEPTED |
| [0004](0004-tech-stack.md) | Tech stack: native-first frontend, n8n automation backbone, Google Sheets CRM v0 | ACCEPTED (AI-agent row superseded by 0016) |
| [0005](0005-performance-tiers.md) | Performance tiers: Home ≥ 95 · money pages ≥ 90 · experience pages ≥ 70; Core Web Vitals everywhere | ACCEPTED |
| [0006](0006-domain-deepzeta-ai.md) | Domain: `deepzeta.ai` is canonical; `www` redirects to it | ACCEPTED |
| [0007](0007-roo-code-as-implementer.md) | Roo Code as a second implementer (renumbered from 0006 on 2026-09-29; see conflict C7) | PROPOSED |
| [0008](0008-design-language-signal-and-depth.md) | Design language "Signal & Depth": responsive-only motion, effects library (`docs/ai/13`), surface specs (`docs/design/`), new pages and tiers, 150 KB = first load | ACCEPTED |
| [0009](0009-design-lab-v1-verdicts.md) | Design Lab v1 verdicts: token values, Lab decisions, cluster as nav marker, Studio word ripple exception | ACCEPTED |
| [0010](0010-ai-training-crawlers-allowed.md) | AI training crawlers get full access (same as every crawler) | ACCEPTED |
| [0011](0011-content-pages-t2.md) | Content pages (About, founder, case studies, resources, legal) move from T3 to T2 | ACCEPTED |
| [0012](0012-p0-toolchain-and-hosting.md) | P0 toolchain versions (TypeScript 6, ESLint 9 and why), audit result, Vercel region and DNS facts | ACCEPTED in part (versions, hosting); audit acceptance PROPOSED |
| [0013](0013-pre-launch-indexing-lock.md) | Pre-launch indexing lock: production stays `noindex` until `SITE_INDEXING=on` at launch; its `robots.txt` lets crawlers read the `noindex` | ACCEPTED (option 2) |
| [0014](0014-empty-page-baseline-and-js-budget.md) | Empty-page baseline and the JavaScript budget (C8): framework baseline 136.4 KB + our own budget per page | ACCEPTED (option A) |
| [0015](0015-design-tokens-themes-fonts.md) | Design tokens, themes and fonts (P0 part 2): every first visit dark, light by the visitor's choice; self-hosted Montserrat + JetBrains Mono 500; `check:contrast`; per-type page-weight budgets; `inlineCss` not adopted | ACCEPTED |
| [0016](0016-ai-provider-deepseek.md) | AI provider: DeepSeek through the AI SDK for the agent demo, the Content Planner and pSEO drafting | ACCEPTED |
| [0017](0017-owner-approved-merges.md) | Owner-approved merges: the agent merges a task branch into `main` after the gates, green CI and the owner's "merge" in chat; pull requests optional | ACCEPTED |

## Open business decisions (from the blueprint)

| ID | Decision | Status |
|---|---|---|
| D1 | Domain (new domain for deepzeta) | Decided: [0006](0006-domain-deepzeta-ai.md) (`deepzeta.ai`) |
| D2 | Company entity (own legal company or brand of an existing one) | Decided: own company, Deepzeta Digital Solutions L.L.C., licensed by Dubai DET (owner, 2026-09-29; facts file §1) |
| D3 | Market: UAE first, then GCC | Confirmed in facts file |
| D4 | Business model: hybrid projects + packages | PROPOSED |
| D5 | Main CTA: "Book a free AI automation audit" + floating WhatsApp | Confirmed in facts file |
| D6 | Languages | Decided: [0002](0002-english-first-arabic-after-launch.md) |
| — | Service structure: pillars vs buyer stages (conflict C6) | Decided: the four pillars (owner, 2026-09-29; C6) |
| — | Hosting region on Vercel | Checked in P0: no Middle East region (nearest `bom1`, Mumbai); chosen in the P6 lead-form plan from a measured round trip ([0012](0012-p0-toolchain-and-hosting.md)) |
| — | CRM | Google Sheets v0 via n8n; HubSpot/Zoho later: [0004](0004-tech-stack.md) (ACCEPTED) |
