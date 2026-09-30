import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { SiteDocument } from '@/components/layout/SiteDocument';
import { titleTemplate } from '@/lib/seo/title';
import { siteConfig } from '@/lib/site-config';
import { siteUrl } from '@/lib/url';
import { siteViewport } from '@/lib/viewport';
import '@/styles/globals.css';

// English root layout (docs/ai/11 §2: Arabic gets its own root layout in P11; English never moves).
// No canonical here: every page sets its own, so a page can't inherit the home URL (docs/ai/08 §1).
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    template: titleTemplate,
    default: siteConfig.brandName,
  },
  // The name under the icon when the site is added to an iPhone's home screen (0018).
  appleWebApp: { title: siteConfig.brandName },
};

export const viewport: Viewport = siteViewport;

export default function EnglishRootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <SiteDocument locale="en">{children}</SiteDocument>;
}
