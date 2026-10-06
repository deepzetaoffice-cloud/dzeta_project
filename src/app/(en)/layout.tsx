import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { SiteDocument } from '@/components/layout/SiteDocument';
import { JsonLd } from '@/components/seo/JsonLd';
import { titleTemplate } from '@/lib/seo/title';
import { siteConfig } from '@/lib/site-config';
import { sitewideGraph } from '@/lib/schema/graphs/sitewide';
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
  // The sitewide schema block, mounted exactly once in the root layout (P4 S4; spec decision 3 —
  // a nested layout must never re-inject it; check:schema's assertion 10 guards the count).
  return (
    <SiteDocument locale="en">
      <JsonLd graph={sitewideGraph()} />
      {children}
    </SiteDocument>
  );
}
