// The ItemList generator (P4 S5): pillar lists on Home and /services, industry lists, comparison
// tables. Item order is the visible order (08 §3 rule 7). Pure: plain data in, plain object out.
import type { SchemaNode } from '@/lib/schema/types.ts';

export type ItemListItemInput = {
  /** The referenced node's @id (a Service, a WebPage…), or a plain URL */
  id: string;
  /** The visible label, byte for byte */
  name: string;
  /** The item's absolute URL, when the node is not defined in this document */
  url?: string;
};

export type ItemListInput = {
  /** {page URL}#itemlist */
  id: string;
  name?: string;
  items: readonly ItemListItemInput[];
};

export function itemListNode({ id, name, items }: ItemListInput): SchemaNode {
  const node: SchemaNode = { '@type': 'ItemList', '@id': id };
  if (name !== undefined) node.name = name;
  node.itemListElement = items.map((item) => {
    const entry: SchemaNode = { '@type': 'ListItem', name: item.name, url: item.id };
    if (item.url !== undefined) entry.item = { '@id': item.id, url: item.url };
    return entry;
  });
  return node;
}
