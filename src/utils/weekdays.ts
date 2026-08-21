const WEEKDAY_PATTERNS: Record<number, string[]> = {
  1: ['Lunes'],
  2: ['Lunes', 'Jueves'],
  3: ['Lunes', 'Miércoles', 'Viernes'],
  4: ['Lunes', 'Martes', 'Jueves', 'Viernes'],
  5: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
  6: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  7: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
};

export function assignWeekdays(daysPerWeek: number): string[] {
  const clamped = Math.min(7, Math.max(1, daysPerWeek));
  return WEEKDAY_PATTERNS[clamped];
}

const ALL_WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function getTodayWeekdayName(): string {
  return ALL_WEEKDAYS[new Date().getDay()];
}
