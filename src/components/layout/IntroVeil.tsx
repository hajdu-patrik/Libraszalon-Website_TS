import { Picture } from '@/components/ui/Picture';

export function IntroVeil() {
  return (
    <div aria-hidden="true" className="intro-veil">
      <div className="intro-veil-inner">
        {

}
        <Picture
          slug="mark"
          alt=""
          sizes="176px"
          loading="lazy"
          fetchPriority="low"
          decoding="async"
          className="w-36 sm:w-44"
        />

        <span className="intro-veil-rule" />
      </div>
    </div>
  );
}
