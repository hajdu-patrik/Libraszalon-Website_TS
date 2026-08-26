type GoldSignatureProps = {
  className?: string;
};

/**
 * The gold hairline drawn across the top of a framed panel: full strength at
 * the left, fading out to the right, so it reads as a signature stroke rather
 * than a rule.
 *
 * The featured price card, the contact panel and the standing notice all open
 * with it, and all three had the gradient written out in full. One of them
 * sits in normal flow and two are positioned, which is the whole reason for
 * the className passthrough — the mark is the same object in every case, only
 * the way it is attached differs.
 */
export function GoldSignature({ className = '' }: GoldSignatureProps) {
  return (
    <span
      aria-hidden="true"
      className={`block h-1 bg-gradient-to-r from-gold via-gold/60 to-transparent ${className}`}
    />
  );
}
