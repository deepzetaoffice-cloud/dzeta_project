import { defineConfig } from 'vitest/config';

// Unit tests (docs/ai/03 · test): pure logic only, in Node. Browser behaviour is tested with
// Playwright (tests/e2e) and the HTML gates (tests/gates).
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
