import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Share2, Star, Dumbbell as DumbbellIcon, BarChart3 } from 'lucide-react';
import clsx from 'clsx';
import { getExerciseById } from '../data/exercises';
import { ExerciseVideo } from '../components/ui/ExerciseVideo';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useAppData, makeRoutineExercise } from '../context/AppDataContext';
import { useToast } from '../components/ui/Toast';

const TABS = [
  { key: 'instrucciones', label: 'Instrucciones' },
  { key: 'consejos', label: 'Consejos' },
  { key: 'errores', label: 'Errores' },
  { key: 'variaciones', label: 'Variaciones' },
];

export function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, routines, updateRoutine } = useAppData();
  const { showToast } = useToast();
  const [tab, setTab] = useState('instrucciones');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const exercise = id ? getExerciseById(id) : undefined;

  if (!exercise) {
    return (
      <div className="p-6 text-center text-text-muted">
        Ejercicio no encontrado.
        <div className="mt-3">
          <Button variant="secondary" onClick={() => navigate('/ejercicios')}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(exercise.id);

  const content: Record<string, string[]> = {
    instrucciones: exercise.instructions,
    consejos: exercise.tips,
    errores: exercise.commonMistakes,
    variaciones: exercise.variations,
  };

  function addToRoutine(routineId: string) {
    const routine = routines.find((r) => r.id === routineId);
    if (!routine || !exercise) return;
    const updated = {
      ...routine,
      exercises: [...routine.exercises, makeRoutineExercise(exercise.id)],
    };
    updateRoutine(updated);
    setAddModalOpen(false);
    showToast(`Agregado a ${routine.name}`);
  }

  return (
    <div className="animate-fade-in pb-4">
      <div className="relative">
        <ExerciseVideo exercise={exercise} className="w-full h-56 lg:h-72" />
        {exercise.videoId && (
          <span className="absolute bottom-3 left-4 text-[11px] font-medium text-white/80 bg-black/40 backdrop-blur px-2.5 py-1 rounded-full">
            Video de demostración
          </span>
        )}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center text-white"
          >
            <ArrowLeft size={19} />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white">
              <Share2 size={17} />
            </button>
            <button
              onClick={() => toggleFavorite(exercise.id)}
              className={clsx(
                'w-10 h-10 rounded-full backdrop-blur flex items-center justify-center',
                favorite ? 'bg-primary text-black' : 'bg-black/40 text-white'
              )}
            >
              <Star size={17} fill={favorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-0 mt-4">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="primary">{exercise.muscleGroup}</Badge>
          <Badge>{exercise.difficulty}</Badge>
        </div>
        <h1 className="text-2xl font-bold text-text">{exercise.name}</h1>
        <p className="text-sm text-text-muted mt-1">Primario: {exercise.primaryMuscle}</p>
        {exercise.secondaryMuscles.length > 0 && (
          <p className="text-sm text-text-muted">Secundarios: {exercise.secondaryMuscles.join(', ')}</p>
        )}

        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2.5">
            <DumbbellIcon size={16} className="text-primary" />
            <div className="text-xs">
              <div className="text-text-muted">Equipamiento</div>
              <div className="text-text font-medium">{exercise.equipment}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2.5">
            <BarChart3 size={16} className="text-primary" />
            <div className="text-xs">
              <div className="text-text-muted">Dificultad</div>
              <div className="text-text font-medium">{exercise.difficulty}</div>
            </div>
          </div>
        </div>

        <Tabs tabs={TABS} active={tab} onChange={setTab} className="mb-4 flex-wrap" />

        <ol className="flex flex-col gap-3 mb-6">
          {content[tab].map((item, i) => (
            <li key={i} className="flex gap-3 text-sm text-text">
              <span className="w-6 h-6 rounded-full bg-primary-bg text-primary font-bold text-xs flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="pt-0.5">{item}</span>
            </li>
          ))}
        </ol>

        <Button fullWidth onClick={() => setAddModalOpen(true)}>
          Agregar a rutina
        </Button>
      </div>

      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Agregar a rutina">
        <div className="flex flex-col gap-2">
          {routines.length === 0 && <p className="text-sm text-text-muted">No tienes rutinas todavía.</p>}
          {routines.map((r) => (
            <button
              key={r.id}
              onClick={() => addToRoutine(r.id)}
              className="text-left px-4 py-3 rounded-xl bg-surface-2 border border-border hover:border-primary transition-colors"
            >
              <div className="font-medium text-text">{r.name}</div>
              <div className="text-xs text-text-muted">{r.exercises.length} ejercicios</div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
