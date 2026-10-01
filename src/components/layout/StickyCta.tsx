import { auditHref, CtaButton } from '@/components/ui/CtaButton';
import { shellContent } from '@/content/en/shell';

// The sticky CTA bar (docs/design/conversion-path.md; P2 plan, M), below 1024 px. It carries the
// gradient CTA while no in-page primary CTA is on screen: cta.ts shows it (data-shown) and hides it
// again as the hero's or the finale's CTA comes into view, so a view never shows two (C42). It slides
// in with a transform, stays clear of the home indicator (safe areas, viewportFit 'cover'), and hides
// while the sheet or any modal is open (effects.css). Without JavaScript it never shows.
// The floating WhatsApp button lifts above it once the number is confirmed (the 360 px priority list).
export function StickyCta() {
  return (
    <div data-theme="dark" data-fx-sticky="" className="dz-sticky dz-glass">
      <CtaButton variant="primary" href={auditHref()} label={shellContent.cta} wide />
    </div>
  );
}
