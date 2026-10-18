'use client';

import { Wordmark } from '@/components/ui/Wordmark';
import { BRAND_NAME } from '@/lib/brand';
import { errorContent } from '@/content/en/error';
import { locales } from '@/lib/i18n/locales';
import { brandedTitle } from '@/lib/seo/title';
import { fontVariables } from '@/styles/fonts';
import '@/styles/globals.css';

const locale = locales.en;

// Shown when the root layout itself fails (P2 plan, B5; docs/design/not-found.md, "The error page"). It
// replaces the layout, so it renders its own document with the site's styles and fonts; it doesn't use
// SiteDocument, which carries the shell that may be what failed. The 404's calm stage without the
// playground, and only what it shows (0026): the white-background wordmark (C78) on its white pill,
// the copy, a retry button and the link home. No 3D, physics or scroll libraries.
// Error boundaries are Client Components, so there's no `metadata` export (React's <title> instead)
// and no `viewport` export (the theme colour is read from tokens.css at build, on the server).
// `retry` re-renders the failed segment (Next.js 16.3; the docs prefer it to `reset`).

export type GlobalErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function GlobalError({ retry }: GlobalErrorProps) {
  return (
    <html lang={locale.lang} dir={locale.dir} className={fontVariables}>
      <body>
        <title>{brandedTitle(errorContent.title)}</title>
        <main className="px-stage-inset pt-stage-inset">
          <div className="dz-lost relative mx-auto grid max-w-page place-items-center overflow-hidden rounded-stage bg-(image:--dz-grad-stage) px-gutter py-16 text-on-color">
            <header className="absolute inset-x-0 top-0 flex justify-center pt-6">
              <span className="inline-flex rounded-full bg-surface px-5 py-2.5 shadow-2">
                <Wordmark label={BRAND_NAME} className="h-[1.8rem]" />
              </span>
            </header>
            <div className="grid max-w-[40rem] justify-items-center gap-5 text-center">
              <h1 className="text-hero-line text-on-color">{errorContent.heading}</h1>
              <p className="text-lead">{errorContent.body}</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => retry()}
                  className="dz-press dz-cta-rim inline-flex min-h-14 items-center rounded-full bg-action px-7 text-button-l text-on-color"
                >
                  {errorContent.retry}
                </button>
                {/* A plain <a> (C67): a full reload home after an error. Home is the locale's path
                    prefix (11 §2), not routePath('R001'): Turbopack ships whole modules, so the route
                    table and the site config stay out of every page's first load. */}
                <a className="dz-press dz-button-on-color" href={locale.pathPrefix || '/'}>
                  {errorContent.homeLink}
                </a>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
