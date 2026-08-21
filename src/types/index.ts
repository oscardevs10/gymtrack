export type MuscleGroup =
  | 'Pecho'
  | 'Espalda'
  | 'Hombros'
  | 'Biceps'
  | 'Triceps'
  | 'Piernas'
  | 'Gluteos'
  | 'Abdomen'
  | 'Cardio';

export type Difficulty = 'Principiante' | 'Intermedio' | 'Avanzado';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string;
  difficulty: Difficulty;
  image: string;
  photos?: [string, string];
  videoId?: string;
  instructions: string[];
  tips: string[];
  commonMistakes: string[];
  variations: string[];
}

export interface RoutineExercise {
  id: string;
  exerciseId: string;
  sets: number;
  reps: string;
  weight: number;
  restSeconds: number;
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  muscleGroups: MuscleGroup[];
  exercises: RoutineExercise[];
  lastPerformed?: string;
  isTemplate?: boolean;
}

export interface CompletedSet {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
  isPR?: boolean;
}

export interface WorkoutExerciseLog {
  exerciseId: string;
  sets: CompletedSet[];
}

export interface WorkoutSession {
  id: string;
  routineId: string;
  routineName: string;
  date: string;
  durationMinutes: number;
  totalVolume: number;
  exercises: WorkoutExerciseLog[];
  newPRs: number;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  previousWeight?: number;
}

export type FitnessGoal = 'hipertrofia' | 'fuerza' | 'perdida_grasa' | 'resistencia';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  weightKg: number | null;
  goal: FitnessGoal | null;
  level: Difficulty | null;
  daysPerWeek: number | null;
  units: 'kg' | 'lb';
  theme: 'dark' | 'light';
  notificationsEnabled: boolean;
  onboardingCompleted: boolean;
}

export const GOAL_LABELS: Record<FitnessGoal, string> = {
  hipertrofia: 'Ganancia muscular',
  fuerza: 'Fuerza',
  perdida_grasa: 'Pérdida de grasa',
  resistencia: 'Resistencia',
};

export interface WeeklyProgressPoint {
  day: string;
  volume: number;
}

export interface BodyWeightEntry {
  date: string;
  weight: number;
}
