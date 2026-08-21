import { WifiOff, RefreshCw } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

export function SyncStatusBanner() {
  const { isOnline, pendingSyncCount } = useAppData();

  if (isOnline && pendingSyncCount === 0) return null;

  return (
    <div className="sticky top-0 z-30 flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium bg-warning/15 text-warning border-b border-warning/20">
      {isOnline ? (
        <>
          <RefreshCw size={13} className="animate-spin" />
          Sincronizando {pendingSyncCount} {pendingSyncCount === 1 ? 'cambio' : 'cambios'} pendiente
          {pendingSyncCount === 1 ? '' : 's'}...
        </>
      ) : (
        <>
          <WifiOff size={13} />
          Sin conexión — tus cambios se guardan y se sincronizan al reconectar
          {pendingSyncCount > 0 ? ` (${pendingSyncCount} pendiente${pendingSyncCount === 1 ? '' : 's'})` : ''}
        </>
      )}
    </div>
  );
}
