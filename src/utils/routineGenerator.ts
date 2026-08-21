import { exercises } from '../data/exercises';
import { assignWeekdays } from './weekdays';
import type { Difficulty, Exercise, FitnessGoal, MuscleGroup, Routine, RoutineExercise } from '../types';

interface GeneratorInput {
  weightKg: number;
  goal: FitnessGoal;
  level: Difficulty;
  daysPerWeek: number;
}

interface DayPlan {
  label: string;
  muscleGroups: MuscleGroup[];
  exerciseCount: number;
}

const GOAL_SCHEME: Record<FitnessGoal, { sets: number; reps: string; rest: number }> = {
  hipertrofia: { sets: 4, reps: '8-12', rest: 90 },
  fuerza: { sets: 5, reps: '4-6', rest: 150 },
  perdida_grasa: { sets: 3, reps: '12-15', rest: 45 },
  resistencia: { sets: 3, reps: '15-20', rest: 30 },
};

const LEVEL_MULTIPLIER: Record<Difficulty, number> = {
  Principiante: 0.6,
  Intermedio: 1,
  Avanzado: 1.4,
};

// Fracción aproximada del peso corporal usada como carga de partida por ejercicio.
const BODYWEIGHT_FRACTION: Record<string, number> = {
  sentadilla: 0.9,
  'peso-muerto-rumano': 0.9,
  prensa: 1.5,
  'press-banca': 0.7,
  'press-inclinado-mancuernas': 0.25,
  'press-militar': 0.45,
  'remo-barra': 0.6,
  'jalon-pecho': 0.6,
  dominadas: 0,
  'curl-barra': 0.25,
  'curl-martillo': 0.12,
  'extension-triceps': 0.2,
  'elevaciones-laterales': 0.06,
  'extension-pierna': 0.35,
  'curl-femoral': 0.3,
  'elevaciones-pantorrilla': 0.6,
  abdominales: 0,
  'aperturas-mancuernas': 0.12,
  'fondos-paralelas': 0,
  'peso-muerto': 1.2,
  'remo-mancuerna': 0.3,
  'remo-maquina': 0.5,
  'press-arnold': 0.2,
  pajaros: 0.05,
  'curl-banco-scott': 0.15,
  'press-frances': 0.15,
  zancadas: 0.15,
  'sentadilla-bulgara': 0.15,
  'hip-thrust': 1.0,
  'puente-gluteo': 0,
  'patada-gluteo': 0.08,
  plancha: 0,
  'russian-twist': 0,
  escaladora: 0,
  'bicicleta-estatica': 0,
  burpees: 0,
  'cuerda-saltar': 0,
};

function estimateWeight(exercise: Exercise, weightKg: number, level: Difficulty): number {
  const fraction = BODYWEIGHT_FRACTION[exercise.id] ?? 0.2;
  if (fraction === 0) return 0;
  const raw = weightKg * fraction * LEVEL_MULTIPLIER[level];
  const rounding = raw < 15 ? 1 : 2.5;
  return Math.max(0, Math.round(raw / rounding) * rounding);
}

function splitForDays(daysPerWeek: number): DayPlan[] {
  const full = (label: string): DayPlan => ({
    label,
    muscleGroups: ['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Biceps', 'Triceps', 'Abdomen'],
    exerciseCount: 6,
  });
  const push = (label: string): DayPlan => ({ label, muscleGroups: ['Pecho', 'Hombros', 'Triceps'], exerciseCount: 5 });
  const pull = (label: string): DayPlan => ({ label, muscleGroups: ['Espalda', 'Biceps'], exerciseCount: 5 });
  const legs = (label: string): DayPlan => ({ label, muscleGroups: ['Piernas', 'Gluteos', 'Abdomen'], exerciseCount: 5 });
  const upper = (label: string): DayPlan => ({
    label,
    muscleGroups: ['Pecho', 'Espalda', 'Hombros', 'Biceps', 'Triceps'],
    exerciseCount: 6,
  });
  const lower = (label: string): DayPlan => ({ label, muscleGroups: ['Piernas', 'Gluteos', 'Abdomen'], exerciseCount: 5 });

  switch (Math.min(7, Math.max(1, daysPerWeek))) {
    case 1:
      return [full('Full Body')];
    case 2:
      return [full('Full Body A'), full('Full Body B')];
    case 3:
      return [push('Push'), pull('Pull'), legs('Legs')];
    case 4:
      return [upper('Upper A'), lower('Lower A'), upper('Upper B'), lower('Lower B')];
    case 5:
      return [
        { label: 'Pecho', muscleGroups: ['Pecho'], exerciseCount: 5 },
        { label: 'Espalda', muscleGroups: ['Espalda'], exerciseCount: 5 },
        legs('Piernas'),
        { label: 'Hombros', muscleGroups: ['Hombros'], exerciseCount: 4 },
        { label: 'Brazos', muscleGroups: ['Biceps', 'Triceps'], exerciseCount: 5 },
      ];
    case 6:
      return [push('Push A'), pull('Pull A'), legs('Legs A'), push('Push B'), pull('Pull B'), legs('Legs B')];
    default:
      return [
        push('Push A'),
        pull('Pull A'),
        legs('Legs A'),
        push('Push B'),
        pull('Pull B'),
        legs('Legs B'),
        { label: 'Cardio + Abdomen', muscleGroups: ['Cardio', 'Abdomen'], exerciseCount: 4 },
      ];
  }
}

function pickExercises(muscleGroups: MuscleGroup[], count: number, usedRecently: Set<string>): Exercise[] {
  const pool = exercises.filter((ex) => muscleGroups.includes(ex.muscleGroup));
  const fresh = pool.filter((ex) => !usedRecently.has(ex.id));
  const ordered = [...fresh, ...pool.filter((ex) => usedRecently.has(ex.id))];

  const perGroup = new Map<string, number>();
  const picked: Exercise[] = [];
  for (const ex of ordered) {
    if (picked.length >= count) break;
    const n = perGroup.get(ex.muscleGroup) ?? 0;
    const maxPerGroup = Math.ceil(count / muscleGroups.length) + 1;
    if (n >= maxPerGroup) continue;
    picked.push(ex);
    perGroup.set(ex.muscleGroup, n + 1);
  }
  return picked;
}

let counter = 0;
function nextId(prefix: string) {
  counter += 1;
  return `${prefix}-gen-${counter}`;
}

export function generateRoutines(input: GeneratorInput): Routine[] {
  const plans = splitForDays(input.daysPerWeek);
  const scheme = GOAL_SCHEME[input.goal];
  const usedRecently = new Set<string>();
  const weekdays = assignWeekdays(input.daysPerWeek);

  return plans.map((plan, dayIndex) => {
    const picked = pickExercises(plan.muscleGroups, plan.exerciseCount, usedRecently);
    picked.forEach((ex) => usedRecently.add(ex.id));

    const routineExercises: RoutineExercise[] = picked.map((ex) => ({
      id: nextId('re'),
      exerciseId: ex.id,
      sets: scheme.sets,
      reps: scheme.reps,
      weight: estimateWeight(ex, input.weightKg, input.level),
      restSeconds: scheme.rest,
    }));

    const muscleGroups = Array.from(new Set(picked.map((ex) => ex.muscleGroup)));

    return {
      id: nextId('routine'),
      name: `${weekdays[dayIndex]} · ${plan.label}`,
      muscleGroups,
      exercises: routineExercises,
    };
  });
}
