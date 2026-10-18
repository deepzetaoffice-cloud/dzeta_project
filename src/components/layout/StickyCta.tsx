import { auditHref, CtaButton } from '@/components/ui/CtaButton';
import { shellContent } from '@/content/en/shell';

// The sticky CTA bar (docs/design/conversion-path.md; C83), below 1,280 px: a white pill with the
// violet audit button. src/lib/fx/cta.ts shows it (data-shown) while no in-page audit CTA is on screen
// and hides it again as the hero's or the finale's comes into view. It slides with a transform, stays
// clear of the home indicator, and hides while a modal is open or the consent banner asks
// (globals.css). Without JavaScript it never shows.
export function StickyCta() {
  return (
    <div data-fx-sticky="" className="dz-sticky">
      <div className="rounded-full bg-surface p-1.5 shadow-2">
        <CtaButton variant="primary" size="m" href={auditHref()} label={shellContent.cta} wide />
      </div>
    </div>
  );
}
