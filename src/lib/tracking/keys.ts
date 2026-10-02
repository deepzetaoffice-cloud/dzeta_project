// The attribution touches' storage (docs/ai/09 §2.8; P3 plan, I), in a module of their own: the
// capture code (attribution.ts), the consent code that removes them on withdrawal (consent.ts) and the
// cookie list (ConsentSettings.tsx) all read them, and none of those should pull in another just for
// three constants (Home's first-party JavaScript budget, decision 0021).
export const FIRST_TOUCH_KEY = 'dz-attribution-first';
export const LAST_TOUCH_KEY = 'dz-attribution-last';
// The longest Google Ads click window
export const ATTRIBUTION_DAYS = 90;
