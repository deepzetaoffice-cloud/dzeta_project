import type { Metadata } from 'next';
import { Logo } from '@/components/ui/Logo';
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

// Placeholder Home for P0: the empty-page baseline (decision 0014) is measured on this page. P1 adds
// the logo; the real header replaces this one in P2. The header stays navy in both themes, because the
// logo's white "Deep" needs navy (docs/ai/05 §2). Not a link: this is the home page.
export default function HomePage() {
  return (
    <>
      <header data-theme="dark" className="mx-auto max-w-measure px-gutter pt-section">
        <Logo variant="lockup" label={siteConfig.brandName} className="h-9" />
      </header>
      <main className="mx-auto max-w-measure px-gutter pt-8 pb-section">
        <h1 className="text-h1">{homeContent.heading}</h1>
        <p className="mt-4">{homeContent.intro}</p>
        <p className="mt-4">
          {homeContent.contactBefore}
          <a className="text-link underline" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
          {homeContent.contactAfter}
        </p>
      </main>
    </>
  );
}
