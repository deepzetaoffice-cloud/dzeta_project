// Placeholder Home copy for P0, approved in docs/plans/2026-09-30-p0-foundation.md (section D).
// The real Home replaces it in P5 (docs/design/home.md).
import { siteConfig } from '@/lib/site-config';

export const homeContent = {
  title: 'AI Automation and Custom Websites in the UAE',
  description: `${siteConfig.brandName} builds custom-coded websites, SEO and AI search visibility, and AI automation for UAE businesses. The full site is coming: email ${siteConfig.email}.`,
  heading: 'AI automation and custom-coded websites for UAE businesses',
  intro: siteConfig.positioningLine,
  // Rendered as: "<contactBefore><email link><contactAfter>"
  contactBefore: 'The full website is being built. To talk now, email ',
  contactAfter: '.',
} as const;
