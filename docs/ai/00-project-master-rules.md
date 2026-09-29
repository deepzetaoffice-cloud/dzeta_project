# 00 · Project Master Rules

> **Applies to:** every agent, every task, every file · **Precedence:** highest written rule (only the owner's explicit current instruction ranks above it) · **Last reviewed:** 2026-09-26

---

## 1. North Star (read this before every task)

**What we are building:** the official website of **deepzeta · AI Digital Solutions**, an AI automation and digital growth agency serving the UAE first, then the GCC.

**Mission of the site:** *prove what we sell.* The website is deepzeta's first case study. Every claim we make to clients about websites, speed, AI search visibility and automation must be **visibly true on this site itself**, ideally through a live proof element rather than a written claim.

**Our positioning:** deepzeta builds online growth for every business, in three connected ways:
1. **Custom-coded, high-performance websites.** No templates, no page builders, no bloat.
2. **SEO, GEO and AI ranking built into development**, not added afterwards.
3. **AI automation and growth services** that turn traffic into customers and customers into repeat revenue.

**Primary conversion:** booked **free AI automation audits**. WhatsApp, calls, downloads and newsletter are secondary actions.

**Audience:** owners and managers of UAE/GCC businesses (clinics, real estate, e-commerce, education, service companies) who lose time to repetitive work and lose leads to slow follow-up.

**How we win:** showing beats telling. Visitors *try* the automations (live AI agent, ROI calculator, workflow explorer, 60-second speed-to-lead test, live speed badge, "see how AI reads this page").

**The one sentence every task must serve:**
> *A fast, custom-coded, AI-search-ready site that turns UAE business owners into booked AI audits, and proves every claim it makes.*

Every plan must name which part of this North Star it serves. If a task serves none of it, stop and ask.

---

## 2. Non-negotiables

| # | Rule | Why |
|---|---|---|
| N1 | **Performance is a feature, equal to visual quality.** Hard limits in [07-performance-budget.md](07-performance-budget.md) are never traded for effects. | A slow site contradicts the business's core claim. |
| N2 | **Custom code only.** No templates, page builders, UI kits or themes. | It is our highlight and our promise. |
| N3 | **Never invent facts.** No made-up stats, clients, reviews, awards, dates, prices or credentials. Unknown means ask or omit. | Trust, legal safety, and Google/AI-engine penalties. |
| N4 | **Plan first, then execute.** Non-trivial work needs an approved plan (see [04-build-sequence.md](04-build-sequence.md)). | Prevents sprawl and false edits. |
| N5 | **Stay in scope.** Only touch files listed in the approved plan. | Prevents collateral damage. |
| N6 | **Verified, not assumed.** "Done" requires gate evidence (see [03-verification-gates.md](03-verification-gates.md)). | Prevents false "it works" claims. |
| N7 | **Tokens, never raw values.** Colours, spacing, type and motion come from design tokens. | Consistency and maintainability. |
| N8 | **RTL-ready from day one.** English launches first, but the layout uses logical CSS only, so Arabic can be added without rework. | Arabic is planned for after launch. |
| N9 | **SEO/GEO/AEO is architecture, not decoration.** Semantic HTML, one schema `@id` graph, answer-first content, `llms.txt`. | It is a service we sell; the site must demonstrate it. |
| N10 | **Accessibility and reduced motion are required**, not optional. | Quality and reach. |

---

## 3. Precedence (when rules conflict)

1. The owner's explicit instruction **in the current conversation**
2. This file (`00-project-master-rules.md`)
3. Domain rule files `01`–`12` in `docs/ai/`
4. The approved task plan in `docs/plans/`
5. Source documents in `Planning Folder/` (blueprint, catalogue, icon rules)
6. Code comments

**Conflicts are never resolved silently.** Stop, state the conflict in one line, follow the higher-ranked source, and propose an entry for [conflict-register.md](conflict-register.md).

---

## 4. Where facts live (single sources of truth)

| Topic | Source | Status |
|---|---|---|
| Company facts (legal name, address, phone, licence, founding date, team) | [docs/facts/company-facts.md](../facts/company-facts.md) | Many values **UNKNOWN** until the owner provides them |
| Service names, descriptions, structure | `Planning Folder/For Ai/DeepZeta Services Catalogue.md` | Names must be used **exactly** |
| Site strategy, page map, homepage, demos, tech stack | `Planning Folder/DeepZeta Website Blueprint.html` | Draft v1 |
| Performance constraint | `Planning Folder/For Ai/ADDITIONAL PLANNING CONSTRAINT Perf from Claude planning chat.txt` | Standing rule |
| Portable engineering standard | `Planning Folder/For Ai/AI Automation Company — Pre-Devel.md` | Partly superseded (see conflict register) |
| Icon system | `Planning Folder/For Ai/DeepZeta Icon Master Rules.md` | Approved direction |
| Logo | `Planning Folder/For Ai/deepZeta Ai Logo/Coded Logo SVG Do not touch the code.svg` | **Locked, never edited** |
| Decisions | [docs/decisions/](../decisions/) | One file per decision |

If two sources disagree, the conflict register decides. If it doesn't cover the case, ask.

---

## 5. Protected files (never edit without the owner's explicit approval in the current request)

- `Planning Folder/**`: read-only source material
- The logo SVG (above): never edited, reformatted or "optimised"
- `docs/ai/**`, `CLAUDE.md`, `AGENTS.md`, `.claude/**`: the rule system itself
- `docs/design/*.md`: the approved surface design specs (prototypes in `docs/design/prototypes/` are not protected; they are never a source)
- `.env*` (except `.env.example`), lockfiles (`package-lock.json`)
- Tracking core (once built): `src/lib/analytics.ts`, the `dataLayer` init block in the root layout, consent code (see [09-analytics-tracking.md](09-analytics-tracking.md))
- Schema core (once built): `src/lib/schema/**` (changes need a plan that names it)

Agents that believe a protected file needs a change must **stop and propose the change**, never make it.

---

## 6. File map (planned; created in Phase 0)

```
docs/ai/          rule files (this folder)
docs/facts/       company facts, the only source for business data
docs/decisions/   decision records
docs/plans/       approved task plans
src/app/          Next.js App Router routes
src/components/   ui/ · sections/ · layout/ · icons/ · demos/
src/content/      en/ now, ar/ after launch (copy never hardcoded in components)
src/lib/          schema/ · analytics.ts · geo/ · seo/ · i18n/ · utils
src/styles/       tokens.css (Tailwind v4 @theme)
scripts/          gate scripts (check-tokens, check-facts, rules-sync…)
tests/            unit/ · e2e/
.scratch/         temporary files (gitignored, deleted at task end)
```

---

## 7. Glossary

| Term | Meaning here |
|---|---|
| **GEO** | Generative Engine Optimisation: being understood and cited by AI engines (ChatGPT, Gemini, Perplexity, Google AI Overviews) |
| **AEO** | Answer Engine Optimisation: direct-answer content that engines can quote |
| **Gate** | A command that must pass before work counts as done |
| **Allowed files** | The exact list of files a plan permits an agent to create or change |
| **North Star** | Section 1 of this file |
| **Stage** | One of the four buyer stages: Get Found / Win Customers / Run Operations / Get Paid & Keep (proposed, pending approval) |
| **Zeta Pixel** | The logo-derived square used in icons (see Icon Master Rules) |
