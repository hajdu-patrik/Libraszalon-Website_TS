'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';
import { CloseIcon } from '@/components/ui/Icons';
import { notice, noticeStorageKey } from '@/content/notice';

/**
 * The salon's standing capacity notice.
 *
 * On the WordPress site this was a full-screen modal that had to be dismissed
 * before anything could be read. Google treats that pattern as an intrusive
 * interstitial on mobile, so the same message is delivered as a bar that sits
 * above the content instead of covering it.
 */

// localStorage is an external store, so read it through the API React provides
// for exactly that. Reading it in an effect would mean a render pass with the
// wrong answer first, which is what makes dismissed banners flash back.
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Fires when another tab dismisses the notice.
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function isDismissed() {
  try {
    return window.localStorage.getItem(noticeStorageKey) === 'dismissed';
  } catch {
    // Private browsing can throw. Showing the notice is the safe default —
    // it carries booking-relevant information.
    return false;
  }
}

/** On the server the bar is never rendered, so the HTML stays identical for
 *  every visitor and remains cacheable. */
function isDismissedOnServer() {
  return true;
}

export function NoticeBar() {
  const dismissed = useSyncExternalStore(subscribe, isDismissed, isDismissedOnServer);
  const [expanded, setExpanded] = useState(false);

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(noticeStorageKey, 'dismissed');
    } catch {
      // Nothing to do — the notice simply reappears next visit.
    }
    listeners.forEach((listener) => listener());
  }, []);

  if (dismissed) return null;

  return (
    <aside
      aria-label={notice.title}
      style={{ animation: 'slide-down 0.35s var(--ease-out-expo) both' }}
      className="relative z-30 border-b border-gold/30 bg-[color-mix(in_srgb,var(--color-gold)_10%,white)]"
    >
      <div className="container-page flex items-start gap-3 py-3 sm:gap-4 sm:py-4">
        <div className="min-w-0 flex-1 text-sm leading-relaxed text-ink">
          <p
            id="notice-body"
            // Clamped so the notice never swallows the whole first screen on a
            // phone; the full text is one tap away and always in the DOM for
            // search engines and screen readers.
            className={expanded ? undefined : 'line-clamp-2 sm:line-clamp-none'}
          >
            <strong className="font-heading font-semibold">{notice.title}</strong>{' '}
            <span className="text-muted">{notice.body}</span>
          </p>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls="notice-body"
            className="mt-1 inline-flex min-h-11 items-center font-heading text-sm font-semibold text-gold-ink transition-colors hover:text-ink sm:hidden"
          >
            {expanded ? 'Kevesebb' : 'Részletek'}
          </button>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={notice.dismissLabel}
          className="-mt-2 -mr-3 inline-flex size-11 shrink-0 items-center justify-center rounded text-muted transition-colors hover:bg-gold/10 hover:text-ink"
        >
          <CloseIcon className="size-[18px]" />
        </button>
      </div>
    </aside>
  );
}
