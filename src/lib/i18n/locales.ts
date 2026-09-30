// Locale data for root layouts and every URL builder (docs/ai/11 §1 rules 5 and 7).
// Only English exists until P11. Arabic is added here as a new entry; English files never move.

type LocaleInfo = {
  lang: string;
  dir: 'ltr' | 'rtl';
  // Prefix for the locale's URLs: '' for English at the root, '/ar' for Arabic (docs/ai/11 §2).
  pathPrefix: '' | `/${string}`;
};

export const locales = {
  en: { lang: 'en', dir: 'ltr', pathPrefix: '' },
} as const satisfies Record<string, LocaleInfo>;

export type Locale = keyof typeof locales;

export const defaultLocale: Locale = 'en';
