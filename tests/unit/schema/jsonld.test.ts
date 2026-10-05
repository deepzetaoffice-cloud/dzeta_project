import { describe, expect, it } from 'vitest';
import { serializeSchema } from '@/components/seo/JsonLd.tsx';
import type { SchemaGraph } from '@/lib/schema/types.ts';

// The JsonLd escaping (P4 S3, spec §3): a string that could close the <script> early, or break a
// JavaScript parser, must come out inert. JSON.parse of the escaped output must equal the input.

describe('serializeSchema', () => {
  it('escapes <, > and & so no string can close the script element early', () => {
    const graph: SchemaGraph = {
      '@context': 'https://schema.org',
      '@graph': [{ '@type': 'WebPage', name: '</script><script>alert(1)</script>' }],
    };
    const out = serializeSchema(graph);
    expect(out).not.toContain('</script>');
    expect(out).toContain('\\u003c');
    expect(JSON.parse(out)).toEqual(graph);
  });

  it('escapes & so entities stay inert', () => {
    const graph: SchemaGraph = {
      '@context': 'https://schema.org',
      '@graph': [{ '@type': 'WebPage', name: 'A & B' }],
    };
    const out = serializeSchema(graph);
    expect(out).toContain('A \\u0026 B');
    expect(JSON.parse(out)).toEqual(graph);
  });

  it('escapes U+2028 and U+2029, invalid in JavaScript string literals', () => {
    // U+2028 and U+2029 are written as escapes here too: in source they are line terminators.
    const graph: SchemaGraph = {
      '@context': 'https://schema.org',
      '@graph': [{ '@type': 'WebPage', name: 'line\u2028paragraph\u2029end' }],
    };
    const out = serializeSchema(graph);
    expect(out).toContain('\\u2028');
    expect(out).toContain('\\u2029');
    expect(out).not.toMatch(/[\u2028\u2029]/);
    expect(JSON.parse(out)).toEqual(graph);
  });

  it('leaves ordinary content untouched and round-trips', () => {
    const graph: SchemaGraph = {
      '@context': 'https://schema.org',
      '@graph': [{ '@type': 'WebPage', '@id': 'https://deepzeta.ai', name: 'Deepzeta AI' }],
    };
    expect(serializeSchema(graph)).toBe(JSON.stringify(graph));
    expect(JSON.parse(serializeSchema(graph))).toEqual(graph);
  });
});
