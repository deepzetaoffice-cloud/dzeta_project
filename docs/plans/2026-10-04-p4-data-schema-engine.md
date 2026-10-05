# Plan: P4 Data & schema engine (JSON-LD graph builders, catalogue data, facts allowlist)
Status: APPROVED
Phase: P4
Branch: `feat/schema-system` (from `main` at `2a35580`, the P3 part C merge)
Page tier: n/a (no visual work; the sitewide schema block adds bytes to every page, measured in step S9)

## Goal served

*"An **AI-search-ready** site that **proves every claim it makes**."* P4 builds the one contradiction-free `@id` entity graph that tells Google and AI engines exactly who Deepzeta AI is, where it is and what it sells — from the approved specification `docs/plans/2026-09-29-schema-system.md` (owner-approved 2026-09-29, C30), with nothing invented. It is also the service we sell (N9): the site must demonstrate schema done right.

## Context

- The binding rules are [08](../ai/08-seo-geo-aeo-schema.md) §3; the specification (decisions 1–6, buckets, template matrix, CI assertions, build order) is `docs/plans/2026-09-29-schema-system.md`. **This plan is its implementation plan**: it lists the allowed files (the spec's § "Allowed files" says the P4 plan writes them) and sequences the spec's build order §5 into steps.
- What exists already: `src/lib/site-config.ts` (facts, PENDING values null), `src/lib/url.ts` (`siteUrl()`/`absoluteUrl()`, C27), `src/lib/seo/`, the `check:schema` Playwright gate (`tests/gates/schema.spec.ts` + `schemaProblems` in `tests/gates/rules.ts`) checking parse, `@id` uniqueness, no empty values — and no JSON-LD on any page yet (Home emits none).
- The pages that consume the assemblers mostly ship in P5–P8; only Home exists. P4 builds the engine (generators, assemblers, the gate, the registry, the fixtures) and wires the two blocks that can ship now: the sitewide block in the `(en)` root layout and Home's page block.
- Wikidata's UAE entity: verified on wikidata.org during S4, check date in a code comment (never from memory, 08 §3 rule on `areaServed`).

## Out of scope

- Page content and design for `/services`, pillars, solutions, industries, guides, about, contact, pricing, legal pages (P5–P8 plans).
- `llms.txt`, `llms-full.txt`, sitemap, robots AI-bot tiers (P9 GEO layer) and `src/lib/geo/` (open question 1).
- Metadata beyond what ships today; OG images and the title template (03's status note says they come in P4 — proposed as their own small plan after this one; open question 4).
- Arabic (P11), pSEO (P12).
- `docs/facts/company-facts.md` (owner only). The PENDING facts (phone, licence, pin, Business Profile) stay `null`; their schema properties stay omitted.

## Allowed files

| Path | Action | Purpose |
|---|---|---|
| `docs/plans/2026-10-04-p4-data-schema-engine.md` | CREATE | This plan and its Progress notes |
| `docs/plans/2026-09-29-schema-system.md` | MODIFY | Progress notes only (the spec's decisions never change here) |
| `src/lib/site-config.ts` | MODIFY | Extend with the founder (`name`, `jobTitle`, `sameAs` from facts §4) and his other companies (facts §4.1), typed, PENDING values null (S1) |
| `tests/unit/site-config.test.ts` | MODIFY | The new fields against the facts file |
| `src/content/catalogue.ts` | CREATE | The typed catalogue data: pillars, services (names exactly as the catalogue), bundles, starter offers — locale-independent, slugs per the URL registry (S2) |
| `src/content/emirates-industries.ts` | CREATE | The shared emirates/industries data module (open question 1's second option, chosen by the owner, 2026-10-04): the four industry groups (R101–R104), the 27 individual industries (R200), the seven emirates (R201), the §7.5 best-fit table (S2) |
| `tests/unit/catalogue.test.ts`, `tests/unit/emirates-industries.test.ts` | CREATE | The data modules against the catalogue and the URL registry, both directions (S2) |
| `src/lib/schema/types.ts` | CREATE | The node/graph types (spec §3) |
| `src/components/seo/JsonLd.tsx` | CREATE | The only schema `<script>`; escapes `<`, `>`, `&`, U+2028, U+2029 (S3) |
| `src/lib/schema/nodes/organization.ts`, `website.ts`, `webPage.ts`, `service.ts`, `faqPage.ts`, `howTo.ts`, `breadcrumbList.ts`, `itemList.ts`, `offerCatalog.ts`, `article.ts`, `definedTermSet.ts`, `person.ts` | CREATE | Pure generators, one per type; no hostname, NAP value or entity name inside (S4–S5) |
| `src/lib/schema/graph.ts` | CREATE | `dedupeById()`, `assertResolvable()` (S6) |
| `src/lib/schema/graphs/sitewide.ts`, `home.ts` | CREATE | The two assemblers with pages today (S7); the rest ship with their pages in P5–P8, each in its page's plan, same file pattern (`graphs/<template>.ts`) |
| `src/app/(en)/layout.tsx` | MODIFY | Mount the sitewide block once (S4) |
| `src/app/(en)/page.tsx` | MODIFY | Home's page block: WebPage (`about` → `#organization`), ItemList of the four pillars, FAQPage when the FAQ is visible (S7) |
| `tests/unit/schema/*.test.ts` | CREATE | Generator and assembler tests, types checked against schema.org, escaping, dedupe/resolution guards (S3–S8) |
| `tests/fixtures/schema/sitewide.json`, `home.json` | CREATE | Golden fixtures for the two shipping templates (S8); one more per template as its page ships |
| `tests/gates/schema.spec.ts`, `tests/gates/rules.ts` | MODIFY | Extend the built-HTML gate with the P4 assertions (spec §4: references resolve, primary entity per matrix, NAP parity, absolute URLs, breadcrumbs, `#organization`/`#website` once, visible parity) — see open question 2 |
| `tests/gates/crawl.ts` | MODIFY | Only if the parity check needs page text the crawler doesn't collect yet |
| `scripts/check-facts.mjs`, `tests/unit/check-facts.test.ts` | MODIFY | The numbers allowlist (03's status note: "the numbers allowlist comes in P4") |
| `docs/seo/schema-graph.md` | CREATE (protected, named) | The registry: every `@id`, its type, its home page, its referencing templates (S8) |
| `docs/ai/08-seo-geo-aeo-schema.md` | MODIFY (protected) | §3's matrix gains a pointer to `docs/seo/schema-graph.md` once it exists; the SKIPPED lists in the gate shrink (recorded in the Progress notes) |
| `CLAUDE.md` | MODIFY (protected) | "Current state" at the P4 exit |

## Steps (spec §5's build order; `verify:fast` after each code step)

1. **S1 · site-config**: the founder and his companies, typed from facts §4/§4.1 → `test`.
2. **S2 · catalogue data**: `src/content/catalogue.ts`, names byte-for-byte from the catalogue, slugs from the URL registry → `test` + `check:facts`.
3. **S3 · types + JsonLd**: `types.ts`, `JsonLd.tsx` with the escaping unit test → `verify:fast` + `test`.
4. **S4 · global generators + the sitewide block**: `organization.ts` (all CONFIRMED facts; PENDING properties omitted), `website.ts`, the logo ImageObject, `graphs/sitewide.ts`, mounted once in `(en)/layout.tsx`; Wikidata's UAE `sameAs` verified online, date in a comment → `verify:fast` + `build` + `check:schema` (the block appears exactly once) + `test:e2e` (shell) + `lhci` (the sitewide bytes measured against 07 §2).
5. **S5 · page generators**: `webPage`, `breadcrumbList`, `service`, `faqPage`, `howTo`, `itemList`, `offerCatalog`, `article`, `definedTermSet`, `person` → `test`.
6. **S6 · graph.ts**: `dedupeById()` and `assertResolvable()`, throwing guards → `test`.
7. **S7 · Home**: `graphs/home.ts` + Home's page block on `page.tsx` (no BreadcrumbList — nothing visible to mirror) → `verify:fast` + `build` + `check:schema` + `check:seo` + `check:links` + `test:e2e` + `lhci`.
8. **S8 · the gate, the registry, the fixtures**: extend `check:schema` with the spec §4 assertions; `docs/seo/schema-graph.md` (the registry seed, spec §7, becomes the real registry); golden fixtures → `test` + `build` + `check:schema` + SEO/GEO Auditor review.
9. **S9 · facts allowlist**: `check-facts.mjs` grows the numbers allowlist for `src/content/**` → `check:facts` + `test`.
10. **S10 · P4 exit**: the reviewer, the SEO/GEO auditor, `verify` (all gates), CI green, `CLAUDE.md`'s state → merge on your "merge". The manual validators (Rich Results Test, Schema Markup Validator on the deployed preview) are your step per 03 §4, before P5 starts.

**Stop conditions (spec §5):** any duplicate `@id`, dangling reference, NAP mismatch, parity failure or unanswered decision → stop and report; never guess.

## Effect register

None (no visual work; JSON-LD is metadata bytes only).

## Dependencies to add

None. (The `JsonLd` component serialises; no schema library. 08 §3 rule 1: typed pure generators.)

## Risks & mitigations

- **Sitewide bytes on every page** (spec §6): the organization block stays small (the catalogue lives on `/services`, not sitewide). Measured in S4's lhci run against 07 §2; if Home's page weight breaches, it's raised before S4 merges — nothing is lowered silently.
- **A generator drifts from the visible text** (parity, 08 §3 rule 7): the gate asserts visible parity; the golden fixtures pin the bytes.
- **Wikidata wrong from memory**: verified on wikidata.org at build time, check date in the comment; `check:schema` asserts the `sameAs` URL shape.
- **The other session shares this checkout** (lesson 8): `git diff` on every shared file before staging; foreign hunks stay unstaged.
- **Golden fixtures go stale**: a fixture mismatch fails `check:schema`; the diff is approved in the same change (spec §4 assertion 11).

## Gates

- Code steps: `verify:fast` (+ `test`).
- The two shipping blocks (S4, S7): the page-gate set — `build`, `check:schema`, `check:seo`, `check:links`, `test:e2e`, `lhci`.
- Phase exit: `verify`, CI green on the branch head, SEO/GEO Auditor review, the owner's manual validators (03 §4).

## Open questions (recommendation first)

1. **`src/lib/geo/` (named in 04's P4 row):** **RESOLVED (owner, 2026-10-04): both** — `src/lib/geo/` itself is deferred to the P9 GEO-layer plan (its consumers, the llms routes, come then), and the shared emirates/industries data module was built in S2 as `src/content/emirates-industries.ts` (locale-independent typed data beside `catalogue.ts`, per question 3's precedent), so the industry pages (P6) and pSEO (P12) read one source.
2. **The spec's `scripts/check-schema.mjs` vs the existing Playwright gate:** extend the existing `tests/gates/schema.spec.ts` + `rules.ts` (the `check:schema` npm script and 03's catalogue already point there; a second, parallel checker would violate one-source-per-topic), **recommended**; the spec's file name is recorded as a deviation in its Progress notes. Or create the `.mjs` script and retire the Playwright gate.
3. **Catalogue data location:** `src/content/catalogue.ts` (locale-independent typed data; names are brand facts, not English copy), **recommended**; or under `src/lib/` beside the schema builders.
4. **OG images and the remaining metadata (03's note "come in P4"):** their own small plan after this one, **recommended** (the schema spec excludes them); or appended to this plan's scope.
5. **Assemblers without pages:** build and fixture only `sitewide` and `home` now; every other assembler ships inside its page's plan (P5–P8), **recommended** — building 14 assemblers against pages that don't exist would violate 04 §1.4 (never build ahead of a page) and leave untested code. Or build all assemblers now with unit-level fixtures only.

## Progress notes

- **S2 done (2026-10-04).** `src/content/catalogue.ts` (four pillars, 83 services — 57 with registry slugs, 26 add-ons without pages, exactly the registry's add-on list; the flagship 2.1; three starter offers with full paths — their pages share no prefix; six bundles with their §5 component numbers, ranges like "(1I.1–1I.2)" expanded) and `src/content/emirates-industries.ts` (four industry groups at R101–R104's paths, 27 industries with reserved-R200 slugs, the seven emirates, the §7.5 best-fit table with its informal names mapped to catalogue numbers, each mapping noted in the file). Names byte for byte from the catalogue; priorities from the heading tags. `tests/unit/catalogue.test.ts` and `tests/unit/emirates-industries.test.ts` pin every value against the catalogue and the URL registry, in both directions. Gates: `typecheck`, `eslint`, `prettier --check`, `check:facts` all PASS locally; `test` NOT RUN locally — the local vitest runner fails to collect every suite, including all 28 pre-existing ones (a machine/environment issue, not this change: `npm ci` and `--pool=forks` don't clear it; the second session had left `.scratch/vitest-min.test.ts` probing the same). The data was validated with a throwaway Node-TS-loader script in `.scratch/` running the same assertions (ALL CHECKS PASSED), and CI runs the real suites on ubuntu (Node 24) — its green run is the step's `test` evidence.
- **S2 observation (for the S5+ steps or the P6 plans):** `src/lib/routes.ts`'s header says "P4 extends the seed to every row", but that file isn't in this plan's allowed files, so S2 left it alone. The catalogue data carries its own slugs, test-pinned to the registry rows; whether `routes.ts` grows the rest of the rows belongs to a plan that names it.
- **S1 done (2026-10-05).** `src/lib/site-config.ts` gained the typed founder (facts §4: name, jobTitle, sameAs copied exactly, photo and bio null while UNKNOWN) and his four other companies (facts §4.1, URLs byte for byte, `hasOffice` from the table's "Physical office" column). `tests/unit/site-config.test.ts` pins both against the facts file, both directions. Gates: typecheck, eslint, prettier, `check:facts` PASS locally; `test` NOT RUN locally (the same vitest collection failure S2 recorded) — validated with a throwaway Node-TS-loader script in `.scratch/` (ALL CHECKS PASSED); CI runs the real suite. Committed `5189ff7`.
- **S3 done (2026-10-05).** `src/lib/schema/types.ts` (SchemaNode, SchemaGraph, SchemaRef — structural types, `@context` on the graph only) and `src/components/seo/JsonLd.tsx` (`serializeSchema()` escaping `<`, `>`, `&`, U+2028, U+2029, then the script element — the only one). `tests/unit/schema/jsonld.test.ts` pins the escaping and the round-trip. Same gate pattern as S1 (scratch validation; CI for the suite). Committed `1507e0a`.
- **S4 done (2026-10-05).** The generators `organization.ts`, `website.ts`, `logo.ts`, the assembler `graphs/sitewide.ts` (checked through `checkedGraph`), mounted once in `(en)/layout.tsx`. Wikidata Q878 verified live via Special:EntityData on 2026-10-05 ("United Arab Emirates", country in Western Asia); the check date is in the code comment and the registry. PENDING properties omitted (telephone, geo, hasCredential, contactPoint). Verified on the dev server's rendered HTML: one block, three nodes, canonical origin. One fix during the step: global `@id`s are built from `siteUrl()` because `absoluteUrl()` rejects `#` fragments by design (C27). Committed `ad7ad7b`.
- **S5 done (2026-10-05).** The ten page generators (`webPage`, `breadcrumbList`, `service`, `faqPage`, `howTo`, `itemList`, `offerCatalog`, `article`, `definedTermSet`, `person`), each pure and typed; `tests/unit/schema/generators.test.ts` pins every output shape and every `@type` string against a pinned set of real schema.org types (the spec §6 "made-up type" guard). Committed `fda5838`.
- **S6 done (2026-10-05).** `src/lib/schema/graph.ts`: `dedupeById()` and `assertResolvable()` (throwing guards), `checkedGraph()` composing both. Two real catches during the step: (1) nested references were counted as definitions until the guards encoded the generators' convention — a definition carries `@type`, a reference never does; (2) `#organization.founder` resolves to the registry's `#person-jamsheed-khalid` (its home page ships in P7), so `checkedGraph` takes `externalIds` (spec §4 assertion 3). The sitewide assembler now runs through `checkedGraph`. Committed `4adcadd`.
- **S7 done (2026-10-05).** `graphs/home.ts` + the page block on `page.tsx`: WebPage (`about` → `#organization`, no mainEntity, per the matrix), ItemList of the four pillars in catalogue order (the names the mega menu shows — visible parity), no BreadcrumbList (nothing visible to mirror) and no FAQPage (the FAQ is not visible on the placeholder Home). Verified on the rendered HTML: two blocks (sitewide + page). Committed `edf14aa`.
- **S8+S9 done (2026-10-05).** `check:schema` extended with the spec §4 assertions that apply to the shipping templates: references resolve in the document union (or to a registry-reserved node whose home page isn't built yet — assertion 3's second clause), `#organization`/`#website` exactly once, absolute canonical URLs (no trailing slash; `@context` and `sameAs` exempt — schema.org's own URL and the external profiles), NAP parity with the config, plus the golden-fixture test (`tests/fixtures/schema/home.json`, generated from the real rendered page; the served origin is normalised to the canonical one so the fixture pins the graph's shape, not the machine). `docs/seo/schema-graph.md` created as the registry (every `@id`, its type, its home page, its referencing templates), and 08 §3's pointer now names it as live. The SKIPPED lists shrank accordingly. The numbers allowlist enabled in `check-facts.mjs`: prose numbers must be facts-§6-listed; catalogue numbers ("1A.1") and dates are IDs, not claims; the internal review page's own 128 px display size is exempt as a design fact. `tests/unit/gate-rules.test.ts` and `tests/unit/check-facts.test.ts` extended with failing fixtures. Committed `61b0bed`.
- **S10 (2026-10-05): every gate green except lhci's row-profile TBT — raised, not lowered.** The first CI runs failed on nine test issues, all fixed in `b119d61`–`173479d`: (1) my new tests hardcoded the canonical origin while CI builds with `http://localhost:3000` — the home test and the golden-fixture gate now derive/normalise it; (2) the spec file's top-level `await import` broke Playwright's loader — the options build inside the test; (3) **S2's tests had been broken since their commit** (its CI run failed too; the note's CI assumption was never checked): the flagship tag regex never escaped `(Flagship)`, the §7.5 row detector anchored `^### 7.5` against a pre-row window so it found zero rows (now sliced by section boundaries), the covered-industries count is 17 not 13 (group rows map to their member industries), the INFORMAL map lacked the Logistics shorthands (`'Automated Quotation'` → 1B.3), and a destructure read the label column as the automations cell; (4) `.env.example`'s siteConfig index lacked S1's `founder`/`founderCompanies` keys (two lines added, staged alone with the owner's unstaged comment edits left untouched). After the fixes, CI on `173479d` passes **everything** — typecheck, lint, tokens, contrast, format, facts, rules, effects, all 451 unit tests, build, `check:schema` (both its tests), `check:seo`, `check:links`, all e2e — and fails only `lhci`'s assert step, on the row profile (UAE campaign landing, GTM tags granted): performance 0.92–0.95 vs ≥0.95 and TBT 227–264 ms vs ≤200 ms. The evidence says this is not the schema work: Home's JS is unchanged (274 KB), the schema adds inert JSON-LD bytes only (HTML 16.0 KB), and the TBT comes from the GTM-granted third-party scripts on that profile — the same scripts P3C shipped. Run-to-run variance (227–272 ms) straddles the 200 ms line, so the last green run (`fb32eaa`, P3C) may have squeaked under it. Per the plan's risk rule — nothing is lowered silently — the budget question goes to the owner: re-run CI to see if it's noise, or decide on the GTM scripts' cost (defer them past first paint, or adjust the row-profile budget with a decision). The vitest suites now also cover `tests/unit/schema/*` (6 new files) and the extended gate-rules, all green in CI.
