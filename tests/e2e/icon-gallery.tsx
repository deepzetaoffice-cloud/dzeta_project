import { renderToStaticMarkup } from 'react-dom/server';
import { Icon } from '@/components/icons/Icon';
import { TIER_1, TIER_2, TIER_3 } from '@/components/icons/registry';

// Every icon inside a host button, as a link or card would hold it, as HTML. The page already has the
// shared definitions: SiteDocument mounts them once (P2 plan, B1). icons.spec.ts loads this through
// Vite, because Playwright compiles JSX with its own component-testing runtime, which react-dom/server
// can't render.
export function iconGallery(): string {
  const tier1 = Object.keys(TIER_1) as (keyof typeof TIER_1)[];
  const tier2 = Object.keys(TIER_2) as (keyof typeof TIER_2)[];
  const tier3 = Object.keys(TIER_3) as (keyof typeof TIER_3)[];
  return renderToStaticMarkup(
    <>
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
      {/* Tier 3 at its smallest size, where clearance matters most */}
      {tier3.map((name) => (
        <button key={name} type="button" className="dz-icon-host" data-host={name} aria-label={name}>
          <Icon name={name} size={64} />
        </button>
      ))}
      {/* A card that isn't focusable itself, holding a link: the service-card pattern (hover-card) */}
      <article className="dz-icon-host" data-host="card">
        <Icon name="booking-automation-system" size={24} />
        <a href="#card">Booking Automation System</a>
      </article>
      <button type="button" className="dz-icon-host" data-host="disabled" aria-label="disabled" disabled>
        <Icon name="crm-setup-automation" size={24} />
      </button>
    </>,
  );
}
