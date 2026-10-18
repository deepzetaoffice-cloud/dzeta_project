// The header's behaviour (docs/design/header.md; 13 §4.1).
// - header-condense: past 80 px of scroll the header carries data-condensed, and globals.css clips its
//   fill and moves its contents (an instant swap under Reduce effects). Without JavaScript it stays
//   as it is at the top.
// - reading-progress: a scroll timeline in CSS where supported; elsewhere this keeps --dz-progress at
//   how far the page has scrolled, 0 to 1.
// - The current section: aria-current on the nav item whose page this is ("page"), or whose section
//   holds it ("true"). globals.css shows it in violet with its Zeta pixel.

const CONDENSE_AT = 80;
const HEADER = '[data-fx-header]';

let started = false;

export function startHeader() {
  if (started) return;
  started = true;
  const header = document.querySelector<HTMLElement>(HEADER);
  if (!header) return;
  const timeline = CSS.supports('animation-timeline: scroll()');
  let frame = 0;
  const update = () => {
    frame = 0;
    const y = window.scrollY;
    header.toggleAttribute('data-condensed', y > CONDENSE_AT);
    if (!timeline) {
      const end = document.documentElement.scrollHeight - window.innerHeight;
      header.style.setProperty('--dz-progress', String(end > 0 ? Math.min(1, y / end) : 0));
    }
  };
  addEventListener(
    'scroll',
    () => {
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}

export function markCurrent(pathname: string) {
  for (const item of document.querySelectorAll<HTMLElement>(`${HEADER} [data-nav-path]`)) {
    const path = item.dataset.navPath ?? '';
    if (pathname === path) item.setAttribute('aria-current', 'page');
    else if (pathname.startsWith(`${path}/`)) item.setAttribute('aria-current', 'true');
    else item.removeAttribute('aria-current');
  }
}
