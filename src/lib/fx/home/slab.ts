// The slab's phrase in chunks that end after a space or a hyphen ("Business-" + "centric"). Each
// chunk keeps its letters on one line (.dz-slab-chunk, nowrap), so a long phrase wraps only where a
// word does, as Figma's mobile hero draws it, never between two letters. Shared by the server render
// (Hero.tsx) and the rotator (effects.ts), so both split a phrase the same way.
export function slabChunks(phrase: string): string[] {
  return phrase.split(/(?<=[\s-])/);
}
