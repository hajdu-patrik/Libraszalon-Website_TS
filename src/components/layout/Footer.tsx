import Link from 'next/link';
import { GitHubIcon, LinkedInIcon } from '@/components/ui/BrandIcons';
import { ContactList } from '@/components/ui/ContactList';
import { CurrentYear } from '@/components/ui/CurrentYear';
import { SmartLink } from '@/components/ui/SmartLink';
import { homeItem, navItems } from '@/content/nav';
import { developer, site } from '@/content/site';
import { ui } from '@/content/ui';

const LINK = 'min-h-11 items-center text-subtle transition-colors hover:text-accent';

const DEVELOPER_LINKS = [
  { ...developer.github, Icon: GitHubIcon },
  { ...developer.linkedin, Icon: LinkedInIcon },
];

export function Footer() {
  return (
    <footer className="tone-dark">
      <div className="container-page pt-16 pb-10 sm:pt-20 sm:pb-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-11 sm:gap-x-10 lg:grid-cols-[1.4fr_0.8fr_1.2fr_0.9fr] lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <Link
              href={homeItem.href}
              className="inline-flex min-h-11 items-center font-heading text-3xl transition-colors hover:text-accent"
            >
              {site.legalName}
            </Link>
            <p className="mt-4 max-w-sm font-script text-script leading-snug text-accent">
              {site.tagline}
            </p>
            <p className="mt-5 text-meta text-subtle">
              {site.owner} · {site.ownerTitle}
            </p>
          </div>

          <nav aria-label={ui.footerNav}>
            <h2 className="eyebrow mb-4">{ui.footerPages}</h2>
            <ul>
              {[homeItem, ...navItems].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`flex ${LINK}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:order-4">
            <h2 className="eyebrow mb-4">{developer.heading}</h2>
            <ul>
              {DEVELOPER_LINKS.map(({ href, label, Icon }) => (
                <li key={href}>
                  <SmartLink href={href} className={`inline-flex gap-3.5 ${LINK}`}>
                    <Icon className="size-5 shrink-0 text-gold" />
                    {label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:order-3 lg:col-span-1">
            <h2 className="eyebrow mb-4">{ui.contactHeading}</h2>
            <address className="not-italic">
              <ContactList
                items={['phone', 'email', 'address', 'hours', 'facebook']}
                className="space-y-1 text-subtle"
              />
            </address>
          </div>
        </div>

        <p className="mt-12 border-t border-cream-text/10 pt-6 text-center text-meta text-subtle sm:mt-14">
          <CurrentYear fallback={new Date().getFullYear()} /> © {site.legalName} · {site.copyright}
        </p>
      </div>
    </footer>
  );
}
