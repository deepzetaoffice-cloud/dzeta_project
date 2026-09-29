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
| [0004](0004-tech-stack.md) | Tech stack: native-first frontend, n8n automation backbone, Google Sheets CRM v0 | ACCEPTED |
| [0005](0005-performance-tiers.md) | Performance tiers: Home ≥ 95 · money pages ≥ 90 · experience pages ≥ 70; Core Web Vitals everywhere | ACCEPTED |
| [0006](0006-domain-deepzeta-ai.md) | Domain: `deepzeta.ai` is canonical; `www` redirects to it | ACCEPTED |
| [0007](0007-roo-code-as-implementer.md) | Roo Code as a second implementer (renumbered from 0006 on 2026-09-29; see conflict C7) | PROPOSED |
| [0008](0008-design-language-signal-and-depth.md) | Design language "Signal & Depth": responsive-only motion, effects library (`docs/ai/13`), surface specs (`docs/design/`), new pages and tiers, 150 KB = first load | ACCEPTED |

## Open business decisions (from the blueprint)

| ID | Decision | Status |
|---|---|---|
| D1 | Domain (new domain for deepzeta) | Decided: [0006](0006-domain-deepzeta-ai.md) (`deepzeta.ai`) |
| D2 | Company entity (own legal company or brand of an existing one) | OPEN |
| D3 | Market: UAE first, then GCC | Confirmed in facts file |
| D4 | Business model: hybrid projects + packages | PROPOSED |
| D5 | Main CTA: "Book a free AI automation audit" + floating WhatsApp | Confirmed in facts file |
| D6 | Languages | Decided: [0002](0002-english-first-arabic-after-launch.md) |
| — | Service structure: pillars vs buyer stages (conflict C6) | OPEN |
| — | Hosting region on Vercel | OPEN (P0) |
| — | CRM | Google Sheets v0 via n8n; HubSpot/Zoho later: [0004](0004-tech-stack.md) (ACCEPTED) |
