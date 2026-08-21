import { supabase } from '../lib/supabase';
import type { PersonalRecord, Routine, UserProfile, WorkoutSession } from '../types';

// ---- Mapping helpers: DB rows (snake_case) <-> app types (camelCase) ----

interface ProfileRow {
  id: string;
  name: string;
  avatar: string;
  weight_kg: number | null;
  goal: string | null;
  level: string | null;
  days_per_week: number | null;
  units: string;
  theme: string;
  notifications_enabled: boolean;
  onboarding_completed: boolean;
}

function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    weightKg: row.weight_kg,
    goal: row.goal as UserProfile['goal'],
    level: row.level as UserProfile['level'],
    daysPerWeek: row.days_per_week,
    units: row.units as UserProfile['units'],
    theme: row.theme as UserProfile['theme'],
    notificationsEnabled: row.notifications_enabled,
    onboardingCompleted: row.onboarding_completed,
  };
}

interface RoutineRow {
  id: string;
  name: string;
  muscle_groups: string[];
  exercises: Routine['exercises'];
  last_performed: string | null;
  is_template: boolean;
  sort_order: number;
}

function mapRoutine(row: RoutineRow): Routine {
  return {
    id: row.id,
    name: row.name,
    muscleGroups: row.muscle_groups as Routine['muscleGroups'],
    exercises: row.exercises,
    lastPerformed: row.last_performed ?? undefined,
    isTemplate: row.is_template,
  };
}

interface HistoryRow {
  id: string;
  routine_id: string | null;
  routine_name: string;
  date: string;
  duration_minutes: number;
  total_volume: number;
  exercises: WorkoutSession['exercises'];
  new_prs: number;
}

function mapHistory(row: HistoryRow): WorkoutSession {
  return {
    id: row.id,
    routineId: row.routine_id ?? '',
    routineName: row.routine_name,
    date: row.date,
    durationMinutes: row.duration_minutes,
    totalVolume: row.total_volume,
    exercises: row.exercises,
    newPRs: row.new_prs,
  };
}

interface PersonalRecordRow {
  exercise_id: string;
  exercise_name: string;
  weight: number;
  reps: number;
  date: string;
  previous_weight: number | null;
}

function mapPR(row: PersonalRecordRow): PersonalRecord {
  return {
    exerciseId: row.exercise_id,
    exerciseName: row.exercise_name,
    weight: row.weight,
    reps: row.reps,
    date: row.date,
    previousWeight: row.previous_weight ?? undefined,
  };
}

// ---- Profile ----

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data ? mapProfile(data as ProfileRow) : null;
}

export async function ensureProfile(userId: string, name: string): Promise<UserProfile> {
  const existing = await fetchProfile(userId);
  if (existing) return existing;

  const avatar = name.slice(0, 2).toUpperCase() || 'US';
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, name: name || 'Usuario', avatar })
    .select()
    .single();
  if (error) throw error;
  return mapProfile(data as ProfileRow);
}

export async function saveProfile(userId: string, patch: Partial<UserProfile>): Promise<void> {
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.avatar !== undefined) row.avatar = patch.avatar;
  if (patch.weightKg !== undefined) row.weight_kg = patch.weightKg;
  if (patch.goal !== undefined) row.goal = patch.goal;
  if (patch.level !== undefined) row.level = patch.level;
  if (patch.daysPerWeek !== undefined) row.days_per_week = patch.daysPerWeek;
  if (patch.units !== undefined) row.units = patch.units;
  if (patch.theme !== undefined) row.theme = patch.theme;
  if (patch.notificationsEnabled !== undefined) row.notifications_enabled = patch.notificationsEnabled;
  if (patch.onboardingCompleted !== undefined) row.onboarding_completed = patch.onboardingCompleted;

  const { error } = await supabase.from('profiles').update(row).eq('id', userId);
  if (error) throw error;
}

// ---- Routines ----

export async function fetchRoutines(userId: string): Promise<Routine[]> {
  const { data, error } = await supabase
    .from('routines')
    .select('*')
    .eq('user_id', userId)
    .eq('is_template', false)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data as RoutineRow[]).map(mapRoutine);
}

export async function insertRoutine(userId: string, routine: Routine, sortOrder = 0): Promise<Routine> {
  const { data, error } = await supabase
    .from('routines')
    .insert({
      id: routine.id,
      user_id: userId,
      name: routine.name,
      muscle_groups: routine.muscleGroups,
      exercises: routine.exercises,
      last_performed: routine.lastPerformed ?? null,
      is_template: false,
      sort_order: sortOrder,
    })
    .select()
    .single();
  if (error) throw error;
  return mapRoutine(data as RoutineRow);
}

export async function insertRoutines(userId: string, routines: Routine[]): Promise<void> {
  const rows = routines.map((r, i) => ({
    id: r.id,
    user_id: userId,
    name: r.name,
    muscle_groups: r.muscleGroups,
    exercises: r.exercises,
    day_label: r.name,
    is_template: false,
    sort_order: i,
  }));
  const { error } = await supabase.from('routines').insert(rows);
  if (error) throw error;
}

export async function updateRoutineRow(routine: Routine): Promise<void> {
  const { error } = await supabase
    .from('routines')
    .update({
      name: routine.name,
      muscle_groups: routine.muscleGroups,
      exercises: routine.exercises,
      last_performed: routine.lastPerformed ?? null,
    })
    .eq('id', routine.id);
  if (error) throw error;
}

export async function deleteRoutineRow(routineId: string): Promise<void> {
  const { error } = await supabase.from('routines').delete().eq('id', routineId);
  if (error) throw error;
}

// ---- Favorites ----

export async function fetchFavorites(userId: string): Promise<string[]> {
  const { data, error } = await supabase.from('favorites').select('exercise_id').eq('user_id', userId);
  if (error) throw error;
  return (data as { exercise_id: string }[]).map((r) => r.exercise_id);
}

export async function addFavoriteRow(userId: string, exerciseId: string): Promise<void> {
  const { error } = await supabase.from('favorites').insert({ user_id: userId, exercise_id: exerciseId });
  if (error) throw error;
}

export async function removeFavoriteRow(userId: string, exerciseId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId);
  if (error) throw error;
}

// ---- Workout history ----

export async function fetchHistory(userId: string): Promise<WorkoutSession[]> {
  const { data, error } = await supabase
    .from('workout_history')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error) throw error;
  return (data as HistoryRow[]).map(mapHistory);
}

export async function insertHistoryRow(userId: string, session: WorkoutSession): Promise<void> {
  const { error } = await supabase.from('workout_history').insert({
    id: session.id,
    user_id: userId,
    routine_id: session.routineId,
    routine_name: session.routineName,
    date: session.date,
    duration_minutes: session.durationMinutes,
    total_volume: session.totalVolume,
    exercises: session.exercises,
    new_prs: session.newPRs,
  });
  if (error) throw error;
}

// ---- Personal records ----

export async function fetchPersonalRecords(userId: string): Promise<PersonalRecord[]> {
  const { data, error } = await supabase.from('personal_records').select('*').eq('user_id', userId);
  if (error) throw error;
  return (data as PersonalRecordRow[]).map(mapPR);
}

export async function upsertPersonalRecordRow(userId: string, pr: PersonalRecord): Promise<void> {
  const { error } = await supabase.from('personal_records').upsert({
    user_id: userId,
    exercise_id: pr.exerciseId,
    exercise_name: pr.exerciseName,
    weight: pr.weight,
    reps: pr.reps,
    date: pr.date,
    previous_weight: pr.previousWeight ?? null,
  });
  if (error) throw error;
}
