import type { ReactNode } from 'react';
import { locales, type Locale } from '@/lib/i18n/locales';
import { fontVariables } from '@/styles/fonts';

// The one document for every page: <html> and <body> with the fonts, and the locale's lang and dir
// (docs/ai/11 §1; P2 plan, B1). Both root layouts and the 404, which skips the layouts, render it, so
// they can't drift apart. Part B adds the no-flash script, IconDefs, the shell and the effect runtime.
// The error page renders its own document: it has to work when this one is what failed (B5).

export type SiteDocumentProps = {
  locale: Locale;
  children: ReactNode;
};

export function SiteDocument({ locale, children }: SiteDocumentProps) {
  const { lang, dir } = locales[locale];
  return (
    <html lang={lang} dir={dir} className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
