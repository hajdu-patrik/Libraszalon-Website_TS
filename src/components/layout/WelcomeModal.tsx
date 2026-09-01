'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarClock, X } from 'lucide-react';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { GoldSignature } from '@/components/ui/GoldSignature';
import { notice, noticeStorageKey } from '@/content/notice';
import { INTRO_ATTRIBUTE, INTRO_TOTAL_MS } from '@/lib/intro';

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
    // On the first load of a visit the intro curtain is still lifting at
    // ENTER_DELAY_MS, so the card would slide in behind it and be revealed
    // already half-arrived. Queue behind the curtain instead.
    const intro = document.documentElement.hasAttribute(INTRO_ATTRIBUTE)
      ? INTRO_TOTAL_MS
      : 0;
    const id = window.setTimeout(() => setReady(true), ENTER_DELAY_MS + intro);
    return () => window.clearTimeout(id);
  }, []);

  // The card and the back-to-top button claim the same bottom-right corner at
  // every width — inset-x-4/bottom-4 on a phone, right-6/bottom-6 from sm —
  // and the card sits a layer above it. So for as long as the notice is up,
  // that button is a control nobody can see or tap. Flagging it on <html>
  // lets BackToTop stand down until the notice is gone; see the
  // in-data-notice: variant there.
  const showing = ready && !dismissed;
  useEffect(() => {
    if (!showing) return;
    const root = document.documentElement;
    root.dataset.notice = '';
    return () => {
      delete root.dataset.notice;
    };
  }, [showing]);

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
      {showing && (
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
          <GoldSignature className="w-full" />

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
                <div
                  id="welcome-notice-body"
                  // The card is anchored to the bottom of the viewport and
                  // grows upward, so an unbounded body walks off the top of a
                  // short screen and takes the heading and the gold rule with
                  // it — measured at 712px of card in a 640px viewport with
                  // the notice expanded. Capping the prose instead of the card
                  // keeps the title, the close button and Megértettem where
                  // they are and gives the overflow to the only part that can
                  // absorb it.
                  className="mt-2 max-h-[55dvh] overflow-y-auto overscroll-contain text-[length:var(--text-meta)] leading-relaxed text-muted"
                >
                  {notice.body.map((paragraph, index) => (
                    <p
                      key={paragraph}
                      // Collapsed on a phone, only the opening paragraph is on
                      // screen. Not line-clamp: that needs a -webkit-box whose
                      // children are the lines themselves, and over a stack of
                      // <p> it sets the height without clipping anything, so
                      // the rest of the notice spills out of the card. Hiding
                      // whole paragraphs cuts at a place the writer chose, and
                      // sr-only rather than hidden keeps every word in the
                      // accessibility tree the way the full text always was.
                      className={
                        index === 0
                          ? ''
                          : `mt-2 ${expanded ? '' : 'max-sm:sr-only'}`
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                {/* Phones get the opening paragraph so the card never swallows
                    the screen; the rest is one tap away and always in the DOM
                    for screen readers. */}
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  aria-expanded={expanded}
                  aria-controls="welcome-notice-body"
                  className="mt-1 inline-flex min-h-11 items-center text-[length:var(--text-meta)] font-semibold text-gold-ink transition-colors hover:text-ink sm:hidden"
                >
                  {expanded ? notice.collapseLabel : notice.expandLabel}
                </button>
              </div>

              <button
                type="button"
                onClick={dismiss}
                aria-label={notice.dismissLabel}
                // size-12, not the size-11 the rest of the site's bare icon
                // buttons use. At 44px this one sat exactly on the gate's
                // threshold, and while the card is still translated into place
                // Chrome quantises the transformed box to 43.999969px — under
                // it. The responsive audit caught that on a different page
                // every run, depending on which one it happened to sample
                // mid-tween. 48px is four pixels of headroom instead of zero,
                // and this is the control someone jabs at to get the card off
                // their screen, so it is the last one that should be tight.
                className="-mt-2 -mr-2 inline-flex size-12 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-gold/10 hover:text-ink"
              >
                <X aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.8} />
              </button>
            </div>

            <button
              type="button"
              onClick={dismiss}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 text-[length:var(--text-ui)] font-semibold tracking-wide text-cream-text transition-colors duration-(--dur-base) ease-smooth hover:bg-gold-ink"
            >
              {notice.confirmLabel}
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
