import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useAppData, makeRoutineExercise } from '../context/AppDataContext';
import { getExerciseById } from '../data/exercises';
import { SortableExerciseRow } from '../components/routines/SortableExerciseRow';
import { ExercisePickerModal } from '../components/routines/ExercisePickerModal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { estimateRoutineDuration } from '../utils/workout';
import { useToast } from '../components/ui/Toast';
import type { Routine, RoutineExercise } from '../types';

export function RoutineEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRoutine, updateRoutine, createRoutine } = useAppData();
  const { showToast } = useToast();

  const isNew = id === undefined;
  const existing = id ? getRoutine(id) : undefined;

  const [name, setName] = useState(existing?.name ?? 'Nueva rutina');
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>(existing?.exercises ?? []);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setRoutineExercises(existing.exercises);
    }
  }, [existing]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setRoutineExercises((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  function updateExercise(reId: string, patch: Partial<RoutineExercise>) {
    setRoutineExercises((prev) => prev.map((re) => (re.id === reId ? { ...re, ...patch } : re)));
  }

  function removeExercise(reId: string) {
    setRoutineExercises((prev) => prev.filter((re) => re.id !== reId));
  }

  function addExercise(exerciseId: string) {
    setRoutineExercises((prev) => [...prev, makeRoutineExercise(exerciseId)]);
    setPickerOpen(false);
  }

  function inferMuscleGroups(): Routine['muscleGroups'] {
    const groups = new Set<Routine['muscleGroups'][number]>();
    routineExercises.forEach((re) => {
      const ex = getExerciseById(re.exerciseId);
      if (ex) groups.add(ex.muscleGroup);
    });
    return Array.from(groups);
  }

  function handleSave() {
    if (isNew) {
      const created = createRoutine(name || 'Nueva rutina');
      updateRoutine({ ...created, name, exercises: routineExercises, muscleGroups: inferMuscleGroups() });
      showToast('Rutina creada');
      navigate(`/rutinas/${created.id}`);
    } else if (existing) {
      updateRoutine({ ...existing, name, exercises: routineExercises, muscleGroups: inferMuscleGroups() });
      showToast('Rutina guardada');
      navigate(`/rutinas/${existing.id}`);
    }
  }

  const totalMin = estimateRoutineDuration({
    id: 'tmp',
    name,
    muscleGroups: [],
    exercises: routineExercises,
  });

  return (
    <div className="px-4 lg:px-0 animate-fade-in pb-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="text-text-muted hover:text-text p-1">
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-medium text-text-muted">Editar rutina</span>
        <Button size="sm" onClick={handleSave}>
          Guardar
        </Button>
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-2xl font-bold text-text bg-transparent outline-none w-full mb-1"
        placeholder="Nombre de la rutina"
      />
      <p className="text-sm text-text-muted mb-5">
        {routineExercises.length} ejercicios · {totalMin} min aprox.
      </p>

      {routineExercises.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={routineExercises.map((re) => re.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3 mb-4">
              {routineExercises.map((re, i) => (
                <SortableExerciseRow
                  key={re.id}
                  index={i}
                  routineExercise={re}
                  onChange={(patch) => updateExercise(re.id, patch)}
                  onRemove={() => removeExercise(re.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <EmptyState
          icon={<Plus size={22} />}
          title="Sin ejercicios"
          description="Agrega ejercicios para construir tu rutina."
        />
      )}

      <Button
        fullWidth
        variant="secondary"
        icon={<Plus size={17} />}
        onClick={() => setPickerOpen(true)}
      >
        Agregar ejercicio
      </Button>

      <ExercisePickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={addExercise} />
    </div>
  );
}
