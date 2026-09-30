import { Fragment } from 'react';
import { PILLARS, TIER_1, TIER_2 } from './registry';

// The icons' shared definitions, defined once per page (Icon Master Rules §11; docs/ai/02 §3.8): the
// four pillar pixel gradients and their glows, the knockouts, and the Tier 1 sprite. The root layout
// mounts it once, with the first icons on a page (P2). Stop colours come from tokens through classes
// (icons.css), so no colour sits in the SVG. Hidden with zero size, not display: none, which would stop
// the gradients painting.

// A knockout cuts every line within 0.75 of the pixel (§4.2 rule 4). Mask luminance, not a colour:
// white keeps the lines, black cuts them.
const CLEARANCE = 0.75;

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
        {Object.entries(TIER_2).map(([name, icon]) =>
          'knockout' in icon ? (
            <mask key={name} id={`dz-ko-${name}`} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="white" />
              <rect
                x={icon.pixel.x - CLEARANCE}
                y={icon.pixel.y - CLEARANCE}
                width={icon.pixel.size + 2 * CLEARANCE}
                height={icon.pixel.size + 2 * CLEARANCE}
                fill="black"
              />
            </mask>
          ) : null,
        )}
      </defs>
      {Object.entries(TIER_1).map(([name, icon]) => (
        <symbol key={name} id={`dz-1-${name}`} viewBox="0 0 24 24">
          <path d={icon.d} />
        </symbol>
      ))}
    </svg>
  );
}
