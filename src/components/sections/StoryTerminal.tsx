import type { TerminalRun, WebsitesExtras } from '@/content/en/services/types';

// The recorded run of this site's own build and checks (the flagship's proof; 10 §3.6: real commands
// and output only, replayed, not live). Phase C shows the full log, as reduced motion does; Phase D
// adds terminal-replay (13 §4.4) with play, pause and scrub.
export function StoryTerminal({ run, labels }: { run: TerminalRun; labels: WebsitesExtras['terminal'] }) {
  const recorded = labels.recordedLabel.replace('{date}', run.date).replace('{commit}', run.commit);
  return (
    <figure className="overflow-hidden rounded-lg bg-inverse text-on-color shadow-2" data-terminal="">
      <div className="flex items-center gap-3 border-b border-line-on-color px-5 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-3 rounded-full bg-line-on-color" />
          <span className="size-3 rounded-full bg-line-on-color" />
          <span className="size-3 rounded-full bg-line-on-color" />
        </span>
        <span className="font-mono text-label uppercase">{labels.windowTitle}</span>
      </div>
      <ol className="grid gap-1 overflow-x-auto px-5 py-4 font-mono text-small" aria-label={labels.windowTitle}>
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
      <figcaption className="border-t border-line-on-color px-5 py-3 text-small">{recorded}</figcaption>
    </figure>
  );
}
