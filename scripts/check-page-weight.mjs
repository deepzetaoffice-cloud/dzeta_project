#!/usr/bin/env node
// Page-weight gate (docs/ai/03 · lhci; docs/ai/07 §2; decision 0014). No dependencies. The lhci npm
// script runs it after `lhci autorun`.
// 07 §2 limits HTML + CSS + JS before the first interaction to the framework baseline + 50 KB. lhci
// can't add resource types together, so this adds the document, stylesheet and script transfer sizes
// of every Lighthouse run in .lighthouseci/ and fails if any run is over the limit. Fonts and images
// have their own lhci assertions (lighthouserc.cjs).

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
// The budget lives in the lhci config, so both checks use the same numbers.
import lhciConfig from '../lighthouserc.cjs';

const RESULTS_DIR = '.lighthouseci';
export const FIRST_LOAD_TYPES = ['document', 'stylesheet', 'script'];
export const { FIRST_LOAD_LIMIT, REVIEW_FIRST_LOAD_LIMIT } = lhciConfig.budget;

// A run's limit: the review page's own allowance (conflict C57; never in production), the hard limit
// on every other page.
export function limitFor(url) {
  return new URL(url).pathname === '/shell-review' ? REVIEW_FIRST_LOAD_LIMIT : FIRST_LOAD_LIMIT;
}

// HTML + CSS + JS transfer bytes of one Lighthouse result.
export function firstLoadBytes(lhr) {
  const items = lhr?.audits?.['resource-summary']?.details?.items;
  if (!Array.isArray(items)) throw new Error('no resource-summary audit in this Lighthouse result');
  const byType = Object.fromEntries(items.map((item) => [item.resourceType, item.transferSize]));
  const missing = FIRST_LOAD_TYPES.filter((type) => typeof byType[type] !== 'number');
  if (missing.length > 0) throw new Error(`resource-summary has no ${missing.join(', ')} row`);
  return FIRST_LOAD_TYPES.reduce((sum, type) => sum + byType[type], 0);
}

// Every run against its page's limit. `runs` is [{ name, lhr }].
export function checkRuns(runs, limitOf = limitFor) {
  const problems = [];
  if (runs.length === 0) problems.push(`no Lighthouse results in ${RESULTS_DIR}/: run lhci first`);
  const rows = [];
  for (const { name, lhr } of runs) {
    try {
      const bytes = firstLoadBytes(lhr);
      const url = lhr.finalDisplayedUrl ?? lhr.requestedUrl;
      const limit = limitOf(url);
      rows.push({ name, url, bytes, limit, pass: bytes <= limit });
    } catch (error) {
      problems.push(`${name}: ${error.message}`);
    }
  }
  return { rows, problems, pass: problems.length === 0 && rows.every((row) => row.pass) };
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

function main() {
  const dir = join(process.cwd(), RESULTS_DIR);
  let names = [];
  try {
    names = readdirSync(dir).filter((name) => /^lhr-.*\.json$/.test(name));
  } catch {
    // reported below as "no Lighthouse results"
  }
  const runs = names.map((name) => ({ name, lhr: JSON.parse(readFileSync(join(dir, name), 'utf8')) }));
  const { rows, problems, pass } = checkRuns(runs);

  for (const row of rows) {
    console.log(
      `  ${row.pass ? 'ok  ' : 'FAIL'} ${row.url}  HTML + CSS + JS ${row.bytes} B (${kb(row.bytes)}) of ${row.limit} B`,
    );
  }
  if (!pass) {
    console.error(
      `check:page-weight FAILED: limit ${FIRST_LOAD_LIMIT} B (${kb(FIRST_LOAD_LIMIT)}), baseline + 50 KB (07 §2); the review page ${REVIEW_FIRST_LOAD_LIMIT} B (C57)`,
    );
    for (const row of rows.filter((r) => !r.pass)) console.error(`  ${row.name}: ${row.bytes - row.limit} B over`);
    for (const problem of problems) console.error(`  ${problem}`);
    process.exit(1);
  }
  const tightest = rows.reduce((least, row) => (row.limit - row.bytes < least.limit - least.bytes ? row : least));
  console.log(
    `check:page-weight passed: tightest run ${tightest.url} ${tightest.bytes} B of ${tightest.limit} B (${kb(tightest.limit - tightest.bytes)} left, ${rows.length} runs).`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
