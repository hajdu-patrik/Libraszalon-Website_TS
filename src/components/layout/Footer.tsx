import Link from 'next/link';
import { GitHubIcon, LinkedInIcon } from '@/components/ui/BrandIcons';
import { ContactList } from '@/components/ui/ContactList';
import { CurrentYear } from '@/components/ui/CurrentYear';
import { SmartLink } from '@/components/ui/SmartLink';
import { homeItem, navItems } from '@/content/nav';
import { developer, site } from '@/content/site';
import { ui } from '@/content/ui';

const DEVELOPER_LINKS = [
  { ...developer.github, Icon: GitHubIcon },
  { ...developer.linkedin, Icon: LinkedInIcon },
];

/** Brand, page links and contact details sit side by side from `md` up and stack below
 *  it; every link row is still 44px tall, so the saving comes from sharing rows. */
export function Footer() {
  return (
    <footer className="tone-dark text-meta">
      <div className="container-page pt-8 pb-4 sm:pt-10">
        <div className="grid gap-x-12 gap-y-4 md:grid-cols-[minmax(0,1fr)_auto] xl:grid-cols-[minmax(0,1.1fr)_auto_minmax(0,1.4fr)]">
          <div>
            <Link
              href={homeItem.href}
              className="inline-flex min-h-11 items-center font-heading text-2xl transition-colors hover:text-accent"
            >
              {site.legalName}
            </Link>
            <p className="text-subtle">
              {site.owner} · {site.ownerTitle}
            </p>
            <p className="mt-3 max-w-xs font-script text-xl leading-snug text-accent">{site.tagline}</p>
          </div>

          <nav aria-label={ui.footerNav}>
            <ul className="flex flex-wrap gap-x-5 md:grid md:grid-cols-2 md:gap-x-10">
              {[homeItem, ...navItems].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center text-subtle transition-colors hover:text-accent md:justify-start"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2 xl:col-span-1">
            <h2 className="sr-only">{ui.contactHeading}</h2>
            <address className="not-italic">
              <ContactList
                items={['phone', 'email', 'address', 'hours', 'facebook']}
                size="compact"
                className="flex flex-wrap gap-x-6 leading-snug text-subtle"
              />
            </address>
          </div>
        </div>

        {/* The fixed back-to-top button sits over the bar's right end up to ~1300px wide. */}
        <div className="mt-4 flex flex-col gap-1 border-t border-cream-text/10 pt-3 md:flex-row md:items-center md:justify-between md:gap-6 md:pr-14 min-[81.5rem]:pr-0">
          <p className="text-subtle">
            <CurrentYear fallback={new Date().getFullYear()} /> © {site.legalName} · {site.copyright}
          </p>

          <div className="flex items-center gap-2">
            <span className="mr-1 text-subtle">{developer.heading}</span>
            {DEVELOPER_LINKS.map(({ href, label, Icon }) => (
              <SmartLink
                key={href}
                href={href}
                title={label}
                className="inline-flex size-11 items-center justify-center rounded-full border border-cream-text/15 text-gold transition-colors hover:border-gold hover:bg-gold/10"
              >
                <Icon className="size-5" />
                <span className="sr-only">{label}</span>
              </SmartLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
