// The only builders of absolute URLs (docs/ai/08 §1, conflict C27). Canonicals, schema @ids, the
// sitemap, robots and llms files all go through here; no hostname literal appears anywhere else.
import { env } from './env.ts';
import { defaultLocale, locales, type Locale } from './i18n/locales.ts';

export function siteUrl(): string {
  return env().siteUrl;
}

// `path` is a site path without the locale prefix: "/" or "/services/ai-automation".
export function absoluteUrl(path: string, locale: Locale = defaultLocale): string {
  return buildAbsoluteUrl(siteUrl(), path, locale);
}

// Pure version, for tests. The home page is the bare origin (no trailing slash, docs/ai/08 §2.10).
export function buildAbsoluteUrl(origin: string, path: string, locale: Locale): string {
  if (!path.startsWith('/')) throw new Error(`absoluteUrl: the path must start with "/" (got "${path}").`);
  if (path.length > 1 && path.endsWith('/')) throw new Error(`absoluteUrl: no trailing slash (got "${path}").`);
  if (/[?#]/.test(path)) throw new Error(`absoluteUrl: no query or hash in a page path (got "${path}").`);
  return `${origin}${locales[locale].pathPrefix}${path === '/' ? '' : path}`;
}
