import { type InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        'w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-dim outline-none focus:border-primary transition-colors text-[15px]',
        className
      )}
      {...rest}
    />
  );
}

export function NumberStepper({
  value,
  onChange,
  step = 1,
  min = 0,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-surface-2 border border-border rounded-xl overflow-hidden">
      <button
        className="px-3 py-2 text-text-muted hover:text-text hover:bg-surface-3 active:scale-95 transition-all"
        onClick={() => onChange(Math.max(min, value - step))}
        type="button"
      >
        −
      </button>
      <span className="min-w-[3.5rem] text-center font-semibold text-text tabular-nums">
        {value}
        {suffix && <span className="text-text-muted font-normal text-xs ml-0.5">{suffix}</span>}
      </span>
      <button
        className="px-3 py-2 text-text-muted hover:text-text hover:bg-surface-3 active:scale-95 transition-all"
        onClick={() => onChange(value + step)}
        type="button"
      >
        +
      </button>
    </div>
  );
}
