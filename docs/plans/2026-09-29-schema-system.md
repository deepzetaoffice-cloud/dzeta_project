# Plan: Schema system (JSON-LD), specification for P4
Status: DRAFT. The rules it needs are already in [08](../ai/08-seo-geo-aeo-schema.md) §3 (owner instruction, 2026-09-29, C30); the build steps wait for P4.
Phase: P4 (Data & schema engine), with its foundation in P0
Branch: feat/schema-system (when P4 starts)
Page tier: n/a

## Goal served
*"An **AI-search-ready** site that **proves every claim it makes**."* One contradiction-free entity graph tells Google and AI engines exactly who Deepzeta AI is, where it is and what it sells. Nothing in it is invented.

## Context
- **Source:** the owner's `Planning Folder/For Ai/Other project references only/schema-system-handover-brief.md`, a reusable template. It was examined line by line. Its buckets, decisions and tests are filled in below with our facts and rules.
- **What we changed from it, and why:** conflict C30.
- **The binding rules** live in 08 §3. This file is the specification builders follow in P4: the answers, the registry, the tests and the build order.

## Out of scope
- Metadata, OG images and the title template (P0/P4 metadata work, 08 §1).
- Design tokens and copy.
- Analytics.
- The i18n routing library (C5, P11).
- Schema for the Studio index, Deepzeta Sync (the tools hub, `/tools`) and App demo (08 §3: decided in their page plans).

---

## 1. The six decisions (answered)

| # | Decision | Chosen | Why |
|---|---|---|---|
| 1 | Primary entity type | **One node, `ProfessionalService`**, `@id` `{SITE_URL}/#organization` | A physical office with opening hours (owner, 2026-09-29). `ProfessionalService` is a LocalBusiness subtype, so one node carries both the company and the office. There is no second node that could duplicate the NAP. |
| 2 | Entity scope across locales | **One global entity**, the same bytes in every locale, with no language-specific prose | Avoids the reference project's dangling `/ar/#organization` references (08 §3 rule 6). |
| 3 | Graph shape | **Two blocks per page:** sitewide (root layout) + page (page), each a `@graph` with `@context` once | A server layout can't read the pathname without forcing dynamic rendering, and sitewide output is mounted once (02 §3.8). The CI checks the union as one graph. The brief allows this when documented; this is the record. |
| 4 | `dateModified` provenance | **A content field** (`dateModified` in the content file), changed only on real content changes | The visible "Last updated" renders from the same field, so they match by construction. Git dates are rejected: they change on formatting commits. The reviewer checks that a date changed only with a real content change. |
| 5 | `@id` for pages | **The page's absolute canonical URL**; nodes that belong to a page are `{page URL}#type` | One convention everywhere (08 §3 rule 4). |
| 6 | Author registry | `src/content/authors.ts`, real people only, entries added only from facts file §4 (owner-confirmed bios) | Until an author exists, articles use `author` → `#organization`, which Google accepts. No invented people. |

## 2. Filled buckets

### 2.1 Identity (from `docs/facts/company-facts.md`; the site config is the only copy in code)

| Field | Value | Status |
|---|---|---|
| Brand (`name`) | Deepzeta AI | CONFIRMED |
| Legal name (`legalName`) | Deepzeta Digital Solutions L.L.C. | CONFIRMED |
| `@type` | `ProfessionalService` | Decision 1 |
| Address | `streetAddress` "Office #202, Al Hilal Bank Building, Al Qusais 2" · `addressLocality` "Dubai" · `addressRegion` "Dubai" · `addressCountry` "AE" · no `postalCode` | CONFIRMED |
| `geo` | — | PENDING (office pin, created with the full licence) → omitted until set |
| `telephone` | — | PENDING → omitted (one config field, 06 §3) |
| `email` | hello@deepzeta.ai | CONFIRMED |
| `openingHoursSpecification` | Monday–Saturday, `opens` 08:00, `closes` 17:00 (times are local, GST) | CONFIRMED |
| `foundingDate` | 2026-08-02 | CONFIRMED |
| `areaServed` | `Country` United Arab Emirates, `sameAs` its Wikidata URL (verify on wikidata.org at build time) | CONFIRMED market; GCC countries added when the owner confirms |
| `sameAs` | The nine profiles in facts §2.1, exactly | CONFIRMED |
| `logo` | `{SITE_URL}/#logo` ImageObject: a square PNG ≥ 112×112 exported from the locked logo SVG. The SVG itself is never edited. | Built in P1 |
| Licence | Issuer: Dubai DET. Number: PENDING (issued with the full licence) → no `hasCredential` until it's set. The credential type and the DET verification link are chosen and validated in the P4 plan. | Partial |
| `priceRange`, `aggregateRating`, `review`, `award`, `numberOfEmployees` | — | Omitted (08 §3 rule 8) |
| `contactPoint` | Added when a public phone is CONFIRMED: `contactType` "customer service", `availableLanguage` English (Arabic once P11 ships), `areaServed` AE | PENDING |
| `founder` | → `{SITE_URL}/#person-jamsheed-khalid`: a Person node defined on `/about` (`name` Jamsheed Khalid, `jobTitle` Founder, `worksFor` → `#organization`, `sameAs` his LinkedIn and Gravatar URLs from facts §4). His other companies (facts §4.1) appear on `/about` only, as Organization nodes without an `@id` whose `founder` points to him. | CONFIRMED (bio and photo UNKNOWN) |
| Google Business Profile | Added to `sameAs` through facts §2.1 once it exists | PENDING |

### 2.2 URL contract

| Field | Value |
|---|---|
| Host | `https://deepzeta.ai` (decision 0006; `www` redirects), from `NEXT_PUBLIC_SITE_URL` (C27) |
| Trailing slash | None, including `/ar` (C28) |
| Locales | `en` at the root now; `ar` at `/ar` in P11 |
| hreflang | `en`, `ar`, `x-default` → English (after P11) |
| `noindex` routes | thank-you, 404, drafts, `/studio/<slug>`, tool result views, every non-production deployment |
| Sitemap | Every indexable built route, checked by `check:seo` |
| Rendering | Next.js App Router, static generation by default |

### 2.3 Template matrix

The primary entity and stack for every page type are in 08 §3. **The generators for each template:**

| Template | URL pattern | Assembler | Primary | `mainEntity` |
|---|---|---|---|---|
| Home | `/` | `homeGraph` | WebPage | — (`about` → `#organization`) |
| Services hub | `/services` | `servicesHubGraph` | CollectionPage | `#itemlist` |
| Pillar | `/services/<pillar>` | `pillarGraph` | Service | `#service` |
| Service | `/services/<service>` | `serviceGraph` | Service | `#service` |
| Solution | `/solutions/<slug>` | `serviceGraph` | Service | `#service` |
| Industry | `/industries/<slug>` | `industryGraph` | CollectionPage | `#itemlist` |
| Book an audit | `/audit` (final slug in its page plan) | `auditGraph` | Service (price 0 AED) | `#service` |
| Case study | `/work/<slug>` | `articleGraph` | Article | `#article` |
| Guide / blog | `/resources/<slug>` | `articleGraph` | Article / BlogPosting | `#article` |
| Comparison | `/resources/<slug>` | `comparisonGraph` | WebPage | `#itemlist` |
| Glossary | `/resources/glossary` | `glossaryGraph` | DefinedTermSet | `#termset` |
| Pricing | `/pricing` | `pricingGraph` | WebPage | `#catalog` (real prices only) |
| About | `/about` | `aboutGraph` | AboutPage | `#organization` |
| Contact | `/contact` | `contactGraph` | ContactPage | `#organization` |
| Privacy, terms | `/privacy`, `/terms` | `legalGraph` | WebPage | — |

The pillar and service slugs are set in the P6 plans from the blueprint page map. This table only fixes the patterns.

### 2.4 Content data contract

| Item | Value |
|---|---|
| Single sources | `docs/facts/company-facts.md` → `src/lib/site-config.ts` (facts); `src/content/en/**` (copy); the catalogue data (P4) |
| Visible-parity fields | FAQ Q&A, HowTo steps, breadcrumb labels, author name and role, `dateModified` = "Last updated", prices, NAP, opening hours (08 §3 rule 7) |
| Authored vs derived | Authored: every text field. Derived: every URL and `@id` (via `absoluteUrl()`), `inLanguage`, breadcrumb positions |
| `datePublished` / `dateModified` | Content fields; owner-reviewed changes only |

---

## 3. Architecture (maps the brief's deliverables to our file map, 00 §6)

| Brief deliverable | Our file |
|---|---|
| `lib/constants.ts` | `src/lib/site-config.ts` (facts) + `src/lib/env.ts` (the validated origin) + `src/lib/url.ts` (`siteUrl()`, `absoluteUrl(path, locale)`, `localePrefix(locale)`) |
| `types/schema.ts` | `src/lib/schema/types.ts` |
| `lib/schema.ts` (pure per-node generators) | `src/lib/schema/nodes/*.ts`: one file per type (`organization`, `website`, `webPage`, `service`, `faqPage`, `howTo`, `breadcrumbList`, `itemList`, `offerCatalog`, `article`, `definedTermSet`, `person`) |
| `lib/schema-graph.ts` (assemblers) | `src/lib/schema/graphs/*.ts`, one per template, plus `dedupeById()` and `assertResolvable()` in `src/lib/schema/graph.ts` |
| `lib/jsonld.tsx` | `src/components/seo/JsonLd.tsx`: the only schema `<script>`; escapes `<`, `>`, `&`, U+2028 and U+2029 |
| `tests/schema/*.spec.ts` | `tests/unit/schema/*.test.ts` (generators and assemblers) + `scripts/check-schema.mjs` (the built-HTML gate, 03) |
| `SCHEMA-GRAPH.md` | `docs/seo/schema-graph.md`: every `@id`, its type, its home page and the templates that reference it |
| `plans/SCHEMA-SYSTEM-SPEC.md` | This file |
| Golden fixtures | `tests/fixtures/schema/<template>.json`: the committed rendered graph for one URL per template, diffed in CI |

**Layer rules:**
- **Generators** take plain data and return plain objects. They never read routes, the pathname or the environment directly.
- **Assemblers** compose nodes and resolve `@id`s. They never contain a literal value.
- **`JsonLd`** only serialises. It never fetches data or computes values.

## 4. CI assertions (`check:schema`, per template, on the production build)

1. Every `application/ld+json` block parses.
2. Each `@id` is defined at most once per document; no conflicting definitions.
3. Every reference resolves in the document, or to a registry node that its home page defines in the same build.
4. Exactly one primary entity, matching the 08 §3 matrix.
5. NAP fields equal the site config byte for byte.
6. Every URL starts with the canonical origin and has no trailing slash.
7. Page-level URLs carry the right locale prefix (from P11).
8. Visible-parity fields appear in the rendered text and match the schema text.
9. BreadcrumbList positions run from 1 without gaps, and each `item` is a built route.
10. `#organization` and `#website` appear exactly once.
11. The golden fixture matches, or the diff is approved in the same pull request.

**Manual gate:** one URL per template through Google's Rich Results Test and the Schema Markup Validator, zero errors. The owner runs them on the deployed preview before launch; Search Console Enhancements are watched after launch.

## 5. Build order (P4; one file at a time, `verify:fast` after each)

1. `src/lib/site-config.ts` from the facts file (P0 creates `env.ts` and `url.ts`).
2. `src/lib/schema/types.ts`.
3. `src/components/seo/JsonLd.tsx`, with an escaping unit test.
4. Global generators `organization`, `website`, `logo`, then the sitewide block in the root layout. Check that it's output exactly once.
5. Page generators (`webPage`, `breadcrumbList`, `service`, `faqPage`, `howTo`, `itemList`, `offerCatalog`, `article`, `definedTermSet`, `person`).
6. `graph.ts` with `dedupeById()` and `assertResolvable()`.
7. Template assemblers, in the order of the matrix (Home first).
8. `scripts/check-schema.mjs` and the unit tests.
9. `docs/seo/schema-graph.md` and the golden fixtures.
10. The manual validators per template.

**Stop conditions:** any duplicate `@id`, dangling reference, NAP mismatch, parity failure or unanswered decision. Stop and report; never guess.

## 6. Anti-patterns this system prevents (from the brief and the reference audit)

| Anti-pattern | Prevented by |
|---|---|
| A nested layout re-injects sitewide nodes | One sitewide block in the root layout; assertion 10 |
| A locale-prefixed global `@id` that's never defined | Decision 2; assertion 3 |
| A hardcoded URL in a generator | `absoluteUrl()` only (C27); assertion 6 |
| A second schema module drifting from the first | One generator per type; golden fixtures |
| An external profile URL used as an `@id` | 08 §3 rule 4 |
| FAQ markup that differs from the visible text | Assertion 8 |
| A self-serving rating | 08 §3 rule 8 |
| Mixed `@id` conventions | Decision 5 |
| A made-up type ("PrivacyPolicy") | 08 §3 rule 8; types checked against schema.org in the unit tests |

## 7. Registry seed (becomes `docs/seo/schema-graph.md` in P4)

| `@id` | Type | Defined on | Referenced by |
|---|---|---|---|
| `{SITE_URL}/#organization` | ProfessionalService | every page (sitewide block) | every page, every Service `provider`, `#website` `publisher` |
| `{SITE_URL}/#website` | WebSite | every page (sitewide block) | every WebPage `isPartOf` |
| `{SITE_URL}/#logo` | ImageObject | every page (sitewide block) | `#organization` `logo` |
| `{SITE_URL}/services#catalog` | OfferCatalog | `/services` | `#organization` `hasOfferCatalog` |
| `{page URL}#service` | Service | its own page | `#catalog` offers, pillar ItemLists, industry ItemLists |
| `{SITE_URL}/#person-jamsheed-khalid` | Person | `/about` | `#organization` `founder`; article `author` once he is confirmed as an author |

## Allowed files
The P4 plan lists them when P4 starts; section 3 is the expected list. This plan changes no files itself.

## Risks & mitigations
- **Sitewide bytes on every page.** The organization block stays small because the catalogue lives on `/services`. It's measured in the P2 feasibility gate.
- **Wikidata IDs** are checked on wikidata.org, with the check date recorded in a code comment.
- **Validator drift:** Google changes rich-result support often, so we validate for correctness (08 §3 rule 14).

## Gates
`test`, `build`, `check:schema`, `check:seo`, SEO/GEO Auditor review, and the manual validators (03 §2).

## Open questions
1. The trade licence number (PENDING until the full licence; a variable until then).
2. The office map pin (for `geo`) and the Google Business Profile, both created once the full licence is issued (variables until then).
