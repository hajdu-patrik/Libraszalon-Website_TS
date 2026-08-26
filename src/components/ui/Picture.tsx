import { fallbackSrc, getImage, srcSet, type ImageSlug } from '@/lib/images';

type PictureProps = {
  slug: ImageSlug;
  alt: string;
  /** Matches the rendered width so the browser picks the right rendition. */
  sizes?: string;
  className?: string;
  /** Set on the LCP image only: eager, high priority, decoded in line. */
  priority?: boolean;
  /**
   * Overrides, for an image whose loading needs fall on neither side of
   * `priority`. The intro curtain's mark is the only one so far: it has to be
   * fetched eagerly, because a lazy image inside a display:none subtree is
   * never requested at all, but it must not outrank the hero photograph.
   */
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'sync' | 'async' | 'auto';
};

/**
 * Renders one of the pre-generated image sets.
 *
 * Static export rules out next/image's runtime optimiser, so the responsive
 * ladder is built at asset-prep time instead and served straight from the CDN.
 * Width and height always come from the manifest, which is what pins layout
 * shift to zero.
 */
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
