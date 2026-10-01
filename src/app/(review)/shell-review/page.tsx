import { notFound } from 'next/navigation';
import { Icon, type Tier1Size, type Tier3Size } from '@/components/icons/Icon';
import { auditHref } from '@/components/layout/SiteHeader';
import { CtaButton } from '@/components/ui/CtaButton';
import { TIER_3, type Tier3Name } from '@/components/icons/registry';
import { shellContent } from '@/content/en/shell';
import { shellReviewContent } from '@/content/en/shell-review';
import { env } from '@/lib/env';

// The shell review page (P2 plan, A3; registry R165): the complete shell with every item shown, for
// the owner's review on each Vercel preview and for e2e and lhci. A production build returns 404, so
// visitors never reach it; it's never linked, so it's absent from the sitemap and the llms files.
// The hero's primary CTA is there so the header's hand-off can be seen (C42).

const TIER_3_SIZES: Tier3Size[] = [64, 96, 128, 160];
const TIER_1_SIZES: Tier1Size[] = [16, 20, 24];
const NEW_TIER_1 = ['chevron', 'external-link'] as const;

export default function ShellReviewPage() {
  if (env().vercelEnv === 'production') notFound();
  const { banner, heading, intro, icons, sections } = shellReviewContent;
  const tier3 = Object.keys(TIER_3) as Tier3Name[];
  return (
    <>
      <p className="bg-surface px-gutter py-2 text-small text-fg-strong">{banner}</p>
      <div className="mx-auto max-w-measure px-gutter py-section">
        <h1 className="text-h1">{heading}</h1>
        <p className="mt-4">{intro}</p>
        <CtaButton variant="primary" href={auditHref()} label={shellContent.cta} className="mt-8" />
      </div>
      {sections.map((section, index) => (
        <section key={section.heading} data-theme={section.theme} aria-labelledby={`review-section-${index}`}>
          <div className="mx-auto max-w-measure px-gutter py-chapter">
            <h2 id={`review-section-${index}`} className="text-h2">
              {section.heading}
            </h2>
            <p className="mt-4">{section.body}</p>
          </div>
        </section>
      ))}
      <section aria-labelledby="review-icons" className="mx-auto max-w-page px-gutter py-chapter">
        <h2 id="review-icons" className="text-h2">
          {icons.heading}
        </h2>
        <p className="mt-4 max-w-measure">{icons.intro}</p>
        <ul className="mt-8 grid gap-12">
          {tier3.map((name) => (
            <li key={name} id={`icon-${name}`}>
              {/* A placeholder link, as a mega-menu column head holds its icon (the host, 05 §6) */}
              <a href={`#icon-${name}`} className="dz-icon-host flex flex-wrap items-end gap-6 text-fg-strong">
                {TIER_3_SIZES.map((size) => (
                  <Icon key={size} name={name} size={size} />
                ))}
                <span className="basis-full">{TIER_3[name].name}</span>
              </a>
              <p className="mt-2 text-small text-fg-muted">
                {icons.pixelIs} {TIER_3[name].pixelIs}.
              </p>
            </li>
          ))}
        </ul>
        <h3 className="mt-12 text-h3">{icons.interfaceHeading}</h3>
        <ul className="mt-6 grid gap-6">
          {NEW_TIER_1.map((name) => (
            <li key={name} className="flex items-center gap-6 text-fg-strong">
              {TIER_1_SIZES.map((size) => (
                <Icon key={size} name={name} size={size} />
              ))}
              <span>{icons.interfaceLabels[name]}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
