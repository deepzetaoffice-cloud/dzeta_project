import { desktop, effectsOn, onEffectsChange, seconds } from '@/lib/fx/motion';

// The flagship Websites page's scene (custom-coded-websites.md; 13 §4.4). The two controls always
// work, since they are the page's: the compare handle and the terminal's buttons. The laptop's lid
// moves only while effects are on, on desktop; it rests open otherwise.
// - code-page-compare: the range input moves --dz-split; the first time the slider comes into view
//   (effects on), the split sweeps once to show it moves (about 1.2 s).
// - terminal-replay: Play clears the log and brings it back line by line, commands typing in; pause,
//   replay and "Next step" (to the next command). Nothing plays by itself.
// - macbook-scroll: GSAP loads on this page only; the lid opens 75° → 0° and the laptop scales up as
//   the hero scrolls away, and this site fades in on its screen.

type Stop = () => void;

function compare(): Stop {
  const box = document.querySelector<HTMLElement>('.dz-compare');
  const range = box?.querySelector<HTMLInputElement>('[data-compare-range]');
  if (!box || !range) return () => {};
  const set = (value: number) => box.style.setProperty('--dz-split', `${value}%`);
  const onInput = () => set(Number(range.value));
  range.addEventListener('input', onInput);
  set(Number(range.value));

  let frame = 0;
  let observer: IntersectionObserver | undefined;
  if (effectsOn()) {
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer?.disconnect();
        // The hint: 50 → 38 → 62 → 50 over about 1.2 s, unless the visitor has moved it already
        const start = performance.now();
        const length = seconds('--dz-motion-duration-sweep') * 1000 + seconds('--dz-motion-duration-exit') * 1000;
        const step = (now: number) => {
          if (range.value !== '50') return;
          const t = Math.min(1, (now - start) / length);
          set(50 + Math.sin(t * Math.PI * 2) * 12 * (1 - t * 0.3));
          if (t < 1) frame = requestAnimationFrame(step);
          else set(50);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    observer.observe(box);
  }
  return () => {
    cancelAnimationFrame(frame);
    observer?.disconnect();
    range.removeEventListener('input', onInput);
  };
}

function terminal(): Stop {
  const root = document.querySelector<HTMLElement>('[data-terminal]');
  if (!root) return () => {};
  const lines = [...root.querySelectorAll<HTMLElement>('[data-term-line]')];
  const view = root.querySelector<HTMLElement>('[data-term-window]');
  const controls = root.querySelector<HTMLElement>('[data-term-controls]');
  const track = root.querySelector<HTMLElement>('[data-term-progress-track]');
  const bar = root.querySelector<HTMLElement>('[data-term-progress]');
  const play = root.querySelector<HTMLButtonElement>('[data-term-play]');
  const label = root.querySelector<HTMLElement>('[data-term-play-label]');
  const replay = root.querySelector<HTMLButtonElement>('[data-term-replay]');
  const next = root.querySelector<HTMLButtonElement>('[data-term-step]');
  if (!controls || !play || !replay || !next || lines.length === 0) return () => {};
  controls.hidden = false;
  if (track) track.hidden = false;

  let shown = lines.length;
  let timer = 0;
  let playing = false;

  const render = () => {
    lines.forEach((line, index) => {
      line.toggleAttribute('data-hidden', index >= shown);
    });
    bar?.style.setProperty('--dz-term-progress', String(shown / lines.length));
  };
  const setPlaying = (on: boolean) => {
    playing = on;
    root.toggleAttribute('data-playing', on);
    if (label) label.textContent = (on ? play.dataset.labelPause : play.dataset.labelPlay) ?? '';
  };
  // A command types in; output lines follow quickly, as a terminal prints them
  const delay = (index: number) => (lines[index]?.dataset.kind === 'command' ? 700 : 140);
  const tick = () => {
    if (shown >= lines.length) {
      setPlaying(false);
      return;
    }
    const line = lines[shown];
    shown += 1;
    line?.toggleAttribute('data-typing', line.dataset.kind === 'command' && effectsOn());
    render();
    // Keep the newest line in the window, as a terminal does (the window only, never the page)
    if (view && line) view.scrollTop = Math.max(0, line.offsetTop + line.offsetHeight - view.clientHeight);
    timer = window.setTimeout(tick, delay(shown));
  };
  const pause = () => {
    window.clearTimeout(timer);
    setPlaying(false);
  };
  const start = () => {
    if (shown >= lines.length) shown = 0;
    if (shown === 0 && view) view.scrollTop = 0;
    setPlaying(true);
    render();
    timer = window.setTimeout(tick, 200);
  };

  const onPlay = () => (playing ? pause() : start());
  const onReplay = () => {
    pause();
    shown = 0;
    start();
  };
  // Next step: show everything up to the next command (or the end), then wait
  const onNext = () => {
    pause();
    if (shown >= lines.length) shown = 0;
    do {
      shown += 1;
    } while (shown < lines.length && lines[shown]?.dataset.kind !== 'command');
    render();
  };
  play.addEventListener('click', onPlay);
  replay.addEventListener('click', onReplay);
  next.addEventListener('click', onNext);
  render();

  return () => {
    pause();
    play.removeEventListener('click', onPlay);
    replay.removeEventListener('click', onReplay);
    next.removeEventListener('click', onNext);
    shown = lines.length;
    render();
    for (const line of lines) line.removeAttribute('data-typing');
    controls.hidden = true;
    if (track) track.hidden = true;
  };
}

async function macbook(): Promise<Stop> {
  const laptop = document.querySelector<HTMLElement>('[data-macbook]');
  const hero = laptop?.closest<HTMLElement>('.dz-flag-hero');
  const lid = laptop?.querySelector<HTMLElement>('.dz-laptop-lid');
  const screen = laptop?.querySelector<HTMLElement>('.dz-laptop-screen');
  if (!laptop || !hero || !lid || !screen) return () => {};
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);
  const context = gsap.context(() => {
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 35%', scrub: 0.6 },
      defaults: { ease: 'none' },
    });
    timeline
      .fromTo(lid, { rotateX: 75 }, { rotateX: 0 }, 0)
      .fromTo(laptop, { scale: 0.86 }, { scale: 1.04 }, 0)
      .fromTo(screen.children, { opacity: 0 }, { opacity: 1, stagger: 0.04 }, 0.15);
  });
  return () => context.revert();
}

export function start(): Stop {
  const stopCompare = compare();
  const stopTerminal = terminal();
  let stopMacbook: Stop | undefined;
  let generation = 0;
  const run = (on: boolean) => {
    generation += 1;
    stopMacbook?.();
    stopMacbook = undefined;
    if (!on || !desktop()) return;
    const mine = generation;
    void macbook().then((stop) => {
      if (mine === generation) stopMacbook = stop;
      else stop();
    });
  };
  run(effectsOn());
  const stopWatching = onEffectsChange(run);
  return () => {
    generation += 1;
    stopWatching();
    stopMacbook?.();
    stopTerminal();
    stopCompare();
  };
}
