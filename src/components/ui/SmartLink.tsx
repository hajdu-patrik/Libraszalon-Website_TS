import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { ui } from '@/content/ui';

type SmartLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { href: string };

const NATIVE_SCHEME = /^(?:https?:|mailto:|tel:)/;
const EXTERNAL = /^https?:/;

/** Internal paths go through next/link; tel:, mailto: and other sites get a plain anchor,
 *  and other sites also open in a new tab with that announced to screen readers. */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  if (!NATIVE_SCHEME.test(href)) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  const external = EXTERNAL.test(href);

  return (
    <a href={href} {...(external && { target: '_blank', rel: 'noopener noreferrer' })} {...rest}>
      {children}
      {external && <span className="sr-only"> {ui.newTab}</span>}
    </a>
  );
}
