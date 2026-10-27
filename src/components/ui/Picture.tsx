import { fallbackSrc, getImage, srcSet, type ImageSlug } from '@/lib/images';

type PictureProps = {
  slug: ImageSlug;
  alt: string;
  sizes?: string;
  className?: string;
  /** The page's LCP image: eager, high fetch priority, decoded synchronously. */
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
};

/** AVIF with a WebP fallback from the pre-generated widths; intrinsic width/height come
 *  from the manifest so the browser reserves the box before the file arrives. */
export function Picture({
  slug,
  alt,
  sizes = '100vw',
  className,
  priority = false,
  loading,
  fetchPriority,
}: PictureProps) {
  const { width, height } = getImage(slug);

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(slug, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(slug, 'webp')} sizes={sizes} />
      <img
        src={fallbackSrc(slug)}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading ?? (priority ? 'eager' : 'lazy')}
        fetchPriority={fetchPriority ?? (priority ? 'high' : 'auto')}
        decoding={priority ? 'sync' : 'async'}
      />
    </picture>
  );
}
