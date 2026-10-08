// Home §02–§04 (P5 S4; docs/design/home.md; engine §3.1 orders 2–4). All server-rendered, all
// effects by ID (13 §4): scroll-drift on the proof strip (native scroll-driven, @supports-gated),
// story-before-after rows in §03 (scroll-scrubbed, no slider JS; the pixel travels each
// connector), and the four doors in §04 (glass-frost cards, the Tier 3 icon stories that exist
// since P2, hover-card, pointer-tilt). The doors are cards, not links, until their pillar pages
// ship in P6 (04 §1.4) — isLive() flips them then.
import { Icon } from '@/components/icons/Icon';
import { BeforeAfter } from '@/components/sections/BeforeAfter';
import { pillars } from '@/content/catalogue';
import { fourDoors, problemOutcome, proofStrip } from '@/content/en/home';

// §02 The proof strip: platform names as plain text (catalogue §8, byte for byte). Client logos
// and partner badges appear only once confirmed (facts §5) — none are, so none are shown.
export function ProofStrip() {
  return (
    // overflow-clip: the drift row's ±4% translate (13 §4.4) moves inside this band and can
    // never widen the document (WCAG 1.4.10 — the 320 px reflow e2e)
    <section
      aria-labelledby="proof-strip-heading"
      className="dz-proof-strip overflow-clip border-y border-hairline py-8"
    >
      <div className="mx-auto max-w-page px-gutter">
        <h2
          id="proof-strip-heading"
          className="text-center font-mono text-caption uppercase tracking-eyebrow text-fg-muted"
        >
          {proofStrip.heading}
        </h2>
        {/* scroll-drift: the row moves only while the visitor scrolls (13 §4.4), inside @supports;
            the static state is complete on its own */}
        <ul className="dz-drift mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3" data-fx-once="">
          {proofStrip.categories.flatMap(({ label, platforms }) =>
            platforms.map((platform) => (
              <li key={`${label}-${platform}`} className="text-small font-medium text-fg-muted">
                {platform}
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  );
}

// §03 Problem → outcome (story-before-after): three pains, each a labelled row with the outcome
// on the other side and the pixel travelling the connector between them. Both sides are real HTML
// lists in the markup (13 §4.8: every story has a visible HTML step list / final state).
export function ProblemOutcome() {
  return (
    <section aria-labelledby="problems-heading" className="mx-auto max-w-page px-gutter py-section" data-fx-once="">
      <h2 id="problems-heading" className="max-w-measure text-h2 text-balance">
        {problemOutcome.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{problemOutcome.lede}</p>
      <BeforeAfter
        beforeLabel={problemOutcome.beforeLabel}
        afterLabel={problemOutcome.afterLabel}
        rows={problemOutcome.rows.map((row) => ({ before: row.problem, after: row.outcome, note: row.answer }))}
      />
    </section>
  );
}

// §04 The four doors (the pillars, C6): glass-frost cards with their Tier 3 icon, the catalogue's
// name and promise (10 §2: exact), hover-card and pointer-tilt. AI Automation and Websites lead
// (facts §3): the catalogue order already does. Each door links to its pillar page once that page
// ships (P6); until then it is a card, so nothing links to an unshipped page (04 §1.4).
export function FourDoors() {
  return (
    <section aria-labelledby="doors-heading" className="mx-auto max-w-page px-gutter py-section" data-fx-once="">
      <h2 id="doors-heading" className="text-h2 text-balance">
        {fourDoors.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{fourDoors.lede}</p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {pillars.map((pillar) => (
          <li key={pillar.slug} className="dz-door dz-glass" data-fx-pointer="">
            <div className="flex items-start gap-4">
              {/* The pillar's Tier 3 signature icon (registry name = the slug); its story plays
                  with the shared observer. Tier 3 sizes start at 64 (Icon Master Rules §2). */}
              <Icon name={pillar.slug} size={64} className="dz-door-icon" />
              <div>
                <h3 className="text-h3">{pillar.name}</h3>
                <p className="mt-1.5 text-small text-fg-muted">{pillar.promise}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-small text-fg-muted">{fourDoors.doorsNote}</p>
    </section>
  );
}
