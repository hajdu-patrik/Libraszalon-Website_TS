type GoldRuleProps = {
  className?: string;

  centered?: boolean;
};

export function GoldRule({ className = '', centered = false }: GoldRuleProps) {
  return (
    <span
      aria-hidden="true"
      className={`flex items-center gap-1.5 ${centered ? 'justify-center' : ''} ${className}`}
    >
      <span className="block h-px w-8 bg-gold/50" />
      <span className="block h-[3px] w-10 rounded-full bg-gold" />
      <span className="block h-px w-8 bg-gold/50" />
    </span>
  );
}
