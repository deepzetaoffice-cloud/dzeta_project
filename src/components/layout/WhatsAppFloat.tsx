import { whatsappHref } from '@/components/ui/CtaButton';
import { shellContent } from '@/content/en/shell';

// The floating WhatsApp button (decision 0024; docs/design/conversion-path.md): the primary contact
// CTA, site-wide at the bottom inline-end corner. The contact page (R005) is itself the contact
// surface, so its own plan excludes the float when that page ships. While the WhatsApp fact is
// unconfirmed the button is absent from the HTML entirely, not CSS-hidden (facts §2).
// - glass-frost (dz-glass, the baked tint — never the action gradient, so the one-gradient rule
//   holds, C42) with hover-outline (dz-target); the plan's effect register, no others.
// - No JavaScript, no live blur: a phone pays only these bytes. It is a real link in the Tab order;
//   its visible text is its accessible name, so text readers and crawlers get it too.
// - Below 1024 px it lifts above the sticky CTA bar (the 360 px priority list: consent, the sticky
//   bar, then this) on the bar's own height token; from 1024 px it sits at the corner with
//   safe-area padding. Logical properties only, so RTL needs nothing.
export function WhatsAppFloat() {
  const href = whatsappHref();
  if (!href) return null;
  return (
    <a
      href={href}
      data-theme="dark"
      className="dz-glass dz-target fixed z-(--dz-layer-sticky) inline-flex min-h-12 items-center rounded-pill px-5 text-small font-bold text-fg-strong no-underline end-5 bottom-[calc(var(--dz-sticky-height)_+_0.75rem)] lg:bottom-[max(1.25rem,env(safe-area-inset-bottom))]"
    >
      {shellContent.whatsappLabel}
    </a>
  );
}
