import clsx from 'clsx';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ initials, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={clsx(
        'rounded-full bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center font-bold text-black shrink-0',
        size === 'sm' && 'w-8 h-8 text-xs',
        size === 'md' && 'w-11 h-11 text-sm',
        size === 'lg' && 'w-20 h-20 text-2xl',
        className
      )}
    >
      {initials}
    </div>
  );
}
