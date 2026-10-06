#!/usr/bin/env node
// Facts gate (docs/ai/03 · check:facts; docs/ai/02 §1.3). No dependencies.
// P0 fails on [[TODO markers in src/content/**: placeholders must never ship.
// P3 part C adds the retyped-facts check (the owner's rule, handoff §7.3): a contact fact from
// the site config (email, address, phone and WhatsApp once set, each social URL) typed literally
// in src/ or scripts/ outside site-config.ts fails the gate.
// P4 adds the numbers allowlist (every number in content must come from the facts allowlist).

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const CONTENT_DIR = 'src/content';
const CONTENT_FILE = /\.(ts|tsx|md|mdx|json)$/;
const SCAN_DIRS = ['src', 'scripts'];
const SCAN_FILE = /\.(ts|tsx|mjs|mts)$/;
// The site config holds the facts by design; its test quotes them to check them.
const FACT_FILES = [/src[\\/]lib[\\/]site-config\.ts$/, /tests[\\/]unit[\\/]site-config\.test\.ts$/];

export function findTodoMarkers(relPath, text) {
  return text
    .split(/\r?\n/)
    .flatMap((line, index) => (line.includes('[[TODO') ? [{ file: relPath, line: index + 1, text: line.trim() }] : []));
}

// The contact facts a file may not retype (handoff §7.3). Null facts (phone, WhatsApp) have
// nothing to check yet; each social URL counts once it's set.
export function contactFacts(siteConfig) {
  return [
    siteConfig.email,
    siteConfig.address,
    siteConfig.phone,
    siteConfig.whatsapp,
    ...(siteConfig.social ?? []).map((profile) => profile.url),
  ].filter((value) => typeof value === 'string' && value.length > 0);
}

export function findRetypedFacts(relPath, text, facts) {
  return facts.filter((fact) => text.includes(fact)).map((fact) => ({ file: relPath, fact }));
}

function listFiles(root, dir) {
  let names;
  try {
    names = readdirSync(join(root, dir));
  } catch {
    return [];
  }
  return names.flatMap((name) => {
    const rel = `${dir}/${name}`;
    return statSync(join(root, rel)).isDirectory() ? listFiles(root, rel) : [rel];
  });
}

// The numbers allowlist (P4, S9; facts §6): every number in content copy must be a listed fact.
// Checked on the prose strings of src/content/** — the copy that ships — not on code: comments,
// identifiers and registry rows are stripped first. Catalogue numbers ("1A.1", "5.6" in a name)
// are IDs, not claims; prices are UNKNOWN until the owner provides them.
const ALLOWED_NUMBERS = new Set([
  '60 seconds', // facts §6: Speed-to-Lead reply target (service design)
  '24/7', // facts §6: availability of AI agents (service design)
  '2.5', // facts §6: Google "good" LCP threshold (public definition)
  '200', // facts §6: Google "good" INP threshold
  '0.1', // facts §6: Google "good" CLS threshold
]);

export function findUnsourcedNumbers(relPath, text) {
  // The internal review page states its own display size (the icon gallery's 128 px) — a design
  // fact of that page, not a business claim.
  if (relPath.replace(/\\/g, '/') === 'src/content/en/shell-review.ts') return [];
  // Strip comments, then keep only quoted prose (strings with a space — sentences, not IDs).
  const noComments = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const strings = [...noComments.matchAll(/(['"`])((?:\1|[^])*?)\1/g)].map((m) => m[2]);
  return strings
    .filter((value) => value.includes(' '))
    .flatMap((value) => [...value.matchAll(/\b\d[\d.,]*\s*(?:\/\d[\d.,]*)?\s*(?:seconds?|s|ms)?\b/g)])
    .map((match) => match[0].trim())
    .filter(
      (value) =>
        !ALLOWED_NUMBERS.has(value) &&
        // A catalogue number is "N", "N.N" or "NA.N" (sections 1–6) — an ID, not a claim. A plain
        // multi-digit number like "300" is a claim and must fail.
        !/^[1-6][A-F]?(\.\d{1,2})?$/.test(value) &&
        !/^202\d/.test(value),
    )
    .map((value) => ({ file: relPath, value }));
}

async function main() {
  const root = process.cwd();
  const files = listFiles(root, CONTENT_DIR).filter((file) => CONTENT_FILE.test(file));
  const findings = files.flatMap((file) => findTodoMarkers(file, readFileSync(join(root, file), 'utf8')));

  if (findings.length > 0) {
    console.error(`check:facts FAILED (${findings.length} [[TODO marker(s) in content that ships):`);
    for (const f of findings) console.error(`  ${f.file}:${f.line}  ${f.text}`);
    process.exit(1);
  }

  // The retyped-facts check. The site config is imported through Node's own TypeScript loader
  // (as next.config imports the tracking modules), so the check reads the same values the site
  // ships, not a copy.
  const { siteConfig } = await import(pathToFileURL(join(root, 'src/lib/site-config.ts')).href);
  const facts = contactFacts(siteConfig);
  const scanned = SCAN_DIRS.flatMap((dir) =>
    listFiles(root, dir).filter(
      (file) => SCAN_FILE.test(file) && !FACT_FILES.some((allowed) => allowed.test(file.replace(/\\/g, '/'))),
    ),
  );
  const retyped = scanned.flatMap((file) => findRetypedFacts(file, readFileSync(join(root, file), 'utf8'), facts));

  if (retyped.length > 0) {
    console.error(`check:facts FAILED (${retyped.length} contact fact(s) retyped outside the site config):`);
    for (const f of retyped) console.error(`  ${f.file}  ${f.fact}`);
    process.exit(1);
  }

  // The numbers allowlist (P4, S9; facts §6).
  const numberFindings = files.flatMap((file) => findUnsourcedNumbers(file, readFileSync(join(root, file), 'utf8')));

  if (numberFindings.length > 0) {
    console.error(`check:facts FAILED (${numberFindings.length} number(s) not in the facts allowlist):`);
    for (const f of numberFindings.slice(0, 40)) console.error(`  ${f.file}  "${f.value}"`);
    process.exit(1);
  }

  console.log(
    `check:facts passed (${files.length} content files, no [[TODO markers; ${scanned.length} scanned files, ${facts.length} contact facts, none retyped; the numbers allowlist).`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
