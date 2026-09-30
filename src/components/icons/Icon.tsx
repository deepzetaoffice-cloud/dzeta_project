import { isTier1, TIER_1, TIER_2, type Shape, type Tier1Name, type Tier2Name } from './registry';

// One icon from the registry (Icon Master Rules §11; P1 plan, D3): a Server Component with zero
// JavaScript. It needs <IconDefs /> once on the page for the gradients, knockouts and sprite. Icons are
// always decorative: a meaningful icon's label goes on its button (§10). The pillar comes from the
// registry, so an icon can't show in the wrong pillar colour.

// The allowed sizes per tier (§2). A Tier 2 icon is never shown above 64 px.
export type Tier1Size = 16 | 20 | 24;
export type Tier2Size = 20 | 24 | 32 | 48 | 64;

export type IconProps =
  { name: Tier1Name; size: Tier1Size; className?: string } | { name: Tier2Name; size: Tier2Size; className?: string };

// The glow is a square 3.2 × the pixel, centred on it (§4.4).
const HALO_SCALE = 3.2;
// The pixel's corner radius is 12.5% of its size (§4.1).
const PIXEL_RADIUS = 0.125;

function LineShape({ shape }: { shape: Shape }) {
  switch (shape.kind) {
    case 'path':
      return <path className={shape.soft ? 'dz-ln dz-ln--soft' : 'dz-ln'} d={shape.d} />;
    case 'rect':
      return <rect className="dz-ln" x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.rx} />;
    case 'circle':
      return <circle className="dz-ln" cx={shape.cx} cy={shape.cy} r={shape.r} />;
    case 'dot':
      return (
        <circle
          className={shape.blink ? `dz-dot dz-dot--blink-${shape.blink}` : 'dz-dot'}
          cx={shape.cx}
          cy={shape.cy}
          r={shape.r}
        />
      );
  }
}

const iconClass = (tier: 1 | 2, flip: boolean, extra = '') =>
  ['dz-icon', `dz-icon--t${tier}`, flip ? 'dz-icon--flip' : '', extra].filter(Boolean).join(' ');

export function Icon(props: IconProps) {
  const { name, size, className } = props;
  const common = { viewBox: '0 0 24 24', width: size, height: size, 'aria-hidden': true, focusable: false } as const;

  if (isTier1(name)) {
    return (
      <svg {...common} className={iconClass(1, TIER_1[name].flip, className)} data-icon={`dz-1-${name}`}>
        <use href={`#dz-1-${name}`} />
      </svg>
    );
  }

  const icon = TIER_2[name];
  const { x, y, size: pixel } = icon.pixel;
  const halo = pixel * HALO_SCALE;
  const lines = icon.shapes.map((shape, index) => <LineShape key={index} shape={shape} />);
  return (
    <svg
      {...common}
      className={iconClass(2, icon.flip, `dz-icon--${icon.motion} ${className ?? ''}`.trim())}
      data-icon={`dz-2-${icon.pillar}-${name}`}
    >
      {'knockout' in icon ? <g mask={`url(#dz-ko-${name})`}>{lines}</g> : lines}
      <rect
        className="dz-halo"
        x={x + pixel / 2 - halo / 2}
        y={y + pixel / 2 - halo / 2}
        width={halo}
        height={halo}
        fill={`url(#dz-halo-${icon.pillar})`}
      />
      <rect
        className="dz-px"
        x={x}
        y={y}
        width={pixel}
        height={pixel}
        rx={pixel * PIXEL_RADIUS}
        fill={`url(#dz-px-${icon.pillar})`}
      />
    </svg>
  );
}
