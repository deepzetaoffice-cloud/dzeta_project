'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/icons/Icon';
import { Switch } from '@/components/ui/Switch';
import { consentContent } from '@/content/en/legal/consent';
import { EFFECTS_KEY, THEME_KEY } from '@/lib/fx/preferences';
import { siteConfig } from '@/lib/site-config';
import { accounts } from '@/lib/tracking/accounts';
import { applyChoice, CONSENT_KEY, currentConsent, type Choice } from '@/lib/tracking/consent';
import { ATTRIBUTION_DAYS, FIRST_TOUCH_KEY, LAST_TOUCH_KEY } from '@/lib/tracking/keys';
import { vendorsInUse, withdrawnCookies, type ConsentGroup } from '@/lib/tracking/vendors';

// Cookie settings, the second layer (docs/ai/09 §2.7, conflict C52; P3 plan, E;
// docs/content-drafts/legal/consent-copy.md §2). TrackingRuntime imports this file only when a visitor
// opens it (the banner's Choose settings, or the footer's Cookie settings), so it costs nothing at
// first load. A modal <dialog>: the page behind is inert, Esc and the close button close it, and focus
// returns to the button that opened it (TrackingRuntime moves it to <main> when that button is gone).
// - Essential is a locked state, not a disabled-looking switch; Analytics and Marketing are switches,
//   each with its visible On/Off beside it.
// - Each group lists its tools' first-party cookies and the site's own storage, for the vendors in use
//   only (vendors.ts), so the list names exactly the tools that can run.

// The site's own browser storage, by group: what Cookie settings lists under the brand's name.
export const SITE_STORAGE = [
  { keys: [CONSENT_KEY], group: 'essential', purpose: 'consent', lifetime: { months: 12 } },
  { keys: [THEME_KEY, EFFECTS_KEY], group: 'essential', purpose: 'display', lifetime: 'untilCleared' },
  {
    keys: [FIRST_TOUCH_KEY, LAST_TOUCH_KEY],
    group: 'marketing',
    purpose: 'attribution',
    lifetime: { days: ATTRIBUTION_DAYS },
  },
] as const;

type Row = { name: string; provider: string; lifetime: string };

const { settings } = consentContent;

function rowsFor(group: ConsentGroup, gtm: boolean): Row[] {
  const own = SITE_STORAGE.filter((entry) => entry.group === group).flatMap((entry) =>
    entry.keys.map((key) => ({
      name: key,
      provider: siteConfig.brandName,
      lifetime:
        entry.lifetime === 'untilCleared'
          ? settings.lifetime.untilCleared
          : 'days' in entry.lifetime
            ? settings.lifetime.days(entry.lifetime.days)
            : settings.lifetime.months(entry.lifetime.months),
    })),
  );
  const vendors = vendorsInUse({ gtm }, accounts)
    .filter((vendor) => vendor.group === group)
    .flatMap((vendor) =>
      (vendor.cookies ?? [])
        .filter((cookie) => cookie.approved)
        .map((cookie) => ({
          name: cookie.name,
          provider: vendor.name,
          lifetime: settings.lifetime.months(cookie.lifetimeMonths),
        })),
    );
  return [...own, ...vendors];
}

// Each group's table is named by its group as well ("Analytics, Cookies and storage"), so the three
// tables never share one name, and it scrolls on its own when a name is wider than a 320 px screen.
function CookieList({ rows, id, group }: { rows: Row[]; id: string; group: string }) {
  if (rows.length === 0) return null;
  return (
    <div className="mt-3">
      <p id={id} className="text-small font-medium text-fg-strong">
        {settings.cookiesHeading}
      </p>
      <div className="mt-1 overflow-x-auto">
        <table aria-label={`${group}, ${settings.cookiesHeading}`} className="dz-consent-table w-full text-small">
          <thead>
            <tr>
              <th scope="col" className="font-medium">
                {settings.cookieColumns.name}
              </th>
              <th scope="col" className="font-medium">
                {settings.cookieColumns.provider}
              </th>
              <th scope="col" className="font-medium">
                {settings.cookieColumns.lifetime}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td className="font-mono whitespace-nowrap">{row.name}</td>
                <td>{row.provider}</td>
                <td>{row.lifetime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type ConsentSettingsProps = {
  // Whether the site loads GTM (NEXT_PUBLIC_GTM_ID), which decides the vendors in use
  gtm: boolean;
  // Called once the dialog has closed, with the Saved line when a choice was applied
  onClose: (savedMessage: string | null) => void;
};

export default function ConsentSettings({ gtm, onClose }: ConsentSettingsProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const saved = useRef(false);
  const [choice, setChoice] = useState<Choice>(() => currentConsent().choice);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  const apply = (next: Choice) => {
    applyChoice(next, { analytics: withdrawnCookies('analytics'), marketing: withdrawnCookies('marketing') });
    saved.current = true;
    dialog.current?.close();
  };

  const group = (key: 'analytics' | 'marketing') => (
    <section aria-label={settings[key].name} className="border-t border-hairline pt-4">
      <div className="flex items-center justify-between gap-4">
        <Switch
          label={settings[key].name}
          checked={choice[key]}
          onCheckedChange={(on) => setChoice((current) => ({ ...current, [key]: on }))}
          className="font-bold"
        />
        <span aria-hidden="true" className="text-small text-fg-muted">
          {choice[key] ? settings.toggleOn : settings.toggleOff}
        </span>
      </div>
      <p className="mt-1 text-small">{settings[key].body}</p>
      <CookieList rows={rowsFor(key, gtm)} id={`dz-settings-${key}-list`} group={settings[key].name} />
    </section>
  );

  return (
    <dialog
      ref={dialog}
      aria-labelledby="dz-settings-title"
      className="dz-consent-dialog"
      onClose={() => onClose(saved.current ? settings.saved : null)}
    >
      <div data-theme="dark" className="dz-consent-panel dz-glass dz-glass--live dz-glass--muted">
        <div className="flex items-start justify-between gap-4">
          <h2 id="dz-settings-title" className="text-h3">
            {settings.title}
          </h2>
          <button
            type="button"
            aria-label={settings.close}
            onClick={() => dialog.current?.close()}
            className="dz-press -me-2 inline-flex size-11 shrink-0 items-center justify-center rounded-pill text-fg-strong"
          >
            <Icon name="close" size={24} />
          </button>
        </div>
        <p className="mt-2 text-small">{settings.intro}</p>
        <div className="mt-6 grid gap-5">
          <section aria-labelledby="dz-settings-essential" className="pt-1">
            <div className="flex min-h-11 items-center justify-between gap-4">
              <p id="dz-settings-essential" className="font-bold text-fg-strong">
                {settings.essential.name}
              </p>
              <span className="text-small font-medium text-fg-strong">{settings.essential.state}</span>
            </div>
            <p className="mt-1 text-small">{settings.essential.body}</p>
            <CookieList
              rows={rowsFor('essential', gtm)}
              id="dz-settings-essential-list"
              group={settings.essential.name}
            />
          </section>
          {group('analytics')}
          {group('marketing')}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 border-t border-hairline pt-5">
          <button type="button" onClick={() => apply(choice)} className="dz-consent-button dz-press font-bold">
            {settings.save}
          </button>
          <button
            type="button"
            onClick={() => apply({ analytics: true, marketing: true })}
            className="dz-consent-button dz-press font-bold"
          >
            {settings.acceptAll}
          </button>
          <button
            type="button"
            onClick={() => apply({ analytics: false, marketing: false })}
            className="dz-consent-button dz-press font-bold"
          >
            {settings.rejectAll}
          </button>
        </div>
      </div>
    </dialog>
  );
}
