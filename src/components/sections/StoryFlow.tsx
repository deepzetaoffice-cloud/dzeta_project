import { Fragment } from 'react';

// story-flow (13 §4.8), shared since P6 part A2 (S8): extracted from Home §05, its markup and look
// unchanged. Glass nodes, frost connectors, the travelling pixel at rest on the outcome (its final
// state; the draw-in plays once in view). The diagram is an image to assistive tech (role="img",
// described by `description`); the page always carries the visible step list beside it (13 §4.8:
// every story has a visible HTML step list), so nothing is only in the picture. Every flow that
// isn't a real run carries its label ("Example workflow", 10 §3.6).

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
    <div className="dz-story-flow dz-glass" role="img" aria-label={description} data-fx-once="">
      <span className="dz-flow-label font-mono text-caption uppercase tracking-eyebrow text-fg-muted">{label}</span>
      <div className="dz-flow-nodes" aria-hidden="true">
        {nodes.map((node, index) => (
          <Fragment key={node}>
            {index > 0 && <span className="dz-flow-line" />}
            <span
              className={index === nodes.length - 1 ? 'dz-flow-node dz-flow-node--end' : 'dz-flow-node'}
              data-flow-node={index + 1}
            >
              {node}
            </span>
          </Fragment>
        ))}
        <span className="dz-flow-pixel" />
      </div>
    </div>
  );
}
