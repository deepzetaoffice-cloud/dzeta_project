// The legal pages' sections (/privacy; docs/design/privacy.md; Figma 61:34 desktop, 61:594 mobile): the
// hero on its drape, the glance cards, the policy with its sticky contents, the contact card and the
// related pages. Copy from the page's content file, rendered from its blocks, never shortened.
// src/lib/fx/privacy.ts (the page's scene) adds `drape` to the hero and marks the section being read
// in the contents.
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { Glyph, glyphFor } from '@/components/ui/Glyph';
import { whatsappHref } from '@/components/ui/CtaButton';
import type { LegalBlock, LegalGlanceCard, LegalSection } from '@/content/en/legal/privacy';
import { isLive, routePath, type RouteId } from '@/lib/routes';
import { siteConfig } from '@/lib/site-config';

const EYEBROW = 'font-mono text-label uppercase text-ink-secondary';

// A glance card's glyph on its violet-soft tile, by the content's interface name (05 §6)
function CardGlyph({ name }: { name: LegalGlanceCard['icon'] }) {
  const glyph = glyphFor(name);
  return glyph ? (
    <span className="inline-flex size-10 items-center justify-center rounded-md bg-violet-soft text-violet">
      <Glyph name={glyph} className="size-5" />
    </span>
  ) : null;
}

export type LegalHeroProps = {
  trail: readonly Crumb[];
  heading: string;
  answer: string;
  lastUpdatedLabel: string;
  lastUpdated: { iso: string; display: string };
};

// Block 1, on the drape (Figma "Hero · Drape Background"): soft pleats drawn in CSS, which a canvas
// takes over (drape) while effects are on. The H1 and the direct answer are the LCP, visible at first
// paint (13 §3), no entrance motion; the pleats stay pale behind the text, so it keeps its contrast.
export function LegalHero({ trail, heading, answer, lastUpdatedLabel, lastUpdated }: LegalHeroProps) {
  return (
    <section aria-labelledby="legal-heading" className="px-stage-inset">
      <div
        data-fx-scene="privacy"
        className="dz-drape relative mx-auto max-w-page overflow-hidden rounded-stage bg-surface"
      >
        <span aria-hidden="true" className="dz-drape-pleats" />
        <canvas aria-hidden="true" className="dz-drape-canvas" hidden />
        <span aria-hidden="true" className="dz-drape-veil" />
        <div className="relative mx-auto grid max-w-[51.25rem] justify-items-center gap-5 px-gutter pt-10 pb-12 text-center lg:pt-12 lg:pb-14">
          <Breadcrumbs trail={trail} tone="mono" className="" />
          <h1 id="legal-heading" className="text-hero-line text-balance">
            {heading}
          </h1>
          <p className="text-lead text-ink">{answer}</p>
          <p className="inline-flex min-h-8 items-center gap-2 rounded-full bg-violet-soft px-3 text-caption text-violet">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-violet" />
            {lastUpdatedLabel} · <time dateTime={lastUpdated.iso}>{lastUpdated.display}</time>
          </p>
        </div>
      </div>
    </section>
  );
}

export function LegalGlance({ heading, cards }: { heading: string; cards: readonly LegalGlanceCard[] }) {
  return (
    <section aria-labelledby="legal-glance" className="mx-auto max-w-page px-gutter pt-section">
      <h2 id="legal-glance" className="text-h3 text-ink">
        {heading}
      </h2>
      <ul className="mt-8 grid gap-card-gap sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <li key={card.title} className="grid content-start gap-3 rounded-2xl border border-line bg-surface p-6">
            <CardGlyph name={card.icon} />
            <h3 className="mt-1 text-h4 text-ink">{card.title}</h3>
            <p className="text-small text-ink-secondary">{card.line}</p>
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
    <ol className="mt-3 grid gap-0.5 text-small">
      {sections.map((section) => (
        <li key={section.id}>
          <a href={`#${section.id}`} className="dz-toc-link" data-toc-link={section.id}>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <div className="mx-auto max-w-page px-gutter py-section">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12">
        <nav aria-label={contentsLabel} className="lg:sticky lg:top-32 lg:self-start">
          <details className="rounded-2xl border border-line bg-surface px-5 pb-2 lg:hidden">
            <summary className="flex min-h-14 cursor-pointer items-center font-semibold">{contentsHeading}</summary>
            {contents}
          </details>
          <div className="hidden rounded-2xl border border-line bg-surface p-4 lg:block">
            <p className={`px-3 pt-1 ${EYEBROW}`}>{contentsHeading}</p>
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
                {index + 1} · {section.title}
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

export type LegalRelatedProps = {
  heading: string;
  links: readonly { route: RouteId; title: string; line: string }[];
};

// Block 4: "Questions about your data?" on the stage, then the related pages, each only once it's
// live, its title the link (no "Open": 08 §2.9). While none is live, the contact card takes the row.
export function LegalContact({ contact, related }: { contact: LegalContactProps; related: LegalRelatedProps }) {
  const wa = whatsappHref();
  const live = related.links.filter((link) => isLive(link.route));
  const button = 'dz-press dz-button-on-color min-h-11 px-5 text-button-m';
  return (
    <section aria-labelledby="legal-contact" className="mx-auto max-w-page px-gutter pb-section">
      <div className="grid gap-card-gap md:grid-cols-2 lg:grid-cols-4">
        <div
          className={[
            'grid content-start gap-4 rounded-2xl bg-(image:--dz-grad-stage) p-6 text-on-color lg:p-8',
            live.length === 0 ? 'md:col-span-2 lg:col-span-4' : '',
          ].join(' ')}
        >
          <h2 id="legal-contact" className="text-h3 text-balance text-on-color">
            {contact.heading}
          </h2>
          <p className="max-w-measure text-small">{contact.body}</p>
          <p className="font-semibold">{siteConfig.email}</p>
          <ul className="flex flex-wrap gap-3">
            <li>
              <a href={`mailto:${siteConfig.email}`} className={button}>
                {contact.email}
                <Glyph name="mail" className="size-4.5" />
              </a>
            </li>
            {wa ? (
              <li>
                <a href={wa} className={button}>
                  {contact.whatsapp}
                </a>
              </li>
            ) : null}
            {isLive('R005') ? (
              <li>
                <a href={routePath('R005')} className={button}>
                  {contact.contactPage}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
        {live.length > 0 ? (
          <h2 id="legal-related" className="sr-only">
            {related.heading}
          </h2>
        ) : null}
        {live.map((link) => (
          <article
            key={link.route}
            className="dz-hover-lift relative grid content-start gap-2 rounded-2xl border border-line bg-surface p-6"
          >
            <h3 className="text-h4 text-ink">
              <a href={routePath(link.route)} className="after:absolute after:inset-0">
                {link.title}
              </a>
            </h3>
            <p className="text-small text-ink-secondary">{link.line}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
