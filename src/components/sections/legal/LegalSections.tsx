// The legal pages' sections (/privacy, R006; /terms reuses them; the privacy page plan and the draft's
// Part 1 layout, docs/content-drafts/legal/privacy-policy.md). Server components only. A legal page
// stays calm: no scroll-reveal; glass-tint on the "At a glance" cards and hover-underline on links
// (the plan's effect register). The contents list is real anchor links that work without JavaScript;
// toc-enhance.ts, loaded on use, marks the section in view. Logical CSS only (legal.css).
import { Icon } from '@/components/icons/Icon';
import { whatsappHref } from '@/components/ui/CtaButton';
import type { LegalBlock, LegalGlanceCard, LegalSection } from '@/content/en/legal/privacy';
import { isLive, routePath, type RouteId } from '@/lib/routes';
import { siteConfig } from '@/lib/site-config';

const EYEBROW = 'font-mono text-caption uppercase tracking-eyebrow text-fg-muted';

export type LegalHeroProps = {
  eyebrow: string;
  heading: string;
  answer: string;
  lastUpdatedLabel: string;
  lastUpdated: { iso: string; display: string };
};

// Block 1: the H1 and the direct answer are the LCP, visible at first paint (13 §3), no entrance motion
export function LegalHero({ eyebrow, heading, answer, lastUpdatedLabel, lastUpdated }: LegalHeroProps) {
  return (
    <section aria-labelledby="legal-heading" className="mx-auto max-w-page px-gutter pt-8 pb-section">
      <p className={EYEBROW}>{eyebrow}</p>
      <h1 id="legal-heading" className="mt-3 text-h1 text-balance">
        {heading}
      </h1>
      <p className="mt-6 max-w-measure text-lead">{answer}</p>
      <p className="mt-4 text-small text-fg-muted">
        {lastUpdatedLabel} <time dateTime={lastUpdated.iso}>{lastUpdated.display}</time>
      </p>
    </section>
  );
}

// Block 2: four glass-tint cards, each with a Tier 1 icon (real HTML text)
export function LegalGlance({ heading, cards }: { heading: string; cards: readonly LegalGlanceCard[] }) {
  return (
    <section aria-labelledby="legal-glance" className="mx-auto max-w-page px-gutter">
      <h2 id="legal-glance" className="sr-only">
        {heading}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <li key={card.title} className="dz-glass dz-legal-card">
            <Icon name={card.icon} size={24} className="text-link" />
            <h3 className="mt-4 text-h4">{card.title}</h3>
            <p className="mt-2 text-small">{card.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Block({ block, tableId }: { block: LegalBlock; tableId: string }) {
  switch (block.kind) {
    case 'p':
      return (
        <p className="mt-4">
          {block.strong ? (
            <strong className="text-fg-strong">{block.text}</strong>
          ) : (
            <>
              {block.lead ? <strong className="text-fg-strong">{block.lead}</strong> : null}
              {block.lead ? ' ' : null}
              {block.text}
            </>
          )}
        </p>
      );
    case 'list':
      return (
        <ul className="dz-legal-list mt-4">
          {block.items.map((item) => (
            <li key={item.lead ?? item.text}>
              {item.lead ? <strong className="text-fg-strong">{item.lead}</strong> : null}
              {item.lead ? ' ' : null}
              {item.text}
            </li>
          ))}
        </ul>
      );
    case 'table':
      // A table scrolls sideways inside its own box on small screens, never the page (Part 1). The box
      // is focusable so a keyboard can scroll it, and named by the table's caption.
      return (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a box that scrolls sideways must take keyboard focus (WCAG 2.1.1; axe scrollable-region-focusable)
        <div className="dz-legal-table mt-6" role="region" aria-labelledby={tableId} tabIndex={0}>
          <table>
            <caption id={tableId}>{block.caption}</caption>
            <thead>
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) =>
                    index === 0 ? (
                      <th key={index} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={index}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'sources':
      return (
        <>
          <p className="mt-4">
            <strong className="text-fg-strong">{block.label}</strong>
          </p>
          <ul className="dz-legal-list mt-2">
            {block.items.map((source) => (
              <li key={source.href}>
                <a href={source.href} className="dz-underline dz-target text-link">
                  {source.label}
                </a>{' '}
                ({source.publisher})
              </li>
            ))}
          </ul>
        </>
      );
  }
}

export type LegalBodyProps = {
  contentsLabel: string;
  contentsHeading: string;
  sections: readonly LegalSection[];
  note: string;
};

// Block 3: the contents and the sections. One <nav> landmark holds the desktop list (sticky) and the
// mobile <details> list; CSS shows one of them. Each section is numbered, as the policy's own
// references ("§9", "Section 7") read.
export function LegalBody({ contentsLabel, contentsHeading, sections, note }: LegalBodyProps) {
  const contents = (
    <ol className="dz-legal-toc-list">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a href={`#${section.id}`} className="dz-target" data-toc-link={section.id}>
            {index + 1}. {section.title}
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <div className="mx-auto max-w-page px-gutter py-section" data-fx-lazy="toc">
      <div className="dz-legal-layout">
        <nav aria-label={contentsLabel} className="dz-legal-toc">
          <details className="dz-legal-toc-mobile">
            <summary className="dz-target">{contentsHeading}</summary>
            {contents}
          </details>
          <div className="dz-legal-toc-desktop">
            <p className={EYEBROW}>{contentsHeading}</p>
            {contents}
          </div>
        </nav>
        <div className="dz-legal-sections">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="dz-legal-section"
              data-legal-section=""
            >
              <h2 id={`${section.id}-heading`} className="text-h3 text-balance">
                {index + 1}. {section.title}
              </h2>
              {section.blocks.map((block, blockIndex) => (
                <Block key={blockIndex} block={block} tableId={`${section.id}-table-${blockIndex}`} />
              ))}
            </section>
          ))}
          <p className="dz-legal-note mt-section text-small text-fg-muted">{note}</p>
        </div>
      </div>
    </div>
  );
}

export type LegalContactProps = {
  heading: string;
  body: string;
  email: string;
  whatsapp: string;
  contactPage: string;
};

// Block 5: the contact block. Email always; WhatsApp while its fact is set; the contact page once it's
// live (04 §1.4). Outline buttons: the page's one gradient CTA stays the audit's (05 §2).
export function LegalContact({ heading, body, email, whatsapp, contactPage }: LegalContactProps) {
  const wa = whatsappHref();
  return (
    <section aria-labelledby="legal-contact" className="mx-auto max-w-page px-gutter py-section">
      <div className="dz-glass dz-legal-contact">
        <h2 id="legal-contact" className="text-h2 text-balance">
          {heading}
        </h2>
        <p className="mt-4 max-w-measure text-lead">{body}</p>
        <ul className="mt-6 flex flex-wrap gap-3">
          <li>
            <a href={`mailto:${siteConfig.email}`} className="dz-legal-button">
              {email}
            </a>
          </li>
          {wa ? (
            <li>
              <a href={wa} className="dz-legal-button">
                {whatsapp}
              </a>
            </li>
          ) : null}
          {isLive('R005') ? (
            <li>
              <a href={routePath('R005')} className="dz-legal-button">
                {contactPage}
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}

export type LegalRelatedProps = {
  heading: string;
  links: readonly { route: RouteId; title: string; line: string }[];
};

// Block 6: related pages, each only once it's live; the block hides itself while none is
export function LegalRelated({ heading, links }: LegalRelatedProps) {
  const live = links.filter((link) => isLive(link.route));
  if (live.length === 0) return null;
  return (
    <section aria-labelledby="legal-related" className="mx-auto max-w-page px-gutter pb-section">
      <h2 id="legal-related" className="text-h3">
        {heading}
      </h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {live.map((link) => (
          <li key={link.route} className="dz-glass dz-legal-card">
            <a href={routePath(link.route)} className="dz-underline dz-target text-h4">
              {link.title}
            </a>
            <p className="mt-2 text-small">{link.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
