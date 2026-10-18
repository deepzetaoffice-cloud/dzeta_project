import { SectionHeading } from '@/components/sections/SectionHeading';
import { Glyph } from '@/components/ui/Glyph';
import type { TerminalRun, WebsitesExtras } from '@/content/en/services/types';

// "Watch this site run its own checks" (custom-coded-websites.md §06; terminal-replay, 13 §4.4): the
// recorded run of this site's own build and checks (10 §3.6: real commands and output only, replayed,
// not live). The full log is in the HTML, so without JavaScript and under Reduce effects it reads as
// it is. src/lib/fx/flagship.ts shows the controls and replays the log on Play: pause, replay and
// "Next step" (to the next command), with the progress bar. Nothing plays by itself.
export function StoryTerminal({
  run,
  labels,
  eyebrow,
}: {
  run: TerminalRun;
  labels: WebsitesExtras['terminal'];
  eyebrow: string;
}) {
  const recorded = labels.recordedLabel.replace('{date}', run.date).replace('{commit}', run.commit);
  const { controls } = labels;
  return (
    <section aria-labelledby="service-proof" className="mx-auto max-w-page px-gutter py-section">
      <SectionHeading id="service-proof" index={5} eyebrow={eyebrow} heading={labels.heading} lede={labels.lede} />
      <figure className="dz-terminal mt-12" data-terminal="">
        <div className="flex items-center gap-3 border-b border-line-on-color px-5 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-error" />
            <span className="size-2.5 rounded-full bg-accent-signal" />
            <span className="size-2.5 rounded-full bg-accent-online" />
          </span>
          <span className="font-mono text-label uppercase">{labels.windowTitle}</span>
        </div>
        {/* The log scrolls inside its window, so the box takes keyboard focus (WCAG 2.1.1; axe
            scrollable-region-focusable) and is named by the window's title */}
        <div
          className="dz-terminal-window"
          role="region"
          aria-label={labels.windowTitle}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a box that scrolls must take keyboard focus
          tabIndex={0}
          data-term-window=""
        >
          <ol className="dz-terminal-log font-mono text-small" dir="ltr">
            {run.lines.map((line, index) => (
              <li key={index} data-term-line="" data-kind={line.kind}>
                {line.kind === 'command' ? (
                  <>
                    <span aria-hidden="true">$ </span>
                    {line.text}
                  </>
                ) : (
                  line.text
                )}
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-line-on-color px-5 py-3">
          <div
            role="group"
            aria-label={controls.group}
            className="flex items-center gap-2"
            data-term-controls=""
            hidden
          >
            <button
              type="button"
              className="dz-press dz-term-button"
              data-term-play=""
              data-label-play={controls.play}
              data-label-pause={controls.pause}
            >
              <span data-term-play-label="">{controls.play}</span>
              <Glyph name="play" className="dz-term-play-icon size-3.5" />
              <Glyph name="pause" className="dz-term-pause-icon size-3.5" />
            </button>
            <button type="button" className="dz-press dz-term-button" data-term-replay="">
              {controls.replay}
            </button>
            <button type="button" className="dz-press dz-term-button" data-term-step="">
              {controls.step}
            </button>
          </div>
          <span aria-hidden="true" className="dz-term-progress" data-term-progress-track="" hidden>
            <span data-term-progress="" />
          </span>
          <figcaption className="ms-auto font-mono text-label uppercase">{recorded}</figcaption>
        </div>
      </figure>
    </section>
  );
}
