import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  checkContrast,
  coloursIn,
  composite,
  contrastRatio,
  PAIRS,
  TOKENS_FILE,
} from '../../scripts/check-contrast.mjs';

interface Parts {
  lightFocus?: string;
  darkExtra?: string;
  extra?: string;
}

// A tokens file in the documented shape, with the parts each test changes.
function tokens({ lightFocus = 'var(--dz-royal)', darkExtra = '', extra = '' }: Parts = {}) {
  return `
/* primitives */
:root {
  --dz-navy: #010413;
  --dz-white: #f4f6fb;
  --dz-signal: #2f6bff;
  --dz-ice: #7cf3ff;
  --dz-royal: #2139f6;
  --dz-paper: #f4f6fb;
  --dz-grad-action: linear-gradient(90deg, #08c6fd, #2f6bff);
  --dz-hairline-light: rgba(22, 34, 74, 0.14);
}
:root,
[data-theme='dark'] {
  color-scheme: dark;
  --dz-bg: var(--dz-navy);
  --dz-focus: var(--dz-ice);
  ${darkExtra}
}
[data-theme='light'] {
  color-scheme: light;
  --dz-bg: var(--dz-paper);
  --dz-focus: ${lightFocus};
}
@theme {
  --color-*: initial;
}
@theme inline {
  --color-bg: var(--dz-bg);
}
${extra}`;
}

const focusPair = { fg: '--dz-focus', bg: '--dz-bg', kind: 'ui', themes: ['dark', 'light'] };

describe('check:contrast', () => {
  it('computes WCAG ratios', () => {
    const black = { r: 0, g: 0, b: 0, a: 1 };
    const white = { r: 255, g: 255, b: 255, a: 1 };
    expect(contrastRatio(white, black)).toBeCloseTo(21, 5);
    expect(contrastRatio(black, black)).toBeCloseTo(1, 5);
  });

  it('passes the real tokens, and checks every listed pair', () => {
    const { results, problems } = checkContrast(readFileSync(TOKENS_FILE, 'utf8'));
    expect(problems).toEqual([]);
    expect(results.filter((r) => !r.pass)).toEqual([]);
    expect(results).toHaveLength(PAIRS.reduce((sum, pair) => sum + pair.themes.length, 0));
  });

  it('fails white text on solid signal as body text, and passes it as large text', () => {
    const css = tokens();
    const [asText] = checkContrast(css, [
      { fg: '--dz-white', bg: '--dz-signal', kind: 'text', themes: ['brand'] },
    ]).results;
    const [asLarge] = checkContrast(css, [
      { fg: '--dz-white', bg: '--dz-signal', kind: 'large', themes: ['brand'] },
    ]).results;
    expect(asText?.ratio).toBeCloseTo(4.16, 2);
    expect(asText?.pass).toBe(false);
    expect(asLarge?.pass).toBe(true);
  });

  it('fails the dark focus colour (ice) on light paper', () => {
    const { results, problems } = checkContrast(tokens({ lightFocus: 'var(--dz-ice)' }), [focusPair]);
    expect(problems).toEqual([]);
    expect(results.map((r) => [r.theme, r.pass])).toEqual([
      ['dark', true],
      ['light', false],
    ]);
    expect(results[1]?.ratio).toBeCloseTo(1.2, 1);
  });

  it('fails a prefers-color-scheme block, because every first visit is dark (0015)', () => {
    const media =
      "@media (prefers-color-scheme: light) { :root:not([data-theme='dark']) { --dz-bg: var(--dz-paper); } }";
    expect(checkContrast(tokens({ extra: media }), [focusPair]).problems).toContainEqual(
      expect.stringContaining('every first visit is dark'),
    );
  });

  it('fails a semantic token that has no light value', () => {
    const { problems } = checkContrast(tokens({ darkExtra: '--dz-text: var(--dz-white);' }), []);
    expect(problems).toContainEqual('--dz-text has a dark value but no light value');
  });

  it('checks a gradient at every stop and reports the worst one', () => {
    expect(coloursIn('linear-gradient(90deg, #08c6fd, #2f6bff)')).toHaveLength(2);
    const [cta] = checkContrast(tokens(), [
      { fg: '--dz-navy', bg: '--dz-grad-action', kind: 'text', themes: ['brand'] },
    ]).results;
    expect(cta?.worstBg).toBe('#2f6bff');
    expect(cta?.ratio).toBeCloseTo(4.54, 2);
  });

  it('composites a translucent foreground over its background', () => {
    const [hairline] = coloursIn('rgba(22, 34, 74, 0.14)');
    expect(hairline?.a).toBeCloseTo(0.14, 5);
    const paper = { r: 244, g: 246, b: 251, a: 1 };
    const painted = composite(hairline!, paper);
    expect(painted.r).toBeCloseTo(0.14 * 22 + 0.86 * 244, 5);
  });

  it('rejects a translucent background, whose contrast depends on what is behind it', () => {
    const pair = { fg: '--dz-navy', bg: '--dz-hairline-light', kind: 'text', themes: ['brand'] };
    expect(checkContrast(tokens(), [pair]).problems).toContainEqual(
      expect.stringContaining("the background isn't opaque"),
    );
  });

  it('fails loudly on anything outside the tokens shape', () => {
    expect(checkContrast(tokens({ extra: '.card { color: red; }' }), []).problems).toContainEqual(
      expect.stringContaining('unexpected block ".card"'),
    );
    expect(checkContrast(tokens({ extra: ':root { --dz-x: 1; .nested { --dz-y: 2; } }' }), []).problems).toContainEqual(
      expect.stringContaining('nested blocks'),
    );
    expect(checkContrast(tokens({ darkExtra: 'margin: 0;' }), []).problems).toContainEqual(
      expect.stringContaining('only custom properties and color-scheme belong here'),
    );
    const missing = { fg: '--dz-nope', bg: '--dz-bg', kind: 'text', themes: ['dark'] };
    expect(checkContrast(tokens(), [missing]).problems).toContainEqual(
      expect.stringContaining("--dz-nope isn't defined"),
    );
  });

  it('fails when a theme block is missing', () => {
    const withoutLight = tokens().replace(/\[data-theme='light'\] \{[^}]*\}/, '');
    expect(checkContrast(withoutLight, []).problems).toContainEqual("missing block: [data-theme='light']");
  });
});
