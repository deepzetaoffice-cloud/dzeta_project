import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { CODE_PAGE_ID, FlagshipHero, type FlagshipProps } from '@/components/sections/service/FlagshipSections';

// "Code ↔ Page" (docs/design/custom-coded-websites.md §02; code-page-compare, 13 §4.4): this page's real
// opening section beside the real source that renders it, read from the repository at build time,
// never typed by hand (10 §3.6). One box, two layers: the page underneath, the code over it, clipped
// from the inline start to the handle (--dz-split). The handle is a native range input, so it drags,
// takes ← → in 5% steps and has a name; src/lib/fx/flagship.ts moves the clip with it and plays the
// one hint on first view. Without JavaScript the split rests at the middle.

const SOURCE = 'src/components/sections/service/FlagshipSections.tsx';

/** The hero's source as it ships: from `export function FlagshipHero` to its closing brace */
function heroSource(): string {
  const text = readFileSync(join(process.cwd(), SOURCE), 'utf8').replace(/\r\n/g, '\n');
  const start = text.indexOf('export function FlagshipHero');
  const end = text.indexOf('\n}\n', start);
  if (start < 0 || end < 0) throw new Error(`FlagshipHero not found in ${SOURCE}`);
  return text.slice(start, end + 2);
}

export function CodePage(props: FlagshipProps) {
  const labels = props.extras.codePage;
  return (
    <section aria-labelledby="code-page-heading" id={CODE_PAGE_ID} className="mx-auto max-w-page px-gutter py-section">
      <SectionHeading
        id="code-page-heading"
        index={1}
        eyebrow={labels.label}
        heading={labels.heading}
        lede={labels.caption}
      />
      <figure className="mt-12" data-compare="">
        <div className="dz-compare">
          {/* The page side repeats the hero above, so it's hidden from screen readers and can't take focus */}
          <div className="dz-compare-page" aria-hidden="true" inert>
            <FlagshipHero {...props} preview />
          </div>
          <div className="dz-compare-code" dir="ltr">
            <pre className="font-mono text-small">
              <code>{heroSource()}</code>
            </pre>
          </div>
          <span aria-hidden="true" className="dz-compare-tag dz-compare-tag-page">
            {labels.pageLabel}
          </span>
          <span aria-hidden="true" className="dz-compare-tag dz-compare-tag-code">
            {labels.codeLabel}
          </span>
          <span aria-hidden="true" className="dz-compare-handle">
            <span className="dz-compare-knob" />
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            defaultValue={50}
            aria-label={labels.sliderLabel}
            className="dz-compare-range"
            data-compare-range=""
          />
        </div>
        <figcaption className="mt-4 text-small text-ink-secondary">{labels.hint}</figcaption>
      </figure>
    </section>
  );
}
