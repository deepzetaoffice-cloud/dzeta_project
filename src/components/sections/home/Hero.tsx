import { DemoStub } from '@/components/demos/DemoStub';
import { auditHref, CtaButton } from '@/components/ui/CtaButton';
import { heroAnswer } from '@/content/en/home';
import { shellContent } from '@/content/en/shell';

// Home §01, the hero (docs/design/home.md; Figma 50:35 / 56:810). Phase C: the semantic hero on the
// stage. Phase D adds the rotating phrase (hero-word-rotator) beside the H1, the AI input,
// background-paths and the message-to-booking scene.
// - The H1 is the page's LCP element: visible, unclipped and in place at first paint, with no entrance
//   animation (13 §3 rule 7). Its text is one stable sentence (heroAnswer.heading).
// - The direct answer follows it (08 §2.2), then the audit CTA and the AI agent's demo trigger.
export function Hero() {
  return (
    <section aria-labelledby="home-heading" className="px-stage-inset">
      <div className="mx-auto max-w-page rounded-stage bg-(image:--dz-grad-stage) px-gutter pt-12 pb-section text-on-color sm:pt-16">
        <h1 id="home-heading" className="max-w-4xl text-hero-line text-on-color">
          {heroAnswer.heading}
        </h1>
        <p className="mt-6 max-w-measure text-lead">{heroAnswer.answer}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <CtaButton href={auditHref()} label={shellContent.cta} variant="primary" />
          <DemoStub demoId="ai-agent" label={heroAnswer.tryAgent} icon="send" onColor />
        </div>
      </div>
    </section>
  );
}
