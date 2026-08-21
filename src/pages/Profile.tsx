import { useNavigate } from 'react-router-dom';
import { ChevronRight, Settings, Trophy, Clock, Dumbbell as DumbbellIcon, Flame } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAppData } from '../context/AppDataContext';
import { formatVolume } from '../utils/format';
import { GOAL_LABELS } from '../types';

export function Profile() {
  const navigate = useNavigate();
  const { user, history, personalRecords } = useAppData();

  const totalVolume = history.reduce((s, w) => s + w.totalVolume, 0);
  const totalWorkouts = history.length;
  const totalMinutes = history.reduce((s, w) => s + w.durationMinutes, 0);

  if (!user) return null;

  return (
    <div className="px-4 lg:px-0 animate-fade-in pb-4">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-text">Perfil</h1>
        <button
          onClick={() => navigate('/ajustes')}
          className="p-2 rounded-xl bg-surface-2 border border-border text-text-muted hover:text-text"
        >
          <Settings size={18} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Avatar initials={user.avatar} size="lg" />
        <div>
          <h2 className="text-xl font-bold text-text">{user.name}</h2>
          <Badge variant="primary" className="mt-1">
            {user.level ?? 'Sin nivel'}
          </Badge>
        </div>
      </div>

      <Card className="mb-4">
        <span className="text-xs text-text-muted uppercase tracking-wide">Objetivo</span>
        <p className="text-text font-semibold mt-0.5">{user.goal ? GOAL_LABELS[user.goal] : 'Sin definir'}</p>
      </Card>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-1.5">
          <DumbbellIcon size={16} className="text-primary" />
          <span className="text-lg font-bold text-text">{totalWorkouts}</span>
          <span className="text-xs text-text-muted">Entrenamientos</span>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-1.5">
          <Flame size={16} className="text-primary" />
          <span className="text-lg font-bold text-text">{formatVolume(totalVolume)}</span>
          <span className="text-xs text-text-muted">Volumen total</span>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-1.5">
          <Trophy size={16} className="text-primary" />
          <span className="text-lg font-bold text-text">{personalRecords.length}</span>
          <span className="text-xs text-text-muted">Récords personales</span>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-1.5">
          <Clock size={16} className="text-primary" />
          <span className="text-lg font-bold text-text">{Math.round(totalMinutes / 60)}h</span>
          <span className="text-xs text-text-muted">Tiempo entrenado</span>
        </div>
      </div>

      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-text text-sm">Récords personales</h3>
        </div>
        <div className="flex flex-col gap-3">
          {personalRecords.map((pr) => (
            <div key={pr.exerciseId} className="flex items-center justify-between text-sm">
              <span className="text-text font-medium">{pr.exerciseName}</span>
              <span className="text-text-muted">{pr.weight} kg</span>
            </div>
          ))}
        </div>
      </Card>

      <button
        onClick={() => navigate('/ajustes')}
        className="w-full flex items-center justify-between bg-surface border border-border rounded-2xl p-4 text-text font-medium"
      >
        Configuración
        <ChevronRight size={18} className="text-text-muted" />
      </button>
    </div>
  );
}
