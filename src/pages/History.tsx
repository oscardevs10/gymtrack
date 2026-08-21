import { useMemo, useState } from 'react';
import { History as HistoryIcon, Filter } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { WorkoutCard } from '../components/workout/WorkoutCard';
import { EmptyState } from '../components/ui/EmptyState';
import { useAppData } from '../context/AppDataContext';

export function History() {
  const { history, routines } = useAppData();
  const [filterRoutine, setFilterRoutine] = useState('todas');

  const routineNames = useMemo(() => {
    const names = new Set(routines.map((r) => r.name));
    history.forEach((h) => names.add(h.routineName));
    return Array.from(names);
  }, [routines, history]);

  const filtered =
    filterRoutine === 'todas' ? history : history.filter((h) => h.routineName === filterRoutine);

  return (
    <div className="px-4 lg:px-0 animate-fade-in">
      <Header title="Historial" subtitle={`${history.length} entrenamientos registrados`} />

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
        <div className="flex items-center gap-1 text-text-dim text-xs shrink-0">
          <Filter size={13} />
        </div>
        <button
          onClick={() => setFilterRoutine('todas')}
          className={
            'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ' +
            (filterRoutine === 'todas'
              ? 'bg-primary text-black border-primary'
              : 'bg-surface-2 text-text-muted border-border')
          }
        >
          Todas
        </button>
        {routineNames.map((name) => (
          <button
            key={name}
            onClick={() => setFilterRoutine(name)}
            className={
              'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ' +
              (filterRoutine === name
                ? 'bg-primary text-black border-primary'
                : 'bg-surface-2 text-text-muted border-border')
            }
          >
            {name}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {filtered.map((session) => (
            <WorkoutCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<HistoryIcon size={22} />}
          title="Sin entrenamientos"
          description="Todavía no tienes entrenamientos en esta categoría."
        />
      )}
    </div>
  );
}
