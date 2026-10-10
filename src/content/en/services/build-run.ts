// The build terminal's recording (story-terminal, 13 §4.8: real commands and output only; the plan
// docs/plans/2026-10-10-flagship-websites-page.md). A real run of this site's own build and checks
// on commit b7da24a (2026-10-10): the lines are the commands' own output, selected and never edited
// (colour codes and the CI annotation prefix removed). Its numbers are measurements of this run,
// not claims, so check:facts exempts this file alone (the owner, 2026-10-10).
import type { TerminalRun } from '@/content/en/services/types';

export const buildRun: TerminalRun = {
  date: '2026-10-10',
  commit: 'b7da24a',
  lines: [
    { kind: 'command', text: 'npm run build' },
    { kind: 'output', text: '▲ Next.js 16.3.7 (Turbopack)' },
    { kind: 'output', text: '✓ Compiled successfully in 591ms' },
    { kind: 'output', text: '✓ Generating static pages using 15 workers (25/25) in 583ms' },
    { kind: 'output', text: 'Route (app)' },
    { kind: 'output', text: '┌ ○ /' },
    { kind: 'output', text: '├ ○ /services' },
    { kind: 'output', text: '├   /services/[slug]' },
    { kind: 'output', text: '│ ├ ● /services/speed-to-lead-system' },
    { kind: 'output', text: '│ ├ ● /services/automated-quotation-tracking' },
    { kind: 'output', text: '│ ├ ● /services/sales-follow-up-nurture' },
    { kind: 'output', text: '│ └ ● [+8 more paths]' },
    { kind: 'output', text: '├ ○ /services/custom-coded-websites' },
    { kind: 'command', text: 'npm run check:schema' },
    {
      kind: 'ok',
      text: 'ok 1 [gate-schema] › tests\\gates\\schema.spec.ts:50:5 › golden fixtures match the rendered graphs (54ms)',
    },
    { kind: 'output', text: 'check:schema: 14 page(s), 28 JSON-LD block(s) checked.' },
    { kind: 'ok', text: '2 passed (2.3s)' },
    { kind: 'command', text: 'npm run check:seo' },
    { kind: 'output', text: 'check:seo: 14 indexable page(s) checked, 0 noindex skipped.' },
    { kind: 'ok', text: '1 passed (2.2s)' },
    { kind: 'command', text: 'npm run check:links' },
    {
      kind: 'output',
      text: 'check:links: 14 URL(s) crawled, 277 link(s) checked; 56 header and footer link(s) checked against canonicals.',
    },
    { kind: 'ok', text: '1 passed (2.2s)' },
  ],
};
