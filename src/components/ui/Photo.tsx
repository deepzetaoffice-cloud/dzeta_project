import Image from 'next/image';
import { PHOTO_DIR } from '@/lib/media/photos';
import type { ImageAsset } from '@/lib/seo/media';

// A photo from the catalogue (src/lib/media/photos.ts), through next/image only (07; 08 §7): its
// width and height from the file, its alt text from the slot, and `sizes` from where it sits, so the
// browser picks the smallest file that stays sharp. Lazy unless it's the first screen's image.

export type PhotoProps = {
  asset: ImageAsset;
  /** How wide it shows, for the browser's pick (a `sizes` value) */
  sizes: string;
  className?: string;
  priority?: boolean;
};

export function Photo({ asset, sizes, className, priority = false }: PhotoProps) {
  return (
    <Image
      src={`${PHOTO_DIR}/${asset.fileName}.jpg`}
      width={asset.width}
      height={asset.height}
      alt={asset.decorative ? '' : (asset.alt ?? '')}
      sizes={sizes}
      className={className}
      preload={priority}
      loading={priority ? 'eager' : undefined}
      fetchPriority={priority ? 'high' : undefined}
    />
  );
}
