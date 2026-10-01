import type { ReactNode } from 'react';
import { IconDefs } from '@/components/icons/IconDefs';
import { FxRuntime } from '@/components/layout/FxRuntime';
import { SiteShell } from '@/components/layout/SiteShell';
import { TrackingRuntime } from '@/components/layout/TrackingRuntime';
import { env } from '@/lib/env';
import { initScript } from '@/lib/fx/init-script';
import { locales, type Locale } from '@/lib/i18n/locales';
import { consentInitScript } from '@/lib/tracking/consent-init';
import { fontVariables } from '@/styles/fonts';

// The one document for every page: <html> and <body> with the fonts, and the locale's lang and dir
// (docs/ai/11 §1; P2 plan, B1). Both root layouts and the 404, which skips the layouts, render it, so
// they can't drift apart. The error page renders its own document: it has to work when this one is
// what failed (B5).
// - The no-flash script is in <head> (conflict C40). It sets data-theme and data-effects on <html>
//   before React hydrates, so <html> suppresses the hydration warning.
// - The consent init script follows it (docs/ai/09 §2.2, §2.7; C52): the data layer and the Consent
//   Mode defaults, dataLayer[0], before GTM; and data-consent="ask" when the banner is due. Like the
//   no-flash script, it's a static string from our own constants (C40, C53).
// - IconDefs, the icons' shared definitions, is the first thing in <body>, once per page (0018; 02 §3.8).
// - SiteShell wraps every page: the skip link, the header and <main> (plan B1). `review` is the review
//   page's: every nav item shown, as placeholders (plan A3).
// - FxRuntime starts the shared effect controllers after hydration (plan G).
// - TrackingRuntime handles consent, page views and the tracked clicks (P3 plan, G), once per document.

export type SiteDocumentProps = {
  locale: Locale;
  review?: boolean;
  children: ReactNode;
};

export function SiteDocument({ locale, review = false, children }: SiteDocumentProps) {
  const { lang, dir } = locales[locale];
  return (
    <html lang={lang} dir={dir} className={fontVariables} suppressHydrationWarning>
      {/* The rule is for the Pages Router and finds the App Router by an `app/` path; this is the App
          Router document, rendered from outside src/app/ (conflict C44). */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
        <script dangerouslySetInnerHTML={{ __html: consentInitScript }} />
      </head>
      <body>
        <IconDefs />
        <SiteShell review={review}>{children}</SiteShell>
        <FxRuntime />
        <TrackingRuntime gtm={env().gtm !== null} />
      </body>
    </html>
  );
}
