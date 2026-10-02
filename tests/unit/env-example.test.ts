import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { accounts } from '@/lib/tracking/accounts';
import { siteConfig } from '@/lib/site-config';

// .env.example is the index of every setting (the owner's rule, handoff §7): every env variable
// read in src/, next.config.ts and scripts/ is listed there, and its closing block names every
// accounts and siteConfig key, and nothing else. So a variable or a fact can't be added without
// its home being written down.

const ENV_EXAMPLE = readFileSync('.env.example', 'utf8');

// What Node and Vercel set themselves; .env.example lists them under "Set automatically".
const AUTOMATIC: (string | RegExp)[] = ['NODE_ENV', /^VERCEL_[A-Z0-9_]+$/];

// A small directory walk without dependencies (Node's fs, as in scripts/check-facts.mjs).
function walk(root: string): string[] {
  return readdirSync(root).flatMap((name) => {
    const path = join(root, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

// The site's own code: src/, next.config.ts and scripts/. Tests are excluded (a test's own read
// isn't the site reading it), and so is this file.
const SCANNED = [
  ...walk('src').filter((file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file)),
  'next.config.ts',
  ...walk('scripts').filter((file) => /\.mjs$/.test(file)),
];

// Every `process.env.X` (or `process.env['X']`) read in the scanned code.
const READ_VARS = new Set(
  SCANNED.flatMap((file) =>
    [...readFileSync(file, 'utf8').matchAll(/process\.env(?:\.([A-Z][A-Z0-9_]*)|\[['"]([A-Z][A-Z0-9_]*)['"]\])/g)].map(
      (match) => match[1] ?? match[2] ?? '',
    ),
  ),
);

const LISTED_VARS = new Set([...ENV_EXAMPLE.matchAll(/^([A-Z][A-Z0-9_]*)=/gm)].map((match) => match[1] ?? ''));

// The settings-index block at the end (names only): every accounts and siteConfig key, and
// nothing else. A key line is written `#   key:` (colon straight after the name), so prose
// lines in the block don't match.
const BLOCK = ENV_EXAMPLE.split('Not env variables: where the other settings live')[1] ?? '';
const BLOCK_NAMES = [...BLOCK.matchAll(/^\s*#\s+([a-z][A-Za-z0-9_]*):/gm)].map((m) => m[1] ?? '');

const ACCOUNT_KEYS = Object.keys(accounts);
const SITE_KEYS = Object.keys(siteConfig);

const isAutomatic = (name: string) =>
  AUTOMATIC.some((rule) => (typeof rule === 'string' ? rule === name : rule.test(name)));

describe('.env.example, the settings index (handoff §7)', () => {
  it('lists every env variable the code reads, except what Node and Vercel set', () => {
    for (const name of READ_VARS) {
      if (isAutomatic(name)) continue;
      expect(LISTED_VARS, `${name} is read in the code but not listed in .env.example`).toContain(name);
    }
  });

  it('may also list variables for phases not built yet (Turnstile, the webhook, Upstash, DeepSeek, PageSpeed), with a comment saying so', () => {
    // The handoff's rule is "every variable listed, nothing lost" — planned variables are listed
    // ahead of their phase, so "read nowhere yet" is not an error. Only the block's key names
    // are held exact, by the test above.
    for (const name of ['NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY', 'N8N_LEAD_WEBHOOK_URL', 'UPSTASH_REDIS_REST_URL', 'DEEPSEEK_API_KEY', 'GOOGLE_PAGESPEED_API_KEY']) {
      expect(LISTED_VARS, `${name} should stay listed even before its phase`).toContain(name);
    }
  });

  it('names every accounts key and every siteConfig key in its closing block, and nothing else', () => {
    expect([...new Set(BLOCK_NAMES)].sort()).toEqual([...new Set([...ACCOUNT_KEYS, ...SITE_KEYS])].sort());
  });

  it('holds no value: every listed variable is empty (names only, the file says)', () => {
    for (const line of ENV_EXAMPLE.split(/\r?\n/)) {
      const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
      if (match) expect(match[2], `${match[1]} must stay empty in .env.example`).toBe('');
    }
  });
});
