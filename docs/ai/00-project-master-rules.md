# 00 · Project Master Rules

> **Applies to:** every agent, every task, every file · **Precedence:** highest written rule (only the owner's explicit current instruction ranks above it) · **Last reviewed:** 2026-10-18 (Website v3, decision 0033)

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
| N1 | **Performance is measured and reported, never a blocker.** Lighthouse and PageSpeed scores are information only, and no page has a floor or a weight limit. The habits in [07](07-performance-budget.md) stay because they cost nothing visually. Copy never promises a score ([10](10-content-voice.md) §3, decision [0033](../decisions/0033-redesign-v3.md)). | Visual ambition comes first; speed is still a small ranking signal and helps every visitor. |
| N2 | **Custom code first.** No templates, page builders, themes or icon libraries. UI components from KokonutUI, Aceternity and similar registries may be copied in where they serve the design, restyled through the tokens and kept accessible (the owner's overrule, decision [0033](../decisions/0033-redesign-v3.md)). | It is our highlight and our promise. |
| N3 | **Never invent facts.** No made-up stats, clients, reviews, awards, dates, prices or credentials. Unknown means ask or omit. | Trust, legal safety, and Google/AI-engine penalties. |
| N4 | **Plan once, then build fast.** One approved plan per template (it covers every page built from it) or per unique build; small fixes take a one-line plan (see [04-build-sequence.md](04-build-sequence.md) §4, Build Mode, [decision 0029](../decisions/0029-build-mode.md)). | Prevents sprawl and false edits without stalling the build. |
| N5 | **Stay in scope.** Only touch files listed in the approved plan. | Prevents collateral damage. |
| N6 | **Verified, not assumed.** "Done" requires gate evidence, with the gates chosen by risk (see [03-verification-gates.md](03-verification-gates.md) §2): design and SEO/GEO are never relaxed. | Prevents false "it works" claims. |
| N7 | **Tokens, never raw values.** Colours, spacing, type and motion come from design tokens. | Consistency and maintainability. |
| N8 | **RTL-ready from day one.** English launches first, but the layout uses logical CSS only, so Arabic can be added without rework. | Arabic is planned for after launch. |
| N9 | **SEO/GEO/AEO is architecture, not decoration.** Semantic HTML, one schema `@id` graph, answer-first content, `llms.txt`. | It is a service we sell; the site must demonstrate it. |
| N10 | **Accessibility and reduced motion are required**, not optional. | Quality and reach. |

---

## 3. Precedence (when rules conflict)

1. The owner's explicit instruction **in the current conversation**
2. This file (`00-project-master-rules.md`)
3. Domain rule files `01`–`13` in `docs/ai/`, and the SEO/GEO rule files in `docs/seo/` (the Domination Engine and the URL registry)
4. The approved task plan in `docs/plans/`
5. Source documents in `Planning Folder/` (blueprint, catalogue, icon rules) and the surface design specs in `docs/design/` (where a spec differs from the blueprint, the conflict register records it)
6. Code comments

**Conflicts are never resolved silently.** Stop, state the conflict in one line, follow the higher-ranked source, and propose an entry for [conflict-register.md](conflict-register.md).

---

## 4. Where facts live (single sources of truth)

| Topic | Source | Status |
|---|---|---|
| Company facts (legal name, address, phone, licence, founding date, team) | [docs/facts/company-facts.md](../facts/company-facts.md) | Many values **UNKNOWN** until the owner provides them |
| Service names, descriptions, structure | `Planning Folder/For Ai/DeepZeta Services Catalogue.md` | Names must be used **exactly** |
| Site strategy, page map, homepage, demos, tech stack | `Planning Folder/DeepZeta Website Blueprint.html` | Draft v1 |
| Performance constraint | `Planning Folder/For Ai/ADDITIONAL PLANNING CONSTRAINT Perf from Claude planning chat.txt` | Its budgets and the dark-mode option superseded by decision 0033 (C77); its habits stand in [07](07-performance-budget.md) |
| Portable engineering standard | `Planning Folder/For Ai/AI Automation Company — Pre-Devel.md` | Partly superseded (see conflict register) |
| Icon system | `Planning Folder/For Ai/DeepZeta Icon Master Rules.md` | Approved direction |
| Visual design (tokens, components, screens, motion spec, media plan) | Figma "Deepzeta AI · Website v3", file `tYw7bSV9m4zX2vrVs7XYpE` | Approved by the owner 2026-10-18 (decision 0033); [05](05-design-system.md), [13](13-experience-design.md) and `docs/design/` are written from it |
| Effects, motion, interaction (effect IDs) | [docs/ai/13-experience-design.md](13-experience-design.md) | Website v3 "Spectrum", decision 0033 |
| Surface designs (header, footer, each page) | [docs/design/](../design/README.md) | Website v3 "Spectrum", decision 0033 |
| Logo | `Planning Folder/For Ai/deepZeta Ai Logo/Coded Logo SVG Do not touch the code.svg` (dark backgrounds) and the owner's eight white-background logos in `src/brand/white-bg/` (light surfaces; added 2026-10-18, C78) | **Locked, never edited** |
| Content system, internal links, FAQ, E-E-A-T, robots/llms content, pSEO | [docs/seo/seo-geo-domination-engine.md](../seo/seo-geo-domination-engine.md) | Owner-approved 2026-09-30 |
| Every URL (planned, live, reserved, retired) | [docs/seo/url-registry.md](../seo/url-registry.md) | APPEND-ONLY |
| External facts (laws, platform rules, vendor facts) | [docs/facts/external-sources.md](../facts/external-sources.md) | Only APPROVED rows are used |
| Decisions | [docs/decisions/](../decisions/) | One file per decision |

If two sources disagree, the conflict register decides. If it doesn't cover the case, ask.

---

## 5. Protected files (never edit without the owner's explicit approval in the current request)

- `Planning Folder/**`: read-only source material
- The logo SVGs (above, both folders): never edited, reformatted or "optimised"; served as they are, scaled only
- `docs/ai/**`, `CLAUDE.md`, `AGENTS.md`, `.claude/**`: the rule system itself
- `docs/design/*.md`: the approved surface design specs (prototypes in `docs/design/prototypes/` are not protected; they are never a source)
- `docs/seo/*.md`: the SEO/GEO Domination Engine and the URL registry
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
docs/design/      surface design specs (prototypes/ holds non-binding prototypes)
docs/seo/         SEO/GEO Domination Engine, URL registry, schema graph registry (P4)
docs/plans/       approved task plans
src/app/          Next.js App Router routes
src/components/   ui/ · sections/ · layout/ · icons/ · demos/ · fx/ (effect islands)
src/content/      en/ now, ar/ after launch (copy never hardcoded in components)
src/lib/          schema/ · analytics.ts · geo/ · seo/ · i18n/ · fx/ (shared effect controllers) · utils
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
| **Pillar** | One of the four service pillars: AI Automation · Websites · Software · Growth & Ranking. They structure the menu, the services, and the pixel colour code (C6, resolved 2026-09-29; the buyer-stage proposal was dropped) |
| **Zeta Pixel** | The logo-derived square used in icons (see Icon Master Rules) and, sitewide, as the marker of value, progress, the current place or a pillar ([13](13-experience-design.md) §8) |
| **Stage** | The rounded panel filled with the logo's gradient that holds each hero, inset from the viewport (`--dz-radius-stage`, [05](05-design-system.md) §1) |
| **Slab** | A bright colour block behind the Home hero's rotating phrase (05 §2) |
| **Diagram language** | Direction C's numbered steps, mono labels, system diagram and scrubber, used for every explanatory moment (13 §1) |
| **Signature moment** | A section's one large, purposeful effect (for example `message-to-booking`), listed per page in 13 §5 |
| **Effect ID** | A kebab-case name from the effects library in [13](13-experience-design.md) §4 (e.g. `section-reveal`, `workflow-connect`), cited in every plan that uses the effect |
| **Page tier** | Retired (decision 0033): T1 Home · T2 money pages · T3 experience pages set the Lighthouse floors (decision 0005). Not the icon tiers |

**ID namespaces** (so identifiers never collide):

| Pattern | Meaning | Defined in |
|---|---|---|
| N1–N10 | Non-negotiables | This file §2 |
| C1, C2… | Conflicts | [conflict-register.md](conflict-register.md) |
| D1–D6 | Open business decisions from the blueprint | `docs/decisions/README.md` |
| 0001, 0002… | Decision records | `docs/decisions/` |
| L1… / numbered rows | Lessons | [lessons-learned.md](lessons-learned.md) |
| P-1, P0…P12 | Build phases | [04](04-build-sequence.md) §2 |
| T1–T3 | Page tiers (retired) | Decision 0005, superseded by 0033 |
| Tier 1–3 | Icon tiers | Icon Master Rules §2 |
| G1–G10 | Colour-system gradients | `Planning Folder/For Ai/deepzeta-colour-system.html` |
| Z0–Z3 | Depth planes (retired) | Decision 0008, superseded by 0033 |
| kebab-case (`section-reveal`) | Effect IDs | [13](13-experience-design.md) §4 |
