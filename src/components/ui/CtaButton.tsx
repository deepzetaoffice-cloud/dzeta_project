import { Icon } from '@/components/icons/Icon';
import { shellContent } from '@/content/en/shell';
import { isLive, routePath } from '@/lib/routes';
import type { CTA_IDS } from '@/lib/tracking/taxonomy';
import { siteConfig } from '@/lib/site-config';

// The CTA, "Book a free AI audit" (P2 plan, H3; docs/ai/05 §2, one gradient CTA per view). The action
// gradient sits on its own layer, so the header's hand-off is a cross-fade with no layout change (C42),
// and hover-charge's bead, rim light and sheen live inside that layer, shown only while it is.
// - primary: an in-page CTA, always on the gradient (hover-charge, pointer-magnet, touch-press).
// - header: outline at rest (hover-outline); cta.ts gives it the gradient on desktop while no
//   in-page primary CTA is on screen. Without JavaScript it stays outline, so a view never shows two.
// The wrapper is the pointer controller's target (pointer.ts), so the link can drift inside it.
// Tracking (P3 plan, G): `data-cta-id` names the CTA in the taxonomy (cta_click's cta_id); the tracking
// runtime reads it, with where the CTA sits, from the click. The component carries no tracking code.

// The CTA's target: the audit page once it ships, an email with a subject until then (Q1).
export function auditHref(): string {
  return isLive('R002')
    ? routePath('R002')
    : `mailto:${siteConfig.email}?subject=${encodeURIComponent(shellContent.ctaEmailSubject)}`;
}

// The WhatsApp deep link (decision 0024): wa.me/<number>, digits only — no plus, no spaces. The
// number is derived from siteConfig, never typed (check:facts). Null-safe: while the WhatsApp fact
// is unconfirmed this is null, and every caller hides itself (facts §2).
export function whatsappHref(): string | null {
  const digits = siteConfig.whatsapp?.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : null;
}

// The call link (decision 0024): tel: plus the international format from the one config field —
// the same string the footer shows (NAP, facts §2). Null-safe the same way.
export function telHref(): string | null {
  return siteConfig.phone ? `tel:${siteConfig.phone}` : null;
}

// The header button's target (decision 0024): the Deepzeta Agent panel once P7 ships; until then an
// honest fallback to WhatsApp, and to the audit email only if that fact were ever unconfirmed again.
// P7 swaps this one function for the panel's trigger — the label, placement and markup stay as they are.
export function agentHref(): string {
  return whatsappHref() ?? auditHref();
}

export type CtaButtonProps = {
  href: string;
  label: string;
  variant: 'primary' | 'header';
  /** Fill the width of its container: the mobile sheet's thumb zone */
  wide?: boolean;
  /** Its name in the taxonomy (cta_click's cta_id); every CTA today is the audit's */
  ctaId?: (typeof CTA_IDS)[number];
  className?: string;
};

export function CtaButton({ href, label, variant, wide = false, className, ctaId = 'book_audit' }: CtaButtonProps) {
  const classes = [
    'dz-cta',
    `dz-cta--${variant}`,
    'relative isolate inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-pill px-5.5 font-bold whitespace-nowrap no-underline',
    // Below 360 px the compact bar holds the logo, this and the menu button only with less padding
    variant === 'header' ? 'max-xs:px-3' : '',
    wide ? 'w-full' : '',
  ].join(' ');
  const content = (
    <>
      <span className="dz-cta-charge" aria-hidden="true">
        <span className="dz-cta-bead" />
        <span className="dz-cta-rim" />
        <span className="dz-cta-sheen" />
      </span>
      <span className="dz-cta-label">{label}</span>
      {variant === 'primary' ? (
        <>
          <span className="dz-cta-px" aria-hidden="true" />
          <Icon name="arrow" size={20} className="dz-cta-arrow" />
        </>
      ) : null}
    </>
  );
  const wrapper = ['dz-magnet', wide ? 'block' : 'inline-block', className].filter(Boolean).join(' ');
  return (
    <span className={wrapper} data-fx-pointer="">
      <a href={href} className={classes} data-cta={variant} data-cta-id={ctaId}>
        {content}
      </a>
    </span>
  );
}
