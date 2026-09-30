// Reads one brand primitive from src/styles/tokens.css (docs/ai/05 §1: raw values live only there).
// Code that needs a colour literal, such as the manifest and the theme-color meta, reads it here at
// build time instead of repeating it, so every value stays written once and check:tokens holds.
//
// Imported by scripts/build-brand-icons.mjs through Node's own TypeScript loader: keep this file free
// of path aliases and TypeScript-only runtime syntax.
//
// Every page is static today, so this runs only at build. A route that renders at request time needs
// tokens.css in its function bundle (`outputFileTracingIncludes`; P1 plan, Risks).

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const TOKENS_PATH = join('src', 'styles', 'tokens.css');

// The brand primitives are the first block, the one whose selector is exactly `:root` (the file's
// documented shape). Comments are dropped first, so a comment can't hide or fake a declaration.
export function readToken(name: string, css?: string): string {
  const source = (css ?? readFileSync(join(process.cwd(), TOKENS_PATH), 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '');
  const primitives = source.match(/(?:^|[}\s]):root\s*\{([^}]*)\}/)?.[1];
  if (primitives === undefined) throw new Error(`${TOKENS_PATH} has no :root block of brand primitives.`);
  for (const declaration of primitives.split(';')) {
    const colon = declaration.indexOf(':');
    if (colon !== -1 && declaration.slice(0, colon).trim() === name) return declaration.slice(colon + 1).trim();
  }
  throw new Error(`${name} isn't a brand primitive in ${TOKENS_PATH}.`);
}
