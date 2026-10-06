// The graph guards (P4 S6; spec §5 step 6): dedupeById() and assertResolvable(), the two throwing
// guards every assembler runs before returning. They encode the spec's stop conditions — any
// duplicate @id or dangling reference stops the build, never ships.

import type { SchemaGraph, SchemaNode } from '@/lib/schema/types.ts';

// A node DEFINES its @id when it also carries an @type — every generator's definition nodes do
// (organization, website, logo, service, the Offer inside a service, Question/Answer, ListItem…).
// A node merely REFERENCES an @id when @id is all it carries besides display hints (name, url) —
// every generator's references are shaped that way ({ '@id': … }, or { '@id': …, name: … }).
// This is the generators' own convention (spec §3 layer rules), pinned by tests/unit/schema/*.

// Collects every @id that is defined anywhere in the graph's nodes (top level and nested).
function collectIds(node: unknown, into: string[]): void {
  if (Array.isArray(node)) {
    for (const item of node) collectIds(item, into);
    return;
  }
  if (node && typeof node === 'object') {
    const record = node as Record<string, unknown>;
    if (typeof record['@id'] === 'string' && typeof record['@type'] === 'string') into.push(record['@id']);
    for (const value of Object.values(record)) collectIds(value, into);
  }
}

// Collects every reference — an object with an @id and no @type of its own.
function collectRefs(node: unknown, into: string[]): void {
  if (Array.isArray(node)) {
    for (const item of node) collectRefs(item, into);
    return;
  }
  if (node && typeof node === 'object') {
    const record = node as Record<string, unknown>;
    if (typeof record['@id'] === 'string' && record['@type'] === undefined) {
      into.push(record['@id']);
      return;
    }
    for (const value of Object.values(record)) collectRefs(value, into);
  }
}

// Throws on any @id defined more than once in the graph. Returns the nodes unchanged.
export function dedupeById(nodes: readonly SchemaNode[]): readonly SchemaNode[] {
  const ids: string[] = [];
  for (const node of nodes) collectIds(node, ids);
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`dedupeById: the @id "${id}" is defined more than once.`);
    seen.add(id);
  }
  return nodes;
}

// Throws if any reference has no matching @id defined in the same graph. `externalIds` are @ids
// other blocks of the same document define (the sitewide block, for the two-blocks-per-page shape,
// spec decision 3) — the gate checks the document union; this checks one block against its peers.
export function assertResolvable(
  nodes: readonly SchemaNode[],
  externalIds: readonly string[] = [],
): readonly SchemaNode[] {
  const defined: string[] = [...externalIds];
  for (const node of nodes) collectIds(node, defined);
  const known = new Set(defined);
  const refs: string[] = [];
  for (const node of nodes) collectRefs(node, refs);
  for (const ref of refs) {
    if (!known.has(ref)) {
      throw new Error(`assertResolvable: the reference "${ref}" resolves to no @id in this graph.`);
    }
  }
  return nodes;
}

// What an assembler returns: a checked graph. Both guards run, in order.
export function checkedGraph(nodes: readonly SchemaNode[], externalIds: readonly string[] = []): SchemaGraph {
  return { '@context': 'https://schema.org', '@graph': assertResolvable(dedupeById(nodes), externalIds) };
}
