# Plan: Technical SEO / GEO baseline, adopted from the reference project (English first, Arabic-ready)
Status: APPROVED (owner, 2026-09-29: section F approved; applied the same day)
Phase: P-1 (rule changes now) · implemented in P0, P4, P9, P10 and P11
Branch: docs/seo-geo-technical-adoption
Page tier: n/a

## Goal served
*"A fast, custom-coded, **AI-search-ready** site … that **proves every claim it makes**."* Technical SEO and GEO are services we sell. This plan makes sure our own site proves them in the build, with gates, not by hope.

## Context
The owner shared two files from a different project, as a reference for best practices only (`Planning Folder/For Ai/Other project references only/`):
- `seo-geo-technical-forensic-audit.md`: a forensic audit of that project's technical SEO/GEO. It lists its strengths, its defects and its suggestions.
- `arabic-market-domination-reconciled-plan.md`: that project's plan for adding Arabic.

Both were read in full. Each practice was checked against our rules (08, 11, 06, 09, 07) and sorted into **adopt**, **improve** or **leave**. Owner direction: *"Both English and Arabic pages … for the entire website for ranking. But first English only."* It also asks for no hard-coding.

**What this means in practice:** English ships first, but every URL, metadata, schema, sitemap and head builder takes a `locale` from day one (11 §1.5). Arabic in P11 is then additive, with no migration.

## Out of scope
- Writing any application code. Everything below is implemented in the phase shown.
- Arabic content and Arabic keyword research (P11).
- Schema for Studio, Tools and App demo pages (still OPEN in 08 §3; decided in their page plans).
- The unrelated drift noted at the end of this plan.

---

## A. Adopt (these practices are right; we take them as they are)

| # | Practice from the reference | Where it lands | Phase |
|---|---|---|---|
| A1 | JSON-LD in **two blocks**: a sitewide block (`#organization`, `#website`) from the root layout, and a page block (WebPage, Service, BreadcrumbList, FAQPage…) from the page. Both form one `@id` graph. | 08 §3 rule 2 (clarified) | P4 |
| A2 | **No canonical in the root layout.** Every page sets its own self-canonical, so a missing page canonical can never inherit the home URL. This was the reference's "root canonical leak". | 08 §1 | P0/P4 |
| A3 | **Surgical noindex:** page-level `robots` metadata for thank-you, utility, concept and tool-result routes. Non-production deploys (`VERCEL_ENV` ≠ production) get `X-Robots-Tag: noindex` plus a disallow-all `robots.txt`. | 08 §1, §5 | P0 |
| A4 | **Security headers set once, centrally** (`next.config` `headers()`), asserted by e2e: HSTS, CSP, `nosniff`, Referrer-Policy, `frame-ancestors`, Permissions-Policy. Two further rules: no deprecated `X-XSS-Protection`, and `images.dangerouslyAllowSVG` stays off. | 06 §4 | P0 |
| A5 | **Locale-aware breadcrumb builder** (the reference's `crumb()` broke on locale prefixes). It is unit-tested for `en` now and `ar` later. | 08 §3 | P4 |
| A6 | **Metadata assertion test** on every built, indexable page. It checks, and fails on any miss: <br>• one `<title>` with the brand suffix exactly once <br>• the length rules <br>• one H1 <br>• an absolute self-canonical with no trailing slash <br>• `og:image` resolves with a 200 (the reference shipped a dead OG image) <br>• no `keywords` meta | 03 new gate `check:seo` | P0 (script), P4+ |
| A7 | **Sitemap parity:** the sitemap's URLs equal the set of indexable built routes. Noindex routes are absent, and `lastModified` comes from content metadata. | 03 `check:seo` | P9 |
| A8 | **Graph integrity:** every `@id` reference resolves, with no orphan or dangling nodes. This extends `check:schema`. The reference's Arabic pages pointed at English-only nodes. | 03 `check:schema` (extended) | P4 |
| A9 | **Build-time relationship validator:** every catalogue link between service ↔ bundle ↔ industry ↔ FAQ resolves to real content, and the build fails otherwise. | 08 §3 + unit test | P4 |
| A10 | `llms.txt` / `llms-full.txt` are **force-static** with explicit `Cache-Control`. They are generated from content, never by hand. | 08 §4 (already true; made explicit) | P9 |
| A11 | **`areaServed` as `Country` nodes with a Wikidata `sameAs`**: UAE now, GCC countries when the owner confirms. Each Wikidata ID is verified on wikidata.org at build time, never from memory. | 08 §3 | P4 |
| A12 | **`hasOfferCatalog` without prices** on `#organization`, pointing to `{SITE_URL}/services#catalog`, which is defined on the services hub only (keeps every page light). Each catalogue service is an `Offer` → `itemOffered` → `{service page URL}#service`. Refined by the schema reference (C30). It tells AI engines exactly what we sell, with no invented prices. | 08 §3 schema stack | P4 |
| A13 | **`ContactPoint`** (contact type, language, area served). It is added only once a public phone or email is CONFIRMED in the facts file; until then it is omitted. | 08 §3 | P4 |
| A14 | **Real `lastModified`; `priority` and `changefreq` omitted** (Google ignores them). | 08 §6 | P9 |
| A15 | **Robots AI-bot tiers guarded by a unit test** that asserts the tier table. The reference once overwrote its tiers by accident. | 08 §5 + test | P9 |
| A16 | Later, once real content exists: DefinedTerm glossary (P8), an RSS/Atom feed for resources (P8), and `reviewedBy` plus Person credentials. Credentials only when bios are CONFIRMED. | 08 §3 (already listed) | P8 |

## B. Improve (the idea is right, but the reference did it in a weaker way)

| # | Reference approach | Our better version | Where |
|---|---|---|---|
| B1 | A **hardcoded `BASE_URL`** literal | `NEXT_PUBLIC_SITE_URL`, validated at startup by `src/lib/env.ts`, and read through one `siteUrl()` helper. Canonicals, hreflang, `@id`s, sitemap, robots and llms all use it. Validation fails if the value is missing or has a trailing slash. In production it also fails if the value isn't https or is a `*.vercel.app` host. **Done now in `.env.example`.** | 08 §1, §3 · C27 |
| B2 | hreflang `en-AE`, which didn't match the page locale | **Language-only hreflang** `en` / `ar` + `x-default` → English, so GCC-wide searchers are covered, not just the UAE. `og:locale` comes from the same locale constant. Reciprocity is tested. | 11 §2 (confirmed), 08 §1 |
| B3 | Truncating long titles with `substring()` (cut mid-word) | **Fail the build** on an over-length title or description; people rewrite them. Clarified: "50–60 characters" is the full rendered title, including ` \| deepzeta`. | 08 §1 · `check:seo` |
| B4 | Runtime regex that swaps pronouns for entity names (a "GEO engine" rewriting text) | **Write entity-first at the source** (08 §2.4) instead. The llms builders copy text unchanged, and pronoun replacement is dropped entirely. That removes the risk of corrupted sentences. | 08 §4 |
| B5 | `/ar` → `/ar/` 308 in middleware (which contradicted their own canonicals) | **`/ar` is the Arabic home, with no trailing slash and no middleware redirect**, matching our sitewide "no trailing slash" rule. | 11 §2 · C28 |
| B6 | A shared `renderSitewideHead(locale)` | Kept, adapted to App Router: **one sitewide schema/head builder that takes `locale`**, called by each root layout (English now, Arabic in P11). "Once in the root layout" becomes **"once per root layout, from one shared builder"**. `#organization` and `#website` stay single entities shared across locales; they are never duplicated per language. | 08 §3, 11 §2 |
| B7 | Arabic added later by moving files | **English lives in a route group with its own root layout from P0**: `src/app/(en)/…`, with public URLs unchanged. P11 then *adds* `src/app/(ar)/ar/…` with `lang="ar" dir="rtl"`. English files never move. Verify multiple-root-layout behaviour and the not-found handling against the installed Next.js docs in P0. | 04 P0 row, 11 §2 |
| B8 | Metadata checks by eye | Everything above is a gate (`check:seo`, extended `check:schema`), so a regression fails CI instead of waiting for the next audit. | 03 |
| B9 | Lighthouse runs on one locale | **Lighthouse per locale** in P11: the English regression gate (11 §2) plus the same tier floors for `/ar` pages. | 11 §2 |

## R. Leave (don't adopt: wrong for us, or against our rules)

| # | Reference practice | Why we leave it |
|---|---|---|
| R1 | QAPage with `upvoteCount` / `answerCount` on our own content | The counts would be fabricated (N3). Where Q&A fits, we use FAQPage with visible text that matches word for word. |
| R2 | `keywords` meta | Ignored by Google, and it hands competitors our keyword list. |
| R3 | `speakable` | Beta, for news publishers only. It adds noise to the graph. |
| R4 | `Dataset` / `estimatedCost` schema | Only when we publish real data or real prices (N3). |
| R5 | GTM deferred to browser idle | It conflicts with our analytics rules (C3/L6): the consent default must run before GTM, and GTM loads through `@next/third-parties`. |
| R6 | Hand-written font-hash preloads | `next/font` generates the preloads; hand-written hashes break on every build. |
| R7 | `new Date()` fallbacks and hardcoded dates | Our rule is deterministic dates from content metadata (08 §3 rule 5). |
| R8 | Machine translation (DeepSeek) for Arabic | Our standard is native GCC transcreation with human sign-off (11 §3). No Arabic page ships on AI output alone. |
| R9 | Noto Sans Arabic | Readex Pro is decided (05 §3). |
| R10 | Accept-Language or `NEXT_LOCALE` cookie redirects and banners | Our rule is no automatic language redirects. A visible switch links each page to its counterpart (11 §2), which keeps crawling and canonicals clean. |
| R11 | GovernmentOrganization entities as standalone nodes | Only as `citation`/`mentions` inside articles that really cite UAE government sources (e.g. e-invoicing), from P8 on. They are never floating nodes. |

**Open for P11 (not decided now):** Arabic-script slugs (`/ar/أتمتة-واتساب`) versus English slugs under `/ar`. Recommendation: decide from the Arabic keyword research in P11. Arabic slugs can match queries better but turn into percent-encoded URLs when shared.

---

## D. Environment variables (created now: `.env.example`, names only)

| Variable | Public? | Used for | Phase |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | The one origin for canonicals, hreflang, `@id`s, sitemap, robots, llms | P0 |
| `NEXT_PUBLIC_GTM_ID` | yes | GTM container | P3 |
| `NEXT_PUBLIC_GTM_AUTH`, `NEXT_PUBLIC_GTM_PREVIEW` | yes | Optional GTM environment for previews (verify the prop names in `@next/third-parties` in P3) | P3 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | yes | Spam widget | P6 |
| `TURNSTILE_SECRET_KEY` | no | Server-side token check | P6 |
| `N8N_LEAD_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET` | no | Lead intake → n8n (`docs/owner/n8n-setup-guide.md` Part 8) | P6 |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | no | Rate limiting | P6 |
| `ANTHROPIC_API_KEY` | no | AI agent demo, Content Planner | P7 |
| `GOOGLE_PAGESPEED_API_KEY` | no | Website & AI Search Health Check | P7 |
| `VERCEL_ENV`, `VERCEL_URL` | set by Vercel | Non-production noindex; never used for canonicals | P0 |

**Deliberately not env vars:**
- **Business facts** (phone, WhatsApp, Cal.com link, social URLs) live in one typed site config built from `docs/facts/company-facts.md`.
- **Marketing-platform tokens** (Meta, LinkedIn, WhatsApp Cloud, Gmail, Sheets) live in n8n Credentials.
- **Search Console and Bing verification** use DNS TXT records on the domain, not a meta tag or env var.

**Handling:**
- Values live in the owner's `.env.local` and in Vercel.
- Agents are blocked from reading `.env.local` and `.env.*` (`.claude/settings.json`); they see names only.

---

## E. Build readiness: what was needed from the owner (answered 2026-09-29, except where marked)

**Owner answers, 2026-09-29** (recorded in the facts file and the rules):

| # | Answer | Still open |
|---|---|---|
| 1 | Public repo accepted until Vercel Pro (then private); GPL replaced by an all-rights-reserved notice; `Other project references only/` git-ignored; work pushed to a branch, merged by pull request | — |
| 2 | Section F approved and applied | — |
| 3 | D2: Deepzeta Digital Solutions L.L.C., licensed by Dubai DET; brand "Deepzeta AI" (C29); founder Jamsheed Khalid (facts §4) | Trade licence number (a variable until the full licence is issued) |
| 4 | Physical office (so the entity is `ProfessionalService`); email hello@deepzeta.ai; Monday to Saturday, 08:00–17:00 GST | Phone and WhatsApp (about 10 days), map pin and Google Business Profile (after the full licence); each is one variable until set |
| 5 | Founding date 2026-08-02 | — |
| 6–7 | C6: the four pillars; AI Automation and Websites lead; no industry focus at launch | — |
| 8 | Privacy policy, terms of service and consent wording are final (no external legal review, the owner's decision): `docs/content-drafts/legal/` | — |
| 9 | The tools hub is named Deepzeta Sync, URL `/tools`, shown in the header, footer and mobile menu once built (C31) | — |

The original list follows for the record.

**Blocks P0 (the scaffold):**
1. **Git remote:** `origin/main` has unrelated history (one LICENSE commit). Choose one: (a) push our history to a new, empty repo, or (b) merge the unrelated histories once, with `--allow-unrelated-histories`. Force-push stays banned.
2. **Approve this plan** (the rule edits in §F).

**Blocks P4 (schema engine) and the pages that show them:**

3. **D2: company entity.** Legal name, entity type, trade licence number and issuing authority.
4. **NAP:**
   - Is there a public office address, or are we a service-area business (no public address)? This decides LocalBusiness versus ProfessionalService with `areaServed` only.
   - The public phone, WhatsApp number, public email and opening hours.
5. **Founding date** and the **Google Business Profile** (create it or share the link).

**Blocks P5/P6 (pages and navigation):**

6. **C6: pillars or stages.** This sets the menu grouping and the Automation URL.
7. **First focus sectors:** which 1–2 industries lead (your note "focus on one sector").
8. **Legal:** the privacy policy and terms content (or a lawyer's text), and the consent wording (PDPL).

**Needed before launch, never invented:**

9. Team bios, photos and credentials (for E-E-A-T and `reviewedBy`).
10. Prices, if a pricing page ships.
11. Real case studies with written client permission; client logos; current partner statuses.

**Accounts to create** (the owner signs in; values go straight into Vercel or `.env.local`, never into chat):
- Vercel project env
- GTM (container exists)
- GA4 (inside GTM)
- Cloudflare Turnstile
- Upstash Redis
- Anthropic console (with a spending limit)
- a Google Cloud API key restricted to PageSpeed Insights
- n8n Cloud (per the guide)
- Cal.com
- Google Search Console and Bing Webmaster Tools (both verified by DNS)

---

## F. Rule edits (approved and applied 2026-09-29)

| File | Change |
|---|---|
| `docs/ai/08-seo-geo-aeo-schema.md` | **§1:** <br>• title length counts the full rendered title <br>• over-length fails the build (no truncation) <br>• no canonical in any layout <br>• canonical built from `NEXT_PUBLIC_SITE_URL` via `siteUrl()` <br>• `og:locale` from the locale constant <br>• no `keywords` meta <br>**§3:** <br>• rule 2: two JSON-LD blocks (sitewide/page), "once per root layout, from one shared builder", entities shared across locales <br>• new rules: `areaServed` Country + verified Wikidata <br>• `hasOfferCatalog` without prices <br>• `ContactPoint` only when confirmed <br>• the relationship validator <br>• the LEAVE list R1–R4 as explicit bans <br>**§4:** <br>• force-static + `Cache-Control` <br>• pronoun replacement not used <br>**§5:** <br>• non-production noindex <br>• tier unit test <br>**§6:** <br>• no `priority`/`changefreq` <br>• parity checked by `check:seo` |
| `docs/ai/11-i18n-rtl-readiness.md` | **§2:** <br>• English in a route group with its own root layout from P0; Arabic added as `(ar)` <br>• `/ar` with no trailing slash, no middleware redirect <br>• language-only hreflang <br>• shared sitewide head builder <br>• Lighthouse per locale <br>• slug question open for P11 <br>• no machine translation (restating R8 in one line) |
| `docs/ai/06-code-standards.md` | **§4:** <br>• headers set centrally in `next.config` and asserted by e2e <br>• CSP starts as `Report-Only` in P0; enforcement mode decided in P3 after GTM, because nonce-based CSP forces dynamic rendering (verify on the installed Next.js) <br>• no `X-XSS-Protection` <br>• `dangerouslyAllowSVG` off <br>• `siteUrl()` is the only way to build absolute URLs |
| `docs/ai/03-verification-gates.md` | **§1:** <br>• add `check:seo` (A6, A7, B3) <br>• extend `check:schema` (A8) <br>**§2:** <br>• `check:seo` joins the "page/route" and "Schema/SEO" rows |
| `docs/ai/04-build-sequence.md` | **P0 row:** <br>• "`(en)` route group root layout; `siteUrl()`; non-production noindex; `check:seo` script" |
| `docs/ai/conflict-register.md` | Append: <br>• **C27:** 08 §1 "one `SITE_URL` constant" vs the owner's no-hard-coding instruction → the env-validated origin <br>• **C28:** 11 §2 "under `/ar/`" vs 08 §2.10 "no trailing slash" → `/ar`, no redirect |
| `docs/facts/company-facts.md` | "Domain / canonical site URL": `https://deepzeta.ai`, CONFIRMED (decision 0006). The row still says UNKNOWN / D1 pending. |

Each edited rule file gets "Last reviewed" set to the edit date.

## Allowed files
| Path | Action | Purpose |
|---|---|---|
| `.env.example` | CREATE (done) | Variable names and comments only |
| `docs/plans/2026-09-29-seo-geo-technical-adoption.md` | CREATE (done) | This plan |
| `docs/ai/08-seo-geo-aeo-schema.md` | MODIFY | §F |
| `docs/ai/11-i18n-rtl-readiness.md` | MODIFY | §F |
| `docs/ai/06-code-standards.md` | MODIFY | §F |
| `docs/ai/03-verification-gates.md` | MODIFY | §F |
| `docs/ai/04-build-sequence.md` | MODIFY | §F (P0 row only) |
| `docs/ai/conflict-register.md` | APPEND-ONLY | C27, C28 |
| `docs/facts/company-facts.md` | MODIFY | Domain row; then every fact the owner gave on 2026-09-29 (§E) |
| `docs/ai/00`, `05`, `09`, `10`, `13`, `conflict-register.md` (C6 row), `docs/decisions/README.md`, `CLAUDE.md`, `docs/design/README.md`, `header.md`, `home.md`, `footer.md`, `automation.md` | MODIFY | Added on the owner's answers: C6 resolved to the pillars, brand name (C29), D2 decided (owner rule: every confirmed decision is written into the rules in the same session) |
| `docs/plans/2026-09-29-schema-system.md` | CREATE | P4 schema specification from the owner's schema reference (C30) |
| `docs/content-drafts/legal/privacy-policy.md`, `terms-of-service.md`, `consent-copy.md` | CREATE | Legal texts; they move to `src/content/en/legal/` in P3/P6 |

## Steps
1. Owner approves (or edits) §A, §B, §R and the §F list. **Done 2026-09-29.**
2. Apply the §F edits file by file → gate: `node scripts/check-rules.mjs`, a re-read of each changed line, and `git diff --stat` equal to the allowed list.
3. Commit on `docs/seo-geo-technical-adoption` (asks first).
4. The implementation items then enter the P0, P4, P9 and P11 plans, with the IDs above (A1…B9) cited.

## Risks & mitigations
- **The CSP breaks GTM or makes pages dynamic.** Start Report-Only; decide enforcement in P3 with measured `lhci`.
- **Multiple root layouts** (route groups) cause a full reload on the language switch, and the not-found handling needs care. Acceptable for a language switch; verify against the installed Next.js docs in P0 before scaffolding.
- **Wrong Wikidata IDs** would link us to the wrong entity. Verify each ID on wikidata.org and record the check date in a code comment.
- **More gates slow CI slightly.** `check:seo` reads the built HTML only, with no browser.

## Gates (from 03 §2)
- Rule system change: `check:rules`.

## Open questions
1. Is there a public office address, or is deepzeta a service-area business? (Decides LocalBusiness vs ProfessionalService.)
2. Git remote: a new empty repo, or a one-time merge of the unrelated history?
3. P11: Arabic-script or English slugs under `/ar` (decided later).

## Noticed along the way (flagged, not fixed here)
**Rule drift on WebGL for Home.** Three rules disagree:
- 05 §5 rule 5 and 06 §1 (Motion row) still allow "one post-LCP WebGL moment on Home".
- 13 §4.6 and 06 §2.7 say WebGL is **T3 only**.
- Decision 0008 defines T1 "native" as platform features plus ≤ 10 KB of first-party JS.

The owner should decide which one wins. Proposed: T3 only, per 0008/13. That means editing 05 and 06 in a small separate plan.
