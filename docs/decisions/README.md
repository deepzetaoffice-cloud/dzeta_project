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
| [0018](0018-brand-primitives.md) | Brand primitives (P1): the locked logo served as it is and shown by crops; app icons and manifest from the logo's mark; the icon registry, `Icon` and `IconDefs` (Tier 1–2); knockouts; the lab LCP cost accepted | ACCEPTED |
| [0019](0019-layout-shell.md) | Layout shell (P2): live links only plus the review page; the document, the no-flash script and Reduce effects; per-weight fallback fonts; the logo's caching; the glass tokens; the effect controllers; the header, mega menu, sheet, footer and conversion path; Tier 3 icons; the effects feasibility gate's results (the budget phone before launch, C51) | ACCEPTED |
| [0020](0020-performance-exception-limit.md) | The performance exception limit: the gates stay; an owner-approved exception never takes a T1 or T2 page below Performance 86, and LCP only a little over 2.5 s (0019 is reserved for the P2 layout shell) | ACCEPTED |
| [0021](0021-analytics-and-consent.md) | Analytics and consent (P3): Home's first-party JavaScript cap 11 KB with the tracking runtime; GTM by the site's own loader (C56); the generated container, proven by a GTM round trip and live since the owner's B1–B8; the measured third-party caps per region; the security headers on pages only; European Home's lab LCP 2,550 ms (C61) | ACCEPTED |
| [0022](0022-gtm-deferral-and-row-tbt-budget.md) | GTM deferred past first paint (afterFirstPaint: idle wait with a 1,500 ms timeout into a double rAF — never idle-deferred, 09 §2.2); the UAE campaign profile's TBT lab allowance 225 ms while §1's ≤ 200 ms hard limit stands | ACCEPTED (TBT row superseded by 0023) |
| [0023](0023-row-profile-tbt-and-performance-allowance.md) | The UAE campaign profile's lab allowances: TBT 275 ms, Performance floor 0.93 — the granted third-party scripts' execution cost inside the TBT window is intrinsic (measured 247–266 ms, 0.93–0.95 on 83562da); §1's ≤ 200 ms and 0.95 stand for every page and profile | ACCEPTED |
| [0024](0024-conversion-cta-set.md) | The conversion CTA set: WhatsApp as the primary floating CTA (site-wide except the contact page), the header button becomes "Deepzeta AI" (launches the Deepzeta Agent bot), "Book a free AI audit" stays as the deliberate in-page/sticky CTA, a Call button joins, and the WhatsApp chatbot runs on n8n + Meta's WhatsApp Cloud API (not Twilio) | PROPOSED |
| [0025](0025-lighthouse-cpu-calibration.md) | Lighthouse's CPU slowdown calibrated to each machine: multiplier = 4 × benchmarkIndex ÷ 4,000 (clamped 2–8), measured by `scripts/lhci-run.mjs` before every lhci run; no threshold changes | ACCEPTED |
| [0026](0026-p6-css-architecture-and-shell-weight.md) | P6's CSS architecture and the shell's weight: plain `<a>` links (C67), the framework chunks merged, the root error page importing only what it shows, one shared stylesheet until the inline-CSS measurement decides, the mega menu's panel on intent and the footer's pillar links in A2 | ACCEPTED |
| [0028](0028-standard-tier-and-light-verification.md) | The standard page tier: 70 for every page except Home; light verification (per-page lhci removed, per-commit verify:fast, verify:ci on branch pushes, standing plans for template copies); CLS and the a11y/bp/seo floors stay; LCP/INP/TBT are field-data limits; 0020's 86 line stands for Home only | ACCEPTED |

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
