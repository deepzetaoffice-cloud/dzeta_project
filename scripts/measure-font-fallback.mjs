#!/usr/bin/env node
// Fallback-font measurements (docs/plans/2026-09-30-p2-layout-shell.md, section D2). Run by hand with
// `npm run fonts:fallback`; it prints the values, and the committed src/styles/font-fallbacks.css and
// --dz-measure in tokens.css are the record. CI doesn't run it.
//
// Montserrat is swapped in over a local fallback (display: swap). If the fallback is narrower, lines
// re-wrap when Montserrat arrives and content moves (decision 0015 §5). For each weight the site uses,
// this measures the same English text in Montserrat and in each fallback font, in Playwright's
// Chromium, and prints the @font-face rules: size-adjust is the width ratio; the ascent and descent
// overrides are Montserrat's own metrics divided by it, next/font's method, so the line boxes match.
//
// Two fallback families, one per platform font: Arial (Windows, macOS) and Roboto (Android, which has
// no Arial). Each has a Regular and a Bold only: the 400 and 500 faces use Regular, the 700 and 800
// faces Bold, each with its own size-adjust. A device without the font skips the face and uses the
// next family in --dz-font-sans, the system font it used before this fix.
//
// Arial comes from this machine. Roboto isn't installed here, so the script reads Google's own file,
// which is never committed (the owner approved the download, 2026-10-01; plan Q4):
//   https://raw.githubusercontent.com/google/fonts/6183fc0d26361f6ddfd6f6b7a736e1467c6d8a43/ofl/roboto/Roboto%5Bwdth%2Cwght%5D.ttf
//   saved as .scratch/Roboto-VF.ttf (488,584 B; Roboto 3.015, OFL), or pass another path.
// Needs the Playwright browser: `npx playwright install chromium`.

import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const MONTSERRAT = 'src/styles/fonts/montserrat-latin-wght.woff2';
const ROBOTO = process.argv[2] ?? '.scratch/Roboto-VF.ttf';
// The git blob hash of the approved Roboto file, so the numbers always come from the same bytes.
const ROBOTO_GIT_BLOB = '5522a368d9072fd88c299916e61fcff369949061';

// The weights the site uses (docs/ai/05 §3): body 400, small 500, headings 700, display and statement 800.
const WEIGHTS = [400, 500, 700, 800];
// The platform font behind each weight: Regular up to 500, Bold above.
const sourceStyle = (weight) => (weight <= 500 ? 'regular' : 'bold');

// Arial and Roboto by their full and PostScript names, as local() matches them.
const FALLBACKS = {
  arial: {
    family: 'dz-sans-fallback-arial',
    local: { regular: ['Arial', 'ArialMT'], bold: ['Arial Bold', 'Arial-BoldMT'] },
    postScript: { regular: 'ArialMT', bold: 'Arial-BoldMT' },
  },
  roboto: {
    family: 'dz-sans-fallback-roboto',
    local: { regular: ['Roboto', 'Roboto-Regular'], bold: ['Roboto Bold', 'Roboto-Bold'] },
  },
};

// The site's own English copy (the North Star, the pillar promises and the CTA), in the mix of
// capitals, lower case and punctuation that headings and body text use.
const SAMPLE =
  'A fast, custom-coded, AI-search-ready site that turns UAE business owners into booked AI audits, ' +
  'and proves every claim it makes. Make the business run itself. Custom-coded, high-performance ' +
  'sites built to rank and convert. Custom tools that scale. Get found, get chosen. Book a free AI audit.';
const SIZE = 100;

function gitBlobHash(bytes) {
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

const robotoBytes = readFileSync(ROBOTO);
if (gitBlobHash(robotoBytes) !== ROBOTO_GIT_BLOB) {
  throw new Error(`${ROBOTO} isn't the approved Roboto file (git blob ${ROBOTO_GIT_BLOB}); see the header.`);
}
const dataUrl = (bytes, type) => `data:${type};base64,${bytes.toString('base64')}`;

// Probe faces carry no weight of their own for the local fonts, so the browser never synthesises bold:
// each probe shows exactly the platform face it names.
const probeCss = `
  @font-face { font-family: 'probe-montserrat'; src: url(${dataUrl(readFileSync(MONTSERRAT), 'font/woff2')}) format('woff2'); font-weight: 100 900; }
  @font-face { font-family: 'probe-roboto'; src: url(${dataUrl(robotoBytes, 'font/ttf')}) format('truetype'); font-weight: 100 900; }
  @font-face { font-family: 'probe-arial-regular'; src: ${FALLBACKS.arial.local.regular.map((n) => `local('${n}')`).join(', ')}; }
  @font-face { font-family: 'probe-arial-bold'; src: ${FALLBACKS.arial.local.bold.map((n) => `local('${n}')`).join(', ')}; }
  span { font-size: ${SIZE}px; white-space: nowrap; font-kerning: normal; }
`;

const probes = [
  ...WEIGHTS.map((weight) => ({ id: `montserrat-${weight}`, family: 'probe-montserrat', weight })),
  { id: 'arial-regular', family: 'probe-arial-regular', weight: 400 },
  { id: 'arial-bold', family: 'probe-arial-bold', weight: 400 },
  { id: 'roboto-regular', family: 'probe-roboto', weight: 400 },
  { id: 'roboto-bold', family: 'probe-roboto', weight: 700 },
];

const browser = await chromium.launch();
const page = await browser.newPage();
const spans = probes
  .map((p) => `<span id="${p.id}" style="font-family:'${p.family}';font-weight:${p.weight}">${SAMPLE}</span>`)
  .join('<br>');
await page.setContent(
  `<!doctype html><html><head><style>${probeCss}</style></head><body>${spans}` +
    `<br><span id="zero" style="font-family:'probe-montserrat';font-weight:400">0000000000</span></body></html>`,
);
await page.evaluate(() => document.fonts.ready);

// Which platform font each probe really rendered with: a missing local font would silently measure
// the browser's default instead.
const cdp = await page.context().newCDPSession(page);
await cdp.send('DOM.enable');
await cdp.send('CSS.enable');
const { root } = await cdp.send('DOM.getDocument');
async function platformFont(id) {
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: `#${id}` });
  const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
  return fonts;
}
for (const style of ['regular', 'bold']) {
  const fonts = await platformFont(`arial-${style}`);
  const expected = FALLBACKS.arial.postScript[style];
  if (fonts.length !== 1 || fonts[0].postScriptName !== expected) {
    throw new Error(`arial-${style} rendered with ${JSON.stringify(fonts)}, not ${expected}`);
  }
}
for (const id of ['montserrat-400', 'roboto-regular']) {
  const fonts = await platformFont(id);
  if (fonts.length !== 1 || !fonts[0].isCustomFont) throw new Error(`${id} rendered with ${JSON.stringify(fonts)}`);
}

const widths = await page.evaluate(
  (ids) => Object.fromEntries(ids.map((id) => [id, document.getElementById(id).getBoundingClientRect().width])),
  [...probes.map((p) => p.id), 'zero'],
);
// Montserrat's ascent and descent as Chromium lays out its lines (fontBoundingBox: the font's own
// line metrics, not the glyphs'), as a share of the font size. Chromium rounds them to whole pixels,
// so they're read at 1000px for three digits.
const metrics = await page.evaluate((size) => {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = `400 ${size}px probe-montserrat`;
  const m = ctx.measureText('Hg');
  return { ascent: m.fontBoundingBoxAscent / size, descent: m.fontBoundingBoxDescent / size };
}, 1000);
const browserVersion = browser.version();
await browser.close();

const pct = (value) => `${(value * 100).toFixed(2)}%`;
console.log(`Chromium ${browserVersion}; sample of ${SAMPLE.length} characters at ${SIZE}px.`);
console.log(`Montserrat ascent ${pct(metrics.ascent)}, descent ${pct(metrics.descent)} of the font size.\n`);

const rows = [];
for (const [key, fallback] of Object.entries(FALLBACKS)) {
  for (const weight of WEIGHTS) {
    const style = sourceStyle(weight);
    const sizeAdjust = widths[`montserrat-${weight}`] / widths[`${key}-${style}`];
    rows.push({ family: fallback.family, weight, local: fallback.local[style], sizeAdjust });
  }
}
console.log('Width ratios (Montserrat / fallback):');
for (const row of rows) console.log(`  ${row.family.padEnd(24)} ${row.weight}  size-adjust ${pct(row.sizeAdjust)}`);

// 65 of Montserrat's "0" at 400 in a 1rem (16px) body: the rem value of 65ch, rounded to 0.25rem.
const zeroEm = widths.zero / 10 / SIZE;
const measureRem = Math.round(65 * zeroEm * 4) / 4;
console.log(`\n"0" advance at 400: ${zeroEm.toFixed(4)}em; 65ch = ${(65 * zeroEm).toFixed(3)}rem`);
console.log(`--dz-measure: ${measureRem}rem;\n`);

console.log('/* The @font-face rules for src/styles/font-fallbacks.css */');
for (const row of rows) {
  console.log(`@font-face {
  font-family: '${row.family}';
  src: ${row.local.map((name) => `local('${name}')`).join(', ')};
  font-weight: ${row.weight};
  size-adjust: ${pct(row.sizeAdjust)};
  ascent-override: ${pct(metrics.ascent / row.sizeAdjust)};
  descent-override: ${pct(metrics.descent / row.sizeAdjust)};
  line-gap-override: 0%;
}`);
}
