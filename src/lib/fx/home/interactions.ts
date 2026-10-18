import { effectsOn, pointerFine } from '@/lib/fx/motion';

// Home's controls (docs/design/home.md), which work with or without effects:
// - the AI input: the chips fill it; sending opens WhatsApp with the visitor's text. The CSP lets
//   forms post only to this site, so a link is made and clicked, which also records contact_click.
// - the problem rows: one open at a time, the first on load; a pointer's hover or a tap opens a row.
// - the marquee's pause button, the industry flips, the ROI calculator, the AI view and the stamp of
//   this visit's real LCP (lcp-stamp, never a promised score, 10 §3.7).

type Stop = () => void;

const NUMBER = new Intl.NumberFormat('en-AE', { maximumFractionDigits: 0 });

function on<K extends keyof HTMLElementEventMap>(
  target: HTMLElement | Document,
  type: K,
  listener: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): Stop {
  target.addEventListener(type, listener as EventListener, options);
  return () => target.removeEventListener(type, listener as EventListener, options);
}

function agent(): Stop[] {
  const form = document.querySelector<HTMLFormElement>('[data-fx-agent]');
  const input = form?.querySelector<HTMLInputElement>('input[name="text"]');
  const base = form?.dataset.wa;
  if (!form || !input || !base) return [];
  return [
    on(form, 'click', (event) => {
      const chip = (event.target as Element).closest<HTMLElement>('[data-agent-chip]');
      if (!chip) return;
      input.value = chip.dataset.agentChip ?? '';
      input.focus();
    }),
    on(form, 'submit', (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) {
        input.focus();
        return;
      }
      const link = document.createElement('a');
      link.href = `${base}?text=${encodeURIComponent(text)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.hidden = true;
      form.append(link);
      link.click();
      link.remove();
    }),
  ];
}

function problems(): Stop[] {
  const list = document.querySelector<HTMLElement>('[data-fx-problems]');
  if (!list) return [];
  const rows = [...list.querySelectorAll<HTMLElement>('.dz-problem')];
  const open = (row: HTMLElement) => {
    for (const each of rows) {
      const isIt = each === row;
      each.toggleAttribute('data-open', isIt);
      each.querySelector('.dz-problem-toggle')?.setAttribute('aria-expanded', String(isIt));
    }
  };
  if (rows[0]) open(rows[0]);
  const stops = [
    on(list, 'click', (event) => {
      const row = (event.target as Element).closest<HTMLElement>('.dz-problem');
      if (row) open(row);
    }),
  ];
  if (pointerFine()) {
    for (const row of rows) stops.push(on(row, 'pointerenter', () => open(row)));
  }
  return stops;
}

// A pause button for an autoplaying loop: aria-pressed, its label, and data-paused on its region
export function wirePause(button: HTMLButtonElement, region: HTMLElement, onChange?: (paused: boolean) => void): Stop {
  return on(button, 'click', () => {
    const paused = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', (paused ? button.dataset.labelPlay : button.dataset.labelPause) ?? '');
    region.toggleAttribute('data-paused', paused);
    onChange?.(paused);
  });
}

function marquee(): Stop[] {
  const region = document.querySelector<HTMLElement>('.dz-marquee');
  const button = region?.querySelector<HTMLButtonElement>('.dz-marquee-pause');
  return region && button ? [wirePause(button, region)] : [];
}

function flips(): Stop[] {
  return [...document.querySelectorAll<HTMLButtonElement>('.dz-industry-flip')].map((button) =>
    on(button, 'click', () => {
      const card = button.closest<HTMLElement>('.dz-industry');
      if (!card) return;
      const flipped = card.dataset.flipped !== 'true';
      card.dataset.flipped = String(flipped);
      button.setAttribute('aria-pressed', String(flipped));
      const label = button.querySelector('.dz-industry-flip-label');
      if (label) label.textContent = (flipped ? button.dataset.labelBack : button.dataset.labelFront) ?? '';
    }),
  );
}

// roi-count-up: the result counts to its new value (400 ms, ease-out) while effects are on
function roi(): Stop[] {
  const form = document.querySelector<HTMLFormElement>('[data-fx-roi]');
  if (!form) return [];
  const hours = form.querySelector<HTMLInputElement>('[data-roi-in="hours"]');
  const rate = form.querySelector<HTMLInputElement>('[data-roi-in="rate"]');
  const total = form.querySelector<HTMLElement>('[data-roi-total]');
  const sum = form.querySelector<HTMLElement>('[data-roi-sum]');
  if (!hours || !rate || !total || !sum) return [];
  const weeks = Number(form.dataset.weeks ?? 0);
  const currency = form.dataset.currency ?? '';
  const unit = form.dataset.unit ?? '';
  const weeksUnit = sum.textContent?.trim().split(' ').at(-1) ?? '';
  let shown = Number(hours.value) * Number(rate.value) * weeks;
  let frame = 0;
  const fill = (input: HTMLInputElement) => {
    const share = (Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min));
    input.style.setProperty('--dz-range-fill', `${share * 100}%`);
  };
  const update = () => {
    const h = Number(hours.value);
    const r = Number(rate.value);
    const target = h * r * weeks;
    form.querySelector('[data-roi-out="hours"]')!.textContent = `${h} ${unit}`;
    form.querySelector('[data-roi-out="rate"]')!.textContent = `${currency} ${r}`;
    sum.textContent = `${h} ${unit} × ${currency} ${r} × ${weeks} ${weeksUnit}`;
    fill(hours);
    fill(rate);
    cancelAnimationFrame(frame);
    if (!effectsOn()) {
      shown = target;
      total.textContent = `${currency} ${NUMBER.format(target)}`;
      return;
    }
    const from = shown;
    const startAt = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - startAt) / 400);
      const eased = 1 - (1 - t) ** 3;
      shown = from + (target - from) * eased;
      total.textContent = `${currency} ${NUMBER.format(Math.round(shown))}`;
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  };
  fill(hours);
  fill(rate);
  return [
    on(form, 'input', update),
    on(form, 'submit', (event) => event.preventDefault()),
    () => cancelAnimationFrame(frame),
  ];
}

// The AI view toggle (exploded-layers' second state): a switch; instant under Reduce effects
function aiView(): Stop[] {
  const section = document.querySelector<HTMLElement>('[data-fx-proof]');
  const toggle = section?.querySelector<HTMLButtonElement>('[data-ai-toggle]');
  if (!section || !toggle) return [];
  return [
    on(toggle, 'click', () => {
      const next = toggle.getAttribute('aria-checked') !== 'true';
      toggle.setAttribute('aria-checked', String(next));
      section.toggleAttribute('data-ai-view', next);
    }),
  ];
}

// lcp-stamp: this visit's real Largest Contentful Paint, in seconds, once the page has settled
function stamp(): Stop[] {
  const value = document.querySelector<HTMLElement>('[data-lcp-value]');
  const note = document.querySelector<HTMLElement>('[data-lcp-note]');
  if (!value || !note || !('PerformanceObserver' in window)) return [];
  let latest = 0;
  let observer: PerformanceObserver | undefined;
  try {
    observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      latest = entries.at(-1)?.startTime ?? latest;
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {
    return [];
  }
  const show = () => {
    observer?.disconnect();
    if (!latest) return;
    const target = latest / 1000;
    note.textContent = note.dataset.lcpNote ?? '';
    if (!effectsOn()) {
      value.textContent = `${target.toFixed(2)} s`;
      return;
    }
    const startAt = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - startAt) / 600);
      value.textContent = `${(target * (1 - (1 - t) ** 3)).toFixed(2)} s`;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  // LCP is final at the first input or scroll; the stamp shows it then, or after a short settle
  const timer = window.setTimeout(show, 2500);
  const early = () => {
    window.clearTimeout(timer);
    show();
  };
  addEventListener('pointerdown', early, { once: true });
  addEventListener('keydown', early, { once: true });
  return [
    () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      removeEventListener('pointerdown', early);
      removeEventListener('keydown', early);
    },
  ];
}

export function startInteractions(): Stop {
  const stops = [...agent(), ...problems(), ...marquee(), ...flips(), ...roi(), ...aiView(), ...stamp()];
  return () => {
    for (const stop of stops) stop();
  };
}
