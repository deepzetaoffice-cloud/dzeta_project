# Plan: P3 Analytics & consent: the P2 tidy, Europe-only consent, one taxonomy, GTM, the generated container
Status: APPROVED (owner, 2026-10-02): "approve the plan, all recommendations yes, start part A". Q1–Q7 answered with the recommendation; the protected edits in section O are approved with it.
Progress:
- 2026-10-02 · Approved. Part A starts on `feat/p3-analytics-consent` (step A1).
- 2026-10-02 · **Step A1 (the seven fixes) is done.**
  - Fix 1: `{' '}` between the row's two spans (the grid doesn't render it; the link's text is now "name outcome"). A new e2e case checks the first menu row's text.
  - Fix 2: `routePath('R001')` in `SiteHeader`, `global-not-found` and `global-error`. `global-error`'s `eslint-disable` for `no-html-link-for-pages` went: the rule only reads a typed `href="/"`, so it reported the directive as unused. The plain `<a>` and C46's reason stay, in its comment. `global-error` now imports `routes.ts`, which ships with every page: Home's scripts grew 16 B (147,720 → 147,736 B in all 5 runs). `lighthouserc.cjs` isn't in part A's table, so `OWN_JS_HOME` (8,052) catches up at B6, which sets it from lhci; lhci's script assertion passes meanwhile.
  - Fix 3: the panel's `pb-6` became `padding-block-end: max(--spacing(6), env(safe-area-inset-bottom))` in `effects.css`. Playwright has no safe areas, so it's checked on the pre-launch iPhone row ("the menu sheet's bottom button").
  - Fix 4: `tests/unit/shell-review.test.ts` calls the page with `env().vercelEnv` mocked as `production` (it throws `notFound()`'s error) and as preview, development and unset (it renders). How `VERCEL_ENV` becomes `vercelEnv` is covered by `env.test.ts`.
  - Fix 5: the footer's groups joined `routes.test.ts`'s duplicate check.
  - Fix 6: `shell.spec.ts`'s footer test runs at 768 px too; a forced-colours test checks every tile's solid system border, its letter shown and its glow hidden.
  - Fix 7: `--dz-social-letter-weight: 800`, used by `.dz-social-letter`. `check:contrast` now reads a pair's size and weight tokens (`largeText`) and calls it large text only while they qualify (24 px, or 18.67 px at 700 or more); otherwise it's held to 4.5:1. The seven tile pairs use it; three unit tests cover it (bold 19 px large, regular 19 px and bold 17 px text, unreadable length or weight a problem).
  - Gates: `verify:fast` exit 0; `test` 281 passed; `build` exit 0; `test:e2e` shell 63 passed.
- 2026-10-02 · **Step A2 (the opening hours) is done.**
  - `siteConfig.openingHours`: `display` is the fact byte for byte; `days` (Monday–Saturday), `opens` `08:00`, `closes` `17:00`. `site-config.test.ts` reads the fact, checks `display`, and parses it to check the parts (and that the closed day isn't listed).
  - The footer: "Opening hours: <the fact>" on its own line after `<address>`, in one `text-small` group with it. The label `shellContent.hoursLabel`, "Opening hours", is the Content Writer's (the facts file's own name for the field). `shell.spec.ts` checks the line at every footer width.
  - footer.md: the hours got **their own bullet** rather than the plan's quoted change to the "Business name, address and phone" bullet, because they sit outside `<address>`. The text, for the owner: "**Opening hours** (the owner, 2026-10-02; P3 plan, A): their own line after the `<address>`, "Opening hours: " and the fact from the site config, byte for byte (facts §2)."
  - **The design index's change log** (`docs/design/README.md`) isn't in part A's table, so its row for the footer.md change is proposed for part B's spec edits (B9).
  - The plan's own "State changes" and "Behaviour matrix" got their own headings: `check:effects` read the matrix as a second effect-register table without an "Effect ID" column.
  - **`npm run verify`** (CI environment): exit 0. 282 unit tests, `build`, `check:schema`, `check:seo`, `check:links`, 141 e2e, lhci and the page weight ("largest run 186860 B of 190868 B, 3.9 KB left").
  - **The reviewer:** no blocking findings. Fixed: footer.md's bullet lost a clause about P4's schema (specs don't restate rules); this note's wording on fix 4 and on footer.md. Recorded:
    - **C46 is out of step with the code** (proposed, for the owner's OK at B1 with C52–C55): its resolution still says the error page's home link is a plain `<a href="/">` with one `eslint-disable-next-line`. Now the `href` comes from `routePath('R001')`, and the rule reads only string `href`s, so no exception is needed; the plain `<a>` and its reason stay.
    - **A watch item for B5/B6:** `global-error` (a client component whose chunk group ships with every page, C46) is now the only client module that imports `routes.ts`; the build keeps the one path it uses (+16 B). Part B adds each row's type to `routes.ts`, and `TrackingRuntime` will import it for `content_group`. At B5/B6 the built error chunk is searched for a non-home path (`/services/ai-automation`): if the route table ships there as well, that's raised before going on.
  - **lhci** (local, 5 runs each, Lighthouse 12.6.1): Home Performance 98, LCP 2,329–2,428 ms (median 2,406; the same two groups as P2's, about 2.33 and 2.41 s), TBT 12–23 ms, CLS 0; HTML + CSS + JS **171,945 B** (P2: 171,754; +191 B for the hours line and the menu's spaces). The review page: Performance 98, LCP 2,481–2,496 ms (median 2,484), 186,860 B.
- 2026-10-02 · **Part A merged** on the owner's "merge": `9e5ce7f` on `main` (`--no-ff`; its tree equals the CI-green `3c3bd45`).
  - **CI on `3c3bd45`** (run 36938454794): Home LCP 1,884–2,811 ms (median 1,886), Performance 70–100 (median 100; the 70 was a slow runner: benchmark index 1345 against about 2,450, TBT 1,293 ms); the review page 2,005–2,634 ms (median 2,588, under C50's 2,700), Performance 96–99; CLS 0.
  - **Vercel production** deployed `9e5ce7f` ("Deployment has completed"); `www.deepzeta.ai` shows "Opening hours: Monday to Saturday, 08:00–17:00 GST (UTC+4); closed Sunday" in the footer, and `/shell-review` returns 404.
  - The owner asked whether a new session is needed: no (the conversation is summarised as it grows, and the plan's notes carry the state). Part B starts on `feat/p3b-consent-tracking`, from `main`.
- 2026-10-02 · **Step B1 (taxonomy first) is done.**
  - **Rules first:** C52–C55 appended to the conflict register (approved with the plan); 09 §2.7 (consent by region), §2.8 (click IDs written only with Marketing consent), §3 (the taxonomy is `taxonomy.ts`, with its naming rules, limits and key events; the generated table comes in part C) and §4 (the region cases, the import check), and the protected-files line.
  - **The C46 correction** proposed in part A's report isn't made yet: it's a protected edit the owner hasn't answered. It's asked again in part B's report.
  - `src/lib/tracking/taxonomy.ts`: the 17 events of section F with their parameters, each parameter's kind (`enum`, `id`, `domain`, `url`, `title`, `number`), GA4 or GTM only, key events, Meta and LinkedIn mappings; `EventParams<E>` derives `trackEvent()`'s types.
  - `src/lib/analytics.ts`: `trackEvent()` and `eventPayload()`. Each value is checked by its kind; a value that looks like an email address or a phone number is dropped; a page address loses any query value holding an email address; the push waits for `setTimeout(0)`. **Beyond the plan:** an event that isn't in the taxonomy (only possible past the types, with a cast) is dropped with a development warning instead of throwing.
  - `src/lib/tracking/accounts.ts`: every ID `null`, with each ID's expected shape. `src/lib/tracking/vendors.ts`: GTM, its preview, GA4 (without Google signals), Meta and LinkedIn, each with its consent group and hosts from the vendor's own page; `vendorsInUse()` returns nothing without GTM, and the others only with their ID. Each vendor's cookies are added at B4.
  - **Google Fonts in GTM's preview:** Google lists `fonts.googleapis.com` and `fonts.gstatic.com` for preview mode. `check:tokens` bans Google Fonts hosts anywhere in `src/` (05 §3, lesson 1), so they're left out: the preview badge falls back to a system font, and a preview session logs two blocked font requests. The tracking guide's B2 will say so, so those two aren't mistaken for a problem.
  - The three tracking modules load in Node's own TypeScript loader (checked), as part C's generator needs.
  - Tests: `taxonomy.test.ts` (an append-only guard over the approved entries; GA4's reserved names, prefixes and limits; the owner's key events; `page_view` only GA4's own fields; LinkedIn slots; the IDs' shapes) and `analytics.test.ts` (the payload, each kind's checks, the yield, an unknown event dropped, and `@ts-expect-error` lines that fail `typecheck` if the types loosen).
  - Gates: `verify:fast` exit 0; `test` 301 passed.
- 2026-10-02 · **Step B2 (the region hint) is done** (`89eb3d0`).
  - `src/lib/tracking/region.ts`: the 32 codes, the two `has` values (exact complements: a negative look-ahead, so the two rules never both match), the page-only source `/:path((?!_next/)[^.]*)` and `regionHeaderRules()`, spread into `next.config.ts`'s `headers()`.
  - **On `next start`:** AE, US and XX → `row`; DE, GB, CH, NO → `eea`; no header, or a lowercase `de` → no hint; `/`, the review page and a 404 get it; a `/_next/` chunk, the logo and `robots.txt` don't. Chromium reads it from `performance.getEntriesByType('navigation')[0].serverTiming`.
  - **On the Vercel preview** (`dzetaproject-67sj6dg50-deep-zeta.vercel.app`, through a share link; this machine's public IP is in the UAE): `/` → `Server-Timing: dz-region;desc="row"` with `X-Vercel-Cache: HIT` (region `bom1`), so the rule runs at the CDN and the page stays cached; the review page and a 404 get it too; a chunk doesn't. **A request that sends its own `x-vercel-ip-country: DE` still gets `row`:** Vercel replaces the client's value, which the docs didn't say outright.
  - **Not yet checked:** a request from Europe. It's the owner checklist's item 1 (a VPN), on part B's preview.
  - `region.test.ts`: every two-letter code gets exactly one of `eea` and `row`; odd values get neither.
- 2026-10-02 · **Step B3 (consent defaults) is done.**
  - `src/lib/tracking/consent.ts`: the stored choice (`dz-consent`: version 1, two flags, a time; 12 months; a date more than a day ahead is ignored), `resolveConsent()`, `consentModeState()` (all seven types, `personalization_storage` denied), `grantedNow()`, `readRegion()`, `currentConsent()`, `deleteCookies()` (this host and each parent domain) and `applyChoice()` (store, `gtag('consent','update')`, then `consent_update`, then the withdrawn group's cookies).
  - `src/lib/tracking/consent-init.ts`: the `<head>` script, a static string from those constants; `SiteDocument` mounts it after the no-flash script. It's a second inline script under C40's terms; 06 §4's wording for the exception is updated with its CSP lines at B7.
  - `consent-init.test.ts` runs the inlined string over 5 hints × 11 stored values and compares it with `resolveConsent()`; `dataLayer[0]` is an arguments object, as Google's `gtag()` pushes. `consent.test.ts` covers the rest, including Accept all in a page and the cookie deletion.
  - `playwright.config.ts`: the e2e project's visitor is in the UAE (`x-vercel-ip-country: AE`), so P2's tests keep their meaning; no P2 test changed. `tests/e2e/tracking.spec.ts` checks the hint per path, `dataLayer[0]` for AE, DE (read before any of the site's JavaScript runs) and no country, and a stored choice beating the region until it's 12 months old.
  - Gates: `verify:fast` exit 0; `test` 319 passed; `build` exit 0; `test:e2e` 146 passed.
- 2026-10-02 · **Step B4 (the banner and Cookie settings) is done.**
  - **The copy** (Content Writer): `src/content/en/legal/consent.ts`, consent-copy.md §1–§2 verbatim, by their stable IDs. **NEW strings, for the owner's approval:** `settings.close` "Close privacy settings", `settings.cookiesHeading` "Cookies and storage", `settings.cookieColumns` "Name / Provider / Lifetime", `settings.lifetime` "`n` months", "`n` days", "Until you clear it". Two proposed keys went unused and were removed (the banner is named by its visible title; the list shows name, provider and lifetime, as the privacy draft promises). The writer's note: `analytics.body` names Google Analytics and `marketing.body` Google, Meta and LinkedIn; they're true only once each vendor's ID is set, so if one isn't live at launch, that approved line needs the owner's change.
  - `ConsentBanner.tsx` (server): an `<aside>` named by its title, after the skip link in `SiteShell`; Accept all, Reject all (same size and weight, checked by e2e), Choose settings; the policy link once R006 is live. Shown only under `data-consent="ask"`: in the first frame, before any of the site's JavaScript (e2e aborts every chunk and still sees it). `glass-frost` with the **muted** tint, more opaque behind a paragraph and the tint `check:contrast` gates the link colour on (the plain tint isn't gated for links).
  - `ConsentSettings.tsx` (client, imported on open): a modal `<dialog>`, full height on a phone and a centred panel over a dim from 640 px; Essential as "Always on", Analytics and Marketing as switches with their On/Off beside them; each group's cookies and storage for the vendors in use plus the site's own (`dz-consent` 12 months, `dz-theme` and `dz-effects` until cleared); Save, Accept all, Reject all; the "Saved" line comes back for a status message.
  - `Switch` gained a controlled variant (`checked`, `onCheckedChange`); the display switches are unchanged.
  - `TrackingRuntime.tsx` (client), mounted once by `SiteDocument`: one delegated listener for the banner's buttons and the footer's Cookie settings; the settings panel by `lazy()`; `--dz-consent-height` from a ResizeObserver; `data-tracking="ready"`. **Focus:** after a choice in the banner, focus goes to `<main>`. After a choice saved in the panel opened from the banner, it goes there too, decided by the opener: the closing dialog can't hand focus back to the banner's button, which is already leaving, and React then removes the panel, so focus would land on `<body>` (found in a browser trace). Opened from the footer, focus returns to the footer's button.
  - The footer: "Cookie settings" at the legal line's inline end, for every visitor, hidden in place until the runtime starts.
  - `env.ts` parses `NEXT_PUBLIC_GTM_ID` and the `NEXT_PUBLIC_GTM_AUTH`/`NEXT_PUBLIC_GTM_PREVIEW` pair now (planned for B6): the panel needs to know whether GTM is on, to list the vendors in use.
  - `vendors.ts` gained each vendor's cookies for the list (GA4's `_ga` and `_ga_<container-id>`, 24 months, from Google's own page, support.google.com/analytics/answer/11397207) and the cookies deleted on withdrawal (`_ga`, `_ga_*`; `_fbp`, `_fbc`; `li_fat_id`). Meta's and LinkedIn's list rows wait until their IDs arrive and their pages are read (none is in use); the `external-sources.md` row for GA4's cookies is proposed at C4.
  - **The taxonomy split** (`taxonomy.ts`): `EVENT_PARAMS` (what the browser needs to check each value) and `EVENT_DETAILS` (who fires it, GA4, key events, vendor mappings: for the generator, the tests and people), so no documentation text ships to visitors; `taxonomy.test.ts` keeps their keys equal.
  - **Tokens** (`tokens.css`, allowed when the banner needs one): `--dz-consent-width` 28rem, `--dz-consent-dialog-width` 36rem, `--dz-consent-height` 0rem (the runtime's value), `--dz-scrim` (navy at 64%).
  - **CSS** (`effects.css`): the banner (fixed, `--dz-layer-consent`, safe areas, a corner panel at the inline end from 640 px, a 250 ms fade out after a choice, at once under Reduce effects); the outline buttons (forced colours: `ButtonText`); the sticky bar hidden while the banner asks; the scroll reserve (`scroll-padding-block-end` and the body's end padding take the banner's height); the dialog and its table; the footer button hidden until ready.
  - **Measured in a browser** (DE, 360 × 640): the banner 313 px high from y 327; the H1 ends at y 238. At 1280 × 800: a 448 × 241 px corner panel.
  - **Tests:** `tests/e2e/consent.spec.ts`, 15 cases: first frame without JavaScript and clear of the H1; Accept all and Reject all (Consent Mode, `consent_update` once, focus, reload); equal buttons; the dialog (Esc, focus return, Save with one group); the sticky bar giving way and returning; a 390 px Tab walk never under the banner; the skip link before the banner; Reduce effects and forced colours; RTL; axe with the banner and with the dialog; JavaScript off; a UAE visitor's Cookie settings (both on; Analytics off deletes a seeded `_ga`); the storage list. `env.test.ts` covers the GTM variables.
  - Gates: `verify:fast` exit 0; `test` 326 passed; `build` exit 0; `test:e2e` 160 passed; `format:check` passed.
  - **Not measured yet:** Home's JavaScript and lhci, at B6 and B8. A first look at the build: Home's modern scripts are 143,743 B gzip (level 6, contents only). A same-method build of `main` in a temporary worktree failed (Turbopack refuses a linked `node_modules`), so the comparison waits for lhci against part A's 147,736 B.
Phase: P3
Branch: three parts, one merge each (Q1): `feat/p3-analytics-consent` (part A, already holds the owner's three docs commits), then `feat/p3b-consent-tracking` and `feat/p3c-gtm-container`, each from `main` after the previous merge
Page tier: T1. Everything here is sitewide (the document, the shell, the banner). It's measured on Home and the review page, as in P2.

**The three parts** (Q1):
- **A · The P2 tidy:** the seven small fixes from 0019's Consequences, and the opening hours in the footer. Small, merged first.
- **B · Consent and tracking in the site:** the taxonomy, `trackEvent()`, the region hint, the consent defaults, the banner and Cookie settings, the page-view tracker, click-ID and UTM capture, GTM through `@next/third-parties`, the CSP, the tests, the legal drafts.
- **C · GTM and GA4 from the taxonomy, and the phase exit:** the generated container and GA4 tables with their parity test, the format check in a throwaway container, the tracking guide's Part B, the real import with your IDs, the measured third-party cost, decision 0021.

---

## Goal served

*"…turns UAE business owners into booked AI audits, and proves every claim it makes."* P3 makes the audit funnel measurable (`generate_lead` primary; `book_call_click` and `contact_click` secondary), so every later page can be judged by booked audits. It does that without breaking the site's two other promises: the speed rules (07) and honest privacy wording (N3, the privacy policy says exactly what runs).

## Context

- **04 §2, P3:** `trackEvent()`, the event taxonomy, GTM via `@next/third-parties`, Consent Mode v2, click-ID capture. Exit gate: tracking e2e green + the owner's GTM checklist.
- **The owner's decisions (2026-10-02),** recorded in the tracking guide §1 and the pre-launch register:
  1. **A consent banner for Europe only.** Visitors from the EEA, the UK and Switzerland see the banner, and nothing that measures or advertises runs until they press Accept. Everyone else gets analytics and ad tracking on by default, with no banner. This differs from 09 §2.7 (C52 below).
  2. **Conversions as proposed:** `generate_lead` primary; `book_call_click` and `contact_click` secondary; a confirmed Cal.com booking later, server-side through n8n.
  3. **P3 starts with the P2 tidy:** the seven fixes, and the opening hours in the footer (approved, with `siteConfig`, its test and footer.md).
- **The tracking-parity rule** (the owner, 2026-10-01): every event, trigger, parameter and conversion name is identical in the code and in GTM, GA4, Meta, LinkedIn and Google Ads. One taxonomy in the code is the source; the GTM container and the GA4 tables are generated from it, with a test that keeps them in step.
- **0019 hands P3:** the init script allowed by the CSP; the logo's `<image>` needs `img-src 'self'`; consent defaults in the code before GTM, never also in a GTM template; the sticky bar gives way to the consent banner (conversion-path.md).
- **What isn't here yet:** your Part A IDs (GTM-, G-, Meta, LinkedIn, Google Ads) and your answers to the guide's questions 3–7 (which ad platforms). The plan works without them: nothing third-party loads until an ID is set (section J), and part C's last step runs when they arrive.

## Verified (2026-10-02)

Installed: Next.js 16.3.7, React 19.3.0, TypeScript 6.0.3, Node 24 (package.json). Each line is VERIFIED from the named source unless it says NOT VERIFIED.

**The installed Next.js** (`node_modules/next/dist/docs/`, `node_modules/next/dist/`):
- `next.config` `headers()` `has` values are regular expressions, anchored (`^…$`, `shared/lib/router/utils/prepare-destination.js`). For one header key, a later rule overrides an earlier one, except `Set-Cookie`, which is appended (`server/lib/router-utils/resolve-routes.js`).
- **Proxy** (the renamed middleware, `proxy.ts`): Node.js runtime only, `edge` throws (`upgrading/version-16.md`, `proxy.md`). It keeps pages static, but every matched request is a function call.
- **CSP** (`02-guides/content-security-policy.md`): nonces "must use dynamic rendering". The static option, experimental SRI, adds `integrity` to external chunks only (`server/app-render/required-scripts.js`). This repo's built `index.html` holds inline scripts that change per page and per build (`self.__next_f.push(…)`). So a policy without `'unsafe-inline'` would block them unless each page's inline scripts were hashed (inference from the source; checked in a browser at step B7).
- **`@next/third-parties`:** not installed. The registry has `16.3.7` (peers `next ^13–^16`, `react ^18.2 || ^19`; one dependency, `third-party-capital@1.0.20`). Its `GoogleTagManager` is a client component that renders two `next/script` tags with the default `afterInteractive` strategy: an inline `gtm.start` push and `gtm.js?id=…` (with `gtm_auth`/`gtm_preview` when given), plus a `performance.mark` in an effect. `gtm.js` is **762 B** gzip on its own; the `google` entry is a CommonJS barrel that also exports `ga.js` and the embeds, so the real bundle cost is measured at step B6 (NOT VERIFIED until then).

**Vercel** (vercel.com/docs):
- `x-vercel-ip-country` is the visitor's ISO 3166-1 alpha-2 country (request headers page). It isn't set in local development; that the CDN overwrites a client's own value is said by Vercel staff on the community forum only (PARTLY VERIFIED).
- `has` on `x-vercel-ip-country` is documented for redirects and rewrites, and "Vercel's CDN evaluates routing rules on every request before checking any cache or invoking your functions" (routing). Seen today on production: our `next.config` headers arrive on cached responses (`X-Vercel-Cache: HIT` with `X-Robots-Tag`).
- One of the CDN cache's conditions is "Response doesn't contain the `set-cookie` header" (cdn-cache). Whether a cookie added by a route rule stops a prerendered page being cached: NOT VERIFIED.
- Routing Middleware (a Next.js proxy on Vercel) runs on Node.js, priced per invocation plus CPU and memory; which regions it runs in: NOT VERIFIED.

**Google, GTM, GA4** (developers.google.com, support.google.com):
- Consent Mode: `gtag('consent','default',{…})` before any tag; a default with `region` (ISO 3166-2) covers that region, one without covers the rest; Google infers the region from the IP. Types never set count as `granted`, so every type gets an explicit default.
- **Basic consent mode:** tags are blocked until the visitor chooses, and nothing is sent. Built-in consent checks exist only on Google's tags; "non-Google tags will not change their behavior based on consent mode", so Meta and LinkedIn get "Require additional consent" in GTM.
- **No retroactive firing:** "Even if consent is later granted, the tags don't fire unless consent is granted when they were first triggered." A fresh trigger event is needed after Accept (Google doesn't spell out the fix).
- GA4 names: case-sensitive, a letter first, letters, digits and `_`; 40 characters for event and parameter names, 100 for values (page_title 300, page_referrer 420, page_location 1000); 25 parameters per event; 50 event-scoped custom dimensions; 30 key events. Reserved web event names include `page_view`, `click`, `scroll`, `file_download`, `form_start`, `form_submit`, `session_start`, `first_visit`, `user_engagement`; reserved parameter names include `gclid`, `cid`, `uid`, `user_id`, `session_id`, `currency`; reserved prefixes `_`, `firebase_`, `ga_`, `google_`, `gtag.`.
- `page_path` isn't a GA4 field (the Page path dimension comes from `page_location`). `content_group`, `page_location`, `page_title`, `page_referrer` and `update` are documented Google tag fields (config reference). Single-page sites in GTM: a Google tag with `page_location`, `page_title` and `update: true`, sequenced before a GA4 Event tag named `page_view`; `page_referrer` left to GA4.
- `generate_lead` is a recommended event (`value`, `currency`, `lead_source` optional). Key events can be marked ahead of time, before the event arrives (the exact menu is checked when Part B is written).
- **The GTM export file's top level** (`exportFormatVersion`, `containerVersion`…) **isn't documented.** The `ContainerVersion`, `Tag`, `Trigger`, `Variable` and `Parameter` resources of the GTM API v2 are. Type IDs: GA4 Event `gaawe`, Conversion Linker `gclidw`, Custom HTML `html`, Data Layer Variable `v`, Custom JavaScript Variable `jsm`; the Google tag is listed as `gaawc` (exports seen elsewhere use `googtag`: NOT VERIFIED). The keys inside each tag type aren't documented: an exported real tag is the only reliable source (section L).
- **Meta's own GTM instructions** use Custom HTML tags (base code, then `fbq('track', …)` per event). **LinkedIn's** use the Community Template Gallery's "LinkedIn InsightTag 2.0" (it exports as a `customTemplate`), with a GTM conversion ID per event-specific conversion.
- **CSP** for GTM, GA4, Ads and preview mode: the host lists in Google's CSP guide (section K). LinkedIn lists domains "not to block"; Meta publishes no list (its hosts come from its base code: NOT VERIFIED as a complete list).

## What the read found

1. **The JavaScript budget doesn't say how third-party scripts count.** 07 §2 and lhci's `resource-summary:script:size` count every script, and decision 0014's baseline had none. GTM's own file is tens of KB and the Google tag more, against a Home allowance of 10 KB for our own code. Counting them in would fail every page; leaving them out unmeasured would break N1. **Q3** asks how to budget them.
2. **07 §2 allows "GTM only" before consent or interaction.** For visitors outside Europe consent is granted by default, so GA4 and the ad tags would load at once. **Q4** proposes when each vendor loads for them.
3. **Home's own JavaScript has 2,188 B left** under its 10 KB cap (8,052 B now). The tracker, the consent controller and `@next/third-parties` must fit, so the settings panel and the attribution code load only when needed (section F, I), and the Risks stop on a measured overrun.
4. **A hash-only CSP can't work on static pages** with the installed Next.js (Verified), so 06 §4's "allows it by its hash" can't be done as written. **Q5.**
5. **The GTM import format isn't documented,** so the generator is checked twice against real GTM before your container relies on it (section L, **Q7**).
6. **e2e and lhci have no country.** Without one, the site treats a visitor as European (section B). e2e defaults to a UAE visitor (most of our traffic) and tests Europe explicitly; lhci measures both.
7. **The privacy and consent drafts promise opt-in for everyone** ("Nothing optional runs before a choice", "Cookies only with your OK"). Under decision 1 that's false for visitors outside Europe, so the drafts change with this plan (section N). **Legal note, not re-opened:** the drafts say the UAE PDPL is consent-based for these uses, and the guide said option (b) needed a legal view first. You chose it without one (your standing choice of no external legal review); C52 records it, and the new wording avoids claiming a legal basis we can't show.
8. **The banner can only link to the privacy policy once `/privacy` (R006) is live** (04 §1.4). Until P6 the settings panel names each tool instead.
9. **Client-side navigation can't be tested end to end yet:** only Home is live in the English layout (the review page has its own root layout). The tracker's navigation logic is unit-tested now, and its e2e case is added with the second English page (P6).

---

## Design

### A. The P2 tidy and the opening hours (part A)

The seven fixes (0019 Consequences; your "2, yes"):
1. **Mega menu links:** a space between the service name and its outcome (`{' '}` between the two spans), so text readers and crawlers don't get one run ("WhatsApp AI AgentAnswer…"). Tested by the link's text content.
2. **Home links through the route helper:** `href={routePath('R001')}` in `SiteHeader`, `global-not-found` and `global-error`, never a typed `"/"`.
3. **The sheet's bottom safe-area inset:** the panel's end padding becomes `max(--spacing(6), env(safe-area-inset-bottom))` in `effects.css` (the class's `pb-6` goes), so its last button clears the home indicator.
4. **A unit test that `/shell-review` calls `notFound()` on production** (`VERCEL_ENV=production`), and renders otherwise.
5. **`routes.test.ts`'s duplicate check** covers the footer groups too.
6. **`shell.spec.ts`:** the tiles at 768 px, and in forced colours (each tile keeps a visible border and its letter).
7. **The tile letter's weight as a token,** `--dz-social-letter-weight: 800`, used by `.dz-social-letter`; `check:contrast` reads it, and treats the tiles as large text only while the size and weight still qualify (WCAG: ≥ 18.66 px bold), so changing either can't leave a stale "large" pass.

**The opening hours** (facts §2, CONFIRMED: "Monday to Saturday, 08:00–17:00 GST (UTC+4); closed Sunday"):
- `siteConfig.openingHours = { display, days, opens, closes }`: `display` is the fact byte for byte; `days` (schema.org day names Monday–Saturday), `opens` `'08:00'` and `closes` `'17:00'` are for P4's `openingHoursSpecification`. `site-config.test.ts` checks `display` against the facts file and that the structured parts say the same thing.
- **The footer** shows it in the company block, after the email, as its own line: "Opening hours: Monday to Saturday, 08:00–17:00 GST (UTC+4); closed Sunday". The label comes from `shell.ts` (Content Writer). It's outside `<address>`, which is for contact details.
- **footer.md** (approved): "Business name, address, opening hours and phone".

### B. Where a visitor is: the region hint (recommended option)

**The options, researched** (Verified above):

| Option | Pages stay static | Cost | Stores anything | Verdict |
|---|---|---|---|---|
| Consent Mode's region-specific defaults alone | Yes | None | No | Covers Google's tags only. The banner and the Meta/LinkedIn gating still need the country, so Google and the rest could disagree. Not enough on its own |
| A `next.config` header rule on `x-vercel-ip-country` that sets a **cookie** | Yes | None (CDN rule) | A cookie | Vercel's cache skips responses with `set-cookie`; whether a rule-added cookie does that is NOT VERIFIED. A performance risk on every page |
| The same rule sending a **`Server-Timing`** value the page reads | Yes | None (CDN rule) | Nothing | **Recommended** |
| A `proxy.ts` that reads the country | Yes | A Node.js function call on every page request (paid; region and latency NOT VERIFIED) | A cookie | Fallback only |
| A client request to an endpoint that returns the country | Yes | A request before the banner can show; GTM must wait | No | Rejected: slow, and the defaults must be set before GTM |

**How it works:**
1. Two `next.config` `headers()` rules, built in `src/lib/tracking/region.ts`, on page paths only (not `/_next/` or files with an extension):
   - `x-vercel-ip-country` is one of the 32 EEA, UK and Swiss codes → `Server-Timing: dz-region;desc="eea"`
   - it's any other two-letter code → `Server-Timing: dz-region;desc="row"` (a negative look-ahead, so the two rules never both match and nothing depends on which one wins)
   - The codes: the EU 27 (with Greece as `GR`), Iceland `IS`, Liechtenstein `LI`, Norway `NO`, the UK `GB`, Switzerland `CH`. Google gives no list; this one is ours, cited to the EU's and EFTA's official member lists in `external-sources.md`.
2. The consent init script (section C) reads `performance.getEntriesByType('navigation')[0].serverTiming` before the first paint.
3. **No hint means Europe:** a missing header, an unknown code, or a browser without `serverTiming` (Safari before 16.4, for example) gets the European behaviour (the banner; nothing until Accept). Failing safe costs us some data, never a visitor's consent.
4. Nothing is stored on the visitor's device for this, and a traveller is re-judged on every page load.
5. **Step B2 checks it on a Vercel preview before anything builds on it:** the hint arrives, the page is still `X-Vercel-Cache: HIT`, a request from here (UAE) gets `row`. A European request is checked by you with a VPN (owner checklist), because Vercel sets the header and we can't fake it. **If the hint doesn't reach the browser,** the cookie variant is tried with the same check; only if both fail does it fall back to `proxy.ts`, and I stop and ask first (its cost is per request).

### C. Consent defaults before GTM (`dataLayer[0]`)

**The groups** (consent-copy §5): Essential (`functionality_storage`, `security_storage`: always granted); Analytics (`analytics_storage`); Marketing (`ad_storage`, `ad_user_data`, `ad_personalization`). `personalization_storage` is set `denied` (we use none), so no type is ever left unset.

**The stored choice:** `localStorage` key `dz-consent` (beside `dz-theme` and `dz-effects`): `{ v: 1, a: 0|1, m: 0|1, t: <ms> }`. It holds no personal data. It's ignored when its version isn't the current `CONSENT_VERSION` (bumped when the groups or the banner wording change, so Europe is asked again) or when it's older than 12 months (the privacy policy's promise).

**The init script** (`src/lib/tracking/consent-init.ts`): a static string built only from our constants, like the no-flash script (C40), mounted once by `SiteDocument` in `<head>`:
1. `window.dataLayer = window.dataLayer || []`, and the standard `gtag()` function that pushes its `arguments`.
2. It reads the region hint and the stored choice, then calls `gtag('consent', 'default', {…})` once, so the defaults are `dataLayer[0]` (09 §2.2):

   | Visitor | Stored choice | Analytics / Marketing default | Banner |
   |---|---|---|---|
   | EEA, UK, Switzerland, or no hint | none (or expired) | denied / denied | shown |
   | EEA, UK, Switzerland, or no hint | yes | as chosen | no |
   | Everyone else | none | granted / granted | no |
   | Everyone else | yes (from Cookie settings) | as chosen | no |

3. When the banner is due, it sets `data-consent="ask"` on `<html>`, so CSS shows the banner in the first frame (no late pop-in, nothing moves at load, 13 §2.1).
- **Not used:** Consent Mode's `region` parameter. With our hint already deciding, a second judge (Google's own IP lookup) could disagree with ours and with the Meta/LinkedIn gating. One source keeps every tag and the banner in step.
- **Basic mode, by your decision:** in Europe nothing measures before Accept; GTM itself loads (07 §2) and its tags wait. Every Google tag and every vendor tag in the container gets "Require additional consent" (section L), so even Google's tags send nothing, not even cookieless pings.
- `consent-init.test.ts` runs the same string against fake browser objects (as `init-script.test.ts` does) over every region × stored-choice case, including a storage that throws and a browser without `serverTiming`.

### D. The banner (first layer, Europe only)

- **Server-rendered** by `ConsentBanner.tsx`, hidden by CSS unless `<html data-consent="ask">`. It's an `<aside>` named "Cookie choice" (a landmark, so axe's `region` rule holds), placed in `SiteShell` right after the skip link: first in the reading and Tab order, but it never takes focus by itself.
- **Copy** from consent-copy §1 (approved), moved to `src/content/en/legal/consent.ts` by the Content Writer with its stable IDs: the title (a `<p>`, not a heading, so no page's outline changes), the body, **Accept all** and **Reject all** (the same size and weight, neither on the action gradient), **Choose settings**. "Read our privacy policy" appears once R006 is live (`isLive('R006')`), never before.
- **The look:** `glass-frost` (not consent-copy's `glass-live`): it sits over the whole scrolling page, and on phones the header pill is already the one live blur (the sticky bar's reasoning, conversion-path.md). Solid surface in forced colours. Tokens only; logical properties; `--dz-layer-consent`; safe-area padding like the sticky bar.
- **Size:** full width below 640 px, a bottom-inline-end panel above. At 360 × 640 it must not cover the H1 (e2e), and P5 keeps the hero CTA clear of it.
- **The sticky CTA bar gives way:** while `data-consent="ask"`, the bar is hidden (CSS), and the page's end padding and `scroll-padding-block-end` take the banner's height (a `--dz-consent-height` custom property set by the controller), so a focused control never ends up under the banner (WCAG 2.4.11, the cookie-banner case its Understanding page names). The C42 hand-off is unchanged: the banner has no gradient CTA.
- **On a choice:** the choice is stored, consent is updated (section E), `data-consent` goes, and focus moves to `<main>` if it was inside the banner, so it's never lost. The banner leaves with a 200 ms opacity and transform fade (the visitor's action); instantly under Reduce effects.
- **No JavaScript:** the inline script doesn't run, so no banner and no GTM: nothing to consent to.

### E. Cookie settings (second layer) and changing a choice

- **"Cookie settings"** is a button in every footer's legal line (consent-copy principle 4, `footer.cookieSettings`), for every visitor: outside Europe it's how tracking is switched off. Like the display switches, it's hidden in place until the runtime starts.
- **The panel** (`ConsentSettings.tsx`, a client component) loads only when opened, from "Choose settings" or the footer button, so it costs nothing at first load. It's a modal `<dialog>` (`glass-live`, allowed for modals, 13 §4.1), with the copy from consent-copy §2: Essential (always on, shown as a locked state), Analytics and Marketing as switches (the `Switch` component, extended), **Save my choices**, **Accept all**, **Reject all**. Esc and the close button close it; focus returns to the button that opened it.
- **The cookie list** (privacy draft, Part 3 note 1): each group lists the tools and their first-party cookies and storage (name, provider, lifetime), from `vendors.ts`, **for the vendors that have an ID only**, so the list names exactly the tools the container runs. Each vendor's cookie names and lifetimes are read from its official page at step B4 and proposed as `external-sources.md` rows for your approval; until a row is APPROVED, that vendor's line names the tool and links nothing.
- **Applying a choice** (`consent.ts`): store it; `gtag('consent', 'update', {…})`; then one `trackEvent('consent_update', …)` that says which groups were newly granted, so GTM can fire the page's tags that were blocked (section L). Withdrawing a group also deletes that group's first-party cookies that `vendors.ts` lists (`_ga`, `_ga_*`, `_fbp`…), so "Off" is real.

### F. The taxonomy and `trackEvent()`

**One source:** `src/lib/tracking/taxonomy.ts`, APPEND-ONLY (09 §2.4). Each entry holds the event name, its parameters with their types (a closed set of values where possible), whether it goes to GA4, whether it's a key event (primary or secondary), and its vendor mapping (Meta standard event, LinkedIn conversion). The TypeScript types for `trackEvent()` are derived from it, the GTM container and the GA4 tables are generated from it (section L), and a generated human table replaces the hand-written one in 09 §3 (`docs/owner/tracking/taxonomy.md`).

**The finalised taxonomy** (proposed for 09 §3; event names unchanged, 09 §2.4):

| Event | Fired by (phase) | To GA4 | Key event | Parameters | Change from the draft |
|---|---|---|---|---|---|
| `page_view` | The tracker: each page load and client navigation (P3) | Yes | — | `page_location`, `page_title`, `content_group` | `page_path` → `page_location` (GA4 has no `page_path`; it derives the path); `page_type` → `content_group` (a documented Google tag field with a built-in dimension, so no custom dimension). The value is the registry's page type (`home`, `legal`…) |
| `cta_click` | Any CTA, by its `data-cta` attribute (P3) | Yes | — | `cta_id`, `cta_location` | — |
| `audit_start` | The audit form, first field (P6) | Yes | — | `form_id` | `source_page` → `form_id`: GA4 records every event's page itself |
| `generate_lead` | The audit form, sent successfully (P6) | Yes | **Primary** | `form_id`, `service_interest` | — (no `value`: we have no real lead value, N3) |
| `book_call_click` | The booking sheet opened (P7) | Yes | Secondary | `cta_location` | `source_page` → `cta_location` |
| `contact_click` | Any `mailto:`, `tel:` or `wa.me` link (P3) | Yes | Secondary | `method` (`email`, `phone`, `whatsapp`) | — |
| `demo_open` | P7 | Yes | — | `demo_id` | — |
| `agent_message_sent` | P7 | Yes | — | `turn` (number) | — |
| `calculator_complete` | P7 | Yes | — | `industry` | — |
| `speed_test_request` | P7 | Yes | — | `form_id` | `source_page` → `form_id` |
| `view_service` | P6 | Yes | — | `service_slug`, `pillar` | — |
| `pricing_view` | P6 | Yes | — | — | — |
| `case_study_view` | P8 | Yes | — | `case_slug` | — |
| `faq_expand` | P5/P6 | Yes | — | `faq_id` | — |
| `outbound_click` | A link to another site that isn't a contact link (P3) | Yes | — | `destination_domain` | — (kept: GA4's own outbound clicks stay **off**, guide A3.7; its `click` event would also count `wa.me` contact links, and it isn't in our taxonomy) |
| `newsletter_signup` | Later | Yes | — | `form_id` | `source_page` → `form_id` |
| `consent_update` | A consent choice (P3) | **No** (GTM only) | — | `consent_analytics`, `consent_marketing` (`granted`/`denied`), `consent_granted_now` (`analytics`, `marketing`, `analytics marketing` or `none`) | **New** (consent-copy §5 asked P3 to name it) |

- **`page_view` is a reserved GA4 name** and is used exactly as GA4 means it, through Google's documented manual page-view method (the Google tag sends no page view of its own).
- **Checks** (`taxonomy.test.ts`): names match `^[a-z][a-z0-9_]{0,39}$` and `<object>_<action>`; no reserved event name except `page_view`; no reserved parameter name or prefix; ≤ 25 parameters per event; ≤ 50 custom dimensions and ≤ 30 key events in total; exactly one primary key event; no parameter that could hold free text.

**`trackEvent(name, params)`** (`src/lib/analytics.ts`, 09 §2.3):
- Typed by the taxonomy: an unknown event, a missing or extra parameter, or a wrong value type fails `typecheck`.
- Pushes `{ event, ...params }` to `window.dataLayer`, **after yielding to the main thread** (a `setTimeout(0)`), so GTM's synchronous tag work never lands inside a click's input delay (INP).
- Strings are trimmed to GA4's limits (100; `page_location` 1000, `page_title` 300). A string that looks like an email address or a phone number is dropped, with a console warning outside production (09 §2.6, defence in depth: no parameter is free text in the first place).
- Nothing else in the site calls `gtag`, `sendGTMEvent`, `fbq` or `lintrk`, except `consent.ts`'s one `gtag('consent', …)` call.

### G. The tracking runtime

`TrackingRuntime.tsx`: one client island, mounted once by `SiteDocument` (09 §2.9, 02 §3.8), in a `<Suspense>` boundary as 09 §2.9 asks. It renders nothing except the lazily loaded settings panel when it's open.
- **Page views:** on load and on each `usePathname()` change, it pushes `page_view` once, after a frame, so the new page's title is in place. `page_location` is `location.href` (GA4 reads UTM tags from it), `content_group` comes from the route table (`routes.ts` gains each row's registry type; `not_found` for unmatched paths). A repeat for the same location is skipped, so nothing fires twice.
- **Clicks, delegated** (one listener on `document`, no code per component, like `src/lib/fx/`):
  - an element with `data-cta` → `cta_click`, `cta_id` from `data-cta-id` (`CtaButton` sets it; today `book_audit`), `cta_location` from where it sits (`header`, `sheet`, `sticky`, `finale`, otherwise `page`)
  - a `mailto:`, `tel:` or `wa.me` link → `contact_click` with its `method`. While R002 isn't live, the audit CTA is a `mailto:` link, so its click sends both `cta_click` and `contact_click`: two different events, each once
  - any other link to another host → `outbound_click` with its `destination_domain` (the footer's social tiles today)
- **The banner and Cookie settings:** the buttons (`data-consent-action`) through the same listener; the settings panel is imported when first opened.
- **Click IDs and UTM tags** (09 §2.8), section I.

### H. GTM through `@next/third-parties`

- `TagManager.tsx` renders `<GoogleTagManager gtmId auth preview />` from `@next/third-parties/google` (09 §2.1), mounted once by `SiteDocument` after the consent init. Strategy `afterInteractive` (the component's default): normal priority, never idle-deferred (09 §2.2, L6).
- **Only when `NEXT_PUBLIC_GTM_ID` is set** (section J). Without it, no GTM and no third-party request at all.
- **Size:** measured at step B6 from the build (lhci's script size minus the baseline). If the `google` barrel pulls in more than the GTM component, `experimental.optimizePackageImports: ['@next/third-parties']` is tried in `next.config.ts` and measured again. `OWN_JS_HOME` rises by the measured amount, within the 10 KB cap (the Risks stop).

### I. Click IDs and UTM tags (09 §2.8)

- **Captured:** `gclid`, `gbraid`, `wbraid`, `fbclid`, `li_fat_id`, `msclkid`, and `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`. Each value is checked against a character allowlist and cut to 200 characters.
- **First touch and last touch:** `dz-attribution-first` (written once) and `dz-attribution-last` (replaced on each landing that has any of the keys), in `localStorage`, each with the landing path and a time; dropped after 90 days.
- **Only with Marketing consent** (granted by default outside Europe): until then the values are held in memory only, and written if Accept comes on the same page.
- `readAttribution()` is what P6's forms use for their hidden fields and the n8n payload (n8n guide §8.1). P3 has no form, so it's unit-tested here and used in P6.
- **Cost:** the runtime only checks `location.search` for a known key; the capture module is imported when one is present.

### J. The IDs while you haven't sent them

| ID | Where it lives | Until it's set |
|---|---|---|
| GTM container (`GTM-…`) | `NEXT_PUBLIC_GTM_ID` (env: it differs per environment). `env.ts` validates it (`GTM-` + 4–10 letters or digits) and the `NEXT_PUBLIC_GTM_AUTH`/`NEXT_PUBLIC_GTM_PREVIEW` pair (both or neither) for a GTM environment on previews | No GTM, no third-party request. The consent layer still runs, so the banner, the defaults and the events are built and tested |
| GA4 (`G-…`), Meta dataset, LinkedIn Partner ID and conversion IDs, Google Ads customer ID | `src/lib/tracking/accounts.ts`, `null` until you send them (public IDs, not secrets; the guide's §0 table: "Site settings, Claude enters what you send") | The generator leaves that vendor out of the container, the CSP leaves out its hosts, and the cookie list leaves out its cookies. With no GA4 ID it writes no container at all, only the GA4 tables |

You add `NEXT_PUBLIC_GTM_ID` in Vercel (Production; Preview optional with a GTM environment), as the guide's Part B will say click by click. CI gets the same public ID in `ci.yml` at step C5, so lhci measures the real container.

### K. The CSP decision (Q5; 06 §4)

**Recommended: enforce now,** as `Content-Security-Policy`, built in `security-headers.ts` from `vendors.ts` (the vendors with an ID only):
- `default-src 'self'`; `script-src 'self' 'unsafe-inline'` + GTM and the enabled vendors' script hosts; `style-src 'self' 'unsafe-inline'`; `img-src 'self' data: blob:` (the logo's `<image>`, 0019) + vendor pixel hosts; `font-src 'self'`; `connect-src 'self'` + vendor collection hosts; `frame-src 'self' https://www.googletagmanager.com`; `frame-ancestors 'self'`; `base-uri 'self'`; `form-action 'self'`; `object-src 'none'`; `upgrade-insecure-requests`.
- **GTM preview mode** (your Part B test) adds Google's documented hosts: `tagmanager.google.com`, `fonts.googleapis.com`, `fonts.gstatic.com`, `ssl.gstatic.com`, `www.gstatic.com`.
- **No hash for the no-flash script, and no nonce:** a hash or nonce turns `'unsafe-inline'` off in every current browser, and then Next.js's own per-page inline scripts are blocked; nonces also force dynamic rendering (Verified). Both init scripts stay static strings built from our constants (C40), so a hash-based policy remains possible if Next.js ever hashes its inline scripts.
- **What enforcing still buys:** scripts, pixels and requests only to the hosts we list (a tag added by hand in GTM, or a compromised one, can't reach an unlisted host), no plugins, no `<base>` hijack, no framing by other sites, forms only to us. It also enforces the tracking-parity rule: a vendor that isn't in `vendors.ts` is blocked.
- **Never `'unsafe-eval'`:** the generated container has no Custom JavaScript Variables (the parity test forbids `jsm`).
- The current report-only header goes (it has no endpoint, so it reports to no one). `security-headers.test.ts` checks the policy; an e2e test fails on any `securitypolicyviolation` on Home and the review page; your Part B test adds "no Content-Security-Policy errors in the console" for the real tags.

### L. The generated GTM container and GA4 tables (part C)

**The generator,** `npm run tracking:build` (`scripts/build-tracking.mjs`, reading the TypeScript sources through Node 24's own loader, as `next.config.ts` reads `env.ts`), writes:
- `docs/owner/tracking/deepzeta-gtm-container.json`: the import file (only once a GA4 ID exists)
- `docs/owner/tracking/ga4-setup.md`: the custom dimensions (event scope; the dimension name equals the parameter name, so there's one name to copy), the key events (primary and secondary), and the Google Ads method (Q6)
- `docs/owner/tracking/taxonomy.md`: the human table 09 §3 points to
- Deterministic output: no build time (02 §1.5); fixed IDs and order.

**What the container holds** (each from the taxonomy):
- **Variables:** one Data Layer Variable per parameter; constants for each vendor ID; a lookup on Page Hostname giving `traffic_type = internal` everywhere except `deepzeta.ai` and `www.deepzeta.ai`, so previews and CI never count in your reports once the Internal Traffic filter is Active (guide B7).
- **Triggers:** one Custom Event trigger per taxonomy event, named exactly as the event; and the **after-Accept triggers**: `consent_update` where `consent_granted_now` contains `analytics` (or `marketing`).
- **Tags, every one with consent settings:**
  - **The Google tag** (GA4 ID): `send_page_view` false, `traffic_type`; fires on Initialization and on the analytics after-Accept trigger; requires `analytics_storage`.
  - **The page-view pair,** Google's single-page-site method: a Google tag update (`page_location`, `page_title`, `content_group`, `update: true`) sequenced before a GA4 Event tag `page_view`; fires on `page_view` and on the analytics after-Accept trigger (the page's view, blocked before Accept, is sent once then).
  - **One GA4 Event tag per GA4 event,** with exactly that event's parameters (per-event tags, so a parameter left in the data layer by an earlier event can't leak into another).
  - **Meta** (if its ID is set): Meta's own GTM method, Custom HTML: the base code with `PageView` on `page_view` and the marketing after-Accept trigger, then `fbq('track', …)` per mapped event (`generate_lead` → `Lead`, `contact_click` → `Contact`); requires `ad_storage`; production host only.
  - **LinkedIn** (if its Partner ID is set): LinkedIn's "InsightTag 2.0" gallery template on `page_view` and the marketing after-Accept trigger, plus an event-specific conversion tag per conversion ID you send; requires `ad_storage`; production host only.
  - **Google Ads:** nothing in the container under Q6's recommendation (GA4 key events imported into Ads).
  - Meta and LinkedIn fire only on the production host, and, for visitors outside Europe, on the window's load rather than at once (Q4).
- **What's never in it:** a consent or cookie-banner template (the site sets consent, guide mistake 6), Custom JavaScript Variables, any tag without consent settings, any name that isn't in the taxonomy.

**Keeping them in step** (`tracking-artifacts.test.ts`, run by `npm run test`):
- The committed files equal a fresh generation (the failure says "run `npm run tracking:build`").
- Every taxonomy event has a trigger with its exact name; every GA4 event has a tag whose event name and parameters equal the taxonomy's; every parameter has a variable; every `{{reference}}` resolves; every tag has consent settings; no `jsm` variable; no vendor without an ID; the GA4 tables list exactly the taxonomy's custom parameters and key events.
- **The privacy parity check, automated:** the vendors in the container equal the vendors in the cookie list and in the CSP (the pre-launch register row "the policy names exactly the tools in the container").

**Checking the import before it's relied on** (the format isn't documented; Q7):
1. **A reference export (step C1, you, about 15 minutes):** in a throwaway container, you build by hand one of each tag type the generator writes (the Google tag, one GA4 Event tag with one parameter and "Require additional consent", one Custom Event trigger, one Data Layer Variable, one Custom HTML tag, the LinkedIn gallery template if you use LinkedIn), with test IDs, then **Admin → Export Container** and send me the file. It contains no real IDs. The generator copies its exact shape (type IDs such as `gaawc` or `googtag`, parameter keys, the export's top level), and it's committed as a test fixture.
2. **A test import (step C3, you, about 10 minutes):** you import the generated file (built with test IDs) into a second throwaway container with **Overwrite**; "View detailed changes" must show the counts the generator prints; then you export it again and send me that file. A test checks that GTM's export of our import equals our file (ignoring the IDs GTM assigns). Then you delete both throwaway containers.
3. Only then the real import into your container (guide B1).

### M. Tests (09 §4)

**Unit (Vitest):** `taxonomy`, `analytics` (the push shape; types reject unknown names; trimming; the PII guard; the yield), `consent` (storage, version, 12-month expiry, update, cookie deletion on withdrawal), `consent-init` (every region × stored-choice case), `region` (the 32 codes, the rules, the two regexes never both match), `attribution` (first and last touch, sanitising, 90 days, the consent gate), `env` (the GTM variables), `security-headers` (the CSP from the vendors), `tracking-artifacts` (section L), `tag-manager` (renders nothing without an ID; the ID, auth and preview when set), `shell-review` (fix 4), `routes` (types and the footer lists), `site-config` (hours), `check-contrast` (the weight token).

**E2E (Playwright, production build):**
- **The default visitor is in the UAE:** the e2e project sends `x-vercel-ip-country: AE` (in `playwright.config.ts`), so P2's tests keep their meaning. European cases send `DE`.
- **A non-European visitor (AE):** no banner; `dataLayer[0]` is `consent default` with every non-essential type granted; one `page_view` with the right location, title and `content_group`; no GTM request while `NEXT_PUBLIC_GTM_ID` is unset; Cookie settings opens, switching Analytics off sends `consent_update` and deletes a seeded `_ga` cookie; a reload keeps the choice.
- **A European visitor (DE):** the banner is visible in the first frame (`data-consent="ask"` before hydration); `dataLayer[0]` denied; no third-party request; Accept all → the stored choice, a `consent update` to granted, exactly one `consent_update` with `consent_granted_now` `analytics marketing`, the banner gone and focus in `<main>`; a reload shows no banner and grants by default; Reject all → denied and `consent_granted_now` `none`; Choose settings → the dialog's keyboard behaviour (focus trap, Esc, focus return), Save.
- **Events exactly once:** the header CTA → one `cta_click` (`book_audit`, `header`) and one `contact_click` (`email`); the sticky bar's and the finale's CTA with their locations; a social tile → one `outbound_click` (`linkedin.com`).
- **Attribution:** `/?utm_source=test&gclid=TEST` stores first and last touch for AE; for DE nothing until Accept, then both.
- **The banner's place:** at 360 × 640 it doesn't cover the H1; the sticky bar is hidden while it shows and back after the choice; a Tab walk with the banner open never leaves a focused control under it; Reduce effects, forced colours, the light theme and RTL; axe with the banner and with the dialog (0 serious or critical).
- **CSP:** the enforced header is there, and Home and the review page raise no `securitypolicyviolation`.
- **With GTM** (from step C5, when CI has the ID): `gtm.js` is requested once with the right ID, after `dataLayer[0]`; Playwright answers it with a stub, so tests never reach Google and never create data.
- `page_view` on a client navigation joins with the second English page (P6).

### N. The legal drafts and the owner documents

**Proposed wording** (the drafts were approved by you on 2026-09-29, so these changes need your approval with this plan):

*privacy-policy.md:*
- **Hero direct answer** (57 words): "{brandName} collects only the personal data it needs to answer your enquiry and deliver your project, and never sells it. Analytics and marketing cookies wait for your permission if you visit from the EEA, the UK or Switzerland; elsewhere they're on until you switch them off in Cookie settings. Email {email} to use your UAE PDPL rights."
- **At a glance,** "Cookies only with your OK" → **"Cookies you control"**: "We ask first in the EEA, the UK and Switzerland. Anywhere, you can switch them off at any time."
- **§3 Technical data,** "Analytics data only with your consent." → "Analytics data: with your consent if you're in the EEA, the UK or Switzerland; elsewhere unless you switch it off."
- **§4,** "Automatically…": "through essential cookies and, if you allow them, analytics and marketing cookies (§9). If you visit from outside the EEA, the UK and Switzerland, analytics and marketing are on until you switch them off."
- **§5 table,** the basis for analytics and for ad measurement: "Your consent in the EEA, the UK and Switzerland; elsewhere, your choice: on unless you switch it off". (No legitimate-interest wording: the draft itself says the PDPL has no such basis.)
- **§9 intro,** "Only essential ones run before you choose." → "Essential ones always run. If you visit from the EEA, the UK or Switzerland, analytics and marketing wait for your choice; elsewhere they're on until you switch them off." **Table D's Default column:** "Off until you allow it" → "Off until you allow it in the EEA, the UK and Switzerland; on elsewhere". **"Changing your choice":** "…We remember your choice for 12 months." ("then ask again" goes: only European visitors are asked).
- **§12 Table E,** a row: "How you found us (campaign tags and ad click IDs, in your browser) · 90 days".
- **FAQ Q3:** "Yes. Essential cookies keep the site secure and working. Analytics and marketing cookies wait for your permission if you visit from the EEA, the UK or Switzerland, and are on elsewhere. You can change your choice at any time from "Cookie settings" at the bottom of every page."
- **§18:** "Where we rely on your consent or your choice (analytics and marketing cookies, marketing emails, WhatsApp follow-ups you opted into)…"
- **Part 3, note 2:** "For visitors from the EEA, the UK and Switzerland, no analytics or marketing tag runs before consent; for others they run until switched off. Server-side conversion events go only for leads whose consent state at sending includes Marketing (chosen, or the default outside Europe)."
- The "How this draft differs" table's ad-networks row: "Only with marketing consent in the EEA, the UK and Switzerland; on by default elsewhere, and stated plainly (§9)".

*consent-copy.md:*
- **Principle 1** → "**In the EEA, the UK and Switzerland, nothing optional runs before a choice.** Elsewhere analytics and marketing are on by default and can be switched off at any time in Cookie settings (owner, 2026-10-02; C52)."
- **Principle 4:** "Cookie settings" sits in every footer, for every visitor.
- **§1:** shown only to visitors from the EEA, the UK and Switzerland; `glass-frost`, with the reason; the policy link once `/privacy` is live. The banner's own text is unchanged: it's only shown where it's true.
- **§5:** "the defaults apply to every region" → the region table of section C; the names decided here (`dz-consent`, `CONSENT_VERSION` 1, the `dz-region` hint, which stores nothing, and the `consent_update` event); "Server-side conversions" as in the privacy Part 3 note.

*Owner documents (not protected):*
- **n8n guide §8.1:** one line under the payload: `consent_ads` is `true` when the visitor's consent state at sending includes Marketing (chosen, or the default outside Europe); n8n sends server-side conversions only then. No workflow step changes.
- **The tracking guide:** §1's banner note points to this design; a new **A8** (the reference export, click by click); a new **B0** (the test import and re-export); **B1**'s counts come from the generator's output; **B2**'s test script covers a non-European visit (no banner, tags fire) and a European one (with a VPN: denied until Accept, then the page's tags fire once), and adds "no Content-Security-Policy errors in the console"; **B4/B5** point to `ga4-setup.md` (key events marked ahead of time); **B8** names one Google Ads method (Q6); the sources list gains the pages read for this plan.
- **The pre-launch register,** new rows: the region check from Europe with a VPN; the reference export and the test import (part C); `NEXT_PUBLIC_GTM_ID` in Vercel (and a GTM environment for previews, optional); PSI with the published tags (the real third-party cost, Q3); the vendor cookie rows in `external-sources.md` approved before `/privacy` ships. The existing consent-test row is updated to this design.

### O. The protected edits this plan asks you to approve (00 §5)

- **09:** §2.7 (consent by region, C52); §2.8 (click IDs written only with Marketing consent); §3 replaced by: "the taxonomy is `src/lib/tracking/taxonomy.ts` (APPEND-ONLY); its generated table is `docs/owner/tracking/taxonomy.md`", with the finalised rows of section F; §4 (the region cases and the import check); the protected-files line (adds `src/lib/tracking/consent*.ts`, `taxonomy.ts`, `TrackingRuntime.tsx`, `ConsentBanner.tsx`, `ConsentSettings.tsx`, `TagManager.tsx`).
- **06 §4:** the CSP sentence and C40's "P3's CSP allows it by its hash" → section K (C53).
- **07 §2:** the third-party rows (Q3, Q4; C54).
- **13 §7:** a row for the consent and tracking runtime with its measured size.
- **03 §1:** the `lhci` row (two region profiles; first-party and third-party bytes) and the `test` row (the tracking parity test).
- **conversion-path.md:** the banner `glass-frost`, first in the Tab order, the sticky bar hidden while it shows, the scroll padding. **footer.md:** the opening hours (part A, approved) and the Cookie settings button.
- **The conflict register:** C52 (consent by region), C53 (the CSP without a hash), C54 (third-party scripts before interaction, outside Europe), C55 (the taxonomy's parameter changes while 09 §2.4 says names never change: the table was a draft "finalised in P3").
- **`.claude/skills/add-tracking-event/SKILL.md`:** the taxonomy file, `npm run tracking:build`, the parity test, a new import for you.
- **`external-sources.md`:** PROPOSED rows (the EEA, EFTA and UK/Swiss lists for the region codes; Google's EU user consent policy; each vendor's cookie names and lifetimes), for your approval one by one.
- **`CLAUDE.md`** "Current state", and **decision 0021** with its index row, at the phase exit.

---

## Out of scope

- Forms, the audit page, the lead webhook, Turnstile, rate limits (P6); `audit_start`, `generate_lead`, `view_service` and the other events that need a page or a demo (P5–P8). They're in the taxonomy and the container now, so no new import is needed when they start firing.
- Server-side events (Meta Conversions API, LinkedIn CAPI, the confirmed Cal.com booking, Google Ads offline import) and `event_id` deduplication: with the lead flow (P6–P7), through n8n.
- Server-side GTM, PostHog, Microsoft Ads (UET): not decided (0004). Microsoft Ads can be added to the taxonomy's vendors when you say yes.
- The sticky bar hiding while a form field has focus (0019, "P3 and P5"): no form exists yet; it lands with the first form (P6).
- `page_view` on client navigation in e2e (one English page only).
- The `/privacy` page itself (P6): only its draft changes here.
- Any GTM, GA4 or vendor dashboard work: you do it from the guide (09 §2.10).
- A CSP report endpoint.

## Allowed files

**Part A**

| Path | Action | Purpose |
|---|---|---|
| `docs/plans/2026-10-02-p3-analytics-consent.md` | CREATE | This plan, and its Progress notes in every part |
| `src/components/layout/MegaMenu.tsx` | MODIFY | Fix 1 |
| `src/components/layout/SiteHeader.tsx` | MODIFY | Fix 2 |
| `src/app/global-not-found.tsx` | MODIFY | Fix 2 |
| `src/app/global-error.tsx` | MODIFY | Fix 2 |
| `src/components/layout/MobileSheet.tsx` | MODIFY | Fix 3 (the panel's padding class) |
| `src/styles/effects.css` | MODIFY | Fix 3; fix 7 (the letter's weight from its token) |
| `src/styles/tokens.css` | MODIFY | Fix 7: `--dz-social-letter-weight` |
| `scripts/check-contrast.mjs` | MODIFY | Fix 7: read the weight and size tokens before calling the tiles large text |
| `tests/unit/check-contrast.test.ts` | MODIFY | Fix 7 |
| `tests/unit/shell-review.test.ts` | CREATE | Fix 4 |
| `tests/unit/routes.test.ts` | MODIFY | Fix 5 |
| `tests/e2e/shell.spec.ts` | MODIFY | Fix 6; the mega menu link's text (fix 1); the footer's hours line |
| `src/lib/site-config.ts` | MODIFY | `openingHours` |
| `tests/unit/site-config.test.ts` | MODIFY | The hours against the facts file |
| `src/components/layout/SiteFooter.tsx` | MODIFY | The hours line |
| `src/content/en/shell.ts` | MODIFY | `hoursLabel` (Content Writer) |
| `docs/design/footer.md` | MODIFY (protected, approved by you) | The hours |

**Part B**

| Path | Action | Purpose |
|---|---|---|
| `package.json`, `package-lock.json` | MODIFY (by `npm install @next/third-parties@16.3.7 --save-exact` only) | The dependency; the `lhci` and `tracking:build` scripts |
| `src/lib/tracking/taxonomy.ts` | CREATE | The one taxonomy (F) |
| `src/lib/tracking/region.ts` | CREATE | The codes and the header rules (B) |
| `src/lib/tracking/consent.ts` | CREATE | The groups, the stored choice, applying and withdrawing (C, E) |
| `src/lib/tracking/consent-init.ts` | CREATE | The `<head>` script (C) |
| `src/lib/tracking/attribution.ts` | CREATE | Click IDs and UTM tags (I) |
| `src/lib/tracking/vendors.ts` | CREATE | Each vendor's consent group, hosts (CSP), cookies and sources (E, K) |
| `src/lib/tracking/accounts.ts` | CREATE | The public vendor IDs, `null` until sent (J) |
| `src/lib/analytics.ts` | CREATE | `trackEvent()` (F) |
| `src/components/layout/ConsentBanner.tsx` | CREATE | The first layer (D) |
| `src/components/layout/ConsentSettings.tsx` | CREATE | The second layer, loaded on open (E) |
| `src/components/layout/TrackingRuntime.tsx` | CREATE | Page views, delegated clicks, consent buttons, attribution (G) |
| `src/components/layout/TagManager.tsx` | CREATE | GTM when the ID is set (H) |
| `src/components/layout/SiteDocument.tsx` | MODIFY | Mount the consent init, `TagManager` and `TrackingRuntime` once |
| `src/components/layout/SiteShell.tsx` | MODIFY | The banner after the skip link |
| `src/components/layout/SiteFooter.tsx` | MODIFY | The Cookie settings button |
| `src/components/ui/CtaButton.tsx` | MODIFY | `data-cta-id` (G) |
| `src/components/ui/Switch.tsx` | MODIFY | A controlled variant for the settings panel (reuse, 06 §3.1) |
| `src/content/en/legal/consent.ts` | CREATE | The consent copy (Content Writer, from consent-copy.md) |
| `src/lib/routes.ts` | MODIFY | Each row's registry type, for `content_group` |
| `src/lib/env.ts` | MODIFY | The GTM variables (J) |
| `src/lib/security-headers.ts` | MODIFY | The enforced CSP (K) |
| `next.config.ts` | MODIFY | The region rules; `optimizePackageImports` if needed (H) |
| `.env.example` | MODIFY | The GTM variables' notes (nothing loads until set) |
| `src/styles/effects.css` | MODIFY | The banner, the dialog, the sticky bar giving way, the scroll padding |
| `src/styles/tokens.css` | MODIFY | Only if the banner needs a token that doesn't exist (named in the Progress notes) |
| `lighthouserc.cjs` | MODIFY | `OWN_JS_HOME`; the third-party assertions (Q3) |
| `lighthouserc.row.cjs` | CREATE | The non-European profile (Home, `x-vercel-ip-country: AE`) |
| `scripts/check-page-weight.mjs` | MODIFY | First-party and third-party bytes apart, both profiles (Q3) |
| `tests/unit/check-page-weight.test.ts` | MODIFY | The same |
| `.github/workflows/ci.yml` | MODIFY | Print both profiles' runs |
| `playwright.config.ts` | MODIFY | The e2e project's default country (AE) |
| `tests/unit/taxonomy.test.ts`, `analytics.test.ts`, `consent.test.ts`, `consent-init.test.ts`, `region.test.ts`, `attribution.test.ts`, `tag-manager.test.ts` | CREATE | Section M |
| `tests/unit/env.test.ts`, `security-headers.test.ts`, `routes.test.ts` | MODIFY | Section M |
| `tests/e2e/tracking.spec.ts`, `tests/e2e/consent.spec.ts` | CREATE | Section M |
| `tests/e2e/helpers/tracking.ts` | CREATE | Reading the data layer; the GTM stub |
| `tests/e2e/shell.spec.ts` | MODIFY | Only if a P2 test needs the country made explicit (named in the Progress notes) |
| `docs/content-drafts/legal/privacy-policy.md`, `consent-copy.md` | MODIFY | Section N |
| `docs/owner/n8n-setup-guide.md` | MODIFY | §8.1's one line (N) |
| `docs/design/conversion-path.md`, `docs/design/footer.md` | MODIFY (protected) | Section O |
| `docs/ai/conflict-register.md` | APPEND-ONLY (protected) | C52–C55, at step B1, before the work they cover |
| `docs/ai/09-analytics-tracking.md` | MODIFY (protected) | Section O, at step B1 (taxonomy first, 04 §1.5) |
| `docs/ai/06-code-standards.md` | MODIFY (protected) | §4's CSP lines, at step B7 |
| `docs/ai/13-experience-design.md`, `docs/ai/03-verification-gates.md` | MODIFY (protected) | 13 §7's measured row (B6); 03 §1's `lhci` and `test` rows (B8) |

**Part C**

| Path | Action | Purpose |
|---|---|---|
| `scripts/build-tracking.mjs` | CREATE | The generator (L) |
| `docs/owner/tracking/deepzeta-gtm-container.json` | CREATE (generated) | The import file |
| `docs/owner/tracking/ga4-setup.md` | CREATE (generated) | The GA4 tables and the Ads method |
| `docs/owner/tracking/taxonomy.md` | CREATE (generated) | The human table |
| `tests/unit/tracking-artifacts.test.ts` | CREATE | The parity and structure checks |
| `tests/fixtures/gtm/reference-export.json`, `roundtrip-export.json` | CREATE | Your two exports (test IDs only) |
| `src/lib/tracking/accounts.ts` | MODIFY | Your IDs, when sent |
| `.github/workflows/ci.yml` | MODIFY | `NEXT_PUBLIC_GTM_ID` (a public ID) |
| `lighthouserc.cjs`, `lighthouserc.row.cjs`, `scripts/check-page-weight.mjs` | MODIFY | The third-party caps from the measurement |
| `tests/e2e/tracking.spec.ts` | MODIFY | The GTM cases |
| `docs/owner/p3-tracking-setup-guide.md`, `docs/owner/pre-launch-register.md` | MODIFY | Section N |
| `docs/ai/07-performance-budget.md` | MODIFY (protected) | §2's third-party rows with the measured caps (Q3, Q4) |
| `docs/ai/09-analytics-tracking.md`, `docs/ai/conflict-register.md` | MODIFY (protected) | Only if C5's measurement changes what part B wrote (named in the Progress notes) |
| `docs/facts/external-sources.md` | APPEND-ONLY (protected) | PROPOSED rows |
| `.claude/skills/add-tracking-event/SKILL.md` | MODIFY (protected) | Section O |
| `docs/decisions/0021-analytics-and-consent.md` | CREATE | The phase's decision record |
| `docs/decisions/README.md` | APPEND-ONLY | Its index row |
| `CLAUDE.md` | MODIFY (protected) | "Current state" |

## Steps

**Part A** (on `feat/p3-analytics-consent`)
1. **A1 · The seven fixes** (A) → `verify:fast` + `test` + `build` + `test:e2e` (shell)
2. **A2 · The opening hours** (A; the label by the Content Writer; footer.md) → `verify:fast` + `test` + `build` + `check:schema` + `check:seo` + `test:e2e` + `lhci` (the footer grows on every page)
3. **A3 · Part A close:** `verify` (CI environment), the reviewer, CI green → **merge on your "merge"**

**Part B** (on `feat/p3b-consent-tracking`)
4. **B1 · Taxonomy first:** C52–C55 and the 09 edits (approved with this plan), `taxonomy.ts`, `analytics.ts`, `vendors.ts`, `accounts.ts` with their tests → `verify:fast` + `test`
5. **B2 · The region hint:** `region.ts`, the `next.config` rules, `region.test.ts`; locally on `next start` with the header sent and missing; then **on a Vercel preview** (`curl -sI` from here: `Server-Timing: dz-region;desc="row"` on the page, `X-Vercel-Cache: HIT` on a repeat, nothing on a `/_next/` file). **Stop and report if it fails** (section B, point 5) → `test` + `build` + the preview evidence
6. **B3 · Consent defaults:** `consent.ts`, `consent-init.ts`, mounted by `SiteDocument` → `test` (every case) + `build` + `test:e2e` (`dataLayer[0]` for AE and DE)
7. **B4 · The banner and Cookie settings:** the components, the Content Writer's `consent.ts`, the CSS, the `Switch` variant, the footer button; the vendor cookie rows read from their official pages and drafted for `external-sources.md` (proposed in part C's edit) → `verify:fast` + `build` + `test:e2e` (consent) + axe + `check:contrast`
8. **B5 · The tracker:** `TrackingRuntime` (page views, delegated clicks, attribution), `CtaButton`'s attribute, the route types → `test` + `build` + `test:e2e` (events exactly once)
9. **B6 · GTM:** `npm install @next/third-parties@16.3.7 --save-exact`, `TagManager`, `env.ts`; a local build with a test ID to measure the bundle (Playwright stubs the script); `OWN_JS_HOME` from lhci; 13 §7's row → `verify` + bundle check (03 §2, dependency added). **Stop if Home's own JavaScript would pass 10 KB** (Risks)
10. **B7 · The CSP:** `security-headers.ts` from `vendors.ts`, enforced, and 06 §4's lines; checked in Chromium that nothing on Home and the review page is blocked → `test` + `build` + `test:e2e` (CSP)
11. **B8 · lhci, both profiles:** `lighthouserc.row.cjs`, the page-weight script's first/third-party split (Q3), CI's print step, 03 §1's rows → `lhci` (Home with the banner, Home without it, the review page)
12. **B9 · The drafts and specs** (N, O: the legal drafts, the n8n line, conversion-path.md, footer.md) → `check:rules`
13. **B10 · Part B close:** `verify`; the reviewer, the performance and accessibility auditor, the SEO/GEO auditor (the banner's text in every page's HTML); CI green → **merge on your "merge"**

**Part C** (on `feat/p3c-gtm-container`)
14. **C1 · The reference export** (you, guide A8) → the fixture; the generator's shapes taken from it
15. **C2 · The generator** and the three generated files (with test IDs until yours arrive) → `test` (parity, structure, privacy parity)
16. **C3 · The test import and re-export** (you, guide B0) → the round-trip fixture and its test; the throwaway containers deleted
17. **C4 · The guide's Part B, the register rows, the `external-sources.md` rows, the skill** → `check:rules`
18. **C5 · With your IDs** (once sent): `accounts.ts`, the real files generated; you set `NEXT_PUBLIC_GTM_ID` in Vercel and do Part B (import, Preview with both regions, DebugView, custom dimensions, key events, publish); CI gets the ID; lhci measures the real container in both profiles; the third-party caps set from it (Q3) → `verify` + your B2 and B3 results
19. **C6 · Phase exit:** 07 §2 with the measured caps, decision 0021, `CLAUDE.md`; `verify`; the three audits → **merge on your "merge"**

If your IDs haven't come by C5, part C merges at C4 with the generator and the guide ready, and C5–C6 run as their own small branch when they arrive. P3's exit gate (your GTM checklist) waits for them either way.

## Effect register (13 §4)

| Section | Effect ID | Cost → mitigation | Byte cap (13 §7) | Verify items |
|---|---|---|---|---|
| The banner's surface | `glass-frost` | No live blur → a static frosted layer (the grain) | Grain ≤ 2 KB (shared, 304 B) | Contrast of its text on the frost (`check:contrast`); solid in forced colours |
| The settings dialog | `glass-live` | One live blur while the modal is open; the page under it is inert, so nothing scrolls behind it | — | `glass-frost` under Reduce effects; solid in forced colours |
| The banner's and the dialog's buttons | `touch-press` | `:active` scale only | — | Under Reduce effects: colour change only |
| The settings switches | `touch-snap` | The existing switch CSS | — | As P2's switches |

## State changes (no effect ID; 13 §3 rules apply)

The banner leaving after a choice (200 ms opacity and transform; instant under Reduce effects); the sticky bar returning after the choice (its existing slide); the dialog opening (the sheet's existing pattern).

## Behaviour matrix (13 §6)

| Mode | The banner | The dialog |
|---|---|---|
| Full effects | Shown at first paint; fades out on a choice | `glass-live` |
| Reduce effects / reduced motion | Shown at first paint; gone at once on a choice | `glass-frost`, no transition |
| Forced colours | Solid, bordered | Solid, bordered |
| JavaScript off | Not shown (nothing runs to consent to) | Not available |
| RTL | Mirrors by logical properties | Mirrors |

## Dependencies to add

| Package | Version (verified) | Why native or hand-rolled is worse |
|---|---|---|
| `@next/third-parties` | `16.3.7` (exact; peers `next ^16`, `react ^19`; brings `third-party-capital@1.0.20`) | 09 §2.1 names it as the one GTM loader: it's maintained with Next.js, takes GTM environments (`auth`, `preview`) and loads with `next/script`'s scheduling. A hand-written loader would be about 0.3 KB smaller but needs a 09 edit and owns that upkeep (the Risks stop names it as the fallback) |

## Risks & mitigations

- **Home's 10 KB own-JavaScript cap** (2,188 B left): the settings panel and the attribution capture load only when needed; the runtime is delegated listeners with no React state per event; the `google` barrel is measured and `optimizePackageImports` tried. **Stop:** if Home's own JavaScript would pass 10 KB at B6, I stop and ask: raise Home's cap by a decision, or replace `@next/third-parties` with a 0.3 KB loader of our own (a 09 §2.1 change).
- **Home's LCP margin is thin** (0019: medians 2,334–2,406 ms against 2,410 and 2,500). The banner paints in the first frame with the H1 and adds about 1 KB of HTML to every page; GTM loads after hydration. **Stop:** if Home's lab LCP median rises by more than 50 ms in either profile at B8, or it passes 2,410 ms (C47), I stop and report before going on.
- **The banner could become the LCP element** for European visitors (more text than the H1 on a phone). It paints in the same frame as the H1, so LCP's time doesn't move; B8 checks which element lhci names and its time.
- **Third-party cost for visitors outside Europe** (GA4's Google tag, then Meta and LinkedIn): TBT and Home's Performance floor (≥ 95) may fall. Measured at C5 in CI and by PSI on production; Meta and LinkedIn after the load event (Q4). If Home falls below 95, the 0020 limit applies (≥ 86, recorded as an exception), and the container is trimmed before anything is excepted.
- **The region hint isn't verified on Vercel yet:** B2 checks it before anything depends on it, with two fallbacks; a European check needs your VPN.
- **A wrong country** (a VPN, an unknown code, an old Safari): it fails towards the banner, never towards tracking without consent in Europe.
- **The GTM format isn't documented:** two checks against real GTM (L) before your import; the generated file is versioned, so a later fix is a new import.
- **The CSP blocks a vendor request silently:** the host lists come from the vendors' own docs (Meta's from its base code: NOT VERIFIED as complete); your Preview test checks the console; a blocked host is added in a small plan.
- **The legal position outside Europe** (finding 7): your decision without a legal review, recorded in C52; the wording claims no basis we can't show, and Cookie settings is always one click away.
- **Stale data-layer values:** per-event GA4 tags carry only their event's parameters (L).
- **CI and preview hits in your reports:** `traffic_type = internal` off the production host, and the Internal Traffic filter (guide B7); Meta and LinkedIn fire on the production host only. CI's lhci also depends on Google's network once the ID is in (variance; five runs, medians).
- **Existing e2e tests and the banner:** the e2e default country is AE, so P2's tests see no banner; any test that changes is named in the Progress notes.

## Gates (03 §2)

- Every step: `verify:fast`.
- Analytics and consent: `test` + `build` + `test:e2e` (tracking and consent) + your GTM Preview checklist.
- The dependency: `verify` + the bundle check in `lhci` + this plan's line.
- The footer and the shell: `check:schema`, `check:seo`, `check:links`, `lhci`.
- Each part's close and the phase exit: `verify` (all gates) + the audits + your review.

## Owner checklist (03 §4)

1. **B2:** with a VPN set to an EEA country (for example the Netherlands), open the preview link I send: the banner shows. Without the VPN: no banner.
2. **C1:** the reference export (guide A8), about 15 minutes.
3. **C3:** the test import and re-export (guide B0), about 10 minutes; then delete both throwaway containers.
4. **Your IDs** (guide §1, items 1–7), and `NEXT_PUBLIC_GTM_ID` in Vercel.
5. **C5:** the guide's Part B (B1–B9), including the European and non-European Preview runs.

## Open questions

**Q1. Three parts, one merge each?** A (the tidy and the hours), B (consent and tracking in the site), C (the generated container, your import, the exit).
**Recommendation: yes.** Part A is small and ships at once; part B is the site's behaviour and can be reviewed without your IDs; part C waits on your exports and IDs.

**Q2. The region hint: approve the `Server-Timing` header from a CDN rule (section B), with the cookie variant and then `proxy.ts` as fallbacks, and "no hint means Europe"?**
**Recommendation: yes.** Pages stay static, nothing is stored on the device, no function runs per request, and every failure falls towards asking for consent.

**Q3. How do GTM and the vendor tags count against the speed budget (07 §2)?**
- (a) **Recommended:** the first-party limits stay exactly as they are (JavaScript and HTML + CSS + JS counted on our own origin only); third-party bytes get their own caps in two profiles (Europe before consent: GTM only; elsewhere: GTM and the Google tag in CI, every tag in PSI on production), set from the first real measurement at C5 and recorded in 0021; Home's Performance floor and the Core Web Vitals hard limits apply with the tags on.
- (b) Count third-party scripts in the existing JavaScript limit: GTM alone would fail every page.
- (c) Leave them unmeasured: breaks N1.

**Q4. For visitors outside Europe, when do the tags load?**
**Recommendation:** GTM and GA4's Google tag at once (never deferred, L6), Meta and LinkedIn after the window's load event, so they never compete with the first paint or the first tap. It changes 07 §2's "GTM only before consent or interaction" for these visitors (C54).

**Q5. The CSP: enforce now (section K) or stay report-only?**
**Recommendation: enforce now,** with host allowlists and `'unsafe-inline'` for scripts and no hash (a hash would block Next.js's own inline scripts; nonces would make every page dynamic). It limits what any tag, including one added by hand in GTM, can load or send.

**Q6. Google Ads conversions: which one method?**
**Recommendation: import GA4's key events into Google Ads** (`generate_lead` primary, the other two secondary), with no Ads tag in the container: no extra script for visitors, and one place where a lead is counted. The Ads conversion tag (and enhanced conversions) can come later by decision, if Ads' own measurement is needed.

**Q7. Two short GTM checks by you in throwaway containers (C1, C3; about 25 minutes in all, click by click in the guide), before your real import?**
**Recommendation: yes.** The export format isn't documented; your two exports are the only way to know the file imports exactly as generated.

**The owner's answers (2026-10-02):** "all recommendations yes". Q1 yes (three parts, one merge each); Q2 yes (the `Server-Timing` hint, its fallbacks, no hint means Europe); Q3 (a); Q4 as recommended; Q5 enforce now; Q6 GA4 key events imported into Google Ads; Q7 yes (the two throwaway-container checks).
