import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { ROUTES } from '@/lib/routes';
import { ALT_MAX, MEDIA_ID, mediaProblems, type ImageAsset, type MediaAsset } from '@/lib/seo/media';
import { DESCRIPTION_LENGTH, pageMetadata, TITLE_LENGTH } from '@/lib/seo/page-seo';
import { absoluteUrl } from '@/lib/url';

// The SEO contract (docs/ai/08 §7; decision 0033): the page builder, the media validator and the
// sitemap. check:seo checks the same rules in the built HTML (tests/gates/rules.ts).

const photo: ImageAsset = {
  kind: 'image',
  id: 'P09',
  fileName: 'speed-to-lead-whatsapp-notification-dubai-night',
  width: 2400,
  height: 1800,
  alt: 'A phone on a walnut desk lights up with a new message at night, the Dubai skyline behind it',
};

describe('pageMetadata', () => {
  it('builds the title, description, self-canonical, Open Graph and Twitter from one PageSeo', () => {
    const metadata = pageMetadata({ title: 'Services', description: 'd'.repeat(130), path: '/services' });
    expect(metadata.title).toBe('Services');
    expect(metadata.alternates?.canonical).toBe(absoluteUrl('/services'));
    expect(metadata.openGraph).toMatchObject({ title: 'Services | Deepzeta AI', url: absoluteUrl('/services') });
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
  });

  it('gives Home an absolute title, since the layout template does not reach its own segment', () => {
    expect(pageMetadata({ title: 'Home', description: 'd', path: '/', root: true }).title).toEqual({
      absolute: 'Home | Deepzeta AI',
    });
  });

  it('keeps the contract ranges of 08 §1', () => {
    expect(TITLE_LENGTH).toEqual({ min: 30, max: 60 });
    expect(DESCRIPTION_LENGTH).toEqual({ min: 120, max: 160 });
  });
});

describe('mediaProblems', () => {
  it('passes a complete photo and a video loop with that photo as its poster', () => {
    const loop: MediaAsset = {
      kind: 'video-loop',
      id: 'V09',
      fileName: 'speed-to-lead-whatsapp-notification-dubai-night-loop',
      width: 1440,
      height: 1080,
      poster: photo,
      title: 'A new lead arrives on WhatsApp at night',
      description: 'A six-second loop of a phone lighting up with a new message.',
    };
    expect(mediaProblems(photo)).toEqual([]);
    expect(mediaProblems(loop)).toEqual([]);
  });

  it('fails a bad id, a vague file name, a missing size and missing or long alt text', () => {
    const problems = mediaProblems({
      ...photo,
      id: 'IMG1',
      fileName: 'IMG_0042',
      width: 0,
      alt: 'x'.repeat(ALT_MAX + 1),
    });
    expect(problems.join('\n')).toMatch(/media-plan id[\s\S]*kebab-case[\s\S]*width and height[\s\S]*characters/);
    expect(mediaProblems({ ...photo, alt: undefined })[0]).toMatch(/alt text is required/);
    expect(mediaProblems({ ...photo, alt: 'Image of a phone' })[0]).toMatch(/not "image of"/);
  });

  it('accepts a decorative image without alt, and refuses alt on one', () => {
    expect(mediaProblems({ ...photo, alt: undefined, decorative: true })).toEqual([]);
    expect(mediaProblems({ ...photo, decorative: true })[0]).toMatch(/decorative image has no alt/);
  });

  it('asks a video with content for captions, a transcript, a duration and an upload date', () => {
    const video: MediaAsset = {
      kind: 'video',
      id: 'F01',
      fileName: 'founder-introduction-deepzeta-ai-dubai',
      width: 1920,
      height: 1080,
      poster: photo,
      title: 'Meet the founder',
      description: 'The founder introduces Deepzeta AI.',
      captions: 'founder.srt',
      transcript: '',
      duration: '90 seconds',
      uploadDate: '18/10/2026',
    };
    expect(mediaProblems(video).join('\n')).toMatch(/WebVTT[\s\S]*transcript[\s\S]*ISO 8601[\s\S]*YYYY-MM-DD/);
  });

  it('knows the media plan ids', () => {
    for (const id of ['P01', 'V21', 'SR18', 'U32', 'S04', 'F01']) expect(MEDIA_ID.test(id)).toBe(true);
  });
});

describe('the sitemap', () => {
  it('lists every live route once, absolute, with no invented dates', () => {
    const entries = sitemap();
    const live = Object.values(ROUTES).filter((route) => route.live);
    expect(entries.map((entry) => entry.url)).toEqual(live.map((route) => absoluteUrl(route.path)));
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(true);
  });
});
