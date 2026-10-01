// scroll-journey-line (docs/ai/13 §4.4; P2 plan, L2): a page-progress line on the inline-start edge,
// drawn by the page's own scroll through a native scroll timeline, with the progress pixel (13 §8) at
// its tip; it reaches the end as the page reaches the footer's finale, where The Landing plays.
// Sitewide chrome, so it doesn't count toward a view's effects (13 §2.3). CSS only (effects.css): it
// isn't drawn without scroll-driven animation support or under Reduce effects. Decorative.
export function JourneyLine() {
  return (
    <div className="dz-journey" aria-hidden="true">
      <span className="dz-journey-line" />
      <span className="dz-journey-px" />
    </div>
  );
}
