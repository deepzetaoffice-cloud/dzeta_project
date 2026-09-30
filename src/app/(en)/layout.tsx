import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { locales } from '@/lib/i18n/locales';
import { titleTemplate } from '@/lib/seo/title';
import { siteConfig } from '@/lib/site-config';
import { siteUrl } from '@/lib/url';
import { fontVariables } from '@/styles/fonts';
import '@/styles/globals.css';

const locale = locales.en;

// English root layout (docs/ai/11 §2: Arabic gets its own root layout in P11; English never moves).
// No canonical here: every page sets its own, so a page can't inherit the home URL (docs/ai/08 §1).
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    template: titleTemplate,
    default: siteConfig.brandName,
  },
};

export default function EnglishRootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={locale.lang} dir={locale.dir} className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
