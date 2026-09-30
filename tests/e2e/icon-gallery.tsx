import { renderToStaticMarkup } from 'react-dom/server';
import { Icon } from '@/components/icons/Icon';
import { IconDefs } from '@/components/icons/IconDefs';
import { TIER_1, TIER_2 } from '@/components/icons/registry';

// Every icon inside a host button, as a link or card would hold it, with the shared definitions, as
// HTML. icons.spec.ts loads this through Vite, because Playwright compiles JSX with its own
// component-testing runtime, which react-dom/server can't render.
export function iconGallery(): string {
  const tier1 = Object.keys(TIER_1) as (keyof typeof TIER_1)[];
  const tier2 = Object.keys(TIER_2) as (keyof typeof TIER_2)[];
  return renderToStaticMarkup(
    <>
      <IconDefs />
      {tier1.map((name) => (
        <button key={name} type="button" className="dz-icon-host" data-host={name} aria-label={name}>
          <Icon name={name} size={24} />
        </button>
      ))}
      {tier2.map((name) => (
        <button key={name} type="button" className="dz-icon-host" data-host={name} aria-label={name}>
          <Icon name={name} size={24} />
        </button>
      ))}
    </>,
  );
}
