import { Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { site } from '@/content/site';
import { booking } from '@/content/ui';

export function BookingActions({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 sm:gap-4 ${className}`}>
      <Button href={`tel:${site.phoneHref}`} icon={<Phone className="size-[18px]" strokeWidth={1.8} />}>
        {booking.callLabel}
      </Button>
      <Button
        href={`mailto:${site.email}`}
        variant="outline"
        icon={<Mail className="size-[18px]" strokeWidth={1.8} />}
      >
        {booking.emailLabel}
      </Button>
    </div>
  );
}
