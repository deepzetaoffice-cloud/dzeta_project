'use client';

// The story controls (13 §4.8 and §7: "Story controls (shared) ≤ 2 KB"; the plan
// docs/plans/2026-10-10-flagship-websites-page.md). A client island on the routes that use it, never
// in Home's first load. Both parts render hidden and appear once they run, so without JavaScript the
// server-rendered story stays in its full, static state (13 §3.3).
// - RevealSlider: the Code ↔ Page frame's native range input (arrow keys built in) writes one
//   custom property; the template stylesheet clips the code layer with it.
// - TerminalControls: replays the terminal line by line once it scrolls into view, pauses it when it
//   scrolls away, and offers Play / Pause / Replay / Step (WCAG 2.2.2). Under reduced motion or
//   Reduce effects it never plays: the full run stays shown.
import { useEffect, useRef, useState } from 'react';

const reveal = (input: HTMLInputElement) =>
  input.closest<HTMLElement>('[data-codepage]')?.style.setProperty('--dz-reveal', `${input.value}%`);

export function RevealSlider({ label }: { label: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const figure = input.current?.closest<HTMLElement>('[data-codepage]');
    if (!input.current || !figure) return;
    figure.dataset.enhanced = '';
    reveal(input.current);
    setReady(true);
  }, []);
  return (
    <input
      ref={input}
      type="range"
      min={0}
      max={100}
      defaultValue={50}
      aria-label={label}
      className="dz-codepage-range"
      hidden={!ready}
      onInput={(event) => reveal(event.currentTarget)}
    />
  );
}

type State = 'off' | 'idle' | 'playing' | 'paused' | 'done';
type Labels = { play: string; pause: string; replay: string; step: string; group: string };

// The replay itself: data-on marks a shown line; a command waits longer than its output
function terminalEngine(terminal: HTMLElement, onState: (state: State) => void) {
  const lines = [...terminal.querySelectorAll('[data-term-line]')];
  let shown = 0;
  let timer = 0;
  let started = false;
  let userPaused = false;
  const show = (count: number) => {
    shown = Math.min(count, lines.length);
    lines.forEach((line, index) => line.toggleAttribute('data-on', index < shown));
  };
  const tick = () => {
    show(shown + 1);
    if (shown >= lines.length) return onState('done');
    timer = window.setTimeout(tick, lines[shown]?.classList.contains('dz-term-line--command') ? 650 : 220);
  };
  const play = () => {
    window.clearTimeout(timer);
    if (shown >= lines.length) show(0);
    userPaused = false;
    onState('playing');
    tick();
  };
  const pause = (byUser: boolean) => {
    window.clearTimeout(timer);
    userPaused ||= byUser;
    if (shown < lines.length) onState(started ? 'paused' : 'idle');
  };
  return {
    play,
    pause,
    step: () => {
      pause(true);
      show(shown + 1);
      onState(shown >= lines.length ? 'done' : 'paused');
    },
    replay: () => {
      show(0);
      play();
    },
    // Plays once when it scrolls into view; pauses when it leaves mid-play, and resumes on return
    // unless the visitor paused it (13 §4.8)
    visible: (isVisible: boolean) => {
      if (!isVisible) return pause(false);
      if (!started) started = true;
      else if (userPaused || shown >= lines.length) return;
      play();
    },
    start: () => {
      terminal.dataset.playable = '';
      show(0);
    },
    stop: () => window.clearTimeout(timer),
  };
}

export function TerminalControls({ labels }: { labels: Labels }) {
  const group = useRef<HTMLDivElement>(null);
  const engine = useRef<ReturnType<typeof terminalEngine>>(null);
  const [state, setState] = useState<State>('off');

  useEffect(() => {
    const terminal = group.current?.closest<HTMLElement>('[data-terminal]');
    const reduced =
      matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.effects === 'reduced';
    if (!terminal || reduced) return;
    const current = terminalEngine(terminal, setState);
    engine.current = current;
    current.start();
    setState('idle');
    const observer = new IntersectionObserver(([entry]) => current.visible(Boolean(entry?.isIntersecting)), {
      threshold: 0.4,
    });
    observer.observe(terminal);
    return () => {
      observer.disconnect();
      current.stop();
    };
  }, []);

  const playing = state === 'playing';
  return (
    <div ref={group} role="group" aria-label={labels.group} className="dz-term-controls" hidden={state === 'off'}>
      <button type="button" onClick={() => (playing ? engine.current?.pause(true) : engine.current?.play())}>
        {playing ? labels.pause : labels.play}
      </button>
      <button type="button" disabled={state === 'done'} onClick={() => engine.current?.step()}>
        {labels.step}
      </button>
      <button type="button" onClick={() => engine.current?.replay()}>
        {labels.replay}
      </button>
    </div>
  );
}
