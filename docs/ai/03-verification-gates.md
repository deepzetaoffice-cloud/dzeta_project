# 03 · Verification Gates

> **Applies to:** every task that changes files · **Precedence:** below 00 · **Last reviewed:** 2026-09-29

A gate is a **command with a pass condition**. Work is done only when the required gates pass **and their output is in the report**. "I checked mentally" is not a gate.

> **Status:** the npm scripts below are created in **Phase 0** (see [04](04-build-sequence.md)). Until they exist, a gate that can't run is reported as **NOT RUN (script not yet created)**, never as passed.

---

## 1. Gate catalogue

| Script | What it checks | Pass condition |
|---|---|---|
| `npm run typecheck` | `tsc --noEmit` (strict) | 0 errors |
| `npm run lint` | ESLint flat config (`eslint.config.mjs`) incl. Next.js, TypeScript, jsx-a11y rules | 0 errors, 0 warnings |
| `npm run format:check` | Prettier | no unformatted files |
| `npm run check:tokens` | No raw hex/rgb colours or arbitrary px values outside `src/styles/tokens.css`; no physical direction classes/properties (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`, `text-right`, `margin-left`…) | 0 hits |
| `npm run check:facts` | Every number in `src/content/**` is in the facts allowlist; no `[[TODO` markers in content that ships | 0 unlisted numbers, 0 TODO markers |
| `npm run check:schema` | JSON-LD on built pages parses; every `@id` reference resolves; `#organization` and `#website` emitted exactly once per page; no empty/placeholder values | all pages pass |
| `npm run check:links` | Every internal link resolves to a built route; nav/footer hrefs equal canonicals | 0 broken links |
| `npm run check:rules` | Rule system integrity: every file referenced by `CLAUDE.md`/`AGENTS.md` exists; every `docs/ai` file has its header | pass |
| `npm run test` | Vitest unit tests (schema builders, geo/llms builders, analytics wrapper, utils) | all pass |
| `npm run build` | `next build` | succeeds, no warnings we haven't accepted in the conflict register |
| `npm run test:e2e` | Playwright on the production build: key pages render, keyboard navigation, **axe** accessibility, tracking regression (`dataLayer[0]` rule, events fire once) | all pass, 0 serious/critical axe violations |
| `npm run lhci` | Lighthouse CI on the fixed URL sample with per-tier budgets from [07](07-performance-budget.md) (page tiers: decision 0005) | all assertions pass |
| `npm run verify:fast` | `typecheck` + `lint` + `check:tokens` | pass |
| `npm run verify` | everything above, in order | pass |

---

## 2. Which gates apply to which task

| Task type | Required gates |
|---|---|
| Any code change (after every implementation step) | `verify:fast` |
| Component or section | `verify:fast` + `test` (if logic) + `build` |
| New or changed page/route | `verify:fast` + `build` + `check:schema` + `check:links` + `test:e2e` (that page) + `lhci` (that page) |
| Content change | `check:facts` + `check:links` + `build` |
| Schema / SEO / `llms.txt` change | `test` + `build` + `check:schema` + SEO/GEO Auditor review |
| Analytics / consent change | `test` + `build` + `test:e2e` (tracking) + manual GTM Preview checklist for the owner |
| Dependency added | `verify` + bundle check in `lhci` + one-line justification in the plan |
| Phase exit | `verify` (all gates) + owner review |
| Rule system change (owner only) | `check:rules` |

---

## 3. Evidence rules

1. Paste the **actual output**: the summary line(s) and any failures. Trim noise, never results.
2. A gate that wasn't run is written **NOT RUN, reason**. Never omit it, never mark it passed.
3. A failing gate is reported **as failing**, with output, even if you believe it's unrelated. Then propose a fix or a separate task.
4. Never weaken a gate to make it pass: no `// eslint-disable`, `@ts-ignore`, `as any`, skipped tests, lowered Lighthouse budgets or deleted assertions, **unless the plan explicitly approves it** and the conflict register records why.

---

## 4. Manual checks (owner-run, with a checklist the agent provides)

These can't be fully automated. The agent writes the checklist; the owner ticks it.

- GTM Preview → GA4 DebugView → Meta/LinkedIn test events, then **publish the GTM container**
- Google Rich Results Test / Schema Markup Validator for each page type (check **correctness**, not rich-result eligibility)
- PageSpeed Insights on a real budget Android phone over 4G for the homepage and one service page
- AI visibility spot check: ask ChatGPT, Gemini and Perplexity about deepzeta (monthly after launch)
- Arabic native review (after launch, before any Arabic page goes live)

---

## 5. Continuous integration

GitHub Actions runs `npm run verify` on every pull request to `main`. `main` is protected: merge only through a PR with all checks green. Agents never push to `main` directly (see [12](12-git-workflow.md)).
