import Link from 'next/link';
import { Icon } from '@/components/icons/Icon';

// The CTA, "Book a free AI audit" (P2 plan, H3; docs/ai/05 §2, one gradient CTA per view). The action
// gradient sits on its own layer, so the header's hand-off is a cross-fade with no layout change (C42),
// and hover-charge's bead, rim light and sheen live inside that layer, shown only while it is.
// - primary: an in-page CTA, always on the gradient (hover-charge, pointer-magnet, touch-press).
// - header: outline at rest (hover-outline); cta.ts gives it the gradient on desktop while no
//   in-page primary CTA is on screen. Without JavaScript it stays outline, so a view never shows two.
// The wrapper is the pointer controller's target (pointer.ts), so the link can drift inside it.

export type CtaButtonProps = {
  href: string;
  label: string;
  variant: 'primary' | 'header';
  className?: string;
};

export function CtaButton({ href, label, variant, className }: CtaButtonProps) {
  const classes = [
    'dz-cta',
    `dz-cta--${variant}`,
    'relative isolate inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-pill px-5.5 font-bold whitespace-nowrap no-underline',
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
  return (
    <span className={['dz-magnet inline-block', className].filter(Boolean).join(' ')} data-fx-pointer="">
      {href.startsWith('/') ? (
        <Link href={href} className={classes} data-cta={variant}>
          {content}
        </Link>
      ) : (
        <a href={href} className={classes} data-cta={variant}>
          {content}
        </a>
      )}
    </span>
  );
}
