import { HeroScene } from '@/components/sections/home/HeroScene';
import { auditHref, CtaButton, whatsappHref } from '@/components/ui/CtaButton';
import { Glyph } from '@/components/ui/Glyph';
import { heroAgent, heroAnswer, heroRotator } from '@/content/en/home';
import { shellContent } from '@/content/en/shell';
import { slabChunks } from '@/lib/fx/home/slab';

// Home §01, the hero (docs/design/home.md; Figma 50:36, copy 50:158, scene 50:215). On the stage,
// which holds the floating header in its top (data-stage-hero).
// - The H1 is one stable sentence (heroAnswer.heading) and is never animated (13 §3 rule 7). Its
//   visible part is the tail; the lead-in stays in it for crawlers and screen readers, visually
//   hidden, while the rotator's phrase stands in for it on screen.
// - The rotator (hero-word-rotator, decision 0033 §3) sits beside the H1, aria-hidden, with only its
//   first phrase in the HTML; src/lib/fx/home/rotator.ts plays the rest. Its pause button is labelled
//   (WCAG 2.2.2), and it also pauses on hover, focus, off-screen and in a hidden tab.
// - The direct answer follows (08 §2.2), then the AI input: until the website agent ships, sending
//   opens WhatsApp with the visitor's text (src/lib/fx/home/agent.ts), and the note says so. The CSP
//   allows forms to post only to this site, so the script opens the link; without it, the chips and
//   the button do nothing harmful.
// - background-paths: the stage's lines part around the pointer (src/lib/fx/home/paths.ts).
// - C85: the chips are small white labels over the stage, so they keep their border and drop the glass.

// The background paths (Figma 50:40, KokonutUI BG-02): sixteen curves fanning across the stage
const PATHS = Array.from({ length: 16 }, (_, i) => {
  const y = 230 + i * 34;
  const bend = 140 - i * 18;
  return `M-40 ${y} C 360 ${y - bend}, 1040 ${y + bend}, 1460 ${y - bend / 2}`;
});

export function Hero() {
  const { heading, headingTail } = heroAnswer;
  const lead = heading.slice(0, heading.length - headingTail.length).trim();
  const phrases = heroRotator.phrases;
  return (
    <section aria-labelledby="home-heading" data-stage-hero="" className="px-stage-inset pt-stage-inset">
      <div
        data-fx-scene="home-hero"
        className="dz-hero relative mx-auto max-w-page overflow-hidden rounded-stage bg-(image:--dz-grad-stage) text-on-color"
      >
        <svg
          aria-hidden="true"
          className="dz-hero-paths pointer-events-none absolute inset-x-0 top-0 h-[75rem] w-full"
          viewBox="0 0 1408 1200"
          preserveAspectRatio="xMidYMin slice"
          fill="none"
        >
          {PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
        <span aria-hidden="true" className="dz-hero-glow dz-hero-glow-a" />
        <span aria-hidden="true" className="dz-hero-glow dz-hero-glow-b" />

        <div className="relative mx-auto grid max-w-[77.5rem] justify-items-center gap-4 px-gutter pt-[calc(var(--dz-layout-header-height)+var(--dz-space-2))] md:gap-6 md:pt-[calc(var(--dz-layout-header-height)+var(--dz-space-8))] text-center">
          <p className="inline-flex min-h-8 items-center md:min-h-9 gap-2 rounded-full border border-line-on-color px-3 text-caption">
            <span aria-hidden="true" className="size-2 rounded-xs bg-on-color" />
            {heroAnswer.location}
          </p>

          <div
            className="dz-rotator grid w-full justify-items-center gap-1 md:gap-1.5"
            data-phrases={phrases.join('|')}
          >
            <p aria-hidden="true" className="dz-rotator-prev">
              {phrases[phrases.length - 1]}
            </p>
            <div aria-hidden="true" className="dz-rotator-slot">
              <span aria-hidden="true" className="dz-rotator-glow" />
              <span className="dz-slab" data-slab="1">
                {/* One span per letter: the rotator animates them, and no single big text block forms,
                    so the slab never becomes the page's LCP element. The letters sit in chunks that
                    wrap only after a space or a hyphen (slab.ts). */}
                <span className="dz-slab-word">
                  {slabChunks(phrases[0]).map((chunk, c) => (
                    <span key={c} className="dz-slab-chunk">
                      {[...chunk].map((letter, i) => (
                        <span key={i} className="dz-letter">
                          {letter}
                        </span>
                      ))}
                    </span>
                  ))}
                </span>
              </span>
              <span aria-hidden="true" className="dz-burst">
                <span />
                <span />
                <span />
                <span />
              </span>
            </div>
            <h1 id="home-heading" className="relative text-hero-line text-on-color">
              <span className="sr-only">{lead} </span>
              {headingTail}
              <span aria-hidden="true">.</span>
            </h1>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3.5">
              <button
                type="button"
                className="dz-rotator-pause dz-hit"
                aria-label={heroRotator.pause}
                aria-pressed="false"
                data-label-pause={heroRotator.pause}
                data-label-play={heroRotator.play}
                hidden
              >
                <span className="dz-hit-face">
                  <Glyph name="pause" className="dz-rotator-pause-icon size-4" />
                  <Glyph name="play" className="dz-rotator-play-icon size-4" />
                </span>
              </button>
              <span aria-hidden="true" className="dz-rotator-progress">
                {phrases.map((phrase, index) => (
                  <span key={phrase} data-active={index === 0 ? '' : undefined} />
                ))}
              </span>
              <span aria-hidden="true" className="dz-rotator-count font-mono text-step">
                01 / {String(phrases.length).padStart(2, '0')}
              </span>
              <a
                href="#how-we-work"
                className="inline-flex min-h-9 items-center rounded-full border border-line-on-color px-3 text-caption hover:border-on-color"
              >
                {heroRotator.seeHow} <span aria-hidden="true">&nbsp;→</span>
              </a>
            </div>
          </div>

          {/* With the H1, the page's LCP candidate (the owner, 2026-10-19): static from first paint */}
          <p className="max-w-[51.25rem] text-lead" data-hero-answer="">
            {heroAnswer.answer}
          </p>

          <form
            className="dz-agent grid w-full max-w-[45rem] justify-items-center gap-2.5"
            data-fx-agent=""
            data-wa={whatsappHref() ?? undefined}
            noValidate
          >
            <div className="dz-agent-field">
              <label htmlFor="dz-agent-input" className="sr-only">
                {heroAgent.label}
              </label>
              <input
                id="dz-agent-input"
                name="text"
                type="text"
                autoComplete="off"
                enterKeyHint="send"
                placeholder={heroAgent.placeholder}
                className="min-w-0 flex-1 bg-transparent text-lead text-ink placeholder:text-ink-tertiary focus:outline-none"
              />
              <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-violet-soft px-3 py-2 text-caption text-violet sm:inline-flex">
                <span aria-hidden="true" className="size-2 rounded-full bg-accent-online" />
                {heroAgent.mode}
              </span>
              <button type="submit" aria-label={heroAgent.send} className="dz-press dz-agent-send">
                <Glyph name="arrow-up-right" className="size-5.5" />
              </button>
            </div>
            <p className="text-caption">{heroAgent.note}</p>
            <ul className="flex flex-wrap justify-center gap-2.5">
              {heroAgent.chips.map((chip) => (
                <li key={chip}>
                  <button
                    type="button"
                    data-agent-chip={chip}
                    className="dz-press inline-flex min-h-11 items-center rounded-full border border-line-on-color px-3 text-caption hover:border-on-color"
                  >
                    {chip}
                  </button>
                </li>
              ))}
            </ul>
          </form>

          <CtaButton variant="primary" href={auditHref()} label={shellContent.cta} className="dz-cta-rim" />
        </div>

        <HeroScene />
      </div>
    </section>
  );
}
