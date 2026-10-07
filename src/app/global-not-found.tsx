import type { Metadata, Viewport } from 'next';
import { SiteDocument } from '@/components/layout/SiteDocument';
import { notFoundContent } from '@/content/en/not-found';
import { routePath } from '@/lib/routes';
import { brandedTitle } from '@/lib/seo/title';
import { siteViewport } from '@/lib/viewport';
import '@/styles/globals.css';

// Every unmatched URL lands here, whichever root layout it would have used (English now, Arabic in
// P11). It bypasses the layouts (and their title template), so it imports its own styles, renders the
// shared document and formats its own title. Next.js adds `noindex` to 404s.
export const metadata: Metadata = {
  title: brandedTitle(notFoundContent.title),
};

// The layouts' viewport doesn't reach this page, so it exports the same one.
export const viewport: Viewport = siteViewport;

export default function GlobalNotFound() {
  return (
    <SiteDocument locale="en">
      <div className="mx-auto max-w-measure px-gutter py-section">
        <h1 className="text-h1">{notFoundContent.heading}</h1>
        <p className="mt-4">{notFoundContent.body}</p>
        <p className="mt-4">
          {/* A 44 px tap target (05 §7, WCAG 2.5.5), without changing the line's look. */}
          <a className="inline-flex min-h-11 items-center text-link underline" href={routePath('R001')}>
            {notFoundContent.homeLink}
          </a>
        </p>
      </div>
    </SiteDocument>
  );
}
