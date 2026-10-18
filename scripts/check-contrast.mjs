#!/usr/bin/env node
// Contrast gate, Website v3 (docs/ai/03 · check:contrast; docs/ai/05 §2.4; decision 0033). No
// dependencies. Reads src/styles/tokens.css, resolves its tokens and checks the colour pairs below
// against WCAG 2.x: 4.5:1 for text, 3:1 for large text (24 px, or 18.67 px at weight 700 or more) and
// for UI parts such as the focus ring. Gradients are checked at every stop; a translucent fill is
// checked composited over each stop of what sits behind it. Fails on:
//   - a pair below its threshold
//   - a token that's missing or circular, or colour syntax it can't read in a checked value (rather
//     than dropping that colour or gradient stop)
//   - anything in tokens.css outside the documented shape (the file's header), rather than skipping it
// Light only in V1 (C77): one set of tokens, no theme blocks.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const TOKENS_FILE = 'src/styles/tokens.css';
export const THRESHOLDS = { text: 4.5, large: 3, ui: 3 };

const STAGE = '--dz-grad-stage';
const SLABS = ['--dz-slab-1', '--dz-slab-2', '--dz-slab-3', '--dz-slab-4', '--dz-slab-5', '--dz-slab-6'];
const SURFACES = ['--dz-color-bg-canvas', '--dz-color-bg-surface'];
const on = (fg, bgs, kind, note) => bgs.map((bg) => ({ fg, bg, kind, note }));

// The pairs, as token names (05 §2.4). `over` is what sits behind a translucent background.
export const PAIRS = [
  // Text on light
  ...on('--dz-color-text-primary', [...SURFACES, '--dz-color-bg-surface-muted', '--dz-color-bg-violet-soft'], 'text'),
  ...on('--dz-color-text-secondary', [...SURFACES, '--dz-color-bg-surface-muted'], 'text'),
  ...on('--dz-color-text-tertiary', SURFACES, 'text'),
  ...on('--dz-color-text-link', SURFACES, 'text'),
  ...on('--dz-color-text-violet', [...SURFACES, '--dz-color-bg-violet-soft'], 'text'),
  // Error text sits on white surfaces only (4.32:1 on the canvas, C85): a field's error is inside its card
  { fg: '--dz-color-text-error', bg: '--dz-color-bg-surface', kind: 'text' },
  ...on(
    '--dz-color-text-secondary',
    [
      '--dz-color-bg-wash-ai',
      '--dz-color-bg-wash-websites',
      '--dz-color-bg-wash-software',
      '--dz-color-bg-wash-growth',
    ],
    'text',
    'pillar washes',
  ),
  // The primary button and white on colour
  ...on(
    '--dz-color-text-on-color',
    [
      '--dz-color-action-primary',
      '--dz-color-action-primary-end',
      '--dz-color-action-inverse',
      '--dz-color-bg-inverse',
    ],
    'text',
  ),
  { fg: '--dz-color-text-on-color', bg: STAGE, kind: 'text', note: 'white on the stage, every stop' },
  { fg: '--dz-color-accent-violet-on-dark', bg: '--dz-color-bg-inverse', kind: 'text' },
  // White on the stage's glass fill holds only as large text (3.8:1 at the stage's light end): a label
  // on that fill is ≥ 18.67 px bold, or the fill is dropped for a border (05 §2.4)
  {
    fg: '--dz-color-text-on-color',
    bg: '--dz-color-bg-glass-on-color',
    over: STAGE,
    kind: 'large',
    note: 'glass on the stage: large labels only',
  },
  // Text on the pillar fills: white on Software and Growth; ink on AI Automation, and on Websites only
  // as large text (its dark end gives ink 4.1:1)
  { fg: '--dz-color-text-on-color', bg: '--dz-grad-pillar-software', kind: 'text' },
  { fg: '--dz-color-text-on-color', bg: '--dz-grad-pillar-growth', kind: 'text' },
  { fg: '--dz-color-text-on-vibrant', bg: '--dz-grad-pillar-ai', kind: 'text' },
  { fg: '--dz-color-text-on-vibrant', bg: '--dz-grad-pillar-websites', kind: 'large', note: 'large ink only' },
  // The hero's rotating phrase: violet display type on each slab (decision 0033 §3)
  ...on('--dz-color-text-violet', SLABS, 'large', 'the rotating phrase'),
  // The focus ring, against the white gap it always sits beside and the light surfaces
  ...on('--dz-color-border-focus', [...SURFACES, '--dz-color-bg-surface-muted'], 'ui', 'focus ring'),
  // A form field's boundary identifies it (WCAG 1.4.11): border/field, never border/strong (1.7:1, C85)
  ...on('--dz-color-border-field', SURFACES, 'ui', 'a form field edge'),
];

// Measured and printed on every run, never failing: supplementary accents that never carry meaning
// alone (C38, C80): the pillar pixels and signal orange.
export const REPORTED = [
  ...[
    '--dz-grad-pillar-ai',
    '--dz-grad-pillar-websites',
    '--dz-grad-pillar-software',
    '--dz-grad-pillar-growth',
  ].flatMap((fg) => on(fg, SURFACES, 'ui')),
  ...on('--dz-color-accent-signal', SURFACES, 'ui'),
];

// Printed on every run, so the output never claims more than it checked.
export const NOT_CHECKED = [
  'text on photos and video: each slot carries its own scrim or sits outside the image (08 §7, Phase D)',
  'tertiary text on surface-muted: never used (4.2:1)',
  'error text on the canvas: never used (4.32:1, C85); errors sit inside white cards',
  "a Secondary button's border/strong edge (1.7:1): its label identifies the button, so the edge isn't required (C85)",
  'hairlines (border/default): decorative, not a boundary',
  'the WhatsApp colours: inside the chat mock only, where the mock carries its own labels',
];

// ---------------------------------------------------------------------------------------------
// Parsing

// Splits `a; b; c` on the semicolons outside parentheses.
function splitDeclarations(body) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const char of body) {
    if (char === '(') depth++;
    if (char === ')') depth--;
    if (char === ';' && depth === 0) {
      parts.push(current);
      current = '';
    } else current += char;
  }
  if (current.trim()) parts.push(current);
  return parts.map((part) => part.trim()).filter(Boolean);
}

function parseDeclarations(body, where, problems, into) {
  for (const declaration of splitDeclarations(body)) {
    const colon = declaration.indexOf(':');
    const name = declaration.slice(0, colon).trim();
    const value = declaration
      .slice(colon + 1)
      .trim()
      .replace(/\s+/g, ' ');
    if (colon === -1 || !value) problems.push(`${where}: can't read the declaration "${declaration}"`);
    else if (name === 'color-scheme') continue;
    else if (!/^--[a-z0-9-]+$/.test(name))
      problems.push(`${where}: only custom properties belong here, found "${name}"`);
    else if (into.has(name)) problems.push(`${where}: ${name} is declared twice`);
    else into.set(name, value);
  }
}

// Top-level blocks as { prelude, body }.
function topLevelBlocks(css, where, problems) {
  const blocks = [];
  let depth = 0;
  let prelude = '';
  let body = '';
  for (const char of css) {
    if (char === '{') {
      if (depth > 0) body += char;
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth < 0) {
        problems.push(`${where}: unbalanced "}"`);
        return blocks;
      }
      if (depth === 0) {
        blocks.push({ prelude: prelude.trim().replace(/\s+/g, ' '), body });
        prelude = '';
        body = '';
      } else body += char;
    } else if (depth === 0) prelude += char;
    else body += char;
  }
  if (depth !== 0) problems.push(`${where}: unbalanced "{"`);
  if (prelude.trim()) problems.push(`${where}: text outside a block: "${prelude.trim().slice(0, 60)}"`);
  return blocks;
}

// Reads tokens.css: the two :root blocks (the primitives, then everything else), @media blocks that
// only reset layout tokens, and the @theme mapping, which browsers and this gate skip.
export function parseTokens(css) {
  const problems = [];
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const tokens = new Map();
  let roots = 0;
  for (const block of topLevelBlocks(source, TOKENS_FILE, problems)) {
    if (/^@theme\b/.test(block.prelude)) continue;
    if (/^@media\b/.test(block.prelude)) {
      for (const inner of topLevelBlocks(block.body, block.prelude, problems)) {
        if (inner.prelude !== ':root') {
          problems.push(`"${block.prelude}": only a :root block belongs inside, found "${inner.prelude}"`);
          continue;
        }
        const layout = new Map();
        parseDeclarations(inner.body, block.prelude, problems, layout);
        for (const name of layout.keys()) {
          if (!name.startsWith('--dz-layout-')) {
            problems.push(`"${block.prelude}": only layout tokens change at a breakpoint, found ${name}`);
          }
        }
      }
      continue;
    }
    if (block.prelude !== ':root') {
      problems.push(`unexpected block "${block.prelude}": the tokens shape has two :root blocks, @media and @theme`);
      continue;
    }
    if (block.body.includes('{')) {
      problems.push(":root: nested blocks aren't part of the tokens shape");
      continue;
    }
    roots++;
    parseDeclarations(block.body, `:root #${roots}`, problems, tokens);
  }
  if (roots !== 2) problems.push(`expected two :root blocks (the primitives, then the rest), found ${roots}`);
  return { tokens, problems };
}

// ---------------------------------------------------------------------------------------------
// Colour

const HEX = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi;

function hexToRgba(hex) {
  let h = hex.slice(1);
  if (h.length <= 4) h = [...h].map((c) => c + c).join('');
  const n = (i) => parseInt(h.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
}

// oklch(L C H [/ A]) to sRGB (CSS Color 4), so tokens may be written in oklch.
function oklchToRgba(args) {
  const [main, alphaPart] = args.split('/');
  const parts = main.trim().split(/[\s,]+/);
  if (parts.length < 3) return null;
  const L = parts[0].endsWith('%') ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]);
  const C = parseFloat(parts[1]);
  const H = (parseFloat(parts[2]) * Math.PI) / 180;
  if ([L, C, H].some(Number.isNaN)) return null;
  const a = C * Math.cos(H);
  const b = C * Math.sin(H);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  const gamma = (x) => {
    const c = Math.min(Math.max(x, 0), 1);
    return 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
  };
  const alpha =
    alphaPart === undefined ? 1 : alphaPart.trim().endsWith('%') ? parseFloat(alphaPart) / 100 : parseFloat(alphaPart);
  return { r: gamma(lin[0]), g: gamma(lin[1]), b: gamma(lin[2]), a: alpha };
}

const OKLCH = /oklch\(([^)]*)\)/gi;

// Every colour in a resolved value, in order: one for a solid colour, each stop for a gradient.
export function coloursIn(value) {
  const found = [];
  for (const m of value.matchAll(HEX)) found.push({ at: m.index, colour: hexToRgba(m[0]) });
  for (const m of value.matchAll(OKLCH)) {
    const colour = oklchToRgba(m[1]);
    if (colour) found.push({ at: m.index, colour });
  }
  return found.sort((x, y) => x.at - y.at).map((f) => f.colour);
}

// What may sit around the colours in a checked value: gradient functions, their geometry and stop
// positions. Any other word is colour syntax coloursIn() can't read, so the pair fails instead.
const GEOMETRY =
  /^(?:(?:repeating-)?(?:linear|radial|conic)-gradient|to|top|bottom|left|right|center|at|from|circle|ellipse|closest-side|closest-corner|farthest-side|farthest-corner|-?\d*\.?\d+(?:deg|grad|rad|turn|%|px|rem|em)?)$/i;

export function unreadColourSyntax(value) {
  const rest = value.replace(HEX, ' ').replace(OKLCH, (match, args) => (oklchToRgba(args) ? ' ' : match));
  return rest.split(/[\s,()/]+/).filter((word) => word && !GEOMETRY.test(word));
}

const linear = (c) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = ({ r, g, b }) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

// A colour with alpha, composited over an opaque background, as the browser paints it.
export const composite = (fg, bg) => ({
  r: fg.a * fg.r + (1 - fg.a) * bg.r,
  g: fg.a * fg.g + (1 - fg.a) * bg.g,
  b: fg.a * fg.b + (1 - fg.a) * bg.b,
  a: 1,
});

export function contrastRatio(fg, bg) {
  const [lighter, darker] = [luminance(composite(fg, bg)), luminance(bg)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

export const toHex = ({ r, g, b }) => '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');

// ---------------------------------------------------------------------------------------------
// The check

// The value of a token, with every var() resolved.
export function resolveToken(name, tokens, seen = []) {
  if (seen.includes(name)) throw new Error(`circular var(): ${[...seen, name].join(' → ')}`);
  const value = tokens.get(name);
  if (value === undefined) throw new Error(`${name} isn't defined${seen.length ? ` (used by ${seen.at(-1)})` : ''}`);
  return value.replace(/var\(\s*(--[a-z0-9-]+)\s*(?:,[^)]*)?\)/g, (_, ref) =>
    resolveToken(ref, tokens, [...seen, name]),
  );
}

export function checkContrast(css, pairs = PAIRS) {
  const parsed = parseTokens(css);
  const problems = [...parsed.problems];
  const results = [];
  if (parsed.problems.length > 0) return { results, problems };
  const { tokens } = parsed;
  for (const pair of pairs) {
    const where = `${pair.fg} on ${pair.bg}${pair.over ? ` over ${pair.over}` : ''}`;
    let values;
    try {
      values = [pair.fg, pair.bg, ...(pair.over ? [pair.over] : [])].map((name) => resolveToken(name, tokens));
    } catch (error) {
      problems.push(`${where}: ${error.message}`);
      continue;
    }
    const unread = values.flatMap(unreadColourSyntax);
    if (unread.length > 0) {
      problems.push(`${where}: can't read "${unread.join('", "')}", so a colour would go unchecked`);
      continue;
    }
    const [fgColours, rawBg, overColours] = values.map(coloursIn);
    if (fgColours.length === 0 || rawBg.length === 0 || (pair.over && overColours.length === 0)) {
      problems.push(`${where}: no colour found to check`);
      continue;
    }
    let bgColours = rawBg;
    if (pair.over) {
      if (overColours.some((c) => c.a < 1)) {
        problems.push(`${where}: ${pair.over} must be opaque`);
        continue;
      }
      bgColours = rawBg.flatMap((bg) => overColours.map((behind) => composite(bg, behind)));
    } else if (bgColours.some((c) => c.a < 1)) {
      problems.push(
        `${where}: the background isn't opaque, so its contrast depends on what's behind it (name \`over\`)`,
      );
      continue;
    }
    let worst = null;
    for (const fg of fgColours) {
      for (const bg of bgColours) {
        const ratio = contrastRatio(fg, bg);
        if (!worst || ratio < worst.ratio) worst = { ratio, worstFg: toHex(composite(fg, bg)), worstBg: toHex(bg) };
      }
    }
    const threshold = THRESHOLDS[pair.kind];
    results.push({ ...pair, ...worst, threshold, pass: worst.ratio >= threshold });
  }
  return { results, problems };
}

const label = (r) => `${r.fg} on ${r.bg}${r.over ? ` over ${r.over}` : ''}`;

function main() {
  const css = readFileSync(join(process.cwd(), TOKENS_FILE), 'utf8');
  const { results, problems } = checkContrast(css, PAIRS);
  const reported = checkContrast(css, REPORTED);
  problems.push(...reported.problems.filter((p) => !problems.includes(p)));

  for (const r of results) {
    const note = r.note ? ` (${r.note})` : '';
    console.log(
      `  ${r.pass ? 'ok  ' : 'FAIL'} ${label(r).padEnd(70)} ${r.ratio.toFixed(2).padStart(5)}:1` +
        ` ≥ ${r.threshold} ${r.kind}, worst ${r.worstFg} on ${r.worstBg}${note}`,
    );
  }
  console.log('Reported, not gated (C38, C80: supplementary accents):');
  for (const r of reported.results) {
    console.log(
      `  ${r.pass ? 'ok  ' : 'low '} ${label(r).padEnd(70)} ${r.ratio.toFixed(2).padStart(5)}:1 (${r.threshold} ${r.kind})`,
    );
  }
  console.log('Not checked:');
  for (const item of NOT_CHECKED) console.log(`  - ${item}`);

  const failures = results.filter((r) => !r.pass);
  if (problems.length > 0 || failures.length > 0) {
    console.error(`check:contrast FAILED (${failures.length} pair(s) below threshold, ${problems.length} problem(s)):`);
    for (const f of failures) console.error(`  ${label(f)}: ${f.ratio.toFixed(2)}:1 < ${f.threshold} (${f.kind})`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log(`check:contrast passed (${results.length} checks in ${TOKENS_FILE}).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
