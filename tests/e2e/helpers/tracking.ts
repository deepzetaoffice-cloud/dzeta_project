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
