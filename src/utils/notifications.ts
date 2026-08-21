export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  if (Notification.permission !== 'default') return Notification.permission;
  return Notification.requestPermission();
}

const LAST_SHOWN_KEY = 'gymtrack:lastReminderShownDate';

export function showTrainingReminder(routineName: string): void {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;
  try {
    new Notification('¡Hoy toca entrenar! 💪', {
      body: `Tu rutina de hoy: ${routineName}`,
      tag: 'gymtrack-daily-reminder',
      icon: '/icons/icon-192.png',
    });
  } catch {
    // algunos navegadores (ej. móvil sin service worker) bloquean el constructor directo
  }
}

/**
 * Muestra el recordatorio de hoy como máximo una vez por día, y solo si hay
 * una rutina programada y todavía no se ha entrenado hoy.
 */
export function maybeShowDailyReminder(params: {
  enabled: boolean;
  todayRoutineName: string | null;
  alreadyTrainedToday: boolean;
  todayISO: string;
}): void {
  const { enabled, todayRoutineName, alreadyTrainedToday, todayISO } = params;
  if (!enabled || !todayRoutineName || alreadyTrainedToday) return;
  if (getNotificationPermission() !== 'granted') return;

  const lastShown = localStorage.getItem(LAST_SHOWN_KEY);
  if (lastShown === todayISO) return;

  showTrainingReminder(todayRoutineName);
  localStorage.setItem(LAST_SHOWN_KEY, todayISO);
}
