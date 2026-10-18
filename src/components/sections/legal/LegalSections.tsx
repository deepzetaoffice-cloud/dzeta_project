// The legal pages' sections (/privacy; docs/design/privacy.md; Figma 61:34): the hero, the glance
// cards, the policy with its contents, the contact block and the related pages. Copy from the page's
// content file, rendered from its blocks, never shortened. Phase C: base tokens only; Phase D adds the
// Figma look, the sticky contents and drape.
import { Glyph, glyphFor } from '@/components/ui/Glyph';
import { whatsappHref } from '@/components/ui/CtaButton';
import type { LegalBlock, LegalGlanceCard, LegalSection } from '@/content/en/legal/privacy';
import { isLive, routePath, type RouteId } from '@/lib/routes';
import { siteConfig } from '@/lib/site-config';

const EYEBROW = 'font-mono text-label uppercase text-ink-secondary';

// A glance card's glyph, by the content's interface name (05 §6)
function CardGlyph({ name }: { name: LegalGlanceCard['icon'] }) {
  const glyph = glyphFor(name);
  return glyph ? <Glyph name={glyph} className="text-violet" /> : null;
}

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
      <h1 id="legal-heading" className="mt-3 text-hero-line text-balance">
        {heading}
      </h1>
      <p className="mt-6 max-w-measure text-lead">{answer}</p>
      <p className="mt-4 text-small text-ink-secondary">
        {lastUpdatedLabel} <time dateTime={lastUpdated.iso}>{lastUpdated.display}</time>
      </p>
    </section>
  );
}

export function LegalGlance({ heading, cards }: { heading: string; cards: readonly LegalGlanceCard[] }) {
  return (
    <section aria-labelledby="legal-glance" className="mx-auto max-w-page px-gutter">
      <h2 id="legal-glance" className="sr-only">
        {heading}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <li key={card.title} className="rounded-lg border border-line bg-surface p-6">
            <CardGlyph name={card.icon} />
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
            <strong className="text-ink">{block.text}</strong>
          ) : (
            <>
              {block.lead ? <strong className="text-ink">{block.lead}</strong> : null}
              {block.lead ? ' ' : null}
              {block.text}
            </>
          )}
        </p>
      );
    case 'list':
      return (
        <ul className="mt-4 grid list-disc gap-2 ps-6">
          {block.items.map((item) => (
            <li key={item.lead ?? item.text}>
              {item.lead ? <strong className="text-ink">{item.lead}</strong> : null}
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
        <div
          className="mt-6 overflow-x-auto rounded-md border border-line"
          role="region"
          aria-labelledby={tableId}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a box that scrolls sideways must take keyboard focus (WCAG 2.1.1; axe scrollable-region-focusable)
          tabIndex={0}
        >
          <table className="w-full text-start text-small [&_td]:border-t [&_td]:border-line [&_td]:p-3 [&_th]:p-3 [&_th]:text-start">
            <caption id={tableId} className="p-3 text-start font-semibold">
              {block.caption}
            </caption>
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
            <strong className="text-ink">{block.label}</strong>
          </p>
          <ul className="mt-2 grid list-disc gap-2 ps-6">
            {block.items.map((source) => (
              <li key={source.href}>
                <a href={source.href} className="text-link">
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
    <ol className="mt-3 grid gap-1 text-small">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="inline-flex min-h-11 items-center text-ink-secondary hover:text-ink"
            data-toc-link={section.id}
          >
            {index + 1}. {section.title}
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <div className="mx-auto max-w-page px-gutter py-section" data-fx-lazy="toc">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
        <nav aria-label={contentsLabel} className="lg:sticky lg:top-32 lg:self-start">
          <details className="rounded-lg border border-line bg-surface px-5 lg:hidden">
            <summary className="flex min-h-14 cursor-pointer items-center font-semibold">{contentsHeading}</summary>
            {contents}
          </details>
          <div className="hidden lg:block">
            <p className={EYEBROW}>{contentsHeading}</p>
            {contents}
          </div>
        </nav>
        <div className="grid max-w-measure gap-12">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="scroll-mt-32"
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
          <p className="mt-section text-small text-ink-secondary">{note}</p>
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

export function LegalContact({ heading, body, email, whatsapp, contactPage }: LegalContactProps) {
  const wa = whatsappHref();
  return (
    <section aria-labelledby="legal-contact" className="mx-auto max-w-page px-gutter py-section">
      <div className="rounded-lg border border-line bg-surface p-8">
        <h2 id="legal-contact" className="text-h2 text-balance">
          {heading}
        </h2>
        <p className="mt-4 max-w-measure text-lead">{body}</p>
        <ul className="mt-6 flex flex-wrap gap-3">
          <li>
            <a
              href={`mailto:${siteConfig.email}`}
              className="dz-press inline-flex min-h-11 items-center rounded-full bg-action px-5 text-button-m text-on-color"
            >
              {email}
            </a>
          </li>
          {wa ? (
            <li>
              <a
                href={wa}
                className="dz-press inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-button-m"
              >
                {whatsapp}
              </a>
            </li>
          ) : null}
          {isLive('R005') ? (
            <li>
              <a
                href={routePath('R005')}
                className="dz-press inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-button-m"
              >
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
          <li key={link.route} className="rounded-lg border border-line bg-surface p-6">
            <a href={routePath(link.route)} className="text-h4">
              {link.title}
            </a>
            <p className="mt-2 text-small">{link.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
