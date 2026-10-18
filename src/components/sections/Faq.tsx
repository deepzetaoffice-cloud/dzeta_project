import { SectionHeading } from '@/components/sections/SectionHeading';
import { agentHref, auditHref } from '@/components/ui/CtaButton';
import { Glyph } from '@/components/ui/Glyph';
import type { FaqQuestion } from '@/content/en/faq-bank';
import { shellContent } from '@/content/en/shell';

// The FAQ module "Questions, answered" (docs/design/faq.md; Figma 53:548, FAQ item 35:333). Native
// <details>/<summary>, so every answer is real HTML in the page, matching the FAQPage schema word for
// word (08 §3), and it works without JavaScript. The first question is open on load; the open one is
// white, the rest muted. Each question has a stable id from the bank (#faq-<id>); `dz-faq-item` is the
// hook foundation.spec.ts counts. The lazy enhancement (src/lib/fx/faq.ts, data-fx-lazy "faq" on the
// wrapper) adds faq_expand and the deep links; `accordion` animates the height (globals.css).
// - With `index` and `eyebrow`, the heading takes the C diagram eyebrow (Home's [ 09 ] FAQ).
// - `askAgent` replaces the audit link with "Ask our AI agent" (Home, Figma), which opens the agent
//   (agentHref(): WhatsApp until the website agent ships).
// - `stacked` (the services hub and the service pages, Figma 58:34, 59:34): the heading above and the
//   questions full width under it, with no link of its own; the footer's finale follows straight after.

export type FaqSectionProps = {
  /** The section's H2 and one-sentence intro (the page's copy) */
  heading: string;
  lede: string;
  /** The questions, from the bank, most-asked first */
  questions: readonly FaqQuestion[];
  index?: number;
  eyebrow?: string;
  askAgent?: string;
  layout?: 'split' | 'stacked';
};

export function Faq({ heading, lede, questions, index, eyebrow, askAgent, layout = 'split' }: FaqSectionProps) {
  const stacked = layout === 'stacked';
  return (
    <section
      aria-labelledby="faq-heading"
      className={stacked ? 'grid gap-10' : 'grid gap-10 lg:grid-cols-[minmax(0,28.75rem)_minmax(0,1fr)] lg:gap-14'}
    >
      <div
        className={stacked ? 'grid content-start gap-4' : 'grid content-start gap-4 lg:sticky lg:top-32 lg:self-start'}
      >
        {index !== undefined && eyebrow ? (
          <SectionHeading id="faq-heading" index={index} eyebrow={eyebrow} heading={heading} lede={lede} />
        ) : (
          <>
            <h2 id="faq-heading" className="text-h2 text-ink">
              {heading}
            </h2>
            <p className="text-lead text-ink-secondary">{lede}</p>
          </>
        )}
        {stacked ? null : askAgent ? (
          <a href={agentHref()} className="dz-press dz-button-secondary mt-2 w-fit px-5">
            {askAgent}
            <Glyph name="arrow-up-right" className="size-4.5" />
          </a>
        ) : (
          <a
            className="mt-2 inline-flex min-h-11 w-fit items-center gap-2 font-semibold text-link"
            href={auditHref()}
            data-cta="page"
            data-cta-id="book_audit"
          >
            {shellContent.cta}
            <Glyph name="arrow-up-right" className="size-5" />
          </a>
        )}
      </div>
      <div className="grid content-start gap-3">
        {questions.map((q, i) => (
          <details
            key={q.id}
            id={`faq-${q.id}`}
            name="dz-faq"
            className="dz-faq-item dz-faq group"
            data-faq-item=""
            open={i === 0}
          >
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-5 text-h4 text-ink [&::-webkit-details-marker]:hidden">
              <span>{q.question}</span>
              <Glyph name="plus" className="size-6 shrink-0 group-open:hidden" />
              <Glyph name="minus" className="hidden size-6 shrink-0 text-violet group-open:block" />
            </summary>
            <div className="pb-5">
              <p className="text-ink-secondary">{q.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
