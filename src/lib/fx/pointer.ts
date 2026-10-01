// The shared pointer controller (docs/ai/13 §4.2; P2 plan, G): pointer-magnet and the hover-charge
// bead. It works for a mouse or pen on a device whose pointer is fine and can hover, only while
// effects are on, and only while the pointer is over a target (data-fx-pointer), so nothing listens to
// pointermove anywhere else. The target's rect is read on entry and again after a scroll or resize,
// never per move. Once per frame it writes where the pointer is: --dz-fx-x and --dz-fx-y from -1 to 1
// across the target (pointer-magnet), and --dz-fx-px, its distance from the centre in px (the
// hover-charge bead). CSS turns them into movement (effects.css). Leaving clears them, and the CSS
// eases back. INP: pointermove isn't counted, but this keeps the work there to three property writes.

const FINE = '(hover: hover) and (pointer: fine)';

let target: HTMLElement | null = null;
let rect: DOMRect | null = null;
let frame = 0;
let x = 0;
let y = 0;

const unit = (value: number, start: number, size: number) =>
  Math.min(Math.max(((value - start) / size) * 2 - 1, -1), 1);

function paint() {
  frame = 0;
  if (!target) return;
  rect ??= target.getBoundingClientRect();
  target.style.setProperty('--dz-fx-x', unit(x, rect.x, rect.width).toFixed(3));
  target.style.setProperty('--dz-fx-y', unit(y, rect.y, rect.height).toFixed(3));
  target.style.setProperty('--dz-fx-px', `${(x - rect.x - rect.width / 2).toFixed(1)}px`);
}

function onMove(event: PointerEvent) {
  x = event.clientX;
  y = event.clientY;
  frame ||= requestAnimationFrame(paint);
}

function forgetRect() {
  rect = null;
}

function leave() {
  if (!target) return;
  cancelAnimationFrame(frame);
  frame = 0;
  target.removeEventListener('pointermove', onMove);
  target.removeEventListener('pointerleave', leave);
  document.removeEventListener('scroll', forgetRect, true);
  removeEventListener('resize', forgetRect);
  target.style.removeProperty('--dz-fx-x');
  target.style.removeProperty('--dz-fx-y');
  target.style.removeProperty('--dz-fx-px');
  target = null;
}

function onOver(event: PointerEvent) {
  if (target || event.pointerType === 'touch') return;
  // data-effects is on <html> whenever anything turns effects off (preferences.ts).
  if (document.documentElement.hasAttribute('data-effects') || !matchMedia(FINE).matches) return;
  const found = (event.target as Element).closest<HTMLElement>('[data-fx-pointer]');
  if (!found) return;
  target = found;
  rect = null;
  found.addEventListener('pointermove', onMove);
  found.addEventListener('pointerleave', leave);
  // Capture: a scroll inside the sheet or any other container moves the target too.
  document.addEventListener('scroll', forgetRect, { capture: true, passive: true });
  addEventListener('resize', forgetRect, { passive: true });
  onMove(event);
}

let started = false;

export function startPointer() {
  if (started) return;
  started = true;
  document.addEventListener('pointerover', onOver);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) leave();
  });
}
