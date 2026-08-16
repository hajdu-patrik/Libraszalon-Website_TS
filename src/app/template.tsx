/**
 * Fades each page in on navigation. A template (rather than the layout)
 * remounts per route, which is what restarts the animation.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ animation: 'fade-in 0.25s var(--ease-out-expo) both' }}>
      {children}
    </div>
  );
}
