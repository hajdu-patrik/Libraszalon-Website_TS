import type { ComponentPropsWithRef } from 'react';

/** 48px round icon-only button; position, colour and transitions come from the caller. */
export function IconButton({
  className = '',
  type = 'button',
  ...props
}: ComponentPropsWithRef<'button'>) {
  return (
    <button
      type={type}
      className={`inline-flex size-12 items-center justify-center rounded-full ${className}`}
      {...props}
    />
  );
}
