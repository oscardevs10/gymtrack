import { Check } from 'lucide-react';
import clsx from 'clsx';
import type { CompletedSet } from '../../types';

interface SetRowProps {
  set: CompletedSet;
  onChangeWeight: (v: number) => void;
  onChangeReps: (v: number) => void;
  onComplete: () => void;
  isNext: boolean;
}

export function SetRow({ set, onChangeWeight, onChangeReps, onComplete, isNext }: SetRowProps) {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 rounded-2xl px-4 py-3 border transition-colors',
        set.completed && 'bg-primary-bg border-primary/30',
        !set.completed && isNext && 'bg-surface-2 border-primary/50',
        !set.completed && !isNext && 'bg-surface-2 border-border opacity-60'
      )}
    >
      <div
        className={clsx(
          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
          set.completed ? 'bg-primary text-black' : 'bg-surface-3 text-text-muted'
        )}
      >
        {set.setNumber}
      </div>

      <div className="flex-1 flex items-center gap-3">
        <div className="flex-1">
          <label className="text-[10px] text-text-dim uppercase tracking-wide">Peso (kg)</label>
          <input
            type="number"
            value={set.weight}
            onChange={(e) => onChangeWeight(Number(e.target.value))}
            disabled={set.completed}
            className="w-full bg-transparent text-text font-semibold text-lg outline-none disabled:opacity-70"
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-text-dim uppercase tracking-wide">Reps</label>
          <input
            type="number"
            value={set.reps}
            onChange={(e) => onChangeReps(Number(e.target.value))}
            disabled={set.completed}
            className="w-full bg-transparent text-text font-semibold text-lg outline-none disabled:opacity-70"
          />
        </div>
      </div>

      <button
        onClick={onComplete}
        disabled={set.completed}
        className={clsx(
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90',
          set.completed ? 'bg-primary text-black' : 'bg-surface-3 text-text-muted hover:bg-primary hover:text-black'
        )}
      >
        <Check size={18} />
      </button>
    </div>
  );
}
