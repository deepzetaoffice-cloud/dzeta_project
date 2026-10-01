// The header's behaviour (P2 plan, G and H; docs/design/header.md). It condenses once the page has
// scrolled (the shared observer watches a sentinel at the top), marks the current page (aria-current),
// and moves the current-place marker, the logo's mini cluster (13 §8), to the hovered or focused nav
// item (hover-pixel-hop). Layout is read once per hover, focus or resize, never per pointer move.
// The mobile sheet opens with invoker commands; for browsers without them, the menu and close buttons
// fall back to showModal() and close() here. A client navigation closes the sheet. Its scroll lock is
// CSS (globals.css).
import { watch } from './observer';

// The main pixel's centre in the marker's box: 0.5 S of the cluster's 2.1053 S (Cluster.tsx).
const MAIN_PIXEL_CENTRE = 0.5 / 2.1053;
// The nav's own items, not the links inside the mega menu's panel
const ITEM = '[data-fx-nav] > ul > li > :is(a, button)';

const nav = () => document.querySelector<HTMLElement>('[data-fx-nav]');

// Moves the marker under an item, or back to the current page's; without one, it hides.
function hopTo(item: Element | null) {
  const bar = nav();
  const marker = bar?.querySelector<HTMLElement>('.dz-hop');
  if (!bar || !marker) return;
  const target = item ?? bar.querySelector('[aria-current="page"]');
  if (!target) {
    delete bar.dataset.hop;
    return;
  }
  const box = marker.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  // Physical pixels: the cluster never mirrors, so it moves the same way in both directions.
  const x = rect.x + rect.width / 2 - (box.x + box.width * MAIN_PIXEL_CENTRE);
  marker.style.setProperty('--dz-hop-x', `${x.toFixed(1)}px`);
  bar.dataset.hop = '';
}

function onEnter(event: Event) {
  const item = (event.target as Element).closest?.(ITEM);
  if (item) hopTo(item);
}

function onLeave(event: Event) {
  const next = (event as FocusEvent | PointerEvent).relatedTarget as Element | null;
  const bar = nav();
  if (bar && (event.target as Element).closest?.('[data-fx-nav]') && !bar.contains(next)) hopTo(null);
}

// Invoker commands open the sheet without JavaScript where they exist (P2 plan, J1).
function onSheetButton(event: MouseEvent) {
  if ('commandForElement' in HTMLButtonElement.prototype) return;
  const button = (event.target as Element).closest('[data-fx-sheet-open], [data-fx-sheet-close]');
  if (!button) return;
  const sheet = document.getElementById(button.getAttribute('commandfor') ?? '');
  if (!(sheet instanceof HTMLDialogElement)) return;
  if (button.hasAttribute('data-fx-sheet-open')) sheet.showModal();
  else sheet.close();
}

// The current page, from the path: the logo on Home, a nav link on its own page. Fragment links (the
// review page's placeholders) are left as they are. A navigation from the sheet closes it.
export function markCurrent(pathname: string) {
  for (const link of document.querySelectorAll<HTMLAnchorElement>('[data-fx-header] a[href^="/"]')) {
    if (new URL(link.href).pathname === pathname) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  document.querySelector<HTMLDialogElement>('dialog.dz-sheet[open]')?.close();
  hopTo(null);
}

let started = false;

export function startHeader() {
  if (started) return;
  started = true;
  const header = document.querySelector('[data-fx-header]');
  const sentinel = document.querySelector('[data-fx-sentinel]');
  if (header && sentinel) watch(sentinel, (visible) => header.toggleAttribute('data-condensed', !visible));
  document.addEventListener('pointerover', onEnter);
  document.addEventListener('focusin', onEnter);
  document.addEventListener('pointerout', onLeave);
  document.addEventListener('focusout', onLeave);
  document.addEventListener('click', onSheetButton);
  addEventListener('resize', () => hopTo(null), { passive: true });
}
