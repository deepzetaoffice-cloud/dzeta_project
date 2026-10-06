// The #logo ImageObject generator (P4 S4; spec §2.1): a square PNG exported from the locked logo
// SVG in P1 (public/brand/deepzeta-logo-512.png, 512×512 — the plan's "a square PNG ≥ 112×112").
// Pure: plain data in, plain object out.
import type { SchemaNode } from '@/lib/schema/types.ts';

export type LogoInput = {
  /** {SITE_URL}/#logo */
  id: string;
  /** The image's absolute URL: {SITE_URL}/brand/deepzeta-logo-512.png (built by the assembler) */
  url: string;
};

export function logoNode({ id, url }: LogoInput): SchemaNode {
  return {
    '@type': 'ImageObject',
    '@id': id,
    url,
    width: 512,
    height: 512,
    // No caption: the alt text is not a CONFIRMED fact we render, and an invented caption would
    // break the "nothing invented" rule.
  };
}
