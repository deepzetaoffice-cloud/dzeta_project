import { notFound } from 'next/navigation';
import { auditHref, CtaButton } from '@/components/ui/CtaButton';
import { shellContent } from '@/content/en/shell';
import { shellReviewContent } from '@/content/en/shell-review';
import { env } from '@/lib/env';

// The review page (registry R165; C81): the complete v3 shell with every nav item shown as a
// placeholder, a hero CTA and enough sections to scroll, so the header, the sticky bar, the consent
// banner and the footer can be reviewed, and tracking.spec.ts and consent.spec.ts can run against it.
// Each section fills at least 70% of the window, so the footer's CTA is out of view where the tests
// scroll to 900 px. Built on local, CI and preview builds; production returns 404, never indexed.
export default function ShellReviewPage() {
  if (env().vercelEnv === 'production') notFound();
  const { banner, heading, intro, sections } = shellReviewContent;
  return (
    <>
      <p className="bg-violet-soft px-gutter py-2 text-small text-ink">{banner}</p>
      <div className="mx-auto max-w-page px-gutter py-section">
        <h1 className="text-hero-line">{heading}</h1>
        <p className="mt-4 max-w-measure text-lead text-ink-secondary">{intro}</p>
        <CtaButton variant="primary" href={auditHref()} label={shellContent.cta} className="mt-8" />
      </div>
      {sections.map((section, index) => (
        <section
          key={section.heading}
          aria-labelledby={`review-section-${index}`}
          className={['min-h-[70svh]', index % 2 === 1 ? 'bg-surface-muted' : ''].join(' ')}
        >
          <div className="mx-auto max-w-page px-gutter py-section">
            <h2 id={`review-section-${index}`} className="text-h2">
              {section.heading}
            </h2>
            <p className="mt-4 max-w-measure">{section.body}</p>
          </div>
        </section>
      ))}
    </>
  );
}
