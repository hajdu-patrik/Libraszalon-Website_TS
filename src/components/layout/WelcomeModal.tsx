'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarClock, X } from 'lucide-react';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { notice, noticeStorageKey } from '@/content/notice';

/**
 * The salon's standing capacity notice, delivered as a corner card that slides
 * in shortly after load.
 *
 * Deliberately not a full-screen overlay: Google treats blocking interstitials
 * as an intrusive pattern on mobile, and a visitor mid-task should never have
 * to dismiss anything to keep reading. The card floats above the content
 * without covering the text, takes no focus, and once dismissed stays away.
 */

/** How long the page gets to itself before the card slides in. */
const ENTER_DELAY_MS = 1200;

// localStorage is an external store, so read it through the API React provides
// for exactly that. Reading it in an effect would mean a render pass with the
// wrong answer first, which is what makes dismissed notices flash back.
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

/** On the server the card is never rendered, so the HTML stays identical for
 *  every visitor and remains cacheable. */
function isDismissedOnServer() {
  return true;
}

export function WelcomeModal() {
  const dismissed = useSyncExternalStore(subscribe, isDismissed, isDismissedOnServer);
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), ENTER_DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(noticeStorageKey, 'dismissed');
    } catch {
      // Nothing to do — the notice simply reappears next visit.
    }
    listeners.forEach((listener) => listener());
  }, []);

  return (
    <AnimatePresence>
      {ready && !dismissed && (
        <motion.section
          aria-label={notice.title}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: reduced ? 0.01 : 0.55, ease: [0.16, 1, 0.3, 1] }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') dismiss();
          }}
          className="fixed inset-x-4 bottom-4 z-40 overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-lift)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[24.5rem]"
        >
          {/* Gold signature line across the top of the card. */}
          <span aria-hidden="true" className="block h-1 w-full bg-gradient-to-r from-gold via-gold/60 to-transparent" />

          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-ink"
              >
                <CalendarClock className="size-5" strokeWidth={1.8} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="font-heading text-xl leading-tight text-ink">
                  {notice.title}
                </p>
                <p
                  id="welcome-notice-body"
                  className={`mt-2 text-sm leading-relaxed text-muted ${
                    expanded ? '' : 'line-clamp-3 sm:line-clamp-none'
                  }`}
                >
                  {notice.body}
                </p>
                {/* Phones get the message clamped so the card never swallows
                    the screen; the full text is one tap away and always in the
                    DOM for screen readers. */}
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  aria-expanded={expanded}
                  aria-controls="welcome-notice-body"
                  className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-gold-ink transition-colors hover:text-ink sm:hidden"
                >
                  {expanded ? notice.collapseLabel : notice.expandLabel}
                </button>
              </div>

              <button
                type="button"
                onClick={dismiss}
                aria-label={notice.dismissLabel}
                className="-mt-2 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-gold/10 hover:text-ink"
              >
                <X aria-hidden="true" className="size-4" strokeWidth={1.8} />
              </button>
            </div>

            <button
              type="button"
              onClick={dismiss}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold tracking-wide text-cream-text transition-colors duration-300 hover:bg-gold-ink"
            >
              {notice.confirmLabel}
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
