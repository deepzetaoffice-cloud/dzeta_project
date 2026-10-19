// Home §02–§04 (docs/design/home.md; Figma 50:311, 51:235, 51:277; mobile 56:1024–56:1065): the
// platform strip, the problem → outcome rows and the four doors.
import type { Pillar } from '@/components/icons/registry';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { Glyph } from '@/components/ui/Glyph';
import { Photo } from '@/components/ui/Photo';
import { PillarMark } from '@/components/ui/PillarMark';
import { pillars } from '@/content/catalogue';
import { fourDoors, problemOutcome, proofStrip } from '@/content/en/home';
import { navigation } from '@/content/en/navigation';
import { photo, PILLAR_DOOR } from '@/lib/media/photos';
import { isLive, routePath, type RouteId } from '@/lib/routes';

// §02 The platform strip (marquee): the platform names as plain text (catalogue §8, byte for byte),
// never client logos or partner badges (facts §5). A linear loop from 1,024 px with its pause button
// (WCAG 2.2.2), pausing on hover and focus; a wrapped list on phones and under Reduce effects. The
// names take the stage gradient: Figma's pillar gradients start too light to read (C85's rule).
export function ProofStrip() {
  const names = proofStrip.categories.flatMap((category) => category.platforms);
  return (
    <section aria-labelledby="proof-strip-heading" className="dz-marquee overflow-clip pt-10 pb-6 lg:pt-14">
      <div className="mx-auto flex max-w-page items-center justify-center gap-3 px-gutter">
        <h2 id="proof-strip-heading" className="font-mono text-label text-ink-tertiary uppercase">
          {proofStrip.heading}
        </h2>
        <button
          type="button"
          className="dz-marquee-pause dz-hit"
          aria-label={proofStrip.pause}
          aria-pressed="false"
          data-label-pause={proofStrip.pause}
          data-label-play={proofStrip.play}
        >
          <span className="dz-hit-face dz-hit-face-quiet">
            <Glyph name="pause" className="dz-rotator-pause-icon size-3.5" />
            <Glyph name="play" className="dz-rotator-play-icon size-3.5" />
          </span>
        </button>
      </div>
      <div className="dz-marquee-track mt-5">
        <ul className="dz-marquee-row">
          {names.map((name) => (
            <li key={name} className="dz-platform">
              {name}
            </li>
          ))}
        </ul>
        <ul className="dz-marquee-row dz-marquee-copy" aria-hidden="true">
          {names.map((name) => (
            <li key={name} className="dz-platform">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// §03 Problem → outcome (problem-reveal): three rows, "Today" beside "With Deepzeta AI". Each
// outcome is an <h3> with a disclosure button; its 40–75-word answer is in the HTML, and without
// JavaScript every answer shows. src/lib/fx/home/problems.ts keeps one open (the first on load) and
// opens a row on hover with a pointer or on tap.
export function ProblemOutcome() {
  return (
    <section aria-labelledby="problems-heading" className="mx-auto max-w-page px-gutter py-section">
      <SectionHeading
        id="problems-heading"
        index={1}
        eyebrow={problemOutcome.eyebrow}
        heading={problemOutcome.heading}
        lede={problemOutcome.lede}
      />
      <ul className="mt-12 grid gap-4" data-fx-problems="">
        {problemOutcome.rows.map((row, index) => {
          const answerId = `dz-problem-${index + 1}`;
          return (
            <li key={row.problem} className="dz-problem" data-open="">
              <div className="dz-problem-today">
                <p className="font-mono text-label text-ink-secondary uppercase">{problemOutcome.beforeLabel}</p>
                <p className="dz-problem-pain">{row.problem}</p>
              </div>
              <span aria-hidden="true" className="dz-problem-arrow">
                <Glyph name="arrow-up-right" className="size-5" />
              </span>
              <div className="dz-problem-with">
                <p className="dz-problem-label font-mono text-label uppercase">{problemOutcome.afterLabel}</p>
                <h3 className="text-h3">
                  <button type="button" className="dz-problem-toggle" aria-expanded="true" aria-controls={answerId}>
                    {row.outcome}
                  </button>
                </h3>
                <div id={answerId} className="dz-problem-answer">
                  <p className="max-w-[47.5rem] text-ink-secondary">{row.answer}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// The door cards' fills and their text: white fails on the AI Automation and Websites starts, so
// those cards take ink (05 §2, text/on-vibrant)
const DOOR_FILL: Record<Pillar, string> = {
  ai: 'bg-(image:--dz-grad-pillar-ai) text-on-vibrant',
  web: 'bg-(image:--dz-grad-pillar-websites) text-on-vibrant',
  software: 'bg-(image:--dz-grad-pillar-software) text-on-color',
  ranking: 'bg-(image:--dz-grad-pillar-growth) text-on-color',
};

// The duotone over each door's photo, in the pillar's gradient
const DOOR_TONE: Record<Pillar, string> = {
  ai: 'bg-(image:--dz-grad-pillar-ai)',
  web: 'bg-(image:--dz-grad-pillar-websites)',
  software: 'bg-(image:--dz-grad-pillar-software)',
  ranking: 'bg-(image:--dz-grad-pillar-growth)',
};

// The pillar's page once it ships; until then its section on the services hub
function pillarHref(route: RouteId, pillar: Pillar): string {
  return isLive(route) ? routePath(route) : `${routePath('R010')}#hub-pillar-${pillar}`;
}

// §04 The four doors (pixels-to-doors, door-tilt): one card per pillar, in catalogue order, each with
// its door photo (P01–P04; the loops V01–V04 replace them once the owner records them), its promise,
// three of its lead services and its "All … services" link. A momentum rail on phones.
export function FourDoors() {
  return (
    <section aria-labelledby="doors-heading" className="dz-doors-section mx-auto max-w-page px-gutter py-section">
      <p aria-hidden="true" className="dz-doors-pixels" data-doors-pixels="">
        {pillars.map((pillar) => (
          <PillarMark key={pillar.pixel} pillar={pillar.pixel} shape="pixels" className="h-8 lg:h-12" />
        ))}
      </p>
      <SectionHeading
        id="doors-heading"
        index={2}
        eyebrow={fourDoors.eyebrow}
        heading={fourDoors.heading}
        lede={fourDoors.lede}
        align="center"
        className="mt-6 lg:mt-12"
      />
      <ul className="dz-doors" data-fx-doors="">
        {pillars.map((pillar, index) => {
          const column = navigation.columns.find((entry) => entry.pillar === pillar.pixel);
          const picks = fourDoors.services[pillar.pixel];
          const items = picks
            .map((route) => column?.items.find((item) => item.route === route))
            .filter((item) => item !== undefined);
          return (
            <li key={pillar.pixel} className="dz-door-slot" data-door={index + 1}>
              <article className={`dz-door ${DOOR_FILL[pillar.pixel]}`} aria-labelledby={`dz-door-${pillar.pixel}`}>
                <div className="dz-door-media">
                  <Photo
                    asset={photo(PILLAR_DOOR[pillar.pixel], { alt: fourDoors.photoAlt[pillar.pixel] })}
                    sizes="(min-width: 64rem) 20rem, 80vw"
                    className="size-full object-cover"
                  />
                  <span aria-hidden="true" className={`dz-door-tone ${DOOR_TONE[pillar.pixel]}`} />
                </div>
                <div className="grid gap-3 px-2.5">
                  <span className="dz-num dz-door-number" data-num={String(pillar.number).padStart(2, '0')} />
                  <h3 id={`dz-door-${pillar.pixel}`} className="text-h3">
                    {pillar.name}
                  </h3>
                  <p className="text-small">{pillar.promise}</p>
                  <ul className="grid gap-2">
                    {items.map((item) => (
                      <li key={item.route} className="flex items-start gap-2.5 text-small font-semibold">
                        <span aria-hidden="true" className="dz-door-bullet" />
                        {isLive(item.route) ? (
                          <a href={routePath(item.route)} className="underline-offset-4 hover:underline">
                            {item.name}
                          </a>
                        ) : (
                          item.name
                        )}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={pillarHref(column?.route ?? 'R010', pillar.pixel)}
                    className="dz-press dz-button-secondary mt-1 w-fit px-5"
                  >
                    {column?.allLabel}
                    <Glyph name="arrow-up-right" className="size-4.5" />
                  </a>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
      <p className="mt-10 text-center text-small text-ink-tertiary">{fourDoors.doorsNote}</p>
    </section>
  );
}
