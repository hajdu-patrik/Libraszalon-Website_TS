'use client';

import { useEffect, useState, type RefObject } from 'react';

/** Whether an element's content is taller than its box: a line-clamped paragraph or a
 *  height-capped scroll area. The observer's first callback supplies the initial reading;
 *  `frozen` keeps the last one, so a "show less" control does not disappear in the very
 *  render that lifts the clamp. */
export function useIsOverflowing(ref: RefObject<HTMLElement | null>, frozen = false): boolean {
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || frozen) return;

    const measure = () => setOverflowing(element.scrollHeight > element.clientHeight + 1);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    // A web font arriving late re-wraps the text without resizing the element's box.
    document.fonts.addEventListener('loadingdone', measure);

    return () => {
      observer.disconnect();
      document.fonts.removeEventListener('loadingdone', measure);
    };
  }, [ref, frozen]);

  return overflowing;
}
