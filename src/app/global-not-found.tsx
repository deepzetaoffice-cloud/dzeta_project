import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { notFoundContent } from '@/content/en/not-found';
import { locales } from '@/lib/i18n/locales';
import { brandedTitle } from '@/lib/seo/title';
import { readToken } from '@/lib/tokens';
import { fontVariables } from '@/styles/fonts';
import '@/styles/globals.css';

const locale = locales.en;

// Every unmatched URL lands here, whichever root layout it would have used (English now, Arabic in
// P11). It bypasses the layouts (and their title template), so it imports its own styles and formats
// its own title. Next.js adds `noindex` to 404s.
export const metadata: Metadata = {
  title: brandedTitle(notFoundContent.title),
};

// The same as the English layout's: it doesn't reach this page.
export const viewport: Viewport = {
  themeColor: readToken('--dz-navy'),
  colorScheme: 'dark',
};

export default function GlobalNotFound() {
  return (
    <html lang={locale.lang} dir={locale.dir} className={fontVariables}>
      <body>
        <main className="mx-auto max-w-measure px-gutter py-section">
          <h1 className="text-h1">{notFoundContent.heading}</h1>
          <p className="mt-4">{notFoundContent.body}</p>
          <p className="mt-4">
            <Link className="text-link underline" href="/">
              {notFoundContent.homeLink}
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
