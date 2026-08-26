import { Picture } from '@/components/ui/Picture';

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
export function IntroVeil() {
  return (
    <div aria-hidden="true" className="intro-veil">
      <div className="intro-veil-inner">
        {/*
          The one image on the site whose loading needs fall on neither side of
          Picture's `priority` switch, so it names all three explicitly.

          eager: the curtain is on screen within the first frames, so the fetch
          cannot be deferred — and a lazy image inside a display:none subtree is
          never requested at all, which would leave the mark missing on exactly
          the load that needs it.

          fetchPriority low: 16KB that only matters on the first load of a visit
          has no business competing with the hero photograph for the LCP. Being
          the first image in the document, it is discovered immediately anyway.

          This used to be a hand-written <picture> holding its own copy of the
          srcset ladder, purely because those three attributes could not be
          expressed. Overriding them is cheaper than a second implementation of
          the thing Picture is for.
        */}
        <Picture
          slug="mark"
          alt=""
          sizes="176px"
          loading="eager"
          fetchPriority="low"
          decoding="async"
          className="w-36 sm:w-44"
        />

        <span className="intro-veil-rule" />
      </div>
    </div>
  );
}
