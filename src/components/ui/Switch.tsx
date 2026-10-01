// A display switch (P2 plan, C4): a <button role="switch"> with a visible label. preferences.ts owns
// its state: it sets aria-checked on every copy at once, and handles the click. While a device setting
// decides Reduce effects, it also sets aria-disabled and points aria-describedby at the note that
// explains why (data-note); otherwise the note is neither shown nor read. The switches show only once
// the runtime has started (effects.css), in menus and the footer, never above the fold. touch-snap:
// the thumb overshoots a little (effects.css). Its width comes from where it sits (DisplayControls).

export type SwitchProps = {
  kind: 'theme' | 'effects';
  label: string;
  /** The id of the note that explains a locked state; preferences.ts links it while locked */
  note?: string;
  className?: string;
};

export function Switch({ kind, label, note, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked="false"
      data-note={note}
      data-dz-switch={kind}
      className={[
        'dz-switch inline-flex min-h-11 items-center gap-3 rounded-md text-start whitespace-nowrap text-fg-strong',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span>{label}</span>
      <span aria-hidden="true" className="dz-switch-track">
        <span className="dz-switch-thumb" />
      </span>
    </button>
  );
}
