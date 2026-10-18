// Home §05–§10 (docs/design/home.md; Figma 50:35): the example workflow, this page is the proof, the
// concepts, how we work, the ROI teaser and the industries. Phase C: the semantic sections, every
// content field in place, base tokens only. Phase D adds the Figma look and workflow-connect,
// exploded-layers, lcp-stamp, industry-rail, industry-flip and roi-count-up.
import { StoryFlow } from '@/components/sections/StoryFlow';
import { industryGroups } from '@/content/emirates-industries';
import { buildItself, howWeWork, illustrativeProof, industries, roiTeaser, workflowExplorer } from '@/content/en/home';

export function WorkflowExplorer() {
  return (
    <section aria-labelledby="flow-heading" className="mx-auto max-w-page px-gutter py-section">
      <h2 id="flow-heading" className="max-w-measure text-h2 text-balance">
        {workflowExplorer.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{workflowExplorer.lede}</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
        {/* The visible step list: real HTML, always in the page */}
        <ol className="grid gap-3">
          {workflowExplorer.steps.map((step, index) => (
            <li key={step} className="flex items-baseline gap-3">
              <span className="font-mono text-caption text-ink-secondary">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-body">{step}</span>
            </li>
          ))}
        </ol>
        <StoryFlow
          label={workflowExplorer.flowLabel}
          nodes={workflowExplorer.nodes}
          description={`An example workflow: ${workflowExplorer.steps.join(' ')}`}
        />
      </div>
    </section>
  );
}

export function BuildItself() {
  return (
    <>
      <section aria-labelledby="build-heading" className="mx-auto max-w-page px-gutter py-section">
        <h2 id="build-heading" className="max-w-measure text-h2 text-balance">
          {buildItself.heading}
        </h2>
        <p className="mt-4 max-w-measure text-lead text-ink-secondary">{buildItself.lede}</p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {buildItself.steps.map((step, index) => (
            <li
              key={step}
              className="flex items-baseline gap-3 rounded-md border border-line bg-surface p-4 text-small"
            >
              <span className="font-mono text-step text-violet">{String(index + 1).padStart(2, '0')}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>
      {/* The illustrative proof examples: labelled concepts, never presented as clients (C18) */}
      <ProofExamples />
    </>
  );
}

function ProofExamples() {
  return (
    <section aria-labelledby="proof-examples-heading" className="mx-auto max-w-page px-gutter py-section">
      <h3 id="proof-examples-heading" className="text-h3 text-balance">
        {illustrativeProof.heading}
      </h3>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {illustrativeProof.cards.map((card, index) => (
          <li key={card.name}>
            <details className="group rounded-lg" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 rounded-lg p-5">
                <span className="block">
                  <span className="block font-mono text-label uppercase text-ink-secondary">{card.industry}</span>
                  <span className="mt-1 block text-h4">{card.name}</span>
                </span>
                <span className="font-mono text-caption text-ink-secondary">
                  <span className="group-open:hidden">{illustrativeProof.show}</span>
                  <span className="hidden group-open:inline">{illustrativeProof.hide}</span>
                </span>
              </summary>
              <div className="px-5 pb-5">
                <p className="font-mono text-label uppercase text-ink-secondary">{illustrativeProof.conceptLabel}</p>
                <p className="mt-2 text-body text-ink">{card.outcome}</p>
                <p className="mt-3 text-small text-ink-secondary">{card.detail}</p>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HowWeWork() {
  return (
    <section aria-labelledby="how-heading" className="mx-auto max-w-page px-gutter py-section">
      <h2 id="how-heading" className="text-h2 text-balance">
        {howWeWork.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{howWeWork.lede}</p>
      <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {howWeWork.steps.map((step, index) => (
          <li key={step.title} className="rounded-lg p-5">
            <span className="font-mono text-step text-violet">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="mt-3 text-h4">{step.title}</h3>
            <p className="mt-1.5 text-small text-ink-secondary">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function RoiTeaser() {
  return (
    <section aria-labelledby="roi-heading" className="mx-auto max-w-page px-gutter py-section">
      <h2 id="roi-heading" className="max-w-measure text-h2 text-balance">
        {roiTeaser.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{roiTeaser.lede}</p>
      <div className="mt-8 rounded-lg p-6">
        <h3 className="font-mono text-label uppercase text-ink-secondary">{roiTeaser.formulaLabel}</h3>
        <p className="mt-2 text-h4 text-balance">{roiTeaser.formula}</p>
      </div>
    </section>
  );
}

export function IndustryTiles() {
  return (
    <section aria-labelledby="industries-heading" className="mx-auto max-w-page px-gutter py-section">
      <h2 id="industries-heading" className="text-h2 text-balance">
        {industries.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{industries.lede}</p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {industryGroups.map((group) => (
          <li key={group.slug} className="rounded-lg border border-line bg-surface p-6">
            <h3 className="text-h4">{group.name}</h3>
          </li>
        ))}
      </ul>
    </section>
  );
}
