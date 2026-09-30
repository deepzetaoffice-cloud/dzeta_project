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
// - Audits and resource sizes use "median-run": the values of the most representative run.
const medianScore = { aggregationMethod: 'median' };
const medianRun = { aggregationMethod: 'median-run' };

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
  'resource-summary:third-party:count': ['error', { maxNumericValue: 0, ...medianRun }],
  // 07 §2: HTML + CSS + JS before the first interaction ≤ 150 KB. lhci measures transfer size in
  // bytes (response headers included), so KB means KiB here. P0 has no fonts or images, so the total
  // is that sum; part 2 replaces it with per-type budgets when fonts arrive. The per-page
  // JavaScript assertion follows the owner's C8 decision (decision 0014).
  'resource-summary:total:size': ['error', { maxNumericValue: 150 * 1024, ...medianRun }],
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
