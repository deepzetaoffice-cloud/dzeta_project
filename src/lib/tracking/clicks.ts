import { trackEvent } from '@/lib/analytics';
import { CTA_LOCATIONS, type CTA_IDS, type EventParams } from '@/lib/tracking/taxonomy';

// What a click reports (P3 plan, G): the tracking runtime imports this module on the first click on a
// CTA or a link, so it's not in the first load (Home's first-party JavaScript budget, 07 §2; the owner,
// 2026-10-02). One limit: a click that takes the page away in the same tab before this module arrives
// goes unreported. Today none does: links to other sites open a new tab, and contact links don't
// unload the page. A same-tab link off the site would need this module loaded earlier.
// - A CTA (data-cta) reports cta_click with its data-cta-id and where it sits.
// - A link reports what linkEvent() says: an email, phone or WhatsApp link is contact_click; a link to
//   another site is outbound_click. The audit CTA is an email link until R002 ships, so its click
//   reports both: two events, each once.

type CtaLocation = (typeof CTA_LOCATIONS)[number];

const WHATSAPP_HOSTS = new Set(['wa.me', 'api.whatsapp.com', 'web.whatsapp.com', 'whatsapp.com', 'www.whatsapp.com']);

// What a click on a link reports: contact_click, outbound_click with its domain (www. dropped, so a
// site counts once), or nothing for a link within the site. `href` is the link's resolved address.
export function linkEvent(
  href: string,
  pageHost: string,
):
  | { event: 'contact_click'; params: EventParams<'contact_click'> }
  | { event: 'outbound_click'; params: EventParams<'outbound_click'> }
  | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.protocol === 'mailto:') return { event: 'contact_click', params: { method: 'email' } };
  if (url.protocol === 'tel:') return { event: 'contact_click', params: { method: 'phone' } };
  if (url.protocol === 'whatsapp:' || WHATSAPP_HOSTS.has(url.hostname)) {
    return { event: 'contact_click', params: { method: 'whatsapp' } };
  }
  if ((url.protocol !== 'https:' && url.protocol !== 'http:') || url.host === pageHost) return null;
  return { event: 'outbound_click', params: { destination_domain: url.hostname.replace(/^www\./, '') } };
}

// Where a CTA sits: a section may name it (data-cta-location; P5's plan adds 'hero'); otherwise the shell's
// part that holds it. The sheet sits inside the header, so it's asked first.
function ctaLocation(cta: Element): CtaLocation {
  const named = cta.closest<HTMLElement>('[data-cta-location]')?.dataset.ctaLocation;
  if (named && (CTA_LOCATIONS as readonly string[]).includes(named)) return named as CtaLocation;
  if (cta.closest('[data-fx-sticky]')) return 'sticky';
  if (cta.closest('dialog.dz-sheet')) return 'sheet';
  if (cta.closest('footer')) return 'finale';
  if (cta.closest('header')) return 'header';
  return 'page';
}

// Reports a click on `target` (a CTA, a link, or something inside one).
export function reportClick(target: Element): void {
  const cta = target.closest<HTMLElement>('[data-cta]');
  if (cta) {
    // The attribute is CtaButton's typed ctaId; trackEvent drops any value the taxonomy doesn't hold.
    const ctaId = (cta.dataset.ctaId ?? '') as (typeof CTA_IDS)[number];
    trackEvent('cta_click', { cta_id: ctaId, cta_location: ctaLocation(cta) });
  }
  const link = target.closest<HTMLAnchorElement>('a[href]');
  const reported = link ? linkEvent(link.href, location.host) : null;
  if (reported?.event === 'contact_click') trackEvent('contact_click', reported.params);
  if (reported?.event === 'outbound_click') trackEvent('outbound_click', reported.params);
}
