// The BreadcrumbList generator (P4 S5). Labels mirror the visible breadcrumb exactly (08 §3 rule 7,
// visible parity); positions run from 1 without gaps (spec §4 assertion 9, checked by the gate).
// Pure: plain data in, plain object out.
import type { SchemaNode } from '@/lib/schema/types.ts';

export type BreadcrumbStep = {
  /** The visible label, byte for byte what the breadcrumb link shows */
  name: string;
  /** The step's absolute URL */
  url: string;
};

export type BreadcrumbListInput = {
  /** {page URL}#breadcrumb */
  id: string;
  steps: readonly BreadcrumbStep[];
};

export function breadcrumbListNode({ id, steps }: BreadcrumbListInput): SchemaNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': id,
    itemListElement: steps.map((step, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: step.name,
      item: step.url,
    })),
  };
}
