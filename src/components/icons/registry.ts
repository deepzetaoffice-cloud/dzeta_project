// The icon names the content files use (kept verbatim in the v3 rebuild, decision 0033): their types
// stay here, at the path the content imports them from. The Signal & Depth icon drawings are gone;
// v3 draws the 18 UI glyphs (src/components/ui/Glyph.tsx, from Figma) and the pillar marks
// (src/components/ui/PillarMark.tsx). docs/ai/05 §6.

// The four pillars (C6), as the taxonomy's view_service `pillar` values
export type Pillar = 'ai' | 'web' | 'software' | 'ranking';
export const PILLARS: readonly Pillar[] = ['ai', 'web', 'software', 'ranking'];

// The interface icons the content names (the privacy glance cards, a demo trigger)
export type Tier1Name =
  | 'arrow'
  | 'send'
  | 'check'
  | 'menu'
  | 'close'
  | 'globe'
  | 'chevron'
  | 'external-link'
  | 'audit'
  | 'build'
  | 'launch'
  | 'improve'
  | 'industry-b2b'
  | 'industry-commerce'
  | 'industry-property'
  | 'industry-services'
  | 'lock'
  | 'mail'
  | 'shield';

// The service icons the navigation names (v3 shows the pillar's mark instead)
export type Tier2Name =
  | 'whatsapp-ai-agent'
  | 'ai-voice-receptionist'
  | 'booking-automation-system'
  | 'speed-to-lead-system'
  | 'automated-quotation-tracking'
  | 'sales-follow-up-nurture'
  | 'crm-setup-automation'
  | 'appointment-reminders-no-show-reduction'
  | 'review-reputation-automation'
  | 'ai-shopping-visibility'
  | 'custom-coded-websites'
  | 'ai-citation-aeo-geo'
  | 'local-ai-dominance'
  | 'ai-ad-creative';
