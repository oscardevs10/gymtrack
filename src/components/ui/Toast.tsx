import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, Trophy, Info } from 'lucide-react';
import clsx from 'clsx';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'pr' | 'info';
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastItem['type']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastItem['type'] = 'success') => {
    counter += 1;
    const id = counter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={clsx(
              'animate-pop pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-2xl border shadow-lg text-sm font-medium',
              t.type === 'pr' && 'bg-primary text-black border-primary',
              t.type === 'success' && 'bg-surface-2 text-text border-border',
              t.type === 'info' && 'bg-surface-2 text-text border-border'
            )}
          >
            {t.type === 'pr' && <Trophy size={18} />}
            {t.type === 'success' && <CheckCircle2 size={18} />}
            {t.type === 'info' && <Info size={18} />}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
