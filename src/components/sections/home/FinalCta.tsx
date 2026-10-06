// Home §11, the final CTA (P5 S6; docs/design/home.md §11). The audit offer beside the 60-second
// speed-to-lead test stub, in a glass-live panel (touch-stamp arrives with the real form, P6).
// The footer's Landing (finaleHeading + finaleLine + the CTA) already follows in the shell, so
// this section's own CTA is the secondary surface; the finale's CTA stays the one gradient CTA in
// view at the page's end (C42).
import { DemoStub } from '@/components/demos/DemoStub';
import { auditHref } from '@/components/ui/CtaButton';
import { CtaButton } from '@/components/ui/CtaButton';
import { finalCta } from '@/content/en/home';
import { shellContent } from '@/content/en/shell';

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-heading" className="mx-auto max-w-page px-gutter py-section" data-fx-once="">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 id="final-cta-heading" className="text-h2 text-balance">
            {finalCta.heading}
          </h2>
          <p className="mt-4 max-w-measure text-lead">{finalCta.lede}</p>
          {/* The shell's footer finale follows immediately with its own primary CTA (the one
              gradient CTA in view, C42), so this section's CTA is the outline secondary */}
          <div className="mt-8">
            <CtaButton href={auditHref()} label={shellContent.cta} variant="header" />
          </div>
        </div>
        {/* The 60-second speed-to-lead test stub (demo 4; the real test is P7) in glass-live */}
        <div className="dz-glass dz-glass--live rounded-2xl p-6">
          <h3 className="text-h4">{finalCta.testTitle}</h3>
          <p className="mt-2 text-small text-fg-muted">{finalCta.testLine}</p>
          <div className="mt-4">
            <DemoStub demoId="speed-to-lead" label={finalCta.testCta} icon="send" className="dz-demo-trigger--quiet" />
          </div>
        </div>
      </div>
    </section>
  );
}
