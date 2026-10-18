// Home §02–§04 (docs/design/home.md; Figma 50:35): the platform strip, the problem → outcome rows
// and the four doors. Phase C: the semantic sections, every content field in place, base tokens only.
// Phase D adds the Figma look and marquee, problem-reveal, pixels-to-doors, door-tilt and door-video.
import { PillarMark } from '@/components/ui/PillarMark';
import { BeforeAfter } from '@/components/sections/BeforeAfter';
import { pillars } from '@/content/catalogue';
import { fourDoors, problemOutcome, proofStrip } from '@/content/en/home';

// §02 The proof strip: platform names as plain text (catalogue §8, byte for byte). Client logos
// and partner badges appear only once confirmed (facts §5) — none are, so none are shown.
export function ProofStrip() {
  return (
    // overflow-clip: the drift row's ±4% translate (13 §4.4) moves inside this band and can
    // never widen the document (WCAG 1.4.10 — the 320 px reflow e2e)
    <section aria-labelledby="proof-strip-heading" className="overflow-clip border-y border-line py-8">
      <div className="mx-auto max-w-page px-gutter">
        <h2 id="proof-strip-heading" className="text-center font-mono text-label uppercase text-ink-secondary">
          {proofStrip.heading}
        </h2>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {proofStrip.categories.flatMap(({ label, platforms }) =>
            platforms.map((platform) => (
              <li key={`${label}-${platform}`} className="text-small font-medium text-ink-secondary">
                {platform}
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  );
}

export function ProblemOutcome() {
  return (
    <section aria-labelledby="problems-heading" className="mx-auto max-w-page px-gutter py-section">
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

export function FourDoors() {
  return (
    <section aria-labelledby="doors-heading" className="mx-auto max-w-page px-gutter py-section">
      <h2 id="doors-heading" className="text-h2 text-balance">
        {fourDoors.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{fourDoors.lede}</p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {pillars.map((pillar) => (
          <li key={pillar.slug} className="rounded-lg border border-line bg-surface p-6">
            <div className="flex items-start gap-4">
              <PillarMark pillar={pillar.pixel} className="mt-2 size-6" />
              <div>
                <h3 className="text-h3">{pillar.name}</h3>
                <p className="mt-1.5 text-small text-ink-secondary">{pillar.promise}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-small text-ink-secondary">{fourDoors.doorsNote}</p>
    </section>
  );
}
