import type { Metadata } from 'next';
import { Faq } from '@/components/sections/Faq';
import { LegalBody, LegalContact, LegalGlance, LegalHero } from '@/components/sections/legal/LegalSections';
import { JsonLd } from '@/components/seo/JsonLd';
import { privacyFaq, privacyPolicy } from '@/content/en/legal/privacy';
import { routePath } from '@/lib/routes';
import { legalPageGraph } from '@/lib/schema/graphs/legal';
import { pageMetadata } from '@/lib/seo/page-seo';

// The privacy policy (/privacy, R006; docs/design/privacy.md; Figma 61:34). T2. The layout's title
// template adds the brand (08 §1). The breadcrumb sits in the hero; the FAQ follows the policy, as
// the spec keeps it (the visible FAQ and its FAQPage stay one).
export const metadata: Metadata = pageMetadata({
  title: privacyPolicy.title,
  description: privacyPolicy.description,
  path: routePath('R006'),
});

const trail = [{ route: 'R006', label: privacyPolicy.breadcrumb }] as const;

export default function PrivacyPage() {
  return (
    <>
      {/* The page block: the WebPage (dateModified = "Last updated"), the BreadcrumbList and the
          FAQPage (the sitewide block is the layout's) */}
      <JsonLd
        graph={legalPageGraph({
          route: 'R006',
          name: privacyPolicy.title,
          description: privacyPolicy.answer,
          dateModified: privacyPolicy.lastUpdated.iso,
          trail,
          faq: privacyFaq,
        })}
      />
      <LegalHero
        trail={trail}
        heading={privacyPolicy.heading}
        answer={privacyPolicy.answer}
        lastUpdatedLabel={privacyPolicy.lastUpdatedLabel}
        lastUpdated={privacyPolicy.lastUpdated}
      />
      <LegalGlance heading={privacyPolicy.glanceHeading} cards={privacyPolicy.glance} />
      <LegalBody
        contentsLabel={privacyPolicy.contentsLabel}
        contentsHeading={privacyPolicy.contentsHeading}
        sections={privacyPolicy.sections}
        note={privacyPolicy.note}
      />
      {/* The FAQ module (faq.md): zero JS for the base; its enhancement loads on use */}
      <div data-fx-lazy="faq" className="mx-auto max-w-page px-gutter py-section">
        <Faq heading={privacyPolicy.faqHeading} lede={privacyPolicy.faqLede} questions={privacyFaq} layout="stacked" />
      </div>
      <LegalContact
        contact={privacyPolicy.contact}
        related={{ heading: privacyPolicy.relatedHeading, links: privacyPolicy.related }}
      />
    </>
  );
}
