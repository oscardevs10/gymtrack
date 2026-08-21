import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Dumbbell as DumbbellIcon, Trophy } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { getExerciseById } from '../data/exercises';
import { ExercisePhoto } from '../components/ui/ExercisePhoto';
import { Button } from '../components/ui/Button';
import { formatVolume, formatDate } from '../utils/format';

export function HistoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { history } = useAppData();
  const session = history.find((h) => h.id === id);

  if (!session) {
    return (
      <div className="p-6 text-center text-text-muted">
        Entrenamiento no encontrado.
        <div className="mt-3">
          <Button variant="secondary" onClick={() => navigate('/historial')}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-0 animate-fade-in pb-6">
      <button onClick={() => navigate(-1)} className="text-text-muted hover:text-text p-1 mb-3">
        <ArrowLeft size={20} />
      </button>

      <h1 className="text-2xl font-bold text-text">{session.routineName}</h1>
      <p className="text-sm text-text-muted mt-1">{formatDate(session.date)}</p>

      <div className="grid grid-cols-3 gap-3 my-5">
        <div className="bg-surface border border-border rounded-2xl p-3 flex flex-col items-center gap-1">
          <Clock size={16} className="text-primary" />
          <span className="font-bold text-text">{session.durationMinutes}m</span>
          <span className="text-[10px] text-text-muted">Duración</span>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-3 flex flex-col items-center gap-1">
          <DumbbellIcon size={16} className="text-primary" />
          <span className="font-bold text-text text-sm">{formatVolume(session.totalVolume)}</span>
          <span className="text-[10px] text-text-muted">Volumen</span>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-3 flex flex-col items-center gap-1">
          <Trophy size={16} className="text-primary" />
          <span className="font-bold text-text">{session.newPRs}</span>
          <span className="text-[10px] text-text-muted">PRs</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {session.exercises.map((log) => {
          const exercise = getExerciseById(log.exerciseId);
          if (!exercise) return null;
          const completedSets = log.sets.filter((s) => s.completed);
          const volume = completedSets.reduce((s, set) => s + set.weight * set.reps, 0);
          return (
            <div key={log.exerciseId} className="bg-surface border border-border rounded-2xl p-3">
              <div className="flex items-center gap-3 mb-2">
                <ExercisePhoto exercise={exercise} className="w-11 h-11" iconSize={16} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-text text-sm truncate">{exercise.name}</div>
                  <div className="text-xs text-text-muted">{formatVolume(volume)}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {completedSets.map((s) => (
                  <span key={s.setNumber} className="text-xs bg-surface-2 text-text-muted px-2 py-1 rounded-lg">
                    {s.weight}kg × {s.reps}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
