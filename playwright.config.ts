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
    { name: 'e2e', testMatch: 'e2e/**/*.spec.ts' },
    // The HTML gates read raw server HTML, as crawlers do (plan section E).
    { name: 'gate-seo', testMatch: 'gates/seo.spec.ts', use: { javaScriptEnabled: false } },
    { name: 'gate-schema', testMatch: 'gates/schema.spec.ts', use: { javaScriptEnabled: false } },
    { name: 'gate-links', testMatch: 'gates/links.spec.ts', use: { javaScriptEnabled: false } },
  ],
});
