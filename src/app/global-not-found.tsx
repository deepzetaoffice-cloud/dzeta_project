import type { Metadata, Viewport } from 'next';
import { SiteDocument } from '@/components/layout/SiteDocument';
import { notFoundContent } from '@/content/en/not-found';
import { routePath } from '@/lib/routes';
import { brandedTitle } from '@/lib/seo/title';
import { siteUrl } from '@/lib/url';
import { siteViewport } from '@/lib/viewport';
import '@/styles/globals.css';

// Every unmatched URL lands here, whichever root layout it would have used (English now, Arabic in
// P11). It bypasses the layouts (and their title template), so it imports its own styles, renders the
// shared document and formats its own title. Next.js adds `noindex` to 404s.
export const metadata: Metadata = {
  // It skips the English layout, so it sets its own base for the OG image's absolute URL.
  metadataBase: new URL(siteUrl()),
  title: brandedTitle(notFoundContent.title),
};

// The layouts' viewport doesn't reach this page, so it exports the same one.
export const viewport: Viewport = siteViewport;

export default function GlobalNotFound() {
  return (
    <SiteDocument locale="en">
      {/* docs/design/not-found.md (Figma 61:1054): Phase C the copy block; Phase D adds shape-throw */}
      <div className="mx-auto max-w-page px-gutter py-section">
        <p className="font-mono text-label text-ink-tertiary uppercase">404</p>
        <h1 className="mt-3 text-hero-line">{notFoundContent.heading}</h1>
        <p className="mt-4 text-lead text-ink-secondary">{notFoundContent.body}</p>
        <a
          className="dz-press mt-8 inline-flex min-h-14 items-center rounded-full bg-action px-7 text-button-l text-on-color"
          href={routePath('R001')}
        >
          {notFoundContent.homeLink}
        </a>
      </div>
    </SiteDocument>
  );
}
