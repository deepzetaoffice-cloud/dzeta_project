// Error page copy, approved in docs/plans/2026-09-30-p2-layout-shell.md (section N).
// The brand name from brand.ts, not site-config: this copy ships with every page inside the root
// error page, and Turbopack ships whole modules (the P6 part A plan, L5).
import { BRAND_NAME } from '@/lib/brand';

export const errorContent = {
  // Unbranded, like every page title; global-error.tsx adds the brand (08 §1).
  title: 'Something went wrong',
  heading: 'Something went wrong',
  body: 'This page didn’t load. Try again, or go to the home page.',
  retry: 'Try again',
  homeLink: `Go to the ${BRAND_NAME} home page`,
} as const;
