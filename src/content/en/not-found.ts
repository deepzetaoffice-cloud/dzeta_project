// 404 copy, approved in docs/plans/2026-09-30-p0-foundation.md (section D).
import { siteConfig } from '@/lib/site-config';

export const notFoundContent = {
  // Unbranded, like every page title; global-not-found.tsx adds the brand (08 §1).
  title: 'Page not found',
  heading: 'Page not found',
  body: 'This page doesn’t exist.',
  homeLink: `Go to the ${siteConfig.brandName} home page`,
} as const;
