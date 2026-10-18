// Home §12, the final CTA (docs/design/home.md): the audit offer and the speed-to-lead test's demo
// trigger (the real test is P7). Phase C: base tokens only.
import { DemoStub } from '@/components/demos/DemoStub';
import { auditHref } from '@/components/ui/CtaButton';
import { CtaButton } from '@/components/ui/CtaButton';
import { finalCta } from '@/content/en/home';
import { shellContent } from '@/content/en/shell';

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-heading" className="mx-auto max-w-page px-gutter py-section">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 id="final-cta-heading" className="text-h2 text-balance">
            {finalCta.heading}
          </h2>
          <p className="mt-4 max-w-measure text-lead">{finalCta.lede}</p>
          <div className="mt-8">
            <CtaButton href={auditHref()} label={shellContent.cta} variant="header" />
          </div>
        </div>
        <div className="rounded-lg p-6">
          <h3 className="text-h4">{finalCta.testTitle}</h3>
          <p className="mt-2 text-small text-ink-secondary">{finalCta.testLine}</p>
          <div className="mt-4">
            <DemoStub demoId="speed-to-lead" label={finalCta.testCta} icon="send" />
          </div>
        </div>
      </div>
    </section>
  );
}
