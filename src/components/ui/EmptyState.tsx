import { type ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-text-muted mb-4">
        {icon}
      </div>
      <h3 className="text-text font-semibold text-lg mb-1.5">{title}</h3>
      <p className="text-text-muted text-sm max-w-xs mb-5">{description}</p>
      {action}
    </div>
  );
}
