import { Fragment } from 'react';
import { CLUSTER, clusterBoxes } from './Cluster';
import { PILLARS, TIER_1, TIER_2, TIER_3 } from './registry';

// The icons' shared definitions, defined once per page (Icon Master Rules §11; docs/ai/02 §3.8): the
// four pillar pixel gradients and their glows, the cluster's four logo gradients, the sweep, one clip
// and one knockout per icon that needs them, and the Tier 1 sprite. SiteDocument mounts it once, the
// first thing in <body>. Stop colours come from tokens through classes (icons.css), so no colour sits
// in the SVG. Hidden with zero size, not display: none, which would stop the gradients painting.

// A knockout cuts every line within this much of a pixel (§4.2 rule 4): 0.75 on the 24 grid; on the 48
// grid at least the same 1.5, and 1.8 so the cut-outs of neighbouring cluster pixels meet (their widest
// gap is 0.5911 S, 3.55 at S = 6) and no stub of line is left between them. Mask luminance, not a
// colour: white keeps lines, black cuts them.
export const CLEARANCE = { tier2: 0.75, tier3: 1.8 };

type Box = { x: number; y: number; size: number };

function Knockout({ id, grid, clearance, boxes }: { id: string; grid: number; clearance: number; boxes: Box[] }) {
  return (
    <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={grid} height={grid}>
      <rect width={grid} height={grid} fill="white" />
      {boxes.map((box, index) => (
        <rect
          key={index}
          x={box.x - clearance}
          y={box.y - clearance}
          width={box.size + 2 * clearance}
          height={box.size + 2 * clearance}
          fill="black"
        />
      ))}
    </mask>
  );
}

export function IconDefs() {
  return (
    <svg className="dz-icon-defs" aria-hidden="true" focusable="false">
      <defs>
        {PILLARS.map((pillar) => (
          <Fragment key={pillar}>
            {/* Light at the top to deep at the bottom (§4.1), on the approved prototype's vector */}
            <linearGradient id={`dz-px-${pillar}`} className={`dz-grad--${pillar}`} x1="0.55" y1="0" x2="0.45" y2="1">
              <stop offset="0" className="dz-stop--top" />
              <stop offset="0.5" className="dz-stop--mid" />
              <stop offset="1" className="dz-stop--bottom" />
            </linearGradient>
            <radialGradient id={`dz-halo-${pillar}`} className={`dz-grad--${pillar}`}>
              <stop offset="0" className="dz-stop--glow" />
              <stop offset="1" className="dz-stop--glow-end" />
            </radialGradient>
          </Fragment>
        ))}
        {/* The cluster's pixels, each on the logo's own gradient vector (§4.3) */}
        {CLUSTER.map(({ part, pillar, vector }) => (
          <linearGradient key={part} id={`dz-cl-${part}`} className={`dz-grad--${pillar}`} {...vector}>
            <stop offset="0" className="dz-stop--top" />
            <stop offset="0.5" className="dz-stop--mid" />
            <stop offset="1" className="dz-stop--bottom" />
          </linearGradient>
        ))}
        {/* The Tier 3 light sweep: white, 0 → 40% → 0, across a band (§5.3) */}
        <linearGradient id="dz-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.35" className="dz-stop--sweep" />
          <stop offset="0.5" className="dz-stop--sweep dz-stop--sweep-peak" />
          <stop offset="0.65" className="dz-stop--sweep" />
        </linearGradient>
        {Object.entries(TIER_2).map(([name, icon]) =>
          'knockout' in icon ? (
            <Knockout key={name} id={`dz-ko-${name}`} grid={24} clearance={CLEARANCE.tier2} boxes={[icon.pixel]} />
          ) : null,
        )}
        {Object.entries(TIER_3).map(([name, icon]) => {
          const { x, y, width, height, rx } = icon.frame;
          const { cluster } = icon;
          return (
            <Fragment key={name}>
              {/* The sweep stays inside the main shape; one clip per icon, so no id repeats (P2 plan, K1) */}
              <clipPath id={`dz-clip-${name}`}>
                <rect x={x} y={y} width={width} height={height} rx={rx} />
              </clipPath>
              {'knockout' in icon ? (
                <Knockout
                  id={`dz-ko-${name}`}
                  grid={48}
                  clearance={CLEARANCE.tier3}
                  boxes={clusterBoxes(cluster.x, cluster.y, cluster.size)}
                />
              ) : null}
            </Fragment>
          );
        })}
      </defs>
      {Object.entries(TIER_1).map(([name, icon]) => (
        <symbol key={name} id={`dz-1-${name}`} viewBox="0 0 24 24">
          <path d={icon.d} />
        </symbol>
      ))}
    </svg>
  );
}
