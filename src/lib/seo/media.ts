// The SEO contract's media half (docs/ai/08 §7; decision 0033): every image, video loop, screen
// recording and 3D poster on the site is a MediaAsset, with an id from the Figma media plan (P01,
// V01, SR01, U01, S01…), a descriptive file name and the facts search and AI engines read. Pages
// render media only through these entries, and mediaProblems() is the one validator: the unit tests
// run it over every entry, and check:seo checks the same rules in the built HTML.

// The media plan's ids (Figma page Media plan, frame 63:33)
export const MEDIA_ID = /^(?:P|V|SR|U|S|F)\d{2}$/;
// place + subject + city, lowercase kebab-case; the build adds the width (…-1600w.avif)
export const MEDIA_FILE_NAME = /^[a-z0-9]+(?:-[a-z0-9]+){2,}$/;
// Alt text, written per page and slot (08 §7)
export const ALT_MAX = 125;

type Base = {
  /** The media plan's id */
  id: string;
  /** The SEO file name, without the extension or the width */
  fileName: string;
  width: number;
  height: number;
};

export type ImageAsset = Base & {
  kind: 'image';
  /** What the image shows in this context; or `decorative: true`, then alt="" */
  alt?: string;
  decorative?: true;
  caption?: string;
};

type VideoLoopAsset = Base & {
  kind: 'video-loop';
  /** Its poster and fallback: the matching photo (13 §11) */
  poster: ImageAsset;
  title: string;
  description: string;
};

type VideoAsset = Base & {
  kind: 'video';
  poster: ImageAsset;
  title: string;
  description: string;
  /** WebVTT captions and the on-page transcript (08 §7) */
  captions: string;
  transcript: string;
  /** ISO 8601 duration and upload date, for VideoObject */
  duration: string;
  uploadDate: string;
};

export type MediaAsset = ImageAsset | VideoLoopAsset | VideoAsset;

// The problems with one entry, or none. A missing fact fails here, never later in the page.
export function mediaProblems(asset: MediaAsset): string[] {
  const problems: string[] = [];
  const where = asset.id || '(no id)';
  if (!MEDIA_ID.test(asset.id)) problems.push(`${where}: the id isn't a media-plan id (P01, V01, SR01, U01, S01, F01)`);
  if (!MEDIA_FILE_NAME.test(asset.fileName)) {
    problems.push(`${where}: "${asset.fileName}" isn't a descriptive kebab-case file name (place + subject + city)`);
  }
  if (!(asset.width > 0 && asset.height > 0)) problems.push(`${where}: width and height are required`);
  if (asset.kind === 'image') {
    if (asset.decorative && asset.alt) problems.push(`${where}: a decorative image has no alt text`);
    if (!asset.decorative) {
      const alt = asset.alt?.trim() ?? '';
      if (!alt) problems.push(`${where}: alt text is required, or decorative: true`);
      else if (alt.length > ALT_MAX) problems.push(`${where}: alt text is ${alt.length} characters (≤ ${ALT_MAX})`);
      else if (/^(image|photo|picture) of\b/i.test(alt))
        problems.push(`${where}: alt text says what is shown, not "image of"`);
    }
    return problems;
  }
  problems.push(...mediaProblems(asset.poster).map((problem) => `${where} poster → ${problem}`));
  if (!asset.title.trim() || !asset.description.trim())
    problems.push(`${where}: a title and a description are required`);
  if (asset.kind === 'video') {
    if (!asset.captions.endsWith('.vtt')) problems.push(`${where}: captions must be a WebVTT file`);
    if (!asset.transcript.trim()) problems.push(`${where}: a transcript is required`);
    if (!/^P(?:T(?:\d+H)?(?:\d+M)?(?:\d+S)?)$/.test(asset.duration))
      problems.push(`${where}: duration must be ISO 8601 (PT1M30S)`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(asset.uploadDate)) problems.push(`${where}: uploadDate must be YYYY-MM-DD`);
  }
  return problems;
}
