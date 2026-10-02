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
  return facts
    .filter((fact) => text.includes(fact))
    .map((fact) => ({ file: relPath, fact }));
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

  console.log(
    `check:facts passed (${files.length} content files, no [[TODO markers; ${scanned.length} scanned files, ${facts.length} contact facts, none retyped).`,
  );
  console.log('  not checked yet: the numbers allowlist (enabled in P4)');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
