import type { Pillar } from './registry';

// The logo's four-pixel cluster (Icon Master Rules §4.3; P2 plan, K2): the logo's own four pixels,
// with its colours, gradient directions, corner radii, sizes and positions, scaled as one unit from
// the main pixel's size S. Upright, never outlined, never mirrored, and always the logo's four colours,
// whatever the pillar. Used inside Tier 3 icons (ClusterPixels) and as the nav's current-place marker
// (ClusterLayers, 13 §8). Values were measured from the locked logo, read-only.

type ClusterPixel = {
  part: 'main' | 'upper' | 'lower' | 'bottom';
  /** The logo pixel's colours: its pillar's stop tokens (IconDefs) */
  pillar: Pillar;
  /** Offset of its top-left corner from the main pixel's, and its size, in S */
  dx: number;
  dy: number;
  size: number;
  /** Corner radius, as a share of its own size */
  radius: number;
  /** The logo's gradient vector, in the pixel's own box */
  vector: { x1: number; y1: number; x2: number; y2: number };
};

export const CLUSTER: readonly ClusterPixel[] = [
  // Logo pixel 2, cyan-blue: the main pixel, on the moment of value
  {
    part: 'main',
    pillar: 'web',
    dx: 0,
    dy: 0,
    size: 1,
    radius: 0.132,
    vector: { x1: 0.536, y1: 0.044, x2: 0.457, y2: 0.954 },
  },
  // Logo pixel 3, light cyan
  {
    part: 'upper',
    pillar: 'ai',
    dx: 1.1741,
    dy: -0.7206,
    size: 0.7206,
    radius: 0.107,
    vector: { x1: 0.542, y1: 0.09, x2: 0.47, y2: 0.91 },
  },
  // Logo pixel 4, royal blue
  {
    part: 'lower',
    pillar: 'software',
    dx: 1.5891,
    dy: 0.5911,
    size: 0.5162,
    radius: 0.118,
    vector: { x1: 0.645, y1: 0.065, x2: 0.335, y2: 0.915 },
  },
  // Logo pixel 1, purple
  {
    part: 'bottom',
    pillar: 'ranking',
    dx: 0.7895,
    dy: 1.2186,
    size: 0.7126,
    radius: 0.142,
    vector: { x1: 0.759, y1: 0.045, x2: 0.23, y2: 0.962 },
  },
];

const round = (n: number) => Math.round(n * 1000) / 1000;

// The four pixels' boxes for a main pixel at (x, y) of size S, in the caller's units.
export function clusterBoxes(x: number, y: number, S: number) {
  return CLUSTER.map((pixel) => ({
    part: pixel.part,
    x: round(x + pixel.dx * S),
    y: round(y + pixel.dy * S),
    size: round(pixel.size * S),
    rx: round(pixel.size * S * pixel.radius),
  }));
}

// The glow is a square 3.2 × the main pixel, centred on it (§4.4), in every tier.
export const HALO_SCALE = 3.2;

export type ClusterPixelsProps = {
  x: number;
  y: number;
  size: number;
  /** Tier 3 icons light the main pixel's glow on hover, focus and in the story (§4.4) */
  halo?: boolean;
  /** Classes for each pixel and the glow: the icon's story parts */
  pixelClass?: (index: number) => string;
  haloClass?: string;
};

// The cluster inside an SVG: one group, in the SVG's own units.
export function ClusterPixels({ x, y, size, halo = false, pixelClass, haloClass }: ClusterPixelsProps) {
  const glow = size * HALO_SCALE;
  return (
    <g className="dz-cluster">
      {halo ? (
        <rect
          className={['dz-halo', haloClass].filter(Boolean).join(' ')}
          x={round(x + size / 2 - glow / 2)}
          y={round(y + size / 2 - glow / 2)}
          width={round(glow)}
          height={round(glow)}
          fill="url(#dz-halo-web)"
        />
      ) : null}
      {clusterBoxes(x, y, size).map((box, index) => (
        <rect
          key={box.part}
          className={['dz-cluster-px', pixelClass?.(index)].filter(Boolean).join(' ')}
          x={box.x}
          y={box.y}
          width={box.size}
          height={box.size}
          rx={box.rx}
          fill={`url(#dz-cl-${box.part})`}
        />
      ))}
    </g>
  );
}

// The cluster's own box: 2.1053 S wide and 2.6518 S tall, from the upper pixel's top (§4.3).
const BOX = { x: 0, y: -0.7206, width: 2.1053, height: 2.6518 };
const UNIT = 10;

const VIEW_BOX = [BOX.x, BOX.y, BOX.width, BOX.height].map((n) => round(n * UNIT)).join(' ');

// The cluster as four stacked layers over the same box, one pixel each, sized by CSS. The nav's
// current-place marker moves the layers one by one, so the small pixels settle a beat after the main
// one (hover-pixel-hop, 13 §4.3). Decorative.
export function ClusterLayers({ className }: { className?: string }) {
  return (
    <span className={['dz-cluster-layers', className].filter(Boolean).join(' ')} aria-hidden="true">
      {clusterBoxes(0, 0, UNIT).map((box) => (
        <svg key={box.part} viewBox={VIEW_BOX} focusable="false">
          <rect
            className="dz-cluster-px"
            x={box.x}
            y={box.y}
            width={box.size}
            height={box.size}
            rx={box.rx}
            fill={`url(#dz-cl-${box.part})`}
          />
        </svg>
      ))}
    </span>
  );
}
