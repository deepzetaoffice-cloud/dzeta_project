import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

// The one accessibility check for the e2e specs (docs/ai/03 · test:e2e: 0 serious or critical axe
// violations; P2 plan, O). WCAG 2.0–2.2 A and AA, plus axe's best practices. Returns each serious
// or critical violation as "id: help", so a failure names what broke; an empty list passes.
export async function seriousAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze();
  return results.violations
    .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
    .map((violation) => `${violation.id}: ${violation.help}`);
}
