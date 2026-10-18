import { Fragment } from 'react';

// A labelled example flow in the diagram language (13 §1, the C diagrams): numbered nodes joined by
// connectors, labelled "Example" (10 §3.6). The visible step list beside it carries the steps as text
// (08 §2.11), so the figure is an image with a one-line description. Phase C: static; Phase D adds
// workflow-connect on Home and the Diagram step states.

export type StoryFlowProps = {
  /** The flow's label, e.g. "Example workflow" (10 §3.6) */
  label: string;
  /** The node names, short (one or two words), in order: the last is the outcome */
  nodes: readonly string[];
  /** The image's text alternative: the whole flow in one sentence or the steps joined */
  description: string;
};

export function StoryFlow({ label, nodes, description }: StoryFlowProps) {
  return (
    <div className="rounded-lg border border-line bg-surface p-6" role="img" aria-label={description}>
      <span className="font-mono text-label text-ink-tertiary uppercase">{label}</span>
      <div className="mt-4 flex flex-wrap items-center gap-2" aria-hidden="true">
        {nodes.map((node, index) => (
          <Fragment key={node}>
            {index > 0 ? <span className="h-px w-6 bg-line-strong" /> : null}
            <span
              className={[
                'inline-flex items-center gap-2 rounded-md border px-3 py-2 text-small',
                index === nodes.length - 1 ? 'border-violet text-violet' : 'border-line text-ink',
              ].join(' ')}
            >
              <span className="font-mono text-step text-ink-tertiary">{String(index + 1).padStart(2, '0')}</span>
              {node}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
