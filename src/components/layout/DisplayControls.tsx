import { Switch } from '@/components/ui/Switch';
import { shellContent } from '@/content/en/shell';

// The display controls (P2 plan, C4; Q2): Reduce effects and the light theme, together, inside the
// menus and the footer and never in the header bar. One group per place: the mobile sheet, the mega
// menu's rail and the footer. `place` keeps each copy's ids apart. The note shows while a device
// setting turns Reduce effects on (the switch is then aria-disabled; effects.css).

export type DisplayControlsProps = { place: 'sheet' | 'mega' | 'footer' };

export function DisplayControls({ place }: DisplayControlsProps) {
  const note = `dz-${place}-effects-note`;
  return (
    <div role="group" aria-label={shellContent.displayLabel} className="dz-display-controls grid gap-1">
      <Switch kind="effects" label={shellContent.reduceEffects} describedBy={note} />
      <p id={note} className="dz-switch-note text-small text-fg-muted">
        {shellContent.deviceSettingNote}
      </p>
      <Switch kind="theme" label={shellContent.lightTheme} />
    </div>
  );
}
