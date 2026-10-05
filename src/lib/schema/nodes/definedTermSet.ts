// The DefinedTermSet generator (P4 S5): /resources/glossary. Terms mirror the visible glossary
// exactly (08 §3 rule 7). Pure: plain data in, plain object out.
import type { SchemaNode } from '@/lib/schema/types.ts';

export type DefinedTermInput = {
  /** The visible term, byte for byte */
  name: string;
  /** The visible definition, byte for byte */
  description: string;
  /** {page URL}#term-<slug> */
  id?: string;
};

export type DefinedTermSetInput = {
  /** {page URL}#termset */
  id: string;
  name: string;
  terms: readonly DefinedTermInput[];
};

export function definedTermSetNode({ id, name, terms }: DefinedTermSetInput): SchemaNode {
  return {
    '@type': 'DefinedTermSet',
    '@id': id,
    name,
    hasDefinedTerm: terms.map((term) => {
      const node: SchemaNode = { '@type': 'DefinedTerm', name: term.name, description: term.description };
      if (term.id !== undefined) node['@id'] = term.id;
      return node;
    }),
  };
}
