import { defineConfig, devices } from '@playwright/test';

// Every project runs against the production build: `npm run build` first (`npm run verify` runs the
// gates in that order). The server gets the same environment as the build (NEXT_PUBLIC_SITE_URL…).
const PORT = 3000;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    // Never test a dev server by accident: a busy port fails loudly instead.
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    // A visitor from the UAE by default, most of the site's audience: no consent banner (09 §2.7, C52).
    // Tests of a European visitor send their own country (tests/e2e/helpers/tracking.ts).
    {
      name: 'e2e',
      testMatch: 'e2e/**/*.spec.ts',
      use: { extraHTTPHeaders: { 'x-vercel-ip-country': 'AE' } },
    },
    // The HTML gates read raw server HTML, as crawlers do (plan section E).
    { name: 'gate-seo', testMatch: 'gates/seo.spec.ts', use: { javaScriptEnabled: false } },
    { name: 'gate-schema', testMatch: 'gates/schema.spec.ts', use: { javaScriptEnabled: false } },
    { name: 'gate-links', testMatch: 'gates/links.spec.ts', use: { javaScriptEnabled: false } },
  ],
});
