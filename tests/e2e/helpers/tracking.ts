import type { Page } from '@playwright/test';

// Tracking helpers for the e2e tests (P3 plan, M).

// The data layer as plain data: gtag() pushes arguments objects, which don't survive serialisation,
// so each becomes { gtag: [...] }; every other entry is kept as it is.
export const dataLayer = (page: Page) =>
  page.evaluate(() =>
    (window.dataLayer ?? []).map((entry) =>
      Object.prototype.toString.call(entry) === '[object Arguments]'
        ? { gtag: Array.from(entry as ArrayLike<unknown>) }
        : entry,
    ),
  );

// The entries that carry an `event`, in order.
export const events = async (page: Page) =>
  (await dataLayer(page)).filter(
    (entry): entry is Record<string, unknown> & { event: string } =>
      typeof entry === 'object' && entry !== null && 'event' in entry,
  );

// The country Vercel's CDN would report; next start applies the same header rules (region.ts).
export const fromCountry = (country: string) => ({ extraHTTPHeaders: { 'x-vercel-ip-country': country } });

// GTM answered by a stub (09 §4: tests never send data). Once a build carries the container ID the
// real gtm.js would run in every test: it pushes its own entries onto the data layer (gtm.js, gtm.dom,
// gtm.load) and stamps gtm.uniqueEventId onto every entry the site pushes, and its tags send hits.
// The empty body keeps the layer exactly what the site pushed, and nothing leaves the machine.
// With no ID in the build the route simply never matches.
export const stubGtm = (page: Page) =>
  page.route('https://www.googletagmanager.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  );
