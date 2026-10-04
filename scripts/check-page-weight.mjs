#!/usr/bin/env node
// Page-weight gate (docs/ai/03 · lhci; docs/ai/07 §2; decisions 0014 and 0021; conflict C54). No
// dependencies. The lhci npm script runs it after lhci has collected and asserted both region profiles.
// It counts the page's own origin only (first party), from each run's list of requests, because lhci
// can neither add resource types together nor tell parties apart:
// - HTML + CSS + JS before the first interaction ≤ the framework baseline + 50 KB (07 §2); the review
//   page alone has its own allowance (C57).
// - JavaScript ≤ the framework baseline + its 5 KB growth allowance + our own measured code
//   (OWN_JS_HOME, within Home's 11 KB cap, 0021), so third-party tags never count against it (C54).
// Third-party requests and bytes are capped per region profile (07 §2, C5's measurement): the
// European profile (no country: the banner, nothing granted) allows GTM only — 1 request, 160 KB —
// and the UAE campaign profile (consent granted by default) 4 requests, 350 KB (lighthouserc.cjs's
// own assertions cover the same numbers per run; this gate reads the run's URL to tell the profiles
// apart). Fonts and images have their own lhci assertions (lighthouserc.cjs).

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
// The budget lives in the lhci config, so both checks use the same numbers.
import lhciConfig from '../lighthouserc.cjs';

const RESULTS_DIR = '.lighthouseci';
export const FIRST_LOAD_TYPES = ['document', 'stylesheet', 'script'];
export const { FIRST_LOAD_LIMIT, REVIEW_FIRST_LOAD_LIMIT, FIRST_PARTY_JS_LIMIT } = lhciConfig.budget;
const { FRAMEWORK_JS_BASELINE, HOME_OWN_JS_CAP } = lhciConfig.budget;

// Third-party caps per region profile (07 §2, C5). The UAE campaign profile runs on 127.0.0.1 so its
// runs stay apart from the European ones (lighthouserc.row.cjs); everything else is the European build.
export const THIRD_PARTY_LIMITS = {
  row: { requests: 4, bytes: 350 * 1024 },
  // 2, not 1: gtm.js plus, in some runs, GTM's own telemetry pixel (googletagmanager.com/a?, 59 B).
  europe: { requests: 2, bytes: 160 * 1024 },
};
export const thirdPartyLimitFor = (url) =>
  new URL(url).hostname === '127.0.0.1' ? THIRD_PARTY_LIMITS.row : THIRD_PARTY_LIMITS.europe;

// A run's JavaScript limit: the framework-growth guard everywhere, and on Home also its own cap, the
// baseline + 11 KB (decision 0021), whichever is lower.
export function jsLimitFor(url) {
  const home = new URL(url).pathname === '/';
  return home ? Math.min(FIRST_PARTY_JS_LIMIT, FRAMEWORK_JS_BASELINE + HOME_OWN_JS_CAP) : FIRST_PARTY_JS_LIMIT;
}

// Lighthouse's request types, as resource-summary names them
const TYPES = { Document: 'document', Stylesheet: 'stylesheet', Script: 'script' };

// A run's page-weight limit: the review page's own allowance (conflict C57; never in production), the
// hard limit on every other page.
export function limitFor(url) {
  return new URL(url).pathname === '/shell-review' ? REVIEW_FIRST_LOAD_LIMIT : FIRST_LOAD_LIMIT;
}

// One Lighthouse result's bytes by party: the page's own origin's HTML, CSS and JS, and everything any
// other origin sent. Requests that aren't http(s) (data: URLs) carry no bytes and are skipped.
export function partyBytes(lhr) {
  const items = lhr?.audits?.['network-requests']?.details?.items;
  if (!Array.isArray(items)) throw new Error('no network-requests audit in this Lighthouse result');
  const origin = new URL(lhr.finalDisplayedUrl ?? lhr.requestedUrl).origin;
  const first = { document: 0, stylesheet: 0, script: 0 };
  const third = { bytes: 0, script: 0, requests: 0 };
  for (const item of items) {
    if (!/^https?:/.test(item.url)) continue;
    const size = item.transferSize ?? 0;
    const type = TYPES[item.resourceType];
    if (new URL(item.url).origin === origin) {
      if (type) first[type] += size;
    } else {
      third.bytes += size;
      third.requests += 1;
      if (type === 'script') third.script += size;
    }
  }
  if (first.document === 0) throw new Error(`no document from ${origin} in this Lighthouse result`);
  return { first, third };
}

// HTML + CSS + JS from the page's own origin.
export const firstLoadBytes = (lhr) => {
  const { first } = partyBytes(lhr);
  return FIRST_LOAD_TYPES.reduce((sum, type) => sum + first[type], 0);
};

// Every run against its page's limits. `runs` is [{ name, lhr }].
export function checkRuns(runs, limitOf = limitFor, jsLimitOf = jsLimitFor, thirdPartyLimitOf = thirdPartyLimitFor) {
  const problems = [];
  if (runs.length === 0) problems.push(`no Lighthouse results in ${RESULTS_DIR}/: run lhci first`);
  const rows = [];
  for (const { name, lhr } of runs) {
    try {
      const { first, third } = partyBytes(lhr);
      const url = lhr.finalDisplayedUrl ?? lhr.requestedUrl;
      const bytes = FIRST_LOAD_TYPES.reduce((sum, type) => sum + first[type], 0);
      const limit = limitOf(url);
      const jsLimit = jsLimitOf(url);
      const thirdLimit = thirdPartyLimitOf(url);
      const thirdOk = third.requests <= thirdLimit.requests && third.bytes <= thirdLimit.bytes;
      rows.push({
        name,
        url,
        bytes,
        limit,
        script: first.script,
        jsLimit,
        third,
        thirdLimit,
        pass: bytes <= limit && first.script <= jsLimit && thirdOk,
      });
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
      `  ${row.pass ? 'ok  ' : 'FAIL'} ${row.url}  first party: HTML + CSS + JS ${row.bytes} B of ${row.limit} B, ` +
        `JS ${row.script} B of ${row.jsLimit} B · third party: ${row.third.requests} requests, ${row.third.bytes} B ` +
        `(JS ${row.third.script} B)`,
    );
  }
  if (!pass) {
    console.error(
      `check:page-weight FAILED: first-party HTML + CSS + JS ≤ ${FIRST_LOAD_LIMIT} B (${kb(FIRST_LOAD_LIMIT)}, 07 §2; ` +
        `the review page ${REVIEW_FIRST_LOAD_LIMIT} B, C57); first-party JS ≤ ${FIRST_PARTY_JS_LIMIT} B (0014), on Home ≤ the baseline + 11 KB (0021); ` +
        `third party ≤ ${THIRD_PARTY_LIMITS.europe.requests} requests ${THIRD_PARTY_LIMITS.europe.bytes} B before consent, ` +
        `≤ ${THIRD_PARTY_LIMITS.row.requests} requests ${THIRD_PARTY_LIMITS.row.bytes} B outside Europe (C5, 07 §2)`,
    );
    for (const row of rows.filter((r) => !r.pass)) {
      const parts = [];
      if (row.bytes > row.limit) parts.push(`${row.bytes - row.limit} B over the page weight`);
      if (row.script > row.jsLimit) parts.push(`${row.script - row.jsLimit} B over the JS`);
      if (row.third.requests > row.thirdLimit.requests)
        parts.push(`${row.third.requests} third-party requests (limit ${row.thirdLimit.requests})`);
      if (row.third.bytes > row.thirdLimit.bytes)
        parts.push(`${row.third.bytes} B third party (limit ${row.thirdLimit.bytes} B)`);
      console.error(`  ${row.name}: ${parts.join(', ')}`);
    }
    for (const problem of problems) console.error(`  ${problem}`);
    process.exit(1);
  }
  const tightest = rows.reduce((least, row) => (row.limit - row.bytes < least.limit - least.bytes ? row : least));
  console.log(
    `check:page-weight passed: tightest run ${tightest.url} ${tightest.bytes} B of ${tightest.limit} B ` +
      `(${kb(tightest.limit - tightest.bytes)} left, ${rows.length} runs); first-party JS at most ` +
      `${Math.max(...rows.map((row) => row.script))} B (Home's limit ${jsLimitFor('http://localhost/')} B).`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
