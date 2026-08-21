import { useNavigate } from 'react-router-dom';
import { MoreVertical, Copy, Trash2, Pencil } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Routine } from '../../types';
import { ExerciseImage } from '../ui/ExerciseImage';
import { ExercisePhoto } from '../ui/ExercisePhoto';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { relativeDate } from '../../utils/format';
import { estimateRoutineDuration } from '../../utils/workout';
import { useAppData } from '../../context/AppDataContext';
import { getExerciseById } from '../../data/exercises';

interface RoutineCardProps {
  routine: Routine;
  today: string;
}

export function RoutineCard({ routine, today }: RoutineCardProps) {
  const navigate = useNavigate();
  const { duplicateRoutine, deleteRoutine } = useAppData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, []);

  const duration = estimateRoutineDuration(routine);
  const featuredExercise = getExerciseById(routine.exercises[0]?.exerciseId ?? '');

  return (
    <div
      onClick={() => navigate(`/rutinas/${routine.id}`)}
      className="relative flex items-center gap-3 bg-surface border border-border rounded-2xl p-3 hover:border-border-light transition-colors cursor-pointer"
    >
      {featuredExercise ? (
        <ExercisePhoto exercise={featuredExercise} className="w-16 h-16" iconSize={26} />
      ) : (
        <ExerciseImage muscleGroup={routine.muscleGroups[0] ?? 'Pecho'} className="w-16 h-16" iconSize={26} />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-text truncate">{routine.name}</div>
        <div className="text-xs text-text-muted mt-0.5 truncate">
          {routine.muscleGroups.join(' · ') || 'Sin grupo muscular'}
        </div>
        <div className="text-xs text-text-dim mt-1">
          {routine.exercises.length} ejercicios · {duration} min
        </div>
        <div className="text-[11px] text-text-dim mt-0.5">
          Último: {relativeDate(routine.lastPerformed, today)}
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          className="p-2 text-text-dim hover:text-text rounded-lg hover:bg-surface-3"
        >
          <MoreVertical size={18} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-10 z-20 bg-surface-2 border border-border rounded-xl overflow-hidden shadow-lg w-40 animate-fade-in">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/rutinas/${routine.id}/editar`);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-text hover:bg-surface-3"
            >
              <Pencil size={15} /> Editar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateRoutine(routine.id);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-text hover:bg-surface-3"
            >
              <Copy size={15} /> Duplicar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDeleteOpen(true);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-danger hover:bg-surface-3"
            >
              <Trash2 size={15} /> Eliminar
            </button>
          </div>
        )}
      </div>

      <Modal open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} title="¿Eliminar rutina?">
        <div onClick={(e) => e.stopPropagation()}>
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
                setConfirmDeleteOpen(false);
              }}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
