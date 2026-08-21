import type { WorkoutExerciseLog } from '../types';

export interface SavedWorkoutSession {
  userId: string;
  routineId: string;
  logs: WorkoutExerciseLog[];
  exerciseIndex: number;
  startTime: number;
}

const STORAGE_KEY = 'gymtrack:activeWorkoutSession';

export function loadSavedSession(userId: string, routineId: string): SavedWorkoutSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as SavedWorkoutSession;
    if (saved.userId !== userId || saved.routineId !== routineId) return null;
    return saved;
  } catch {
    return null;
  }
}

export function saveActiveSession(session: SavedWorkoutSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // best-effort — if storage is full/unavailable, resilience is skipped silently
  }
}

export function clearActiveSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
