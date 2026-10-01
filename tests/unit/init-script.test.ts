import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { initScript } from '@/lib/fx/init-script';
import { EFFECTS_KEY, FX_MEDIA, REDUCED_TRANSPARENCY, resolveEffects, THEME_KEY } from '@/lib/fx/preferences';

// The no-flash script (P2 plan, C2 and O) runs here against fake browser objects: the same string
// the page inlines. Every combination of stored choice, hint and device setting must give the result
// the runtime's own rule gives (resolveEffects), so the two can't drift apart.

type Setup = {
  theme?: string | null;
  effects?: string | null;
  storageThrows?: boolean;
  fxMedia?: boolean; // FX_MEDIA matches: no device setting asks for less
  reducedTransparency?: boolean;
  deviceMemory?: number;
  saveData?: boolean;
  hasMeta?: boolean;
};

function run({
  theme = null,
  effects = null,
  storageThrows = false,
  fxMedia = true,
  reducedTransparency = false,
  deviceMemory,
  saveData,
  hasMeta = true,
}: Setup = {}) {
  const attributes = new Map<string, string>();
  const nextMeta = { name: 'color-scheme', content: 'dark' };
  const added: { name?: string; content?: string }[] = [];
  const document = {
    documentElement: { setAttribute: (name: string, value: string) => attributes.set(name, value) },
    head: { appendChild: (element: { name?: string; content?: string }) => added.push(element) },
    querySelector: (selector: string) => (selector === 'meta[name="color-scheme"]' && hasMeta ? nextMeta : null),
    createElement: () => ({}),
  };
  const values: Record<string, string | null> = { [THEME_KEY]: theme, [EFFECTS_KEY]: effects };
  const localStorage = {
    getItem: (key: string) => {
      if (storageThrows) throw new Error('SecurityError');
      return values[key] ?? null;
    },
  };
  const navigator = { deviceMemory, connection: saveData === undefined ? undefined : { saveData } };
  const matchMedia = (query: string) => ({
    matches: query === FX_MEDIA ? fxMedia : query === REDUCED_TRANSPARENCY ? reducedTransparency : false,
  });
  new Function('document', 'localStorage', 'navigator', 'matchMedia', initScript)(
    document,
    localStorage,
    navigator,
    matchMedia,
  );
  return { attributes, meta: nextMeta, added };
}

describe('the no-flash script', () => {
  it('leaves a first visit dark, with effects on, and changes nothing', () => {
    const { attributes, meta, added } = run();
    expect([...attributes]).toEqual([]);
    expect(meta.content).toBe('dark');
    expect(added).toEqual([]);
  });

  it('applies a stored light theme and turns the color-scheme meta to light', () => {
    const { attributes, meta } = run({ theme: 'light' });
    expect(attributes.get('data-theme')).toBe('light');
    expect(meta.content).toBe('light');
  });

  it('adds a light color-scheme meta if the page has none', () => {
    const { added } = run({ theme: 'light', hasMeta: false });
    expect(added).toEqual([{ name: 'color-scheme', content: 'light' }]);
  });

  it('ignores anything but "light" in the theme key: every first visit is dark (05 §1)', () => {
    for (const theme of ['dark', 'LIGHT', '', 'x']) expect(run({ theme }).attributes.has('data-theme')).toBe(false);
  });

  it('survives blocked storage, and still applies the device hints', () => {
    expect([...run({ storageThrows: true }).attributes]).toEqual([]);
    expect(run({ storageThrows: true, deviceMemory: 1 }).attributes.get('data-effects')).toBe('reduced');
  });

  it('agrees with resolveEffects() for every combination of choice, hint and device setting', () => {
    let cases = 0;
    for (const effects of [null, 'reduced', 'full', 'other'])
      for (const fxMedia of [true, false])
        for (const reducedTransparency of [false, true])
          for (const deviceMemory of [undefined, 0.5, 1, 2, 4, 8])
            for (const saveData of [undefined, false, true]) {
              const lowEnd = Boolean(saveData) || (deviceMemory ?? Infinity) <= 2;
              const expected = resolveEffects({
                choice: effects,
                deviceSetting: !fxMedia || reducedTransparency,
                lowEnd,
              }).reduced;
              const { attributes } = run({ effects, fxMedia, reducedTransparency, deviceMemory, saveData });
              const label = JSON.stringify({ effects, fxMedia, reducedTransparency, deviceMemory, saveData });
              expect(attributes.get('data-effects'), label).toBe(expected ? 'reduced' : undefined);
              cases++;
            }
    expect(cases).toBe(4 * 2 * 2 * 6 * 3);
  });

  it('follows the rule: a device setting locks effects off; a low-end hint yields to a stored choice', () => {
    expect(resolveEffects({ choice: 'full', deviceSetting: true, lowEnd: false })).toEqual({
      reduced: true,
      locked: true,
    });
    expect(resolveEffects({ choice: 'full', deviceSetting: false, lowEnd: true })).toEqual({
      reduced: false,
      locked: false,
    });
    expect(resolveEffects({ choice: null, deviceSetting: false, lowEnd: true }).reduced).toBe(true);
    expect(resolveEffects({ choice: 'reduced', deviceSetting: false, lowEnd: false }).reduced).toBe(true);
  });

  it('is a static string of our own constants, safe to inline in <head> (C40)', () => {
    expect(initScript).not.toMatch(/<\/|<!--|\$\{/);
    expect(new TextEncoder().encode(initScript).length).toBeLessThan(1024);
  });

  it('uses the same media condition as the fx variant in globals.css', () => {
    const css = readFileSync('src/styles/globals.css', 'utf8');
    const variant = /@custom-variant fx \{\s*@media ([^{]+)\{/.exec(css);
    expect(variant?.[1]?.trim()).toBe(FX_MEDIA);
  });
});
