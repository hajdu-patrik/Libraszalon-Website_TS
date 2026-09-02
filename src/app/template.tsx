'use client';

import { useEffect } from 'react';

let navigated = false;

export default function Template({ children }: { children: React.ReactNode }) {

const animate = navigated;

  useEffect(() => {
    navigated = true;
  }, []);

  return (
    <div
      style={
        animate
          ? { animation: 'enter-rise var(--dur-base) var(--ease-smooth) both' }
          : undefined
      }
    >
      {children}
    </div>
  );
}
