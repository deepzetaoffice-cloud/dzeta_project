import { wirePause } from '@/lib/fx/home/interactions';
import { bezierPath, desktop, pointerFine, seconds } from '@/lib/fx/motion';

// Home's effects (docs/ai/13 §4.3), started only while effects are on (index.ts). GSAP loads here,
// on Home only, after the first paint (decision 0033: GSAP for the scroll stories). Each effect
// leaves the page in its final state when it stops.
// - hero-word-rotator: the six phrases, letters in with rotateX and blur (one span per letter, so
//   the slab is never the LCP element), the slab's colour and width
//   morphing, the pixel burst; paused by its button, on hover and focus, off-screen, in a hidden tab.
// - background-paths: the hero's lines part around a fine pointer and spring back (CSS eases them).
// - message-to-booking: the hero scene steps 01→04 as the visitor scrolls (pinned on desktop), and
//   the phone turns ±25° under a drag, springing back on release.
// - pixels-to-doors and door-tilt: the logo's pixels fly into the four doors the first time they show;
//   a fine pointer tilts a door up to 6°.
// - workflow-connect: the workflow draws node by node with the scroll (pinned on desktop).
// - industry-rail: on desktop the rail moves sideways as the page scrolls (pinned), the photos at
//   0.85× inside their cards; on phones it swipes natively.
// - exploded-layers: the proof's stack fans apart as it comes into view.

type Stop = () => void;

export async function startEffects(): Promise<Stop> {
  const [{ gsap }, { ScrollTrigger }, { CustomEase }, { MotionPathPlugin }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/CustomEase'),
    import('gsap/MotionPathPlugin'),
  ]);
  gsap.registerPlugin(ScrollTrigger, CustomEase, MotionPathPlugin);
  const ease = {
    out: CustomEase.create('dz-out', bezierPath('--dz-motion-ease-out')),
    inOut: CustomEase.create('dz-in-out', bezierPath('--dz-motion-ease-in-out')),
  };
  const time = {
    fast: seconds('--dz-motion-duration-fast'),
    base: seconds('--dz-motion-duration-base'),
    exit: seconds('--dz-motion-duration-exit'),
    story: seconds('--dz-motion-duration-story'),
    dwell: seconds('--dz-motion-duration-dwell'),
    stagger: seconds('--dz-motion-stagger-letter'),
  };
  const stops: Stop[] = [];
  const context = gsap.context(() => {
    stops.push(rotator(gsap, ease, time));
    stops.push(paths());
    stops.push(scene(gsap, ScrollTrigger));
    stops.push(doors(gsap, ScrollTrigger, ease, time));
    stops.push(flow(ScrollTrigger));
    stops.push(rail(gsap));
    stops.push(layers(ScrollTrigger));
  });
  return () => {
    for (const stop of stops) stop();
    context.revert();
  };
}

type Gsap = typeof import('gsap').gsap;
type Trigger = typeof import('gsap/ScrollTrigger').ScrollTrigger;
type Eases = { out: gsap.EaseFunction | string; inOut: gsap.EaseFunction | string };
type Times = Record<'fast' | 'base' | 'exit' | 'story' | 'dwell' | 'stagger', number>;

// The scrubber's and the lists' states for one step of a story
function setSteps(root: HTMLElement, attr: string, step: number) {
  for (const el of root.querySelectorAll<HTMLElement>(`[${attr}]`)) {
    const n = Number(el.getAttribute(attr));
    el.dataset.state = n < step ? 'done' : n === step ? 'active' : 'upcoming';
  }
}

// The phrase as one span per letter (the server renders the first one the same way), so no single
// big text block ever forms: the slab is never the page's LCP element
function letters(word: HTMLElement, phrase: string): HTMLElement[] {
  word.replaceChildren(
    ...[...phrase].map((letter) => {
      const span = document.createElement('span');
      span.className = 'dz-letter';
      span.textContent = letter;
      return span;
    }),
  );
  return [...word.children] as HTMLElement[];
}

function rotator(gsap: Gsap, ease: Eases, time: Times): Stop {
  const root = document.querySelector<HTMLElement>('.dz-rotator');
  const slab = root?.querySelector<HTMLElement>('.dz-slab');
  const word = slab?.querySelector<HTMLElement>('.dz-slab-word');
  const prev = root?.querySelector<HTMLElement>('.dz-rotator-prev');
  const pause = root?.querySelector<HTMLButtonElement>('.dz-rotator-pause');
  const count = root?.querySelector<HTMLElement>('.dz-rotator-count');
  const segments = [...(root?.querySelectorAll<HTMLElement>('.dz-rotator-progress > span') ?? [])];
  const burst = root?.querySelectorAll<HTMLElement>('.dz-burst > span');
  const phrases = root?.dataset.phrases?.split('|') ?? [];
  if (!root || !slab || !word || !prev || !pause || phrases.length < 2) return () => {};
  const total = String(phrases.length).padStart(2, '0');
  let index = 0;
  let timer = 0;
  let paused = false;
  let hovered = false;
  let visible = true;
  pause.hidden = false;

  const show = (next: number) => {
    const old = phrases[index] ?? '';
    index = next;
    const from = slab.offsetWidth;
    const tl = gsap.timeline();
    tl.to(word, { opacity: 0, yPercent: -30, filter: 'blur(0.5rem)', duration: time.exit, ease: ease.inOut });
    tl.add(() => {
      const chars = letters(word, phrases[index] ?? '');
      prev.textContent = old;
      slab.dataset.slab = String((index % 6) + 1);
      slab.style.inlineSize = 'auto';
      const to = slab.offsetWidth;
      slab.style.inlineSize = `${from}px`;
      gsap.to(slab, {
        inlineSize: to,
        duration: 0.42,
        ease: ease.out,
        onComplete: () => void (slab.style.inlineSize = ''),
      });
      gsap.set(word, { opacity: 1, yPercent: 0, filter: 'none' });
      gsap.from(chars, {
        rotateX: 70,
        opacity: 0,
        filter: 'blur(0.5rem)',
        duration: time.story,
        ease: ease.out,
        stagger: time.stagger,
        transformOrigin: '50% 100%',
        clearProps: 'all',
      });
      if (burst)
        gsap.fromTo(
          burst,
          { scale: 0.4, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.24, ease: ease.out, stagger: 0.04 },
        );
      segments.forEach((segment, i) => segment.toggleAttribute('data-active', i === index));
      if (count) count.textContent = `${String(index + 1).padStart(2, '0')} / ${total}`;
    });
  };

  const running = () => !paused && !hovered && visible && document.visibilityState === 'visible';
  const schedule = () => {
    window.clearTimeout(timer);
    if (running())
      timer = window.setTimeout(
        () => {
          show((index + 1) % phrases.length);
          schedule();
        },
        time.dwell * 1000 + time.story * 1000,
      );
  };

  const stopPause = wirePause(pause, root, (value) => {
    paused = value;
    schedule();
  });
  const enter = () => {
    hovered = true;
    schedule();
  };
  const leave = () => {
    hovered = false;
    schedule();
  };
  root.addEventListener('pointerenter', enter);
  root.addEventListener('pointerleave', leave);
  root.addEventListener('focusin', enter);
  root.addEventListener('focusout', leave);
  const observer = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting);
    schedule();
  });
  observer.observe(root);
  document.addEventListener('visibilitychange', schedule);
  schedule();

  return () => {
    window.clearTimeout(timer);
    stopPause();
    observer.disconnect();
    root.removeEventListener('pointerenter', enter);
    root.removeEventListener('pointerleave', leave);
    root.removeEventListener('focusin', enter);
    root.removeEventListener('focusout', leave);
    document.removeEventListener('visibilitychange', schedule);
    pause.hidden = true;
    // Back to the first phrase, the state the HTML holds
    index = 0;
    letters(word, phrases[0] ?? '');
    prev.textContent = phrases.at(-1) ?? '';
    slab.dataset.slab = '1';
    segments.forEach((segment, i) => segment.toggleAttribute('data-active', i === 0));
    if (count) count.textContent = `01 / ${total}`;
  };
}

// background-paths: each line moves away from the pointer, more the nearer it is (within 120 px)
function paths(): Stop {
  const svg = document.querySelector<SVGSVGElement>('.dz-hero-paths');
  const hero = svg?.closest<HTMLElement>('.dz-hero');
  if (!svg || !hero || !pointerFine()) return () => {};
  const lines = [...svg.querySelectorAll<SVGPathElement>('path')];
  const reach = 120;
  let frame = 0;
  const move = (event: PointerEvent) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const box = svg.getBoundingClientRect();
      const scale = 1200 / box.height;
      const y = (event.clientY - box.top) * scale;
      const x = (event.clientX - box.left) * (1408 / box.width);
      for (const line of lines) {
        const length = line.getTotalLength();
        const point = line.getPointAtLength((x / 1408) * length);
        const gap = point.y - y;
        const push = Math.abs(gap) < reach ? (reach - Math.abs(gap)) * 0.35 * Math.sign(gap || 1) : 0;
        line.style.translate = `0 ${push / scale}px`;
      }
    });
  };
  const reset = () => {
    for (const line of lines) line.style.translate = '';
  };
  hero.addEventListener('pointermove', move);
  hero.addEventListener('pointerleave', reset);
  return () => {
    cancelAnimationFrame(frame);
    hero.removeEventListener('pointermove', move);
    hero.removeEventListener('pointerleave', reset);
    reset();
  };
}

// message-to-booking: the scroll steps the story; the drag turns the phone
function scene(gsap: Gsap, ScrollTriggerPlugin: Trigger): Stop {
  const figure = document.querySelector<HTMLElement>('.dz-scene');
  const stage = figure?.querySelector<HTMLElement>('[data-scene-drag]');
  const phone = stage?.querySelector<HTMLElement>('.dz-phone');
  if (!figure || !stage || !phone) return () => {};
  const steps = 4;
  const set = (step: number) => {
    figure.dataset.step = String(step);
    setSteps(figure, 'data-scrub-step', step);
  };
  figure.setAttribute('data-scene-armed', '');
  set(1);
  const trigger = ScrollTriggerPlugin.create({
    trigger: figure,
    start: desktop() ? 'top top+=96' : 'top 70%',
    end: desktop() ? '+=150%' : 'bottom 30%',
    pin: desktop(),
    onUpdate: (self) => set(Math.min(steps, Math.floor(self.progress * steps) + 1)),
  });
  const jump = (event: Event) => {
    const button = (event.target as Element).closest<HTMLElement>('[data-scrub-step]');
    if (!button) return;
    const step = Number(button.dataset.scrubStep);
    const target = trigger.start + ((step - 0.5) / steps) * (trigger.end - trigger.start);
    window.scrollTo({ top: target, behavior: 'smooth' });
    set(step);
  };
  figure.addEventListener('click', jump);

  // The drag: ±25° around Y, a little around X, a spring back on release
  let startX = 0;
  let startY = 0;
  let dragging = false;
  const turn = { y: 0, x: 0 };
  const apply = () => {
    phone.style.setProperty('--dz-phone-turn', `${turn.y}deg`);
    phone.style.setProperty('--dz-phone-tilt', `${turn.x}deg`);
  };
  const down = (event: PointerEvent) => {
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    gsap.killTweensOf(turn);
    stage.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: PointerEvent) => {
    if (!dragging) return;
    turn.y = Math.max(-25, Math.min(25, (event.clientX - startX) * 0.25));
    turn.x = Math.max(-10, Math.min(10, -(event.clientY - startY) * 0.1));
    apply();
  };
  const up = () => {
    if (!dragging) return;
    dragging = false;
    gsap.to(turn, { y: 0, x: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)', onUpdate: apply });
  };
  stage.addEventListener('pointerdown', down);
  stage.addEventListener('pointermove', moveDrag);
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointercancel', up);
  return () => {
    trigger.kill();
    figure.removeEventListener('click', jump);
    stage.removeEventListener('pointerdown', down);
    stage.removeEventListener('pointermove', moveDrag);
    stage.removeEventListener('pointerup', up);
    stage.removeEventListener('pointercancel', up);
    figure.removeAttribute('data-scene-armed');
    figure.dataset.step = String(steps);
    for (const el of figure.querySelectorAll<HTMLElement>('[data-scrub-step]')) delete el.dataset.state;
    turn.x = 0;
    turn.y = 0;
    apply();
  };
}

// pixels-to-doors and door-tilt
function doors(gsap: Gsap, ScrollTriggerPlugin: Trigger, ease: Eases, time: Times): Stop {
  const list = document.querySelector<HTMLElement>('[data-fx-doors]');
  const pixels = document.querySelector<HTMLElement>('[data-doors-pixels]');
  if (!list) return () => {};
  const cards = [...list.querySelectorAll<HTMLElement>('.dz-door')];
  const stops: Stop[] = [];
  const box = list.getBoundingClientRect();
  // The flight plays only for doors still below the fold, so nothing a visitor already sees hides
  if (desktop() && pixels && box.top > innerHeight) {
    const marks = [...pixels.children] as HTMLElement[];
    gsap.set(cards, { opacity: 0, scale: 0.95 });
    const trigger = ScrollTriggerPlugin.create({
      trigger: list,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        marks.forEach((mark, i) => {
          const card = cards[i];
          if (!card) return;
          const from = mark.getBoundingClientRect();
          const to = card.getBoundingClientRect();
          const dx = to.left + 24 - from.left;
          const dy = to.top + 24 - from.top;
          gsap.to(mark, {
            motionPath: {
              path: [
                { x: dx * 0.3, y: dy * 0.2 - 80 },
                { x: dx, y: dy },
              ],
              curviness: 1.2,
            },
            duration: 0.6,
            ease: ease.inOut,
            delay: i * 0.08,
            onComplete: () => void gsap.to(mark, { opacity: 0, duration: time.fast }),
          });
          gsap.to(card, { opacity: 1, scale: 1, duration: time.story, ease: ease.out, delay: 0.45 + i * 0.08 });
        });
      },
    });
    stops.push(() => {
      trigger.kill();
      gsap.set([...cards, ...marks], { clearProps: 'all' });
    });
  }
  if (pointerFine()) {
    for (const card of cards) {
      const move = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--dz-tilt-y', `${px * 12}deg`);
        card.style.setProperty('--dz-tilt-x', `${-py * 12}deg`);
      };
      const leave = () => {
        card.style.removeProperty('--dz-tilt-y');
        card.style.removeProperty('--dz-tilt-x');
      };
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', leave);
      stops.push(() => {
        card.removeEventListener('pointermove', move);
        card.removeEventListener('pointerleave', leave);
        leave();
      });
    }
  }
  return () => {
    for (const stop of stops) stop();
  };
}

// workflow-connect: the list, the nodes, the connectors and the scrubber follow one step
function flow(ScrollTriggerPlugin: Trigger): Stop {
  const root = document.querySelector<HTMLElement>('[data-fx-flow]');
  if (!root) return () => {};
  const steps = root.querySelectorAll('[data-flow-step]').length;
  const set = (step: number) => {
    root.dataset.step = String(step);
    setSteps(root, 'data-flow-step', step);
    setSteps(root, 'data-flow-node', step);
    setSteps(root, 'data-scrub-step', step);
    for (const link of root.querySelectorAll<HTMLElement>('[data-flow-link]')) {
      link.dataset.state = Number(link.dataset.flowLink) <= step ? 'done' : 'upcoming';
    }
  };
  root.setAttribute('data-armed', '');
  set(1);
  const pin = desktop();
  const trigger = ScrollTriggerPlugin.create({
    trigger: root,
    start: pin ? 'top top+=96' : 'top 70%',
    end: pin ? '+=200%' : 'bottom 40%',
    pin,
    onUpdate: (self) => set(Math.min(steps, Math.floor(self.progress * steps) + 1)),
  });
  const jump = (event: Event) => {
    const button = (event.target as Element).closest<HTMLElement>('[data-scrub-step]');
    if (!button) return;
    const step = Number(button.dataset.scrubStep);
    window.scrollTo({
      top: trigger.start + ((step - 0.5) / steps) * (trigger.end - trigger.start),
      behavior: 'smooth',
    });
    set(step);
  };
  root.addEventListener('click', jump);
  return () => {
    trigger.kill();
    root.removeEventListener('click', jump);
    root.removeAttribute('data-armed');
    for (const el of root.querySelectorAll<HTMLElement>('[data-state]')) delete el.dataset.state;
    root.dataset.step = String(steps);
  };
}

// industry-rail: pinned and scroll-driven on desktop, with the photos' depth parallax
function rail(gsap: Gsap): Stop {
  const section = document.querySelector<HTMLElement>('[data-fx-rail]');
  const viewport = section?.querySelector<HTMLElement>('[data-rail-viewport]');
  const track = section?.querySelector<HTMLElement>('[data-rail]');
  if (!section || !viewport || !track) return () => {};
  const photos = [...track.querySelectorAll<HTMLElement>('[data-parallax]')];
  const parallax = () => {
    const centre = innerWidth / 2;
    for (const photo of photos) {
      const rect = photo.getBoundingClientRect();
      gsap.set(photo, { x: (rect.left + rect.width / 2 - centre) * -0.15 });
    }
  };
  if (!desktop()) {
    viewport.addEventListener('scroll', parallax, { passive: true });
    parallax();
    return () => {
      viewport.removeEventListener('scroll', parallax);
      gsap.set(photos, { clearProps: 'all' });
    };
  }
  const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
  viewport.style.overflow = 'hidden';
  const tween = gsap.to(track, {
    x: () => -distance() * (document.dir === 'rtl' ? -1 : 1),
    ease: 'none',
    scrollTrigger: {
      // The rail's foot meets the window's foot, so the whole cards show while it moves
      trigger: viewport,
      start: 'bottom bottom-=16',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: parallax,
    },
  });
  const trigger = tween.scrollTrigger;
  const stepTo = (direction: number) => {
    if (!trigger) return;
    const card = track.querySelector<HTMLElement>('.dz-industry');
    const stepPx = (card?.offsetWidth ?? 400) + 24;
    window.scrollTo({
      top: Math.max(trigger.start, Math.min(trigger.end, scrollY + direction * stepPx)),
      behavior: 'smooth',
    });
  };
  const prev = section.querySelector<HTMLElement>('[data-rail-prev]');
  const next = section.querySelector<HTMLElement>('[data-rail-next]');
  const onPrev = () => stepTo(-1);
  const onNext = () => stepTo(1);
  prev?.addEventListener('click', onPrev);
  next?.addEventListener('click', onNext);
  // A keyboard visitor tabbing to a card off to the side scrolls the page to it
  const focus = (event: FocusEvent) => {
    const card = (event.target as Element).closest<HTMLElement>('.dz-industry');
    if (!card || !trigger) return;
    const index = [...track.children].indexOf(card);
    const share = index / Math.max(1, track.children.length - 1);
    window.scrollTo({ top: trigger.start + share * (trigger.end - trigger.start) });
  };
  track.addEventListener('focusin', focus);
  return () => {
    prev?.removeEventListener('click', onPrev);
    next?.removeEventListener('click', onNext);
    track.removeEventListener('focusin', focus);
    tween.scrollTrigger?.kill();
    tween.kill();
    viewport.style.overflow = '';
    gsap.set([track, ...photos], { clearProps: 'all' });
  };
}

// exploded-layers: the stack closes up below the fold, then fans apart when it comes into view
function layers(ScrollTriggerPlugin: Trigger): Stop {
  const section = document.querySelector<HTMLElement>('[data-fx-proof]');
  const stack = section?.querySelector<HTMLElement>('[data-layers]');
  if (!section || !stack || stack.getBoundingClientRect().top < innerHeight) return () => {};
  section.setAttribute('data-armed', '');
  const trigger = ScrollTriggerPlugin.create({
    trigger: stack,
    start: 'top 70%',
    once: true,
    onEnter: () => section.setAttribute('data-exploded', ''),
  });
  return () => {
    trigger.kill();
    section.removeAttribute('data-armed');
    section.removeAttribute('data-exploded');
  };
}
