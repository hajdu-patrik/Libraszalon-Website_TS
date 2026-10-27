/** Gold top edge shared by the capped panels (featured price, contact card, notice). */
export function GoldSignature({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-1 bg-gradient-to-r from-gold via-gold/60 to-transparent ${className}`}
    />
  );
}
