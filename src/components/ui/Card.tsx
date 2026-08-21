import { type HTMLAttributes } from 'react';
import clsx from 'clsx';

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'bg-surface border border-border rounded-[var(--radius-card)] p-4',
        className
      )}
      {...rest}
    />
  );
}
