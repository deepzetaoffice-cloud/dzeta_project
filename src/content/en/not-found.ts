// 404 copy, approved in docs/plans/2026-09-30-p0-foundation.md (section D); the playground's hint and
// its page chips are Figma 61:1054's own text (approved with the file; docs/design/not-found.md).
import type { RouteId } from '@/lib/routes';
import { siteConfig } from '@/lib/site-config';

export const notFoundContent = {
  // Unbranded, like every page title; global-not-found.tsx adds the brand (08 §1).
  title: 'Page not found',
  heading: 'Page not found',
  body: 'This page doesn’t exist.',
  homeLink: `Go to the ${siteConfig.brandName} home page`,
  // Shown only while the shapes can be thrown (shape-throw)
  hint: 'Grab a shape and throw it: each one is a page you can go to.',
  // The chips' list, for screen readers and keyboards
  pagesLabel: 'Pages you can go to',
  // The eight page chips, in Figma's order; each shows only while its page is live (04 §1.4)
  pages: [
    { route: 'R010', label: 'Services' },
    { route: 'R011', label: 'Automation' },
    { route: 'R002', label: 'Free AI audit' },
    { route: 'R012', label: 'Websites' },
    { route: 'R152', label: 'Pricing' },
    { route: 'R150', label: 'Work' },
    { route: 'R140', label: 'Designer Studio' },
    { route: 'R110', label: 'Deepzeta Sync' },
  ] satisfies readonly { route: RouteId; label: string }[],
} as const;
