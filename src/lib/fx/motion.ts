import { FX_MEDIA } from '@/lib/fx/preferences';

// Shared helpers for the scripted effects (docs/ai/13 §2–§3).
// - effectsOn(): effects run only while no device setting asks for less and Reduce effects is off
//   (the same rule as the fx CSS variant; preferences.ts keeps data-effects on <html>).
// - onEffectsChange(): the switch or a device setting changed; scenes stop or start with it.
// - token(): a motion token's value, so scripts read the same curves and timings as CSS (05 §5).

export function effectsOn(): boolean {
  return document.documentElement.dataset.effects !== 'reduced' && matchMedia(FX_MEDIA).matches;
}

export function onEffectsChange(callback: (on: boolean) => void): () => void {
  let last = effectsOn();
  const check = () => {
    const now = effectsOn();
    if (now !== last) {
      last = now;
      callback(now);
    }
  };
  const observer = new MutationObserver(check);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-effects'] });
  const media = matchMedia(FX_MEDIA);
  media.addEventListener('change', check);
  return () => {
    observer.disconnect();
    media.removeEventListener('change', check);
  };
}

function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// A duration token in seconds (GSAP's unit)
export function seconds(name: string): number {
  const value = token(name);
  return value.endsWith('ms') ? Number.parseFloat(value) / 1000 : Number.parseFloat(value);
}

// The four numbers of an easing token (a Bézier curve), as an SVG path for GSAP's CustomEase
export function bezierPath(name: string): string {
  const numbers = (token(name).match(/-?\d*\.?\d+/g) ?? ['0', '0', '1', '1']).map(Number);
  const [x1, y1, x2, y2] = numbers;
  return `M0,0 C${x1},${y1} ${x2},${y2} 1,1`;
}

export const pointerFine = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

export const desktop = () => matchMedia('(min-width: 64rem)').matches;
