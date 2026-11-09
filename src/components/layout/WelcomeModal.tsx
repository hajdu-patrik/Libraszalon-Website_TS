'use client';

import { CalendarClock, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { GoldSignature } from '@/components/ui/GoldSignature';
import { IconButton } from '@/components/ui/IconButton';
import { notice, noticeStorageKey } from '@/content/notice';
import { useIsOverflowing } from '@/lib/hooks/useIsOverflowing';
import { INTRO_ATTRIBUTE, INTRO_TOTAL_MS } from '@/lib/intro';

const ENTER_DELAY_MS = 1200;

const DIALOG_CLASS = [
  'fixed inset-x-4 top-auto bottom-4 m-0 h-auto max-h-[calc(100dvh-2rem)] w-auto max-w-none overflow-hidden rounded-2xl border border-line bg-surface text-ink shadow-lift sm:inset-0 sm:m-auto sm:h-fit sm:w-[36rem]',
  // A `display` class on a <dialog> beats the browser's `display: none` for a closed one,
  // so the flex column only applies while it is open.
  'open:flex open:flex-col',
  'transition-[opacity,translate] duration-(--dur-base) ease-smooth starting:open:translate-y-6 starting:open:opacity-0',
  'backdrop:bg-ink-deep/40 backdrop:backdrop-blur-[2px] backdrop:transition-colors backdrop:duration-(--dur-base) starting:open:backdrop:bg-ink-deep/0 motion-reduce:backdrop:transition-none',
].join(' ');

const listeners = new Set<() => void>();

/** Backs the stored flag: with storage blocked the notice still has to be closable. */
let dismissedThisVisit = false;

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function isDismissed() {
  if (dismissedThisVisit) return true;
  try {
    return window.sessionStorage.getItem(noticeStorageKey) === 'dismissed';
  } catch {
    return false;
  }
}

function isDismissedOnServer() {
  return true;
}

function dismiss() {
  dismissedThisVisit = true;
  try {
    window.sessionStorage.setItem(noticeStorageKey, 'dismissed');
  } catch {
    // Blocked storage: the flag above still closes the notice for this visit.
  }
  listeners.forEach((listener) => listener());
}

export function WelcomeModal() {
  const dismissed = useSyncExternalStore(subscribe, isDismissed, isDismissedOnServer);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const intro = document.documentElement.hasAttribute(INTRO_ATTRIBUTE) ? INTRO_TOTAL_MS : 0;
    const id = window.setTimeout(() => setReady(true), ENTER_DELAY_MS + intro);
    return () => window.clearTimeout(id);
  }, []);

  return ready && !dismissed ? <NoticeDialog /> : null;
}

/** Mounted only once the notice is due, and unmounted by dismissing it. */
function NoticeDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const [opener] = useState(() => document.activeElement);
  const titleId = useId();
  const bodyId = useId();
  const scrollable = useIsOverflowing(bodyRef);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();
    confirmRef.current?.focus();

    return () => {
      if (opener instanceof HTMLElement && opener.isConnected && opener !== document.body) {
        opener.focus();
      }
    };
  }, [opener]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      onCancel={dismiss}
      className={DIALOG_CLASS}
    >
      <GoldSignature className="w-full shrink-0" />

      <div className="relative flex min-h-0 flex-1 flex-col p-5 sm:p-8">
        <div className="flex min-h-0 flex-1 gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="mt-0.5 hidden size-10 shrink-0 items-center justify-center self-start rounded-full bg-gold/15 text-gold-ink min-[22.5rem]:inline-flex"
          >
            <CalendarClock className="size-5" strokeWidth={1.8} />
          </span>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <h2 id={titleId} className="shrink-0 pr-10 text-h4 leading-tight font-medium text-ink sm:text-2xl">
              {notice.title}
            </h2>
            <div
              id={bodyId}
              ref={bodyRef}
              tabIndex={scrollable ? 0 : undefined}
              className="mt-2 min-h-0 overflow-y-auto overscroll-contain text-meta leading-relaxed text-pretty text-muted hyphens-none sm:mt-3 sm:text-body"
            >
              {notice.body.map((paragraph, index) => (
                <p key={paragraph} className={index > 0 ? 'mt-2 sm:mt-3' : undefined}>
                  {paragraph}
                </p>
              ))}
              <p className="mt-3 font-medium text-ink">{notice.signature}</p>
            </div>
          </div>

          <IconButton
            onClick={dismiss}
            aria-label={notice.dismissLabel}
            className="absolute top-3 right-3 text-muted transition-colors hover:bg-gold/10 hover:text-ink sm:top-6 sm:right-6"
          >
            <X aria-hidden="true" className="size-4.5" strokeWidth={1.8} />
          </IconButton>
        </div>

        <button
          ref={confirmRef}
          type="button"
          onClick={dismiss}
          className="mt-4 inline-flex min-h-12 w-full shrink-0 items-center sm:mt-6 justify-center rounded-full bg-ink px-6 text-ui font-semibold tracking-wide text-cream-text transition-colors duration-(--dur-base) ease-smooth hover:bg-gold-ink hover:text-surface"
        >
          {notice.confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
