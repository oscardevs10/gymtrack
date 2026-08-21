export function formatVolume(kg: number): string {
  return `${kg.toLocaleString('es-ES')} kg`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

export function formatDate(iso: string): string {
  const date = new Date(iso + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export function relativeDate(iso: string | undefined, today: string): string {
  if (!iso) return 'Nunca';
  const d1 = new Date(iso + 'T00:00:00').getTime();
  const d2 = new Date(today + 'T00:00:00').getTime();
  const diffDays = Math.round((d2 - d1) / 86400000);
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return formatDate(iso);
}

export function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}
