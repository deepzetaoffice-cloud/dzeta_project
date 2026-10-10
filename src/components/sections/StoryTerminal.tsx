// The build terminal (story-terminal, 13 §4.8; docs/design/service-page.md, the Websites page's
// extras; decision 0009: a macOS-style window, longer real multi-step commands, real output only).
// Server-rendered: every line is in the HTML, so without JavaScript, under reduced motion or with
// Reduce effects the full run shows, still (13 §3.3). TerminalControls (StoryControls.tsx) replays it
// line by line once it scrolls into view, with Play / Pause / Replay / Step (WCAG 2.2.2), and pauses
// it when it scrolls away. The window's three buttons are decoration.
import { TerminalControls } from '@/components/sections/StoryControls';
import type { TerminalRun, WebsitesExtras } from '@/content/en/services/types';

export function StoryTerminal({ run, labels }: { run: TerminalRun; labels: WebsitesExtras['terminal'] }) {
  const recorded = labels.recordedLabel.replace('{date}', run.date).replace('{commit}', run.commit);
  return (
    <figure className="dz-term dz-glass" data-theme="dark" data-terminal="">
      <div className="dz-term-bar">
        <span className="dz-term-lights" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="dz-term-title">{labels.windowTitle}</span>
      </div>
      <ol className="dz-term-body" aria-label={labels.windowTitle}>
        {run.lines.map((line, index) => (
          <li key={index} className={`dz-term-line dz-term-line--${line.kind}`} data-term-line="">
            {line.kind === 'command' ? (
              <>
                <span className="dz-term-prompt" aria-hidden="true">
                  ${' '}
                </span>
                {line.text}
              </>
            ) : (
              line.text
            )}
          </li>
        ))}
      </ol>
      <TerminalControls labels={labels.controls} />
      <figcaption className="dz-term-recorded">{recorded}</figcaption>
    </figure>
  );
}
