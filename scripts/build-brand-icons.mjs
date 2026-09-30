#!/usr/bin/env node
// Brand icon generator (docs/plans/2026-09-30-p1-brand-primitives.md, section B). Run by hand with
// `npm run brand:icons`; the outputs are committed, and CI doesn't run it.
//
// Every icon is drawn from the locked logo itself, which this script only reads (docs/ai/00 §5).
// Nothing is redrawn: each icon is a crop of the logo on a navy tile, rendered by Playwright's
// Chromium at the file's exact final size, which is sharper than shrinking one large image.
// Needs the Playwright browser: `npx playwright install chromium`.

import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { LOCKED_LOGO_PATH, LOGO_CANVAS, LOGO_CROPS } from '../src/lib/brand.ts';
import { readToken } from '../src/lib/tokens.ts';

// `fill`: the crop's width as a share of the tile's side. `radius`: the tile's corner radius as a
// share of its side (0 is a full-bleed square). Starting values from the plan, section B1.
const FAVICON = { crop: 'mark', fill: 0.88, radius: 0.2 };
const TILE = { crop: 'mark', fill: 0.76, radius: 0.2 };
export const OUTPUTS = [
  { file: 'src/app/favicon.ico', ico: [16, 32, 48], ...FAVICON },
  { file: 'src/app/icon.png', size: 192, ...TILE },
  // iOS rounds the corners itself and fills transparency with black, so this one is full-bleed.
  { file: 'src/app/apple-icon.png', size: 180, crop: 'mark', fill: 0.7, radius: 0 },
  { file: 'public/brand/icon-512.png', size: 512, ...TILE },
  // At 62% the mark's diagonal stays inside the maskable safe zone, the central circle 80% wide.
  { file: 'public/brand/icon-maskable-512.png', size: 512, crop: 'mark', fill: 0.62, radius: 0 },
  // The square logo for the schema #logo (P4): the whole logo on navy, its own page colour.
  { file: 'public/brand/deepzeta-logo-512.png', size: 512, crop: 'full', fill: 1, radius: 0 },
];

// One tile: a navy square with a window the size of the crop, centred, at `fill` of the side. The
// window clips the logo to the crop, so nothing outside it (such as the wordmark) shows. The logo is
// an <img>, so decode() says when it's ready.
function tileHtml({ size, crop, fill, radius }, navy, logoDataUrl) {
  const [cropX, cropY, cropWidth, cropHeight] = LOGO_CROPS[crop];
  const scale = (size * fill) / cropWidth;
  return `<!doctype html><html><head><style>
    html, body { margin: 0; background: transparent; }
    #tile { display: grid; place-items: center; width: ${size}px; height: ${size}px;
      background: ${navy}; border-radius: ${radius * size}px; }
    #crop { position: relative; overflow: hidden; width: ${cropWidth * scale}px; height: ${cropHeight * scale}px; }
    #crop img { position: absolute; inset-inline-start: ${-cropX * scale}px; inset-block-start: ${-cropY * scale}px;
      width: ${LOGO_CANVAS * scale}px; height: ${LOGO_CANVAS * scale}px; }
  </style></head><body><div id="tile"><div id="crop"><img alt="" src="${logoDataUrl}"></div></div></body></html>`;
}

// An ICO whose entries are PNGs, which every current browser reads.
export function packIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);
  let offset = header.length + 16 * entries.length;
  const directory = entries.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 means 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // no palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...directory, ...entries.map(({ png }) => png)]);
}

async function render(page, spec, navy, logoDataUrl) {
  await page.setViewportSize({ width: spec.size, height: spec.size });
  await page.setContent(tileHtml(spec, navy, logoDataUrl));
  await page.locator('#crop img').evaluate((img) => img.decode());
  return page.locator('#tile').screenshot({ omitBackground: true });
}

async function main() {
  const navy = readToken('--dz-navy');
  const logoDataUrl = `data:image/svg+xml;base64,${readFileSync(LOCKED_LOGO_PATH).toString('base64')}`;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ deviceScaleFactor: 1 });
    for (const output of OUTPUTS) {
      let bytes;
      if (output.ico) {
        const entries = [];
        for (const size of output.ico) {
          entries.push({ size, png: await render(page, { ...output, size }, navy, logoDataUrl) });
        }
        bytes = packIco(entries);
      } else {
        bytes = await render(page, output, navy, logoDataUrl);
      }
      mkdirSync(dirname(output.file), { recursive: true });
      writeFileSync(output.file, bytes);
      console.log(`${output.file}: ${bytes.length.toLocaleString('en')} B`);
    }
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
