#!/usr/bin/env node
// Token and direction gate (docs/ai/03 · check:tokens). No dependencies.
// Fails on, anywhere in src/:
//   - raw colours or px values outside src/styles/tokens.css (docs/ai/05 §1)
//   - physical-direction classes or properties, which break RTL (docs/ai/11 §1)
//   - Google Fonts hosts, since fonts are self-hosted through next/font (docs/ai/05 §3, lesson 1)

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

export const TOKENS_FILE = 'src/styles/tokens.css';

const SCANNED_FILE = /\.(css|ts|tsx|mts|js|jsx|mjs)$/;
const CSS_FILE = /\.css$/;
const CONTENT_DIR = /^src\/content\//; // copy, not code: prose like "3 spots left" is fine there

// Physical Tailwind utilities; each has a logical replacement (ms-/me-/ps-/pe-/start-/end-/text-start…).
// These only exist with a value suffix ("ml-4", "left-0"), so bare English words such as "left out"
// in a comment don't match.
const PHYSICAL_PREFIX = new RegExp(
  String.raw`(?:^|[\s"'\x60:!])-?(?:ml|mr|pl|pr|left|right|scroll-ml|scroll-mr|scroll-pl|scroll-pr)-`,
);
// These are also complete classes on their own ("border-l", "text-right").
const PHYSICAL_CLASS = new RegExp(
  String.raw`(?:^|[\s"'\x60:!])-?(` +
    [
      'border-l',
      'border-r',
      'rounded-l',
      'rounded-r',
      'rounded-tl',
      'rounded-tr',
      'rounded-bl',
      'rounded-br',
      'text-left',
      'text-right',
      'float-left',
      'float-right',
      'clear-left',
      'clear-right',
      'origin-left',
      'origin-right',
      'origin-top-left',
      'origin-top-right',
      'origin-bottom-left',
      'origin-bottom-right',
      'bg-left',
      'bg-right',
      'bg-left-top',
      'bg-left-bottom',
      'bg-right-top',
      'bg-right-bottom',
      'object-left',
      'object-right',
      'object-left-top',
      'object-left-bottom',
      'object-right-top',
      'object-right-bottom',
    ].join('|') +
    String.raw`)(?:-|(?=[\s"'\x60]|$))`,
);

const RULES = [
  {
    id: 'raw-colour',
    pattern: /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/,
    appliesTo: ({ isTokensFile }) => !isTokensFile,
    message: 'Raw colour value: use a token from src/styles/tokens.css (docs/ai/05 §1).',
  },
  {
    id: 'raw-px-css',
    pattern: /(?<![\w-])\d*\.?\d+px\b/,
    appliesTo: ({ isTokensFile, isCss }) => isCss && !isTokensFile,
    message: 'Raw px value in CSS: use a token or the Tailwind scale (docs/ai/05 §1).',
  },
  {
    id: 'raw-px-arbitrary',
    pattern: /\[[^\]\s]*\d+px[^\]\s]*\]/,
    appliesTo: ({ isCss }) => !isCss,
    message: 'Tailwind arbitrary px value: use a token or the Tailwind scale (docs/ai/05 §1).',
  },
  {
    id: 'physical-class',
    pattern: { test: (line) => PHYSICAL_PREFIX.test(line) || PHYSICAL_CLASS.test(line) },
    appliesTo: ({ isContent }) => !isContent,
    message: 'Physical-direction class: use the logical one (ms-/me-/ps-/pe-/start-/end-/text-start…, docs/ai/11 §1).',
  },
  {
    id: 'physical-css-property',
    pattern: new RegExp(
      [
        String.raw`(?<![\w-])(?:scroll-)?(?:margin|padding)-(?:left|right)\s*:`,
        String.raw`(?<![\w-])border-(?:left|right)(?:-(?:width|style|color))?\s*:`,
        String.raw`(?<![\w-])border-(?:top|bottom)-(?:left|right)-radius\s*:`,
        String.raw`(?<![\w-])(?:left|right)\s*:`,
        String.raw`(?:text-align|float|clear)\s*:\s*(?:left|right)\b`,
      ].join('|'),
    ),
    appliesTo: ({ isCss }) => isCss,
    message: 'Physical-direction CSS property: use margin-inline-*, padding-inline-*, inset-inline-* (docs/ai/11 §1).',
  },
  {
    id: 'physical-style-prop',
    // React style objects. `left:`/`right:` only count with a value that looks like CSS, so plain
    // data keys named "left" don't match.
    pattern: new RegExp(
      [
        String.raw`\b(?:scroll)?(?:margin|padding|Margin|Padding)(?:Left|Right)\s*:`,
        String.raw`\bborder(?:Left|Right)\w*\s*:`,
        String.raw`\bborder(?:Top|Bottom)(?:Left|Right)Radius\s*:`,
        String.raw`\b(?:left|right)\s*:\s*['"\d-]`,
        String.raw`\b(?:textAlign|float|clear)\s*:\s*['"](?:left|right)['"]`,
      ].join('|'),
    ),
    appliesTo: ({ isCss, isContent }) => !isCss && !isContent,
    message: 'Physical-direction style property: use marginInlineStart/End, paddingInlineStart/End (docs/ai/11 §1).',
  },
  {
    id: 'google-fonts',
    pattern: /fonts\.(?:googleapis|gstatic)\.com/,
    appliesTo: () => true,
    message: 'Google Fonts host: fonts are self-hosted through next/font (docs/ai/05 §3, lesson 1).',
  },
];

// Returns the findings for one file. `relPath` uses forward slashes, relative to the repo root.
export function scanText(relPath, text) {
  const context = {
    isTokensFile: relPath === TOKENS_FILE,
    isCss: CSS_FILE.test(relPath),
    isContent: CONTENT_DIR.test(relPath),
  };
  const rules = RULES.filter((rule) => rule.appliesTo(context));
  const findings = [];
  text.split(/\r?\n/).forEach((line, index) => {
    for (const rule of rules) {
      if (rule.pattern.test(line)) {
        findings.push({ file: relPath, line: index + 1, rule: rule.id, message: rule.message, text: line.trim() });
      }
    }
  });
  return findings;
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
  const files = listFiles(root, 'src').filter((file) => SCANNED_FILE.test(file));
  const findings = files.flatMap((file) => scanText(file, readFileSync(join(root, file), 'utf8')));

  if (findings.length > 0) {
    console.error(`check:tokens FAILED (${findings.length} finding(s)):`);
    for (const f of findings) console.error(`  ${f.file}:${f.line} [${f.rule}] ${f.message}\n      ${f.text}`);
    process.exit(1);
  }
  console.log(`check:tokens passed (${files.length} files in ${relative(root, join(root, 'src'))}/ scanned).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
