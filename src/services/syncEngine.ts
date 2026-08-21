import * as db from './supabaseData';
import { getPendingMutations, removeMutation, bumpAttempts, type QueuedMutation } from '../utils/offlineQueue';
import type { PersonalRecord, Routine, UserProfile, WorkoutSession } from '../types';

async function runMutation(m: QueuedMutation): Promise<void> {
  switch (m.type) {
    case 'insertRoutine': {
      const { routine, sortOrder } = m.payload as { routine: Routine; sortOrder: number };
      await db.insertRoutine(m.userId, routine, sortOrder);
      return;
    }
    case 'insertRoutines':
      await db.insertRoutines(m.userId, m.payload as Routine[]);
      return;
    case 'updateRoutine':
      await db.updateRoutineRow(m.payload as Routine);
      return;
    case 'deleteRoutine':
      await db.deleteRoutineRow(m.payload as string);
      return;
    case 'addFavorite':
      await db.addFavoriteRow(m.userId, m.payload as string);
      return;
    case 'removeFavorite':
      await db.removeFavoriteRow(m.userId, m.payload as string);
      return;
    case 'insertHistory':
      await db.insertHistoryRow(m.userId, m.payload as WorkoutSession);
      return;
    case 'upsertPR':
      await db.upsertPersonalRecordRow(m.userId, m.payload as PersonalRecord);
      return;
    case 'saveProfile':
      await db.saveProfile(m.userId, m.payload as Partial<UserProfile>);
      return;
  }
}

let flushing = false;

/**
 * Procesa la cola de mutaciones pendientes en orden. Se detiene en el primer
 * fallo (normalmente falta de conexión) para no descartar el orden ni hacer
 * spam de reintentos — el próximo trigger (reconexión, intervalo, nueva
 * mutación) lo vuelve a intentar desde ahí.
 */
export async function flushQueue(userId: string, onProgress?: (pendingCount: number) => void): Promise<void> {
  if (flushing) return;
  flushing = true;
  try {
    // Re-lee la cola en cada vuelta (en vez de iterar una foto fija) para
    // recoger mutaciones que se hayan encolado mientras la anterior viajaba.
    for (;;) {
      const pending = getPendingMutations(userId);
      onProgress?.(pending.length);
      if (pending.length === 0) break;

      const mutation = pending[0];
      try {
        await runMutation(mutation);
        removeMutation(mutation.id);
      } catch {
        bumpAttempts(mutation.id);
        break; // probablemente sin conexión — el próximo trigger reintenta
      }
    }
  } finally {
    flushing = false;
  }
}
