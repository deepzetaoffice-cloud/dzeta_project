import type { Metadata } from 'next';
import { faqSection, homeContent } from '@/content/en/home';
import { homeFaq } from '@/content/en/faq-bank';
import { JsonLd } from '@/components/seo/JsonLd';
import { Faq } from '@/components/sections/Faq';
import { brandedTitle } from '@/lib/seo/title';
import { homeGraph } from '@/lib/schema/graphs/home';
import { absoluteUrl } from '@/lib/url';

export const metadata: Metadata = {
  // `absolute`: the layout's title template doesn't reach a page in its own segment (see seo/title.ts).
  title: { absolute: brandedTitle(homeContent.title) },
  description: homeContent.description,
  alternates: { canonical: absoluteUrl('/') },
};

// The real Home assembles section by section (P5 plan, S3→S7). The FAQ ships first (S3), so the
// FAQPage schema block has visible parity from its first commit; the remaining sections mount in
// S4–S6 and the page takes its final shape at S7. Copy is typed data (src/content/en/*.ts); the
// shell's SiteShell provides <main>, so the page renders its sections directly.
export default function HomePage() {
  return (
    <>
      {/* Home's page schema block (P4 S7; P5 adds the FAQPage: the FAQ is visible below): the
          sitewide block in the layout plus this one. */}
      <JsonLd graph={homeGraph()} />
      {/* §01 The hero grows into its full form in S4; its H1 and answer are the page's LCP (13 §3 rule 2) */}
      <section aria-labelledby="home-heading" className="mx-auto max-w-measure px-gutter pt-section">
        <h1 id="home-heading" className="text-statement">
          {homeContent.heading}
        </h1>
        <p className="mt-6 text-lead">{homeContent.intro}</p>
      </section>
      {/* §10 The FAQ (P5 S3; docs/design/faq.md): zero-JS base, lazy enhancement. The most
          breathing room on the page (home.md) — py-section both sides. */}
      <div data-fx-lazy="faq" className="mx-auto max-w-page px-gutter py-section">
        <Faq heading={faqSection.heading} lede={faqSection.lede} questions={homeFaq} />
      </div>
    </>
  );
}
