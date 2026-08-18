import { fallbackSrc, getImage, srcSet } from '@/lib/images';

/**
 * The curtain that opens the first page of a visit: the salon's mark settles
 * in on warm cream, a gold hairline draws out beneath it, and the whole panel
 * lifts away to hand over to the page underneath.
 *
 * Rendered into every page's HTML but kept at `display: none` until the
 * bootstrap script in <head> sets [data-intro] on the root element. Doing it
 * that way round means there is no frame in which the curtain can flash on a
 * repeat visit, and no JavaScript at all is required to keep it hidden.
 *
 * The mark is the only asset involved, and it is line art rather than type, so
 * the sequence never waits on a webfont and never re-flows when one swaps in
 * mid-animation.
 *
 * `pointer-events: none` on purpose: even in the unlikely event that both the
 * animation and the cleanup timer fail, the page underneath stays fully usable.
 */

const MARK = 'mark';

export function IntroVeil() {
  const { width, height } = getImage(MARK);

  return (
    <div aria-hidden="true" className="intro-veil">
      <div className="intro-veil-inner">
        {/*
          Hand-written rather than <Picture> because this one image needs
          loading semantics no other image on the site wants.

          eager: the curtain is on screen within the first frames, so the fetch
          cannot be deferred — and a lazy image inside a display:none subtree is
          never requested at all, which would leave the mark missing on exactly
          the load that needs it.

          fetchPriority low: 16KB that only matters on the first load of a visit
          has no business competing with the hero photograph for the LCP. Being
          the first image in the document, it is discovered immediately anyway.
        */}
        <picture>
          <source type="image/avif" srcSet={srcSet(MARK, 'avif')} sizes="176px" />
          <source type="image/webp" srcSet={srcSet(MARK, 'webp')} sizes="176px" />
          <img
            src={fallbackSrc(MARK)}
            alt=""
            width={width}
            height={height}
            loading="eager"
            fetchPriority="low"
            decoding="async"
            className="w-36 sm:w-44"
          />
        </picture>

        <span className="intro-veil-rule" />
      </div>
    </div>
  );
}
