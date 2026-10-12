// The legal pages' contents enhancement (the privacy page plan; the draft's Part 1, block 3): marks the
// link of the section in view with aria-current, in both contents lists. Loaded lazily by the shared
// loader (fx/lazy.ts) on the first pointer or focus inside the contents and sections — never on first
// load. No React and no motion: it only sets an attribute; the links work without it.
export function enhanceToc(scope: ParentNode): void {
  const sections = [...scope.querySelectorAll<HTMLElement>('[data-legal-section]')];
  const links = [...scope.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')];
  if (sections.length === 0 || links.length === 0) return;

  const mark = (id: string) => {
    for (const link of links) {
      if (link.dataset.tocLink === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  // The section crossing a band near the top of the viewport is the one being read
  const visible = new Set<string>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      const current = sections.find((section) => visible.has(section.id));
      if (current) mark(current.id);
    },
    { rootMargin: '-20% 0px -70% 0px' },
  );
  for (const section of sections) observer.observe(section);
}
