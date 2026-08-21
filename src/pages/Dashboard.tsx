import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Play, Flame, Clock, Dumbbell as DumbbellIcon, Repeat, Moon } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { WeeklyChart } from '../components/progress/WeeklyChart';
import { ExercisePhoto } from '../components/ui/ExercisePhoto';
import { ExerciseImage } from '../components/ui/ExerciseImage';
import { EmptyState } from '../components/ui/EmptyState';
import { useAppData } from '../context/AppDataContext';
import { getExerciseById } from '../data/exercises';
import { weeklyVolumeSeries } from '../utils/analytics';
import { estimateRoutineDuration, todayISO } from '../utils/workout';
import { formatVolume, formatDuration } from '../utils/format';
import { getTodayWeekdayName } from '../utils/weekdays';
import { maybeShowDailyReminder } from '../utils/notifications';

export function Dashboard() {
  const navigate = useNavigate();
  const { routines, history, favorites, user } = useAppData();

  const todayWeekday = getTodayWeekdayName();
  const todayRoutine = routines.find((r) => r.name.startsWith(`${todayWeekday} ·`));
  const isRestDay = routines.length > 0 && !todayRoutine;
  const lastWorkout = history[0];

  useEffect(() => {
    maybeShowDailyReminder({
      enabled: user?.notificationsEnabled ?? false,
      todayRoutineName: todayRoutine?.name ?? null,
      alreadyTrainedToday: history.some((h) => h.date === todayISO()),
      todayISO: todayISO(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.notificationsEnabled, todayRoutine?.name]);

  const weekHistory = history.slice(0, 7);
  const weekVolume = weekHistory.reduce((s, w) => s + w.totalVolume, 0);
  const weekTime = weekHistory.reduce((s, w) => s + w.durationMinutes, 0);
  const streak = history.length > 0 ? Math.min(history.length, 12) : 0;

  const favoriteExercises = favorites.map((id) => getExerciseById(id)).filter(Boolean).slice(0, 3);
  const weeklyChartData = weeklyVolumeSeries(history);
  const todayFeaturedExercise = todayRoutine ? getExerciseById(todayRoutine.exercises[0]?.exerciseId ?? '') : undefined;

  return (
    <div className="px-4 lg:px-0 animate-fade-in">
      <Header showGreeting subtitle="¿Listo para entrenar hoy?" />

      {todayRoutine ? (
        <Card className="mb-4 relative overflow-hidden bg-gradient-to-br from-surface-2 to-surface border-primary/20">
          <div className="stripe-accent" />
          <div className="relative z-10">
            <span className="text-xs text-primary font-bold uppercase tracking-[0.15em]">Entrenamiento de hoy</span>
            <h2 className="font-display text-4xl leading-none text-text mt-2">{todayRoutine.name}</h2>
            <p className="text-sm text-text-muted mt-2">
              {todayRoutine.exercises.length} ejercicios · {estimateRoutineDuration(todayRoutine)} min aprox.
            </p>
            <Button
              className="mt-4"
              icon={<Play size={16} fill="black" />}
              onClick={() => navigate(`/entrenamiento/${todayRoutine.id}`)}
            >
              Comenzar entrenamiento
            </Button>
          </div>
          {todayFeaturedExercise ? (
            <ExercisePhoto
              exercise={todayFeaturedExercise}
              className="absolute -right-4 -bottom-4 w-32 h-32 opacity-70"
            />
          ) : (
            <ExerciseImage
              muscleGroup={todayRoutine.muscleGroups[0] ?? 'Pecho'}
              className="absolute -right-4 -bottom-4 w-32 h-32 opacity-60"
              iconSize={48}
            />
          )}
        </Card>
      ) : isRestDay ? (
        <Card className="mb-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-surface-3 flex items-center justify-center shrink-0">
            <Moon size={22} className="text-accent-purple" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text">Hoy es tu día de descanso</h3>
            <p className="text-xs text-text-muted mt-0.5">
              No tienes ningún entrenamiento programado para {todayWeekday.toLowerCase()}.
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => navigate('/rutinas')}>
            Ver rutinas
          </Button>
        </Card>
      ) : (
        <EmptyState
          icon={<DumbbellIcon size={26} />}
          title="Todavía no tienes rutinas"
          description="Crea tu primera rutina para empezar a entrenar hoy mismo."
          action={<Button onClick={() => navigate('/rutinas/nueva')}>Crear mi primera rutina</Button>}
        />
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard icon={<Repeat size={16} />} label="Entrenamientos" value={weekHistory.length} />
        <StatCard icon={<Clock size={16} />} label="Tiempo esta semana" value={formatDuration(weekTime)} />
        <StatCard icon={<DumbbellIcon size={16} />} label="Volumen esta semana" value={formatVolume(weekVolume)} />
        <StatCard icon={<Flame size={16} />} label="Racha (días)" value={streak} />
      </div>

      <Card className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-text text-sm">Progreso semanal</h3>
          <button onClick={() => navigate('/progreso')} className="text-xs text-primary font-medium">
            Ver más
          </button>
        </div>
        <WeeklyChart data={weeklyChartData} />
      </Card>

      {lastWorkout && (
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text text-sm">Último entrenamiento</h3>
          </div>
          <button
            onClick={() => navigate(`/historial/${lastWorkout.id}`)}
            className="w-full flex items-center justify-between"
          >
            <div className="text-left">
              <div className="font-semibold text-text">{lastWorkout.routineName}</div>
              <div className="text-xs text-text-muted mt-0.5">
                {lastWorkout.durationMinutes} min · {formatVolume(lastWorkout.totalVolume)}
              </div>
            </div>
            {lastWorkout.newPRs > 0 && (
              <div className="text-right">
                <div className="font-display text-2xl leading-none text-primary">{lastWorkout.newPRs}</div>
                <div className="text-[10px] text-text-muted uppercase tracking-wide mt-1">PR</div>
              </div>
            )}
          </button>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-text text-sm">Ejercicios favoritos</h3>
          <button onClick={() => navigate('/favoritos')} className="text-xs text-primary font-medium">
            Ver todos
          </button>
        </div>
        {favoriteExercises.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {favoriteExercises.map(
              (ex) =>
                ex && (
                  <button
                    key={ex.id}
                    onClick={() => navigate(`/ejercicios/${ex.id}`)}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <ExercisePhoto exercise={ex} className="w-full aspect-square" />
                    <span className="text-xs font-medium text-text truncate w-full text-center">{ex.name}</span>
                    <span className="text-[10px] text-text-dim">{ex.muscleGroup}</span>
                  </button>
                )
            )}
          </div>
        ) : (
          <p className="text-sm text-text-muted">Guarda ejercicios para acceder rápidamente a ellos.</p>
        )}
      </Card>
    </div>
  );
}
