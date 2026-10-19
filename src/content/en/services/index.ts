// The service pages' copy by catalogue slug (the P6 part A plan, S10–S11): the /services/[slug]
// template reads a page's copy and its FAQ questions from here. A service joins this record when
// its copy is written; the route serves only the live registry rows (src/lib/routes.ts), so a
// record entry alone publishes nothing. Keys are the catalogue's slugs (src/content/catalogue.ts).
import {
  aiAdCreativeFaq,
  aiCitationAeoGeoFaq,
  aiShoppingVisibilityFaq,
  localAiDominanceFaq,
  appointmentRemindersNoShowReductionFaq,
  automatedQuotationTrackingFaq,
  bookingAutomationSystemFaq,
  crmSetupAutomationFaq,
  reviewReputationAutomationFaq,
  salesFollowUpNurtureFaq,
  speedToLeadSystemFaq,
  customCodedWebsitesFaq,
  aiLeadQualificationScoringFaq,
  proposalAutomationFaq,
  viewingSiteVisitSchedulingFaq,
  ticketingComplaintTrackingFaq,
  loyaltyRenewalWinBackAutomationFaq,
  jobWorkOrderManagementFaq,
  preventiveMaintenanceSchedulingFaq,
  inventoryStockAutomationFaq,
  taskApprovalWorkflowsFaq,
  invoicingPaymentCollectionFaq,
  type FaqQuestion,
} from '@/content/en/faq-bank';
import { speedToLeadSystem } from '@/content/en/services/speed-to-lead-system';
import { automatedQuotationTracking } from '@/content/en/services/automated-quotation-tracking';
import { salesFollowUpNurture } from '@/content/en/services/sales-follow-up-nurture';
import { crmSetupAutomation } from '@/content/en/services/crm-setup-automation';
import { bookingAutomationSystem } from '@/content/en/services/booking-automation-system';
import { appointmentRemindersNoShowReduction } from '@/content/en/services/appointment-reminders-no-show-reduction';
import { reviewReputationAutomation } from '@/content/en/services/review-reputation-automation';
import { aiShoppingVisibility } from '@/content/en/services/ai-shopping-visibility';
import { aiCitationAeoGeo } from '@/content/en/services/ai-citation-aeo-geo';
import { localAiDominance } from '@/content/en/services/local-ai-dominance';
import { aiAdCreative } from '@/content/en/services/ai-ad-creative';
import { customCodedWebsites } from '@/content/en/services/custom-coded-websites';
import { aiLeadQualificationScoring } from '@/content/en/services/ai-lead-qualification-scoring';
import { proposalAutomation } from '@/content/en/services/proposal-automation';
import { viewingSiteVisitScheduling } from '@/content/en/services/viewing-site-visit-scheduling';
import { ticketingComplaintTracking } from '@/content/en/services/ticketing-complaint-tracking';
import { loyaltyRenewalWinBackAutomation } from '@/content/en/services/loyalty-renewal-win-back-automation';
import { jobWorkOrderManagement } from '@/content/en/services/job-work-order-management';
import { preventiveMaintenanceScheduling } from '@/content/en/services/preventive-maintenance-scheduling';
import { inventoryStockAutomation } from '@/content/en/services/inventory-stock-automation';
import { taskApprovalWorkflows } from '@/content/en/services/task-approval-workflows';
import { invoicingPaymentCollection } from '@/content/en/services/invoicing-payment-collection';
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
  'ai-shopping-visibility': { content: aiShoppingVisibility, faq: aiShoppingVisibilityFaq },
  'ai-citation-aeo-geo': { content: aiCitationAeoGeo, faq: aiCitationAeoGeoFaq },
  'local-ai-dominance': { content: localAiDominance, faq: localAiDominanceFaq },
  'ai-ad-creative': { content: aiAdCreative, faq: aiAdCreativeFaq },
  'custom-coded-websites': { content: customCodedWebsites, faq: customCodedWebsitesFaq },
  'ai-lead-qualification-scoring': { content: aiLeadQualificationScoring, faq: aiLeadQualificationScoringFaq },
  'proposal-automation': { content: proposalAutomation, faq: proposalAutomationFaq },
  'viewing-site-visit-scheduling': { content: viewingSiteVisitScheduling, faq: viewingSiteVisitSchedulingFaq },
  'ticketing-complaint-tracking': { content: ticketingComplaintTracking, faq: ticketingComplaintTrackingFaq },
  'loyalty-renewal-win-back-automation': {
    content: loyaltyRenewalWinBackAutomation,
    faq: loyaltyRenewalWinBackAutomationFaq,
  },
  'job-work-order-management': { content: jobWorkOrderManagement, faq: jobWorkOrderManagementFaq },
  'preventive-maintenance-scheduling': {
    content: preventiveMaintenanceScheduling,
    faq: preventiveMaintenanceSchedulingFaq,
  },
  'inventory-stock-automation': { content: inventoryStockAutomation, faq: inventoryStockAutomationFaq },
  'task-approval-workflows': { content: taskApprovalWorkflows, faq: taskApprovalWorkflowsFaq },
  'invoicing-payment-collection': { content: invoicingPaymentCollection, faq: invoicingPaymentCollectionFaq },
};
