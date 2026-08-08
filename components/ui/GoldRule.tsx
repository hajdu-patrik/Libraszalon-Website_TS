type GoldRuleProps = {
  className?: string;
  /** Centre the rule instead of aligning it left. */
  centered?: boolean;
};

/**
 * The short gold rule the original site uses under section headings.
 * Draws itself in from the left when its Reveal ancestor fires.
 */
export function GoldRule({ className = '', centered = false }: GoldRuleProps) {
  return (
    <span
      aria-hidden="true"
      className={`block h-[3px] w-12 origin-left bg-gold ${
        centered ? 'mx-auto origin-center' : ''
      } ${className}`}
    />
  );
}
