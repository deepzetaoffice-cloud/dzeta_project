import { effectsOn, onEffectsChange, seconds } from '@/lib/fx/motion';

// The service template's flow (service-page.md §03; section-reveal): when the diagram first comes
// into view, its steps light in order, one every sweep token, in the list and the diagram together,
// and the last step stays lit (about 5 s for 5 steps; it plays once, so no pause control is needed,
// 13 §2.9). With effects off it never arms: every step rests lit, the static final state.

export function start(): () => void {
  const flow = document.querySelector<HTMLElement>('[data-fx-svc-flow]');
  if (!flow) return () => {};
  const count = Number(flow.dataset.step) || 0;
  const parts = [...flow.querySelectorAll<HTMLElement>('[data-flow-step], [data-flow-node]')];
  let timer = 0;
  let played = false;
  let observer: IntersectionObserver | undefined;

  const show = (current: number) => {
    for (const part of parts) {
      const index = Number(part.dataset.flowStep ?? part.dataset.flowNode);
      part.dataset.state = index < current ? 'done' : index === current ? 'active' : 'upcoming';
    }
  };

  const disarm = () => {
    window.clearInterval(timer);
    observer?.disconnect();
    observer = undefined;
    delete flow.dataset.armed;
    for (const part of parts) delete part.dataset.state;
  };

  const play = () => {
    played = true;
    let current = 1;
    flow.dataset.armed = '';
    show(current);
    timer = window.setInterval(
      () => {
        current += 1;
        show(current);
        if (current >= count) window.clearInterval(timer);
      },
      seconds('--dz-motion-duration-sweep') * 1000,
    );
  };

  const arm = (on: boolean) => {
    disarm();
    if (!on || played || count < 2) return;
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer?.disconnect();
        play();
      },
      { threshold: 0.45 },
    );
    observer.observe(flow);
  };

  arm(effectsOn());
  const stopWatching = onEffectsChange(arm);
  return () => {
    stopWatching();
    disarm();
  };
}
