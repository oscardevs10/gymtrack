import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import type { Exercise } from '../../types';
import { ExercisePhoto } from '../ui/ExercisePhoto';
import { useAppData } from '../../context/AppDataContext';

interface ExerciseCardProps {
  exercise: Exercise;
  compact?: boolean;
}

export function ExerciseCard({ exercise, compact }: ExerciseCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useAppData();
  const favorite = isFavorite(exercise.id);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/ejercicios/${exercise.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/ejercicios/${exercise.id}`)}
      className="w-full flex items-center gap-3 bg-surface border border-border rounded-2xl p-3 text-left hover:border-border-light transition-colors active:scale-[0.99] cursor-pointer"
    >
      <ExercisePhoto exercise={exercise} className="w-14 h-14" iconSize={22} />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-text text-[15px] truncate">{exercise.name}</div>
        <div className="text-xs text-text-muted mt-0.5">{exercise.muscleGroup}</div>
        {!compact && (
          <div className="text-[11px] text-text-dim mt-1 flex items-center gap-1">
            <span>{exercise.equipment}</span>
            <span>·</span>
            <span>{exercise.difficulty}</span>
          </div>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(exercise.id);
        }}
        className={clsx(
          'p-2 rounded-full transition-colors shrink-0',
          favorite ? 'text-primary' : 'text-text-dim hover:text-text-muted'
        )}
      >
        <Star size={18} fill={favorite ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}
