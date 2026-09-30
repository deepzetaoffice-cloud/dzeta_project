#!/usr/bin/env node
// Facts gate (docs/ai/03 · check:facts; docs/ai/02 §1.3). No dependencies.
// P0 fails on [[TODO markers in src/content/**: placeholders must never ship.
// P4 adds the numbers allowlist (every number in content must come from the facts allowlist).

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const CONTENT_DIR = 'src/content';
const CONTENT_FILE = /\.(ts|tsx|md|mdx|json)$/;

export function findTodoMarkers(relPath, text) {
  return text
    .split(/\r?\n/)
    .flatMap((line, index) => (line.includes('[[TODO') ? [{ file: relPath, line: index + 1, text: line.trim() }] : []));
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

function main() {
  const root = process.cwd();
  const files = listFiles(root, CONTENT_DIR).filter((file) => CONTENT_FILE.test(file));
  const findings = files.flatMap((file) => findTodoMarkers(file, readFileSync(join(root, file), 'utf8')));

  if (findings.length > 0) {
    console.error(`check:facts FAILED (${findings.length} [[TODO marker(s) in content that ships):`);
    for (const f of findings) console.error(`  ${f.file}:${f.line}  ${f.text}`);
    process.exit(1);
  }
  console.log(`check:facts passed (${files.length} content files, no [[TODO markers).`);
  console.log('  not checked yet: the numbers allowlist (enabled in P4)');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
