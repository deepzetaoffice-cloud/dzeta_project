import { Glyph } from '@/components/ui/Glyph';
import { shellContent } from '@/content/en/shell';
import { isLive, routePath } from '@/lib/routes';
import type { CTA_IDS } from '@/lib/tracking/taxonomy';
import { siteConfig } from '@/lib/site-config';

// The audit CTA, "Book a free AI audit" (docs/design/conversion-path.md; decision 0033 §9). Solid
// violet wherever it sits (C82). Tracking: `data-cta` says which CTA it is and `data-cta-id` names it
// in the taxonomy (cta_click's cta_id); the tracking runtime reads both, with where the CTA sits,
// from the click. The component carries no tracking code (09; clicks.ts).

// The CTA's target: the audit page once it ships, an email with a subject until then.
export function auditHref(): string {
  return isLive('R002')
    ? routePath('R002')
    : `mailto:${siteConfig.email}?subject=${encodeURIComponent(shellContent.ctaEmailSubject)}`;
}

// The WhatsApp deep link (decision 0024): wa.me/<number>, digits only. The number comes from
// siteConfig, never typed (check:facts). Null while the WhatsApp fact is unconfirmed: every caller
// then leaves itself out (facts §2).
export function whatsappHref(): string | null {
  const digits = siteConfig.whatsapp?.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : null;
}

// The call link (decision 0024): tel: plus the one config field, the same string the footer shows.
export function telHref(): string | null {
  return siteConfig.phone ? `tel:${siteConfig.phone}` : null;
}

// The header button's target (decisions 0024 and 0033 §9): until the audit page ships, an honest
// fallback to WhatsApp, and to the audit email only if that fact were ever unconfirmed again.
export function agentHref(): string {
  if (isLive('R002')) return routePath('R002');
  return whatsappHref() ?? auditHref();
}

export type CtaButtonProps = {
  href: string;
  label: string;
  /** `primary`: an in-page CTA (a hero's, a section's, the finale's, the sticky bar's, the sheet's).
      `header`: the header's button. */
  variant: 'primary' | 'header';
  size?: 'l' | 'm';
  /** Fill the width of its container: the mobile menu's CTA bar, the sticky bar */
  wide?: boolean;
  /** Its name in the taxonomy (cta_click's cta_id); every CTA today is the audit's */
  ctaId?: (typeof CTA_IDS)[number];
  className?: string;
};

export function CtaButton({
  href,
  label,
  variant,
  size = variant === 'header' ? 'm' : 'l',
  wide = false,
  ctaId = 'book_audit',
  className,
}: CtaButtonProps) {
  const classes = [
    'dz-press inline-flex items-center justify-center gap-2 rounded-full bg-action text-on-color no-underline whitespace-nowrap',
    size === 'l' ? 'min-h-14 px-7 text-button-l' : 'min-h-11 px-5 text-button-m',
    wide ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <a href={href} className={classes} data-cta={variant} data-cta-id={ctaId}>
      {label}
      <Glyph name="arrow-up-right" className="size-5" />
    </a>
  );
}
