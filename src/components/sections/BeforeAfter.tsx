import { Glyph } from '@/components/ui/Glyph';

// "Today → With Deepzeta AI" (the service template's problem section; Figma 59:34, 59:873): a real
// table, its two headers the sides. From 640 px it's two columns, the outcome side on violet soft;
// below, each row stacks, its "Today" side above its outcome, and the side labels show in each row
// (the headers stay for screen readers).

type BeforeAfterRow = { before: string; after: string; note?: string };

export type BeforeAfterProps = {
  /** The label over each row's first side, e.g. "Today" */
  beforeLabel: string;
  /** The label over each row's outcome side */
  afterLabel: string;
  /** The table's caption: the section's heading, said once to a screen reader */
  caption: string;
  rows: readonly BeforeAfterRow[];
};

export function BeforeAfter({ beforeLabel, afterLabel, caption, rows }: BeforeAfterProps) {
  const label = 'font-mono text-label uppercase';
  return (
    <div className="dz-table-panel mt-12">
      <table className="text-start">
        <caption className="sr-only">{caption}</caption>
        <thead className="sr-only sm:not-sr-only">
          <tr>
            <th
              scope="col"
              className={`w-1/2 bg-surface-muted px-6 py-3.5 text-start font-normal text-ink-secondary ${label}`}
            >
              {beforeLabel}
            </th>
            <th scope="col" className={`bg-violet-soft px-6 py-3.5 text-start font-normal text-violet ${label}`}>
              {afterLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.before} className="grid sm:table-row">
              <td className="grid gap-1.5 px-5 py-4 text-ink-secondary sm:table-cell sm:px-6 sm:text-small">
                <span aria-hidden="true" className={`text-ink-secondary sm:hidden ${label}`}>
                  {beforeLabel}
                </span>
                {row.before}
                {row.note ? <span className="block text-small">{row.note}</span> : null}
              </td>
              <td className="bg-violet-soft px-5 py-4 font-semibold text-ink sm:px-6 sm:text-small">
                <span className="flex items-start gap-3">
                  <Glyph name="check" className="mt-0.5 size-4.5 shrink-0 text-violet" />
                  <span>{row.after}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
