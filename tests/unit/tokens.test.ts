import { describe, expect, it } from 'vitest';
import { readToken } from '@/lib/tokens';

describe('readToken', () => {
  it('reads a brand primitive from src/styles/tokens.css', () => {
    expect(readToken('--dz-p-ink-950')).toBe('#0b0a2a');
  });

  it('reads only the :root block of brand primitives, never a theme block', () => {
    const css = `:root { --dz-navy: #010413; }\n:root,\n[data-theme='dark'] { --dz-bg: var(--dz-navy); }`;
    expect(readToken('--dz-navy', css)).toBe('#010413');
    expect(() => readToken('--dz-bg', css)).toThrow(/isn't a brand primitive/);
  });

  it('reads only the first :root block (v3: the primitives), never the second, semantic one', () => {
    const css = `:root { --dz-p-white: #ffffff; }\n:root { --dz-color-bg-surface: var(--dz-p-white); }`;
    expect(readToken('--dz-p-white', css)).toBe('#ffffff');
    expect(() => readToken('--dz-color-bg-surface', css)).toThrow(/isn't a brand primitive/);
  });

  it('ignores declarations inside comments', () => {
    const css = `:root {\n  /* --dz-ghost: #ffffff; */\n  --dz-navy: #010413;\n}`;
    expect(() => readToken('--dz-ghost', css)).toThrow(/isn't a brand primitive/);
  });

  it('throws on an unknown token', () => {
    expect(() => readToken('--dz-not-a-token')).toThrow(/isn't a brand primitive/);
  });
});
