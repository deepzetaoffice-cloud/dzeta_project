import { whatsappHref } from '@/components/ui/CtaButton';
import { shellContent } from '@/content/en/shell';

// The floating WhatsApp button (decision 0024; docs/design/conversion-path.md): the primary contact
// CTA, site-wide at the bottom inline-end corner. The contact page (R005) is itself the contact
// surface, so its own plan excludes the float when that page ships. While the WhatsApp fact is
// unconfirmed the button is absent from the HTML entirely, not CSS-hidden (facts §2).
// - The theme sits on the wrapper, never on the link that takes focus (0015) — the same shape as
//   the sticky CTA bar.
// - glass-frost (dz-glass, the baked tint — never the action gradient, so the one-gradient rule
//   holds, C42) with hover-outline (dz-target); the plan's effect register, no others. No
//   JavaScript, no live blur: a phone pays only these bytes.
// - The consent banner outranks it (the 360 px priority list), so it gives way while the banner
//   asks — out of sight and out of the Tab order, like the sticky bar, not under it (WCAG 2.4.11).
// - Below 1024 px it lifts above the sticky CTA bar on the bar's own height token; from 1024 px it
//   sits at the corner with safe-area padding. Logical properties only, so RTL needs nothing.
export function WhatsAppFloat() {
  const href = whatsappHref();
  if (!href) return null;
  return (
    <div
      data-theme="dark"
      data-wa-float=""
      className="fixed z-(--dz-layer-sticky) end-5 bottom-[calc(var(--dz-sticky-height)_+_0.75rem)] lg:bottom-[max(1.25rem,env(safe-area-inset-bottom))] [:root[data-consent=ask]_&]:invisible"
    >
      <a
        href={href}
        className="dz-glass dz-target inline-flex min-h-12 items-center rounded-pill px-5 text-small font-bold text-fg-strong no-underline"
      >
        {shellContent.whatsappLabel}
      </a>
    </div>
  );
}
