// Lighthouse CI (docs/ai/03 · lhci; docs/ai/07; decision 0005 page tiers).
// Runs against the production build (`npm run build` first). Lighthouse's default mobile emulation
// with simulated slow 4G matches the 07 test conditions. Reports stay local (.lighthouseci/, git-
// ignored); CI keeps them as build artifacts. Nothing is uploaded to public storage.
// Chrome: lhci uses CHROME_PATH when set, otherwise the installed Google Chrome. The CI run is the
// record, so small version differences on the owner's machine don't matter.

// lhci's default aggregation is "optimistic" (the best of the runs). The median run is the honest
// record, so every assertion uses it.
const median = { aggregationMethod: 'median-run' };

// T1 Home (decision 0005): Performance ≥ 0.95. Core Web Vitals hard limits apply to every tier (07 §1).
const t1Assertions = {
  'categories:performance': ['error', { minScore: 0.95, ...median }],
  'categories:accessibility': ['error', { minScore: 0.95, ...median }],
  'categories:best-practices': ['error', { minScore: 0.95, ...median }],
  'categories:seo': ['error', { minScore: 0.95, ...median }],
  'largest-contentful-paint': ['error', { maxNumericValue: 2500, ...median }],
  'cumulative-layout-shift': ['error', { maxNumericValue: 0.1, ...median }],
  'total-blocking-time': ['error', { maxNumericValue: 200, ...median }],
  // 07 §2: HTML + CSS + JS before the first interaction ≤ 150 KB. P0 has no fonts or images, so the
  // total is that sum; part 2 splits it into per-type budgets when fonts arrive. The per-page
  // JavaScript assertion follows the owner's C8 decision (decision 0014).
  'resource-summary:total:size': ['error', { maxNumericValue: 150 * 1024, ...median }],
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
