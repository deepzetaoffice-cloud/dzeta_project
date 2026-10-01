// The language switch's place (P2 plan, H5; docs/ai/11 §2). English is the only locale
// (src/lib/i18n/locales.ts), so it renders nothing and isn't mounted yet. P11 adds Arabic, gives this
// its behaviour (the globe icon and a link to the same page in the other language) and mounts it in
// the header and the footer (header.md, footer.md).
export function LanguageSwitch() {
  return null;
}
