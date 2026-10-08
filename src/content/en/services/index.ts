// The service pages' copy by catalogue slug (the P6 part A plan, S10–S11): the /services/[slug]
// template reads a page's copy and its FAQ questions from here. A service joins this record when
// its copy is written; the route serves only the live registry rows (src/lib/routes.ts), so a
// record entry alone publishes nothing. Keys are the catalogue's slugs (src/content/catalogue.ts).
import { speedToLeadSystemFaq, type FaqQuestion } from '@/content/en/faq-bank';
import { speedToLeadSystem } from '@/content/en/services/speed-to-lead-system';
import type { ServicePageContent } from '@/content/en/services/types';

/** One service page: its copy and its FAQ questions (most-asked first) */
export type ServicePage = { content: ServicePageContent; faq: readonly FaqQuestion[] };

export const servicePages: Readonly<Record<string, ServicePage>> = {
  'speed-to-lead-system': { content: speedToLeadSystem, faq: speedToLeadSystemFaq },
};
