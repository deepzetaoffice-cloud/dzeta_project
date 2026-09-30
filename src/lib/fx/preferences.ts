// Display preferences: the theme and Reduce effects (docs/ai/13 §2.11; decision 0015; P2 plan, C).
// The init script (init-script.ts) applies them before the first paint, from the constants and the
// rule below; this module keeps them in step afterwards: the switches, storage, other tabs and
// device-setting changes. Both keys hold display choices only, never personal data (plan C5).

export const THEME_KEY = 'dz-theme';
export const EFFECTS_KEY = 'dz-effects';
export const LIGHT = 'light';
export const REDUCED = 'reduced';
export const FULL = 'full';

// Effects run only while this matches, and never under data-effects="reduced" (the fx variant in
// globals.css repeats it, and a unit test keeps the two equal). Not matching is a device setting the
// visitor can't override here: reduced motion, more contrast, forced colours.
export const FX_MEDIA =
  '(prefers-reduced-motion: no-preference) and (prefers-contrast: no-preference) and (forced-colors: none)';
// Chromium-only, so it's read here and never in a CSS condition, where other browsers would read an
// unknown feature as false and turn every effect off (plan C3). Also a device setting.
export const REDUCED_TRANSPARENCY = '(prefers-reduced-transparency: reduce)';
// Low-end hints, which the visitor may override: Save-Data, or this much memory or less (GB). The
// threshold is confirmed on the budget phone (the feasibility gate).
export const LOW_MEMORY_GB = 2;

export type EffectsInput = { choice: string | null; deviceSetting: boolean; lowEnd: boolean };

// The one rule, shared with the init script's test: a device setting locks effects off; otherwise
// the visitor's stored choice wins, and without one a low-end hint turns them off.
export function resolveEffects({ choice, deviceSetting, lowEnd }: EffectsInput) {
  const reduced = deviceSetting || choice === REDUCED || (choice !== FULL && lowEnd);
  return { reduced, locked: deviceSetting };
}

type Hints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

function lowEndHint(): boolean {
  const { deviceMemory, connection } = navigator as Hints;
  return Boolean(connection?.saveData) || (deviceMemory ?? Infinity) <= LOW_MEMORY_GB;
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage blocked (private mode, a policy): the choice holds for this page only.
  }
}

const root = () => document.documentElement;

function effectsNow() {
  return resolveEffects({
    choice: read(EFFECTS_KEY),
    deviceSetting: !matchMedia(FX_MEDIA).matches || matchMedia(REDUCED_TRANSPARENCY).matches,
    lowEnd: lowEndHint(),
  });
}

// Every copy of a switch shows the same state: the mobile sheet, the mega-menu rail and the footer
// (plan C4). A switch is a <button role="switch" data-dz-switch="theme|effects">.
function sync() {
  const light = root().dataset.theme === LIGHT;
  const { reduced, locked } = effectsNow();
  if (reduced) root().dataset.effects = REDUCED;
  else delete root().dataset.effects;
  for (const button of document.querySelectorAll<HTMLElement>('[data-dz-switch]')) {
    const effects = button.dataset.dzSwitch === 'effects';
    button.setAttribute('aria-checked', String(effects ? reduced : light));
    if (effects) button.setAttribute('aria-disabled', String(locked));
  }
}

function applyTheme(theme: string | null) {
  const light = theme === LIGHT;
  if (light) root().dataset.theme = LIGHT;
  else delete root().dataset.theme;
  // The init script may have added a second color-scheme meta ahead of Next.js's own; both follow.
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="color-scheme"]')) {
    meta.content = light ? LIGHT : 'dark';
  }
  sync();
}

function onClick(event: MouseEvent) {
  const button = (event.target as Element).closest<HTMLElement>('[data-dz-switch]');
  if (!button) return;
  if (button.dataset.dzSwitch === 'theme') {
    const theme = root().dataset.theme === LIGHT ? 'dark' : LIGHT;
    write(THEME_KEY, theme);
    applyTheme(theme);
    return;
  }
  const { reduced, locked } = effectsNow();
  if (locked) return;
  write(EFFECTS_KEY, reduced ? FULL : REDUCED);
  sync();
}

let started = false;

export function startPreferences() {
  if (started) return;
  started = true;
  applyTheme(read(THEME_KEY));
  document.addEventListener('click', onClick);
  for (const query of [FX_MEDIA, REDUCED_TRANSPARENCY]) matchMedia(query).addEventListener('change', sync);
  // A choice made in another tab applies here too.
  addEventListener('storage', (event) => {
    if (event.key === THEME_KEY) applyTheme(event.newValue);
    else if (event.key === EFFECTS_KEY) sync();
  });
}
