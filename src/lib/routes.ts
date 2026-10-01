// The typed route seed (engine §5.3 rule 5; P2 plan, A1): the URL-registry rows the shell links to,
// each with its path and whether its page is live. Internal links take their href from here, never
// typed by hand, and a row that isn't live renders no link anywhere (04 §1.4). A page plan that ships
// a page flips its row's `live` in the same change, and the header, the mega menu and the footer
// show it at once. tests/unit/routes.test.ts keeps each path equal to its registry row, and `live`
// true exactly when the page file exists. P4 extends the seed to every row.

type Route = { path: string; live: boolean };

export const ROUTES = {
  // Core, company and legal (registry §3.1)
  R001: { path: '/', live: true },
  R002: { path: '/free-ai-audit', live: false },
  R003: { path: '/about', live: false },
  R005: { path: '/contact', live: false },
  R006: { path: '/privacy', live: false },
  R007: { path: '/terms', live: false },
  R008: { path: '/editorial-policy', live: false },
  // Pillars (§3.2)
  R011: { path: '/services/ai-automation', live: false },
  R012: { path: '/services/websites', live: false },
  R013: { path: '/services/software', live: false },
  R014: { path: '/services/growth-ranking', live: false },
  // The mega menu's services: the lead services, and the Websites and Software core services (§3.3, §3.4)
  R020: { path: '/services/whatsapp-ai-agent', live: false },
  R021: { path: '/services/ai-voice-receptionist', live: false },
  R027: { path: '/services/speed-to-lead-system', live: false },
  R029: { path: '/services/automated-quotation-tracking', live: false },
  R033: { path: '/services/booking-automation-system', live: false },
  R038: { path: '/services/review-reputation-automation', live: false },
  R045: { path: '/services/uae-e-invoicing', live: false },
  R051: { path: '/services/ai-shopping-visibility', live: false },
  R060: { path: '/services/custom-coded-websites', live: false },
  R061: { path: '/services/landing-pages-cro', live: false },
  R062: { path: '/services/ecommerce-websites', live: false },
  R063: { path: '/services/website-redesign-migration', live: false },
  R064: { path: '/services/web-application-development', live: false },
  R065: { path: '/services/client-customer-portals', live: false },
  R066: { path: '/services/internal-tools-admin-dashboards', live: false },
  R067: { path: '/services/custom-software-development', live: false },
  R068: { path: '/services/ai-citation-aeo-geo', live: false },
  R070: { path: '/services/local-ai-dominance', live: false },
  R076: { path: '/services/ai-ad-creative', live: false },
  // Solutions (§3.5)
  R090: { path: '/solutions', live: false },
  R091: { path: '/solutions/ai-front-desk', live: false },
  R092: { path: '/solutions/quote-to-cash-system', live: false },
  R093: { path: '/solutions/get-found-by-ai', live: false },
  R094: { path: '/solutions/ecommerce-growth-engine', live: false },
  R095: { path: '/solutions/launch-pack', live: false },
  R096: { path: '/solutions/e-invoicing-ready', live: false },
  // Deepzeta Sync, resources, Studio (§3.6)
  R110: { path: '/tools', live: false },
  R120: { path: '/resources', live: false },
  R121: { path: '/resources/glossary', live: false },
  R140: { path: '/studio', live: false },
  // Blocked until the owner's facts arrive (§3.7)
  R150: { path: '/work', live: false },
  R152: { path: '/pricing', live: false },
} as const satisfies Record<string, Route>;

export type RouteId = keyof typeof ROUTES;

export const routePath = (id: RouteId): string => ROUTES[id].path;

export const isLive = (id: RouteId): boolean => ROUTES[id].live;

// The shell's links (P2 plan, A): a route shows once its page is live. The review page shows every
// route, each a placeholder fragment of the page itself (A3).
export const isShown = (id: RouteId, review: boolean): boolean => review || isLive(id);

export const navHref = (id: RouteId, review: boolean): string => (review ? `#shell-${id}` : routePath(id));
