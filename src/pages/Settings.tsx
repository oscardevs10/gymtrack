import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, RefreshCw, Download, Share, SquarePlus } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { GOAL_LABELS, type FitnessGoal } from '../types';
import { NumberStepper } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { isNotificationSupported, requestNotificationPermission } from '../utils/notifications';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full relative transition-colors ${checked ? 'bg-primary' : 'bg-surface-3'}`}
    >
      <span
        className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export function Settings() {
  const navigate = useNavigate();
  const { user, updateUser } = useAppData();
  const { signOut } = useAuth();
  const { showToast } = useToast();
  const { canInstall, isInstalled, isIOS, promptInstall } = useInstallPrompt();

  if (!user) return null;

  async function handleInstall() {
    const outcome = await promptInstall();
    if (outcome === 'accepted') showToast('¡Instalada! Búscala en tu pantalla de inicio.');
  }

  async function handleNotificationsToggle(next: boolean) {
    if (!next) {
      updateUser({ notificationsEnabled: false });
      return;
    }
    if (!isNotificationSupported()) {
      showToast('Tu navegador no soporta notificaciones.', 'info');
      return;
    }
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      updateUser({ notificationsEnabled: true });
      showToast('Notificaciones activadas');
    } else {
      showToast('Debes permitir notificaciones en tu navegador para activarlas.', 'info');
    }
  }

  return (
    <div className="px-4 lg:px-0 animate-fade-in pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-text-muted hover:text-text p-1">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-text">Ajustes</h1>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-text font-medium text-sm">Unidades</div>
            <div className="text-xs text-text-muted">Elige tu unidad de peso preferida</div>
          </div>
          <div className="flex bg-surface-2 border border-border rounded-full p-1">
            {(['kg', 'lb'] as const).map((u) => (
              <button
                key={u}
                onClick={() => updateUser({ units: u })}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.units === u ? 'bg-primary text-black' : 'text-text-muted'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between">
          <div className="text-text font-medium text-sm">Peso corporal</div>
          <NumberStepper
            value={user.weightKg ?? 70}
            onChange={(v) => updateUser({ weightKg: v })}
            step={0.5}
            suffix="kg"
          />
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4">
          <div className="text-text font-medium text-sm mb-2">Objetivo</div>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(GOAL_LABELS) as FitnessGoal[]).map((g) => (
              <button
                key={g}
                onClick={() => updateUser({ goal: g })}
                className={`text-xs font-medium px-3 py-2 rounded-xl border transition-colors ${
                  user.goal === g
                    ? 'bg-primary text-black border-primary'
                    : 'bg-surface-2 text-text-muted border-border'
                }`}
              >
                {GOAL_LABELS[g]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-text font-medium text-sm">Días por semana</div>
            <div className="text-xs text-text-muted">Frecuencia de entrenamiento</div>
          </div>
          <NumberStepper
            value={user.daysPerWeek ?? 3}
            onChange={(v) => updateUser({ daysPerWeek: Math.min(7, Math.max(1, v)) })}
          />
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-text font-medium text-sm">Notificaciones</div>
            <div className="text-xs text-text-muted">Recordatorio cuando tengas rutina programada hoy</div>
          </div>
          <Toggle checked={user.notificationsEnabled} onChange={handleNotificationsToggle} />
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-text font-medium text-sm">Tema</div>
            <div className="text-xs text-text-muted">Modo oscuro activado</div>
          </div>
          <Toggle checked={user.theme === 'dark'} onChange={(v) => updateUser({ theme: v ? 'dark' : 'light' })} />
        </div>

        {!isInstalled && (canInstall || isIOS) && (
          <div className="bg-surface border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <SquarePlus size={16} className="text-primary" />
              <h3 className="font-semibold text-text text-sm">Instala GymTrack</h3>
            </div>
            {canInstall ? (
              <>
                <p className="text-xs text-text-muted mb-3">
                  Agrégala a tu pantalla de inicio para abrirla como una app, sin el navegador.
                </p>
                <Button size="sm" icon={<Download size={15} />} onClick={handleInstall}>
                  Instalar app
                </Button>
              </>
            ) : (
              <p className="text-xs text-text-muted flex items-center gap-1 flex-wrap">
                Toca <Share size={13} className="inline text-text" /> en Safari y luego "Agregar a pantalla de
                inicio".
              </p>
            )}
          </div>
        )}

        <Button
          variant="secondary"
          icon={<RefreshCw size={16} />}
          onClick={() => navigate('/onboarding')}
          className="mt-2"
        >
          Rehacer cuestionario y regenerar rutina
        </Button>

        <Button variant="danger" icon={<LogOut size={16} />} onClick={() => signOut()}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
