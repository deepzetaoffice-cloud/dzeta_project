'use client';

import { Logo } from '@/components/ui/Logo';
import { BRAND_NAME } from '@/lib/brand';
import { errorContent } from '@/content/en/error';
import { locales } from '@/lib/i18n/locales';
import { brandedTitle } from '@/lib/seo/title';
import { fontVariables } from '@/styles/fonts';
import '@/styles/globals.css';

const locale = locales.en;

// Shown when the root layout itself fails (P2 plan, B5). It replaces the layout, so it renders its own
// document with the site's styles and fonts; it doesn't use SiteDocument, which from part B carries
// the shell that may be what failed. Every first visit's theme, navy, is the stylesheet's default.
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
        <header className="mx-auto max-w-page px-gutter pt-section">
          {/* The locked logo is dark-only (C78): on an ink plate */}
          <span className="inline-flex rounded-full bg-inverse px-4 py-2">
            <Logo variant="lockup" label={BRAND_NAME} className="h-9" />
          </span>
        </header>
        <main className="mx-auto max-w-page px-gutter pt-8 pb-section">
          <h1 className="text-hero-line">{errorContent.heading}</h1>
          <p className="mt-4 max-w-measure text-lead text-ink-secondary">{errorContent.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() => retry()}
              className="inline-flex min-h-11 items-center rounded-full bg-action px-6 text-button-m text-on-color"
            >
              {errorContent.retry}
            </button>
            {/* A plain <a> (C67): a full reload home after an error. Home is the locale's path prefix
                (11 §2), not routePath('R001'): Turbopack ships whole modules, so the route table and
                the site config stay out of every page's first load. */}
            <a
              className="inline-flex min-h-11 items-center text-link underline underline-offset-4"
              href={locale.pathPrefix || '/'}
            >
              {errorContent.homeLink}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
