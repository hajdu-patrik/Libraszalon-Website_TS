'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarClock, X } from 'lucide-react';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { GoldSignature } from '@/components/ui/GoldSignature';
import { notice, noticeStorageKey } from '@/content/notice';
import { INTRO_ATTRIBUTE, INTRO_TOTAL_MS } from '@/lib/intro';

const ENTER_DELAY_MS = 1200;

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);

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

return false;
  }
}

function isDismissedOnServer() {
  return true;
}

export function WelcomeModal() {
  const dismissed = useSyncExternalStore(subscribe, isDismissed, isDismissedOnServer);
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {

const intro = document.documentElement.hasAttribute(INTRO_ATTRIBUTE)
      ? INTRO_TOTAL_MS
      : 0;
    const id = window.setTimeout(() => setReady(true), ENTER_DELAY_MS + intro);
    return () => window.clearTimeout(id);
  }, []);

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
          className="fixed inset-x-4 bottom-4 z-40 overflow-hidden rounded-2xl border border-line bg-surface shadow-(--shadow-lift) sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-104"
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

                  className="mt-2 max-h-[55dvh] overflow-y-auto overscroll-contain text-meta leading-relaxed text-muted"
                >
                  {notice.body.map((paragraph, index) => {
                    let paragraphClass = '';
                    if (index > 0) {
                      paragraphClass = expanded ? 'mt-2' : 'mt-2 max-sm:sr-only';
                    }
                    return (
                      <p key={paragraph} className={paragraphClass}>
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  aria-expanded={expanded}
                  aria-controls="welcome-notice-body"
                  className="mt-1 inline-flex min-h-11 items-center text-meta font-semibold text-gold-ink transition-colors hover:text-ink sm:hidden"
                >
                  {expanded ? notice.collapseLabel : notice.expandLabel}
                </button>
              </div>

              <button
                type="button"
                onClick={dismiss}
                aria-label={notice.dismissLabel}
                className="-mt-2 -mr-2 inline-flex size-12 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-gold/10 hover:text-ink"
              >
                <X aria-hidden="true" className="size-4.5" strokeWidth={1.8} />
              </button>
            </div>

            <button
              type="button"
              onClick={dismiss}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 text-ui font-semibold tracking-wide text-cream-text transition-colors duration-(--dur-base) ease-smooth hover:bg-gold-ink"
            >
              {notice.confirmLabel}
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
