// 404 copy, approved in docs/plans/2026-09-30-p0-foundation.md (section D).
import { siteConfig } from '@/lib/site-config';

export const notFoundContent = {
  // global-not-found bypasses the root layout's title template, so the brand suffix is added here.
  title: `Page not found | ${siteConfig.brandName}`,
  heading: 'Page not found',
  body: 'This page doesn’t exist.',
  homeLink: `Go to the ${siteConfig.brandName} home page`,
} as const;
