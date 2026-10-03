# Plan: P3 part C: the IDs, the conversions, Microsoft UET and the generated container
Status: APPROVED (owner, 2026-10-02): "approve with all 7 recommendations; start C1a–C1e now (the reference export can wait)"
Progress:
- 2026-10-02 · Approved, with every recommendation of the seven open questions: Q1 UET Basic consent mode; Q2 keep B7; Q3 the §6 wording as proposed; Q4 the handoff and the account register stay out of the repo while it's public; Q5 the retired-Meta-IDs guard (hashes only) is wanted; Q6 the owner's own visits stay counted; Q7 the other session's register line stays with that session.
  - The handoff file `docs/owner/deepzeta-tracking-part-a-handoff.md` stays untracked (Q4). The other session's uncommitted files (`docs/design/app-demo.md`, `docs/owner/pre-launch-register.md`, `docs/plans/2026-09-29-design-direction-v2.md`, the Planning Folder files) are left untouched (Q7).
  - **C1a–C1e start now.** Step C1 (the owner's reference export, guide A8) stays pending; nothing in C1a–C1e needs it.
- 2026-10-02 · **C1a (the guide, the register, 0004) is done.**
  - The guide: §1's table gained your-answer columns (all nine items, from the handoff §1–§2); question 9's table rewritten (`contact_click` primary, `book_call_click` dropped with the C59 note, finding 5's caveat beside it); A3.11 rewritten ("it changes", the IP rule Not needed, why B7 stays); **A8 gained two UET rows** (the base tag and a Custom event, both requiring `ad_storage`, sequenced); B2 gained steps 5 (the UET Tag Helper: no request before Accept, `asc` granted after) and 6 (keep Clarity off); B7 gained its reason (previews, CI, local tests; your own visits still count); B8 retitled "Meta, Microsoft, LinkedIn and Google Ads" with Microsoft's goal steps and the postponed wording for the other two.
  - The register: Part A ticked ☑ with the four IDs; question 9's row updated with the changed conversions; new rows for the Vercel GTM variable (C5), LinkedIn and Google Ads postponed, the Microsoft payment method, the UET "Verified" check, the confirmed Cal.com booking, the GA4 stream label, the `@deepzeta.ai` admins and the Business Profile link; the Internal Traffic row's reason now names previews, CI and local tests; the change log has the row. The other session's C58 line stayed out (stashed during the commit; Q7).
  - 0004's tracking row: Microsoft Advertising (UET) at launch; Google Ads and LinkedIn after launch; `@next/third-parties` gone (it was already replaced by C56's loader, but the row still named it "until P3").
- 2026-10-02 · **C1b (the code) is done.**
  - `accounts.ts`: the three IDs (`G-RTLSJW7Q9W`, `2290203821825563`, `187278109`), the new `microsoftUetTagId` field with its `ACCOUNT_FORMATS` shape (digits, 6–12).
  - `vendors.ts`: the `microsoft` vendor (group marketing; `https://bat.bing.com` for script, img and connect — the host of the official tag code; `bat.bing.net` left out, finding 11; withdraw `_uetsid`, `_uetvid`, `_uetsid_exp`, `_uetvid_exp` from the consent FAQ). **No `cookies` list**, so its cookies stay hidden in Cookie settings until an official source gives lifetimes (finding 12; the plan's §3 said to list them as `approved: false`, but `VendorCookie` requires a `lifetimeMonths` and Microsoft publishes none — inventing one would break the no-invented-facts rule; hidden is exactly what `approved: false` achieves).
  - `taxonomy.ts`: `book_call_click` `retired: '2026-10-02, the owner: never sent'` (no key event, no vendor mapping); `contact_click` `keyEvent: 'primary'` with `microsoft: true`; `generate_lead` `microsoft: true`; the `retired?: string` field on `EventDetails`; `ActiveEventName` (derived: every name except retired ones) and `isRetired()`.
  - `analytics.ts`: `trackEvent()` is typed on `ActiveEventName`; `eventPayload()` refuses a retired name at run time like an unknown one ("isn't an active event").
  - Tests: `taxonomy.test.ts` (the changed key events, the retirement's guarantees, the Microsoft mappings, `microsoftUetTagId`'s format and the sent IDs); `analytics.test.ts` (the retired event refused in the types and at run time); `security-headers.test.ts` (`microsoftUetTagId` in the fixtures, `https://bat.bing.com` allowed, `bat.bing.net` never).
  - Gates: `verify:fast` exit 0; `test` 354 passed; `build` exit 0; `test:e2e` 171 passed.
  - **A local toolchain finding:** `vitest run` (the forks pool) fails on this machine with "Cannot read properties of undefined (reading 'config')" in every suite, including a trivial scratch test — the failure exists at HEAD too, before any C1b edit, and survives `npm ci`. `--pool=vmThreads` runs the whole suite green (354 passed), so all unit-test gates in this plan run with `npx vitest run --pool=vmThreads`. CI (Linux, Node 24) is unaffected: its last run passed with the default pool. To be raised with the owner as a watch item (likely the space in the project path or a Node 24.19 fork-pool regression); not fixed here, because the vitest config is outside this plan's allowed files.
  - **The e2e run needs `NEXT_PUBLIC_SITE_URL` and `SITE_INDEXING=on` in the shell** (CI sets them): without `SITE_INDEXING=on` at build time the served `X-Robots-Tag` is `noindex` and foundation's noindex test fails. Set in the shell, both build and e2e pass.
- 2026-10-02 · **C1c (the settings index) is done.**
  - `.env.example` ends with the block **"Not env variables: where the other settings live"**: every `accounts` field by name (with set/postponed marked), every `siteConfig` key by name, one per line, names only, never values.
  - `tests/unit/env-example.test.ts` (new): (a) every `process.env.X` read in `src/` (minus tests), `next.config.ts` and `scripts/` is listed in `.env.example`, except `NODE_ENV` and `VERCEL_*`; (b) planned-but-unread variables (Turnstile, the webhook, Upstash, DeepSeek, PageSpeed) stay listed — the owner's rule is "nothing lost", not "nothing ahead of its phase"; (c) the closing block names every accounts and siteConfig key, and nothing else; (d) every listed variable stays empty in the file.
  - `scripts/check-facts.mjs` gained the retyped-facts check: a contact fact from the site config (email, address, phone and WhatsApp once set, each social URL — 11 facts today) typed literally in `src/` or `scripts/` outside `site-config.ts` (and its test) fails the gate. The config is imported through Node's TypeScript loader, so the check reads the shipped values, not a copy. `check-facts.test.ts` covers the collection and the finding (4 cases).
  - Gates: `check:facts` passed ("73 scanned files, 11 contact facts, none retyped"); `test` 360 passed (26 suites). Node prints a `MODULE_TYPELESS_PACKAGE_JSON` warning while importing the config (the package is typeless by Next.js convention); harmless, same as `next.config.ts`.
- 2026-10-02 · **C1d (the protected docs) is done.**
  - **09:** §1's diagram gains Microsoft Advertising (UET) and marks LinkedIn "after launch"; rule 2.4 gains the retirement sentence (C59); §2.7 gains the UET Basic-consent bullet (C60, with Inherit initial consent); §3's source line names the Meta, Microsoft and LinkedIn mapping; §3.5 rewritten (`generate_lead` and `contact_click` primary, `book_call_click` retired).
  - **C59 and C60 appended** to the conflict register, both Resolved by the owner's part C approval.
  - **conversion-path.md line 60:** `book_call_click` out of the booking flow's events, with the C59 note.
  - **external-sources.md:** PROPOSED rows S008 (UET's `bat.bing.com` host), S009 (UET's four first-party cookies, lifetimes unstated), S010 (GA4's `_ga` cookies, 24 months) and S011 (Meta's `_fbp`/`_fbc`); the change log has the row. They await the owner's approval one by one, as the register's rules say.
  - Gates: `check:rules` passed (18 entry files).
- 2026-10-02 · **C1e (the wording, §6 as approved with the plan) is done.**
  - `src/content/en/legal/consent.ts`: `settings.marketing.body` now reads "Measure whether our ads on Meta and Microsoft Bing bring people here, and show our ads to people who've visited us."
  - privacy-policy.md: Table C's ad-networks row and Table D's Marketing row name **Meta and Microsoft Advertising**; FAQ Q4 ends "…Cal.com (booking), Meta (WhatsApp and ad measurement) and Microsoft (ad measurement)." (44 words, over the floor); the "differs" row and Part 3 note 2 say "Meta now; LinkedIn and Google offline import when they start"; the status line records the change and the rule that a returning platform's name comes back with its container change.
  - consent-copy.md: `settings.marketing.body` matches the string exactly; §5's server-side conversions line says "Meta now; LinkedIn and Google offline import when they start".
  - Gates: `test` 360 passed; `check:rules` passed.
  - **C1a–C1e complete.** Next: C1 (the owner's reference export, guide A8) → C2 the generator. The branch holds `a184b17`, `52bbfac`, `1f67dda`, `5910f1e` and this commit on top of C0.
- 2026-10-02 · **C1 (the reference export) is done:** `docs/owner/GTM-5WZ3ZJ7V_workspace2.json`, verified against guide A8 — all shapes present (googtag, gaawe, html, baut; the consent and sequencing shapes; DLV/Constant/Lookup variables; the Custom Event and Window Loaded triggers), test IDs only. Committed as `tests/fixtures/gtm/reference-export.json`. **Two owner notes carried into C2:** the UET event-tag template has no Tag ID field (only the config tag holds it — the generator omits `tagId` on event tags and puts `187278109` on the base alone), and `UET - test` has auto SPA page tracking ON by default (kept ON in the real container: the site's `page_view` feeds GA4 only, UET produces its own exactly-one page view per page, and no UET tag is ever wired to `page_view`, so nothing doubles — a parity test enforces it).
- 2026-10-02 · **C2 (the generator and the four files) is done.**
  - `scripts/build-tracking.mjs` (`npm run tracking:build`): reads `accounts.ts` and `taxonomy.ts` through Node's loader (the `check-facts.mjs` pattern); every shape from the reference fixture; deterministic (fixed IDs and order, no timestamps). `--test` writes to `.scratch/tracking-test/` (gitignored, deleted after use), so a B0 test build can never clobber the committed files.
  - The container: **23 tags, 19 triggers, 23 variables, 5 built-ins** — the Google tag and the page-view pair (update + GA4 Event, Google's single-page-site method), one GA4 Event tag per event, Meta's Custom HTML base + `Lead`/`Contact`, UET base + `generate_lead`/`contact_click` (no Tag ID on the event tags; auto SPA on; Inherit initial consent on), one Custom Event trigger per active event, the two after-Accept triggers, `WL - production` for the marketing tags, the `traffic_type` lookup (apex + www → `public`, else `internal`). `book_call_click`: no trigger, no tag (C59). LinkedIn and Google Ads: nothing (IDs null).
  - `ga4-setup.md` (13 custom dimensions, 2 key events), `ads-conversions.md` (Meta + Microsoft rows, the finding-5 caveat), `taxonomy.md` (the human table).
  - Tests: `tracking-artifacts.test.ts` (12: committed = fresh generation; taxonomy parity; parameters and references resolve; consent settings on every tag; no `jsm`; vendor↔ID parity; UET Tag-ID and SPA rules; GA4 tables parity; privacy parity against `vendorsInUse`) and `retired-ids.test.ts` (Q5: SHA-256 hashes only, scanning `git ls-files` — the untracked handoff is excluded by design).
  - Gates: `verify:fast` exit 0; `test` **374 passed** (28 suites, vmThreads pool — the C1b local toolchain finding); `check:rules` passed (18 entry files); `check:facts` passed. Not run here (C5's, per the plan's gates): `build`, `test:e2e`, `lhci`.
  - Next: **C3** — the owner's test import and re-export (guide B0, using the `--test` file), then the round-trip test; both throwaway containers deleted after it.
- 2026-10-02 · **C2 committed** (`feat(p3c): C2 - the tracking generator, the container and the four files`), with two fixes found while preparing the C3 handoff:
  - **The `--test` build's Meta ID was the real one** (the ternary's both branches held `2290203821825563`). Now a placeholder (`123456789012345`), and a new test in `tracking-artifacts.test.ts` (13 tests now) fails if any real `accounts` ID appears in a `--test` build — the round-trip fixture re-exports that file, so it must hold test IDs only.
  - **The guide's B0 section didn't exist** (A8's step 6 referenced "step B0 (Part B)" but Part B had none). Added before B1: the second throwaway container (`dz-roundtrip`), import with Overwrite, the counts to check (23/19/23/5), export, delete both.
  - Gates re-run: `test` **375 passed** (28 suites, vmThreads); `verify:fast` exit 0; `check:rules` passed (18 entry files). The reference fixture is byte-identical to the owner's A8 export (`git diff --no-index` → identical).
  - **C3 is ready for the owner:** the `--test` file sits at `.scratch/tracking-test/deepzeta-gtm-container.json` (gitignored, per 12 §6), test IDs only.
- 2026-10-02 · **C4 (the guide's Part B, the campaign-link rule, the skill) is done.**
  - The guide: B1 names the file and the counts (**23 tags, 19 triggers, 23 variables, 5 built-ins**); B5 carries the key-events table inline (`generate_lead`, `contact_click`); B0 was added earlier with the C2 fixes.
  - 09 §2.8 gains the **campaign-link rule**: three UTMs (`utm_source`, `utm_medium`, `utm_campaign`), values from the campaign table, `snake_case`; click IDs never typed by hand; a mistagged link is replaced, never patched; the Business Profile's link is the named exception (`utm_source=google&utm_medium=organic&utm_campaign=business_profile`).
  - The register: the Business Profile row now carries the link itself, and the change log has the C4 row (the other session's C58 line stayed out: stashed during the commit, restored after — the C1a pattern).
  - The skill (`add-tracking-event`): the taxonomy file is the source (C55), `npm run tracking:build` regenerates all four artifacts, retired events (C59), the parity test, and the owner's checklist now says "a new import file", never hand-edited tags.
  - **Not done (a fact I can't verify offline):** Microsoft's goal setting that makes a conversion "primary" — B8's quote needs Microsoft's help pages read online. It stays as the plan's wording ("both counted as conversions; the primary setting quoted at C5"), to be filled from Microsoft's help during C5's live step.
  - Gates: `check:rules` passed (18 entry files); `test` **375 passed** (28 suites, vmThreads).
- 2026-10-03 · **C3's B0 attempt failed; the generator is fixed (the owner's four findings, all verified against the reference).**
  - **The failure:** GTM's import showed "Not Found" on the `--test` file (empty `dz-roundtrip` container, workspace `roundtrip`, Overwrite) — no change summary appeared.
  - **Finding 1 (the shape):** the file carried no `exportTime`, no `path`, no `container` metadata block, and all-zero account/container IDs. Fixed: non-zero placeholder IDs and the reference's full metadata shape (name, publicId `GTM-GENERATED`, usageContext, features, tagIds, fingerprint, tagManagerUrl; a fixed exportTime keeps the build deterministic).
  - **Finding 2 (the lookup):** `Lookup - traffic_type`'s map rows were written as settings rows (`parameter`/`parameterValue`); the reference's lookup rows are `key`/`value`. Fixed with a separate `lookupRow` builder; settings tables keep their own shape.
  - **Finding 3 (the hosts):** `WL - production` matched only the apex, while production currently serves on `www.deepzeta.ai` (the register's redirect-direction row; the 301 fix is the owner's). The export format ANDs its filter array, so OR is two triggers: `WL - production` (apex) and `WL - production www`, and the Meta and UET base tags fire on either. Preview hosts match neither.
  - **Finding 4 (the dead weight):** the three `Const -` vendor-ID variables were referenced by nothing (the tags inline their IDs, as the reference does). Removed. Counts now **23 tags, 20 triggers, 20 variables, 5 built-ins**; the guide's B0/B1 counts updated.
  - **UET auto SPA (finding 4's second part): verified, kept on** — the base tag's `c_enableAutoSpaTracking: true` and `c_disableAutoPageView: false`, with no UET tag wired to the site's `page_view`; the existing parity test enforces it.
  - **Regression tests added** (17 in `tracking-artifacts.test.ts` now): structural key parity with the reference fixture, the lookup's key/value rows (and the settings tables' shape), the two production triggers on the marketing tags, and no unreferenced constants. The DLVs keep their existence-only guarantee (a parameter's consumer may be a future tag; `consent_analytics` is the live example).
  - Gates: `test` **379 passed** (28 suites, vmThreads); `verify:fast` exit 0; `check:rules` passed. Both builds regenerated (committed and `--test`).
  - **B0 is ready to retry:** `.scratch/tracking-test/deepzeta-gtm-container.json`, test IDs only.
- 2026-10-03 · **The B0 retry succeeded** (the owner: "GTM accepted the import, 63 items — 23 tags, 20 triggers, 20 vars"). The round-trip comparison runs when the owner's re-export lands in `docs/owner/` (GTM-W2WX5BFC_workspace3.json, the `dz-roundtrip` container); GTM's export normalisations are known and handled: renumbered IDs, added fingerprints, removed empty `eventSettingsTable` lists, and `DLV - turn`'s `formatValue` `{"number":{}}` → `{}` (GTM drops an empty number format on export).
  - **The owner's three follow-ups, answered:**
    - **The `consent_update` trigger is used, not dead:** `CE - consent_update - analytics` fires the Google tag's re-config and the page-view pair after Accept, and `CE - consent_update - marketing` fires the Meta and UET bases. The DLVs `consent_analytics`/`consent_marketing` have no reader yet (only `consent_granted_now` feeds the filters) — they're the visibility path for a future tag, same existence-only guarantee as every parameter DLV.
    - **The marketing base tags now fire ONCE_PER_PAGE** (the owner's note): each is reachable from two triggers (the window's load and a later Accept), and the base must load once. A new parity test enforces it (18 tests in `tracking-artifacts.test.ts` now); everything else stays ONCE_PER_EVENT.
    - **The real Meta pixel ID is injected by the generator:** the Custom HTML template interpolates `accounts.metaDatasetId` (test digits in `--test`, the real dataset in the committed build) — no dashboard step carries the ID.
  - The exact imported build is snapshotted at `.scratch/tracking-test-imported/` so the round-trip comparison stays honest against what GTM accepted.
  - Gates after the once-per-page fix: `tracking-artifacts` 18 passed; full suite and commit follow with the round-trip fixture.
- 2026-10-03 · **C3 (the round trip) is done: PASSED.**
  - The owner's re-export (`docs/owner/GTM-W2WX5BFC_workspace3.json`, the `dz-roundtrip` container) verified: test IDs only (including inside the Meta HTML string), and committed byte-identical (same git hash) as `tests/fixtures/gtm/roundtrip-export.json`.
  - **The comparison, and what it proved:** after normalising what GTM legitimately changes — renumbered entity IDs and their cross-references (each side mapped through its own ID map; the reserved Initialization ID 2147479573 kept), added fingerprints, the target container's `accountId`/`containerId`, removed empty `eventSettingsTable` lists, and `DLV - turn`'s `formatValue` `{"number":{}}` → `{}` — **every tag, trigger, variable and built-in matches exactly**: 23 tags, 20 triggers, 20 variables, 5 built-ins, names, types, parameters, consent settings, firing options and setups all identical.
  - **The comparison lives on as a test** (`tracking-artifacts.test.ts`, 20 tests now): the fixture is always checked for test IDs and counts, and when the gitignored snapshot of the imported build exists the full normalised diff runs again — so a future generator change that breaks GTM compatibility fails the suite, not the owner's next import.
  - **Both throwaway containers can now be deleted** (`dz-reference` and `dz-roundtrip`): the owner's step, per the guide's B0 step 9.
  - Gates: `test` **380+2 passed** (the two new B0 tests; full suite below in the commit); `verify:fast` exit 0.
- 2026-10-03 · **C5's e2e piece is ready (the GTM stub cases, 09 §4); C5 itself waits on the owner.**
  - **The live check:** production's CSP has no `googletagmanager.com` (the header read from `www.deepzeta.ai` today), so the owner's Vercel step — `NEXT_PUBLIC_GTM_ID` in Production, redeploy — is still pending, and so is Part B of the guide. Nothing else in C5 can run before them: lhci measures the real container, and the third-party caps and CI's ID follow the measurement (CI asserts `third-party:count` 0 today; adding the ID before the caps would break it).
  - **The new cases** (`tracking.spec.ts`, "The GTM loader"): every third-party request is routed — the container's `gtm.js` is answered by an empty stub, anything else third-party is aborted and must not happen (09 §4: tests never send data). Case 1 (AE): exactly one `gtm.js` request, the loader's `gtm.start` after `dataLayer[0]`'s consent default, and no other third-party request on the page. Case 2 (DE): the container still loads while consent is denied — the tags wait inside GTM (the container's `ad_storage` requirement), not here. Both skip with a plain `test.skip` while the build carries no ID (the CSP is the signal, the same rule `security-headers.ts` applies), so the suite stays green before and after C5.
  - **Proven both ways:** without an ID the full e2e run passes 171 with the 2 new cases skipped; with a placeholder ID in the shell (`GTM-TEST0001`, no `.env` file touched) both cases run and pass (the loader fires once after hydration; the CSP gains the host). The served build was rebuilt without the ID afterwards.
  - Gates: `verify:fast` exit 0; `test` (the touched suites) passed; `build` exit 0 (both builds); `test:e2e` 171 passed + 2 skipped; `format:check` on the file passed.
- 2026-10-03 · **The owner's Vercel step is done; C5 is live, and the stub had to become suite-wide.**
  - **Verified live:** production's CSP now carries GTM's hosts (`googletagmanager.com`, `tagmanager.google.com`, the `gstatic`/`google.com` entries `vendorsInUse()` writes), read from `www.deepzeta.ai` after the redeploy. `.env.local` on this machine now holds the real ID, so local builds measure with it. The committed container was regenerated (`tracking:build`) and is byte-identical — **fresh for the import (guide B1's confirmation)**: 23 tags, 20 triggers, 20 variables, 5 built-ins.
  - **The finding:** the first full e2e run with the ID in the build failed 9 cases. The real `gtm.js` had loaded in every test (only the two new loader cases stubbed it): it pushed its own `gtm.js`/`gtm.dom`/`gtm.load` entries onto the data layer, stamped `gtm.uniqueEventId` onto every entry the site pushes, and — worse — its tags would send real GA4 hits from test runs. 09 §4's rule ("GTM requests are answered by a stub, so tests never send data") was written for exactly this, but nothing implemented it suite-wide because until today no build ever loaded GTM.
  - **The fix (09 §4, B7's precedent for tests outside the table):** `stubGtm()` in `helpers/tracking.ts` (an empty-body fulfilment of `https://www.googletagmanager.com/**`) applied by `test.beforeEach` in `tracking.spec.ts` and `consent.spec.ts` — every tracking and consent test now answers GTM locally, and the data layer holds exactly what the site pushed. The DE page-view case's strict equality (broken by our own loader's legitimate `gtm.js` entry, `gtm.ts`) asserts its meaning instead: the `page_view` lands in the layer unblocked while consent is denied. The noindex failure of that run was my sequencing error (a rebuild without `SITE_INDEXING=on`), not code: the correctly built run passes it.
  - Gates: `test:e2e` **173 passed** with the real ID in the build; `lint` exit 0; `format:check` on the three touched files passed.
- 2026-10-03 · **The owner's B1 import failed: `ONCE_PER_PAGE` is no GTM enum value; fixed to `ONCE_PER_LOAD` and regenerated.**
  - **The failure:** GTM refused the file with "Error deserializing enum type [TagFiringOption]. Unrecognized value [ONCE_PER_PAGE]" — the once-per-page change (`96b2005`, after the B0 round trip, so GTM had never been offered the value) had invented an enum name from the concept. Exactly the no-invented-facts rule, caught by the owner's import.
  - **The fix:** `ONCE_PER_LOAD` — GTM's own export value for the UI's "Once per load", the same semantics (the marketing base tags fire once per page however many triggers reach them; both real exports carry only `ONCE_PER_EVENT`, so the importer's accepted set is `ONCE_PER_EVENT`/`ONCE_PER_LOAD`/`UNLIMITED`). The generator's comment names the lesson; the parity test pins the real value.
  - **Regenerated:** the committed container now holds exactly two `ONCE_PER_LOAD` entries (the Meta and UET base tags); everything else `ONCE_PER_EVENT`. The counts are unchanged (23/20/20/5); the round-trip fixture comparison is untouched (it compares the pre-change test build).
  - Gates: `test` **382 passed** (28 suites, vmThreads), including the committed-files-equal-fresh-generation check. **B1 is ready to retry** with the regenerated `docs/owner/tracking/deepzeta-gtm-container.json`.
Phase: P3
Branch: `feat/p3c-gtm-container` (from `main` at `2625fb2`; step C0 done there)
Page tier: T1 (sitewide: the CSP, the cookie list and the container reach every page; measured on Home and the review page, as in parts A and B)

This plan replaces part C of `docs/plans/2026-10-02-p3-analytics-consent.md` (its steps C1–C6 and part C's allowed files). That plan's sections L (the container's design) and M (tests) still apply where this one doesn't change them. Its source is the owner's handoff `docs/owner/deepzeta-tracking-part-a-handoff.md` (2026-10-02), the owner's explicit request for a tracking change (09, protected files).

## Goal served

*"…turns UAE business owners into booked AI audits, and proves every claim it makes."* Part C makes the funnel measurable on the platforms the owner will advertise on (GA4, Meta, Microsoft), with names that match the code exactly (the tracking-parity rule), consent that matches the region rule (C52), and a privacy policy that names exactly what runs.

## Context

- Part B (merged, `2625fb2`) built the consent defaults, the banner, `trackEvent()`, the taxonomy, the vendors list, the CSP and GTM's loader. No third-party tag runs anywhere yet: `NEXT_PUBLIC_GTM_ID` is unset and every ID in `accounts.ts` is `null`.
- The owner finished the tracking guide's Part A (A1–A7) and sent the IDs and decisions in the handoff, sections 1–8.
- Part C's plan said "Microsoft Ads can be added to the taxonomy's vendors when you say yes". The owner says yes.

## What the check found (the handoff against the repo, 2026-10-02)

**Conflicts with the rules or the code**
1. **Microsoft recommends loading UET before the banner** ("Advanced" consent mode: UET loads at once with `ad_storage` denied). 09 §2.7 is basic mode: no tag fires before Accept. Microsoft also documents Basic consent mode: "skip step 1 and fire your UET tag where consent is granted … after you obtain user consent", and a GTM tag that requires `ad_storage`. **This plan keeps Basic** (09 §2.7, C52). For the Europe-after-Accept case, Microsoft's GTM page recommends the template's **Inherit initial consent** option, which sends `granted` to UET. The cost: no Microsoft modelling for European visitors who refuse. Recorded as **C60** (Q1).
2. **`book_call_click` dropped** against an append-only taxonomy (09 §3.1: names never disappear). 09 §3.5 lists it as a secondary key event, and `docs/design/conversion-path.md` line 60 (protected) lists it as an event the booking flow uses. **Resolution:** the name stays, marked `retired`; `trackEvent()` refuses it in its types and at run time; the generator, the GA4 tables and the ads tables leave it out; 09 §3.5 and conversion-path.md drop it. Recorded as **C59**.
3. **The handoff marks the guide's A3.11 and B7 "Not needed".** A3.11 (the office IP rule) is right to drop. **B7 is still needed:** the container marks every host except `deepzeta.ai` and `www.deepzeta.ai` with `traffic_type = internal` (Vercel previews, CI's Lighthouse runs once CI has the ID, local tests), and GA4 drops those events only while the **Internal Traffic** filter is Active. This plan keeps B7 with that reason (Q2). Your own office visits will count, since there's no static IP (Q6).
4. **The handoff lists email as pending in `site-config.ts`.** It isn't: `email` is `hello@deepzeta.ai` (facts §2). Phone and WhatsApp are pending. Nothing to change.

**Consequences to know (your decisions stand)**
5. **`contact_click` as primary.** Until the audit page (R002) ships, the header's "Book a free AI audit" is an email link, so every click on it is a `contact_click` and counts as a primary conversion.
   - GA4 has key events only, not primary and secondary.
   - In Meta, you choose the optimisation event per ad set, so `Contact` and `Lead` are both available.
   - "Primary" is a setting only in Google Ads (later) and in Microsoft's conversion goals.
6. **Privacy and consent wording.** The approved texts name "Google, Meta and LinkedIn". With Microsoft added and LinkedIn and Google Ads postponed, the policy has to name exactly what runs (the register's privacy row). The handoff doesn't cover these texts, so the new wording is below for your approval (Q3).
7. **The repo is public until the build is complete.** The handoff holds two personal email addresses and several account-management IDs: the business portfolio, ad accounts, GTM's and GA4's internal IDs, and the Microsoft account number. None is a secret, but they aren't needed in the repo. Only the four IDs that ship in every page go in code (Q4).
8. **The two retired Meta IDs.** Writing them anywhere in the repo publishes them. A guard test can hold only their SHA-256 hashes (Q5).

**Missing**
9. **The reference export (A8, step C1)** isn't in the handoff, and the generator waits on it. A8 now also needs Microsoft's UET template: one base tag and one custom event. Keeping its LinkedIn row means LinkedIn's later start needs no second reference.
10. **The Business Profile's tagged link.** 09 §2.8 captures campaign tags but defines no naming rule, so there's nothing to "generate from" yet. Step C4 adds a short campaign-link rule to the tracking guide, with the Business Profile link built from it.
11. **`bat.bing.net`** appears only in a Microsoft Q&A answer, not in Microsoft's documentation. The CSP gets `https://bat.bing.com` only, the host of Microsoft's official tag code. If C5's tests show another host, it needs an official source or your OK.
12. **UET cookie lifetimes.** Microsoft's official pages name the cookies but give no lifetimes, and `MUID` and `MSPTC` are Bing's own cookies, which the site can't delete. Cookie settings shows a vendor's cookies only once their `external-sources.md` row is approved, so Microsoft's stay hidden until an official source gives lifetimes.
13. **GTM's own weight:** your container, unpublished and empty, already serves `gtm.js` with HTTP 200 at **116,015 bytes** compressed (measured today). GTM loads for every visitor after hydration (essential, 07 §2). C5 measures it with the tags, and the third-party caps are set from that measurement.
14. **The env-read test** doesn't exist yet: `env.ts` reads six variables and `analytics.ts` reads `NODE_ENV`. C1c adds it.
15. **The pre-launch register** holds another session's uncommitted line (the App demo renamed "Deepzeta Sync App", C58). This plan's rows are committed without it unless you say otherwise (Q7).

## Verified (2026-10-02)

- **Microsoft, official pages** (learn.microsoft.com, Microsoft Advertising help):
  - **"Setting up UET for consent mode"** (`hlp_ba_conc_uet_consent`):
    - `ad_storage` is `granted` or `denied`; with `denied`, UET reads and writes no first-party cookies.
    - Basic mode fires the tag only once consent is granted.
    - In the EEA, the UK and Switzerland, consent mode is enforced and defaults to `denied`.
    - The tag code loads `//bat.bing.com/bat.js`.
    - The `_uetmsdns` cookie set to `1` opts a visitor out.
    - Validation: UET Tag Helper's `asc` parameter.
  - **"FAQ: UET and user consent"** (`hlp_ba_conc_uet_consentfaq`):
    - Consent Mode or TCF is required.
    - Only `ad_storage` is enforced.
    - The cookies that need consent are `MUID`, `_uetvid`, `_uetsid`, `_uetsid_exp`, `_uetvid_exp` and `MSPTC`.
    - Basic and Advanced are both described.
  - **"Set up UET tags using Google Tag Manager"** (`hlp_ba_proc_uet_tms_gtm`):
    - The tag type is **Microsoft Advertising Universal Event Tracking**.
    - The base tag is **UET config/page view (required)**, one per page, on all pages, with **Enable automatic tracking for page view events** for client navigation.
    - Custom events use Event Type **Custom** with Action, Category, Label and Value matching the conversion goal, sequenced after the base tag.
  - **"Google tag manager template: Consent mode"** (`hlp_ba_conc_uet_dynamicconsentgtm`):
    - The template reads GTM's consent state.
    - Its options: **Inherit initial consent** (off by default; recommended when the tag fires after consent was given) and **Enable consent updates** (on by default).
    - Its Example 4 is the tag gated by GTM's **Require additional consent: ad_storage**.
- **Not verified yet:**
  - The template's exact field names and its GTM type ID: they come from the reference export (C1).
  - The Microsoft goal setting that makes a conversion "primary": read at C4 from Microsoft's help, quoted in the guide.
- **The repo:**
  - `accounts.ts` has five fields, all `null`, with `ACCOUNT_FORMATS`.
  - `vendors.ts` has `gtm`, `gtm_preview`, `ga4`, `meta` and `linkedin`; a vendor is in use only when GTM and its ID are set.
  - In `taxonomy.ts`, `book_call_click` and `contact_click` are secondary, with `meta` and `linkedin` mappings.
  - `msclkid` is already captured (`HAS_ATTRIBUTION`, `attribution.ts`).
  - No retyped site fact in `src/` or `scripts/` (only `site-config.ts` holds them).
  - `.env.example` is editable (`.claude/settings.json` excepts it), and the conflict register's next ID is C59.

## Design

### 1. The IDs (handoff §1)

| ID | Value | Where | When |
|---|---|---|---|
| GA4 | `G-RTLSJW7Q9W` | `accounts.ts` `ga4MeasurementId` | C1b |
| Meta dataset | `2290203821825563` | `accounts.ts` `metaDatasetId` | C1b |
| Microsoft UET tag | `187278109` | `accounts.ts` `microsoftUetTagId` (new; format: digits) | C1b |
| GTM container | `GTM-5MR4S8R2` | `NEXT_PUBLIC_GTM_ID`: you, in Vercel → Production; and `ci.yml` (a public ID: it's in every page's HTML once live) | C5 |
| LinkedIn, Google Ads | — | stay `null` (postponed) | — |

An ID in `accounts.ts` changes nothing on the site until GTM is set: `vendorsInUse()` needs both. **Your Vercel step comes at C5, right before the Preview test (B2).** Production starts loading the container as soon as the variable is set, so I'll send the exact clicks then, checked against Vercel's documentation that day. `NEXT_PUBLIC_` values are built into the pages, so a redeploy follows.

### 2. Conversions (handoff §2.3)

- `generate_lead`: key event, primary (unchanged).
- `contact_click`: key event, **primary**.
- `book_call_click`: `retired: '2026-10-02, the owner: never sent'`.
  - No `keyEvent` and no vendor mapping.
  - `EVENT_PARAMS` keeps its entry (append-only), but `trackEvent()`'s types exclude it (`ActiveEventName`), and `eventPayload()` drops it at run time like an unknown name.
  - The generator writes no trigger or tag for it, and the GA4 and ads tables leave it out.
  - The parity test checks all of that.
- **09 §3:**
  - Rule 5: "`generate_lead` and `contact_click` are primary; `book_call_click` is retired (never sent)".
  - Rule 1 gains: "an event the owner drops is marked retired, never deleted".
- **Per platform** (the guide's tables say it):
  - **GA4:** both are key events.
  - **Microsoft:** two conversion goals, both counted as conversions.
  - **Meta:** `Lead` and `Contact`, with the optimisation event chosen per ad set.
  - **Google Ads (later):** both GA4 key events imported as primary (Q6, unchanged).

### 3. Microsoft Advertising (handoff §3)

- **`vendors.ts`:** a `microsoft` vendor.
  - Group `marketing`.
  - Hosts: `https://bat.bing.com` for script, img and connect (the official tag code's host).
  - Source: `hlp_ba_conc_uet_consent`.
  - `withdraw`: `_uetsid`, `_uetvid`, `_uetsid_exp`, `_uetvid_exp`, the first-party names from the consent FAQ.
  - `cookies`: the same names, `approved: false`, until an official page gives their lifetimes (finding 12).
  - In use when `microsoftUetTagId` is set and GTM is set.
- **`taxonomy.ts`:** `microsoft?: true` on `generate_lead` and `contact_click`. The UET custom event's **Action** is the taxonomy name exactly (tracking parity); Category, Label and Value stay empty.
- **The container (C2), from the reference export's shape:**
  - The base tag, **UET config/page view**, with automatic page-view tracking on, **Inherit initial consent** on and **Enable consent updates** on. Consent settings require `ad_storage`. It fires on the window's load on the production host (Q4 of part B, like Meta) and on the marketing after-Accept trigger.
  - Two **Custom** tags (`generate_lead`, `contact_click`), sequenced after the base tag, production host only, requiring `ad_storage`.
- **Withdrawal:** Cookie settings → Marketing off sends Consent Mode's update (part B). The template's "Enable consent updates" passes it to UET, and the four names are deleted. If C5's test shows UET keeping those names in `localStorage` too, `consent.ts` deletes them there as well (named below; only then).
- **The owner's checks (guide, C4):**
  - B2 adds the **UET Tag Helper**: after Accept, `asc` reads *granted*; before Accept in Europe, no UET request.
  - B8 adds Microsoft's two conversion goals, named exactly as the events.
  - A note: keep Microsoft's **Clarity integration** off. It would need its own consent and CSP.

### 4. The postponed items, the tidy-ups and the account notes (handoff §4–§6)

- **New register rows:**
  - LinkedIn, and Google Ads, each with what happens when it's ready (the handoff's wording).
  - The Microsoft payment method.
  - The GA4 stream URL label → `https://deepzeta.ai`.
  - An `@deepzeta.ai` admin on GTM, GA4, Meta, Microsoft Ads and the Business Profile once Workspace is active.
  - The Business Profile's website link, from C4's campaign-link rule.
  - `NEXT_PUBLIC_GTM_ID` in Vercel Production (C5).
  - The UET tag showing "Verified" after B2.
- **Rows that change:**
  - The Part A row is ticked ☑ 2026-10-02.
  - The Internal Traffic row's reason becomes "keeps previews, CI and test runs out".
  - The "Meta, LinkedIn and Google Ads conversions" row becomes "Meta and Microsoft now; LinkedIn and Google Ads when they start".
  - The confirmed booking and the server-side events keep their rows.
- **No personal email address** goes into a committed file; "the owner's personal Gmail" is enough. The §6 account register stays out of the repo while it's public (Q4).

### 5. Settings that aren't env variables (handoff §7)

- **`.env.example`** ends with a block **"Not env variables: where the other settings live"**:
  - every `accounts.ts` field by name (the `null` ones and `microsoftUetTagId` included) → `src/lib/tracking/accounts.ts`;
  - every `siteConfig` key (brand and legal name, positioning line, email, address, opening hours, phone, WhatsApp, social profiles) → `src/lib/site-config.ts`.
  - Names only, never values.
- **`tests/unit/env-example.test.ts`:**
  - (a) every `process.env.X` read in `src/`, `next.config.ts` and `scripts/` is listed in `.env.example`, except what Node and Vercel set (`NODE_ENV`, and the `VERCEL_*` names, which the file lists under "Set automatically");
  - (b) the block names every `accounts` key and every `siteConfig` key, and nothing else.
- **`check:facts` gains a retyped-facts check:** a contact fact from `siteConfig` (email, address, phone and WhatsApp once set, each social URL) typed literally in `src/` or `scripts/` outside `site-config.ts` fails the gate. Today there are none.

### 6. The wording for your approval (Q3)

- **`settings.marketing.body`:** "Measure whether our ads on Meta and Microsoft Bing bring people here, and show our ads to people who've visited us."
- **privacy-policy.md, Table C's ad-networks row:** "Meta, Microsoft Advertising (with marketing consent in the EEA, the UK and Switzerland; on elsewhere until you switch them off)".
- **Table D, Marketing:** "Meta and Microsoft Advertising measure whether our ads bring people here, and can show our ads to people who've visited".
- **FAQ Q4:** "…Cal.com (booking), Meta (WhatsApp and ad measurement) and Microsoft (ad measurement)." (it stays over 40 words).
- **The "How this draft differs" row:** "Meta and Microsoft Advertising measurement" in place of "Google Ads, Meta and LinkedIn".
- **Part 3 note 2:** "(Meta now; LinkedIn and Google offline import when they start)".
- **When LinkedIn or Google Ads starts,** their names come back in the same change that adds them to the container.

## Out of scope

- LinkedIn and Google Ads setup (postponed; the register keeps them).
- Server-side events and the confirmed Cal.com booking (P6–P7).
- Microsoft Clarity, TCF, and Advanced consent mode (Q1).
- An "exclude my own visits" switch (Q6).
- The `/privacy` page itself (P6): only its draft changes here.
- Every dashboard step: you do them from the guide (09 §2.10).

## Allowed files

| Path | Action | Purpose |
|---|---|---|
| `docs/plans/2026-10-02-p3c-gtm-container.md` | CREATE | This plan and its Progress notes |
| `docs/plans/2026-10-02-p3-analytics-consent.md` | MODIFY | A pointer: part C continues in this plan |
| `src/lib/tracking/accounts.ts` | MODIFY | The three IDs, `microsoftUetTagId` and its format (§1) |
| `src/lib/tracking/vendors.ts` | MODIFY | The `microsoft` vendor (§3) |
| `src/lib/tracking/taxonomy.ts` | MODIFY (protected, 09) | `contact_click` primary, `book_call_click` retired, `microsoft` mappings (§2, §3) |
| `src/lib/analytics.ts` | MODIFY (protected, 09) | Retired events refused at run time; `ActiveEventName` (§2) |
| `src/lib/tracking/consent.ts` | MODIFY (protected, 09) | **Only if** C5 shows UET's names in `localStorage` (§3) |
| `src/content/en/legal/consent.ts` | MODIFY | `settings.marketing.body`, after your approval (§6) |
| `scripts/build-tracking.mjs` | CREATE | The generator, with UET (part C's L) |
| `scripts/check-facts.mjs` | MODIFY | The retyped-facts check (§5) |
| `package.json` | MODIFY | `tracking:build` (no new dependency) |
| `.env.example` | MODIFY | The settings index block (§5) |
| `docs/owner/tracking/deepzeta-gtm-container.json`, `ga4-setup.md`, `ads-conversions.md`, `taxonomy.md` | CREATE (generated) | The import file; GA4's tables; Meta's and Microsoft's conversion tables; the human taxonomy table |
| `tests/unit/taxonomy.test.ts`, `analytics.test.ts`, `security-headers.test.ts`, `consent.test.ts` | MODIFY | §2, §3, and the ID formats (`ACCOUNT_FORMATS` is tested in `taxonomy.test.ts`); `consent.test.ts` only with `consent.ts` |
| `tests/unit/env-example.test.ts`, `tracking-artifacts.test.ts` | CREATE | §5; the parity and structure checks (part C's L) |
| `tests/unit/check-facts.test.ts` | MODIFY | §5's check |
| `tests/fixtures/gtm/reference-export.json`, `roundtrip-export.json` | CREATE | Your two exports, test IDs only |
| `tests/e2e/tracking.spec.ts` | MODIFY | The GTM cases with a stub (C5) |
| `.github/workflows/ci.yml` | MODIFY | `NEXT_PUBLIC_GTM_ID` (C5) |
| `lighthouserc.cjs`, `lighthouserc.row.cjs`, `scripts/check-page-weight.mjs`, `tests/unit/check-page-weight.test.ts` | MODIFY | The third-party caps from C5's measurement |
| `docs/owner/p3-tracking-setup-guide.md` | MODIFY | §1's answers, question 9's table, A3.11 "Not needed", A8 + UET, Part B (§3), B7's reason, the campaign-link rule |
| `docs/owner/pre-launch-register.md` | MODIFY | §4's rows (without the other session's line unless Q7 says so) |
| `docs/content-drafts/legal/privacy-policy.md`, `consent-copy.md` | MODIFY | §6, after your approval |
| `docs/ai/09-analytics-tracking.md` | MODIFY (protected) | §3 rules 1 and 5; §2.7: UET's consent signal in basic mode; §1's vendor list if it names them |
| `docs/ai/conflict-register.md` | APPEND-ONLY (protected) | C59 (`book_call_click` retired), C60 (UET Basic against Microsoft's Advanced recommendation) |
| `docs/design/conversion-path.md` | MODIFY (protected) | Line 60: `book_call_click` out of the booking flow's events |
| `docs/facts/external-sources.md` | APPEND-ONLY (protected) | PROPOSED rows: Microsoft's four pages above; GA4's and Meta's cookie pages |
| `docs/ai/07-performance-budget.md` | MODIFY (protected) | §2's third-party caps from C5 |
| `docs/decisions/0004-tech-stack.md` | MODIFY | The tracking row: Microsoft Advertising (UET) added; LinkedIn and Google Ads after launch |
| `docs/decisions/0021-analytics-and-consent.md`, `docs/decisions/README.md` | MODIFY | The phase's record at C6 |
| `.claude/skills/add-tracking-event/SKILL.md` | MODIFY (protected) | The taxonomy file, `tracking:build`, `retired`, the parity test |
| `CLAUDE.md` | MODIFY (protected) | "Current state" at C6 |
| `tests/unit/retired-ids.test.ts` | CREATE | **Only if** Q5 = yes: the two retired Meta IDs never appear (hashes only) |

## Steps

- **C0 · Part B's close** (done, `b5a1da7`, `c5bd4a8`, `c0384c7`).
- **C1a · Part A recorded** (docs): the guide's §1 answers, question 9's table, A3.11, A8 with UET (and LinkedIn kept), the register's rows, 0004's row → `check:rules`.
- **C1b · The code** (§1–§3): `accounts.ts`, `vendors.ts`, `taxonomy.ts`, `analytics.ts` and their tests → `verify:fast` + `test` + `build` + `test:e2e`.
- **C1c · The settings index** (§5): `.env.example`, `env-example.test.ts`, `check:facts` → `test` + `check:facts`.
- **C1d · The protected docs:** 09, C59 and C60, conversion-path.md, the PROPOSED `external-sources.md` rows → `check:rules`.
- **C1e · The wording** (§6), once you approve it → `test` + `check:rules`.
- **C1 · Your reference export** (guide A8). Everything above can be done while it's pending.
- **C2 · The generator** and the four generated files (your IDs; Meta and Microsoft in, LinkedIn out, `book_call_click` out) → `test` (parity, structure, privacy parity).
- **C3 · Your test import and re-export** (guide B0) → the round-trip test; both throwaway containers deleted.
- **C4 · The guide's Part B** (B1's counts, B2 with UET Tag Helper, B5's key events, B7, B8 with Microsoft and Meta's note), the campaign-link rule and the Business Profile link, the skill → `check:rules`.
- **C5 · Live:**
  - Your Vercel step (I send the exact clicks), and CI gets the ID.
  - Your Part B (B1–B8).
  - lhci measures the real container in both regions.
  - The third-party caps go into `lighthouserc` and 07 §2; `consent.ts` changes only if needed → `verify` + your B2 and B3 results.
- **C6 · Phase exit:** 0021, `CLAUDE.md`, `verify`, the reviewer and the two auditors → **merge on your "merge"**.

## Risks & mitigations

- **Third-party weight.** GTM alone is 116 KB compressed, and UET, Meta and GA4 come on top.
  - Outside Europe, Meta and UET wait for the window's load.
  - In Europe they wait for Accept.
  - C5 sets the caps from the measurement; if INP or TBT on Home suffers, it's raised with you before anything merges.
- **Lighthouse's margin on European Home** (part C's note on `c0384c7`: about 2.44–2.52 s against 2.5 s). C5 re-measures with the tags; nothing is lowered without you.
- **A wrong host or cookie name.** CSP violations are counted in e2e and in B2's console check, and nothing is added without an official source.
- **UET's consent signal.** B2's UET Tag Helper check (`asc` *granted*), and Microsoft's dashboard "Consent signal: Healthy" after a week (a register row).
- **`contact_click` primary inflates conversions** while the audit CTA is an email link (finding 5). The guide's B8 says so beside the goal settings.
- **Another session in the same checkout:** read `git diff` on every shared file before staging (lesson 8).

## Gates (03 §2)

- Code steps: `verify:fast`, `test`, `build`, `test:e2e`.
- Docs steps: `check:rules`.
- C5: `lhci` with the tags.
- Before the merge: `verify`, CI green on the branch head.

## Open questions (my recommendation first)

1. **UET consent:** Basic, as 09 §2.7 says (UET fires only after consent, with Inherit initial consent), **recommended**. Or Advanced, as Microsoft recommends (UET loads for European visitors before Accept with `denied`); that needs 09 §2.7 changed.
2. **Keep B7** (the Internal Traffic filter, for previews and CI), **recommended**; or drop it and accept preview and CI visits in GA4.
3. **The new wording in §6:** approve, or change it.
4. **The handoff and the account register:** keep both out of the repo while it's public (the decisions go into the guide, the register and this plan, without personal emails), **recommended**. Or commit a copy without the emails, or commit it as it is.
5. **A guard for the two retired Meta IDs**, holding only their hashes: **yes, recommended**.
6. **Your own visits:** leave them counted for now, **recommended**. Or add a "mark this browser as mine" link that sets `traffic_type = internal` on that browser (a small extra, its own step).
7. **The other session's register line** (C58's App demo name, already on `main` in the conflict register): leave it to that session, **recommended**, or include it with this plan's rows.
