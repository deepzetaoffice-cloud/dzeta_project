import { telHref } from '@/components/ui/CtaButton';
import { shellContent } from '@/content/en/shell';
import { siteConfig } from '@/lib/site-config';

// The Call button (decision 0024): the phone number as a deliberate contact CTA in the footer's
// contact block (the owner, 2026-10-08: WhatsApp is the one floating button; Call lives with the
// contact surfaces). glass-frost with hover-outline — never the action gradient (C42) — and no
// JavaScript. While the phone fact is unconfirmed it is absent from the HTML (facts §2). The number
// is siteConfig's own string, real text inside <address>, so the footer's NAP parity holds.
// - The theme stays on the footer's own container (0015: a theme belongs on containers, never on
//   something that takes focus), so this carries no data-theme of its own.
// - The <p> wrapper spaces the pill clear of the email link's extended hit area: dz-target::before
//   reaches about 13 px below an 18 px line (05 §7's 44 px minimum), and two stacked hit areas would
//   overlap — the later element in the DOM would win the hit test and eat the email link's taps.
export function CallButton() {
  const href = telHref();
  if (!href) return null;
  return (
    <p className="mt-4">
      <a
        href={href}
        className="dz-glass dz-target inline-flex min-h-11 items-center rounded-pill px-4 text-small font-bold text-fg-strong no-underline"
      >
        {shellContent.callLabel}
        <span className="ms-2 font-medium">{siteConfig.phone}</span>
      </a>
    </p>
  );
}
