// Home §05–§10 (docs/design/home.md; Figma 51:408, 52:411, 52:477, 52:507, 53:447, 53:508; mobile
// 56:1143–57:1171): the example workflow, this page is the proof, the concepts, how we work, the
// industries and the ROI calculator.
import type { Pillar } from '@/components/icons/registry';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { Glyph } from '@/components/ui/Glyph';
import { Photo } from '@/components/ui/Photo';
import { PillarMark } from '@/components/ui/PillarMark';
import { bundles, pillars, services } from '@/content/catalogue';
import { bestFitAutomations, industries as industryList, industryGroups } from '@/content/emirates-industries';
import {
  buildItself,
  heroAnswer,
  homeContent,
  howWeWork,
  illustrativeProof,
  industries,
  roiTeaser,
  workflowExplorer,
} from '@/content/en/home';
import { buildRun } from '@/content/en/services/build-run';
import { GROUP_PHOTO, photo } from '@/lib/media/photos';
import { livePath } from '@/lib/routes';
import { sitewideGraph } from '@/lib/schema/graphs/sitewide';

const pad = (n: number) => String(n).padStart(2, '0');

const PILLAR_NAME = Object.fromEntries(pillars.map((pillar) => [pillar.pixel, pillar.name])) as Record<Pillar, string>;

const WASH: Record<Pillar, string> = {
  ai: 'bg-wash-ai',
  web: 'bg-wash-websites',
  software: 'bg-wash-software',
  ranking: 'bg-wash-growth',
};

// §05 How an automation works (workflow-connect): the visible ordered list of the five steps (13
// §4.8), the diagram's nodes and connectors, and the scrubber. The server renders the finished
// diagram; src/lib/fx/home/workflow.ts pins it from 1,024 px and draws it node by node (~200 vh), the
// list and the scrubber in step. On phones the list alone tells it. The real n8n recording (SR01)
// joins the scene's end once it's recorded.
export function WorkflowExplorer() {
  const { steps } = workflowExplorer;
  return (
    <section aria-labelledby="flow-heading" className="mx-auto max-w-page px-gutter py-section">
      <SectionHeading
        id="flow-heading"
        index={3}
        eyebrow={workflowExplorer.eyebrow}
        heading={workflowExplorer.heading}
        aside={<p className="max-w-[23.75rem] text-lead text-ink-secondary">{workflowExplorer.lede}</p>}
      />
      <div className="dz-flow mt-12" data-fx-flow="" data-step={steps.length}>
        <figure className="dz-flow-panel">
          <figcaption className="font-mono text-label text-ink uppercase">
            <span aria-hidden="true">{workflowExplorer.figureLabel} 2 — </span>
            {workflowExplorer.figure}
          </figcaption>
          <div className="dz-flow-body">
            <ol className="dz-steps">
              {steps.map((step, index) => (
                <li key={step.label} className="dz-step" data-flow-step={index + 1}>
                  <span aria-hidden="true" className="dz-step-rail" />
                  <span className="grid gap-1.5">
                    <span className="dz-step-label font-mono text-label uppercase">
                      <span className="dz-num" data-num={pad(index + 1)} /> · {step.label}
                    </span>
                    <span className="dz-step-text">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div aria-hidden="true" className="dz-flow-diagram">
              {steps.map((step, index) => (
                <div key={step.label} className={`dz-node dz-node-${index + 1}`} data-flow-node={index + 1}>
                  <p className="flex items-center gap-2">
                    <span className="dz-num dz-node-number" data-num={pad(index + 1)} />
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-caption text-ink ${WASH[step.pillar]}`}
                    >
                      <PillarMark pillar={step.pillar} className="size-2" />
                      {PILLAR_NAME[step.pillar]}
                    </span>
                  </p>
                  <p className="text-h4 text-ink">{step.label}</p>
                  <p className="text-small text-ink-secondary">{step.node}</p>
                </div>
              ))}
              <span className="dz-link dz-link-1" data-flow-link={2} />
              <span className="dz-link dz-link-2" data-flow-link={3} />
              <span className="dz-link dz-link-3" data-flow-link={4} />
              <span className="dz-link dz-link-4" data-flow-link={5} />
            </div>
          </div>
          <div className="dz-flow-scrub">
            <ol className="dz-scrubber dz-scrubber-wide" aria-label={workflowExplorer.scrubLabel}>
              {steps.map((step, index) => (
                <li key={step.label}>
                  <button type="button" className="dz-scrub-step" data-scrub-step={index + 1}>
                    <span aria-hidden="true" className="dz-scrub-dot" />
                    <span>
                      <span className="dz-num" data-num={pad(index + 1)} /> {step.label}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </figure>
      </div>
    </section>
  );
}

// The organization node of this page's own JSON-LD (the sitewide graph the layout mounts), the
// fields the schema layer prints
function organizationExcerpt(): string {
  const node: Record<string, unknown> = sitewideGraph()['@graph'][0] ?? {};
  const keys = ['@type', '@id', 'name', 'legalName', 'url'];
  const picked = Object.fromEntries(keys.filter((key) => key in node).map((key) => [key, node[key]]));
  return JSON.stringify({ '@context': 'https://schema.org', ...picked }, null, 2);
}

// The recorded build's lines the code layer replays (build-run.ts: a real run, its commit and date)
const CODE_LINES = buildRun.lines
  .filter(
    (line) =>
      line.kind === 'command' ||
      (line.kind === 'output' && /^✓/.test(line.text)) ||
      /^check:(schema|seo):/.test(line.text),
  )
  .slice(0, 7);

// §06 This page is the proof (exploded-layers, lcp-stamp): the four layers of this very page, from
// its own data: the Design layer, the recorded build, the page's JSON-LD and its SEO tags. "How AI
// reads this page" swaps the section into the AI view (the layers an engine reads come forward). The
// stamp shows this visit's real LCP (src/lib/fx/home/proof.ts), never a promised score (10 §3.7).
export function BuildItself() {
  const seoLines = [
    { tag: '<title>', text: homeContent.title },
    { tag: '<meta description>', text: homeContent.description },
    { tag: '<h1>', text: heroAnswer.heading },
    {
      tag: '<ol>',
      text: workflowExplorer.steps.map((step, index) => `${pad(index + 1)} ${step.label}`).join(' · '),
    },
  ];
  return (
    <section aria-labelledby="build-heading" className="mx-auto max-w-page px-gutter py-section" data-fx-proof="">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,32.5rem)_minmax(0,1fr)] lg:gap-14">
        <div className="grid gap-7">
          <SectionHeading
            id="build-heading"
            index={4}
            eyebrow={buildItself.eyebrow}
            heading={buildItself.heading}
            lede={buildItself.lede}
          />
          <button type="button" role="switch" aria-checked="false" className="dz-ai-toggle" data-ai-toggle="">
            <span aria-hidden="true" className="dz-switch-track">
              <span className="dz-switch-thumb" />
            </span>
            {buildItself.toggle}
          </button>
          <p className="dz-stamp" data-lcp-stamp="">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-accent-online" />
            <span className="font-mono text-label uppercase">{buildItself.stampLabel}</span>
            <span className="dz-stamp-value" data-lcp-value="">
              —
            </span>
            <span className="text-caption text-ink-secondary" data-lcp-note={buildItself.stampNote}>
              {buildItself.stampPending}
            </span>
          </p>
          <ol className="grid gap-2.5">
            {buildItself.layers.map((layer, index) => (
              <li key={layer.name} className="flex flex-wrap items-baseline gap-x-3">
                <span className="dz-num dz-num-signal font-mono text-step" data-num={pad(index + 1)} />
                <span className="font-semibold text-ink">{layer.name}</span>
                <span className="text-small text-ink-secondary">— {layer.line}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="dz-layers" data-layers="">
          <p className="dz-layers-callout" aria-hidden="true">
            {buildItself.aiView}
          </p>
          <div className="dz-layer dz-layer-seo" data-layer="4">
            <p className="dz-layer-tag">
              <span className="dz-num" data-num={pad(4)} /> · {buildItself.layers[3].name}
            </p>
            <div className="grid gap-2 font-mono text-step">
              {seoLines.map((line, index) => (
                <p
                  key={line.tag}
                  className={index === 0 ? 'text-link' : index === 1 ? 'text-ink-secondary' : 'text-ink'}
                >
                  {line.tag} {line.text}
                </p>
              ))}
            </div>
          </div>
          <div className="dz-layer dz-layer-schema" data-layer="3">
            <p className="dz-layer-tag dz-layer-tag-violet">
              <span className="dz-num" data-num={pad(3)} /> · {buildItself.layers[2].name}
            </p>
            <pre className="overflow-hidden font-mono text-step text-ink">{organizationExcerpt()}</pre>
          </div>
          <div className="dz-layer dz-layer-code" data-layer="2">
            <p className="dz-layer-tag dz-layer-tag-dark">
              <span className="dz-num" data-num={pad(2)} /> · {buildItself.layers[1].name}
            </p>
            <div className="grid gap-1.5 font-mono text-step">
              {CODE_LINES.map((line) => (
                <p key={line.text} className={line.kind === 'command' ? 'text-on-color' : 'text-accent-violet-on-dark'}>
                  {line.kind === 'command' ? `$ ${line.text}` : line.text}
                </p>
              ))}
              <p className="mt-2 text-on-color">
                {buildItself.recorded} {buildRun.commit} · {buildRun.date}
              </p>
            </div>
          </div>
          <div className="dz-layer dz-layer-design" data-layer="1" aria-hidden="true">
            <p className="dz-layer-tag">
              <span className="dz-num" data-num={pad(1)} /> · {buildItself.layers[0].name}
            </p>
            <span className="dz-layer-shape dz-layer-shape-a" />
            <span className="dz-layer-shape dz-layer-shape-b" />
            <span className="dz-layer-shape dz-layer-shape-c" />
          </div>
        </div>
      </div>
    </section>
  );
}

// §07 Illustrative proof: labelled concepts with fictional names, never presented as clients (C18)
export function ProofExamples() {
  return (
    <section aria-labelledby="concepts-heading" className="mx-auto max-w-page px-gutter py-section">
      <SectionHeading
        id="concepts-heading"
        index={5}
        eyebrow={illustrativeProof.eyebrow}
        heading={illustrativeProof.heading}
      />
      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {illustrativeProof.cards.map((card) => (
          <li
            key={card.name}
            className="dz-hover-lift grid content-start gap-3 rounded-xl border border-line bg-surface p-6"
          >
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-soft px-3 py-2 text-caption text-violet">
              <span aria-hidden="true" className="size-2 rounded-full bg-accent-violet" />
              {illustrativeProof.conceptLabel}
            </p>
            <h3 className="text-h3 text-ink">{card.name}</h3>
            <p className="font-mono text-label text-ink-tertiary uppercase">{card.industry}</p>
            <p className="text-small text-ink-secondary">{card.outcome}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// §08 How we work: Audit → Build → Launch → Improve, beside the audit-session photo (P21)
export function HowWeWork() {
  return (
    <section id="how-we-work" aria-labelledby="how-heading" className="mx-auto max-w-page px-gutter py-section">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10">
        <div className="grid content-start gap-8">
          <SectionHeading
            id="how-heading"
            index={6}
            eyebrow={howWeWork.eyebrow}
            heading={howWeWork.heading}
            lede={howWeWork.lede}
          />
          <ol className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {howWeWork.steps.map((step, index) => (
              <li
                key={step.title}
                className="grid content-start gap-3 rounded-xl border border-line bg-surface p-5 md:p-6"
              >
                <span className="dz-num dz-num-signal font-mono text-step" data-num={pad(index + 1)} />
                <h3 className="text-h3 text-ink">{step.title}</h3>
                <p className="text-small text-ink-secondary">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="max-lg:-order-1 lg:self-start">
          <Photo
            asset={photo('P21', { alt: howWeWork.photoAlt })}
            sizes="(min-width: 64rem) 20rem, 100vw"
            className="aspect-[358/261] w-full rounded-lg object-cover lg:aspect-[4/5]"
          />
        </div>
      </div>
    </section>
  );
}

// The catalogue's best-fit automations (§7.5) for one industry group: every row whose industries
// sit in the group, in table order, the first three distinct; a service or a bundle by its number
const groupOf = new Map<string, string>(industryList.map((industry) => [industry.slug, industry.group]));
type Named = { name: string; slug?: string };
const catalogueName = (number: string): Named | undefined =>
  services.find((service) => service.number === number) ?? bundles.find((bundle) => bundle.number === number);

function bestFit(group: string) {
  const numbers: string[] = [];
  for (const row of bestFitAutomations) {
    if (!row.industries.some((slug) => groupOf.get(slug) === group)) continue;
    for (const number of row.automations) if (!numbers.includes(number)) numbers.push(number);
  }
  return numbers
    .slice(0, 3)
    .map((number) => catalogueName(number))
    .filter((entry) => entry !== undefined)
    .map((entry) => ({ name: entry.name, href: entry.slug ? livePath(`/services/${entry.slug}`) : undefined }));
}

// §09 Industries (industry-rail, industry-flip): the four catalogue groups as photo cards on a rail
// that scrolls sideways (pinned on desktop by src/lib/fx/home/rail.ts; swipe on phones), each
// flipping to its ready-made automations. The back face is in the HTML either way; the flip button
// says which face shows (aria-pressed). The group pages (R101–R104) are linked once they ship.
export function IndustryTiles() {
  return (
    <section
      aria-labelledby="industries-heading"
      className="dz-rail-section mx-auto max-w-page px-gutter py-section"
      data-fx-rail=""
    >
      <SectionHeading
        id="industries-heading"
        index={7}
        eyebrow={industries.eyebrow}
        heading={industries.heading}
        lede={industries.lede}
        aside={
          <div className="flex gap-2.5 max-lg:hidden">
            <button
              type="button"
              className="dz-press dz-icon-button dz-icon-lg"
              aria-label={industries.previous}
              data-rail-prev=""
            >
              <Glyph name="arrow-right" className="size-5.5 -scale-x-100 rtl:scale-x-100" />
            </button>
            <button
              type="button"
              className="dz-press dz-icon-button dz-icon-button-primary dz-icon-lg"
              aria-label={industries.next}
              data-rail-next=""
            >
              <Glyph name="arrow-right" className="size-5.5 rtl:-scale-x-100" />
            </button>
          </div>
        }
      />
      <div className="dz-rail-viewport mt-12" data-rail-viewport="">
        <ul className="dz-rail" data-rail="">
          {industryGroups.map((group) => {
            const automations = bestFit(group.number);
            const page = livePath(`/industries/${group.slug}`);
            const backId = `dz-industry-${group.slug}`;
            return (
              <li key={group.slug} className="dz-industry" data-flipped="false">
                <div className="dz-industry-inner">
                  <div className="dz-industry-front">
                    <div className="dz-industry-photo" data-parallax="">
                      <Photo
                        asset={photo(GROUP_PHOTO[group.number] ?? 'P05', {
                          alt: industries.photoAlt[group.number as keyof typeof industries.photoAlt],
                        })}
                        sizes="(min-width: 64rem) 30rem, 80vw"
                        className="size-full object-cover"
                      />
                    </div>
                    <span aria-hidden="true" className="dz-industry-scrim" />
                    <div className="dz-industry-copy">
                      <p className="font-mono text-label uppercase">
                        {industries.groupLabel} {group.number}
                      </p>
                      <h3 className="text-h3">{group.name}</h3>
                    </div>
                  </div>
                  <div className="dz-industry-back" id={backId}>
                    <p className="font-mono text-label text-violet uppercase">
                      {industries.groupLabel} {group.number}
                    </p>
                    <p className="text-h3 text-ink" aria-hidden="true">
                      {group.name}
                    </p>
                    <p className="font-semibold text-ink">{industries.backHeading}</p>
                    <ul className="grid gap-3">
                      {automations.map((automation) => (
                        <li key={automation.name} className="flex items-start gap-2.5 text-small text-ink-secondary">
                          <span
                            aria-hidden="true"
                            className="mt-1.5 size-2 shrink-0 rounded-[0.09375rem] bg-accent-violet"
                          />
                          {automation.href ? (
                            <a href={automation.href} className="text-ink underline-offset-4 hover:underline">
                              {automation.name}
                            </a>
                          ) : (
                            automation.name
                          )}
                        </li>
                      ))}
                    </ul>
                    {page ? (
                      <a
                        href={page}
                        className="dz-press mt-auto inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-action px-5 text-button-m text-on-color"
                      >
                        {industries.seePage}
                        <Glyph name="arrow-up-right" className="size-4.5" />
                      </a>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  className="dz-industry-flip"
                  aria-pressed="false"
                  aria-controls={backId}
                  data-label-front={industries.flip}
                  data-label-back={industries.flipBack}
                >
                  <span className="dz-industry-flip-label">{industries.flip}</span>
                  <span aria-hidden="true">&nbsp;↻</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// The example's result, computed like the calculator: the server renders the example inputs' value
const AED = new Intl.NumberFormat('en-AE', { maximumFractionDigits: 0 });

// §10 The ROI calculator (roi-count-up): two sliders and the weeks in a year, the yearly value and
// its formula always shown. It computes only from the visitor's own numbers (10 §3.6); the starting
// values are labelled example inputs. src/lib/fx/home/roi.ts updates the result as the sliders move.
export function RoiTeaser() {
  const { defaults, ranges } = roiTeaser;
  const result = defaults.hours * defaults.rate * defaults.weeks;
  return (
    <section aria-labelledby="roi-heading" className="mx-auto max-w-page px-gutter py-section">
      <SectionHeading
        id="roi-heading"
        index={8}
        eyebrow={roiTeaser.eyebrow}
        heading={roiTeaser.heading}
        lede={roiTeaser.lede}
      />
      <form
        className="dz-roi mt-12"
        data-fx-roi=""
        data-weeks={defaults.weeks}
        data-currency={roiTeaser.currency}
        data-unit={roiTeaser.hoursUnit}
      >
        <div className="grid content-start gap-9 p-5 md:p-12">
          <p className="font-mono text-label text-ink-tertiary uppercase">{roiTeaser.inputsLabel}</p>
          <div className="grid gap-3.5">
            <p className="flex items-center justify-between gap-4">
              <label htmlFor="dz-roi-hours" className="font-semibold text-ink">
                {roiTeaser.hoursLabel}
              </label>
              <span className="dz-roi-value" data-roi-out="hours">
                {defaults.hours} {roiTeaser.hoursUnit}
              </span>
            </p>
            <input
              id="dz-roi-hours"
              type="range"
              className="dz-range"
              min={ranges.hours.min}
              max={ranges.hours.max}
              step={ranges.hours.step}
              defaultValue={defaults.hours}
              data-roi-in="hours"
            />
          </div>
          <div className="grid gap-3.5">
            <p className="flex items-center justify-between gap-4">
              <label htmlFor="dz-roi-rate" className="font-semibold text-ink">
                {roiTeaser.rateLabel}
              </label>
              <span className="dz-roi-value" data-roi-out="rate">
                {roiTeaser.currency} {defaults.rate}
              </span>
            </p>
            <input
              id="dz-roi-rate"
              type="range"
              className="dz-range"
              min={ranges.rate.min}
              max={ranges.rate.max}
              step={ranges.rate.step}
              defaultValue={defaults.rate}
              data-roi-in="rate"
            />
          </div>
          <p className="flex items-center gap-2.5">
            <span className="font-semibold text-ink">{roiTeaser.weeksLabel}</span>
            <span className="font-mono text-step text-ink-secondary">{defaults.weeks}</span>
          </p>
        </div>
        <div className="dz-roi-result" aria-live="polite">
          <p className="font-mono text-label uppercase">{roiTeaser.resultLabel}</p>
          <p className="dz-roi-total" data-roi-total="">
            {roiTeaser.currency} {AED.format(result)}
          </p>
          <p className="font-mono text-step" data-roi-sum="">
            {defaults.hours} {roiTeaser.hoursUnit} × {roiTeaser.currency} {defaults.rate} × {defaults.weeks}{' '}
            {roiTeaser.weeksUnit}
          </p>
          <p className="text-small">{roiTeaser.formula}</p>
        </div>
      </form>
    </section>
  );
}
