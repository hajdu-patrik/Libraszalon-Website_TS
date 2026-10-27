import { Picture } from '@/components/ui/Picture';

/** Brand curtain shown once per browser session; INTRO_BOOTSTRAP decides before first
 *  paint whether it plays, and globals.css drives the whole animation. */
export function IntroVeil() {
  return (
    <div aria-hidden="true" className="intro-veil">
      <div className="intro-veil-inner">
        <Picture
          slug="mark"
          alt=""
          sizes="176px"
          loading="lazy"
          fetchPriority="low"
          className="w-36 sm:w-44"
        />
        <span className="intro-veil-rule" />
      </div>
    </div>
  );
}
