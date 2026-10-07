#!/usr/bin/env node
// Rule-system integrity gate (docs/ai/03 · check:rules). No dependencies.
// Fails if: a docs/ai rule file lacks its header, or a path referenced from the
// entry files (CLAUDE.md, AGENTS.md, .claude/**) doesn't exist.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const problems = [];

const read = (p) => readFileSync(join(root, p), 'utf8');
// .claude/worktrees holds other sessions' full checkouts (their own rule copies and node_modules),
// not this checkout's rule system.
const SKIP = new Set([join('.claude', 'worktrees')]);
const walk = (dir) =>
  readdirSync(join(root, dir)).flatMap((name) => {
    const rel = join(dir, name);
    if (SKIP.has(rel)) return [];
    return statSync(join(root, rel)).isDirectory() ? walk(rel) : [rel];
  });

// 1. Every rule file in docs/ai has the standard header.
for (const file of readdirSync(join(root, 'docs/ai')).filter((f) => f.endsWith('.md'))) {
  const text = read(join('docs/ai', file));
  for (const field of ['**Applies to:**', '**Precedence:**', '**Last reviewed:**']) {
    if (!text.includes(field)) problems.push(`docs/ai/${file}: missing header field ${field}`);
  }
}

// 2. Every repo path referenced from the entry files exists.
const entryFiles = ['CLAUDE.md', 'AGENTS.md', ...walk('.claude').filter((f) => f.endsWith('.md'))];
const pathPattern = /(?:@|`)((?:docs|Planning Folder|scripts|\.claude)\/[^`\s*]+?\.(?:md|html|txt|svg|mjs|ps1|json))/g;

for (const file of entryFiles) {
  const text = read(file);
  for (const match of text.matchAll(pathPattern)) {
    const target = match[1];
    if (/[<{]|YYYY/.test(target)) continue; // template placeholders, not real paths
    if (!existsSync(join(root, target))) {
      problems.push(`${relative(root, join(root, file))}: references missing file "${target}"`);
    }
  }
}

if (problems.length) {
  console.error(`check:rules FAILED (${problems.length} problem(s)):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`check:rules passed (${entryFiles.length} entry files, rule headers OK).`);
