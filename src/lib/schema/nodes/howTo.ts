// The HowTo generator (P4 S5). Steps mirror the visible how-to exactly (08 §3 rule 7, visible
// parity); names are the visible step titles. Pure: plain data in, plain object out.
import type { SchemaNode } from '@/lib/schema/types.ts';

export type HowToStepInput = {
  /** The visible step title, byte for byte */
  name: string;
  /** The step's anchor on the page, e.g. {page URL}#step-1 */
  url?: string;
};

export type HowToInput = {
  /** {page URL}#howto */
  id: string;
  name: string;
  description?: string;
  steps: readonly HowToStepInput[];
};

export function howToNode({ id, name, description, steps }: HowToInput): SchemaNode {
  const node: SchemaNode = { '@type': 'HowTo', '@id': id, name };
  if (description !== undefined) node.description = description;
  node.step = steps.map((step) => {
    const stepNode: SchemaNode = { '@type': 'HowToStep', name: step.name };
    if (step.url !== undefined) stepNode.url = step.url;
    return stepNode;
  });
  return node;
}
