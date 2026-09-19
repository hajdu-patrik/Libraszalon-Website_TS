import { forwardRef, type ButtonHTMLAttributes } from 'react';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** Shared shape for the site's circular icon-only buttons (back-to-top, the mobile-menu
 *  close button, the notice-dialog close button): extracted verbatim from the class string
 *  every one of them already used (`inline-flex size-12 items-center justify-center
 *  rounded-full`). Positioning, colour and transition stay with the call site via
 *  `className`. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className = '', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex size-12 items-center justify-center rounded-full ${className}`}
      {...props}
    />
  );
});
