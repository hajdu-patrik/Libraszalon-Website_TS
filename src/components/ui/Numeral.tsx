type NumeralProps = {
  value: number;
  className?: string;
};

/** Decorative two-digit ordinal, hidden from assistive tech (an <ol> announces positions
 *  itself). Card numerals default to tabular figures so the text next to them starts at
 *  the same x in every card. */
export function Numeral({ value, className = 'text-numeral tabular-nums' }: NumeralProps) {
  return (
    <span
      aria-hidden="true"
      className={`block font-heading leading-none font-medium text-accent ${className}`}
    >
      {String(value).padStart(2, '0')}
    </span>
  );
}
