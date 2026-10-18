import type { Pillar } from '@/components/icons/registry';
import type { ImageAsset } from '@/lib/seo/media';

// The photos (Figma page Media plan, frame 63:33; decision 0033): ElevenLabs stills of hands, devices
// and places, never a face shown as a client or the team, never text in the image. Each file lives once
// in public/media/photos/ under its SEO file name (08 §7), copied unchanged from the owner's 2400 px
// JPEGs; next/image serves it as AVIF or WebP at the widths in next.config.ts (07). The catalogue holds
// the file's facts; alt text is written per page and slot, where the photo is used.

type PhotoFile = Pick<ImageAsset, 'id' | 'fileName' | 'width' | 'height'>;

export const PHOTOS = {
  // The four doors, one per pillar: the Home cards and the mega menu's preview rail (header.md)
  P01: { id: 'P01', fileName: 'door-ai-whatsapp-cafe-dubai', width: 2400, height: 1800 },
  P02: { id: 'P02', fileName: 'door-websites-laptop-dubai-marina', width: 2400, height: 1800 },
  P03: { id: 'P03', fileName: 'door-software-tablet-warehouse-jebel-ali', width: 2400, height: 1800 },
  P04: { id: 'P04', fileName: 'door-growth-boutique-street-dubai-dusk', width: 2400, height: 1800 },
  // The four industry groups (catalogue §7.1–§7.4): Home's industry rail
  P05: { id: 'P05', fileName: 'industry-b2b-corporate-tech-difc-meeting', width: 2400, height: 1800 },
  P06: { id: 'P06', fileName: 'industry-ecommerce-packing-orders-dubai', width: 2400, height: 1800 },
  P07: { id: 'P07', fileName: 'industry-real-estate-keys-dubai-apartment', width: 2400, height: 1800 },
  P08: { id: 'P08', fileName: 'industry-medical-dental-clinic-dubai', width: 2400, height: 1800 },
  // The audit session: Home's How we work
  P21: { id: 'P21', fileName: 'free-ai-audit-process-map-session-dubai', width: 2400, height: 1800 },
} as const satisfies Record<string, PhotoFile>;

export type PhotoId = keyof typeof PHOTOS;

export const PHOTO_DIR = '/media/photos';

// Each pillar's door photo
export const PILLAR_DOOR: Record<Pillar, PhotoId> = { ai: 'P01', web: 'P02', software: 'P03', ranking: 'P04' };

// Each industry group's photo, by its catalogue number
export const GROUP_PHOTO: Record<string, PhotoId> = { '7.1': 'P05', '7.2': 'P06', '7.3': 'P07', '7.4': 'P08' };

// One use of a photo: what it shows in this slot, or decorative (alt="") beside text that says it
export function photo(id: PhotoId, slot: { alt: string } | { decorative: true }): ImageAsset {
  return { kind: 'image', ...PHOTOS[id], ...slot };
}
