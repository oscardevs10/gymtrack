import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { routineTemplates } from '../data/routines';
import { getExerciseById } from '../data/exercises';
import * as db from '../services/supabaseData';
import { flushQueue } from '../services/syncEngine';
import { enqueueMutation, getPendingMutations } from '../utils/offlineQueue';
import type { Routine, RoutineExercise, WorkoutSession, PersonalRecord, UserProfile } from '../types';

interface AppDataContextValue {
  loading: boolean;
  routines: Routine[];
  templates: Routine[];
  favorites: string[];
  history: WorkoutSession[];
  personalRecords: PersonalRecord[];
  user: UserProfile | null;
  isOnline: boolean;
  pendingSyncCount: number;

  toggleFavorite: (exerciseId: string) => void;
  isFavorite: (exerciseId: string) => boolean;

  createRoutine: (name: string, fromTemplate?: Routine) => Routine;
  updateRoutine: (routine: Routine) => void;
  deleteRoutine: (routineId: string) => void;
  duplicateRoutine: (routineId: string) => void;
  getRoutine: (routineId: string) => Routine | undefined;
  replaceAllRoutines: (routines: Routine[]) => void;

  completeWorkout: (session: WorkoutSession) => { newPRs: PersonalRecord[] };
  updateUser: (patch: Partial<UserProfile>) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

let localIdCounter = 0;
function makeId(prefix: string) {
  localIdCounter += 1;
  return `${prefix}-${localIdCounter}-${Math.floor(performance.now())}`;
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();
  const userId = authUser?.id ?? null;
  const authName =
    (authUser?.user_metadata?.name as string | undefined) ?? authUser?.email?.split('@')[0] ?? 'Usuario';

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setRoutines([]);
      setFavorites([]);
      setHistory([]);
      setPersonalRecords([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([
      db.ensureProfile(userId, authName),
      db.fetchRoutines(userId),
      db.fetchFavorites(userId),
      db.fetchHistory(userId),
      db.fetchPersonalRecords(userId),
    ])
      .then(([profileData, routinesData, favoritesData, historyData, prData]) => {
        if (cancelled) return;
        setProfile(profileData);
        setRoutines(routinesData);
        setFavorites(favoritesData);
        setHistory(historyData);
        setPersonalRecords(prData);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, authName]);

  // Cola de sincronización: reintenta mutaciones pendientes al reconectar,
  // al montar y de forma periódica como respaldo (algunos navegadores no
  // disparan 'online' de forma confiable en todos los casos).
  useEffect(() => {
    if (!userId) {
      setPendingSyncCount(0);
      return;
    }

    setPendingSyncCount(getPendingMutations(userId).length);

    const attemptFlush = () => {
      flushQueue(userId, setPendingSyncCount).catch(() => {});
    };

    attemptFlush();

    function handleOnline() {
      setIsOnline(true);
      attemptFlush();
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    const interval = setInterval(attemptFlush, 20000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [userId]);

  const value = useMemo<AppDataContextValue>(() => {
    function sync(type: Parameters<typeof enqueueMutation>[1], payload: unknown) {
      if (!userId) return;
      enqueueMutation(userId, type, payload);
      setPendingSyncCount(getPendingMutations(userId).length);
      flushQueue(userId, setPendingSyncCount).catch(() => {});
    }

    function isFavorite(exerciseId: string) {
      return favorites.includes(exerciseId);
    }

    function toggleFavorite(exerciseId: string) {
      if (!userId) return;
      const already = favorites.includes(exerciseId);
      setFavorites((prev) => (already ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]));
      sync(already ? 'removeFavorite' : 'addFavorite', exerciseId);
    }

    function getRoutine(routineId: string) {
      return routines.find((r) => r.id === routineId);
    }

    function createRoutine(name: string, fromTemplate?: Routine): Routine {
      const newRoutine: Routine = {
        id: makeId('routine'),
        name,
        muscleGroups: fromTemplate?.muscleGroups ?? [],
        exercises: (fromTemplate?.exercises ?? []).map((ex) => ({ ...ex, id: makeId('re') })),
      };
      setRoutines((prev) => [newRoutine, ...prev]);
      sync('insertRoutine', { routine: newRoutine, sortOrder: routines.length });
      return newRoutine;
    }

    function replaceAllRoutines(newRoutines: Routine[]) {
      setRoutines(newRoutines);
      sync('insertRoutines', newRoutines);
    }

    function updateRoutine(routine: Routine) {
      setRoutines((prev) => prev.map((r) => (r.id === routine.id ? routine : r)));
      sync('updateRoutine', routine);
    }

    function deleteRoutine(routineId: string) {
      setRoutines((prev) => prev.filter((r) => r.id !== routineId));
      sync('deleteRoutine', routineId);
    }

    function duplicateRoutine(routineId: string) {
      const original = routines.find((r) => r.id === routineId);
      if (!original || !userId) return;
      const copy: Routine = {
        ...original,
        id: makeId('routine'),
        name: `${original.name} (copia)`,
        exercises: original.exercises.map((ex) => ({ ...ex, id: makeId('re') })),
        lastPerformed: undefined,
      };
      setRoutines((prev) => [copy, ...prev]);
      sync('insertRoutine', { routine: copy, sortOrder: routines.length });
    }

    function completeWorkout(session: WorkoutSession) {
      setHistory((prev) => [session, ...prev]);
      setRoutines((prev) =>
        prev.map((r) => (r.id === session.routineId ? { ...r, lastPerformed: session.date } : r))
      );
      sync('insertHistory', session);
      const updatedRoutine = routines.find((r) => r.id === session.routineId);
      if (updatedRoutine) sync('updateRoutine', { ...updatedRoutine, lastPerformed: session.date });

      const newPRs: PersonalRecord[] = [];
      const updatedPRs = [...personalRecords];

      for (const exLog of session.exercises) {
        const bestSet = exLog.sets
          .filter((s) => s.completed)
          .reduce<{ weight: number; reps: number } | null>((best, s) => {
            if (!best || s.weight > best.weight) return { weight: s.weight, reps: s.reps };
            return best;
          }, null);
        if (!bestSet || bestSet.weight <= 0) continue;

        const existingIndex = updatedPRs.findIndex((pr) => pr.exerciseId === exLog.exerciseId);
        const existing = existingIndex >= 0 ? updatedPRs[existingIndex] : undefined;

        if (!existing || bestSet.weight > existing.weight) {
          const exercise = getExerciseById(exLog.exerciseId);
          const newPR: PersonalRecord = {
            exerciseId: exLog.exerciseId,
            exerciseName: exercise?.name ?? exLog.exerciseId,
            weight: bestSet.weight,
            reps: bestSet.reps,
            date: session.date,
            previousWeight: existing?.weight,
          };
          newPRs.push(newPR);
          if (existingIndex >= 0) updatedPRs[existingIndex] = newPR;
          else updatedPRs.push(newPR);
        }
      }

      if (newPRs.length > 0) {
        setPersonalRecords(updatedPRs);
        newPRs.forEach((pr) => sync('upsertPR', pr));
      }

      return { newPRs };
    }

    function updateUser(patch: Partial<UserProfile>) {
      setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
      sync('saveProfile', patch);
    }

    return {
      loading,
      routines,
      templates: routineTemplates,
      favorites,
      history,
      personalRecords,
      user: profile,
      isOnline,
      pendingSyncCount,
      toggleFavorite,
      isFavorite,
      createRoutine,
      updateRoutine,
      deleteRoutine,
      duplicateRoutine,
      getRoutine,
      replaceAllRoutines,
      completeWorkout,
      updateUser,
    };
  }, [loading, routines, favorites, history, personalRecords, profile, userId, isOnline, pendingSyncCount]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}

export function makeRoutineExercise(exerciseId: string): RoutineExercise {
  return { id: makeId('re'), exerciseId, sets: 3, reps: '10', weight: 0, restSeconds: 60 };
}

export { makeId };
