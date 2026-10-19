import { effectsOn, onEffectsChange, pointerFine } from '@/lib/fx/motion';

// shape-throw (not-found.md; 13 §4.4): the 404's pillar marks and page chips can be dragged and
// thrown. A release faster than 0.11 px/ms throws the shape, which glides with friction and bounces
// off the stage's edges; a slower release just drops it. A chip that was dragged doesn't follow its
// link on that release; a plain click (or Enter) does. Only with effects on and a fine pointer, so
// touch scrolls the page as usual. The shapes move by `translate` alone (13 §3 rule 1).

type Body = { el: HTMLElement; x: number; y: number; vx: number; vy: number };

const THROW = 0.11;
const FRICTION = 0.94;

function physics(stage: HTMLElement): () => void {
  const bodies: Body[] = [...stage.querySelectorAll<HTMLElement>('[data-shape]')].map((el) => ({
    el,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
  }));
  const hint = stage.querySelector<HTMLElement>('[data-shapes-hint]');
  if (hint) hint.hidden = false;
  let frame = 0;
  let held: { body: Body; startX: number; startY: number; lastX: number; lastY: number; lastT: number } | undefined;
  let dragged = false;

  const place = (body: Body) => {
    body.el.style.translate = `${body.x}px ${body.y}px`;
  };

  // Keep a shape inside the stage: bounce its speed back where it would leave
  const contain = (body: Body) => {
    const room = stage.getBoundingClientRect();
    const box = body.el.getBoundingClientRect();
    if (box.left < room.left) {
      body.x += room.left - box.left;
      body.vx = Math.abs(body.vx) * 0.6;
    } else if (box.right > room.right) {
      body.x -= box.right - room.right;
      body.vx = -Math.abs(body.vx) * 0.6;
    }
    if (box.top < room.top) {
      body.y += room.top - box.top;
      body.vy = Math.abs(body.vy) * 0.6;
    } else if (box.bottom > room.bottom) {
      body.y -= box.bottom - room.bottom;
      body.vy = -Math.abs(body.vy) * 0.6;
    }
  };

  const tick = () => {
    let moving = false;
    for (const body of bodies) {
      if (held?.body === body || (Math.abs(body.vx) < 0.01 && Math.abs(body.vy) < 0.01)) continue;
      body.x += body.vx * 16;
      body.y += body.vy * 16;
      body.vx *= FRICTION;
      body.vy *= FRICTION;
      place(body);
      contain(body);
      place(body);
      moving = true;
    }
    frame = moving ? requestAnimationFrame(tick) : 0;
  };

  const down = (event: PointerEvent) => {
    const el = (event.target as Element | null)?.closest<HTMLElement>('[data-shape]');
    const body = bodies.find((entry) => entry.el === el);
    if (!body || event.button !== 0) return;
    body.vx = 0;
    body.vy = 0;
    dragged = false;
    held = {
      body,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      lastT: event.timeStamp,
    };
    body.el.setPointerCapture(event.pointerId);
    body.el.dataset.held = '';
  };
  const move = (event: PointerEvent) => {
    if (!held) return;
    const dt = Math.max(1, event.timeStamp - held.lastT);
    const dx = event.clientX - held.lastX;
    const dy = event.clientY - held.lastY;
    held.body.vx = dx / dt;
    held.body.vy = dy / dt;
    held.body.x += dx;
    held.body.y += dy;
    held.lastX = event.clientX;
    held.lastY = event.clientY;
    held.lastT = event.timeStamp;
    if (Math.hypot(event.clientX - held.startX, event.clientY - held.startY) > 4) dragged = true;
    place(held.body);
  };
  const up = (event: PointerEvent) => {
    if (!held) return;
    const { body } = held;
    delete body.el.dataset.held;
    if (body.el.hasPointerCapture(event.pointerId)) body.el.releasePointerCapture(event.pointerId);
    // A slow release drops the shape where it is
    if (Math.hypot(body.vx, body.vy) < THROW || event.timeStamp - held.lastT > 80) {
      body.vx = 0;
      body.vy = 0;
    }
    held = undefined;
    contain(body);
    place(body);
    if (!frame) frame = requestAnimationFrame(tick);
  };
  // A drag isn't a click: the chip's link waits for a plain one
  const click = (event: MouseEvent) => {
    if (!dragged) return;
    event.preventDefault();
    dragged = false;
  };
  // Shapes never start the browser's own drag (an image or a link's ghost)
  const dragStart = (event: DragEvent) => event.preventDefault();

  stage.addEventListener('pointerdown', down);
  stage.addEventListener('pointermove', move);
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointercancel', up);
  stage.addEventListener('click', click, true);
  stage.addEventListener('dragstart', dragStart);
  stage.dataset.armed = '';
  return () => {
    cancelAnimationFrame(frame);
    stage.removeEventListener('pointerdown', down);
    stage.removeEventListener('pointermove', move);
    stage.removeEventListener('pointerup', up);
    stage.removeEventListener('pointercancel', up);
    stage.removeEventListener('click', click, true);
    stage.removeEventListener('dragstart', dragStart);
    delete stage.dataset.armed;
    if (hint) hint.hidden = true;
    for (const body of bodies) {
      body.el.style.translate = '';
      delete body.el.dataset.held;
    }
  };
}

export function start(): () => void {
  const stage = document.querySelector<HTMLElement>('.dz-lost');
  if (!stage) return () => {};
  let stop: (() => void) | undefined;
  const run = (on: boolean) => {
    stop?.();
    stop = on && pointerFine() ? physics(stage) : undefined;
  };
  run(effectsOn());
  const stopWatching = onEffectsChange(run);
  return () => {
    stopWatching();
    stop?.();
  };
}
