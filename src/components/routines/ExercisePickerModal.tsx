import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { ExercisePhoto } from '../ui/ExercisePhoto';
import { exercises, muscleGroups } from '../../data/exercises';

interface ExercisePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (exerciseId: string) => void;
}

export function ExercisePickerModal({ open, onClose, onSelect }: ExercisePickerModalProps) {
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('Todos');

  const filtered = useMemo(
    () =>
      exercises.filter((ex) => {
        const matchGroup = group === 'Todos' || ex.muscleGroup === group;
        const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase());
        return matchGroup && matchSearch;
      }),
    [search, group]
  );

  return (
    <Modal open={open} onClose={onClose} title="Agregar ejercicio">
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
        <Input
          placeholder="Buscar ejercicios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 pb-1">
        {muscleGroups.map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={
              'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ' +
              (group === g
                ? 'bg-primary text-black border-primary'
                : 'bg-surface-2 text-text-muted border-border')
            }
          >
            {g}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {filtered.map((ex) => (
          <button
            key={ex.id}
            onClick={() => {
              onSelect(ex.id);
              setSearch('');
            }}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-2 transition-colors text-left"
          >
            <ExercisePhoto exercise={ex} className="w-11 h-11" iconSize={16} />
            <div className="min-w-0">
              <div className="text-sm font-medium text-text truncate">{ex.name}</div>
              <div className="text-xs text-text-muted">{ex.muscleGroup}</div>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
