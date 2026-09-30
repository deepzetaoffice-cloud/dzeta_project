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
// headers included, so KB means KiB here.
const KB = 1024;
// The Next.js 16.3.7 / React 19.3 runtime, measured on the empty P0 Home (136.4 KB, headers included,
// so our own security headers on each script count too). Raising it needs the owner's approval in a
// new decision.
const FRAMEWORK_JS_BASELINE = 139_668;
// More growth than this fails lhci, so every Next.js upgrade shows its cost.
const FRAMEWORK_JS_GROWTH = 5 * KB;
// Our own JavaScript on Home at first load: none in P0. A plan that adds client code on Home raises
// this by that code's measured size, never above the 10 KB cap (07 §2, 13 §7).
const OWN_JS_HOME = 0;
if (OWN_JS_HOME > 10 * KB) throw new Error('OWN_JS_HOME is above the 10 KB Home cap (07 §2, 13 §7).');

// T1 Home (decision 0005): Performance ≥ 0.95. Core Web Vitals hard limits apply to every tier (07 §1).
const t1Assertions = {
  'categories:performance': ['error', { minScore: 0.95, ...medianScore }],
  'categories:accessibility': ['error', { minScore: 0.95, ...medianScore }],
  'categories:best-practices': ['error', { minScore: 0.95, ...medianScore }],
  'categories:seo': ['error', { minScore: 0.95, ...medianScore }],
  'largest-contentful-paint': ['error', { maxNumericValue: 2500, ...medianRun }],
  'cumulative-layout-shift': ['error', { maxNumericValue: 0.1, ...medianRun }],
  'total-blocking-time': ['error', { maxNumericValue: 200, ...medianRun }],
  // TTFB hard limit (07 §1). Locally it's the Node server on localhost; the real figure comes from
  // PageSpeed Insights on deepzeta.ai.
  'server-response-time': ['error', { maxNumericValue: 600, ...medianRun }],
  // 07 §2: no third-party requests before consent. P3 allows GTM here.
  'resource-summary:third-party:count': ['error', { maxNumericValue: 0, ...everyRun }],
  // 07 §2: JavaScript on first load ≤ the framework baseline + its growth allowance + our own code.
  'resource-summary:script:size': [
    'error',
    { maxNumericValue: FRAMEWORK_JS_BASELINE + FRAMEWORK_JS_GROWTH + OWN_JS_HOME, ...everyRun },
  ],
  // 07 §2: HTML + CSS + JS before the first interaction ≤ the framework baseline + 50 KB. "total"
  // counts every resource type, and P0 has no fonts, images or icons, so today it's that sum. Part 2
  // replaces it with per-type budgets in the same change that adds fonts.
  'resource-summary:total:size': ['error', { maxNumericValue: FRAMEWORK_JS_BASELINE + 50 * KB, ...everyRun }],
};

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000/'],
      numberOfRuns: 5,
    },
    assert: {
      assertions: t1Assertions,
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci/reports',
    },
  },
};
