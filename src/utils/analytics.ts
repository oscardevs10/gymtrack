import type { WorkoutSession } from '../types';

const DAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

export function weeklyVolumeSeries(history: WorkoutSession[]): { day: string; volume: number }[] {
  const now = new Date();
  const startOfWeek = new Date(now);
  const jsDay = now.getDay(); // 0=Sunday
  const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay;
  startOfWeek.setDate(now.getDate() + mondayOffset);
  startOfWeek.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return { date: d, day: DAY_LABELS[d.getDay()], volume: 0 };
  });

  history.forEach((session) => {
    const sessionDate = new Date(session.date + 'T00:00:00');
    const match = days.find((d) => d.date.toDateString() === sessionDate.toDateString());
    if (match) match.volume += session.totalVolume;
  });

  return days.map(({ day, volume }) => ({ day, volume }));
}

export function volumeOverTimeSeries(history: WorkoutSession[], limit = 10): { date: string; volume: number }[] {
  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map<string, number>();
  sorted.forEach((s) => byDate.set(s.date, (byDate.get(s.date) ?? 0) + s.totalVolume));
  const entries = Array.from(byDate.entries()).slice(-limit);
  return entries.map(([date, volume]) => ({ date: formatShortDate(date), volume }));
}

export function mostTrainedExercise(history: WorkoutSession[]): string | null {
  const counts = new Map<string, number>();
  history.forEach((session) => {
    session.exercises.forEach((ex) => {
      if (ex.sets.some((s) => s.completed)) counts.set(ex.exerciseId, (counts.get(ex.exerciseId) ?? 0) + 1);
    });
  });
  let best: string | null = null;
  let bestCount = 0;
  counts.forEach((count, id) => {
    if (count > bestCount) {
      best = id;
      bestCount = count;
    }
  });
  return best;
}

export function exerciseProgressSeries(
  history: WorkoutSession[],
  exerciseId: string,
  limit = 10
): { date: string; weight: number }[] {
  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
  const points: { date: string; weight: number }[] = [];
  sorted.forEach((session) => {
    const log = session.exercises.find((e) => e.exerciseId === exerciseId);
    if (!log) return;
    const maxWeight = Math.max(0, ...log.sets.filter((s) => s.completed).map((s) => s.weight));
    if (maxWeight > 0) points.push({ date: formatShortDate(session.date), weight: maxWeight });
  });
  return points.slice(-limit);
}

function formatShortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
