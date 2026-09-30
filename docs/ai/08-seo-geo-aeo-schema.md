# 08 · SEO, GEO, AEO & Structured Data

> **Applies to:** every page, metadata, content structure, schema, robots, sitemap, llms files · **Precedence:** below 00 · **Last reviewed:** 2026-09-30

SEO, GEO (AI engines) and AEO (answer engines) are services Deepzeta AI sells. The site must demonstrate them. Every rule here that can be checked by a machine is a gate ([03](03-verification-gates.md)): `check:seo`, `check:schema`, `check:links`.

---

## 1. Metadata (every page)

| Item | Rule |
|---|---|
| Title | Unique, primary topic first. The **full rendered title, including the brand suffix, is 50–60 characters**. The suffix ` \| {brand name}` (today ` \| Deepzeta AI`, read from the site config) is added **once**, by the root title template only; page titles never include the brand. An over-length title fails `check:seo` and is rewritten by a person, never truncated in code. |
| Description | Unique, 140–160 characters, key point in the first 120, one concrete fact, ends with an action. Out-of-range lengths fail `check:seo`. |
| Canonical | Self-referencing absolute URL, set **by each page, never in a layout** (a layout canonical leaks the home URL onto any page that forgets its own). Built with `siteUrl()` / `absoluteUrl()` from `NEXT_PUBLIC_SITE_URL`, validated in `src/lib/env.ts`. No hostname literal anywhere in code (C27). |
| Open Graph | title, description, url, a 1200×630 image that returns 200 (`check:seo`), `og:locale` from the locale constant, `og:type` (`website`/`article`) |
| Twitter | `summary_large_image` |
| Robots | Index/follow for public pages; `noindex` for thank-you, drafts, utility pages, Designer Studio concept routes (`/studio/<slug>`) and tool result views; `/api/` disallowed. Every non-production deployment (`VERCEL_ENV` ≠ `production`) also sends `X-Robots-Tag: noindex` and serves a disallow-all `robots.txt`. **Production before launch** also sends `X-Robots-Tag: noindex` until the owner sets `SITE_INDEXING=on` (the pre-launch lock, [decision 0013](../decisions/0013-pre-launch-indexing-lock.md)). Its `robots.txt` is the launch file, so crawlers can read the `noindex` (Google ignores a `noindex` it can't fetch). |
| Alternates (after Arabic, P11) | hreflang with **language-only** codes `en` and `ar`, plus `x-default` → English, so the whole GCC is covered rather than one country. Built by one locale-aware builder; reciprocity is tested. |
| Never | the `keywords` meta tag; hand-written `<head>` tags (06 §2.2) |

---

## 2. Content structure (AEO + GEO)

These are the core rules. The full content system lives in the [SEO/GEO Domination Engine](../seo/seo-geo-domination-engine.md): page-type blueprints, content modules, word ranges, FAQ, the linking budgets and the conversion ladder, E-E-A-T, and pSEO. Every URL lives in the [URL registry](../seo/url-registry.md).

1. **One H1 per page**, plain language, containing the primary topic. Heading levels never skip.
2. **Direct answer first:** the first 2–3 sentences answer the page's main question and make sense quoted alone.
3. Each H2 section opens with a 40–75-word answer to that section's question.
4. **Entity-first writing:** name things explicitly (service names from the catalogue; tools like n8n, Make, Zapier, OpenAI, Anthropic, HubSpot, Zoho by name). Avoid ambiguous "it/they/the platform".
5. **One quotable, sourced fact every ~150–200 words, where a relevant real fact exists; never pad.** Only real, sourced or owner-confirmed numbers (see [02](02-anti-hallucination-and-edit-safety.md) §1). External facts come only from APPROVED rows in the [citation register](../facts/external-sources.md).
6. **HTML tables** for comparisons, pricing, process and capabilities.
7. **FAQ blocks** with real buyer questions (cost, timeline, data safety, Arabic support). Visible text and schema text match **word for word**.
8. **E-E-A-T:**
   - real authors with credentials (owner-provided); Jamsheed Khalid is the byline author of guides
   - a visible "Last updated" (= `dateModified`, the content changed)
   - "Reviewed by … · date" only after a recorded review (= `lastReviewed` / `reviewedBy`)
   - outbound links to official docs, never to competitors' sales pages
   - details in engine §7
9. **Internal links:** every page links to its hub and 3+ relevant pages, with descriptive anchors (never "click here", "learn more", "read more"). Nav and footer hrefs equal canonical URLs. Link budgets per page type, the conversion ladder and the checks are in engine §5.
10. **URLs:** lowercase kebab-case, no trailing slash, no query parameters for content, stable once published (changes need a 301 in the same plan).
11. **Animated explainers** ([13](13-experience-design.md) §4.8) always show their steps as visible HTML. The animation never replaces the text, so HowTo stays valid (C11).

---

## 3. Structured data: one connected `@id` graph

Schema is an **entity-clarity layer, not a ranking factor**, and AI engines read the visible HTML first. Visible parity (rule 7) therefore matters more than adding types. The full specification (decisions, registry, tests, build order) is in `docs/plans/2026-09-29-schema-system.md`; the rules below are binding.

**Graph law**
1. **Generators only.** JSON-LD comes from typed, pure generators in `src/lib/schema/` (one function per type), composed by one assembler per page template. Never hand-written in a page or component. Values come only from content files and the site config (`src/lib/site-config.ts`, built from the facts file). Generators contain no hostname, NAP value or entity name.
2. **Two blocks per page, one graph.**
   - The root layout renders the **sitewide block** (`#organization`, `#website`), once, from one shared builder that takes `locale`.
   - Each page renders **one page block** (its WebPage and supporting nodes).
   - Each block is one `@graph` with `@context` once. Nested layouts and pages never re-emit sitewide nodes.
   - Why two: a layout can't read the pathname without forcing dynamic rendering, so page nodes belong to the page.
3. **One primary entity per page**, as in the matrix below. Every other node supports it and is `@id`-linked. Never two overlapping primaries (FAQPage + QAPage, Product + Service).
4. **One `@id` convention everywhere:**

   | Node | `@id` |
   |---|---|
   | Organization | `{SITE_URL}/#organization` |
   | WebSite | `{SITE_URL}/#website` |
   | Logo | `{SITE_URL}/#logo` |
   | Person | `{SITE_URL}/#person-{slug}` |
   | Page (WebPage and its subtypes) | the page's absolute canonical URL |
   | Nodes that belong to a page | `{page URL}#service`, `#faq`, `#howto`, `#breadcrumb`, `#article`, `#itemlist`, `#catalog` |

   External profile URLs are never `@id`s; they go in `sameAs`.
5. **Defined once, referenced many times.** Each `@id` is defined at most once per document.
   - A reference resolves in the same document, or to a node listed in the schema registry (`docs/seo/schema-graph.md`, created in P4) that its home page defines in the same build. `check:schema` verifies both.
   - Pages point to entities; entities don't point back to pages. The one exception is `#organization` → `hasOfferCatalog` → `{SITE_URL}/services#catalog`.
6. **One entity across locales.** `#organization` and `#website` are the same bytes in every locale's documents and contain no language-specific prose. Locale text lives on page nodes. Page-level `@id`s carry the locale through the page URL (`/ar/…`). A locale-prefixed global `@id` (`/ar/#organization`) is never used.
7. **Visible parity.** Schema text equals the visible text, word for word, for:
   - FAQ questions and answers
   - HowTo steps
   - breadcrumb labels (a BreadcrumbList is emitted only where a visible breadcrumb trail is rendered)
   - author name and role
   - `dateModified`, which equals the visible "Last updated"
   - prices, NAP and opening hours

   Nothing that isn't visible is marked up.
8. **Never invent data.** A missing value means the property is omitted. **Banned:**
   - `AggregateRating` / `Review` for our own services, unless they are real third-party reviews shown on the page and meeting Google's policy
   - `SearchAction` (there is no site search)
   - `QAPage` or vote/answer counts on our own content
   - `speakable`
   - `Dataset` and `estimatedCost` until real data exists
   - `award` and `numberOfEmployees` unless CONFIRMED in the facts file
   - types that don't exist in schema.org (for example "PrivacyPolicy")
9. **Deterministic dates** from content metadata; never `new Date()`, never git dates. `dateModified` changes only when the content really changes. `lastReviewed` and `reviewedBy` are emitted only after a recorded review.
10. **Safe serialisation.** One `<JsonLd>` server component is the only place a schema script is rendered. It escapes `<`, `>`, `&`, U+2028 and U+2029. Server-rendered only; no client-only schema.
11. **NAP** (name, address, phone) comes from the facts file through the site config, and is byte-for-byte identical in schema, footer, contact page and Google Business Profile.
12. **Guards in development:** the assembler throws when two nodes share an `@id` with different content, and when a reference doesn't resolve.
13. **Change control:** adding or changing a type updates, in the same pull request, the matrix below, its test and the registry.
14. **Validate for correctness**, not rich-result eligibility. Google now shows FAQ rich results only for a narrow set of sites and has retired HowTo rich results, but AI engines still parse these types. Before launch, one URL per template passes Google's Rich Results Test and the Schema Markup Validator with zero errors.
15. **Fictional businesses never get schema.** Designer Studio concepts carry no Organization, LocalBusiness or other business nodes (decision 0008, C18).
16. **AI View** (`docs/design/header.md`) reads the page's own JSON-LD and fetches `llms.txt` when opened. It never server-renders a second copy of indexable text.

**The sitewide entity (`#organization`)**
- **One node** with `@type` `ProfessionalService` (a LocalBusiness subtype, so it describes both the company and the office). It carries:
  - `name` (the brand) and `legalName`
  - `url`, `logo` → `#logo`, `email`
  - `telephone`, only once it is CONFIRMED
  - `address` (PostalAddress, `addressCountry` `AE`) and `geo`, only once it is CONFIRMED
  - `openingHoursSpecification`, `foundingDate`
  - `founder` → `{SITE_URL}/#person-jamsheed-khalid` (the Person node's home page is `/about/jamsheed-khalid`; a registered reference, rule 5)
  - `hasCredential` (the DET trade licence), only once the licence number is set
  - `areaServed`: `Country` nodes, each with a Wikidata `sameAs` verified on wikidata.org at build time (never from memory). The UAE now; GCC countries when the owner confirms them.
  - `sameAs`: exactly the profiles in the facts file §2.1, nothing more (the Google Business Profile joins §2.1 when it exists)
  - `contactPoint`: only once a public phone is CONFIRMED
  - `hasOfferCatalog` → `{SITE_URL}/services#catalog`
- **`#catalog`** is defined on the services hub only (not sitewide, to keep every page light). It is an `OfferCatalog` whose `Offer`s point to each service's `#service` node, without prices unless real published prices exist.
- **`#website`:** `name`, `url`, `publisher` → `#organization`, `inLanguage`.
- **Relationship validator (build time):** every catalogue link (service ↔ pillar ↔ bundle ↔ industry ↔ FAQ) resolves to real content, or the build fails.

**Schema stack by page type** (the primary entity comes first)

| Page type | Stack |
|---|---|
| Home | **WebPage** (`about` → `#organization`), ItemList of the four pillars, FAQPage (the FAQ is visible). No BreadcrumbList. |
| Services hub | **CollectionPage**, ItemList, OfferCatalog `#catalog`, BreadcrumbList |
| Pillar page (includes Automation, `/services/ai-automation`) | **Service** (the pillar), WebPage, ItemList of its services, BreadcrumbList, FAQPage / HowTo when visible |
| Service or solution page (solutions are the catalogue's bundles) | **Service** (`provider` → `#organization`, `areaServed`), WebPage (`mainEntity` → `#service`), BreadcrumbList, FAQPage / HowTo when visible |
| Book an audit | **Service** (Free AI Automation Audit, with an `Offer` at price 0 AED), WebPage, BreadcrumbList |
| Industry | **CollectionPage** + ItemList of services, FAQPage, BreadcrumbList |
| Case study | **Article** (`about` → the service), BreadcrumbList; only owner-confirmed results |
| Guide or blog post | **Article** / BlogPosting (`author` → a Person, or `#organization` until authors are confirmed), BreadcrumbList |
| Comparison | **WebPage** + ItemList, FAQPage when visible, BreadcrumbList |
| Glossary | **DefinedTermSet** + DefinedTerm, BreadcrumbList |
| Pricing | **WebPage** + OfferCatalog (only real published prices), FAQPage, BreadcrumbList |
| About | **AboutPage** (`mainEntity` → `#organization`), BreadcrumbList, and Person nodes for CONFIRMED people only. <br>• The founder's node (`#person-jamsheed-khalid`) has `name`, `jobTitle`, `worksFor` → `#organization`, and `sameAs` with his profile URLs from facts §4. It gets `image` only once a photo is confirmed. <br>• Each of his other companies named in the visible bio (facts §4.1) is an Organization node without an `@id`, with `name`, `url` and `founder` → the Person. |
| Founder profile (`/about/jamsheed-khalid`) | **ProfilePage** (`mainEntity` → `#person-jamsheed-khalid`, his home page), BreadcrumbList |
| Contact | **ContactPage** (`mainEntity` → `#organization`), BreadcrumbList |
| Hubs: `/solutions`, `/industries`, `/resources`, `/work` | **CollectionPage** + ItemList of the children, BreadcrumbList |
| Privacy policy, terms, editorial policy | **WebPage**, BreadcrumbList, FAQPage when visible |
| Designer Studio index, Deepzeta Sync (the tools hub, `/tools`), App demo | OPEN: decided in each page's plan with the SEO / GEO Auditor |
| Studio concept routes, tool result views, thank-you, 404 | None (`noindex`) |

---

## 4. `llms.txt` and `llms-full.txt`

What the files say (their structure and what's included) is in engine §9. **Google Search doesn't use llms.txt** ([Google, 2026](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)). The files serve AI assistants and agents; they're not a Google ranking lever.

- **Two route handlers:**
  - `/llms.txt`, an index: an H1 with the entity name, a factual summary blockquote, and links grouped by section.
  - `/llms-full.txt`: the full plain-text knowledge base, built from the same content files.
- **Delivery:** `Content-Type: text/plain; charset=utf-8`, `force-static`, with an explicit `Cache-Control` header.
- **Generated** from content data, never hand-maintained. New content types are **appended**.
- Studio concept routes and tool result views are **excluded**.
- **No pronoun-to-entity replacement.** Content is written entity-first at the source (§2.4), and the builders copy text unchanged. Automated rewriting corrupts sentences.

---

## 5. Robots and AI bots (`src/app/robots.ts`)

| Tier | Bots (verify the current list at build time) | Access |
|---|---|---|
| Search engines | `*` (Googlebot, Bingbot…) | Allow `/`, disallow `/api/` |
| AI live search / user fetch | OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User | Full HTML, disallow `/api/` |
| AI training | GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, Bytespider, Meta-ExternalAgent | Full HTML, disallow `/api/` ([decision 0010](../decisions/0010-ai-training-crawlers-allowed.md); the owner can change any bot by a new decision) |

- **Never** disallow `/_next/` (breaks rendering for Google) or OG image routes.
- Bot names change. Check each vendor's official documentation before editing this list, and record the check date in a comment.
- `robots.ts` is **protected** once built: edits need a plan that names it. A unit test asserts the tier table, because the reference project once overwrote its bot tiers by accident.
- Non-production deployments serve a disallow-all file (§1).

---

## 6. Sitemap

- One `src/app/sitemap.ts`, generated from content data, with real `lastModified` values from content metadata.
- No `priority` or `changefreq` (Google ignores them).
- `check:seo` asserts that the sitemap's URLs equal the set of indexable built routes. Studio concept routes, tool result views and every other `noindex` route are excluded.
- After launch, each entry gets `alternates.languages` for its Arabic partner (§1).
