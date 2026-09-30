// Error page copy, approved in docs/plans/2026-09-30-p2-layout-shell.md (section N).
import { siteConfig } from '@/lib/site-config';

export const errorContent = {
  // Unbranded, like every page title; global-error.tsx adds the brand (08 §1).
  title: 'Something went wrong',
  heading: 'Something went wrong',
  body: 'This page didn’t load. Try again, or go to the home page.',
  retry: 'Try again',
  homeLink: `Go to the ${siteConfig.brandName} home page`,
} as const;
