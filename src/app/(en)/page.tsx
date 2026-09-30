import type { Metadata } from 'next';
import { homeContent } from '@/content/en/home';
import { siteConfig } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/url';

export const metadata: Metadata = {
  title: homeContent.title,
  description: homeContent.description,
  alternates: { canonical: absoluteUrl('/') },
};

// Placeholder Home for P0: the empty-page baseline (decision 0014) is measured on this page.
export default function HomePage() {
  return (
    <main className="mx-auto max-w-prose px-6 py-16">
      <h1 className="text-3xl font-bold text-balance">{homeContent.heading}</h1>
      <p className="mt-4">{homeContent.intro}</p>
      <p className="mt-4">
        {homeContent.contactLead}{' '}
        <a className="underline" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        .
      </p>
    </main>
  );
}
