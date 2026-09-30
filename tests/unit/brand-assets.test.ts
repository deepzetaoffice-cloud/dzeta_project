import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GET } from '@/app/brand/deepzeta-logo.svg/route';
import { LOCKED_LOGO_PATH } from '@/lib/brand';

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
