# 04 · Build Sequence & Task Plans

> **Applies to:** planning and ordering of all work · **Precedence:** below 00 · **Last reviewed:** 2026-09-26

---

## 1. Golden rules

1. **Phases run in order.** A phase starts only when the previous phase's exit gate passed and the owner approved.
2. **One task at a time**, on its own branch. Finish, verify, commit; then the next task.
3. **Additive by default.** Build new files rather than rewriting working ones. Changing a working file needs the plan to say why.
4. **Never link to a page that doesn't exist yet.** Build the page first, or leave the link out.
5. **Register before you build:** analytics events go in the taxonomy table before the component that fires them; schema node types go in the schema builder before a page uses them; services come from the catalogue before a page names them.
6. **Pilot, then scale.** For any repeated page type (service, industry, case study), build **one** complete pilot, stop for owner review, then build the rest.

---

## 2. Phases

| Phase | Work | Exit gate |
|---|---|---|
| **P-1 Pre-build** *(current)* | Rule system, facts file, decisions, repo, dry-run test | Owner approves the rule system |
| **P0 Foundation** | Install Node LTS; scaffold Next.js (latest stable, App Router, TypeScript strict, `src/`, `@/*` alias), verified versions recorded in a decision; Tailwind v4 with `tokens.css`; `next/font` self-hosted variable fonts (subset); ESLint flat config, Prettier, Vitest, Playwright + axe, Lighthouse CI; all gate scripts; GitHub Actions CI; `.env.example` + env validation; security headers; **baseline measurement of an empty page** against the performance budget | `verify` green; baseline recorded in a decision |
| **P1 Brand primitives** | Logo component (from the locked SVG, unchanged), favicon/manifest, icon system foundations per Icon Master Rules | `verify` green |
| **P2 Layout shell** | Header, mega-menu, mobile nav, footer (built once, shared), language-switch placeholder (hidden until Arabic) | `verify` + e2e keyboard nav at 360/390/768/1280 |
| **P3 Analytics & consent** | `trackEvent()` wrapper, event taxonomy, GTM via `@next/third-parties`, Consent Mode v2, click-ID capture | tracking e2e green + owner GTM checklist |
| **P4 Data & schema engine** | Content types, catalogue data, `src/lib/schema/` `@id` graph builders, `src/lib/geo/` builders, facts allowlist | unit tests + `check:schema` |
| **P5 Homepage** | Sections per blueprint order; demos stubbed behind lightweight triggers | page gates (see [03](03-verification-gates.md) §2) |
| **P6 Core pages** | Services hub + pilot service page → review → remaining services; solutions; industries; pricing; about; contact; book-audit; privacy; terms | page gates per page |
| **P7 Live demos** | AI agent (load on tap), ROI calculator, workflow explorer, 60-second test, speed badge, "see how AI reads this page" | per-demo cost/mitigation stated; `lhci` unchanged |
| **P8 Resources & case studies** | Glossary, comparisons, guides; case studies only with owner-confirmed real data | page gates |
| **P9 GEO layer** | `llms.txt`, `llms-full.txt`, robots AI-bot tiers, sitemap | `check:schema` + SEO/GEO audit |
| **P10 Launch readiness** | Full `verify`, manual checklists, redirects, 404, monitoring, Vercel deploy, Search Console | owner sign-off |
| **P11 Arabic (after launch)** | `/ar` tree, native GCC content, hreflang, Arabic fonts; English must not regress | parity + English regression gates |
| **P12 pSEO (after launch)** | Industry × city pages in small batches, real data only, fact gate + similarity gate | per-batch gates + owner review |

---

## 3. When stuck

1. Check that the previous phase is really complete.
2. Re-read the relevant rule file.
3. Search the code and docs for the answer.
4. Ask the owner **one** question. Never guess to keep moving.

---

## 4. Task plan template (Architect writes this to `docs/plans/YYYY-MM-DD-<slug>.md`)

```markdown
# Plan: <title>
Status: DRAFT | APPROVED (owner, date) | DONE
Phase: P<n>
Branch: <type>/<slug>

## Goal served
<which part of the North Star (00 §1) this serves>

## Context
<why this is needed; links to sources>

## Out of scope
<explicit list>

## Allowed files
| Path | Action (CREATE / MODIFY / APPEND-ONLY) | Purpose |
|---|---|---|

## Steps
1. <step> → gate after step: <gate>

## Dependencies to add (if any)
| Package | Version (verified) | Why native/hand-rolled is worse |

## Risks & mitigations
<list; for any animation or interactive element: performance cost + mitigation>

## Gates (from 03 §2)
<list>

## Open questions
<list, or "none">
```

A plan is **approved** only when the owner says so; the Architect then sets `Status: APPROVED (owner, date)`.
