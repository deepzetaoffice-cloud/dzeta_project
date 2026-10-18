// "Today → With Deepzeta AI" rows (Home §03, the service template's problem section). Phase C: both
// sides shown, as under reduced motion; Phase D adds problem-reveal (13 §4.3) on Home.

type BeforeAfterRow = { before: string; after: string; note?: string };

export type BeforeAfterProps = {
  /** The label over each row's first side, e.g. "Today" */
  beforeLabel: string;
  /** The label over each row's outcome side */
  afterLabel: string;
  rows: readonly BeforeAfterRow[];
};

export function BeforeAfter({ beforeLabel, afterLabel, rows }: BeforeAfterProps) {
  return (
    <div className="mt-10 grid gap-card-gap">
      {rows.map((row) => (
        <article key={row.before} className="grid gap-4 rounded-lg border border-line bg-surface p-6 md:grid-cols-2">
          <div>
            <h3 className="font-mono text-label text-ink-tertiary uppercase">{beforeLabel}</h3>
            <p className="mt-2 text-h4 text-ink-secondary">{row.before}</p>
          </div>
          <div>
            <h3 className="font-mono text-label text-violet uppercase">{afterLabel}</h3>
            <p className="mt-2 text-h4">{row.after}</p>
          </div>
          {row.note ? <p className="max-w-measure text-small text-ink-secondary md:col-span-2">{row.note}</p> : null}
        </article>
      ))}
    </div>
  );
}
