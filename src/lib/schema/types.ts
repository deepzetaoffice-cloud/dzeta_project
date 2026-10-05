// The JSON-LD node and graph types (schema-system spec §3; docs/ai/08 §3 rule 1: typed pure
// generators). These are structural types for what the generators emit — plain JSON-LD objects,
// nothing more. Property names follow schema.org exactly; tests/unit/schema/types.test.ts pins every
// @type string to a name schema.org actually defines (spec §6, "a made-up type").

// A JSON-LD node: `@context` lives on the graph, never on a node (spec decision 3).
export type SchemaNode = { '@type': string } & Record<string, unknown>;

// One rendered block: `@context` once, wrapping a @graph of nodes (spec decision 3).
export type SchemaGraph = {
  '@context': 'https://schema.org';
  '@graph': readonly SchemaNode[];
};

// A reference to a node by @id (08 §3 rule 4: an @id, or a node; never a bare URL string where a
// node is expected). Assemblers compose with these before dedupe.
export type SchemaRef = { '@id': string };
