// The Reduce effects preference (docs/ai/13 §2.11; decision 0033: light only, so there is no theme).
// The init script (init-script.ts) applies it before the first paint, from the constants and the rule
// below; this module keeps it in step afterwards: the footer's switch, storage, other tabs and
// device-setting changes. The key holds a display choice only, never personal data.

export const EFFECTS_KEY = 'dz-effects';
// The theme choice the site stored before v3 (decision 0015). v3 is light only (C77), so it's never
// read; returning visitors may still hold it, so startPreferences() removes it and Cookie settings
// keeps listing it among the site's own storage.
export const THEME_KEY = 'dz-theme';
export const REDUCED = 'reduced';
export const FULL = 'full';

// Effects run only while this matches, and never under data-effects="reduced" (the fx variant in
// globals.css repeats it). Not matching is a device setting the visitor can't override here: reduced
// motion, more contrast, forced colours.
export const FX_MEDIA =
  '(prefers-reduced-motion: no-preference) and (prefers-contrast: no-preference) and (forced-colors: none)';
// Chromium-only, so it's read here and never in a CSS condition, where other browsers would read an
// unknown feature as false and turn every effect off. Also a device setting.
export const REDUCED_TRANSPARENCY = '(prefers-reduced-transparency: reduce)';
// Low-end hints, which the visitor may override: Save-Data, or this much memory or less (GB).
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

function read(): string | null {
  try {
    return localStorage.getItem(EFFECTS_KEY);
  } catch {
    return null;
  }
}

function write(value: string) {
  try {
    localStorage.setItem(EFFECTS_KEY, value);
  } catch {
    // Storage blocked (private mode, a policy): the choice holds for this page only.
  }
}

const root = () => document.documentElement;

function effectsNow() {
  return resolveEffects({
    choice: read(),
    deviceSetting: !matchMedia(FX_MEDIA).matches || matchMedia(REDUCED_TRANSPARENCY).matches,
    lowEnd: lowEndHint(),
  });
}

// Every copy of the switch shows the same state. A switch is a <button role="switch"
// data-dz-switch="effects">. A locked switch is described by its note (data-note), and only then.
function sync() {
  const { reduced, locked } = effectsNow();
  if (reduced) root().dataset.effects = REDUCED;
  else delete root().dataset.effects;
  for (const button of document.querySelectorAll<HTMLElement>('[data-dz-switch="effects"]')) {
    button.setAttribute('aria-checked', String(reduced));
    button.setAttribute('aria-disabled', String(locked));
    const note = button.dataset.note;
    if (locked && note) button.setAttribute('aria-describedby', note);
    else button.removeAttribute('aria-describedby');
  }
}

function onClick(event: MouseEvent) {
  const button = (event.target as Element).closest<HTMLElement>('[data-dz-switch="effects"]');
  if (!button) return;
  const { reduced, locked } = effectsNow();
  if (locked) return;
  write(reduced ? FULL : REDUCED);
  sync();
}

let started = false;

export function startPreferences() {
  if (started) return;
  started = true;
  try {
    localStorage.removeItem(THEME_KEY);
  } catch {
    // Storage blocked: nothing to remove.
  }
  sync();
  // The switch works from here on, so it can be shown (globals.css).
  root().dataset.prefs = 'ready';
  document.addEventListener('click', onClick);
  for (const query of [FX_MEDIA, REDUCED_TRANSPARENCY]) matchMedia(query).addEventListener('change', sync);
  // A choice made in another tab applies here too.
  addEventListener('storage', (event) => {
    if (event.key === EFFECTS_KEY) sync();
  });
}
