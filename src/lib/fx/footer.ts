// The footer's two effects (docs/design/footer.md; 13 §4.1). globals.css draws both and keeps them
// still under Reduce effects; this only starts and steers them.
// - beams: they fall only while the audit panel is in view (data-inview); a hidden tab stops them anyway.
// - wordmark-spotlight: with a fine pointer that can hover, the logo gradient follows the cursor over
//   the giant wordmark (--dz-spot-x / --dz-spot-y, eased in CSS); data-lit while the pointer is over it.

const POINTER = '(hover: hover) and (pointer: fine)';

let started = false;

export function startFooterFx() {
  if (started) return;
  started = true;

  const beams = document.querySelector<HTMLElement>('[data-fx-beams]');
  if (beams && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) =>
      beams.toggleAttribute(
        'data-inview',
        entries.some((entry) => entry.isIntersecting),
      ),
    ).observe(beams);
  }

  const wordmark = document.querySelector<HTMLElement>('[data-fx-spotlight]');
  if (!wordmark || !matchMedia(POINTER).matches) return;
  wordmark.addEventListener('pointermove', (event) => {
    const box = wordmark.getBoundingClientRect();
    wordmark.style.setProperty('--dz-spot-x', `${((event.clientX - box.left) / box.width) * 100}%`);
    wordmark.style.setProperty('--dz-spot-y', `${((event.clientY - box.top) / box.height) * 100}%`);
    wordmark.setAttribute('data-lit', '');
  });
  wordmark.addEventListener('pointerleave', () => wordmark.removeAttribute('data-lit'));
}
