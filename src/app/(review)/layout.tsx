import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { SiteDocument } from '@/components/layout/SiteDocument';
import { shellReviewContent } from '@/content/en/shell-review';
import { brandedTitle } from '@/lib/seo/title';
import { siteViewport } from '@/lib/viewport';
import '@/styles/globals.css';

// The review page's own root layout (P2 plan, A3): the English layout can't tell this path apart
// without going dynamic (C30), so the review page gets the same document from here. Never indexed:
// the page is noindex, never linked, and 404 in production (registry R165).
export const metadata: Metadata = {
  title: brandedTitle(shellReviewContent.title),
  description: shellReviewContent.description,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = siteViewport;

export default function ReviewRootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <SiteDocument locale="en" review>
      {children}
    </SiteDocument>
  );
}
