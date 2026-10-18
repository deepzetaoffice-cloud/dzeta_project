import type { Pillar } from '@/components/icons/registry';

// A pillar's mark (docs/ai/05 §6), in the pillar's own gradient, upright, never rotated or outlined.
// Decorative: the pillar's name is always beside it.
// - `pixels`: the Figma "Pillar pixels" mark (Directions 3:105–3:120): the logo's four pixels breaking
//   away, each square in the gradient. Set its height; the width follows (4:5). The pixels are the
//   logo's, so the mark never mirrors in RTL (13 §3 rule 11).
// - `square`: one small pixel, the bullet before a pillar's services and footer links. Set its size
//   (a size-* class).

const FILL: Record<Pillar, string> = {
  ai: 'bg-(image:--dz-grad-pillar-ai)',
  web: 'bg-(image:--dz-grad-pillar-websites)',
  software: 'bg-(image:--dz-grad-pillar-software)',
  ranking: 'bg-(image:--dz-grad-pillar-growth)',
};

// The four pixels in the mark's 23.04 × 28.8 frame (Figma), as shares of its width and height; every
// corner is a third of its square.
const PIXELS = [
  'start-[53.125%] top-0 w-[34.375%]',
  'start-0 top-[27.5%] w-1/2',
  'start-3/4 top-[47.5%] w-1/4',
  'start-[34.375%] top-[72.5%] w-[34.375%]',
];

export type PillarMarkProps = { pillar: Pillar; shape?: 'pixels' | 'square'; className?: string };

export function PillarMark({ pillar, shape = 'square', className }: PillarMarkProps) {
  if (shape === 'pixels') {
    return (
      <span
        aria-hidden="true"
        dir="ltr"
        className={['relative inline-block aspect-[4/5] shrink-0', className].filter(Boolean).join(' ')}
      >
        {PIXELS.map((place) => (
          <span key={place} className={`absolute aspect-square rounded-[33%] ${place} ${FILL[pillar]}`} />
        ))}
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={['inline-block shrink-0 rounded-[25%]', FILL[pillar], className].filter(Boolean).join(' ')}
    />
  );
}
