import { auditHref } from '@/components/ui/CtaButton';
import { Glyph } from '@/components/ui/Glyph';
import type { FaqQuestion } from '@/content/en/faq-bank';
import { shellContent } from '@/content/en/shell';

// The FAQ module "Questions, answered" (docs/design/faq.md; Figma FAQ item 35:333). Native
// <details>/<summary>, so every answer is real HTML in the page, matching the FAQPage schema word for
// word (08 §3), and it works without JavaScript. The first question is open on load. Each question
// has a stable id from the bank (#faq-<id>); `dz-faq-item` is the hook foundation.spec.ts counts.
// The lazy enhancement (src/lib/fx/faq.ts, data-fx-lazy "faq" on the wrapper) adds faq_expand and
// the deep links. Phase D adds the Figma look and the accordion effect.

export type FaqSectionProps = {
  /** The section's H2 and one-sentence intro (the page's copy) */
  heading: string;
  lede: string;
  /** The questions, from the bank, most-asked first */
  questions: readonly FaqQuestion[];
};

export function Faq({ heading, lede, questions }: FaqSectionProps) {
  return (
    <section aria-labelledby="faq-heading" className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <h2 id="faq-heading" className="text-h2">
          {heading}
        </h2>
        <p className="mt-4 text-lead text-ink-secondary">{lede}</p>
        <a
          className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-link"
          href={auditHref()}
          data-cta="page"
          data-cta-id="book_audit"
        >
          {shellContent.cta}
          <Glyph name="arrow-up-right" className="size-5" />
        </a>
      </div>
      <div className="grid gap-3">
        {questions.map((q, index) => (
          <details
            key={q.id}
            id={`faq-${q.id}`}
            className="dz-faq-item group rounded-lg border border-line bg-surface px-5"
            data-faq-item=""
            open={index === 0}
          >
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-h4 [&::-webkit-details-marker]:hidden">
              <span>{q.question}</span>
              <Glyph name="plus" className="group-open:hidden" />
              <Glyph name="minus" className="hidden group-open:block" />
            </summary>
            <div className="border-t border-line pt-4 pb-5">
              <p className="text-ink-secondary">{q.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
