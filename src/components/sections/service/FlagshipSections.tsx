// The flagship Websites page's own sections (/services/custom-coded-websites; docs/design/custom-
// coded-websites.md; Figma 60:34 desktop, 60:827 mobile). The page proves the service with the site
// itself: the laptop opens onto this site (macbook-scroll), Code ↔ Page shows this hero beside its
// real source (CodePage.tsx), and the terminal replays a real recorded run (StoryTerminal.tsx). The
// shared sections (the problem, the fit, the UAE and pairs block) come from ServiceSections.tsx.
// CodePage reads FlagshipHero's source from this file at build time, so it shows the real code.
import { SectionHeading } from '@/components/sections/SectionHeading';
import type { ServiceSectionProps } from '@/components/sections/service/ServiceSections';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { auditHref, CtaButton } from '@/components/ui/CtaButton';
import { Glyph } from '@/components/ui/Glyph';
import { Photo } from '@/components/ui/Photo';
import { PILLAR_WASH, PillarMark } from '@/components/ui/PillarMark';
import { pillars } from '@/content/catalogue';
import { heroRotator } from '@/content/en/home';
import { shellContent } from '@/content/en/shell';
import type { WebsitesExtras } from '@/content/en/services/types';
import { serviceTemplate } from '@/content/en/services/template';
import { photo, SERVICE_PHOTO } from '@/lib/media/photos';

const section = 'mx-auto max-w-page px-gutter py-section';

export const CODE_PAGE_ID = 'code-page';

export type FlagshipProps = ServiceSectionProps & { extras: WebsitesExtras };

// §01 The hero: the stage, the breadcrumb, the Websites and "2.1 · Flagship" chips, the H1 and the
// direct answer (static from first paint), the audit CTA and the link to Code ↔ Page. Under it the
// laptop, its screen this site's own opening (Home's stage, its first rotator phrase); on desktop with
// effects on, src/lib/fx/flagship.ts opens its lid as the page scrolls.
export function FlagshipHero({
  content,
  service,
  extras,
  trail,
  preview = false,
}: FlagshipProps & { trail?: readonly Crumb[]; preview?: boolean }) {
  const Heading = preview ? 'p' : 'h1';
  const pillar = service.pillar ? pillars.find((entry) => entry.pixel === service.pillar) : undefined;
  return (
    <section
      aria-labelledby={preview ? undefined : 'service-heading'}
      data-stage-hero={preview ? undefined : ''}
      className={preview ? '' : 'px-stage-inset pt-stage-inset'}
      data-view-service={preview ? undefined : service.slug}
      data-view-pillar={preview ? undefined : service.pillar}
    >
      <div
        data-fx-scene={preview ? undefined : 'flagship'}
        className="dz-flag-hero relative mx-auto max-w-page overflow-hidden rounded-stage bg-(image:--dz-grad-stage) text-on-color"
      >
        <div className="relative mx-auto grid max-w-[60rem] justify-items-start gap-5 px-gutter pt-[calc(var(--dz-layout-header-height)+var(--dz-space-6))] lg:justify-items-center lg:pt-[calc(var(--dz-layout-header-height)+var(--dz-space-8))] lg:text-center">
          {trail ? <Breadcrumbs trail={trail} tone="onColor" className="" /> : null}
          <p className="flex flex-wrap gap-2.5 text-caption lg:justify-center">
            {service.pillar && pillar ? (
              <span
                className={`inline-flex min-h-8 items-center gap-2 rounded-full px-3 text-ink ${PILLAR_WASH[service.pillar]}`}
              >
                <PillarMark pillar={service.pillar} className="size-2" />
                {pillar.name}
              </span>
            ) : null}
            <span className="inline-flex min-h-8 items-center rounded-full border border-line-on-color px-3">
              {service.number} · {extras.hero.tag}
            </span>
          </p>
          <Heading id={preview ? undefined : 'service-heading'} className="text-hero-line text-balance text-on-color">
            {content.heading}
          </Heading>
          <p className="max-w-[47.5rem] text-lead">{content.answer}</p>
          <div className="mt-1 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <CtaButton href={auditHref()} label={shellContent.cta} variant="primary" className="dz-cta-rim" />
            <a href={`#${CODE_PAGE_ID}`} className="dz-press dz-button-on-color">
              {extras.hero.seeCode}
            </a>
          </div>
        </div>
        <div aria-hidden="true" className="dz-laptop-stage">
          <div className="dz-laptop" data-macbook={preview ? undefined : ''}>
            <div className="dz-laptop-lid">
              <div className="dz-laptop-screen">
                <span className="dz-screen-bar" />
                <span className="dz-screen-slab">{heroRotator.phrases[0]}</span>
                <span className="dz-screen-line" />
                <span className="dz-screen-line dz-screen-line-short" />
                <span className="dz-screen-button" />
              </div>
            </div>
            <div className="dz-laptop-base" />
          </div>
        </div>
      </div>
    </section>
  );
}

// §04 How we build: the seven real steps of our process, as numbered cards (not an example, so the
// eyebrow names them as ours: how.exampleLabel)
export function FlagshipHow({ content }: ServiceSectionProps) {
  const { how } = content;
  return (
    <section aria-labelledby="service-how" className={section}>
      <SectionHeading id="service-how" index={3} eyebrow={how.exampleLabel} heading={how.heading} lede={how.lede} />
      <ol className="mt-12 grid gap-card-gap sm:grid-cols-2 lg:grid-cols-4">
        {how.steps.map((step, index) => (
          <li
            key={step.title}
            className={[
              'grid content-start gap-2 rounded-2xl border p-5',
              index === 0 ? 'border-accent-violet bg-wash-websites' : 'border-line bg-surface',
            ].join(' ')}
          >
            <span className="dz-num dz-num-signal font-mono text-label" data-num={String(index + 1).padStart(2, '0')} />
            <h3 className="text-h4 text-ink">{step.title}</h3>
            <p className="text-small text-ink-secondary">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// §05 What you get, and "Built on the same stack as this site" under the Websites photo (P20)
export function FlagshipDeliverables({ content, service }: ServiceSectionProps) {
  const photoId = SERVICE_PHOTO[service.slug ?? ''];
  return (
    <section aria-labelledby="service-get" className={section}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-16">
        <div>
          <SectionHeading
            id="service-get"
            index={4}
            eyebrow={serviceTemplate.eyebrows.deliverables}
            heading={content.deliverables.heading}
          />
          <ul className="mt-10 grid gap-3.5 text-small text-ink">
            {content.deliverables.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Glyph name="check" className="mt-0.5 size-4.5 shrink-0 text-violet" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <section aria-labelledby="service-works" className="grid content-start gap-4">
          {photoId ? (
            <Photo
              asset={photo(photoId, { alt: content.heroPhotoAlt })}
              sizes="(min-width: 64rem) 28rem, 100vw"
              className="aspect-[3/2] w-full rounded-2xl object-cover"
            />
          ) : null}
          <h2 id="service-works" className="mt-2 text-h3 text-balance text-ink">
            {content.worksWith.heading}
          </h2>
          <p className="text-small text-ink-secondary">{content.worksWith.lede}</p>
          <ul className="flex flex-wrap gap-2">
            {content.worksWith.platforms.map((platform) => (
              <li
                key={platform}
                className="inline-flex min-h-9 items-center rounded-full border border-line bg-surface px-3 text-caption text-ink"
              >
                {platform}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
