// mega-preview-swap (docs/design/header.md; 13 §4.1): hovering or focusing a pillar column, or one of
// its services, sets the mega menu's data-pillar (globals.css cross-fades to that pillar's door photo
// and washes its column) and writes the service and its outcome under the photo. The server renders
// the first pillar's first service, so the rail is complete without JavaScript.

let started = false;

function onIntent(event: Event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const panel = target.closest<HTMLElement>('.dz-mega');
  const column = target.closest<HTMLElement>('[data-mega-col]');
  if (!panel || !column) return;
  const item = target.closest<HTMLElement>('[data-mega-item]') ?? column.querySelector<HTMLElement>('[data-mega-item]');
  panel.dataset.pillar = column.dataset.megaCol;
  if (!item) return;
  const name = panel.querySelector('[data-mega-name]');
  const outcome = panel.querySelector('[data-mega-outcome]');
  if (name) name.textContent = item.dataset.name ?? '';
  if (outcome) outcome.textContent = item.dataset.outcome ?? '';
}

export function startMega() {
  if (started) return;
  started = true;
  document.addEventListener('pointerover', onIntent);
  document.addEventListener('focusin', onIntent);
}
