import type { Metadata } from 'next';
import Link from 'next/link';
import { notFoundContent } from '@/content/en/not-found';
import { locales } from '@/lib/i18n/locales';
import { brandedTitle } from '@/lib/seo/title';
import '@/styles/globals.css';

const locale = locales.en;

// Every unmatched URL lands here, whichever root layout it would have used (English now, Arabic in
// P11). It bypasses the layouts (and their title template), so it imports its own styles and formats
// its own title. Next.js adds `noindex` to 404s.
export const metadata: Metadata = {
  title: brandedTitle(notFoundContent.title),
};

export default function GlobalNotFound() {
  return (
    <html lang={locale.lang} dir={locale.dir}>
      <body>
        <main className="mx-auto max-w-prose px-6 py-16">
          <h1 className="text-3xl font-bold text-balance">{notFoundContent.heading}</h1>
          <p className="mt-4">{notFoundContent.body}</p>
          <p className="mt-4">
            <Link className="underline" href="/">
              {notFoundContent.homeLink}
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
