import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  checkContrast,
  coloursIn,
  composite,
  contrastRatio,
  NOT_CHECKED,
  PAIRS,
  parseTokens,
  REPORTED,
  TOKENS_FILE,
  unreadColourSyntax,
} from '../../scripts/check-contrast.mjs';

// The v3 contrast gate (docs/ai/05 §2.4; decision 0033): the real tokens pass, the shape is enforced,
// and the colour maths matches WCAG 2.x.

// A tokens file in the documented shape: the primitives, then everything else, then @media and @theme.
function tokens(extra = '', media = '') {
  return `
:root {
  --dz-p-ink: #0b0a2a;
  --dz-p-white: #ffffff;
  --dz-p-white-16: #ffffff29;
  --dz-p-blue: #2563fd;
  --dz-p-pale: #c3c5d3;
}
:root {
  color-scheme: light;
  --dz-color-text: var(--dz-p-ink);
  --dz-color-bg: var(--dz-p-white);
  --dz-color-glass: var(--dz-p-white-16);
  --dz-grad: linear-gradient(120deg, var(--dz-p-blue) 0%, #5a2bfd 100%);
  ${extra}
}
${media}
@theme { --color-*: initial; }
`;
}

const pair = (fg: string, bg: string, kind: 'text' | 'large' | 'ui', over?: string) => ({ fg, bg, kind, over });

describe('check:contrast', () => {
  it('passes on the real tokens file, and says what it reports and what it leaves unchecked', () => {
    const { results, problems } = checkContrast(readFileSync(TOKENS_FILE, 'utf8'), PAIRS);
    expect(problems).toEqual([]);
    expect(results.filter((r: { pass: boolean }) => !r.pass)).toEqual([]);
    expect(results.length).toBe(PAIRS.length);
    expect(checkContrast(readFileSync(TOKENS_FILE, 'utf8'), REPORTED).problems).toEqual([]);
    expect(NOT_CHECKED.length).toBeGreaterThan(0);
  });

  it('checks a pair at every gradient stop and keeps the worst', () => {
    const { results } = checkContrast(tokens(), [pair('--dz-p-white', '--dz-grad', 'text')]);
    expect(results[0].worstBg).toBe('#2563fd');
    expect(results[0].ratio).toBeCloseTo(4.9, 1);
  });

  it('composites a translucent background over what sits behind it', () => {
    const { results, problems } = checkContrast(tokens(), [
      pair('--dz-p-white', '--dz-color-glass', 'large', '--dz-grad'),
    ]);
    expect(problems).toEqual([]);
    expect(results[0].worstBg).toBe('#487cfd');
    expect(results[0].ratio).toBeCloseTo(3.76, 1);
  });

  it('refuses a translucent background without `over`', () => {
    const { problems } = checkContrast(tokens(), [pair('--dz-p-white', '--dz-color-glass', 'text')]);
    expect(problems[0]).toMatch(/isn't opaque/);
  });

  it('fails a pair below its threshold', () => {
    const { results } = checkContrast(tokens(), [pair('--dz-p-pale', '--dz-color-bg', 'ui')]);
    expect(results[0].pass).toBe(false);
  });

  it('fails on a missing token and on colour syntax it cannot read', () => {
    expect(checkContrast(tokens(), [pair('--dz-ghost', '--dz-color-bg', 'text')]).problems[0]).toMatch(/isn't defined/);
    const named = tokens('--dz-named: rebeccapurple;');
    expect(checkContrast(named, [pair('--dz-named', '--dz-color-bg', 'text')]).problems[0]).toMatch(/can't read/);
  });

  it('enforces the shape: two :root blocks, layout-only @media, nothing else', () => {
    expect(parseTokens(tokens()).problems).toEqual([]);
    const media = tokens('', '@media (min-width: 48rem) { :root { --dz-layout-columns: 8; } }');
    expect(parseTokens(media).problems).toEqual([]);
    const themed = tokens('', '@media (prefers-color-scheme: dark) { :root { --dz-color-bg: #000000; } }');
    expect(parseTokens(themed).problems[0]).toMatch(/only layout tokens/);
    const extraBlock = tokens('', "[data-theme='dark'] { --dz-color-bg: #000000; }");
    expect(parseTokens(extraBlock).problems[0]).toMatch(/unexpected block/);
  });

  it('reads hex, hex with alpha and oklch', () => {
    expect(coloursIn('#ffffff29')[0]?.a).toBeCloseTo(0.16, 2);
    const white = coloursIn('oklch(1 0 0)')[0];
    expect(Math.round(white?.r ?? 0)).toBe(255);
    expect(unreadColourSyntax('linear-gradient(90deg, #ffffff 0%, oklch(0.5 0.2 270) 100%)')).toEqual([]);
  });

  it('matches WCAG: black on white is 21:1, and alpha composites over the background', () => {
    const black = { r: 0, g: 0, b: 0, a: 1 };
    const white = { r: 255, g: 255, b: 255, a: 1 };
    expect(contrastRatio(black, white)).toBeCloseTo(21, 5);
    expect(composite({ ...black, a: 0.5 }, white).r).toBeCloseTo(127.5, 5);
  });
});
