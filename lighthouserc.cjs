// Lighthouse CI (docs/ai/03 · lhci; docs/ai/07; decision 0005 page tiers).
// Runs against the production build (`npm run build` first). Lighthouse's default mobile emulation
// with simulated slow 4G matches the 07 test conditions. Reports stay local (.lighthouseci/, git-
// ignored); CI keeps them as build artifacts. Nothing is uploaded to public storage.
// Chrome: lhci uses CHROME_PATH when set, otherwise the installed Google Chrome. The CI run is the
// record, so small version differences on the owner's machine don't matter.
//
// Aggregation over the 5 runs. lhci's default is "optimistic" (the best run), so it's never used:
// - Category scores use "median". lhci 0.15.1 passes category assertions every run and treats
//   "median-run" like "optimistic" (@lhci/utils assertions.js), which would check the best score.
// - Timing audits use "median-run": the values of the most representative run.
// - Byte and request limits use "pessimistic": the largest value of any run, so a hard limit holds on
//   every run, not only the one picked by timing.
const medianScore = { aggregationMethod: 'median' };
const medianRun = { aggregationMethod: 'median-run' };
const everyRun = { aggregationMethod: 'pessimistic' };

// Page weight (07 §2, decision 0014 option A). lhci measures transfer size in bytes, response
// headers included, so KB means KiB here. These numbers are also exported as `budget` (below), which
// scripts/check-page-weight.mjs reads, so both checks use the same ones.
const KB = 1024;
// The Next.js 16.3.7 / React 19.3 runtime, measured on the empty P0 Home (136.4 KB, headers included,
// so our own security headers on each script count too). Raising it needs the owner's approval in a
// new decision.
const FRAMEWORK_JS_BASELINE = 139_668;
// More growth than this fails lhci, so every Next.js upgrade shows its cost.
const FRAMEWORK_JS_GROWTH = 5 * KB;
// Our own JavaScript on Home at first load. A plan that adds client code on Home raises this by that
// code's measured size, never above the 10 KB cap (07 §2, 13 §7).
// P2 part A: 4,142 B, lhci's script size on Home (143,810 B in all 5 runs, 2026-10-01) minus the
// baseline. The root error page ships with every page: global-error.tsx itself (about 0.8 KB) and
// next/link, which it imports (about 3.3 KB; counted here, not as framework growth, because we chose it).
// P2 part B: 7,968 B (147,636 B in all 5 runs on Home and on the review page, 2026-10-01): the error
// page, next/link (shipped once since C46, for the header's links) and the effect runtime (FxRuntime
// and src/lib/fx/).
// P2 part C: 8,052 B (147,720 B in all 5 runs on Home and on the review page, 2026-10-01): cta.ts's
// sticky bar, the finale's hand-off and the first state shown without a transition added 84 B.
// P3 step B6: 10,884 B (150,552 B in all 5 runs on Home and on the review page, 2026-10-02): the
// tracking runtime with the consent defaults, trackEvent() and the taxonomy's parameter rules, the
// error page's route helper (16 B, P3 part A), and GTM's own loader (C56). The consent code, the
// settings panel and the click handling load only when used.
// P3 step B10: 11,048 B (150,716 B in all 5 runs on Home, the campaign landing and the review page,
// 2026-10-02): the audit fixes (the banner's reserve and resize, the failed-download fallbacks) and the
// campaign capture's first-action listeners; the capture code itself loads on the visitor's first action.
// P3 step C5: 11,077 B (the no-ID build at 150,745 B = 151,272 − 527, the EVENT_DETAILS leak C1b added
// and C5 removed, minus the baseline; the leak's own code, retired to RETIRED_EVENTS, is what grew it).
// With the GTM ID set, lhci also counts ~550 B of CSP header on each script response (the enforced
// policy names the vendor hosts once GTM is on): +3,850 B on Home that is not JavaScript (07 §2 Units).
// P5 step S7: 8,737 B (148,404–148,405 B in every run on Home, both profiles, and on the review
// page, 2026-10-06). Since the C5 amendment, `/_next/` chunks carry nosniff alone, so every script response
// is lighter than when the baseline was measured, and the same method now reads lower. Measured the
// same way as P3's post-amendment 147,091 B, P4 and P5 together added 1,314 B at first load: P4's
// first-paint deferral, and P5's lazy loader with its FxRuntime and clicks.ts hooks. Every P5
// enhancement module loads on first use.
const OWN_JS_HOME = 8_737;
// Home's cap: 10 KB until P3, 11 KB since the tracking runtime (decision 0021).
const HOME_OWN_JS_CAP = 11 * KB;
if (OWN_JS_HOME > HOME_OWN_JS_CAP) throw new Error('OWN_JS_HOME is above the 11 KB Home cap (07 §2, 13 §7).');
// First-party JavaScript ≤ the baseline + its growth allowance + our own code (07 §2; 0014, 0021). It's
// checked by scripts/check-page-weight.mjs, which counts the page's own origin only: lhci's script size
// counts every origin, and GTM's tags have their own caps (C54).
const FIRST_PARTY_JS_LIMIT = FRAMEWORK_JS_BASELINE + FRAMEWORK_JS_GROWTH + OWN_JS_HOME;
// HTML + CSS + JS before the first interaction ≤ the framework baseline + 50 KB (07 §2).
const FIRST_LOAD_LIMIT = FRAMEWORK_JS_BASELINE + 50 * KB;
// The review page alone (conflict C57): it never reaches visitors, and carries the complete shell.
// C64 raised it from 192,000 B: P5's effects CSS and its eight Tier 1 icons reach every page, and the
// review page measured 192,937 B (2026-10-06).
const REVIEW_FIRST_LOAD_LIMIT = 194_000;
// Home alone, in the lab (conflict C64, the owner, 2026-10-06): the real Home measures 200,042 B
// with gzip, which is what `next start` serves. React sends the page twice (markup + page data),
// and gzip's 32 KB window can't compress copies that far apart. Production's Brotli shrinks only
// the HTML: measured on production, Home is 198,396 B (C65), over FIRST_LOAD_LIMIT. That limit
// stands for every other page and for what visitors receive, and P6 brings Home back under it.
const HOME_FIRST_LOAD_LIMIT = 200 * KB;

// T1 Home (decision 0005): Performance ≥ 0.95. Core Web Vitals hard limits apply to every tier (07 §1).
// Third-party caps from C5's measurement with the real container (2026-10-04, lhci, 15 runs):
// - Europe (this profile: no country, the banner up, nothing granted): GTM only — gtm.js at
//   133,388–133,405 B, and, in some runs, GTM's own internal telemetry pixel (googletagmanager.com/a?,
//   59 B, an Image) after the container loads — so the cap is 2 requests and 160 KB (about 20%
//   headroom for GTM's own growth; every vendor tag waits for consent, 07 §2, C54).
// - Outside Europe (rowAssertions below): GTM + the Google tag + GA4's collect, 3–4 requests,
//   300,696–300,790 B, so the caps are 4 requests and 350 KB. Meta's and UET's base tags fire on the
//   window's load on the production host only (the WL - production triggers), so CI never loads them;
//   PSI on production measures every tag (a pre-launch register row).
const THIRD_PARTY_EU = { count: 2, size: 160 * KB };
const t1Assertions = {
  'categories:performance': ['error', { minScore: 0.95, ...medianScore }],
  'categories:accessibility': ['error', { minScore: 0.95, ...medianScore }],
  'categories:best-practices': ['error', { minScore: 0.95, ...medianScore }],
  'categories:seo': ['error', { minScore: 0.95, ...medianScore }],
  // C61 (the owner, 2026-10-04): with the real GTM container, European Home's lab LCP sits on the
  // 2.5 s line (2,412–2,524 ms over 10 runs; medians 2,488 and 2,507), decided by lab variance — the
  // CSP header bytes GTM adds to every script response and gtm.js's own 133 KB — not by a real
  // regression (UAE Home stays 2,329–2,407 ms; Performance 97–98, TBT ≤ 28 ms, CLS 0). The lab
  // allowance for this one profile is 2,550 ms; the 2.5 s hard limit (07 §1) stays for every page and
  // is checked against real visitors' field data (PSI/CrUX) after launch.
  // C63 (the owner, 2026-10-06, within decision 0020): the real Home's bytes before first paint
  // (C64) put its lab LCP at a 2,707 ms median (2,629–2,728 ms), Performance 0.96–0.97, TBT ≤ 24 ms,
  // CLS 0. Home's lab allowance is 2,750 ms on both profiles. The 2.5 s hard limit stands for real
  // visitors (field data on production).
  'largest-contentful-paint': ['error', { maxNumericValue: 2750, ...medianRun }],
  'cumulative-layout-shift': ['error', { maxNumericValue: 0.1, ...medianRun }],
  'total-blocking-time': ['error', { maxNumericValue: 200, ...medianRun }],
  // TTFB hard limit (07 §1). Locally it's the Node server on localhost; the real figure comes from
  // PageSpeed Insights on deepzeta.ai.
  'server-response-time': ['error', { maxNumericValue: 600, ...medianRun }],
  // 07 §2: before consent, GTM only (C54). The caps come from C5's measurement (above).
  'resource-summary:third-party:count': ['error', { maxNumericValue: THIRD_PARTY_EU.count, ...everyRun }],
  'resource-summary:third-party:size': ['error', { maxNumericValue: THIRD_PARTY_EU.size, ...everyRun }],
  // 07 §2: first-party JavaScript on first load is checked by scripts/check-page-weight.mjs (C54).
  // 07 §2: fonts ≈ 60 KB (the target), hard limit 70 KB; two files at most on an English page
  // (Montserrat and JetBrains Mono, decision 0015).
  'resource-summary:font:size': ['error', { maxNumericValue: 70 * KB, ...everyRun }],
  'resource-summary:font:count': ['error', { maxNumericValue: 2, ...everyRun }],
  // 07 §2: images above the fold ≤ 200 KB. lhci counts every image on the page, so this is stricter.
  'resource-summary:image:size': ['error', { maxNumericValue: 200 * KB, ...everyRun }],
  // 07 §2: HTML + CSS + JS before the first interaction ≤ the framework baseline + 50 KB. lhci can't add
  // resource types together, so scripts/check-page-weight.mjs checks it after every lhci run.
};

// The UAE campaign landing's own assertions (C5's measurement, above): GTM, the Google tag and GA4's
// collect, 3–4 requests, at most 300,790 B; 4 and 350 KB with headroom. Its LCP was at the true
// 2.5 s hard limit (07 §1) until P5. The real Home measures a 2,706 ms median here (2,630–2,712 ms),
// so C63 gives it the same 2,750 ms lab allowance as the European profile.
// TBT and Performance (decisions 0022 and 0023, the owner, 2026-10-05): with the tags granted on
// this profile, gtm.js + the Google tag + GA4's collect execute inside Lighthouse's TBT window
// (first paint to TTI) however early they load — the deferral past first paint (0022,
// TrackingRuntime's afterFirstPaint) keeps them off the paint work but cannot move their execution
// past TTI, which would be the idle-defer 09 §2.2 forbids (lesson L6). Measured twice on 83562da:
// TBT 247–266 ms, Performance 0.93–0.95. The owner accepted the intrinsic cost (0023): this
// profile's TBT lab allowance is 275 ms and its Performance floor 0.93, while 07 §1's ≤ 200 ms
// TBT and the 0.95 T1 floor stand for every page and profile — the row exception covers the
// granted third-party scripts only, and PSI/CrUX field data stays the arbiter after launch.
const rowThirdParty = {
  'categories:performance': ['error', { minScore: 0.93, ...medianScore }],
  'resource-summary:third-party:count': ['error', { maxNumericValue: 4, ...everyRun }],
  'resource-summary:third-party:size': ['error', { maxNumericValue: 350 * KB, ...everyRun }],
  'largest-contentful-paint': ['error', { maxNumericValue: 2750, ...medianRun }],
  'total-blocking-time': ['error', { maxNumericValue: 275, ...medianRun }],
};

// The review page shows the complete shell (P2 plan, A3; registry R165) and is measured as T1 too, with
// two differences. It's noindex by design (never linked, 404 in production), so Lighthouse's SEO
// category, which fails a page that blocks indexing, doesn't apply. And it carries the full mega menu,
// the sheet, the full footer and the icon gallery in its HTML, so its lab LCP may reach 2,700 ms (C48,
// raised by C50; decision 0020). Home's own lab allowance is C63's.
const reviewAssertions = {
  ...t1Assertions,
  'categories:seo': 'off',
  'largest-contentful-paint': ['error', { maxNumericValue: 2700, ...medianRun }],
};

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000/', 'http://localhost:3000/shell-review'],
      numberOfRuns: 5,
    },
    assert: {
      assertMatrix: [
        { matchingUrlPattern: '^http://localhost:3000/$', assertions: t1Assertions },
        // Home as a visitor from the UAE landing from a campaign, collected by lighthouserc.row.cjs on
        // 127.0.0.1 so its runs stay apart from the European ones (P3 plan, B8 and B10; C52)
        {
          matchingUrlPattern: '^http://127\\.0\\.0\\.1:3000/(\\?.*)?$',
          assertions: { ...t1Assertions, ...rowThirdParty },
        },
        { matchingUrlPattern: '^http://localhost:3000/shell-review$', assertions: reviewAssertions },
      ],
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci/reports',
    },
  },
  // Not an lhci key (lhci reads `ci` only): the budget for scripts/check-page-weight.mjs.
  budget: {
    KB,
    FRAMEWORK_JS_BASELINE,
    FRAMEWORK_JS_GROWTH,
    OWN_JS_HOME,
    HOME_OWN_JS_CAP,
    FIRST_PARTY_JS_LIMIT,
    FIRST_LOAD_LIMIT,
    REVIEW_FIRST_LOAD_LIMIT,
    HOME_FIRST_LOAD_LIMIT,
  },
};
