import { LOGO_CANVAS, LOGO_CROPS, LOGO_SHAPES, LOGO_VERSIONED_URL } from '@/lib/brand';

// The locked logo, shown through its own bytes (docs/ai/00 §5; P1 plan, section A). The file is never
// edited or recreated: each variant is a viewBox crop of it, the Design Lab's method. The logo
// renders as its own document, so its gradient IDs can't collide with the page's, and every use
// shares one cached request.
//
// Navy only: the white "Deep" needs navy (docs/ai/05 §2). In forced-colours mode the logo keeps its
// navy backing, so "Deep" doesn't vanish on a white system background. It never flips in RTL (11 §1).

function LogoCrop({ crop, className }: { crop: 'mark' | 'wordmark'; className: string }) {
  const [x, y, width, height] = LOGO_CROPS[crop];
  // width and height give the ratio before the file loads, so nothing shifts; CSS sets the size.
  return (
    <svg
      viewBox={`${x} ${y} ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <image href={LOGO_VERSIONED_URL} width={LOGO_CANVAS} height={LOGO_CANVAS} />
    </svg>
  );
}

// The header's inline lockup (the owner, 2026-10-01): the mark stands in for the wordmark's D. Two crops
// of the same file, set in the wordmark's units: the ribbon (the mark's D shape) is the D's cap height
// and a tenth more, sits on the wordmark's baseline where the D began, and "eepzeta" follows at the D's
// own spacing. The pixels then float just above the first e, as they break away in the logo.
const RIBBON_TO_CAP = 1.1;
const round = (n: number) => Math.round(n * 100) / 100;

function inlineLayout() {
  const [dLeft, capTop, dRight, baseline] = LOGO_SHAPES.wordmarkD;
  const [ribbonLeft, ribbonTop, ribbonRight, ribbonBottom] = LOGO_SHAPES.ribbon;
  const scale = ((baseline - capTop) * RIBBON_TO_CAP) / (ribbonBottom - ribbonTop);
  const [markX, markY, markWidth, markHeight] = LOGO_CROPS.mark;
  const mark = {
    x: dLeft - (ribbonLeft - markX) * scale,
    y: baseline - (ribbonBottom - markY) * scale,
    width: markWidth * scale,
    height: markHeight * scale,
  };
  // The first e moves from where it was (after the D) to the same distance after the ribbon.
  const [tailX, tailY, tailWidth, tailHeight] = LOGO_CROPS.tail;
  const shift = dLeft + (ribbonRight - ribbonLeft) * scale - dRight;
  const tail = { x: tailX + shift, y: tailY, width: tailWidth, height: tailHeight };
  const top = Math.min(mark.y, tail.y);
  const box = [mark.x, top, tail.x + tail.width - mark.x, Math.max(mark.y + mark.height, tailY + tailHeight) - top];
  const rounded = (rect: typeof mark) => Object.fromEntries(Object.entries(rect).map(([k, v]) => [k, round(v)]));
  return { box: box.map(round), mark: rounded(mark), tail: rounded(tail) };
}

const INLINE = inlineLayout();

function InlineLockup() {
  const [, , width, height] = INLINE.box;
  return (
    <svg
      viewBox={INLINE.box.join(' ')}
      width={width}
      height={height}
      className="h-full w-auto"
      aria-hidden="true"
      focusable="false"
    >
      {(['mark', 'tail'] as const).map((crop) => (
        <svg key={crop} {...INLINE[crop]} viewBox={LOGO_CROPS[crop].join(' ')}>
          <image href={LOGO_VERSIONED_URL} width={LOGO_CANVAS} height={LOGO_CANVAS} />
        </svg>
      ))}
    </svg>
  );
}

// Every use chooses: an accessible name (from the site config, e.g. siteConfig.brandName), or
// decorative (next to a visible name, or inside a link that has its own name).
type LogoName = { label: string; decorative?: never } | { decorative: true; label?: never };

export type LogoProps = LogoName & {
  /** `lockup`: the mark and the wordmark in a row. `inline`: the mark as the wordmark's D (the header).
      `mark`: the Z and the pixels (hero). */
  variant: 'lockup' | 'inline' | 'mark' | 'wordmark';
  /** Must set the height (a Tailwind height class): the crops fill it, and the width follows the logo's
      ratio. Without one they'd render at the crop's own size, 552 × 432. */
  className: string;
};

export function Logo({ variant, className, label }: LogoProps) {
  // Only `decorative` hides it: an empty label is an unnamed image, which the axe checks catch.
  const name = label !== undefined ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    // dir="ltr": a flex row follows the page direction, so in Arabic the mark and the wordmark would
    // swap sides. The logo never mirrors (11 §1).
    <span
      dir="ltr"
      className={`inline-flex items-center gap-0.5 forced-colors:bg-navy forced-colors:forced-color-adjust-none ${className}`}
      {...name}
    >
      {variant === 'inline' && <InlineLockup />}
      {/* The Lab's lockup proportions: the wordmark is 21/36 of the mark's height, 2 px apart. */}
      {(variant === 'lockup' || variant === 'mark') && <LogoCrop crop="mark" className="h-full w-auto" />}
      {variant === 'lockup' && <LogoCrop crop="wordmark" className="h-7/12 w-auto" />}
      {variant === 'wordmark' && <LogoCrop crop="wordmark" className="h-full w-auto" />}
    </span>
  );
}
