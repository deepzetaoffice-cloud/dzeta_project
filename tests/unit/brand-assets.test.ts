import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GET } from '@/app/brand/deepzeta-logo.svg/route';
import { Logo } from '@/components/ui/Logo';
import { LOCKED_LOGO_PATH, LOGO_CROPS, LOGO_SHAPES, LOGO_URL, LOGO_VERSION, LOGO_VERSIONED_URL } from '@/lib/brand';
import { siteConfig } from '@/lib/site-config';

// P1 plan, section E. The locked logo is recorded by the SHA-256 of its committed (LF) bytes: 23,026 B,
// git blob 589432ea. Line endings are normalised first, because a Windows working copy can be CRLF
// while CI and Vercel check out LF; the drawing is the same either way.
const LOCKED_LOGO_SHA256 = '6431c29769786e752a3d2dc972b147e551fea5bc060a717c7feaf48647ee78fc';
const lfSha256 = (bytes: Buffer) =>
  createHash('sha256').update(bytes.toString('utf8').replace(/\r\n/g, '\n')).digest('hex');

// Width and height from a PNG's IHDR chunk, and its colour type.
function pngHeader(bytes: Buffer) {
  expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(bytes.subarray(12, 16).toString('ascii')).toBe('IHDR');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), colourType: bytes.readUInt8(25) };
}
// Rounded tiles have transparent corners (RGBA). Full-bleed tiles are opaque (RGB), as iOS needs for
// the apple icon: it fills transparency with black.
const RGBA = 6;
const RGB = 2;

// The generated files (npm run brand:icons), with size caps set from the measured sizes plus headroom,
// so an accidental large file fails. Measured 2026-09-30: 12,718 · 8,860 · 54,899 · 34,988 · 34,311 B.
const PNGS = [
  { file: 'src/app/icon.png', size: 192, colourType: RGBA, maxBytes: 20 * 1024 },
  { file: 'src/app/apple-icon.png', size: 180, colourType: RGB, maxBytes: 16 * 1024 },
  { file: 'public/brand/icon-512.png', size: 512, colourType: RGBA, maxBytes: 80 * 1024 },
  { file: 'public/brand/icon-maskable-512.png', size: 512, colourType: RGB, maxBytes: 56 * 1024 },
  { file: 'public/brand/deepzeta-logo-512.png', size: 512, colourType: RGB, maxBytes: 56 * 1024 },
];

describe('the locked logo', () => {
  it('is unchanged', () => {
    expect(lfSha256(readFileSync(LOCKED_LOGO_PATH))).toBe(LOCKED_LOGO_SHA256);
  });

  // P2 plan, E1: the URL pages request carries the file's own hash, so a new logo gets a new URL and
  // the year-long cache (next.config.ts) can never serve an old one.
  it('is requested at a URL versioned by its own hash', () => {
    expect(LOGO_VERSION).toBe(lfSha256(readFileSync(LOCKED_LOGO_PATH)).slice(0, 8));
    expect(LOGO_VERSIONED_URL).toBe(`${LOGO_URL}?v=${LOGO_VERSION}`);
  });

  it('is served byte for byte at /brand/deepzeta-logo.svg', async () => {
    const response = GET();
    expect(response.headers.get('content-type')).toBe('image/svg+xml');
    const served = Buffer.from(await response.arrayBuffer());
    expect(served.equals(readFileSync(LOCKED_LOGO_PATH))).toBe(true);
    expect(lfSha256(served)).toBe(LOCKED_LOGO_SHA256);
  });
});

describe('the app icons', () => {
  it.each(PNGS)('$file is a $size px PNG under its size cap', ({ file, size, colourType, maxBytes }) => {
    const bytes = readFileSync(file);
    expect(pngHeader(bytes)).toEqual({ width: size, height: size, colourType });
    expect(bytes.length).toBeLessThanOrEqual(maxBytes);
  });

  it('favicon.ico holds 16, 32 and 48 px PNG entries (measured 4,757 B)', () => {
    const ico = readFileSync('src/app/favicon.ico');
    expect(ico.length).toBeLessThanOrEqual(8 * 1024);
    expect([ico.readUInt16LE(0), ico.readUInt16LE(2)]).toEqual([0, 1]); // reserved, type icon
    const count = ico.readUInt16LE(4);
    const sizes = Array.from({ length: count }, (_, i) => {
      const entry = 6 + 16 * i;
      const [width, height] = [ico.readUInt8(entry), ico.readUInt8(entry + 1)];
      const png = ico.subarray(
        ico.readUInt32LE(entry + 12),
        ico.readUInt32LE(entry + 12) + ico.readUInt32LE(entry + 8),
      );
      expect(pngHeader(png)).toEqual({ width, height, colourType: RGBA });
      return width;
    });
    expect(sizes).toEqual([16, 32, 48]);
  });
});

// The header's inline lockup (the owner, 2026-10-01): the mark stands in for the wordmark's D.
describe('the inline lockup', () => {
  const html = renderToStaticMarkup(
    createElement(Logo, { variant: 'inline', label: siteConfig.brandName, className: 'h-8' }),
  );
  // The two crops: the nested <svg>s, which are the ones placed with x
  const nested = [...html.matchAll(/<svg (x="[^>]*)>/g)].map(([, attributes = '']) => {
    const value = (name: string) => new RegExp(`(?:^| )${name}="([^"]*)"`).exec(attributes)?.[1] ?? '';
    return {
      x: Number(value('x')),
      y: Number(value('y')),
      width: Number(value('width')),
      height: Number(value('height')),
      viewBox: value('viewBox').split(' ').map(Number),
    };
  });
  const [mark, tail] = nested;

  it('is two crops of the locked file: the mark, and the wordmark without its D', () => {
    expect(nested.map((crop) => crop.viewBox)).toEqual([[...LOGO_CROPS.mark], [...LOGO_CROPS.tail]]);
    expect(html.match(/<image /g)).toHaveLength(2);
    expect(html.split(`href="${LOGO_VERSIONED_URL}"`)).toHaveLength(3);
    const [dLeft, , dRight] = LOGO_SHAPES.wordmarkD;
    // The tail starts after the D and before the first e.
    expect(LOGO_CROPS.tail[0]).toBeGreaterThan(dRight);
    expect(LOGO_CROPS.tail[0]).toBeLessThan(dRight + LOGO_SHAPES.letterGap);
    expect(dLeft).toBeLessThan(dRight);
  });

  it('sets the ribbon on the baseline where the D began, a tenth taller than the cap, at the D spacing', () => {
    const [cropX, cropY, , cropHeight] = LOGO_CROPS.mark;
    const scale = mark!.height / cropHeight;
    const toX = (x: number) => mark!.x + (x - cropX) * scale;
    const toY = (y: number) => mark!.y + (y - cropY) * scale;
    const [ribbonLeft, ribbonTop, ribbonRight, ribbonBottom] = LOGO_SHAPES.ribbon;
    const [dLeft, capTop, dRight, baseline] = LOGO_SHAPES.wordmarkD;
    // The tail is drawn at the wordmark's own scale, so the outer units are the wordmark's.
    expect(tail!.width).toBe(LOGO_CROPS.tail[2]);
    expect(tail!.y).toBe(LOGO_CROPS.tail[1]);
    expect(toY(ribbonBottom)).toBeCloseTo(baseline, 1);
    expect(toX(ribbonLeft)).toBeCloseTo(dLeft, 1);
    expect(toY(ribbonBottom) - toY(ribbonTop)).toBeCloseTo((baseline - capTop) * 1.1, 1);
    // The first e (344 in the logo) follows the ribbon by the D's own gap.
    const firstE = tail!.x + (dRight + LOGO_SHAPES.letterGap - LOGO_CROPS.tail[0]);
    expect(firstE - toX(ribbonRight)).toBeCloseTo(LOGO_SHAPES.letterGap, 1);
  });
});
