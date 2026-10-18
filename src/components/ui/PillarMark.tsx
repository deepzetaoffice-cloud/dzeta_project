import type { Pillar } from '@/components/icons/registry';

// A pillar's mark (docs/ai/05 §6): the logo's pixel in the pillar's own gradient, upright, never
// rotated or outlined. Phase D replaces this square with the Figma "Pillar pixels" marks. Decorative:
// the pillar's name is always beside it.

const FILL: Record<Pillar, string> = {
  ai: 'bg-(image:--dz-grad-pillar-ai)',
  web: 'bg-(image:--dz-grad-pillar-websites)',
  software: 'bg-(image:--dz-grad-pillar-software)',
  ranking: 'bg-(image:--dz-grad-pillar-growth)',
};

export type PillarMarkProps = { pillar: Pillar; className?: string };

export function PillarMark({ pillar, className }: PillarMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={['inline-block size-3 shrink-0 rounded-xs', FILL[pillar], className].filter(Boolean).join(' ')}
    />
  );
}
