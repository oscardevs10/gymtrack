import type { Routine } from '../types';

let idCounter = 0;
function rid() {
  idCounter += 1;
  return `re-${idCounter}`;
}

export const defaultRoutines: Routine[] = [
  {
    id: 'push-day',
    name: 'Push Day',
    muscleGroups: ['Pecho', 'Hombros', 'Triceps'],
    lastPerformed: '2026-08-20',
    exercises: [
      { id: rid(), exerciseId: 'press-banca', sets: 4, reps: '8-10', weight: 60, restSeconds: 90 },
      { id: rid(), exerciseId: 'press-inclinado-mancuernas', sets: 4, reps: '10', weight: 22, restSeconds: 90 },
      { id: rid(), exerciseId: 'press-militar', sets: 3, reps: '8-10', weight: 30, restSeconds: 90 },
      { id: rid(), exerciseId: 'elevaciones-laterales', sets: 3, reps: '12-15', weight: 8, restSeconds: 60 },
      { id: rid(), exerciseId: 'extension-triceps', sets: 3, reps: '10-12', weight: 12, restSeconds: 60 },
    ],
  },
  {
    id: 'pull-day',
    name: 'Pull Day',
    muscleGroups: ['Espalda', 'Biceps'],
    lastPerformed: '2026-08-19',
    exercises: [
      { id: rid(), exerciseId: 'dominadas', sets: 4, reps: '6-10', weight: 0, restSeconds: 90 },
      { id: rid(), exerciseId: 'jalon-pecho', sets: 4, reps: '10', weight: 55, restSeconds: 90 },
      { id: rid(), exerciseId: 'remo-barra', sets: 4, reps: '8-10', weight: 50, restSeconds: 90 },
      { id: rid(), exerciseId: 'curl-barra', sets: 3, reps: '10', weight: 20, restSeconds: 60 },
      { id: rid(), exerciseId: 'curl-martillo', sets: 3, reps: '12', weight: 10, restSeconds: 60 },
      { id: rid(), exerciseId: 'abdominales', sets: 3, reps: '15-20', weight: 0, restSeconds: 45 },
    ],
  },
  {
    id: 'legs-day',
    name: 'Legs Day',
    muscleGroups: ['Piernas', 'Gluteos'],
    lastPerformed: '2026-08-18',
    exercises: [
      { id: rid(), exerciseId: 'sentadilla', sets: 4, reps: '8-10', weight: 80, restSeconds: 120 },
      { id: rid(), exerciseId: 'prensa', sets: 4, reps: '10-12', weight: 140, restSeconds: 90 },
      { id: rid(), exerciseId: 'peso-muerto-rumano', sets: 4, reps: '10', weight: 60, restSeconds: 90 },
      { id: rid(), exerciseId: 'extension-pierna', sets: 3, reps: '12-15', weight: 40, restSeconds: 60 },
      { id: rid(), exerciseId: 'curl-femoral', sets: 3, reps: '12-15', weight: 35, restSeconds: 60 },
      { id: rid(), exerciseId: 'elevaciones-pantorrilla', sets: 4, reps: '15-20', weight: 60, restSeconds: 45 },
    ],
  },
  {
    id: 'full-body',
    name: 'Full Body',
    muscleGroups: ['Pecho', 'Espalda', 'Piernas'],
    lastPerformed: '2026-08-15',
    exercises: [
      { id: rid(), exerciseId: 'sentadilla', sets: 3, reps: '8-10', weight: 70, restSeconds: 90 },
      { id: rid(), exerciseId: 'press-banca', sets: 3, reps: '8-10', weight: 55, restSeconds: 90 },
      { id: rid(), exerciseId: 'remo-barra', sets: 3, reps: '8-10', weight: 45, restSeconds: 90 },
      { id: rid(), exerciseId: 'press-militar', sets: 3, reps: '8-10', weight: 25, restSeconds: 90 },
      { id: rid(), exerciseId: 'peso-muerto-rumano', sets: 3, reps: '10', weight: 50, restSeconds: 90 },
      { id: rid(), exerciseId: 'abdominales', sets: 3, reps: '15-20', weight: 0, restSeconds: 45 },
      { id: rid(), exerciseId: 'curl-barra', sets: 2, reps: '10-12', weight: 15, restSeconds: 60 },
    ],
  },
  {
    id: 'pecho-triceps',
    name: 'Pecho + Triceps',
    muscleGroups: ['Pecho', 'Triceps'],
    lastPerformed: '2026-08-13',
    exercises: [
      { id: rid(), exerciseId: 'press-banca', sets: 4, reps: '8-10', weight: 60, restSeconds: 90 },
      { id: rid(), exerciseId: 'press-inclinado-mancuernas', sets: 3, reps: '10', weight: 20, restSeconds: 90 },
      { id: rid(), exerciseId: 'extension-triceps', sets: 3, reps: '10-12', weight: 12, restSeconds: 60 },
    ],
  },
];

export const routineTemplates: Routine[] = [
  {
    id: 'tpl-upper-lower',
    name: 'Upper / Lower',
    muscleGroups: ['Pecho', 'Espalda', 'Piernas'],
    isTemplate: true,
    exercises: [
      { id: rid(), exerciseId: 'press-banca', sets: 4, reps: '8-10', weight: 50, restSeconds: 90 },
      { id: rid(), exerciseId: 'remo-barra', sets: 4, reps: '8-10', weight: 40, restSeconds: 90 },
      { id: rid(), exerciseId: 'sentadilla', sets: 4, reps: '8-10', weight: 60, restSeconds: 120 },
    ],
  },
  {
    id: 'tpl-hipertrofia',
    name: 'Hipertrofia 5 días',
    muscleGroups: ['Pecho', 'Espalda', 'Piernas', 'Hombros'],
    isTemplate: true,
    exercises: [
      { id: rid(), exerciseId: 'press-banca', sets: 4, reps: '10-12', weight: 50, restSeconds: 75 },
      { id: rid(), exerciseId: 'jalon-pecho', sets: 4, reps: '10-12', weight: 50, restSeconds: 75 },
      { id: rid(), exerciseId: 'press-militar', sets: 3, reps: '10-12', weight: 25, restSeconds: 75 },
    ],
  },
];
