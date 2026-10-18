import { effectsOn, onEffectsChange, pointerFine } from '@/lib/fx/motion';

// dot-field (13 §4; services-hub.md §01): the services hub's stage brightens the dots near the
// pointer. Only for a fine pointer with effects on; the dots are still otherwise, and the pillar chips
// light their pillar's dots by CSS alone (services.css). One pointer read per frame, no layout reads
// beyond the stage's box.

export function start(): () => void {
  const stage = document.querySelector<HTMLElement>('.dz-hub-hero');
  if (!stage) return () => {};
  let frame = 0;
  let detach: (() => void) | undefined;

  const attach = () => {
    detach?.();
    detach = undefined;
    delete stage.dataset.spot;
    if (!effectsOn() || !pointerFine()) return;
    const move = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const box = stage.getBoundingClientRect();
        stage.style.setProperty('--dz-spot-x', `${((event.clientX - box.left) / box.width) * 100}%`);
        stage.style.setProperty('--dz-spot-y', `${((event.clientY - box.top) / box.height) * 100}%`);
        stage.dataset.spot = '';
      });
    };
    const leave = () => delete stage.dataset.spot;
    stage.addEventListener('pointermove', move, { passive: true });
    stage.addEventListener('pointerleave', leave);
    detach = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerleave', leave);
    };
  };

  attach();
  const stopWatching = onEffectsChange(attach);
  return () => {
    stopWatching();
    detach?.();
    delete stage.dataset.spot;
  };
}
