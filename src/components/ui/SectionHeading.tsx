import { GoldRule } from '@/components/ui/GoldRule';

type SectionHeadingProps = {
  title: string;
  eyebrow?: string;
  /** Eyebrow-styled line under the title (e.g. a role under a name). */
  subtitle?: string;
  lead?: string;
  align?: 'left' | 'center';
  id?: string;
  className?: string;
};

/** Eyebrow, h2 and gold rule — the heading block every section opens with. Colours come
 *  from the section's tone, so the same block works on light and dark sections. */
export function SectionHeading({
  title,
  eyebrow,
  subtitle,
  lead,
  align = 'center',
  id,
  className = '',
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      <hgroup>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h2 id={id} className="text-h2">
          {title}
        </h2>
        {subtitle && <p className="eyebrow mt-3">{subtitle}</p>}
      </hgroup>
      <GoldRule centered={centered} className="mt-6" />
      {lead && (
        <p className={`mt-6 max-w-2xl text-subtle ${centered ? 'mx-auto sm:text-balance' : ''}`}>
          {lead}
        </p>
      )}
    </div>
  );
}
