import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Pencil, Play, Trash2 } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { getExerciseById } from '../data/exercises';
import { ExercisePhoto } from '../components/ui/ExercisePhoto';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { relativeDate } from '../utils/format';
import { estimateRoutineDuration, todayISO } from '../utils/workout';

export function RoutineDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRoutine, deleteRoutine } = useAppData();
  const routine = id ? getRoutine(id) : undefined;
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  if (!routine) {
    return (
      <div className="p-6 text-center text-text-muted">
        Rutina no encontrada.
        <div className="mt-3">
          <Button variant="secondary" onClick={() => navigate('/rutinas')}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-0 animate-fade-in pb-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="text-text-muted hover:text-text p-1">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/rutinas/${routine.id}/editar`)}
            className="w-9 h-9 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-muted hover:text-text"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setConfirmDeleteOpen(true)}
            className="w-9 h-9 rounded-full bg-surface-2 border border-border flex items-center justify-center text-danger"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-text">{routine.name}</h1>
      <p className="text-sm text-text-muted mt-1">
        {routine.muscleGroups.join(' · ')} · {routine.exercises.length} ejercicios ·{' '}
        {estimateRoutineDuration(routine)} min
      </p>
      <p className="text-xs text-text-dim mt-1">Último: {relativeDate(routine.lastPerformed, todayISO())}</p>

      <Button
        fullWidth
        className="my-5"
        icon={<Play size={16} fill="black" />}
        onClick={() => navigate(`/entrenamiento/${routine.id}`)}
      >
        Comenzar entrenamiento
      </Button>

      <div className="flex flex-col gap-2.5">
        {routine.exercises.map((re, i) => {
          const exercise = getExerciseById(re.exerciseId);
          if (!exercise) return null;
          return (
            <div key={re.id} className="flex items-center gap-3 bg-surface border border-border rounded-2xl p-3">
              <span className="text-text-dim font-semibold text-sm w-5 text-center shrink-0">{i + 1}</span>
              <ExercisePhoto exercise={exercise} className="w-12 h-12" iconSize={18} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-text text-sm truncate">{exercise.name}</div>
                <div className="text-xs text-text-muted">
                  {re.sets} series · {re.reps} reps · {re.weight > 0 ? `${re.weight} kg` : 'Peso corporal'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} title="¿Eliminar rutina?">
        <p className="text-sm text-text-muted mb-5">
          Vas a eliminar <span className="text-text font-medium">{routine.name}</span> de forma permanente. Esta
          acción no se puede deshacer.
        </p>
        <div className="flex gap-2.5">
          <Button variant="secondary" fullWidth onClick={() => setConfirmDeleteOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => {
              deleteRoutine(routine.id);
              navigate('/rutinas');
            }}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
