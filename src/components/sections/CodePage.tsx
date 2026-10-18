import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ServiceHero, type ServiceSectionProps } from '@/components/sections/service/ServiceSections';
import type { WebsitesExtras } from '@/content/en/services/types';

// "Code ↔ Page" (docs/design/custom-coded-websites.md §02): this page's real opening section beside
// the real source that renders it, read from the repository at build time, never typed by hand
// (10 §3.6). Phase C shows both sides; Phase D adds code-page-compare (13 §4.4), the drag handle.

const SOURCE = 'src/components/sections/service/ServiceSections.tsx';

/** The hero's source as it ships: from `export function ServiceHero` to its closing brace */
function heroSource(): string {
  const text = readFileSync(join(process.cwd(), SOURCE), 'utf8').replace(/\r\n/g, '\n');
  const start = text.indexOf('export function ServiceHero');
  const end = text.indexOf('\n}\n', start);
  if (start < 0 || end < 0) throw new Error(`ServiceHero not found in ${SOURCE}`);
  return text.slice(start, end + 2);
}

export function CodePage({ labels, ...hero }: ServiceSectionProps & { labels: WebsitesExtras['codePage'] }) {
  return (
    <figure data-codepage="">
      <div className="grid gap-card-gap lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface" aria-hidden="true" inert>
          <span className="block px-5 pt-4 font-mono text-label text-ink-tertiary uppercase">{labels.pageLabel}</span>
          <ServiceHero {...hero} preview />
        </div>
        <div className="overflow-hidden rounded-lg bg-inverse text-on-color">
          <span className="block px-5 pt-4 font-mono text-label uppercase">{labels.codeLabel}</span>
          <pre className="overflow-x-auto p-5 font-mono text-small">
            <code>{heroSource()}</code>
          </pre>
        </div>
      </div>
      <figcaption className="mt-4 max-w-measure text-small">
        <span className="font-semibold text-ink">{labels.label}</span>{' '}
        <span className="text-ink-secondary">{labels.caption}</span>
      </figcaption>
    </figure>
  );
}
