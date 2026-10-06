// The only schema <script> on the site (schema-system spec §3; 00 §6, one file per topic). It only
// serialises — it never fetches data or computes values. The escaping is the security boundary: a
// string containing "</script>" must never close the tag early, and U+2028/U+2029 are invalid in
// JavaScript (they break JSONP-era parsers; JSON.stringify does not escape them itself).
import type { SchemaGraph } from '@/lib/schema/types.ts';

// Exported for the escaping unit test (tests/unit/schema/jsonld.test.ts); the component calls it.
export function serializeSchema(graph: SchemaGraph): string {
  return (
    JSON.stringify(graph)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026')
      // The two JSON-in-JavaScript line terminators (U+2028 LINE SEPARATOR, U+2029 PARAGRAPH
      // SEPARATOR). Valid inside JSON strings, invalid inside JavaScript string literals.
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')
  );
}

export function JsonLd({ graph }: { graph: SchemaGraph }) {
  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML is safe here because serializeSchema escaped every way a string
      // could break out of the script element; nothing else passes through.
      dangerouslySetInnerHTML={{ __html: serializeSchema(graph) }}
    />
  );
}
