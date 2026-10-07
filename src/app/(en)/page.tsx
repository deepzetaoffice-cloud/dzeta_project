import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { Hero } from '@/components/sections/home/Hero';
import { FourDoors, ProblemOutcome, ProofStrip } from '@/components/sections/home/TopSections';
import {
  BuildItself,
  HowWeWork,
  IndustryTiles,
  RoiTeaser,
  WorkflowExplorer,
} from '@/components/sections/home/MidSections';
import { FinalCta } from '@/components/sections/home/FinalCta';
import { DemoPanelTemplate } from '@/components/demos/DemoStub';
import { Faq } from '@/components/sections/Faq';
import { faqSection, homeContent } from '@/content/en/home';
import { homeFaq } from '@/content/en/faq-bank';
import { brandedTitle } from '@/lib/seo/title';
import { homeGraph } from '@/lib/schema/graphs/home';
import { absoluteUrl } from '@/lib/url';

export const metadata: Metadata = {
  // `absolute`: the layout's title template doesn't reach a page in its own segment (see seo/title.ts).
  title: { absolute: brandedTitle(homeContent.title) },
  description: homeContent.description,
  alternates: { canonical: absoluteUrl('/') },
};

// The real Home (P5 S7): sections 01–11 in blueprint order (docs/design/home.md; engine §3.1),
// inside SiteShell's <main>. All copy is typed data (src/content/en/*.ts); the sections read the
// catalogue and the industry groups, never retyping a name (10 §2). The demos are stubbed behind
// lightweight triggers (04 §2's P5 row); their lazy enhancements (FAQ chips, demo panels, the
// LCP stamp, story replay) load on first interaction through the shared lazy loader, never at
// first load (07 §2; the plan's budget rule).
export default function HomePage() {
  return (
    <>
      {/* Home's page schema block (P4 S7; P5 added the FAQPage: the FAQ is visible in §10): the
          sitewide block in the layout plus this one. */}
      <JsonLd graph={homeGraph()} />

      {/* §01 Hero — the statement H1 is the LCP, visible at first paint (13 §3 rule 2). The lazy
          home enhancement (story replay, demo panel) arms on its first interaction. */}
      <div data-fx-lazy="home">
        <Hero />
      </div>

      {/* §02 Proof strip — platform names as text (catalogue §8); no logos (facts §5) */}
      <ProofStrip />

      {/* §03 Problem → outcome — three pains, story-before-after rows */}
      <ProblemOutcome />

      {/* §04 Four doors — the pillars (C6), glass-frost, the Tier 3 icon stories */}
      <FourDoors />

      {/* §05 Workflow explorer — the visible steps and one static story-flow (P7 makes it live) */}
      <WorkflowExplorer />

      {/* §06 Proof — the page's one pinned scene, the depth-css laptop, the real-LCP stamp (the
          stamp fills through the lazy home enhancement) */}
      <div data-fx-lazy="home">
        <BuildItself />
      </div>

      {/* §07 How we work — Audit → Build → Launch → Improve, Tier 1 step icons, no timeframes */}
      <HowWeWork />

      {/* §08 ROI teaser — the formula shown; the calculator itself is P7 */}
      <RoiTeaser />

      {/* §09 Industries — the four catalogue industry groups, Tier 1 icons, calm tiles */}
      <IndustryTiles />

      {/* §10 FAQ — the module (faq.md), zero JS for the base; the most breathing room on the page */}
      <div data-fx-lazy="faq" className="mx-auto max-w-page px-gutter py-section">
        <Faq heading={faqSection.heading} lede={faqSection.lede} questions={homeFaq} />
      </div>

      {/* §11 Final CTA — the audit offer and the speed-to-lead test stub; the footer's Landing
          follows in the shell */}
      <div data-fx-lazy="home">
        <FinalCta />
      </div>

      {/* The demo stubs' panel, once per page: hidden until a trigger clones it (demo-enhance.ts) */}
      <DemoPanelTemplate />
    </>
  );
}
