// Home §12, the final CTA (docs/design/home.md; Figma 53:605, mobile 57:1244): the audit offer on a
// violet-soft card beside the speed-to-lead test's demo trigger (the real test is P7). "60 seconds"
// is the facts §6 design target, as the copy says.
import { DemoStub } from '@/components/demos/DemoStub';
import { auditHref, CtaButton } from '@/components/ui/CtaButton';
import { finalCta } from '@/content/en/home';
import { shellContent } from '@/content/en/shell';

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-heading" className="mx-auto max-w-page px-gutter py-section">
      <div className="grid items-center gap-8 rounded-xl bg-violet-soft p-6 md:rounded-stage md:p-12 lg:grid-cols-[minmax(0,1fr)_27.5rem] lg:gap-10">
        <div className="grid content-start gap-5">
          <h2 id="final-cta-heading" className="max-w-[45rem] text-h2 text-ink">
            {finalCta.heading}
          </h2>
          <p className="max-w-[40rem] text-lead text-ink-secondary">{finalCta.lede}</p>
          <CtaButton href={auditHref()} label={shellContent.cta} variant="primary" className="w-full sm:w-fit" />
        </div>
        <div className="grid content-start gap-3.5 rounded-2xl bg-surface p-5 shadow-2 md:p-8">
          <p className="dz-mono-label">{finalCta.testEyebrow}</p>
          <h3 className="text-h3 text-ink">{finalCta.testTitle}</h3>
          <p className="text-ink-secondary">{finalCta.testLine}</p>
          <DemoStub
            demoId="speed-to-lead"
            label={finalCta.testCta}
            icon="external-link"
            tone="inverse"
            className="w-fit"
          />
        </div>
      </div>
    </section>
  );
}
