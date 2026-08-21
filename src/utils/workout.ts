import type { Routine, WorkoutSession } from '../types';

const SECONDS_PER_SET_WORK = 40;

export function estimateRoutineDuration(routine: Routine): number {
  const totalSeconds = routine.exercises.reduce((sum, ex) => {
    return sum + ex.sets * (SECONDS_PER_SET_WORK + ex.restSeconds);
  }, 0);
  return Math.max(1, Math.round(totalSeconds / 60));
}

export function calculateSessionVolume(session: WorkoutSession): number {
  return session.exercises.reduce((sum, ex) => {
    return sum + ex.sets.filter((s) => s.completed).reduce((s, set) => s + set.weight * set.reps, 0);
  }, 0);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
