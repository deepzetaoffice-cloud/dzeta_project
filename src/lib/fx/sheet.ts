// The mobile menu's behaviour (docs/design/header.md): a native modal <dialog class="dz-sheet">. The
// Menu button opens it with invoker commands (`commandfor`, `command`), so no JavaScript is needed
// where they're supported; this covers the browsers without them, and closes the sheet when a link
// inside it is followed or the window grows to the desktop header (1,280 px, 05 §4).

const DESKTOP = '(min-width: 80rem)';
const OPEN_SHEET = 'dialog.dz-sheet[open]';

function onClick(event: MouseEvent) {
  const target = event.target as Element;
  if (target.closest('a[href]')) {
    target.closest<HTMLDialogElement>(OPEN_SHEET)?.close();
    return;
  }
  if ('commandForElement' in HTMLButtonElement.prototype) return;
  const button = target.closest('[data-fx-sheet-open], [data-fx-sheet-close]');
  if (!button) return;
  const sheet = document.getElementById(button.getAttribute('commandfor') ?? '');
  if (!(sheet instanceof HTMLDialogElement)) return;
  if (button.hasAttribute('data-fx-sheet-open')) sheet.showModal();
  else sheet.close();
}

// A client navigation closes an open sheet.
export function closeSheet() {
  document.querySelector<HTMLDialogElement>(OPEN_SHEET)?.close();
}

let started = false;

export function startSheet() {
  if (started) return;
  started = true;
  document.addEventListener('click', onClick);
  matchMedia(DESKTOP).addEventListener('change', (event) => {
    if (event.matches) closeSheet();
  });
}
