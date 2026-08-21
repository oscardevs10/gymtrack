import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Input } from '../components/ui/Input';
import { ExerciseCard } from '../components/exercises/ExerciseCard';
import { EmptyState } from '../components/ui/EmptyState';
import { exercises, muscleGroups } from '../data/exercises';

export function Exercises() {
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState<string>('Todos');

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesGroup = group === 'Todos' || ex.muscleGroup === group;
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [search, group]);

  return (
    <div className="px-4 lg:px-0 animate-fade-in">
      <Header title="Ejercicios" subtitle={`${exercises.length} ejercicios disponibles`} />

      <div className="relative mb-3">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
        <Input
          placeholder="Buscar ejercicios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
        {muscleGroups.map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={
              'shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ' +
              (group === g
                ? 'bg-primary text-black border-primary'
                : 'bg-surface-2 text-text-muted border-border hover:text-text')
            }
          >
            {g}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {filtered.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search size={22} />}
          title="Sin resultados"
          description="No encontramos ejercicios que coincidan con tu búsqueda."
        />
      )}
    </div>
  );
}
