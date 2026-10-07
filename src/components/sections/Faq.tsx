// The FAQ module (P5, docs/design/faq.md): native <details>/<summary> questions, a sticky intro
// column with topic chips on desktop, and the "Still have a question?" card. Zero JavaScript for
// the base module — the chips, copy-link, hash deep links and faq_expand arrive as a lazy
// enhancement (faq-enhance.ts, loaded on first pointer/focus near the section), so Home's
// first-load JS budget is untouched. The FAQPage schema block reads the same strings byte for
// byte (visible parity, 08 §3 rule 7) — both come from the question bank, never retyped here.
import { Icon } from '@/components/icons/Icon';
import { auditHref } from '@/components/ui/CtaButton';
import { FAQ_TOPIC_LABELS, type FaqQuestion } from '@/content/en/faq-bank';
import { shellContent } from '@/content/en/shell';

export type FaqSectionProps = {
  /** The section's H2 and one-sentence intro (the page's copy) */
  heading: string;
  lede: string;
  /** The questions, from the bank, most-asked first */
  questions: readonly FaqQuestion[];
  /** The pillar colour of the page, for the guide line ('ranking' on Home: the brand's own page) */
  pillar?: 'ai' | 'web' | 'software' | 'ranking';
  /** The "Still have a question?" card's actions; defaults to the audit + the AI agent demo */
  stillHeading?: string;
  stillLine?: string;
};

// The topics this page's questions use, in the bank's order (faq.md: only the topics in use)
function topicsOf(questions: readonly FaqQuestion[]) {
  const seen = new Set<string>();
  const order: string[] = [];
  for (const q of questions) {
    if (seen.has(q.topic)) continue;
    seen.add(q.topic);
    order.push(q.topic);
  }
  return order;
}

export function Faq({ heading, lede, questions, pillar = 'ranking', stillHeading, stillLine }: FaqSectionProps) {
  const topics = topicsOf(questions);
  return (
    <section aria-labelledby="faq-heading" className="dz-faq" data-faq-pillar={pillar}>
      <div className="dz-faq-grid">
        <div className="dz-faq-intro">
          <h2 id="faq-heading" className="text-h2">
            {heading}
          </h2>
          <p className="mt-4 text-lead">{lede}</p>
          {/* The chips are server-rendered and shown whenever scripts run (CSS: scripting), from the
              first paint, so the enhancement arriving on the first pointer or focus moves nothing; with
              no JavaScript they aren't shown (faq.md). They are only ever a filter. */}
          <div className="dz-faq-chips" data-faq-chips>
            {topics.map((topic) => (
              <button key={topic} type="button" className="dz-chip" data-faq-topic={topic} aria-pressed="false">
                {FAQ_TOPIC_LABELS[topic as keyof typeof FAQ_TOPIC_LABELS]}
              </button>
            ))}
          </div>
          {/* The live region the enhancement announces filter counts into. aria-live only (no
              role="status"): a second named status region would collide with the consent panel's
              on pages that show both; polite live is the announcement we need. */}
          <p className="dz-faq-count sr-only" aria-live="polite" data-faq-count></p>
          <div className="dz-glass dz-faq-ask mt-8">
            <h3 className="text-h4">{stillHeading ?? 'Still have a question?'}</h3>
            <p className="mt-2 text-small">{stillLine ?? "Can't find your question? Ask us directly."}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a className="dz-link-quiet" href={auditHref()} data-cta="page" data-cta-id="book_audit">
                  {shellContent.cta}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="dz-faq-list">
          {questions.map((q, index) => (
            <details
              key={q.id}
              id={`faq-${q.id}`}
              className="dz-faq-item"
              data-faq-item=""
              data-faq-topic={q.topic}
              open={index === 0}
            >
              <summary className="dz-faq-q">
                {/* The Zeta Pixel marks the current place: the open question (13 §8) */}
                <span className="dz-faq-px" data-faq-pixel aria-hidden="true" />
                <span className="dz-faq-qtext">{q.question}</span>
                <Icon name="chevron" size={20} className="dz-faq-chev" />
              </summary>
              <div className="dz-faq-a">
                <p>{q.answer}</p>
                {/* The copy-link button is rendered by the enhancement only (lazy); a no-JS visitor
                    still has the question's URL from its id anchor. */}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
