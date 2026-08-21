import { Trophy, Clock, Dumbbell as DumbbellIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { WorkoutSession } from '../../types';
import { formatVolume, formatDate } from '../../utils/format';

export function WorkoutCard({ session }: { session: WorkoutSession }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/historial/${session.id}`)}
      className="w-full text-left bg-surface border border-border rounded-2xl p-4 hover:border-border-light transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-text">{session.routineName}</span>
        <span className="text-xs text-text-muted">{formatDate(session.date)}</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <Clock size={13} /> {session.durationMinutes} min
        </span>
        <span className="flex items-center gap-1">
          <DumbbellIcon size={13} /> {formatVolume(session.totalVolume)}
        </span>
        <span>{session.exercises.length} ejercicios</span>
        {session.newPRs > 0 && (
          <span className="flex items-center gap-1 text-primary font-medium">
            <Trophy size={13} /> {session.newPRs} PR
          </span>
        )}
      </div>
    </button>
  );
}
