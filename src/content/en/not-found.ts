// 404 copy, approved in docs/plans/2026-09-30-p0-foundation.md (section D).
import { brandedTitle } from '@/lib/seo/title';
import { siteConfig } from '@/lib/site-config';

export const notFoundContent = {
  // global-not-found bypasses the root layout and its title template, so it formats its own title.
  title: brandedTitle('Page not found'),
  heading: 'Page not found',
  body: 'This page doesn’t exist.',
  homeLink: `Go to the ${siteConfig.brandName} home page`,
} as const;
