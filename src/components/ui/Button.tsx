import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-btn)] transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none',
        variant === 'primary' && 'bg-primary text-black hover:brightness-105',
        variant === 'secondary' && 'bg-surface-3 text-text hover:bg-border-light border border-border',
        variant === 'ghost' && 'bg-transparent text-text-muted hover:text-text hover:bg-surface-2',
        variant === 'danger' && 'bg-danger/15 text-danger hover:bg-danger/25',
        size === 'sm' && 'text-sm px-3 py-2',
        size === 'md' && 'text-[15px] px-4 py-3',
        size === 'lg' && 'text-base px-6 py-4',
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
