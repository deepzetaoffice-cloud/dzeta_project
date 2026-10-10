import { ClusterPixels, HALO_SCALE } from './Cluster';
import {
  isTier1,
  isTier3,
  TIER_1,
  TIER_2,
  TIER_3,
  type Shape,
  type Tier1Name,
  type Tier2Name,
  type Tier3Name,
  type Tier3Part,
} from './registry';

// One icon from the registry (Icon Master Rules §11; P1 plan, D3): a Server Component with zero
// JavaScript. It needs <IconDefs /> once on the page for the gradients, knockouts, clips and sprite.
// Icons are always decorative: a meaningful icon's label goes on its button (§10). The pillar comes
// from the registry, so an icon can't show in the wrong pillar colour.

// The allowed sizes per tier (§2). A Tier 2 icon is never shown above 64 px; a Tier 3 never below.
export type Tier1Size = 16 | 20 | 24;
export type Tier2Size = 20 | 24 | 32 | 48 | 64;
export type Tier3Size = 64 | 96 | 128 | 160;

export type IconProps =
  | { name: Tier1Name; size: Tier1Size; className?: string }
  | { name: Tier2Name; size: Tier2Size; className?: string }
  | { name: Tier3Name; size: Tier3Size; className?: string };

// The pixel's corner radius is 12.5% of its size (§4.1).
const PIXEL_RADIUS = 0.125;

function LineShape({ shape, className = '' }: { shape: Shape; className?: string }) {
  const classes = (base: string) => [base, className].filter(Boolean).join(' ');
  switch (shape.kind) {
    case 'path':
      return (
        <path
          className={classes(
            ['dz-ln', shape.soft ? 'dz-ln--soft' : '', shape.nudge ? `dz-ln--nudge-${shape.nudge}` : '']
              .filter(Boolean)
              .join(' '),
          )}
          d={shape.d}
        />
      );
    case 'rect':
      return (
        <rect
          className={classes('dz-ln')}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rx={shape.rx}
        />
      );
    case 'circle':
      return <circle className={classes('dz-ln')} cx={shape.cx} cy={shape.cy} r={shape.r} />;
    case 'dot':
      return (
        <circle
          className={classes(shape.blink ? `dz-dot dz-dot--blink-${shape.blink}` : 'dz-dot')}
          cx={shape.cx}
          cy={shape.cy}
          r={shape.r}
        />
      );
  }
}

const iconClass = (tier: 1 | 2 | 3, flip: boolean, extra = '') =>
  ['dz-icon', `dz-icon--t${tier}`, flip ? 'dz-icon--flip' : '', extra].filter(Boolean).join(' ');

// Each story part names its motion and its place in the stagger; icons.css turns them into timing.
const partClass = ({ motion, step, occlude }: Tier3Part) =>
  ['dz-t3-part', `dz-t3-${motion}`, step ? `dz-t3-step-${step}` : '', occlude ? 'dz-t3-occlude' : '']
    .filter(Boolean)
    .join(' ');

// The sweep is a band as wide as the frame, taller than it and turned 20°, clipped to the frame; it
// crosses once, by its own width (icons.css).
const SWEEP_TURN = 20;

type Tier3Props = Extract<IconProps, { name: Tier3Name }>;
const isTier3Props = (props: IconProps): props is Tier3Props => isTier3(props.name);

function Tier3({ name, size, className }: Tier3Props) {
  const icon: (typeof TIER_3)[Tier3Name] = TIER_3[name];
  const { frame, cluster } = icon;
  const box = { x: frame.x, y: frame.y, width: frame.width, height: frame.height, rx: frame.rx };
  const mask = 'knockout' in icon ? `url(#dz-ko-${name})` : undefined;
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden
      focusable={false}
      className={iconClass(3, icon.flip, className)}
      data-icon={`dz-3-${icon.pillar}-${name}`}
      data-fx-once=""
    >
      <rect className="dz-t3-depth dz-t3-part" {...box} fill={`url(#dz-px-${icon.pillar})`} />
      <g mask={mask}>
        <rect className="dz-ln dz-t3-glass dz-t3-part" {...box} />
        {icon.lines.map((shape, index) => (
          <LineShape key={index} shape={shape} />
        ))}
      </g>
      <g clipPath={`url(#dz-clip-${name})`}>
        <g transform={`rotate(${SWEEP_TURN} ${frame.x + frame.width / 2} ${frame.y + frame.height / 2})`}>
          <rect
            className="dz-t3-sweep dz-t3-part"
            x={frame.x}
            y={frame.y - frame.height * 0.3}
            width={frame.width}
            height={frame.height * 1.6}
            fill="url(#dz-sweep)"
          />
        </g>
      </g>
      <g mask={mask}>
        {icon.parts.map((part, index) => (
          <LineShape key={index} shape={part.shape} className={partClass(part)} />
        ))}
      </g>
      <ClusterPixels
        {...cluster}
        halo
        haloClass="dz-t3-part dz-t3-glow"
        pixelClass={(index) => `dz-t3-part dz-t3-assemble${index ? ` dz-t3-step-${index}` : ''}`}
      />
    </svg>
  );
}

export function Icon(props: IconProps) {
  if (isTier3Props(props)) return <Tier3 {...props} />;

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
