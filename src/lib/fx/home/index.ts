import { startEffects } from '@/lib/fx/home/effects';
import { startInteractions } from '@/lib/fx/home/interactions';
import { effectsOn, onEffectsChange } from '@/lib/fx/motion';

// Home's scene (docs/design/home.md; 13 §4.3). The interactions always run, since they are the page's
// controls (the AI input, the problem rows, the flips, the calculator, the AI view and the stamp).
// The effects (the rotator, the paths, the scroll stories, the tilt) run only while effects are on,
// and stop at once when Reduce effects or a device setting turns them off; every part then rests in
// its final, complete state.

export function start(): () => void {
  const stopInteractions = startInteractions();
  let stopEffects: (() => void) | undefined;
  // Each start gets a number, so an effects module that finishes loading after a newer change (or
  // after the page has gone) stops itself instead of running on.
  let generation = 0;
  const run = (on: boolean) => {
    generation += 1;
    stopEffects?.();
    stopEffects = undefined;
    if (!on) return;
    const mine = generation;
    void startEffects().then((stop) => {
      if (mine === generation) stopEffects = stop;
      else stop();
    });
  };
  run(effectsOn());
  const stopWatching = onEffectsChange(run);
  return () => {
    generation += 1;
    stopWatching();
    stopEffects?.();
    stopInteractions();
  };
}
