// "Code ↔ Page" (story-before-after, 13 §4.8; docs/design/service-page.md, the Websites page's
// extras; the plan docs/plans/2026-10-10-flagship-websites-page.md). The page side is this page's
// real hero (ServiceHero in preview mode, inert and hidden from assistive technology); the code side
// is that hero's real source, read from the repository when the page is built, so the two can never
// drift apart. Server-rendered: without JavaScript the two sides sit one above the other, and
// RevealSlider (StoryControls.tsx) turns them into one frame with a native range input.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ReactNode } from 'react';
import { RevealSlider } from '@/components/sections/StoryControls';
import { ServiceHero, type ServiceSectionProps } from '@/components/sections/service/ServiceSections';
import type { WebsitesExtras } from '@/content/en/services/types';

const SOURCE = 'src/components/sections/service/ServiceSections.tsx';

/** The hero's source as it ships: from `export function ServiceHero` to its closing brace */
export function heroSource(): string {
  const text = readFileSync(join(process.cwd(), SOURCE), 'utf8').replace(/\r\n/g, '\n');
  const start = text.indexOf('export function ServiceHero');
  const end = text.indexOf('\n}\n', start);
  if (start < 0 || end < 0) throw new Error(`ServiceHero not found in ${SOURCE}`);
  return text.slice(start, end + 2);
}

// Token colouring at build time (no highlighter library, no client JavaScript): comments, strings,
// JSX tags, keywords and attribute names, each a class the template stylesheet colours with tokens
const TOKEN =
  /(\/\/[^\n]*)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)|(<\/?[A-Za-z][\w.]*|\/?>)|\b(export|function|const|return|null|undefined|true|false)\b|([A-Za-z][\w-]*)(?==)/g;
const KINDS = ['comment', 'string', 'tag', 'keyword', 'attr'] as const;

export function highlight(source: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of source.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(source.slice(last, index));
    const kind = KINDS[match.slice(1).findIndex((group) => group !== undefined)];
    nodes.push(
      <span key={index} className={`dz-tok-${kind}`}>
        {match[0]}
      </span>,
    );
    last = index + match[0].length;
  }
  if (last < source.length) nodes.push(source.slice(last));
  return nodes;
}

export function CodePage({ labels, ...hero }: ServiceSectionProps & { labels: WebsitesExtras['codePage'] }) {
  return (
    <figure className="dz-codepage" data-codepage="">
      <div className="dz-codepage-frame">
        <div className="dz-codepage-page" aria-hidden="true" inert>
          <span className="dz-codepage-tag">{labels.pageLabel}</span>
          <div className="dz-codepage-canvas">
            <ServiceHero {...hero} preview />
          </div>
        </div>
        <div className="dz-codepage-code" data-theme="dark">
          <span className="dz-codepage-tag">{labels.codeLabel}</span>
          <pre>
            <code>{highlight(heroSource())}</code>
          </pre>
        </div>
      </div>
      <RevealSlider label={labels.sliderLabel} />
      <figcaption className="mt-4 max-w-measure text-small">
        <span className="font-bold text-fg-strong">{labels.label}</span>{' '}
        <span className="text-fg-muted">{labels.caption}</span>
      </figcaption>
    </figure>
  );
}
