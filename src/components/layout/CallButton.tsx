import { telHref } from '@/components/ui/CtaButton';
import { shellContent } from '@/content/en/shell';
import { siteConfig } from '@/lib/site-config';

// The Call button (decision 0024): the phone number as a deliberate contact CTA in the footer's
// contact block (the owner, 2026-10-08: WhatsApp is the one floating button; Call lives with the
// contact surfaces). glass-frost with hover-outline — never the action gradient (C42) — and no
// JavaScript. While the phone fact is unconfirmed it is absent from the HTML (facts §2). The number
// is siteConfig's own string, real text inside <address>, so the footer's NAP parity holds.
export function CallButton() {
  const href = telHref();
  if (!href) return null;
  return (
    <a
      href={href}
      data-theme="dark"
      className="dz-glass dz-target inline-flex min-h-11 items-center self-start rounded-pill px-4 text-small font-bold text-fg-strong no-underline"
    >
      {shellContent.callLabel}
      <span className="ms-2 font-medium">{siteConfig.phone}</span>
    </a>
  );
}
