#!/usr/bin/env node
// Effects gate (docs/ai/03 · check:effects; docs/ai/13 §10). No dependencies.
// Every effect ID cited in a plan's "Effect register" table must exist in the effects library
// (docs/ai/13 §4). New effects are added to the library first (append-only), then used.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const LIBRARY_FILE = 'docs/ai/13-experience-design.md';
const PLANS_DIR = 'docs/plans';
const EFFECT_ID = /`([a-z0-9]+(?:-[a-z0-9]+)+)`/g;

// IDs defined in 13 §4: the first column of each library table row.
export function libraryIds(markdown) {
  const ids = new Set();
  let inLibrary = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^## 4\./.test(line)) inLibrary = true;
    else if (/^## /.test(line)) inLibrary = false;
    const row = inLibrary && line.match(/^\|\s*`([a-z0-9]+(?:-[a-z0-9]+)+)`\s*\|/);
    if (row) ids.add(row[1]);
  }
  return ids;
}

// IDs cited in the "Effect ID" column of every table under an "Effect register" heading.
export function registerCitations(markdown) {
  const citations = [];
  const problems = [];
  let inRegister = false;
  let idColumn = -1;
  let expectHeader = true;

  markdown.split(/\r?\n/).forEach((line, index) => {
    if (/^#{1,6}\s/.test(line)) {
      inRegister = /^#{1,6}\s+Effect register/i.test(line);
      expectHeader = true;
      return;
    }
    if (!inRegister) return;
    if (!line.startsWith('|')) {
      expectHeader = true; // a new table may follow
      return;
    }
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());
    if (expectHeader) {
      idColumn = cells.findIndex((cell) => /^effect id/i.test(cell));
      if (idColumn === -1)
        problems.push({ line: index + 1, message: 'Effect register table without an "Effect ID" column' });
      expectHeader = false;
      return;
    }
    if (idColumn === -1 || /^[-:\s|]+$/.test(line)) return;
    for (const match of (cells[idColumn] ?? '').matchAll(EFFECT_ID)) citations.push({ id: match[1], line: index + 1 });
  });
  return { citations, problems };
}

function main() {
  const root = process.cwd();
  const known = libraryIds(readFileSync(join(root, LIBRARY_FILE), 'utf8'));
  if (known.size === 0) {
    console.error(`check:effects FAILED: no effect IDs found in ${LIBRARY_FILE} §4 (has its table format changed?).`);
    process.exit(1);
  }

  const plans = readdirSync(join(root, PLANS_DIR)).filter((name) => name.endsWith('.md'));
  const problems = [];
  let cited = 0;
  for (const name of plans) {
    const file = `${PLANS_DIR}/${name}`;
    const { citations, problems: tableProblems } = registerCitations(readFileSync(join(root, file), 'utf8'));
    cited += citations.length;
    for (const p of tableProblems) problems.push(`${file}:${p.line} ${p.message}`);
    for (const c of citations) if (!known.has(c.id)) problems.push(`${file}:${c.line} unknown effect ID "${c.id}"`);
  }

  if (problems.length > 0) {
    console.error(`check:effects FAILED (${problems.length} problem(s)):`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log(`check:effects passed (${known.size} library IDs; ${cited} citation(s) in ${plans.length} plans).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
