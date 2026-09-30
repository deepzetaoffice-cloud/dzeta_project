# Plan: P0 Foundation, part 1 of 2: scaffold, gates, CI, SEO and security base, empty-page baseline
Status: APPROVED (owner, 2026-09-30: "Approved"; Q1 and Q2 approved; answers under Open questions)
Progress (2026-09-30):
- Steps 1–9 are done, with CI `verify` green on GitHub.
- Step 10 waits for the owner's C8 choice (decision 0014).
- Step 11 is done, except the 08 §1 and 04 P10 edits, which wait for the owner to confirm Q3 (decision 0013).
- Step 12 follows.
Phase: P0
Branch: `chore/p0-foundation`, from the docs stack's head `06a25d2`. That's the same code `main` has once the docs PR is merged, so the P0 PR diff shows P0 only.
Page tier: T1 for the placeholder Home (`lhci` floor ≥ 95). No effects.

## Goal served
*"A **fast**, custom-coded, AI-search-ready site … that **proves every claim it makes**."*
- Every later claim (speed, SEO, accessibility, honesty) gets an automatic gate that can fail a pull request.
- The empty-page baseline tells us, with measured numbers, what JavaScript budget is really possible (conflict C8).

## Context
- The P0 row in [04](../ai/04-build-sequence.md) §2, whose exit gate is "`verify` green; baseline recorded in a decision".
- Decisions [0004](../decisions/0004-tech-stack.md) (stack, "versions verified in P0", hosting region) and [0005](../decisions/0005-performance-tiers.md) (the tier assertions in Lighthouse CI).
- Items from the [SEO/GEO technical adoption plan](2026-09-29-seo-geo-technical-adoption.md): A2 (no canonical in a layout), A3 (non-production noindex), A4 (central security headers), A6 (the `check:seo` script), B1 (`siteUrl()`), B7 (the `(en)` route group).
- [06](../ai/06-code-standards.md) §4 (security), [07](../ai/07-performance-budget.md) §2 (the 50 KB caveat), [11](../ai/11-i18n-rtl-readiness.md) §2 (prepared in P0).
- Lessons 1 (Google Fonts gate), L4 (every check is an npm script), L9 (Windows shell safety) and L11 (verify config syntax).

**Why P0 is split into two plans.** Part 2, "Design tokens, themes and fonts", sets:
- the final token names (C22) and the dark and light semantic tokens
- the fluid type scale, the spacing rhythm and the layer scale
- a contrast gate and the `next/font` setup

Those are design decisions the owner reviews visually, and the JavaScript baseline doesn't depend on them. Part 2 starts after this plan's PR. An early input for it: `--dz-white` text on a solid `--dz-signal` fill measures **4.16:1** (below AA 4.5:1 for body text); navy text on `--dz-grad-action`, as in the Lab, passes.

## Verified versions (npm registry, 2026-09-30)

| Package | Pin (exact) | Evidence and notes |
|---|---|---|
| `next` | 16.3.7 | `latest` tag; the docs read for this plan show version 16.3.7 |
| `react`, `react-dom` | 19.3.0 | Next peer `^19.0.0` |
| `typescript` | **6.0.3** (not 7.0.2) | `typescript-eslint` 8.71.0, used by `eslint-config-next`, has peer `typescript >=4.8.4 <6.1.0`. Next 16 needs ≥ 5.1. |
| `@types/node` | 24.19.0 | Matches the installed Node v24.19.0 |
| `@types/react`, `@types/react-dom` | 19.3.0 | |
| `tailwindcss`, `@tailwindcss/postcss` | 4.3.3 | `postcss` comes with `@tailwindcss/postcss` (`^8.5.16`), so it isn't added separately |
| `eslint` | **9.39.5** (not 10.11.0) | Bundled by `eslint-config-next`: `eslint-plugin-react` 7.37.5 (peer up to `^9.7`), `eslint-plugin-import` 2.32.0 and `eslint-plugin-jsx-a11y` 6.10.2 (both up to `^9`) |
| `eslint-config-next` | 16.3.7 | Matches `next` |
| `eslint-config-prettier` | 10.1.8 | Recommended by the Next.js ESLint docs when Prettier is used |
| `prettier` | 3.9.9 | |
| `vitest` | 5.0.2 | Engines include Node `^24` |
| `vite` | 8.3.1 | Vitest 5 lists `vite` as a peer, not a dependency |
| `@playwright/test` | 1.63.0 | Next peer `^1.51.1` |
| `@axe-core/playwright` | 4.13.0 | |
| `@lhci/cli` | 0.15.1 | Bundles Lighthouse 12.6.1 |

- **Runtime dependencies:** only `next`, `react` and `react-dom`. Everything else is a dev dependency and never reaches the browser.
- **No validation library in P0.** `src/lib/env.ts` is about 40 hand-written lines, so no library can leak into the client bundle. Zod arrives with the forms (P6), server-side only.
- **Security advisories:** step 1 runs `npm audit` and records the result in decision 0012.

**Next.js 16 behaviour checked in the docs (version 16.3.7):**
- **Multiple root layouts** come from route groups. Moving between two root layouts is a full page load, and the home route must live inside a group.
- **Unmatched URLs** with multiple root layouts need `app/global-not-found.tsx`, which is **experimental** (`experimental.globalNotFound: true`). It renders its own `<html>`/`<body>` and imports its own CSS. Next adds `noindex` to 404 responses.
- **`next lint` is removed.** Linting runs `eslint .` with a flat config: `eslint-config-next/core-web-vitals` + `/typescript` + `eslint-config-prettier/flat`.
- **`middleware.ts` is now `proxy.ts`.** P0 needs neither: headers come from `next.config.ts`.
- **Turbopack** is the default bundler for dev and build.

**Hosting finding (0004 asked to verify in P0).** Vercel has **no Middle East compute region**. Its docs, updated 2026-08-11, list 19 regions; the nearest to the UAE is `bom1` (Mumbai), and the default is `iad1` (Washington). Hobby allows one region. P0–P5 pages are static and served from Vercel's CDN edge locations, so the function region matters only from P6 (forms → n8n). **Recommendation:** choose it in the P6 lead-form plan from a measured form → n8n round trip, and record today's finding in 0012.

## Design

### A. Indexing policy (one pure function, `src/lib/seo/indexing.ts`)
`indexable = SITE_INDEXING === "on"` **and** (`VERCEL_ENV` is unset **or** `VERCEL_ENV === "production"`).

| Where | `VERCEL_ENV` | `SITE_INDEXING` | Result |
|---|---|---|---|
| Vercel preview | `preview` | any | noindex, always (08 §1) |
| Vercel production, before launch | `production` | unset | noindex (**pre-launch lock**, Q3) |
| Vercel production, at launch (P10) | `production` | `on` | indexable |
| Owner's machine and CI (for Lighthouse's SEO audit) | unset | `on` | indexable |

- **Not indexable:** `X-Robots-Tag: noindex` on every response (`next.config.ts` `headers()`), plus a disallow-all `robots.txt`.
- **Indexable:** `robots.txt` allows `/` and disallows `/api/`. P9 adds the AI-bot tiers and the sitemap.
- `robots.ts` becomes a **protected** file once it's created (08 §5).

### B. Security headers (set once, in `next.config.ts`, from `src/lib/security-headers.ts`)

| Header | P0 value | Why |
|---|---|---|
| `Content-Security-Policy-Report-Only` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'` | Report-only in P0 (06 §4); enforcement is decided in P3. `upgrade-insecure-requests` is left out because browsers log a console error for it in report-only mode. There's no `report-to` endpoint until P3. |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Two years. `preload` is hard to undo, so it's the owner's decision at launch. |
| `X-Content-Type-Options` | `nosniff` | |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | |
| `X-Frame-Options` | `SAMEORIGIN` | **Deviation, needs approval:** 06 §4 says `DENY` or CSP `frame-ancestors`. Studio concepts load our own pages in a sandboxed iframe (`docs/design/studio.md`), which `DENY` would block. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()` | Nothing on the site needs these; a later plan can open one. |
| `X-XSS-Protection` | never sent | Deprecated; the e2e test asserts it's absent. |
| `X-Powered-By` | removed (`poweredByHeader: false`) | |

`images.dangerouslyAllowSVG` is never set (it's off by default).

### C. Environment validation (`src/lib/env.ts`, run when `next.config.ts` loads, so dev, build and start fail fast)
- **`NEXT_PUBLIC_SITE_URL`:** required. It must be an absolute `http(s)` origin with no path, query, hash or trailing slash. When `VERCEL_ENV=production`, it must also be `https` and must not be a `*.vercel.app` host (C27).
- **`SITE_INDEXING`:** optional, `on` or `off` (default `off`). Any other value fails.
- **No hostname literal** anywhere in code. `src/lib/url.ts` exposes `siteUrl()` and `absoluteUrl(path, locale)`:
  - `en` has no prefix; the builder is ready for `ar` → `/ar`
  - no trailing slash
  - the home URL is the bare origin

### D. Routes and placeholder copy (approved with this plan; the real Home comes in P5)
- **`src/app/(en)/layout.tsx`:** the English root layout.
  - `lang` and `dir` come from `src/lib/i18n/locales.ts`.
  - `metadataBase` is `siteUrl()`.
  - The title template adds ` | {brand}` once.
  - **No canonical** (A2).
- **`src/app/(en)/page.tsx`:** the placeholder Home. It sets its own self-canonical and uses only the facts marked CONFIRMED (brand, positioning line, email), read through `src/lib/site-config.ts`.
  - Title: `AI Automation and Custom Websites in the UAE` → rendered `… | Deepzeta AI` (58 characters)
  - Description: `Deepzeta AI builds custom-coded websites, SEO and AI search visibility, and AI automation for UAE businesses. The full site is coming: email hello@deepzeta.ai.` (159 characters)
  - H1: `AI automation and custom-coded websites for UAE businesses`
  - Body: `Deepzeta AI builds online growth for every business.` (facts §1 positioning line), then `The full website is being built. To talk now, email hello@deepzeta.ai.` (a `mailto:` link)
  - No links to pages that don't exist yet (04 §1.4).
- **`src/app/global-not-found.tsx`:** title `Page not found | Deepzeta AI`. H1 `Page not found`, then `This page doesn't exist.`, then the link `Go to the Deepzeta AI home page` → `/`.
- **`src/lib/site-config.ts`:** starts with CONFIRMED identity facts only (brand name, legal name, email). P4 extends it from the facts file.

### E. What each gate checks now, and what's added later

| Gate | P0 checks | Added later |
|---|---|---|
| `check:tokens` | Raw hex/rgb/hsl/oklch colours and px values (CSS and Tailwind arbitrary values) outside `src/styles/tokens.css`; physical-direction classes and properties; `fonts.googleapis.com` / `fonts.gstatic.com` anywhere in `src/` (lesson 1) | — |
| `check:facts` | `[[TODO` markers in `src/content/**` | The numbers allowlist (P4) |
| `check:schema` | Each JSON-LD block parses; each `@id` is defined at most once per document; no empty or placeholder values | Sitewide nodes exactly once, reference resolution, the matrix, NAP, breadcrumbs, visible parity (P4) |
| `check:seo` | One `<title>`, brand named once, 50–60 characters; description 140–160; one H1; absolute self-canonical on the `NEXT_PUBLIC_SITE_URL` host with no trailing slash; no `keywords` meta; titles and descriptions unique across pages (added after review); `noindex` pages skipped and listed | Open Graph and Twitter tags (P4, with the metadata builder; `og:locale` needs a value decision); `og:image` returns 200 (P4); sitemap parity and the `llms` exclusion (P9) |
| `check:links` | Every internal `<a href>` on every crawled page returns 200 | Registry rules, link budgets, anchors, orphans, click depth (P4) |
| `check:rules` | The existing `scripts/check-rules.mjs`, now an npm script | Lesson 5 extension (its own small plan) |
| `check:effects` | Every effect ID in any plan's "Effect register" table exists in 13 §4. If an older plan fails, it's reported to the owner, never silently excluded. | — |
| `check:content` | Not created (P4) | |

- **Honest output:** every gate prints the checks it skipped and the phase that enables them, so its output never claims more than it checked.
- **Gates must be able to fail:** each gate's logic is a pure function with unit tests on failing fixtures.
- **How the HTML gates work:** `check:seo`, `check:schema` and `check:links` crawl the production build (`next start`) from `/` with JavaScript off. They read the raw server HTML, as crawlers do, through Playwright's real browser parser, so no HTML-parser dependency is needed.

### F. Lighthouse CI (`lighthouserc.cjs`)
- Tests `/` on the production build.
- 5 runs. Lighthouse's default mobile emulation with simulated slow 4G (07 test conditions).
- **Aggregation:** category scores use the median score. Audits use the median run. The perf review found that lhci's `median-run` checks category scores on the best run.
- **Assertions:**
  - Performance ≥ 0.95 (T1)
  - Accessibility, Best Practices and SEO ≥ 0.95
  - LCP ≤ 2500 ms, CLS ≤ 0.1, TBT ≤ 200 ms
  - TTFB ≤ 600 ms and no third-party requests (both added after review, 07 §1–2)
  - total transfer ≤ 150 KB (KiB of transfer size, headers included; P0 has no fonts or images; part 2 splits this into per-type budgets)
- Reports are saved to `.lighthouseci/` (git-ignored). CI keeps them as build artifacts. Nothing goes to public storage.
- The per-page JavaScript assertion is added after the owner's C8 decision (step 10).

## Out of scope
- `tokens.css`, themes, fonts, the contrast gate: **P0 part 2**
- `cn()` (`clsx`, `tailwind-merge`) and `web-vitals`: added by the first plan that needs them
- Logo component, favicon, manifest, icons (P1); header, footer, effects (P2)
- GTM, consent, CSP enforcement (P3)
- Schema builders, the full site config, OG images (P4); the sitemap, AI-bot tiers, `llms` files (P9)
- The real Home page (P5)
- `check:content` (P4)
- Extending `check:rules` (lesson 5)
- Choosing the Vercel function region (P6, see the hosting finding)
- DNS set-up (Q5)

## Allowed files

| Path | Action | Purpose |
|---|---|---|
| `package.json` | CREATE | Exact pins, `engines.node` `24.x`, gate scripts |
| `package-lock.json` | CREATE | **Only through `npm install`**, never edited by hand |
| `tsconfig.json` | CREATE | `strict`, `noUncheckedIndexedAccess`, `@/*` → `src/*`; `next build` may add its plugin entry |
| `next.config.ts` | CREATE | Env validation, `globalNotFound`, headers, `poweredByHeader: false` |
| `postcss.config.mjs` | CREATE | `@tailwindcss/postcss` |
| `eslint.config.mjs` | CREATE | Next core-web-vitals + TypeScript + full jsx-a11y recommended rules + Prettier; ignores `Planning Folder/`, `Mockups fo reference only/`, `docs/` |
| `.prettierrc.json` | CREATE | Prettier settings (LF, as in `.editorconfig`) |
| `.prettierignore` | CREATE | **Written before Prettier is installed**: `docs/`, `Planning Folder/`, `Mockups fo reference only/`, `.claude/`, `CLAUDE.md`, `AGENTS.md`, `LICENSE`, lockfile. The post-edit hook would otherwise reformat protected rule files. |
| `vitest.config.mts` | CREATE | Unit tests in `tests/unit/`, Node environment |
| `playwright.config.ts` | CREATE | Production server; `e2e` and `gates` projects |
| `lighthouserc.cjs` | CREATE | Section F |
| `.github/workflows/ci.yml` | CREATE | `npm ci`, Chromium, `npm run verify` on every PR to `main`; artifacts kept |
| `.env.example` | MODIFY | Add `SITE_INDEXING` with its explanation (Q3) |
| `src/app/(en)/layout.tsx` | CREATE | English root layout |
| `src/app/(en)/page.tsx` | CREATE | Placeholder Home |
| `src/app/global-not-found.tsx` | CREATE | 404 for unmatched URLs |
| `src/app/robots.ts` | CREATE | Section A (protected once created) |
| `src/styles/globals.css` | CREATE | `@import "tailwindcss"` (part 2 adds `tokens.css`) |
| `src/lib/env.ts` | CREATE | Section C |
| `src/lib/url.ts` | CREATE | `siteUrl()`, `absoluteUrl()` |
| `src/lib/seo/indexing.ts` | CREATE | Section A |
| `src/lib/security-headers.ts` | CREATE | Section B |
| `src/lib/seo/title.ts` | CREATE | **Added during step 6, awaiting the owner's OK** (the plan allowed status edits only). The one title format, used by the layout template and by Home. `check:seo` showed that Next.js doesn't apply a layout's `title.template` to the page in the layout's own segment (docs 16.3.7, `generateMetadata` → `title.template`). |
| `src/lib/i18n/locales.ts` | CREATE | `en` → `lang="en"`, `dir="ltr"`, ready for `ar` |
| `src/lib/site-config.ts` | CREATE | CONFIRMED identity facts only |
| `src/content/en/home.ts` | CREATE | Placeholder copy (section D) |
| `src/content/en/not-found.ts` | CREATE | 404 copy |
| `scripts/check-tokens.mjs` | CREATE | Section E |
| `scripts/check-facts.mjs` | CREATE | Section E |
| `scripts/check-effects.mjs` | CREATE | Section E |
| `tests/unit/env.test.ts`, `url.test.ts`, `indexing.test.ts`, `security-headers.test.ts`, `check-tokens.test.ts`, `check-facts.test.ts`, `check-effects.test.ts`, `gate-rules.test.ts` | CREATE | Unit tests, including failing fixtures for every gate |
| `tests/gates/crawl.ts`, `tests/gates/rules.ts` | CREATE | Shared crawler and pure assertion functions |
| `tests/gates/seo.spec.ts`, `schema.spec.ts`, `links.spec.ts` | CREATE | `check:seo`, `check:schema`, `check:links` |
| `tests/e2e/foundation.spec.ts` | CREATE | Headers present (no `X-XSS-Protection`), robots mode, 404 status + `noindex`, `lang`/`dir`, works with JavaScript off, H1 visible at first paint (13 §3 rule 2), no CSP report-only messages, axe 0 serious/critical on Home and 404 |
| `docs/decisions/0012-p0-toolchain-and-hosting.md` | CREATE | Verified versions, `npm audit` result, the hosting finding |
| `docs/decisions/0013-pre-launch-indexing-lock.md` | CREATE | Only if Q3 = yes |
| `docs/decisions/0014-empty-page-baseline-and-js-budget.md` | CREATE | Measured baseline and C8 options (PROPOSED until the owner chooses) |
| `docs/decisions/README.md` | MODIFY | Three index rows; the "Hosting region on Vercel" row points to 0012 |
| `docs/owner/p0-setup-guide.md` | CREATE | Click-level guide for the owner's steps |
| `docs/plans/2026-09-30-p0-foundation.md` | MODIFY | Status updates only |

**Protected files. Edited only with the owner's explicit OK, given with the approval of this plan (00 §5):**

| Path | Change |
|---|---|
| `CLAUDE.md` | "Current state": phase P0, the npm gates exist, the next step is P0 part 2 (the old "Next: the Design Lab prototype" line is out of date) |
| `docs/ai/03-verification-gates.md` | The status note at the top: scripts exist, plus the table in section E of what each gate checks now |
| `docs/ai/06-code-standards.md` | §4: `X-Frame-Options: SAMEORIGIN` + CSP `frame-ancestors 'self'` (the Studio iframe reason) |
| `docs/ai/08-seo-geo-aeo-schema.md` + `docs/ai/04-build-sequence.md` | Only if Q3 = yes. 08 §1 Robots row: production stays `noindex` until `SITE_INDEXING=on` (0013). 04 P10 row: "set `SITE_INDEXING=on` in Vercel Production". |
| `docs/ai/conflict-register.md` + `docs/ai/07-performance-budget.md` | After the owner's C8 choice (step 10): C8 → Resolved; the 07 §2 JavaScript row gets the chosen budget |

## Steps
Each step is committed on the branch after its gate passes (12 §2). Every shell command adds `C:\Program Files\nodejs` to `PATH` until VS Code has been restarted.

0. **Owner prerequisites:** answers to Q1–Q4, the docs PR merged (Q2), VS Code restarted, `.env.local` created (guide §2). → gate: `node -v` works in a fresh terminal.
1. Create the branch; write `package.json`, `.prettierrc.json` and `.prettierignore`; run `npm install --save-exact` with the pins above; run `npm audit`. → gate: `npm ls` shows no peer-dependency errors; audit output recorded.
2. Write `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `globals.css`, `locales.ts`, `site-config.ts`, the `(en)` layout, the page, the content files and `global-not-found.tsx`. → gate: `npm run typecheck`, `npm run build`.
3. Write `eslint.config.mjs` and `check-tokens.mjs` (+ tests). Check that the jsx-a11y rules load without registering the plugin twice. → gate: `npm run verify:fast` (from here the Stop hook runs it automatically).
4. Write `env.ts`, `url.ts`, `indexing.ts` and `security-headers.ts` (+ unit tests), wired into `next.config.ts`; write `robots.ts`. → gate: `npm run test`, `npm run build`.
5. Set up Playwright + axe; write `foundation.spec.ts`. → gate: `npm run test:e2e`.
6. Write the gate crawler and the `check:seo`, `check:schema` and `check:links` specs; write `check-facts.mjs` and `check-effects.mjs` (+ failing-fixture tests). → gate: every `check:*` passes on the build and fails on its fixtures.
7. Write `lighthouserc.cjs`. → gate: `npm run lhci`.
8. Write `ci.yml`, push the branch and open the PR. → gate: the CI `verify` job is green (output pasted). The Actions major versions are checked on GitHub, not taken from memory.
9. **Baseline:** 5 `lhci` runs on `/` in CI, plus one local run for comparison. Record the JavaScript, CSS, HTML and total bytes transferred, the Lighthouse scores, LCP, CLS and TBT → decision 0014 (PROPOSED) with the C8 options from 07 §2.
10. **Owner chooses the C8 option** → 0014 ACCEPTED; the per-page JavaScript `lhci` assertion is added; the approved conflict-register and 07 edits are applied. → gate: `npm run lhci`, `npm run check:rules`.
11. Write decisions 0012 (and 0013), the decisions index, the owner guide and the approved `CLAUDE.md`, 03, 06 (and 08, 04) edits. → gate: `npm run check:rules`.
12. **Phase exit:** full `npm run verify` (local and CI). Reviews by `reviewer`, `qa-verifier`, `perf-a11y-auditor` and `seo-geo-auditor`. `git diff --stat main` matches this table exactly. Report in the 02 §5 format; the owner reviews and merges.

## Effect register
None: the placeholder has no effects.

## Dependencies to add
All from the approved stack (decision 0004); versions and evidence are in the table above.

| Package | Why native or hand-rolled is worse |
|---|---|
| `next`, `react`, `react-dom` | The accepted framework (0004) |
| `typescript`, `@types/*` | `strict` typing is required (06 §1) |
| `tailwindcss`, `@tailwindcss/postcss` | The accepted styling system (05 §1) |
| `eslint`, `eslint-config-next`, `eslint-config-prettier` | The lint gate (03); Next's rules catch Core Web Vitals and accessibility mistakes that hand-written checks would miss |
| `prettier` | The `format:check` gate (03) |
| `vitest`, `vite` | The unit-test gate (03) |
| `@playwright/test`, `@axe-core/playwright` | The e2e and accessibility gates (03); they also parse HTML for the SEO gates, so no extra parser is needed |
| `@lhci/cli` | The Lighthouse gate with tier assertions (0005) |

## Risks and mitigations
- **`global-not-found` is experimental.** The e2e test asserts the 404 status and `noindex`. Fallback: an `(en)` catch-all route that calls `notFound()`.
- **TypeScript 6 with Next 16.3.7 is not yet proven here.** Step 2 builds it. If it fails: the latest TypeScript 5.x, recorded in 0012.
- **ESLint 9** is one major behind. Move to 10 when `eslint-config-next`'s bundled plugins support it (checked again in each dependency plan).
- **The framework's own JavaScript is probably above the 50 KB target.** No claim either way until step 9 measures it; the owner decides (C8).
- **Lab variance:** local Windows runs can differ from CI. The CI median of 5 runs is the record.
- **Hooks:** once Prettier is installed, the post-edit hook formats edited files. `.prettierignore` is written first, so rule files are never reformatted.
- **PATH:** VS Code was started before Node was added to the machine PATH, so `node` isn't found in this session yet. Restarting VS Code fixes it; until then commands add the path.
- **Auto-deploy:** if Vercel is linked, merging to `main` publishes the placeholder. The pre-launch lock (Q3) keeps it out of search engines.
- **Console messages can cost Best Practices points** (CSP report-only warnings, a missing favicon). The CSP is tuned to produce no violations, and the e2e test asserts that. If the missing favicon costs points, it's recorded in 0014; P1 adds the favicon.
- **`next build` edits `tsconfig.json`** (plugin, includes). Expected; the file is on the allowed list.

## Gates (from 03 §2)
- Phase exit: every gate in `npm run verify` (typecheck, lint, format:check, check:tokens, check:facts, check:rules, check:effects, test, build, check:schema, check:seo, check:links, test:e2e, lhci)
- Plus owner review
- Plus the dependency rule: the bundle check in `lhci` and the justifications above

## Open questions
1. **Q1 · P-1 exit.** Do you approve the rule system as complete, so P0 can begin (04 §2 exit gate)?
2. **Q2 · Merge the docs first (recommended).**
   - One PR, `docs/seo-geo-domination-engine` → `main`, carries the whole docs stack. `origin/main` is already its ancestor, so there are no conflicts.
   - You open it on GitHub and merge it with a merge commit; P0 then branches from a clean `main`.
   - The alternative is to stack P0 on the docs branch.
3. **Q3 · Pre-launch indexing lock (recommended).** Should production stay `noindex` until you set `SITE_INDEXING=on` at launch (section A)?
4. **Q4 · Vercel.** Is this GitHub repo already connected to a Vercel project, and is `deepzeta.ai` attached to it? A merge to `main` deploys to production if it is.
5. **Q5 · DNS (not blocking; 0006 asks for it in P0).** Where is `deepzeta.ai` registered? The recommendation follows from the answer; it's needed before P10.

**Owner answers (2026-09-30)**
- **Q1:** approved. P-1 is closed; P0 begins.
- **Q2:** approved. The docs PR is merged by the owner.
- **Q3:** the owner asked whether the lock is needed if the site isn't submitted to Google Search Console.
  - **Answer: yes.** Search engines and AI crawlers find sites through links anywhere on the web (social profiles, directories, other sites), not only through Search Console. `deepzeta.ai` already points at Vercel, so the first successful production deploy is public at once.
  - The lock is one Vercel setting (`SITE_INDEXING`), so it's kept as designed. Turning it off needs no code change: set `SITE_INDEXING=on` in Vercel Production.
- **Q4:** the repo is connected to Vercel (project `deep-zeta/dzeta_project`).
  - Checked 2026-09-30: `https://deepzeta.ai` and `www` return Vercel `DEPLOYMENT_NOT_FOUND`, and the Vercel builds of `d59331b` (Production) and `06a25d2` (Preview) failed, since there's no app yet.
  - So merging the docs PR publishes nothing, and the first live deploy is this plan's placeholder.
- **Q5:** DNS is managed at Hostinger (the registrar) and already points to Vercel. It's recorded in 0012, which answers 0006's open DNS item.
