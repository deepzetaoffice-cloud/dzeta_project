import type { Metadata } from 'next';
import { homeContent } from '@/content/en/home';
import { brandedTitle } from '@/lib/seo/title';
import { siteConfig } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/url';

export const metadata: Metadata = {
  // `absolute`: the layout's title template doesn't reach a page in its own segment (see seo/title.ts).
  title: { absolute: brandedTitle(homeContent.title) },
  description: homeContent.description,
  alternates: { canonical: absoluteUrl('/') },
};

// Placeholder Home for P0: the empty-page baseline (decision 0014) is measured on this page. The
// shell's header and <main> come from SiteDocument (P2); the real Home replaces this in P5.
export default function HomePage() {
  return (
    <div className="mx-auto max-w-measure px-gutter pt-8 pb-section">
      <h1 className="text-h1">{homeContent.heading}</h1>
      <p className="mt-4">{homeContent.intro}</p>
      <p className="mt-4">
        {homeContent.contactBefore}
        <a className="text-link underline" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        {homeContent.contactAfter}
      </p>
    </div>
  );
}
