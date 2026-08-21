import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ClipboardList, Sparkles } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Tabs } from '../components/ui/Tabs';
import { RoutineCard } from '../components/routines/RoutineCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ExerciseImage } from '../components/ui/ExerciseImage';
import { ExercisePhoto } from '../components/ui/ExercisePhoto';
import { useAppData } from '../context/AppDataContext';
import { getExerciseById } from '../data/exercises';
import { todayISO, estimateRoutineDuration } from '../utils/workout';
import { generateRoutines } from '../utils/routineGenerator';
import { GOAL_LABELS } from '../types';

export function Routines() {
  const navigate = useNavigate();
  const { routines, templates, createRoutine, replaceAllRoutines, user } = useAppData();
  const [tab, setTab] = useState('mias');
  const today = todayISO();

  const daysPerWeek = user?.daysPerWeek ?? 3;
  const recommended = useMemo(
    () =>
      generateRoutines({
        weightKg: user?.weightKg ?? 70,
        goal: user?.goal ?? 'hipertrofia',
        level: user?.level ?? 'Intermedio',
        daysPerWeek,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.weightKg, user?.goal, user?.level, daysPerWeek, routines.length]
  );

  return (
    <div className="px-4 lg:px-0 animate-fade-in">
      <div className="flex items-center justify-between mb-1">
        <Header title="Mis rutinas" />
        <button
          onClick={() => navigate('/rutinas/nueva')}
          className="hidden lg:flex w-10 h-10 -mt-6 rounded-full bg-primary text-black items-center justify-center"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Tabs
          tabs={[
            { key: 'mias', label: 'Mis rutinas' },
            { key: 'plantillas', label: 'Plantillas' },
          ]}
          active={tab}
          onChange={setTab}
        />
        <button
          onClick={() => navigate('/rutinas/nueva')}
          className="lg:hidden w-9 h-9 rounded-full bg-primary text-black flex items-center justify-center"
        >
          <Plus size={18} />
        </button>
      </div>

      {tab === 'mias' ? (
        routines.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {routines.map((r) => (
              <RoutineCard key={r.id} routine={r} today={today} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <EmptyState
              icon={<ClipboardList size={22} />}
              title="Todavía no tienes rutinas"
              description="Crea la tuya desde cero o usa la recomendación de abajo, armada según tus datos."
              action={
                <Button variant="secondary" onClick={() => navigate('/rutinas/nueva')}>
                  Crear rutina personalizada
                </Button>
              }
            />

            <Card>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-primary" />
                <h3 className="font-semibold text-text text-sm">Recomendada para ti</h3>
              </div>
              <p className="text-xs text-text-muted mb-4">
                Basada en tus {daysPerWeek} {daysPerWeek === 1 ? 'día' : 'días'} de entrenamiento a la semana
                {user?.goal ? ` y tu objetivo de ${GOAL_LABELS[user.goal].toLowerCase()}` : ''}.
              </p>

              <div className="flex flex-col gap-2 mb-4">
                {recommended.map((r) => {
                  const featuredExercise = getExerciseById(r.exercises[0]?.exerciseId ?? '');
                  return (
                    <div key={r.id} className="flex items-center gap-3 bg-surface-2 border border-border rounded-xl p-2.5">
                      {featuredExercise ? (
                        <ExercisePhoto exercise={featuredExercise} className="w-11 h-11" iconSize={16} />
                      ) : (
                        <ExerciseImage muscleGroup={r.muscleGroups[0] ?? 'Pecho'} className="w-11 h-11" iconSize={16} />
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-text truncate">{r.name}</div>
                        <div className="text-xs text-text-muted">
                          {r.exercises.length} ejercicios · {estimateRoutineDuration(r)} min
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button fullWidth onClick={() => replaceAllRoutines(recommended)}>
                Usar esta rutina
              </Button>
            </Card>
          </div>
        )
      ) : (
        <div className="flex flex-col gap-2.5">
          {templates.map((t) => {
            const featuredExercise = getExerciseById(t.exercises[0]?.exerciseId ?? '');
            return (
              <div key={t.id} className="flex items-center gap-3 bg-surface border border-border rounded-2xl p-3">
                {featuredExercise ? (
                  <ExercisePhoto exercise={featuredExercise} className="w-14 h-14" iconSize={22} />
                ) : (
                  <ExerciseImage muscleGroup={t.muscleGroups[0] ?? 'Pecho'} className="w-14 h-14" iconSize={22} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text truncate">{t.name}</div>
                  <div className="text-xs text-text-muted">
                    {t.exercises.length} ejercicios · {estimateRoutineDuration(t)} min
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    const created = createRoutine(t.name, t);
                    navigate(`/rutinas/${created.id}/editar`);
                  }}
                >
                  Usar
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
