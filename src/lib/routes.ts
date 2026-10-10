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
  // The services hub and the pillars (§3.2)
  R010: { path: '/services', live: true },
  R011: { path: '/services/ai-automation', live: false },
  R012: { path: '/services/websites', live: false },
  R013: { path: '/services/software', live: false },
  R014: { path: '/services/growth-ranking', live: false },
  // The mega menu's services: the lead services, and the Websites and Software core services (§3.3, §3.4)
  R020: { path: '/services/whatsapp-ai-agent', live: false },
  R021: { path: '/services/ai-voice-receptionist', live: false },
  R027: { path: '/services/speed-to-lead-system', live: true },
  R029: { path: '/services/automated-quotation-tracking', live: true },
  R033: { path: '/services/booking-automation-system', live: true },
  R038: { path: '/services/review-reputation-automation', live: true },
  R045: { path: '/services/uae-e-invoicing', live: false },
  R051: { path: '/services/ai-shopping-visibility', live: true },
  R060: { path: '/services/custom-coded-websites', live: false },
  R061: { path: '/services/landing-pages-cro', live: false },
  R062: { path: '/services/ecommerce-websites', live: false },
  R063: { path: '/services/website-redesign-migration', live: false },
  R064: { path: '/services/web-application-development', live: false },
  R065: { path: '/services/client-customer-portals', live: false },
  R066: { path: '/services/internal-tools-admin-dashboards', live: false },
  R067: { path: '/services/custom-software-development', live: false },
  R068: { path: '/services/ai-citation-aeo-geo', live: true },
  R070: { path: '/services/local-ai-dominance', live: true },
  R076: { path: '/services/ai-ad-creative', live: true },
  // The other service pages, as their batches ship (the standing plan, decision 0029)
  R031: { path: '/services/sales-follow-up-nurture', live: true },
  R032: { path: '/services/crm-setup-automation', live: true },
  R034: { path: '/services/appointment-reminders-no-show-reduction', live: true },
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

// Whether a path is a live registry row: the schema lists and references live pages only (the P6 part A
// plan, S9), and a service is known by its catalogue slug, not its registry ID.
export const isLivePath = (path: string): boolean =>
  Object.values(ROUTES).some((route) => route.path === path && route.live);

// A registry path while its page is live, else undefined, so the caller renders plain text instead of a
// link (04 §1.4; 06 §2.4: hrefs come from the route helpers). For catalogue items known by slug or path.
export const livePath = (path: string): string | undefined => (isLivePath(path) ? path : undefined);

// The registry ID of a path (a template knows its page by path; its breadcrumb names the row by ID)
export const routeIdForPath = (path: string): RouteId | undefined =>
  (Object.keys(ROUTES) as RouteId[]).find((id) => ROUTES[id].path === path);

// The shell's links (P2 plan, A): a route shows once its page is live. The review page shows every
// route, each a placeholder fragment of the page itself (A3).
export const isShown = (id: RouteId, review: boolean): boolean => review || isLive(id);

export const navHref = (id: RouteId, review: boolean): string => (review ? `#shell-${id}` : routePath(id));
