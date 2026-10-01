import { Switch } from '@/components/ui/Switch';
import { shellContent } from '@/content/en/shell';

// The display controls (P2 plan, C4; Q2): Reduce effects and the light theme, together, inside the
// menus and the footer and never in the header bar. One group per place: the mobile sheet, the mega
// menu and the footer. `place` keeps each copy's ids apart. `stack` gives each switch its own line,
// label at the start and track at the end, so the tracks line up (the sheet, the footer); `row` sets the
// two side by side at the inline end (the mega menu's strip). The note shows while a device setting
// turns Reduce effects on (the switch is then aria-disabled; effects.css): under that switch in a
// stack, under both in a row.

export type DisplayControlsProps = { place: 'sheet' | 'mega' | 'footer'; layout?: 'stack' | 'row' };

export function DisplayControls({ place, layout = 'stack' }: DisplayControlsProps) {
  const note = `dz-${place}-effects-note`;
  const row = layout === 'row';
  const width = row ? '' : 'w-full justify-between';
  return (
    <div
      role="group"
      aria-label={shellContent.displayLabel}
      className={
        row ? 'dz-display ms-auto flex flex-wrap items-center justify-end gap-x-8 gap-y-1' : 'dz-display grid gap-1'
      }
    >
      <Switch kind="effects" label={shellContent.reduceEffects} note={note} className={width} />
      <p id={note} className={`dz-switch-note text-small text-fg-muted ${row ? 'order-last basis-full text-end' : ''}`}>
        {shellContent.deviceSettingNote}
      </p>
      <Switch kind="theme" label={shellContent.lightTheme} className={width} />
    </div>
  );
}
