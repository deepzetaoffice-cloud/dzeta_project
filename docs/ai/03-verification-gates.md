# 03 · Verification Gates

> **Applies to:** every task that changes files · **Precedence:** below 00 · **Last reviewed:** 2026-09-30

A gate is a **command with a pass condition**. Work is done only when the required gates pass **and their output is in the report**. "I checked mentally" is not a gate.

> **Status:** the npm scripts below are created in **Phase 0** (see [04](04-build-sequence.md)). Until they exist, a gate that can't run is reported as **NOT RUN (script not yet created)**, never as passed. Exception: `check:rules` already runs as `node scripts/check-rules.mjs` (Node is installed; there is no `package.json` yet).

---

## 1. Gate catalogue

| Script | What it checks | Pass condition |
|---|---|---|
| `npm run typecheck` | `tsc --noEmit` (strict) | 0 errors |
| `npm run lint` | ESLint flat config (`eslint.config.mjs`) incl. Next.js, TypeScript, jsx-a11y rules | 0 errors, 0 warnings |
| `npm run format:check` | Prettier | no unformatted files |
| `npm run check:tokens` | No raw hex/rgb colours or arbitrary px values outside `src/styles/tokens.css`; no physical direction classes/properties (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`, `text-right`, `margin-left`…) | 0 hits |
| `npm run check:facts` | Every number in `src/content/**` is in the facts allowlist; no `[[TODO` markers in content that ships | 0 unlisted numbers, 0 TODO markers |
| `npm run check:schema` | On built pages ([08](08-seo-geo-aeo-schema.md) §3): <br>• JSON-LD parses <br>• each `@id` is defined at most once per document <br>• every reference resolves in the document or to a registered node that its home page defines <br>• `#organization` and `#website` appear exactly once <br>• one primary entity per template, matching the matrix <br>• NAP equals the site config <br>• every URL is absolute on the canonical host with no trailing slash <br>• breadcrumb positions are contiguous and each item is a built route <br>• visible-parity fields appear in the page text <br>• no empty or placeholder values | all pages pass |
| `npm run check:seo` | On built HTML ([08](08-seo-geo-aeo-schema.md) §1, §6): <br>• one `<title>` with the brand suffix once, 50–60 characters in total <br>• description 140–160 characters <br>• one H1 <br>• absolute self-canonical with no trailing slash <br>• `og:image` returns 200 <br>• no `keywords` meta <br>• sitemap URLs equal the indexable built routes <br>• `noindex` routes are absent from the sitemap and the `llms` files | 0 failures |
| `npm run check:links` | Every internal link resolves to a built route; nav/footer hrefs equal canonicals. Extended in P4 ([engine](../seo/seo-geo-domination-engine.md) §5.4): <br>• contextual link budget per page type <br>• banned anchors <br>• duplicate targets <br>• anchor reuse over 3 times sitewide <br>• orphan pages (fewer than 3 inbound links) <br>• click depth over 3 <br>• targets outside the [URL registry](../seo/url-registry.md) or not yet shipped <br>External citation links go in a weekly link-rot report (warning only) | 0 broken links, 0 rule failures |
| `npm run check:content` *(planned, P4)* | [Engine](../seo/seo-geo-domination-engine.md) §3, §6, §12: <br>• word range per page type <br>• paragraph length <br>• direct answer 40–60 words <br>• section ledes 40–75 words <br>• FAQ count per type and answer length <br>• **sitewide FAQ question uniqueness** <br>• heading order <br>• banned words (10 §4) <br>• required modules per page type | 0 failures |
| `npm run check:rules` | Rule system integrity: every file referenced by `CLAUDE.md`, `AGENTS.md` and `.claude/**/*.md` exists; every `docs/ai` file has its header. It can't see paths that contain spaces (`Planning Folder/…`), so check those by hand | pass |
| `npm run check:effects` *(planned, P0)* | Every effect ID in a plan's effect register exists in [13](13-experience-design.md) §4 | 0 unknown IDs |
| `npm run test` | Vitest unit tests (schema builders, geo/llms builders, analytics wrapper, utils) | all pass |
| `npm run build` | `next build` | succeeds, no warnings we haven't accepted in the conflict register |
| `npm run test:e2e` | Playwright on the production build: key pages render, keyboard navigation, **axe** accessibility, tracking regression (`dataLayer[0]` rule, events fire once), effect modes (reduced motion, Reduce effects, JavaScript off, forced colours, RTL) and the LCP element visible at first paint ([13](13-experience-design.md) §3) | all pass, 0 serious/critical axe violations |
| `npm run lhci` | Lighthouse CI on the fixed URL sample with per-tier budgets from [07](07-performance-budget.md) (page tiers: decision 0005) | all assertions pass |
| `npm run verify:fast` | `typecheck` + `lint` + `check:tokens` | pass |
| `npm run verify` | everything above, in order | pass |

---

## 2. Which gates apply to which task

| Task type | Required gates |
|---|---|
| Any code change (after every implementation step) | `verify:fast` |
| Component or section | `verify:fast` + `test` (if logic) + `build` |
| New or changed page/route | `verify:fast` + `build` + `check:schema` + `check:seo` + `check:content` + `check:links` + `test:e2e` (that page) + `lhci` (that page) |
| Content change | `check:facts` + `check:content` + `check:links` + `build` + `check:seo` |
| Schema / SEO / `llms.txt` change | `test` + `build` + `check:schema` + `check:seo` + SEO/GEO Auditor review; for a new template, Google's Rich Results Test and the Schema Markup Validator (the owner runs them on the deployed preview) |
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
