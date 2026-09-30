'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { errorContent } from '@/content/en/error';
import { locales } from '@/lib/i18n/locales';
import { brandedTitle } from '@/lib/seo/title';
import { siteConfig } from '@/lib/site-config';
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
        <header data-theme="dark" className="mx-auto max-w-measure px-gutter pt-section">
          <Logo variant="lockup" label={siteConfig.brandName} className="h-9" />
        </header>
        <main className="mx-auto max-w-measure px-gutter pt-8 pb-section">
          <h1 className="text-h1">{errorContent.heading}</h1>
          <p className="mt-4">{errorContent.body}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() => retry()}
              className="min-h-11 rounded-pill border border-border px-6 text-fg-strong hover:border-frost"
            >
              {errorContent.retry}
            </button>
            <Link className="inline-flex min-h-11 items-center text-link underline" href="/">
              {errorContent.homeLink}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
