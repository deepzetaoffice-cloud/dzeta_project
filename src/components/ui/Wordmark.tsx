import { LIGHT_WORDMARK_CROP, LIGHT_WORDMARK_VERSIONED_URL } from '@/lib/brand-light';

// The owner's white-background wordmark (C78; Figma Brand/Logo wordmark · light, 2:337): the header's
// and the footer's logo, shown through its own bytes and only scaled (docs/ai/05 §6). The file's
// canvas is square with its viewBox cropped to the wordmark, so the <img> takes the crop's ratio and
// object-fit: cover shows exactly that band. It never mirrors in RTL (11 §1).

export type WordmarkProps = {
  /** Its accessible name (siteConfig.brandName); leave it out where a visible name sits beside it */
  label?: string;
  /** Must set the height; the width follows the crop's ratio. The ink fills 95% of the crop's width
      and 85% of its height, so a box 1.18 × Figma's ink height shows the wordmark at Figma's size. */
  className: string;
};

export function Wordmark({ label, className }: WordmarkProps) {
  return (
    // A static SVG served as it is: next/image would only pass it through (05 §6).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LIGHT_WORDMARK_VERSIONED_URL}
      width={LIGHT_WORDMARK_CROP.width}
      height={LIGHT_WORDMARK_CROP.height}
      alt={label ?? ''}
      decoding="async"
      className={`aspect-[910/210] w-auto object-cover ${className}`}
    />
  );
}
