import { type ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'purple' | 'warning' | 'danger';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
        variant === 'default' && 'bg-surface-3 text-text-muted',
        variant === 'primary' && 'bg-primary-bg text-primary',
        variant === 'purple' && 'bg-accent-purple-bg text-accent-purple',
        variant === 'warning' && 'bg-warning/15 text-warning',
        variant === 'danger' && 'bg-danger/15 text-danger',
        className
      )}
    >
      {children}
    </span>
  );
}
