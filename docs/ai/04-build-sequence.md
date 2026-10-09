# 04 · Build Sequence & Task Plans

> **Applies to:** planning and ordering of all work · **Precedence:** below 00 · **Last reviewed:** 2026-10-09 (Build Mode, decision 0029)

---

## 1. Golden rules

1. **Phases build on each other, and may overlap when they don't depend on each other** (Build Mode, [decision 0029](../decisions/0029-build-mode.md)): P6 pages, P7 demos and tools and P8 resources can run as parallel tracks. P9 and P10 close the build.
2. **One task per branch.** Parallel tracks each run in their own worktree. Finish, verify, commit; then that track's next task.
3. **Additive by default.** Build new files rather than rewriting working ones. Changing a working file needs the plan to say why.
4. **Never link to a page that doesn't exist yet.** Build the page first, or leave the link out.
5. **Register before you build:** analytics events go in the taxonomy table before the component that fires them; schema node types go in the schema builder before a page uses them; services come from the catalogue before a page names them.
6. **Pilot, then scale.** For any repeated page type (service, industry, case study), one **template plan** covers the pilot and every copy. Build **one** complete pilot, stop for the owner's review on the preview, then ship the rest in batches of up to **10** pages with no further plans (decision 0029).

---

## 2. Phases

| Phase | Work | Exit gate |
|---|---|---|
| **P-1 Pre-build** *(current)* | Rule system, facts file, decisions, repo, dry-run test | Owner approves the rule system |
| **P0 Foundation** | Install Node LTS; scaffold Next.js (latest stable, App Router, TypeScript strict, `src/`, `@/*` alias), verified versions recorded in a decision; Tailwind v4 with `tokens.css`; `next/font` self-hosted variable fonts (subset); ESLint flat config, Prettier, Vitest, Playwright + axe, Lighthouse CI; all gate scripts; GitHub Actions CI; `.env.example` + env validation (`src/lib/env.ts`); `src/lib/url.ts` (`siteUrl()`, `absoluteUrl()`); English routes in the `(en)` route group with its own root layout (11 §2); non-production `noindex`; security headers (CSP report-only); the `check:seo` script; **baseline measurement of an empty page** against the performance budget | `verify` green; baseline recorded in a decision |
| **P1 Brand primitives** | Logo component (from the locked SVG, unchanged), favicon/manifest, icon system foundations per Icon Master Rules | `verify` green |
| **P2 Layout shell** | Header "Proof Bar", mega-menu, mobile nav, footer "The Landing", conversion-path elements (built once, shared; specs in `docs/design/`), shared effect controllers (`src/lib/fx/`), Reduce effects switch, language-switch placeholder (hidden until Arabic) | `verify` + e2e keyboard nav at 360/390/768/1280 + **effects feasibility gate**: the shell with every T1 effect on, measured with `lhci` on the Home route (≥ 95) and on a budget Android phone, within the caps in [13](13-experience-design.md) §7 |
| **P3 Analytics & consent** | `trackEvent()` wrapper, event taxonomy, GTM by the site's own loader (C56), Consent Mode v2, click-ID capture | tracking e2e green + owner GTM checklist |
| **P4 Data & schema engine** | Content types, catalogue data, `src/lib/site-config.ts`, `src/lib/schema/` `@id` graph builders (spec: `docs/plans/2026-09-29-schema-system.md`), the schema registry `docs/seo/schema-graph.md`, `src/lib/geo/` builders, facts allowlist | unit tests + `check:schema` |
| **P5 Homepage** | Sections per `docs/design/home.md` (blueprint order); demos stubbed behind lightweight triggers | page gates (see [03](03-verification-gates.md) §2) + the effects feasibility gate re-run on the full Home |
| **P6 Core pages** | Every page follows its row in the [URL registry](../seo/url-registry.md) and its blueprint in the [SEO/GEO Domination Engine](../seo/seo-geo-domination-engine.md) §3, in waves W1 → W2. Services hub + pilot service page → review → remaining services; the Automation page (`/services/ai-automation`, the AI Automation pillar page); solutions; industries; pricing; about; contact; book-audit; privacy; terms | 03 §2 per branch (batches of up to 10 per template) |
| **P7 Live demos & tools** | AI agent (load on tap), ROI calculator, workflow explorer, 60-second test, header speed chip + Page Nutrition Label, AI View; Deepzeta Sync, the tools hub at `/tools` (Website & AI Search Health Check, Social Media Content Planner) | per-demo cost/mitigation stated; Home's `lhci` unchanged |
| **P8 Resources, case studies & Studio** | Registry wave W3 (engine §3). Glossary, comparisons, guides (bylined by the founder); case studies only with owner-confirmed real data; Designer Studio index + one pilot concept → owner review → the other concepts | 03 §2 per branch |
| **P9 GEO layer** | `llms.txt`, `llms-full.txt`, robots AI-bot tiers, sitemap | `check:schema` + SEO/GEO audit |
| **P10 Launch readiness** | Full `verify`, manual checklists, redirects, 404, monitoring, Vercel deploy, set `SITE_INDEXING=on` in Vercel Production and redeploy (lifts the pre-launch lock, decision 0013), Search Console | owner sign-off |
| **P11 Arabic (after launch)** | `/ar` tree, native GCC content, hreflang, Arabic fonts; English must not regress | parity + English regression gates |
| **P12 pSEO (after V1)** | **Reminder:** starts only when every V1 row in the URL registry is live and indexing is stable; then remind the owner and write the pSEO plan from engine §10. Dimensions: industries, industry × emirate, integrations, comparisons. Fact packs, ≤ 30% similarity to siblings, batches of up to 10 a week through pull requests | per-batch gates + owner review |

---

## 3. When stuck

1. Check that the previous phase is really complete.
2. Re-read the relevant rule file.
3. Search the code and docs for the answer.
4. Ask the owner **one** question. Never guess to keep moving.

---

## 4. Task plan template (Architect writes this to `docs/plans/YYYY-MM-DD-<slug>.md`)

**When a plan is needed (decision 0029):** a template plan for each repeated page type (it covers the pilot and every copy), and a short plan for each unique build (a new template, a one-off page, a demo, a tool, a shell change). **No written plan** for a fix or change of up to 3 files that adds no dependency and changes no protected file (registry rows for pages being shipped excepted), or for a batch under an approved template plan; the agent states a one-line plan first.

Keep plans short: one or two screens. The rules are cited, never restated.

```markdown
# Plan: <title>
Status: DRAFT | APPROVED (owner, date) | DONE
Phase: P<n> · Branch: <type>/<slug> · Page tier: <T1 | standard | n/a>

## Goal
<the North Star part served, one line; what ships>

## Allowed files
| Path | Action (CREATE / MODIFY / APPEND-ONLY) | Purpose |
|---|---|---|

## Steps
1. <step>

## Effect register (visual work only; IDs from docs/ai/13 §4)
| Section | Effect ID | Cost → mitigation |
|---|---|---|

## Dependencies, risks (only if real)
<a dependency: version + why; client JS on a non-Home page: its measured size>

## Open questions
<list, or "none">

## Progress
<one line per batch or step>
```

Gates come from 03 §2 and aren't listed in the plan. A plan is **approved** only when the owner says so; the Architect then sets `Status: APPROVED (owner, date)`.
