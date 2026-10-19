// The SEO contract's page half (docs/ai/08 §7; decision 0033): every route describes itself with a
// PageSeo, and pageMetadata() turns it into Next.js metadata: the title (the root template adds the
// brand once), the description, the self-canonical, Open Graph and Twitter. check:seo asserts the
// same rules on the built HTML (tests/gates/rules.ts reads the ranges below), so a page that breaks
// one fails the build's gates. Character counts are common practice; Google truncates by pixel width.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Metadata } from 'next';
import type { Locale } from '../i18n/locales.ts';
import { absoluteUrl } from '../url.ts';
import { brandedTitle } from './title.ts';

// The rendered <title>, brand suffix included (08 §1)
export const TITLE_LENGTH = { min: 30, max: 60 } as const;
// The meta description (08 §1)
export const DESCRIPTION_LENGTH = { min: 120, max: 160 } as const;

// The site's default OG image (src/app/opengraph-image.jpg, 1200 × 630) and its alt text, read from its
// own .alt.txt so the words live once. A page that sets openGraph replaces the inherited file-based
// image, so every page names it explicitly; per-page next/og images replace it in Phase D (08 §1).
const OG_IMAGE = {
  url: '/opengraph-image.jpg',
  width: 1200,
  height: 630,
  alt: readFileSync(join(process.cwd(), 'src', 'app', 'opengraph-image.alt.txt'), 'utf8').trim(),
};

// og:locale per site locale: English for the UAE market now, Arabic after launch (11 §2)
const OG_LOCALE: Record<Locale, string> = { en: 'en_AE' };

export type PageSeo = {
  /** The page's own title, without the brand: the root template adds " | Deepzeta AI" */
  title: string;
  /** 120–160 characters, answer-first (08 §1) */
  description: string;
  /** The page's own path, e.g. "/services": the canonical is built from it, never typed (C27) */
  path: string;
  /** Home sets its title as an absolute string: a layout's template doesn't reach its own segment */
  root?: boolean;
  /** `article` for guides and posts; every page today is a website page */
  type?: 'website' | 'article';
  locale?: Locale;
};

export function pageMetadata({
  title,
  description,
  path,
  root = false,
  type = 'website',
  locale = 'en',
}: PageSeo): Metadata {
  const url = absoluteUrl(path, locale);
  const full = brandedTitle(title);
  return {
    title: root ? { absolute: full } : title,
    description,
    alternates: { canonical: url },
    openGraph: { title: full, description, url, type, locale: OG_LOCALE[locale], images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title: full, description, images: [OG_IMAGE] },
  };
}
