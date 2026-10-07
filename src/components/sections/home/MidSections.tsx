// Home §05–§09 (P5 S5; docs/design/home.md; engine §3.1 orders 5–9). Effects by ID (13 §4):
// §05 shows one example workflow's static story-flow final state + the visible step list (the
// owner's resolved open question 3; the interactive tabs are the P7 demo); §06 is the page's one
// scroll-pinned-scene (≤ 250vh) with a depth-css laptop — every step is real HTML, the final
// stamp shows this visit's real LCP (read lazily by the enhancement, S6); §07 how we work with
// the four Tier 1 step icons and scroll-reveal; §08 the ROI teaser with the formula shown
// (story-data's honesty rule: only the visitor's own inputs, never shown here); §09 the four
// industry-group tiles (hover-window, Tier 1 icons, Icon Master Rules §14.2).
import { Icon } from '@/components/icons/Icon';
import { industryGroups } from '@/content/emirates-industries';
import { buildItself, howWeWork, industries, roiTeaser, workflowExplorer } from '@/content/en/home';

// §05 The workflow explorer teaser: the visible step list (13 §4.8) and one static story-flow
// final state (CSS/SVG only — the Home version never uses GSAP, 07 §4). The flow diagram is the
// steps as glass nodes with frost connectors; the pixel is the customer's request travelling.
export function WorkflowExplorer() {
  return (
    <section aria-labelledby="flow-heading" className="mx-auto max-w-page px-gutter py-section" data-fx-once="">
      <h2 id="flow-heading" className="max-w-measure text-h2 text-balance">
        {workflowExplorer.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{workflowExplorer.lede}</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
        {/* The visible step list: real HTML, always in the page */}
        <ol className="grid gap-3">
          {workflowExplorer.steps.map((step, index) => (
            <li key={step} className="flex items-baseline gap-3">
              <span className="font-mono text-caption text-fg-muted">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-body">{step}</span>
            </li>
          ))}
        </ol>
        {/* The static story-flow: glass nodes, frost connectors, the travelling pixel at rest on
            the outcome (its final state; the draw-in plays once in view) */}
        <div
          className="dz-story-flow dz-glass"
          role="img"
          aria-label={`An example workflow: ${workflowExplorer.steps.join(' ')}`}
          data-fx-once=""
        >
          <span className="dz-flow-label font-mono text-caption uppercase tracking-eyebrow text-fg-muted">
            {workflowExplorer.flowLabel}
          </span>
          <div className="dz-flow-nodes" aria-hidden="true">
            <span className="dz-flow-node" data-flow-node="1">
              Message
            </span>
            <span className="dz-flow-line" />
            <span className="dz-flow-node" data-flow-node="2">
              AI agent
            </span>
            <span className="dz-flow-line" />
            <span className="dz-flow-node" data-flow-node="3">
              Calendar
            </span>
            <span className="dz-flow-line" />
            <span className="dz-flow-node dz-flow-node--end" data-flow-node="4">
              CRM
            </span>
            <span className="dz-flow-pixel" />
          </div>
        </div>
      </div>
    </section>
  );
}

// §06 Proof: "Watch this page build itself" (C19: until real case-study figures exist, facts §5).
// The page's one pinned scene (13 §4.4's rules: at most 1 per page, ≤ 250vh, overflow-clip
// ancestors, no content-visibility, unpins on short viewports/zoom/Reduce effects). Every step is
// reachable HTML in normal flow; the scrub is native scroll-driven CSS inside @supports.
export function BuildItself() {
  return (
    <section aria-labelledby="build-heading" className="dz-pinned-scene border-y border-hairline">
      <div className="dz-pin-stage mx-auto max-w-page px-gutter py-section">
        <h2 id="build-heading" className="max-w-measure text-h2 text-balance">
          {buildItself.heading}
        </h2>
        <p className="mt-4 max-w-measure text-lead">{buildItself.lede}</p>
        {/* The depth-css laptop: a CSS 3D frame; the screen shows the steps as they scrub in.
            The stamp (this visit's real LCP) fills lazily (S6); its label is real HTML here. */}
        <div className="dz-laptop mt-10" aria-hidden="true">
          <div className="dz-laptop-screen">
            <div className="dz-laptop-desktop">
              <span className="dz-lap-layer" data-lap-step="1" />
              <span className="dz-lap-layer" data-lap-step="2" />
              <span className="dz-lap-layer" data-lap-step="3" />
              <span className="dz-lap-layer" data-lap-step="4" />
              <span className="dz-lap-layer" data-lap-step="5" />
            </div>
            <div className="dz-laptop-base" />
          </div>
        </div>
        {/* The steps as a visible list (13 §4.8); the stamp sits after it */}
        <ol className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {buildItself.steps.map((step, index) => (
            <li key={step} className="flex items-baseline gap-3 text-small">
              <span className="font-mono text-caption text-fg-muted">{String(index + 1).padStart(2, '0')}</span>
              {step}
            </li>
          ))}
        </ol>
        <p className="dz-lcp-stamp dz-glass mt-8 inline-flex items-baseline gap-3 px-5 py-4">
          <span className="font-mono text-caption uppercase tracking-eyebrow text-fg-muted">
            {buildItself.stampLabel}
          </span>
          {/* The real value lands here by the lazy enhancement; the honest fallback names itself */}
          <span className="text-h3 font-bold" data-lcp-value>
            not measured in this browser
          </span>
        </p>
      </div>
    </section>
  );
}

// §07 How we work: Audit → Build → Launch → Improve, the four Tier 1 step icons (the owner's
// resolved open question 1). No timeframes — none confirmed (facts). scroll-reveal through the
// shared observer.
export function HowWeWork() {
  const stepIcons = ['audit', 'build', 'launch', 'improve'] as const;
  return (
    <section aria-labelledby="how-heading" className="mx-auto max-w-page px-gutter py-section" data-fx-once="">
      <h2 id="how-heading" className="text-h2 text-balance">
        {howWeWork.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{howWeWork.lede}</p>
      <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {howWeWork.steps.map((step, index) => (
          <li key={step.title} className="dz-glass rounded-2xl p-5">
            <Icon name={stepIcons[index] ?? 'audit'} size={24} />
            <h3 className="mt-3 text-h4">{step.title}</h3>
            <p className="mt-1.5 text-small text-fg-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// §08 The ROI calculator teaser: the formula shown (story-data's honesty rule), no money figures
// — the visitor's own inputs arrive with the P7 calculator. The result panel is glass-live (one
// per viewport here: the only one on the page).
export function RoiTeaser() {
  return (
    <section aria-labelledby="roi-heading" className="mx-auto max-w-page px-gutter py-section" data-fx-once="">
      <h2 id="roi-heading" className="max-w-measure text-h2 text-balance">
        {roiTeaser.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{roiTeaser.lede}</p>
      <div className="dz-glass dz-glass--live dz-roi-panel mt-8 rounded-2xl p-6">
        <h3 className="font-mono text-caption uppercase tracking-eyebrow text-fg-muted">{roiTeaser.formulaLabel}</h3>
        {/* story-data: the formula is the visual; no invented numbers anywhere */}
        <p className="dz-roi-formula mt-2 text-h4 text-balance">{roiTeaser.formula}</p>
      </div>
    </section>
  );
}

// §09 Industries: four calm tiles, one per catalogue industry group (R101–R104), Tier 1 icons
// (§14.2), hover-window. Tiles, not links, until the industry pages ship (P6; 04 §1.4).
export function IndustryTiles() {
  const groupIcons = ['industry-b2b', 'industry-commerce', 'industry-property', 'industry-services'] as const;
  return (
    <section aria-labelledby="industries-heading" className="mx-auto max-w-page px-gutter py-section" data-fx-once="">
      <h2 id="industries-heading" className="text-h2 text-balance">
        {industries.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{industries.lede}</p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {industryGroups.map((group, index) => (
          <li key={group.slug} className="dz-industry-tile dz-glass" data-fx-pointer="">
            <div className="flex items-start gap-4">
              <Icon name={groupIcons[index] ?? 'industry-b2b'} size={24} className="mt-1" />
              <h3 className="text-h4">{group.name}</h3>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
