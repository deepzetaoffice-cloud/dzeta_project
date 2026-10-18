import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { photo, PHOTO_DIR, PHOTOS, type PhotoId } from '@/lib/media/photos';
import { mediaProblems } from '@/lib/seo/media';

// The photo catalogue (src/lib/media/photos.ts) against its files: each entry passes the MediaAsset
// rules (08 §7), and its file is in public/ at the width and height the catalogue gives next/image.

// Width and height from a baseline or progressive JPEG's frame header (SOF0–SOF2)
function jpegSize(bytes: Buffer) {
  expect(bytes.readUInt16BE(0)).toBe(0xffd8);
  let at = 2;
  while (at < bytes.length) {
    const marker = bytes.readUInt16BE(at);
    if (marker >= 0xffc0 && marker <= 0xffc2)
      return { height: bytes.readUInt16BE(at + 5), width: bytes.readUInt16BE(at + 7) };
    at += 2 + bytes.readUInt16BE(at + 2);
  }
  throw new Error('no JPEG frame header');
}

describe('the photo catalogue', () => {
  for (const id of Object.keys(PHOTOS) as PhotoId[]) {
    const entry = PHOTOS[id];

    it(`${id} passes the media rules`, () => {
      expect(entry.id).toBe(id);
      expect(mediaProblems(photo(id, { decorative: true }))).toEqual([]);
    });

    it(`${id}'s file is in public/ at its catalogue size`, () => {
      const bytes = readFileSync(join(process.cwd(), 'public', PHOTO_DIR, `${entry.fileName}.jpg`));
      expect(jpegSize(bytes)).toEqual({ width: entry.width, height: entry.height });
    });
  }
});
