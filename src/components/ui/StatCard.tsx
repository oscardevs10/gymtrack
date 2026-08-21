import { type ReactNode } from 'react';
import clsx from 'clsx';

interface StatCardProps {
  icon?: ReactNode;
  label: string;
  value: string | number;
  delta?: string;
  className?: string;
}

export function StatCard({ icon, label, value, delta, className }: StatCardProps) {
  return (
    <div className={clsx('bg-surface border border-border rounded-2xl p-4 flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        {icon && <div className="text-primary">{icon}</div>}
        {delta && <span className="text-xs text-primary font-medium">{delta}</span>}
      </div>
      <div>
        <div className="text-xl font-bold text-text tabular-nums">{value}</div>
        <div className="text-xs text-text-muted mt-0.5">{label}</div>
      </div>
    </div>
  );
}
