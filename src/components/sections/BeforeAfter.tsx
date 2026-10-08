// story-before-after (13 §4.8), shared since P6 part A2 (S8): extracted from Home §03, its markup and
// look unchanged. Each row is a glass card: the situation today, the connector the Zeta Pixel travels
// (transform and opacity only), and the outcome; an optional note under it. The rows are plain HTML,
// so every word is readable without the motion (Reduce effects shows the final state).

export type BeforeAfterRow = { before: string; after: string; note?: string };

export type BeforeAfterProps = {
  /** The label over each row's first side, e.g. "Today" */
  beforeLabel: string;
  /** The label over each row's outcome side */
  afterLabel: string;
  rows: readonly BeforeAfterRow[];
};

export function BeforeAfter({ beforeLabel, afterLabel, rows }: BeforeAfterProps) {
  return (
    <div className="mt-10 grid gap-6">
      {rows.map((row) => (
        <article key={row.before} className="dz-before-after dz-glass" data-fx-once="">
          <div className="dz-ba-side dz-ba-side--problem">
            <h3 className="font-mono text-caption uppercase tracking-eyebrow text-fg-muted">{beforeLabel}</h3>
            <p className="mt-1.5 text-h4">{row.before}</p>
          </div>
          {/* The connector: the Zeta Pixel travels it (transform/opacity only) */}
          <div className="dz-ba-connector" aria-hidden="true">
            <span className="dz-ba-pixel" />
          </div>
          <div className="dz-ba-side dz-ba-side--outcome">
            <h3 className="font-mono text-caption uppercase tracking-eyebrow text-fg-muted">{afterLabel}</h3>
            <p className="mt-1.5 text-h4 font-bold">{row.after}</p>
          </div>
          {row.note && <p className="dz-ba-answer mt-4 max-w-measure text-small text-fg-muted">{row.note}</p>}
        </article>
      ))}
    </div>
  );
}
