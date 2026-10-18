import type { Metadata, Viewport } from 'next';
import { SiteDocument } from '@/components/layout/SiteDocument';
import { Glyph } from '@/components/ui/Glyph';
import { PillarMark } from '@/components/ui/PillarMark';
import { notFoundContent } from '@/content/en/not-found';
import { isLive, routePath, type RouteId } from '@/lib/routes';
import { brandedTitle } from '@/lib/seo/title';
import { siteUrl } from '@/lib/url';
import { siteViewport } from '@/lib/viewport';
import '@/styles/globals.css';

// Every unmatched URL lands here, whichever root layout it would have used (English now, Arabic in
// P11). It bypasses the layouts (and their title template), so it imports its own styles, renders the
// shared document and formats its own title. Next.js adds `noindex` to 404s.
export const metadata: Metadata = {
  // It skips the English layout, so it sets its own base for the OG image's absolute URL.
  metadataBase: new URL(siteUrl()),
  title: brandedTitle(notFoundContent.title),
};

// The layouts' viewport doesn't reach this page, so it exports the same one.
export const viewport: Viewport = siteViewport;

// Where each shape rests on the stage (Figma 61:1054), as shares of its width and height, with its
// tilt. Layout, not copy: the chips' labels are in not-found.ts.
const CHIP_SPOT: Partial<Record<RouteId, string>> = {
  R010: 'start-[7%] top-[20%] rotate-12',
  R011: 'start-[74%] top-[16%] -rotate-6',
  R002: 'start-[12%] top-[72%] rotate-6',
  R012: 'start-[77%] top-[70%] -rotate-12',
  R152: 'start-[42%] top-[86%] rotate-12',
  R150: 'start-[24%] top-[80%] -rotate-12',
  R140: 'start-[63%] top-[60%] rotate-6',
  R110: 'start-[11%] top-[47%] -rotate-6',
};

const PIXEL_SPOTS = [
  { pillar: 'ai', spot: 'start-[4%] top-[34%] rotate-12' },
  { pillar: 'ranking', spot: 'start-[27%] top-[24%] -rotate-6' },
  { pillar: 'web', spot: 'start-[62%] top-[24%] rotate-6' },
  { pillar: 'software', spot: 'start-[86%] top-[38%] -rotate-12' },
] as const;

// docs/design/not-found.md (Figma 61:1054 desktop, 61:1200 mobile): the stage, the copy block in its
// middle, and shape-throw around it (src/lib/fx/shapes.ts). The page chips are real links, only to
// live pages, in DOM order for keyboards and screen readers; without the physics (no JavaScript,
// Reduce effects, touch only) the shapes rest where they are and the links work. The hint shows only
// while the shapes can be thrown.
export default function GlobalNotFound() {
  const pages = notFoundContent.pages.filter((page) => isLive(page.route));
  return (
    <SiteDocument locale="en">
      <section aria-labelledby="not-found-heading" data-stage-hero="" className="px-stage-inset pt-stage-inset">
        <div
          data-fx-scene="not-found"
          className="dz-lost relative mx-auto grid max-w-page place-items-center overflow-hidden rounded-stage bg-(image:--dz-grad-stage) px-gutter pt-[calc(var(--dz-layout-header-height)+var(--dz-space-12))] pb-16 text-on-color"
        >
          <div className="dz-shapes" data-shapes="">
            {PIXEL_SPOTS.map(({ pillar, spot }) => (
              <span key={pillar} aria-hidden="true" className={`dz-shape dz-shape-pixels ${spot}`} data-shape="">
                <PillarMark pillar={pillar} shape="pixels" className="h-full" />
              </span>
            ))}
            <nav aria-label={notFoundContent.pagesLabel}>
              <ul>
                {pages.map((page) => (
                  <li key={page.route}>
                    <a
                      href={routePath(page.route)}
                      className={`dz-shape dz-shape-chip ${CHIP_SPOT[page.route] ?? ''}`}
                      data-shape=""
                    >
                      {page.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="relative grid max-w-[40rem] justify-items-center gap-5 text-center">
            <p aria-hidden="true" className="dz-lost-code" data-word="404" />
            <h1 id="not-found-heading" className="text-hero-line text-on-color">
              {notFoundContent.heading}
            </h1>
            <p className="text-lead">{notFoundContent.body}</p>
            <a
              className="dz-press dz-cta-rim inline-flex min-h-14 items-center gap-2 rounded-full bg-action px-7 text-button-l text-on-color"
              href={routePath('R001')}
            >
              {notFoundContent.homeLink}
              <Glyph name="arrow-up-right" className="size-5" />
            </a>
            <p className="text-caption" data-shapes-hint="" hidden>
              {notFoundContent.hint}
            </p>
          </div>
        </div>
      </section>
    </SiteDocument>
  );
}
