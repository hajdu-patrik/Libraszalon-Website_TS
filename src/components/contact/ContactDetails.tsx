import { ContactList } from '@/components/ui/ContactList';
import { GoldSignature } from '@/components/ui/GoldSignature';
import { contact } from '@/content/pages/contact';

export function ContactDetails() {
  return (
    <div className="tone-light panel relative overflow-hidden p-card">
      <GoldSignature className="absolute inset-x-0 top-0" />

      <h2 className="text-h3">{contact.detailsHeading}</h2>
      <address className="mt-5 not-italic">
        <ContactList items={['phone', 'email', 'address', 'hours']} className="space-y-1 text-subtle" />
      </address>

      <div className="mt-7 border-t border-line pt-6">
        <h3 className="eyebrow">{contact.socialHeading}</h3>
        <ContactList items={['facebook']} className="mt-2 text-subtle" />
      </div>
    </div>
  );
}
