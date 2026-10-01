#!/usr/bin/env node
// Contrast gate (docs/ai/03 · check:contrast; docs/ai/05 §2; decision 0015). No dependencies.
// Reads src/styles/tokens.css, resolves each theme's tokens and checks the colour pairs below against
// WCAG 2.x: 4.5:1 for text, 3:1 for large text (24 px, or 18.67 px at weight 700 or more) and for UI
// parts such as focus rings. A pair whose size and weight are tokens is called large text only while
// those tokens still qualify; otherwise it's held to 4.5:1. Fails on:
//   - a pair below its threshold, in any theme
//   - a semantic token without a value in both themes
//   - an @media block: every first visit is dark, and light comes only from the visitor's choice
//     (05 §1, decision 0015), so a prefers-color-scheme block must not come back unnoticed
//   - anything in tokens.css outside the documented shape (the file's header), rather than skipping it
//   - colour syntax it can't read in a checked value (hsl(), oklch(), color-mix(), transparent, a named
//     colour…), rather than dropping that colour or gradient stop
// Glass tints are translucent, so each glass pair is checked over the worst backdrop that can pass
// behind it, and again with the frost grain's brightest speck on top (read from the grain file itself).

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const TOKENS_FILE = 'src/styles/tokens.css';
export const GRAIN_FILE = 'public/brand/glass-grain.svg';
export const THRESHOLDS = { text: 4.5, large: 3, ui: 3 };
// WCAG 2.x large text: 18 pt (24 px), or 14 pt (18.67 px) bold. A rem is the browser's default 16 px.
export const LARGE_TEXT = { px: 24, boldPx: 56 / 3, boldWeight: 700, remPx: 16 };

const PRIMITIVES = ':root';
const DARK = ":root, [data-theme='dark']";
const LIGHT = "[data-theme='light']";
export const THEMES = ['dark', 'light'];

// The pairs, as token names. `themes` lists where a pair is checked: semantic tokens in both themes;
// brand primitives, which never switch, once, from the primitives alone. Gradients are checked at
// every stop.
const both = THEMES;
const once = ['brand'];
// What can pass behind glass, at its worst: the brightest surface under the dark tint, the darkest
// under the light one.
const GLASS_BACKDROP = { dark: '--dz-card-light', light: '--dz-navy' };
export const PAIRS = [
  { fg: '--dz-text', bg: '--dz-bg', kind: 'text', themes: both },
  { fg: '--dz-text', bg: '--dz-surface', kind: 'text', themes: both },
  { fg: '--dz-text-strong', bg: '--dz-bg', kind: 'text', themes: both },
  { fg: '--dz-text-strong', bg: '--dz-surface', kind: 'text', themes: both },
  { fg: '--dz-text-muted', bg: '--dz-bg', kind: 'text', themes: both },
  { fg: '--dz-text-muted', bg: '--dz-surface', kind: 'text', themes: both },
  { fg: '--dz-link', bg: '--dz-bg', kind: 'text', themes: both },
  { fg: '--dz-link', bg: '--dz-surface', kind: 'text', themes: both },
  { fg: '--dz-focus', bg: '--dz-bg', kind: 'ui', themes: both },
  { fg: '--dz-focus', bg: '--dz-surface', kind: 'ui', themes: both },
  {
    fg: '--dz-grad-headline',
    bg: '--dz-bg',
    kind: 'large',
    themes: both,
    note: 'headline words, page background only',
  },
  // The raised surface is dark only for now
  { fg: '--dz-white', bg: '--dz-navy-800', kind: 'text', themes: once },
  { fg: '--dz-frost', bg: '--dz-navy-800', kind: 'text', themes: once },
  { fg: '--dz-mist', bg: '--dz-navy-800', kind: 'text', themes: once },
  // The error page's "Try again" button: its mist edge on navy is its boundary (05 §2, 3:1)
  { fg: '--dz-mist', bg: '--dz-navy', kind: 'ui', themes: once, note: 'error page button edge' },
  // The primary CTA: navy text on the action gradient; white on its hover gradient in large text only (05 §2)
  { fg: '--dz-navy', bg: '--dz-grad-action', kind: 'text', themes: once, note: 'primary CTA' },
  { fg: '--dz-white', bg: '--dz-grad-action-deep', kind: 'large', themes: once, note: 'primary CTA hover' },
  // Solid signal fills: navy text; white in large text only (0015, Q2)
  { fg: '--dz-navy', bg: '--dz-signal', kind: 'text', themes: once },
  { fg: '--dz-white', bg: '--dz-signal', kind: 'large', themes: once },
  // Slate is for large labels and disabled states only (0015)
  { fg: '--dz-slate', bg: '--dz-navy', kind: 'large', themes: once },
  { fg: '--dz-slate', bg: '--dz-navy-850', kind: 'large', themes: once },
  { fg: '--dz-slate', bg: '--dz-navy-800', kind: 'large', themes: once },
  { fg: '--dz-violet-soft', bg: '--dz-navy', kind: 'text', themes: once },
  { fg: '--dz-violet-soft', bg: '--dz-navy-850', kind: 'text', themes: once },
  // Status colours on dark (light variants come with their first use)
  ...['--dz-ok', '--dz-warn', '--dz-bad', '--dz-info'].flatMap((fg) => [
    { fg, bg: '--dz-navy', kind: 'text', themes: once },
    { fg, bg: '--dz-navy-850', kind: 'text', themes: once },
  ]),
  { fg: '--dz-accent-light', bg: '--dz-paper', kind: 'text', themes: once },
  { fg: '--dz-accent-light', bg: '--dz-card-light', kind: 'text', themes: once },
  // Disabled icon lines on the light page (C37). Icon lines at rest and on hover use --dz-text and
  // --dz-text-strong, checked above in both themes; slate on the dark surfaces is checked above too.
  { fg: '--dz-slate', bg: '--dz-paper', kind: 'ui', themes: once, note: 'disabled icon lines' },
  { fg: '--dz-slate', bg: '--dz-card-light', kind: 'ui', themes: once, note: 'disabled icon lines' },
  // Glass (13 §4.1; P2 plan, F3): text on at least the minimum tint, mist on the muted one. Blur and
  // saturation only average the backdrop, so a flat white card (behind dark glass) or navy (behind
  // light glass) is the worst case for glass-live too.
  ...[
    { fg: '--dz-text', bg: '--dz-glass-tint-min', kind: 'text' },
    { fg: '--dz-text-strong', bg: '--dz-glass-tint-min', kind: 'text' },
    { fg: '--dz-focus', bg: '--dz-glass-tint-min', kind: 'ui' },
    { fg: '--dz-text-muted', bg: '--dz-glass-tint-muted', kind: 'text' },
  ].map((pair) => ({ ...pair, themes: both, backdrop: GLASS_BACKDROP, note: 'glass, worst backdrop and grain' })),
  // The mega menu and the sheet are always navy (data-theme="dark"): their links, and mist on a lit
  // menu row, whose hover fill is painted over the glass (P2 step 12).
  ...[
    { fg: '--dz-link', bg: '--dz-glass-tint-muted', kind: 'text', note: 'menu links' },
    {
      fg: '--dz-text-muted',
      bg: '--dz-glass-tint-muted',
      overlay: '--dz-menu-hover',
      kind: 'text',
      note: 'mist on a lit menu row',
    },
  ].map((pair) => ({ ...pair, themes: ['dark'], backdrop: GLASS_BACKDROP })),
  // The social letter tiles (conflict C49), always on the navy footer: each letter on its platform's
  // colour (Instagram's on its gradient's centre, where the letter sits), and the signal edge that
  // bounds every tile, the black ones included. The letter is each link's only visible label, so it's
  // text: 19 px at weight 800 (--dz-social-letter and its weight token), large text, held to 3:1 (P2
  // step 16), as long as those two tokens keep it large (P3 plan, A fix 7).
  ...[
    ['--dz-white', '--dz-social-linkedin'],
    ['--dz-white', '--dz-social-instagram-centre'],
    ['--dz-white', '--dz-social-facebook'],
    ['--dz-white', '--dz-social-youtube'],
    ['--dz-white', '--dz-social-black'],
    ['--dz-social-black', '--dz-social-snapchat'],
    ['--dz-white', '--dz-social-pinterest'],
  ].map(([fg, bg]) => ({
    fg,
    bg,
    kind: 'large',
    largeText: { size: '--dz-social-letter', weight: '--dz-social-letter-weight' },
    themes: once,
    note: 'social tile letter, size and weight from its tokens',
  })),
  { fg: '--dz-grad-signal', bg: '--dz-navy', kind: 'ui', themes: once, note: 'social tile edge' },
];

// Measured and printed on every run, but never failing (conflict C38). The pillar pixels are the
// locked logo's own colours, and an icon's meaning is carried by its lines and its text label, so the
// pixel is a supplementary accent. Each gradient is measured at every stop, on every icon surface.
const ICON_SURFACES = ['--dz-navy', '--dz-navy-900', '--dz-navy-850', '--dz-navy-800', '--dz-paper', '--dz-card-light'];
export const REPORTED = ['--dz-pixel-ai', '--dz-pixel-web', '--dz-pixel-software', '--dz-pixel-ranking'].flatMap((fg) =>
  ICON_SURFACES.map((bg) => ({ fg, bg, kind: 'ui', themes: once })),
);

// Printed on every run, so the output never claims more than it checked.
export const NOT_CHECKED = [
  'glass-liquid: its rim and sheen are light over the gated minimum tint, which carries its text',
  'light-mode status colours, accent surfaces, raised surfaces and shadows: the first plan that uses them',
  '--dz-border as the only boundary of a form field (2.24:1 on navy): P6 forms',
  'hairlines: decorative, not a boundary',
  "the display switch's signal track on glass: the white thumb's place and the label carry the state",
  "the header CTA's outline edge (--dz-cta-edge): its label identifies the button, so the edge isn't required",
  "Instagram's tile at its gradient's ends, and TikTok's cyan and red copies: the letter sits on the centre, and the copies are a hover accent under the white T",
];

// ---------------------------------------------------------------------------------------------
// Parsing

const normaliseSelector = (s) =>
  s
    .replace(/"/g, "'")
    .split(',')
    .map((part) => part.trim().replace(/\s+/g, ' '))
    .join(', ');

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

function parseDeclarations(body, where, problems) {
  const declarations = new Map();
  let colorScheme;
  for (const declaration of splitDeclarations(body)) {
    const colon = declaration.indexOf(':');
    const name = declaration.slice(0, colon).trim();
    const value = declaration
      .slice(colon + 1)
      .trim()
      .replace(/\s+/g, ' ');
    if (colon === -1 || !value) {
      problems.push(`${where}: can't read the declaration "${declaration}"`);
    } else if (name === 'color-scheme') {
      colorScheme = value;
    } else if (!/^--[a-z0-9-]+$/.test(name)) {
      problems.push(`${where}: only custom properties and color-scheme belong here, found "${name}"`);
    } else if (declarations.has(name)) {
      problems.push(`${where}: ${name} is declared twice`);
    } else {
      declarations.set(name, value);
    }
  }
  return { declarations, colorScheme };
}

// Top-level blocks as { prelude, body }. The body of an @media block is parsed one level deeper.
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

// Reads tokens.css into its primitives and the declarations of each theme block.
export function parseTokens(css) {
  const problems = [];
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const primitives = new Map();
  const themes = {};

  const addFlat = (selector, body, where) => {
    if (body.includes('{')) {
      problems.push(`${where}: nested blocks aren't part of the tokens shape`);
      return;
    }
    const parsed = parseDeclarations(body, where, problems);
    if (selector === PRIMITIVES) {
      for (const [name, value] of parsed.declarations) {
        if (primitives.has(name)) problems.push(`${where}: ${name} is declared twice`);
        primitives.set(name, value);
      }
    } else {
      const key = { [DARK]: 'dark', [LIGHT]: 'light' }[selector];
      if (themes[key]) problems.push(`${where}: a second "${selector}" block`);
      themes[key] = parsed;
    }
  };

  for (const block of topLevelBlocks(source, TOKENS_FILE, problems)) {
    if (/^@theme\b/.test(block.prelude)) continue; // the Tailwind mapping: browsers and this gate skip it
    if (/^@media\b/.test(block.prelude)) {
      problems.push(
        `"${block.prelude}": every first visit is dark and light comes only from data-theme (05 §1, 0015), so tokens.css has no @media block`,
      );
      continue;
    }
    const selector = normaliseSelector(block.prelude);
    if (![PRIMITIVES, DARK, LIGHT].includes(selector)) {
      problems.push(`unexpected block "${block.prelude}": the tokens shape has :root, the two theme blocks and @theme`);
      continue;
    }
    addFlat(selector, block.body, selector);
  }

  for (const [key, label] of [
    ['dark', DARK],
    ['light', LIGHT],
  ]) {
    if (!themes[key]) problems.push(`missing block: ${label}`);
  }
  if (primitives.size === 0) problems.push('missing block: :root with the brand primitives');
  return { primitives, themes, problems };
}

// Problems between the theme blocks: missing values and color-scheme.
export function themeProblems({ themes }) {
  const problems = [];
  const { dark, light } = themes;
  if (!dark || !light) return problems;
  for (const name of dark.declarations.keys()) {
    if (!light.declarations.has(name)) problems.push(`${name} has a dark value but no light value`);
  }
  for (const name of light.declarations.keys()) {
    if (!dark.declarations.has(name)) problems.push(`${name} has a light value but no dark value`);
  }
  if (dark.colorScheme !== 'dark')
    problems.push(`the dark block needs color-scheme: dark (found "${dark.colorScheme ?? 'none'}")`);
  if (light.colorScheme !== 'light')
    problems.push(`the light block needs color-scheme: light (found "${light.colorScheme ?? 'none'}")`);
  return problems;
}

// ---------------------------------------------------------------------------------------------
// Colour

const HEX = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi;
const RGB = /rgba?\(([^)]*)\)/gi;

function hexToRgba(hex) {
  let h = hex.slice(1);
  if (h.length <= 4) h = [...h].map((c) => c + c).join('');
  const n = (i) => parseInt(h.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
}

function rgbFunctionToRgba(args) {
  const parts = args
    .replace(/\//g, ' ')
    .split(/[\s,]+/)
    .filter(Boolean);
  if (parts.length < 3) return null;
  const channel = (p) => (p.endsWith('%') ? (parseFloat(p) / 100) * 255 : parseFloat(p));
  const alpha = parts[3] === undefined ? 1 : parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
  return { r: channel(parts[0]), g: channel(parts[1]), b: channel(parts[2]), a: alpha };
}

// Every colour in a resolved value, in order: one for a solid colour, each stop for a gradient.
export function coloursIn(value) {
  const found = [];
  for (const m of value.matchAll(HEX)) found.push({ at: m.index, colour: hexToRgba(m[0]) });
  for (const m of value.matchAll(RGB)) {
    const colour = rgbFunctionToRgba(m[1]);
    if (colour) found.push({ at: m.index, colour });
  }
  return found.sort((x, y) => x.at - y.at).map((f) => f.colour);
}

// What may sit around the colours in a checked value: gradient functions, their geometry and the stop
// positions. Every other word is colour syntax coloursIn() can't read, so the pair fails instead of
// being checked without that colour.
const GEOMETRY =
  /^(?:(?:repeating-)?(?:linear|radial|conic)-gradient|to|top|bottom|left|right|center|at|from|circle|ellipse|closest-side|closest-corner|farthest-side|farthest-corner|-?\d*\.?\d+(?:deg|grad|rad|turn|%|px|rem|em)?)$/i;

export function unreadColourSyntax(value) {
  const rest = value.replace(HEX, ' ').replace(RGB, (match, args) => (rgbFunctionToRgba(args) ? ' ' : match));
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

const clamp01 = (n) => Math.min(Math.max(n, 0), 1);

// The frost grain's brightest speck. Its one feColorMatrix must paint a constant colour, and the
// alpha is at most the alpha row's positive noise coefficients plus its offset (every noise channel
// at 1). A matrix this can't bound fails, so a stronger grain can't slip past the glass pairs.
export function grainSpeck(svg) {
  const matrices = [...svg.matchAll(/<feColorMatrix\b([^>]*)>/g)];
  if (matrices.length !== 1) throw new Error(`${GRAIN_FILE}: expected one feColorMatrix, found ${matrices.length}`);
  const attributes = matrices[0][1];
  const type = /\btype="([^"]*)"/.exec(attributes)?.[1] ?? 'matrix';
  const values = /\bvalues="([^"]*)"/
    .exec(attributes)?.[1]
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (type !== 'matrix' || values?.length !== 20 || values.some(Number.isNaN)) {
    throw new Error(`${GRAIN_FILE}: the feColorMatrix must be a 20-value matrix`);
  }
  const [r, g, b] = [0, 5, 10].map((row) => {
    if (values.slice(row, row + 4).some((v) => v !== 0)) {
      throw new Error(`${GRAIN_FILE}: the grain's colour must be constant (row ${row / 5 + 1} reads the noise)`);
    }
    return clamp01(values[row + 4]) * 255;
  });
  const alpha = values.slice(15, 19).reduce((sum, v) => sum + Math.max(v, 0), 0) + values[19];
  return { r, g, b, a: clamp01(alpha) };
}

// ---------------------------------------------------------------------------------------------
// The check

// The value of a token in a theme, with every var() resolved.
export function resolveToken(name, tokens, seen = []) {
  if (seen.includes(name)) throw new Error(`circular var(): ${[...seen, name].join(' → ')}`);
  const value = tokens.get(name);
  if (value === undefined) throw new Error(`${name} isn't defined${seen.length ? ` (used by ${seen.at(-1)})` : ''}`);
  return value.replace(/var\(\s*(--[a-z0-9-]+)\s*(?:,[^)]*)?\)/g, (_, ref) =>
    resolveToken(ref, tokens, [...seen, name]),
  );
}

// A length token in px: rem or px only, so nothing unreadable passes as large.
export function lengthPx(value) {
  const match = /^\s*(\d*\.?\d+)(rem|px)\s*$/.exec(value);
  if (!match) throw new Error(`can't read the length "${value.trim()}"`);
  return Number(match[1]) * (match[2] === 'rem' ? LARGE_TEXT.remPx : 1);
}

export function isLargeText(px, weight) {
  return px >= LARGE_TEXT.px || (px >= LARGE_TEXT.boldPx && weight >= LARGE_TEXT.boldWeight);
}

// A pair's kind: `largeText` names its size and weight tokens, and decides between large and text.
function kindOf(pair, tokens) {
  if (!pair.largeText) return pair.kind;
  const px = lengthPx(resolveToken(pair.largeText.size, tokens));
  const raw = resolveToken(pair.largeText.weight, tokens).trim();
  if (!/^\d+$/.test(raw)) throw new Error(`can't read the weight "${raw}"`);
  return isLargeText(px, Number(raw)) ? 'large' : 'text';
}

// `grain` is the frost grain's brightest speck (grainSpeck), needed by the glass pairs.
export function checkContrast(css, pairs = PAIRS, { grain } = {}) {
  const parsed = parseTokens(css);
  const problems = [...parsed.problems, ...themeProblems(parsed)];
  const results = [];
  if (parsed.problems.length > 0) return { results, problems };

  const tokensFor = (theme) =>
    theme === 'brand' ? parsed.primitives : new Map([...parsed.primitives, ...parsed.themes[theme].declarations]);
  for (const pair of pairs) {
    for (const theme of pair.themes) {
      const tokens = tokensFor(theme);
      const where = `${pair.fg} on ${pair.bg} (${theme})`;
      let fgValue;
      let bgValue;
      let backdropValue;
      let kind;
      try {
        kind = kindOf(pair, tokens);
        fgValue = resolveToken(pair.fg, tokens);
        bgValue = resolveToken(pair.bg, tokens);
        if (pair.backdrop) {
          if (!pair.backdrop[theme]) throw new Error(`no backdrop for the ${theme} theme`);
          backdropValue = resolveToken(pair.backdrop[theme], tokens);
        }
      } catch (error) {
        problems.push(`${where}: ${error.message}`);
        continue;
      }
      const unread = [fgValue, bgValue, backdropValue ?? ''].flatMap(unreadColourSyntax);
      if (unread.length > 0) {
        problems.push(`${where}: can't read "${unread.join('", "')}", so a colour would go unchecked`);
        continue;
      }
      const fgColours = coloursIn(fgValue);
      let bgColours = coloursIn(bgValue);
      if (fgColours.length === 0 || bgColours.length === 0) {
        problems.push(`${where}: no colour found to check`);
        continue;
      }
      if (pair.backdrop) {
        // Glass: the tint over its worst backdrop, then the same with the grain's brightest speck on top.
        const backdrop = coloursIn(backdropValue);
        if (backdrop.length !== 1 || backdrop[0].a < 1) {
          problems.push(`${where}: the backdrop ${pair.backdrop[theme]} must be one opaque colour`);
          continue;
        }
        if (!grain) {
          problems.push(`${where}: a glass pair needs the grain's brightest speck (${GRAIN_FILE})`);
          continue;
        }
        bgColours = bgColours.flatMap((tint) => {
          const flat = composite(tint, backdrop[0]);
          return [flat, composite(grain, flat)];
        });
        // A lit row on the glass (the mega menu's hover): its translucent fill is painted on top.
        if (pair.overlay) {
          const overlay = coloursIn(resolveToken(pair.overlay, tokens));
          if (overlay.length !== 1) {
            problems.push(`${where}: the overlay ${pair.overlay} must be one colour`);
            continue;
          }
          bgColours = bgColours.map((bg) => composite(overlay[0], bg));
        }
      } else if (bgColours.some((c) => c.a < 1)) {
        problems.push(`${where}: the background isn't opaque, so its contrast depends on what's behind it`);
        continue;
      }
      // The worst combination of any foreground stop over any background stop.
      let worst = null;
      for (const fg of fgColours) {
        for (const bg of bgColours) {
          const ratio = contrastRatio(fg, bg);
          if (!worst || ratio < worst.ratio) worst = { ratio, worstFg: toHex(composite(fg, bg)), worstBg: toHex(bg) };
        }
      }
      const threshold = THRESHOLDS[kind];
      results.push({ ...pair, kind, theme, ...worst, threshold, pass: worst.ratio >= threshold });
    }
  }
  return { results, problems };
}

const pairLabel = (r) => `${r.fg} on ${r.bg}`;

function main() {
  const root = process.cwd();
  const css = readFileSync(join(root, TOKENS_FILE), 'utf8');
  let grain;
  const problems = [];
  try {
    grain = grainSpeck(readFileSync(join(root, GRAIN_FILE), 'utf8'));
  } catch (error) {
    problems.push(error.message);
  }
  const checked = checkContrast(css, PAIRS, { grain });
  const { results } = checked;
  problems.push(...checked.problems);
  // A reported pair never fails on its ratio, but a missing or unreadable token still does.
  const reported = checkContrast(css, REPORTED);
  problems.push(...reported.problems.filter((p) => !problems.includes(p)));

  for (const r of results) {
    const note = r.note ? ` (${r.note})` : '';
    console.log(
      `  ${r.pass ? 'ok  ' : 'FAIL'} ${r.theme.padEnd(5)} ${pairLabel(r).padEnd(44)} ${r.ratio.toFixed(2).padStart(5)}:1` +
        ` ≥ ${r.threshold} ${r.kind}, worst ${r.worstFg} on ${r.worstBg}${note}`,
    );
  }
  console.log('Reported, not gated (C38: the pixel is a supplementary accent):');
  for (const r of reported.results) {
    console.log(
      `  ${r.pass ? 'ok  ' : 'low '} ${pairLabel(r).padEnd(50)} ${r.ratio.toFixed(2).padStart(5)}:1` +
        ` (${r.threshold} ${r.kind}), worst ${r.worstFg} on ${r.worstBg}`,
    );
  }
  console.log('Not checked yet:');
  for (const item of NOT_CHECKED) console.log(`  - ${item}`);

  const failures = results.filter((r) => !r.pass);
  if (problems.length > 0 || failures.length > 0) {
    console.error(`check:contrast FAILED (${failures.length} pair(s) below threshold, ${problems.length} problem(s)):`);
    for (const f of failures) {
      console.error(`  ${pairLabel(f)} (${f.theme}): ${f.ratio.toFixed(2)}:1 < ${f.threshold} (${f.kind})`);
    }
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log(`check:contrast passed (${results.length} checks in ${TOKENS_FILE}).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
