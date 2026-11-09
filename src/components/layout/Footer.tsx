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
      <div className="container-page pt-10 pb-6 sm:pt-12 sm:pb-7">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 text-meta sm:gap-x-10 lg:grid-cols-[1.2fr_1.3fr_1.3fr_0.8fr] lg:gap-10">
          <div className="col-span-2 lg:col-span-1">
            <Link
              href={homeItem.href}
              className="inline-flex min-h-11 items-center font-heading text-2xl transition-colors hover:text-accent"
            >
              {site.legalName}
            </Link>
            <p className="mt-2 max-w-xs font-script text-xl leading-snug text-accent">
              {site.tagline}
            </p>
            <p className="mt-3 text-meta text-subtle">
              {site.owner} · {site.ownerTitle}
            </p>
          </div>

          <nav aria-label={ui.footerNav} className="col-span-2 lg:col-span-1">
            <h2 className="eyebrow mb-2">{ui.footerPages}</h2>
            <ul className="grid grid-cols-2 gap-x-6">
              {[homeItem, ...navItems].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`flex ${LINK}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="order-4 col-span-2 lg:col-span-1">
            <h2 className="eyebrow mb-2">{developer.heading}</h2>
            <ul className="flex flex-wrap gap-x-8 lg:block">
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

          <div className="order-3 col-span-2 lg:col-span-1">
            <h2 className="eyebrow mb-2">{ui.contactHeading}</h2>
            <address className="not-italic">
              <ContactList
                items={['phone', 'email', 'address', 'hours', 'facebook']}
                className="text-subtle"
              />
            </address>
          </div>
        </div>

        <p className="mt-8 border-t border-cream-text/10 pt-5 text-center text-meta text-subtle">
          <CurrentYear fallback={new Date().getFullYear()} /> © {site.legalName} · {site.copyright}
        </p>
      </div>
    </footer>
  );
}
