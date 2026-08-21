import { useState } from 'react';
import { Trophy, TrendingUp, LineChart } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { StatCard } from '../components/ui/StatCard';
import { EmptyState } from '../components/ui/EmptyState';
import { LineTrendChart } from '../components/progress/LineTrendChart';
import { useAppData } from '../context/AppDataContext';
import { getExerciseById } from '../data/exercises';
import { exerciseProgressSeries, mostTrainedExercise, volumeOverTimeSeries } from '../utils/analytics';
import { formatVolume } from '../utils/format';

const RANGES = [
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' },
  { key: '3m', label: '3M' },
  { key: '6m', label: '6M' },
  { key: '1a', label: '1A' },
];

export function Progress() {
  const [range, setRange] = useState('30d');
  const { history, personalRecords } = useAppData();

  const totalVolume = history.reduce((s, w) => s + w.totalVolume, 0);
  const totalWorkouts = history.length;

  const volumeSeries = volumeOverTimeSeries(history);
  const firstHalf = volumeSeries.slice(0, Math.ceil(volumeSeries.length / 2));
  const secondHalf = volumeSeries.slice(Math.ceil(volumeSeries.length / 2));
  const avg = (arr: { volume: number }[]) => (arr.length ? arr.reduce((s, p) => s + p.volume, 0) / arr.length : 0);
  const volumeChange =
    firstHalf.length && avg(firstHalf) > 0 ? Math.round(((avg(secondHalf) - avg(firstHalf)) / avg(firstHalf)) * 100) : 0;

  const featuredExerciseId = mostTrainedExercise(history) ?? personalRecords[0]?.exerciseId ?? null;
  const featuredExercise = featuredExerciseId ? getExerciseById(featuredExerciseId) : undefined;
  const exerciseSeries = featuredExerciseId ? exerciseProgressSeries(history, featuredExerciseId) : [];

  return (
    <div className="px-4 lg:px-0 animate-fade-in">
      <Header title="Progreso" subtitle="Tu evolución en el tiempo" />

      <Tabs tabs={RANGES} active={range} onChange={setRange} className="mb-4" />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard
          label="Volumen total"
          value={formatVolume(totalVolume)}
          delta={volumeChange !== 0 ? `${volumeChange > 0 ? '+' : ''}${volumeChange}%` : undefined}
        />
        <StatCard label="Entrenamientos" value={totalWorkouts} />
      </div>

      {volumeSeries.length > 1 ? (
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-text text-sm flex items-center gap-1.5">
              <TrendingUp size={15} className="text-accent-purple" /> Volumen total
            </h3>
          </div>
          <LineTrendChart data={volumeSeries} dataKey="volume" xKey="date" color="#8b5cf6" unit=" kg" />
        </Card>
      ) : (
        <Card className="mb-4">
          <EmptyState
            icon={<LineChart size={20} />}
            title="Todavía sin suficientes datos"
            description="Completa más entrenamientos para ver tu evolución de volumen."
          />
        </Card>
      )}

      {featuredExercise && exerciseSeries.length > 1 ? (
        <Card className="mb-4">
          <h3 className="font-semibold text-text text-sm mb-1">{featuredExercise.name}</h3>
          <p className="text-xs text-text-muted mb-2">Progreso de carga máxima</p>
          <LineTrendChart data={exerciseSeries} dataKey="weight" xKey="date" color="#c6f135" unit=" kg" />
        </Card>
      ) : null}

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-text text-sm flex items-center gap-1.5">
            <Trophy size={15} className="text-primary" /> Récords personales
          </h3>
        </div>
        {personalRecords.length > 0 ? (
          <div className="flex flex-col gap-3">
            {personalRecords.map((pr) => (
              <div key={pr.exerciseId} className="flex items-center justify-between">
                <span className="text-sm text-text font-medium">{pr.exerciseName}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-text">{pr.weight} kg</span>
                  {pr.previousWeight !== undefined && (
                    <span className="text-xs text-primary ml-2">+{pr.weight - pr.previousWeight} kg</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted">Completa entrenamientos para registrar tus récords.</p>
        )}
      </Card>
    </div>
  );
}
