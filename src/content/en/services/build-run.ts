// The build terminal's recording (terminal-replay, 13 §4.4: real commands and output only;
// custom-coded-websites.md §06). A real run of this site's own build and checks on commit f85a0d4
// (2026-10-19, the v3 rebuild; the owner asked for it the same day): the lines are the commands'
// own output, selected and never edited (leading spaces trimmed). Lighthouse is not part of v3's
// gates (decision 0033), so the run holds the build and the three site checks only. Its numbers are
// measurements of this run, not claims, so check:facts exempts this file alone (the owner,
// 2026-10-10).
import type { TerminalRun } from '@/content/en/services/types';

export const buildRun: TerminalRun = {
  date: '2026-10-19',
  commit: 'f85a0d4',
  lines: [
    { kind: 'command', text: 'npm run build' },
    { kind: 'output', text: '▲ Next.js 16.3.7 (Turbopack)' },
    { kind: 'output', text: '✓ Compiled successfully in 426ms' },
    { kind: 'output', text: '✓ Generating static pages using 15 workers (27/27) in 449ms' },
    { kind: 'output', text: 'Route (app)' },
    { kind: 'output', text: '┌ ○ /' },
    { kind: 'output', text: '├ ○ /privacy' },
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
      text: 'ok 2 [gate-schema] › tests\\gates\\schema.spec.ts:50:5 › golden fixtures match the rendered graphs (59ms)',
    },
    { kind: 'output', text: 'check:schema: 15 page(s), 30 JSON-LD block(s) checked.' },
    { kind: 'ok', text: '2 passed (2.3s)' },
    { kind: 'command', text: 'npm run check:seo' },
    { kind: 'output', text: 'check:seo: 15 indexable page(s) checked, 0 noindex skipped.' },
    { kind: 'ok', text: '1 passed (2.3s)' },
    { kind: 'command', text: 'npm run check:links' },
    {
      kind: 'output',
      text: 'check:links: 15 URL(s) crawled, 673 link(s) checked; 285 header and footer link(s) checked against canonicals.',
    },
    { kind: 'ok', text: '1 passed (2.3s)' },
  ],
};
