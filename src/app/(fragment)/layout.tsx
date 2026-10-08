import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { locales } from '@/lib/i18n/locales';

// The root layout for HTML fragments (L8, decision 0026): a bare document, with no shell, no styles,
// no fonts and no tracking. A fragment page isn't for visitors: the site fetches it and lifts one
// element out of it into a page that already has the styles (mega-enhance.ts). Never indexed and
// never linked (registry R179).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function FragmentRootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={locales.en.lang} dir={locales.en.dir}>
      <body>{children}</body>
    </html>
  );
}
