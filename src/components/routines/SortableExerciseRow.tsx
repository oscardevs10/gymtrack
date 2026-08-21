import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import type { RoutineExercise } from '../../types';
import { getExerciseById } from '../../data/exercises';
import { ExercisePhoto } from '../ui/ExercisePhoto';
import { NumberStepper } from '../ui/Input';

interface SortableExerciseRowProps {
  index: number;
  routineExercise: RoutineExercise;
  onChange: (patch: Partial<RoutineExercise>) => void;
  onRemove: () => void;
}

export function SortableExerciseRow({ index, routineExercise, onChange, onRemove }: SortableExerciseRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: routineExercise.id,
  });

  const exercise = getExerciseById(routineExercise.exerciseId);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!exercise) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-surface border border-border rounded-2xl p-3 flex flex-col gap-3"
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="text-text-dim hover:text-text cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical size={18} />
        </button>
        <span className="text-text-dim font-semibold text-sm w-4 shrink-0">{index + 1}</span>
        <ExercisePhoto exercise={exercise} className="w-11 h-11" iconSize={16} />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-text text-sm truncate">{exercise.name}</div>
          <div className="text-xs text-text-muted">
            {routineExercise.sets} series · {routineExercise.reps} reps · {routineExercise.weight} kg
          </div>
        </div>
        <button onClick={onRemove} className="text-danger p-1.5 hover:bg-danger/10 rounded-lg shrink-0">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] text-text-dim uppercase block mb-1">Series</label>
          <NumberStepper value={routineExercise.sets} onChange={(v) => onChange({ sets: v })} min={1} />
        </div>
        <div>
          <label className="text-[10px] text-text-dim uppercase block mb-1">Peso</label>
          <NumberStepper
            value={routineExercise.weight}
            onChange={(v) => onChange({ weight: v })}
            step={2.5}
            suffix="kg"
          />
        </div>
        <div>
          <label className="text-[10px] text-text-dim uppercase block mb-1">Descanso</label>
          <NumberStepper
            value={routineExercise.restSeconds}
            onChange={(v) => onChange({ restSeconds: v })}
            step={15}
            suffix="s"
          />
        </div>
      </div>
      <div>
        <label className="text-[10px] text-text-dim uppercase block mb-1">Repeticiones</label>
        <input
          value={routineExercise.reps}
          onChange={(e) => onChange({ reps: e.target.value })}
          className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}
