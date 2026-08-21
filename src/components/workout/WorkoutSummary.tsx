import { PartyPopper, Trophy, Clock, Dumbbell as DumbbellIcon, ListChecks } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { formatVolume } from '../../utils/format';

interface WorkoutSummaryProps {
  routineName: string;
  durationMinutes: number;
  totalVolume: number;
  exerciseCount: number;
  newPRs: number;
}

export function WorkoutSummary({ routineName, durationMinutes, totalVolume, exerciseCount, newPRs }: WorkoutSummaryProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center px-6 py-10 animate-fade-in min-h-[80vh] justify-center">
      <div className="w-16 h-16 rounded-full bg-primary-bg flex items-center justify-center mb-4 animate-pop">
        <PartyPopper size={30} className="text-primary" />
      </div>
      <h1 className="font-display text-3xl text-text">¡Entrenamiento completado!</h1>
      <p className="text-text-muted mt-1">{routineName}</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-8">
        <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center gap-1.5">
          <Clock size={18} className="text-primary" />
          <span className="font-display text-2xl leading-none text-text">{durationMinutes} min</span>
          <span className="text-xs text-text-muted uppercase tracking-wide">Duración</span>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center gap-1.5">
          <DumbbellIcon size={18} className="text-primary" />
          <span className="font-display text-2xl leading-none text-text">{formatVolume(totalVolume)}</span>
          <span className="text-xs text-text-muted uppercase tracking-wide">Volumen total</span>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center gap-1.5">
          <ListChecks size={18} className="text-primary" />
          <span className="font-display text-2xl leading-none text-text">{exerciseCount}</span>
          <span className="text-xs text-text-muted uppercase tracking-wide">Ejercicios</span>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center gap-1.5">
          <Trophy size={18} className="text-primary" />
          <span className="font-display text-2xl leading-none text-text">{newPRs}</span>
          <span className="text-xs text-text-muted uppercase tracking-wide">PR nuevo{newPRs !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-sm mt-8">
        <Button fullWidth onClick={() => navigate('/progreso')}>
          Ver progreso
        </Button>
        <Button fullWidth variant="secondary" onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}
