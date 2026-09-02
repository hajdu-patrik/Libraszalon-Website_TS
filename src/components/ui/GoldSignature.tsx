type GoldSignatureProps = {
  className?: string;
};

export function GoldSignature({ className = '' }: GoldSignatureProps) {
  return (
    <span
      aria-hidden="true"
      className={`block h-1 bg-gradient-to-r from-gold via-gold/60 to-transparent ${className}`}
    />
  );
}
