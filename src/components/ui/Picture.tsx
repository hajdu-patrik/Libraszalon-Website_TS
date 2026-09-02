import { fallbackSrc, getImage, srcSet, type ImageSlug } from '@/lib/images';

type PictureProps = {
  slug: ImageSlug;
  alt: string;

  sizes?: string;
  className?: string;

  priority?: boolean;

loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'sync' | 'async' | 'auto';
};

export function Picture({
  slug,
  alt,
  sizes = '100vw',
  className,
  priority = false,
  loading,
  fetchPriority,
  decoding,
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
        decoding={decoding ?? (priority ? 'sync' : 'async')}
      />
    </picture>
  );
}
