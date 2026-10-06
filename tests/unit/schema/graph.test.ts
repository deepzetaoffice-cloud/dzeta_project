import { describe, expect, it } from 'vitest';
import { assertResolvable, checkedGraph, dedupeById } from '@/lib/schema/graph.ts';
import { sitewideGraph } from '@/lib/schema/graphs/sitewide.ts';
import type { SchemaNode } from '@/lib/schema/types.ts';

// The graph guards (P4 S6): duplicate @ids and dangling references throw — the spec's stop
// conditions, enforced at assembly time so a broken graph never ships.

const node = (id: string, extra: Record<string, unknown> = {}): SchemaNode => ({
  '@type': 'Thing',
  '@id': id,
  ...extra,
});

describe('dedupeById', () => {
  it('passes a graph with unique @ids, even nested ones', () => {
    const nodes = [
      node('https://deepzeta.ai/#organization', { logo: { '@id': 'https://deepzeta.ai/#logo' } }),
      node('https://deepzeta.ai/#logo'),
    ];
    expect(dedupeById(nodes)).toBe(nodes);
  });

  it('throws on a duplicate @id among siblings', () => {
    expect(() => dedupeById([node('x'), node('x')])).toThrow(/defined more than once/);
  });

  it('throws on a duplicate @id nested inside another node', () => {
    expect(() => dedupeById([node('x', { publisher: { '@id': 'x' } }), node('x')])).toThrow(/defined more than once/);
  });
});

describe('assertResolvable', () => {
  it('passes when every reference resolves in the same graph', () => {
    const nodes = [node('a', { publisher: { '@id': 'b' } }), node('b')];
    expect(assertResolvable(nodes)).toBe(nodes);
  });

  it('passes when a reference resolves to an external @id (the sitewide block)', () => {
    const nodes = [node('a', { isPartOf: { '@id': 'https://deepzeta.ai/#website' } })];
    expect(assertResolvable(nodes, ['https://deepzeta.ai/#website'])).toBe(nodes);
  });

  it('throws on a dangling reference', () => {
    expect(() => assertResolvable([node('a', { about: { '@id': 'missing' } })])).toThrow(/resolves to no @id/);
  });

  it('a plain URL value is not a reference and never throws', () => {
    const nodes = [node('a', { url: 'https://deepzeta.ai', item: 'https://deepzeta.ai/x' })];
    expect(assertResolvable(nodes)).toBe(nodes);
  });
});

describe('checkedGraph', () => {
  it('wraps the checked nodes with @context once', () => {
    const graph = checkedGraph([node('a')]);
    expect(graph['@context']).toBe('https://schema.org');
    expect(graph['@graph']).toHaveLength(1);
  });

  it('the sitewide graph passes both guards (it is checked at assembly)', () => {
    expect(() => sitewideGraph()).not.toThrow();
  });
});
