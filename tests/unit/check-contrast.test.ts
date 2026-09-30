import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  checkContrast,
  coloursIn,
  composite,
  contrastRatio,
  GRAIN_FILE,
  grainSpeck,
  NOT_CHECKED,
  PAIRS,
  REPORTED,
  TOKENS_FILE,
  unreadColourSyntax,
} from '../../scripts/check-contrast.mjs';

const realGrain = () => grainSpeck(readFileSync(GRAIN_FILE, 'utf8'));

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
    const { results, problems } = checkContrast(readFileSync(TOKENS_FILE, 'utf8'), PAIRS, { grain: realGrain() });
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

  it('fails colour syntax it cannot read, rather than dropping that stop', () => {
    expect(unreadColourSyntax('linear-gradient(150deg, #09e8fe 0%, rgba(22, 34, 74, 0.14) 25%)')).toEqual([]);
    expect(unreadColourSyntax('linear-gradient(90deg, #08c6fd, oklch(0.2 0.1 250))')).toEqual(['oklch']);
    expect(unreadColourSyntax('linear-gradient(90deg, #08c6fd, rgb(1 2))')).toEqual(['rgb']);
    const css = tokens({
      extra: ':root { --dz-grad-mixed: linear-gradient(90deg, #2f6bff, transparent); --dz-hsl: hsl(230 90% 4%); }',
    });
    for (const bg of ['--dz-grad-mixed', '--dz-hsl']) {
      const pair = { fg: '--dz-white', bg, kind: 'text', themes: ['brand'] };
      expect(checkContrast(css, [pair]).problems).toContainEqual(expect.stringContaining("can't read"));
    }
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

  // Conflict C38 (P1): the pillar pixels are measured on every icon surface and reported, never gated.
  it('measures every pillar pixel on every icon surface, at every gradient stop, through the stop tokens', () => {
    const { results, problems } = checkContrast(readFileSync(TOKENS_FILE, 'utf8'), REPORTED);
    expect(problems).toEqual([]);
    expect(results).toHaveLength(4 * 6);
    const ranking = results.find((r) => r.fg === '--dz-pixel-ranking' && r.bg === '--dz-navy-800');
    expect(ranking?.ratio).toBeCloseTo(2.34, 2);
    expect(ranking?.worstFg).toBe('#4c27fb');
  });

  // P2 plan, F3: glass is translucent, so its pairs are composited over the worst backdrop, with and
  // without the frost grain's brightest speck.
  it('reads the grain file: white specks at 6% at most', () => {
    expect(realGrain()).toEqual({ r: 255, g: 255, b: 255, a: 0.06 });
  });

  it('fails a grain it cannot bound: noise in the colour rows, or no single matrix', () => {
    const matrix = (values: string) => `<svg><filter><feColorMatrix values="${values}"/></filter></svg>`;
    expect(() => grainSpeck(matrix('1 0 0 0 0 0 0 0 0 1 0 0 0 0 1 0 0 0 .06 0'))).toThrow(/constant/);
    expect(() => grainSpeck(matrix('0 0 0 0 1'))).toThrow(/20-value/);
    expect(() => grainSpeck('<svg></svg>')).toThrow(/one feColorMatrix/);
    // Every positive noise coefficient counts toward the brightest speck.
    expect(grainSpeck(matrix('0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 .1 0 0 .06 .02')).a).toBeCloseTo(0.18, 5);
  });

  it('checks glass over the worst backdrop, and again with the grain on top', () => {
    const css = tokens({
      extra: ':root { --dz-frost: #c9d4ff; --dz-card-light: #ffffff; --dz-tint: rgba(8, 18, 46, 0.73); }',
    });
    const glass = {
      fg: '--dz-frost',
      bg: '--dz-tint',
      kind: 'text',
      themes: ['dark'],
      backdrop: { dark: '--dz-card-light' },
    };
    const withGrain = checkContrast(css, [glass], { grain: realGrain() }).results[0];
    const noGrain = checkContrast(css, [glass], { grain: { r: 0, g: 0, b: 0, a: 0 } }).results[0];
    expect(withGrain?.ratio).toBeCloseTo(4.53, 2);
    expect(withGrain?.pass).toBe(true);
    // The white speck lightens the tint behind light text, so it's the worst case.
    expect(noGrain!.ratio).toBeGreaterThan(withGrain!.ratio);
    expect(checkContrast(css, [glass]).problems).toContainEqual(expect.stringContaining('needs the grain'));
    // A translucent backdrop would leave the result depending on what's behind the backdrop.
    const seeThrough = { ...glass, backdrop: { dark: '--dz-hairline-light' } };
    expect(checkContrast(css, [seeThrough], { grain: realGrain() }).problems).toContainEqual(
      expect.stringContaining('must be one opaque colour'),
    );
  });

  it('gates text, strong text and focus on the minimum glass tint, and mist on the muted one, in both themes', () => {
    const glass = PAIRS.filter((pair) => 'backdrop' in pair);
    expect(glass.map((pair) => `${pair.fg} ${pair.bg} ${pair.themes.join(',')}`)).toEqual([
      '--dz-text --dz-glass-tint-min dark,light',
      '--dz-text-strong --dz-glass-tint-min dark,light',
      '--dz-focus --dz-glass-tint-min dark,light',
      '--dz-text-muted --dz-glass-tint-muted dark,light',
    ]);
    expect(NOT_CHECKED.join(' ')).not.toMatch(/glass surfaces/);
  });

  it('keeps the reported pixel pairs out of the gated pairs, and no longer lists pixels as unchecked', () => {
    const gated = new Set(PAIRS.map((pair) => `${pair.fg} ${pair.bg}`));
    expect(REPORTED.filter((pair) => gated.has(`${pair.fg} ${pair.bg}`))).toEqual([]);
    expect(NOT_CHECKED.join(' ')).not.toMatch(/pixel/i);
  });
});
