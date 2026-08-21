import clsx from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'primary' | 'purple';
}

export function ProgressBar({ value, max = 100, className, color = 'primary' }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={clsx('h-2 w-full rounded-full bg-surface-3 overflow-hidden', className)}>
      <div
        className={clsx(
          'h-full rounded-full transition-all duration-500 ease-out',
          color === 'primary' ? 'bg-primary' : 'bg-accent-purple'
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
