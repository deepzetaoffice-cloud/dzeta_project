// Home §01, the hero (P5 S4; docs/design/home.md "Hero details"; engine §3.1 order 1). The
// statement H1 is the LCP element: visible, unclipped and in place at first paint, with no
// entrance animation (13 §3 rule 2) — it renders before anything else here. Effects, all by ID
// (13 §4): pointer-grid-wake on the Z0 layer (the shared pointer controller writes --dz-fx-x/y),
// glass-liquid on the proof card (one per view; desktop fine-pointer only via the fx variant),
// story-chat inside it (CSS one-shot, plays once in view ~2.5 s, "Example conversation" label —
// 10 §3.6), and The Assembly (depth-css + scroll-assemble): the four cluster pixels fly in on
// 35° paths on the first scroll and lock beside the headline, CSS only, static assembled
// otherwise and under Reduce effects (13 §5). The primary CTA is the shell's audit CTA
// (hover-charge + pointer-magnet, CtaButton); the secondary is hover-outline.
import { auditHref } from '@/components/ui/CtaButton';
import { CtaButton } from '@/components/ui/CtaButton';
import { Icon } from '@/components/icons/Icon';
import { Logo } from '@/components/ui/Logo';
import { heroAnswer } from '@/content/en/home';
import { shellContent } from '@/content/en/shell';

// The Assembly's four pixels: the logo's four-pixel cluster as CSS blocks, each on its exact
// --dz-pixel-* gradient, upright, never rotated, no outlines (13 §5, C20). The cluster appears
// beside the headline; the scroll-assemble transform is CSS-only (effects.css).
function TheAssembly() {
  return (
    <span className="dz-assembly" aria-hidden="true">
      <span className="dz-assembly-px dz-assembly-px--ai" />
      <span className="dz-assembly-px dz-assembly-px--web" />
      <span className="dz-assembly-px dz-assembly-px--software" />
      <span className="dz-assembly-px dz-assembly-px--ranking" />
    </span>
  );
}

// story-chat (13 §4.8): a conversation plays once, ~2.5 s, when the card enters the view. The
// final state (both bubbles visible, the booking confirmed) is the resting state, so no-JS and
// Reduce effects visitors see it complete. Labelled "Example conversation" (10 §3.6). The replay
// control arrives with the lazy enhancement (S6); the chat itself is pure CSS delays.
function StoryChat() {
  return (
    <div
      className="dz-story-chat"
      role="img"
      aria-label="An example conversation: a customer asks about availability on WhatsApp, an AI agent replies in seconds and confirms a booking for Tuesday at 4pm."
    >
      <p className="dz-chat-bubble dz-chat-bubble--customer">Hi, do you have anything available this week?</p>
      <p className="dz-chat-bubble dz-chat-bubble--agent">
        Yes — I can book you in on Tuesday at 4pm. Shall I confirm?
      </p>
      <p className="dz-chat-note">Booked · Tuesday 16:00</p>
    </div>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="home-heading" className="dz-hero relative overflow-clip">
      {/* Z0: the blueprint grid and its glow. pointer-grid-wake brightens the grid near the
          pointer (the shared controller writes --dz-fx-x/y on this section's data-fx-pointer). */}
      <div className="dz-hero-z0" aria-hidden="true">
        <div className="dz-hero-grid" />
        <div className="dz-hero-glow" />
        {/* The locked logo's Z mark, cropped (the file untouched), with one light sweep on load */}
        <Logo variant="mark" decorative className="dz-hero-mark" />
      </div>

      <div className="relative mx-auto grid max-w-page gap-10 px-gutter pt-section pb-section lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
        <div>
          {/* The Assembly sits beside the statement: the cluster locks in after its flight */}
          <div className="flex flex-wrap items-center gap-4">
            <TheAssembly />
            <h1 id="home-heading" className="text-statement text-balance">
              {heroAnswer.heading}
            </h1>
          </div>
          <p className="mt-6 max-w-measure text-lead">{heroAnswer.answer}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CtaButton href={auditHref()} label={shellContent.cta} variant="primary" />
            {/* The secondary CTA (hover-outline): the AI agent demo stub (S6 wires its trigger) */}
            <a
              className="dz-cta dz-cta--outline dz-magnet inline-flex min-h-12 items-center gap-2.5 rounded-pill px-5.5 font-bold no-underline"
              href={auditHref()}
              data-demo="ai-agent"
              data-cta="page"
            >
              <Icon name="send" size={20} />
              {heroAnswer.tryAgent}
            </a>
          </div>
        </div>

        {/* The proof card: glass-liquid (one per view), story-chat inside, plays once in view */}
        <div className="dz-glass dz-hero-proof" data-fx-once="">
          <p className="font-mono text-caption uppercase tracking-eyebrow text-fg-muted">{heroAnswer.proofEyebrow}</p>
          <h2 className="mt-2 text-h3">{heroAnswer.proofHeading}</h2>
          <div className="mt-4">
            <StoryChat />
          </div>
        </div>
      </div>
    </section>
  );
}
