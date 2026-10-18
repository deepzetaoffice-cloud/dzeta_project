// The page scenes (07 §3; 13 §2.2): a page whose region carries data-fx-scene="<name>" loads that
// module once the page is interactive (after the first paint, never before), and stops it on the
// next client navigation. Each module returns its own clean-up. Unlike the lazy enhancements
// (lazy.ts), a scene starts without waiting for a pointer: its autoplay and scroll stories need it.

type Scene = { start: () => () => void };

const MODULES: Record<string, () => Promise<Scene>> = {
  'home-hero': () => import('./home'),
  'hub-dots': () => import('./hub'),
  'service-flow': () => import('./service'),
};

let stops: (() => void)[] = [];

export function stopScenes() {
  for (const stop of stops) stop();
  stops = [];
}

export function armScenes() {
  const names = new Set(
    [...document.querySelectorAll<HTMLElement>('[data-fx-scene]')].map((el) => el.dataset.fxScene ?? ''),
  );
  for (const name of names) {
    const load = MODULES[name];
    if (!load) continue;
    const run = () => {
      void load().then((scene) => {
        if (document.querySelector(`[data-fx-scene="${name}"]`)) stops.push(scene.start());
      });
    };
    if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 1200 });
    else setTimeout(run, 200);
  }
}
