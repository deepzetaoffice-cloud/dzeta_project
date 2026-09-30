import { describe, expect, it } from 'vitest';
import { libraryIds, registerCitations } from '../../scripts/check-effects.mjs';

const library = [
  '## 3. Hard rules',
  '| `not-an-effect` | outside §4 |',
  '## 4. Effects library',
  '| ID | Effect | Where |',
  '|---|---|---|',
  '| `glass-frost` | Baked frost | Everywhere |',
  '| `hover-underline` | Text link | uses `glass-frost` too |',
  '## 5. Compositions',
  '| `the-assembly` | not a library row |',
].join('\n');

describe('check:effects', () => {
  it('reads the library IDs from the first column of 13 §4 tables only', () => {
    expect([...libraryIds(library)]).toEqual(['glass-frost', 'hover-underline']);
  });

  it('reads citations from the Effect ID column of an Effect register', () => {
    const plan = [
      '## Effect register',
      '| Section | Effect ID | Cost → mitigation |',
      '|---|---|---|',
      '| Hero | `glass-frost`, `hover-charged` | uses `--dz-glass-blur` |',
      '## Risks',
      '| Section | Effect ID |',
      '| Ignored | `not-a-register` |',
    ].join('\n');
    const { citations, problems } = registerCitations(plan);
    expect(citations.map((c: { id: string }) => c.id)).toEqual(['glass-frost', 'hover-charged']);
    expect(problems).toEqual([]);
  });

  it('flags a register table without an Effect ID column', () => {
    const plan = ['## Effect register', '| Section | Effect |', '|---|---|', '| Hero | `glass-frost` |'].join('\n');
    expect(registerCitations(plan).problems).toHaveLength(1);
  });
});
