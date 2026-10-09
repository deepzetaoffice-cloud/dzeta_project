# 03 · Verification Gates

> **Applies to:** every task that changes files · **Precedence:** below 00 · **Last reviewed:** 2026-10-09 (Build Mode, decision 0029)

A gate is a **command with a pass condition**. Work is done only when the required gates pass **and their output is in the report**. "I checked mentally" is not a gate.

> **Status (P0, 2026-09-30):** every script below exists except `check:content` (planned, P4). `check:effects` exists too, despite its *planned* label below. A gate that can't run is reported as **NOT RUN, reason**, never as passed.
>
> Some gates grow by phase. Each one prints what it doesn't check yet and the phase that adds it, so its output never claims more than it checked (`docs/plans/2026-09-30-p0-foundation.md` §E). Today:
> - `check:facts` checks `[[TODO` markers; the numbers allowlist comes in P4.
> - `check:schema` checks that JSON-LD parses, that each `@id` is defined once, and that no value is empty; the rest comes in P4.
> - `check:seo` checks the title (brand once, 50–60 characters), the description (140–160), one H1, the self-canonical, the `keywords` ban, and duplicate titles and descriptions across pages. The Open Graph and Twitter tags and `og:image` come in P4; sitemap parity and the `llms` exclusion come in P9.
> - `check:links` checks that internal links resolve and (from P2) that every header and footer link equals its target's canonical path, with no list linking a page twice; the registry rules come in P4.
> - The HTML gates find pages by following links from `/`; sitemap and registry seeds come in P4/P9.

---

## 1. Gate catalogue

| Script | What it checks | Pass condition |
|---|---|---|
| `npm run typecheck` | `tsc --noEmit` (strict) | 0 errors |
| `npm run lint` | ESLint flat config (`eslint.config.mjs`) incl. Next.js, TypeScript, jsx-a11y rules | 0 errors, 0 warnings |
| `npm run format:check` | Prettier | no unformatted files |
| `npm run check:tokens` | No raw hex/rgb colours or arbitrary px values outside `src/styles/tokens.css`; no physical direction classes/properties (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`, `text-right`, `margin-left`…) | 0 hits |
| `npm run check:contrast` | The colour pairs in `src/styles/tokens.css`, in both themes, against WCAG 2.x: text 4.5:1; large text and UI parts 3:1; gradients at every stop ([05](05-design-system.md) §2). It also fails on: <br>• a semantic token without a value in both themes <br>• an `@media` block (every first visit is dark, 05 §1) <br>• anything outside the file's documented shape <br>From P2 it also gates text on glass: each text colour on `--dz-glass-tint-min` or `--dz-glass-tint-muted` over the worst backdrop (a white card, with the grain's brightest speck composited on top), lit menu rows as an overlay, the focus ring, and each social letter tile (C49). It prints the pairs it doesn't check and why. It also measures the pillar pixels on every icon surface and reports them without failing (C38) | 0 pairs below threshold, 0 problems |
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
| `npm run lhci` | Lighthouse CI on the fixed URL sample with per-tier budgets from [07](07-performance-budget.md) (page tiers: decision 0005), run by `scripts/lhci-run.mjs`, which first calibrates the CPU slowdown to the machine ([decision 0025](../decisions/0025-lighthouse-cpu-calibration.md)): scores, Core Web Vitals, and per-type bytes (fonts, images) on every run. From P2 the sample is Home and the review page `/shell-review` (the complete shell, registry R165), both under the T1 assertions; the review page has SEO off (noindex by design) and a lab LCP limit of 2,700 ms (C48, C50). **Build Mode ([decision 0029](../decisions/0029-build-mode.md)): the sample is Home and the review page only, and `lhci` runs only when a change can reach Home** (§2). No other page enters the sample (`DZ_LHCI_PAGES` stays for a one-off diagnostic the owner asks for). From P3 it runs in two region profiles ([C52](conflict-register.md)): no country (counted as Europe: the consent banner shows) on both pages, and Home as a visitor from the UAE (`lighthouserc.row.cjs`, on 127.0.0.1). Then `scripts/check-page-weight.mjs` counts the page's own origin only, from each run's requests ([C54](conflict-register.md)): first-party HTML + CSS + JS ≤ the framework baseline + 50 KB (the review page alone 194,000 B, C57), and first-party JS ≤ the baseline + 5 KB growth + our own code (decisions 0014, 0021); third-party bytes are printed per run, with their own caps once the owner's GTM container is in | all assertions pass, and the page-weight check passes |
| `npm run verify:fast` | `typecheck` + `lint` + `check:tokens` + `check:contrast` | pass |
| `npm run verify` | everything above, in order | pass |

---

## 2. Which gates apply to which task

**Build Mode ([decision 0029](../decisions/0029-build-mode.md)): gates by risk.** Home's performance, design and SEO/GEO are never relaxed; everything else is checked once, automatically, and as early as it is cheap.

| When | Required gates |
|---|---|
| Every commit | `verify:fast` (the stop hook runs it too) |
| Every branch, before the owner's "merge" | Locally: `build` + `check:schema` + `check:seo` + `check:links` + `check:facts` (+ `test` when logic changed). In CI: `verify:ci` on the branch push (everything but `lhci`, e2e and axe included), green before the merge. `git diff --stat` matches the plan's allowed files |
| **The change can reach Home**: Home's content or sections, the shell (header, footer, menus, floating buttons), any CSS (one shared stylesheet, decision 0026), `src/lib/fx/`, tracking or consent, the root layout, `next.config`, a dependency | The row above + `lhci` (Home and the review page, 07 in full). A failure blocks the merge |
| A new template (its pilot page) | The branch row + the SEO/GEO Auditor and the Performance & Accessibility Auditor once + the owner's review of the pilot on the preview; for a new schema shape, the owner runs Google's Rich Results Test and the Schema Markup Validator on the preview (03 §4) |
| Pages from an approved template (batches of up to 10) | The branch row only. No `lhci`, no auditors |
| Analytics / consent change | The Home row + `test:e2e` (tracking) + the owner's GTM Preview checklist |
| Rule system change (owner only) | `check:rules` |
| Launch readiness (P10) | `verify` (every gate) + the manual checks (§4) |

`check:content` (planned) joins the branch row when it exists; until then the content writer follows the engine's page blueprint and the agent checks the FAQ ids and the direct answer by reading the page, with no `.scratch/` script.

---

## 3. Evidence rules

1. Report the **actual result**: one line per gate (its summary line), and a failing gate's output in full. Trim noise, never results. A green CI run on the branch head may stand for the gates it ran: give its run link or commit.
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

GitHub Actions runs `verify:ci` — everything but `lhci` ([decision 0028](../decisions/0028-standard-tier-and-light-verification.md)) — on every push to a branch other than `main`, and the full `npm run verify` on pull requests and manual runs. `lhci` runs locally when §2's Home row applies (decision 0029). `main` takes work only as an approved merge (see [12](12-git-workflow.md)).
