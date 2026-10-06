import type { Metadata } from 'next';
import { homeContent } from '@/content/en/home';
import { JsonLd } from '@/components/seo/JsonLd';
import { brandedTitle } from '@/lib/seo/title';
import { homeGraph } from '@/lib/schema/graphs/home';
import { absoluteUrl } from '@/lib/url';

export const metadata: Metadata = {
  // `absolute`: the layout's title template doesn't reach a page in its own segment (see seo/title.ts).
  title: { absolute: brandedTitle(homeContent.title) },
  description: homeContent.description,
  alternates: { canonical: absoluteUrl('/') },
};

// The real Home assembles in S7 (P5 plan): the sections per docs/design/home.md, in blueprint
// order, mount inside this page. The copy is typed data (src/content/en/home.ts); the FAQ and its
// FAQPage schema block ship in S3.
export default function HomePage() {
  return (
    <div className="mx-auto max-w-measure px-gutter pt-8 pb-section">
      {/* Home's page schema block (P4 S7; spec decision 3): the sitewide block in the layout plus
          this one. No FAQPage until the FAQ is visible (the plan's S7 note). */}
      <JsonLd graph={homeGraph()} />
      <h1 className="text-h1">{homeContent.heading}</h1>
      <p className="mt-4">{homeContent.intro}</p>
    </div>
  );
}
