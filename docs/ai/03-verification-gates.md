# 03 · Verification Gates

> **Applies to:** every task that changes files · **Precedence:** below 00 · **Last reviewed:** 2026-10-18 (Website v3, decision 0033)

A gate is a **command with a pass condition**. Work is done only when the required gates pass **and their output is in the report**. "I checked mentally" is not a gate.

> **Status (v3, 2026-10-18):** performance no longer gates anything (N1, decision 0033). `lhci`, its configs, `check-page-weight.mjs`, `measure-prod-weight.mjs` and `@lhci/cli` are deleted in the rebuild's Phase C. Phase C also rewrites `check:tokens` and `check:contrast` for the v3 palette, adds the SEO contract to `check:seo` ([08](08-seo-geo-aeo-schema.md) §7) and adds `knip`. Until each lands, a gate that can't run is reported as **NOT RUN, reason**, never as passed.
>
> Some gates grow by phase. Each one prints what it doesn't check yet and the phase that adds it, so its output never claims more than it checked. `check:content` is still planned.

---

## 1. Gate catalogue

| Script | What it checks | Pass condition |
|---|---|---|
| `npm run typecheck` | `tsc --noEmit` (strict) | 0 errors |
| `npm run lint` | ESLint flat config (`eslint.config.mjs`) incl. Next.js, TypeScript, jsx-a11y rules | 0 errors, 0 warnings |
| `npm run format:check` | Prettier | no unformatted files |
| `npm run check:tokens` | No raw hex/rgb/oklch colours or arbitrary px values outside `src/styles/tokens.css`; no physical direction classes/properties (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`, `text-right`, `margin-left`…). Copied KokonutUI and Aceternity components are held to the same rule once restyled | 0 hits |
| `npm run check:contrast` | The colour pairs in `src/styles/tokens.css` against WCAG 2.x ([05](05-design-system.md) §2): <br>• text 4.5:1; large text and UI parts 3:1 <br>• gradients at every stop <br>• white text on the stage gradient <br>• violet text on each rotator slab, as large text <br>• the focus ring <br>It fails on a semantic token without a value, or anything outside the file's documented shape. It reads `oklch()` as well as hex. It prints the pairs it doesn't check and why. It reports without failing the supplementary accents that never carry meaning alone: the pillar pixels (C38) and signal orange (C80) | 0 pairs below threshold, 0 problems |
| `npm run check:facts` | Every number in `src/content/**` is in the facts allowlist; no `[[TODO` markers in content that ships | 0 unlisted numbers, 0 TODO markers |
| `npm run check:schema` | On built pages ([08](08-seo-geo-aeo-schema.md) §3): <br>• JSON-LD parses <br>• each `@id` is defined at most once per document <br>• every reference resolves in the document or to a registered node that its home page defines <br>• `#organization` and `#website` appear exactly once <br>• one primary entity per template, matching the matrix <br>• NAP equals the site config <br>• every URL is absolute on the canonical host with no trailing slash <br>• breadcrumb positions are contiguous and each item is a built route <br>• visible-parity fields appear in the page text <br>• `VideoObject` for every video on the page (08 §7) <br>• no empty or placeholder values | all pages pass |
| `npm run check:seo` | On built HTML ([08](08-seo-geo-aeo-schema.md) §1, §6, §7): <br>• one `<title>`, 30–60 characters in total, with the brand suffix once <br>• description 120–160 characters <br>• titles and descriptions unique across pages <br>• one H1, heading levels never skip <br>• absolute self-canonical with no trailing slash <br>• `og:image` at 1200 × 630 that returns 200 <br>• no `keywords` meta <br>• every `<img>` has `alt` (≤ 125 characters) or is marked decorative, with width and height <br>• media file names are lowercase kebab-case <br>• every `<video>` has a poster and captions <br>• sitemap URLs equal the indexable built routes, with their image and video entries <br>• `noindex` routes are absent from the sitemap and the `llms` files | 0 failures |
| `npm run check:links` | Every internal link resolves to a built route; nav/footer hrefs equal canonicals. Extended in P4 ([engine](../seo/seo-geo-domination-engine.md) §5.4): <br>• contextual link budget per page type <br>• banned anchors <br>• duplicate targets <br>• anchor reuse over 3 times sitewide <br>• orphan pages (fewer than 3 inbound links) <br>• click depth over 3 <br>• targets outside the [URL registry](../seo/url-registry.md) or not yet shipped <br>External citation links go in a weekly link-rot report (warning only) | 0 broken links, 0 rule failures |
| `npm run check:content` *(planned)* | [Engine](../seo/seo-geo-domination-engine.md) §3, §6, §12: <br>• word range per page type <br>• paragraph length <br>• direct answer 40–60 words <br>• section ledes 40–75 words <br>• FAQ count per type and answer length <br>• **sitewide FAQ question uniqueness** <br>• heading order <br>• banned words (10 §4) <br>• required modules per page type | 0 failures |
| `npm run check:rules` | Rule system integrity: every file referenced by `CLAUDE.md`, `AGENTS.md` and `.claude/**/*.md` exists; every `docs/ai` file has its header. It can't see paths that contain spaces (`Planning Folder/…`), so check those by hand | pass |
| `npm run check:effects` | Every effect ID in a plan's effect register exists in [13](13-experience-design.md) §4 (the retired IDs in §4.5 still count, so old plans pass; a new plan cites only §4.1–§4.4) | 0 unknown IDs |
| `npm run knip` *(added in Phase C)* | Unused files, exports and dependencies | 0 findings, or each one listed in `knip.json` with a reason |
| `npm run test` | Vitest unit tests (schema builders, geo/llms builders, analytics wrapper, the SEO contract, utils) | all pass |
| `npm run build` | `next build` | succeeds, no warnings we haven't accepted in the conflict register |
| `npm run test:e2e` | Playwright on the production build: key pages render, keyboard navigation, **axe** accessibility, tracking regression (`dataLayer[0]` rule, events fire once), effect modes (reduced motion, Reduce effects, JavaScript off, forced colours, RTL), pause controls for autoplaying motion, and the LCP element visible at first paint ([13](13-experience-design.md) §3) | all pass, 0 serious/critical axe violations |
| `npm run verify:fast` | `typecheck` + `lint` + `check:tokens` + `check:contrast` | pass |
| `npm run verify` | everything above, in order | pass |

**Information only, never a gate (N1, [07](07-performance-budget.md) §2):** a Lighthouse report and the bundle report (`@next/bundle-analyzer`), attached to each branch's report.

---

## 2. Which gates apply to which task

**Gates by risk (decisions [0029](../decisions/0029-build-mode.md), [0033](../decisions/0033-redesign-v3.md)).** Design and SEO/GEO are never relaxed; everything else is checked once, automatically, and as early as it is cheap. Performance is reported, never gated.

| When | Required gates |
|---|---|
| Every commit | `verify:fast` (the stop hook runs it too) |
| Every branch, before the owner's "merge" | Locally: `build` + `check:schema` + `check:seo` + `check:links` + `check:facts` (+ `test` when logic changed). In CI: `verify:ci` on the branch push (format, the static gates, `knip`, tests, build, e2e and axe), green before the merge. `git diff --stat` matches the plan's allowed files. The Lighthouse and bundle reports are attached for information |
| A new template (its pilot page) | The branch row + the SEO/GEO Auditor and the Performance & Accessibility Auditor once + the owner's review of the pilot on the preview, side by side with its Figma frames at 390, 834 and 1440 px; for a new schema shape, the owner runs Google's Rich Results Test and the Schema Markup Validator on the preview (03 §4) |
| Pages from an approved template (batches of up to 10) | The branch row only. No auditors |
| Analytics / consent change | The branch row + `test:e2e` (tracking) + the owner's GTM Preview checklist |
| Rule system change (owner only) | `check:rules` + `check:effects` |
| Launch readiness (P10) | `verify` (every gate) + the manual checks (§4) |

`check:content` (planned) joins the branch row when it exists; until then the content writer follows the engine's page blueprint and the agent checks the FAQ ids and the direct answer by reading the page, with no `.scratch/` script.

---

## 3. Evidence rules

1. Report the **actual result**: one line per gate (its summary line), and a failing gate's output in full. Trim noise, never results. A green CI run on the branch head may stand for the gates it ran: give its run link or commit.
2. A gate that wasn't run is written **NOT RUN, reason**. Never omit it, never mark it passed.
3. A failing gate is reported **as failing**, with output, even if you believe it's unrelated. Then propose a fix or a separate task.
4. Never weaken a gate to make it pass: no `// eslint-disable`, `@ts-ignore`, `as any`, skipped tests or deleted assertions, **unless the plan explicitly approves it** and the conflict register records why.

---

## 4. Manual checks (owner-run, with a checklist the agent provides)

These can't be fully automated. The agent writes the checklist; the owner ticks it.

- GTM Preview → GA4 DebugView → Meta/LinkedIn test events, then **publish the GTM container**
- Google Rich Results Test / Schema Markup Validator for each page type (check **correctness**, not rich-result eligibility)
- PageSpeed Insights on a real budget Android phone over 4G for the homepage and one service page, **for information** (07 §2)
- AI visibility spot check: ask ChatGPT, Gemini and Perplexity about deepzeta (monthly after launch)
- Arabic native review (after launch, before any Arabic page goes live)

---

## 5. Continuous integration

GitHub Actions runs `verify:ci` on every push to a branch other than `main`, and the full `npm run verify` on pull requests and manual runs. `main` takes work only as an approved merge (see [12](12-git-workflow.md)).
