// The service pages' copy by catalogue slug (the P6 part A plan, S10–S11): the /services/[slug]
// template reads a page's copy and its FAQ questions from here. A service joins this record when
// its copy is written; the route serves only the live registry rows (src/lib/routes.ts), so a
// record entry alone publishes nothing. Keys are the catalogue's slugs (src/content/catalogue.ts).
import {
  appointmentRemindersNoShowReductionFaq,
  automatedQuotationTrackingFaq,
  bookingAutomationSystemFaq,
  crmSetupAutomationFaq,
  reviewReputationAutomationFaq,
  salesFollowUpNurtureFaq,
  speedToLeadSystemFaq,
  type FaqQuestion,
} from '@/content/en/faq-bank';
import { speedToLeadSystem } from '@/content/en/services/speed-to-lead-system';
import { automatedQuotationTracking } from '@/content/en/services/automated-quotation-tracking';
import { salesFollowUpNurture } from '@/content/en/services/sales-follow-up-nurture';
import { crmSetupAutomation } from '@/content/en/services/crm-setup-automation';
import { bookingAutomationSystem } from '@/content/en/services/booking-automation-system';
import { appointmentRemindersNoShowReduction } from '@/content/en/services/appointment-reminders-no-show-reduction';
import { reviewReputationAutomation } from '@/content/en/services/review-reputation-automation';
import type { ServicePageContent } from '@/content/en/services/types';

/** One service page: its copy and its FAQ questions (most-asked first) */
export type ServicePage = { content: ServicePageContent; faq: readonly FaqQuestion[] };

export const servicePages: Readonly<Record<string, ServicePage>> = {
  'speed-to-lead-system': { content: speedToLeadSystem, faq: speedToLeadSystemFaq },
  'automated-quotation-tracking': { content: automatedQuotationTracking, faq: automatedQuotationTrackingFaq },
  'sales-follow-up-nurture': { content: salesFollowUpNurture, faq: salesFollowUpNurtureFaq },
  'crm-setup-automation': { content: crmSetupAutomation, faq: crmSetupAutomationFaq },
  'booking-automation-system': { content: bookingAutomationSystem, faq: bookingAutomationSystemFaq },
  'appointment-reminders-no-show-reduction': {
    content: appointmentRemindersNoShowReduction,
    faq: appointmentRemindersNoShowReductionFaq,
  },
  'review-reputation-automation': { content: reviewReputationAutomation, faq: reviewReputationAutomationFaq },
};
