import { describe, expect, it } from 'vitest';
import { readToken } from '@/lib/tokens';

describe('readToken', () => {
  it('reads a brand primitive from src/styles/tokens.css', () => {
    expect(readToken('--dz-navy')).toBe('#010413');
  });

  it('reads only the :root block of brand primitives, never a theme block', () => {
    const css = `:root { --dz-navy: #010413; }\n:root,\n[data-theme='dark'] { --dz-bg: var(--dz-navy); }`;
    expect(readToken('--dz-navy', css)).toBe('#010413');
    expect(() => readToken('--dz-bg', css)).toThrow(/isn't a brand primitive/);
  });

  it('ignores declarations inside comments', () => {
    const css = `:root {\n  /* --dz-ghost: #ffffff; */\n  --dz-navy: #010413;\n}`;
    expect(() => readToken('--dz-ghost', css)).toThrow(/isn't a brand primitive/);
  });

  it('throws on an unknown token', () => {
    expect(() => readToken('--dz-not-a-token')).toThrow(/isn't a brand primitive/);
  });
});
