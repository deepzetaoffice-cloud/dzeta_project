import { VoiceReceptionist, type VoiceAgent } from '@/components/demos/VoiceReceptionist';
import { CtaButton, auditHref, whatsappHref } from '@/components/ui/CtaButton';
import { Glyph } from '@/components/ui/Glyph';
import type { VoiceDemoCopy } from '@/content/en/ai-receptionist';
import { shellContent } from '@/content/en/shell';
import { isLive, routePath } from '@/lib/routes';
import '@/styles/ai-receptionist.css';

// The voice demos' page body, shared by /ai-receptionist (R180) and /ai-voice-clone (R181)
// (docs/plans/2026-10-25-ai-receptionist-demo.md, 2026-10-25-ai-voice-clone-demo.md): a live voice
// call with one of Deepzeta AI's agents. Each page sets its own metadata (noindex) and headers.
// The H1 and the direct answer are the LCP, visible at first paint with no entrance motion (13 §3).
export type VoiceDemoPageProps = { copy: VoiceDemoCopy; agent?: VoiceAgent };

export function VoiceDemoPage({ copy, agent = 'receptionist' }: VoiceDemoPageProps) {
  const whatsapp = whatsappHref();
  return (
    <>
      <section aria-labelledby="voice-heading" data-stage-hero="" className="px-stage-inset pt-stage-inset">
        <div className="relative mx-auto max-w-page overflow-hidden rounded-stage bg-(image:--dz-grad-stage) text-on-color">
          {/* Phones read the headline, then the console, then the steps; wide screens put the console
              beside both */}
          <div className="relative grid gap-8 px-gutter pt-[calc(var(--dz-layout-header-height)+var(--dz-space-6))] pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-x-14 lg:gap-y-8 lg:px-16 lg:pb-14">
            <div className="grid content-start justify-items-start gap-5 lg:col-start-1 lg:row-start-1 lg:self-end">
              <p className="inline-flex min-h-8 items-center gap-2 rounded-full border border-line-on-color px-3 font-mono text-label uppercase">
                <span aria-hidden="true" className="size-2 rounded-full bg-accent-online" />
                {copy.eyebrow}
              </p>
              <h1 id="voice-heading" className="text-hero-line text-balance text-on-color">
                {copy.heading}
              </h1>
              <p className="max-w-[36rem] text-lead">{copy.answer}</p>
            </div>
            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
              <VoiceReceptionist copy={copy} agent={agent} />
            </div>
            <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
              <ol className="grid w-full max-w-[36rem] gap-3" aria-label={copy.steps.heading}>
                {copy.steps.items.map((step, index) => (
                  <li
                    key={step.title}
                    className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 rounded-xl border border-line-on-color p-4"
                  >
                    <span aria-hidden="true" className="font-mono text-label">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="grid gap-1">
                      <span className="text-button-m">{step.title}</span>
                      <span className="text-small">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="voice-next" className="mx-auto max-w-page px-gutter py-section">
        <div className="grid gap-8 rounded-stage bg-surface-muted p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-12">
          <div className="grid gap-3">
            <h2 id="voice-next" className="text-h2 text-balance">
              {copy.next.heading}
            </h2>
            <p className="max-w-[40rem] text-lead text-ink-secondary">{copy.next.body}</p>
            <p className="max-w-[40rem] text-small text-ink-secondary">
              {copy.privacy}{' '}
              {isLive('R006') ? (
                <a href={routePath('R006')} className="text-link underline underline-offset-2">
                  {copy.privacyLink}
                </a>
              ) : null}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <CtaButton href={auditHref()} label={shellContent.cta} variant="primary" />
            {whatsapp ? (
              <a
                href={whatsapp}
                className="dz-press inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-line-strong bg-surface px-7 text-button-l text-ink no-underline"
              >
                <Glyph name="whatsapp" className="size-5" />
                {shellContent.whatsappLabel}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
