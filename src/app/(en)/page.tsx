import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { Hero } from '@/components/sections/home/Hero';
import { FourDoors, ProblemOutcome, ProofStrip } from '@/components/sections/home/TopSections';
import {
  BuildItself,
  HowWeWork,
  IndustryTiles,
  ProofExamples,
  RoiTeaser,
  WorkflowExplorer,
} from '@/components/sections/home/MidSections';
import { FinalCta } from '@/components/sections/home/FinalCta';
import { DemoPanelTemplate } from '@/components/demos/DemoStub';
import { Faq } from '@/components/sections/Faq';
import { faqSection, homeContent } from '@/content/en/home';
import { homeFaq } from '@/content/en/faq-bank';
import { pageMetadata } from '@/lib/seo/page-seo';
import { homeGraph } from '@/lib/schema/graphs/home';

// The SEO contract (08 §7): `root`, since the layout's title template doesn't reach its own segment.
export const metadata: Metadata = pageMetadata({
  title: homeContent.title,
  description: homeContent.description,
  path: '/',
  root: true,
});

// Home (R001; docs/design/home.md; Figma 50:35 / 56:810): the sections in the blueprint's order,
// inside SiteShell's <main>. All copy is typed data (src/content/en/*.ts); the sections read the
// catalogue and the industry groups, never retyping a name (10 §2). The page schema block (WebPage,
// the pillars' ItemList, FAQPage) sits beside the sitewide one from the layout. The FAQ's and the
// demos' enhancements load on use (src/lib/fx/lazy.ts); the scenes start as they near the screen
// (data-fx-scene, src/lib/fx/scenes.ts). Each section is built to its Figma frame (Phase D2).
export default function HomePage() {
  return (
    <>
      <JsonLd graph={homeGraph()} />
      <Hero />
      <ProofStrip />
      <ProblemOutcome />
      <FourDoors />
      <WorkflowExplorer />
      <BuildItself />
      <ProofExamples />
      <HowWeWork />
      <IndustryTiles />
      <RoiTeaser />
      <div data-fx-lazy="faq" className="mx-auto max-w-page px-gutter py-section">
        <Faq
          heading={faqSection.heading}
          lede={faqSection.lede}
          questions={homeFaq}
          index={9}
          eyebrow={faqSection.eyebrow}
          askAgent={faqSection.askAgent}
        />
      </div>
      <FinalCta />
      {/* The demo stubs' panel, once per page: hidden until a trigger clones it (src/lib/fx/demo.ts) */}
      <DemoPanelTemplate />
    </>
  );
}
