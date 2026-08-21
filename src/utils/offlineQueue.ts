export type MutationType =
  | 'insertRoutine'
  | 'insertRoutines'
  | 'updateRoutine'
  | 'deleteRoutine'
  | 'addFavorite'
  | 'removeFavorite'
  | 'insertHistory'
  | 'upsertPR'
  | 'saveProfile';

export interface QueuedMutation {
  id: string;
  userId: string;
  type: MutationType;
  payload: unknown;
  createdAt: number;
  attempts: number;
}

const STORAGE_KEY = 'gymtrack:pendingMutations';

function readAll(): QueuedMutation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QueuedMutation[]) : [];
  } catch {
    return [];
  }
}

function writeAll(items: QueuedMutation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable, mutation stays in-memory only for this session
  }
}

let counter = 0;
function makeMutationId(): string {
  counter += 1;
  return `mut-${Date.now()}-${counter}`;
}

export function enqueueMutation(userId: string, type: MutationType, payload: unknown): QueuedMutation {
  const item: QueuedMutation = { id: makeMutationId(), userId, type, payload, createdAt: Date.now(), attempts: 0 };
  const all = readAll();
  all.push(item);
  writeAll(all);
  return item;
}

export function getPendingMutations(userId: string): QueuedMutation[] {
  return readAll().filter((m) => m.userId === userId);
}

export function removeMutation(id: string): void {
  writeAll(readAll().filter((m) => m.id !== id));
}

export function bumpAttempts(id: string): void {
  writeAll(readAll().map((m) => (m.id === id ? { ...m, attempts: m.attempts + 1 } : m)));
}
