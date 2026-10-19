import { whatsappHref } from '@/components/ui/CtaButton';
import { Glyph } from '@/components/ui/Glyph';
import { shellContent } from '@/content/en/shell';

// The floating WhatsApp button (decision 0024; C83; docs/design/conversion-path.md): the round violet
// Icon button with the WhatsApp glyph at the bottom inline-end corner, shown with the desktop header
// (from 1,280 px), because below that the scrolled mobile header carries the same button. The contact
// page (R005) excludes it when that page ships. While the WhatsApp fact is unconfirmed it is absent
// from the HTML, never CSS-hidden (facts §2). It gives way while the consent banner asks (globals.css).
export function WhatsAppFloat() {
  const href = whatsappHref();
  if (!href) return null;
  return (
    <div
      data-wa-float=""
      className="fixed end-6 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-(--dz-layer-sticky) hidden xl:block"
    >
      <a
        href={href}
        aria-label={shellContent.whatsappLabel}
        className="dz-press inline-flex size-14 items-center justify-center rounded-full bg-action text-on-color shadow-2"
      >
        <Glyph name="whatsapp" />
      </a>
    </div>
  );
}
