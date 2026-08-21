import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Flame, Zap, Wind, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useAppData } from '../context/AppDataContext';
import { Button } from '../components/ui/Button';
import { NumberStepper } from '../components/ui/Input';
import { GOAL_LABELS, type Difficulty, type FitnessGoal } from '../types';
import { generateRoutines } from '../utils/routineGenerator';

const GOALS: { key: FitnessGoal; icon: typeof Flame; description: string }[] = [
  { key: 'hipertrofia', icon: Dumbbell, description: 'Aumentar masa muscular con volumen moderado-alto' },
  { key: 'fuerza', icon: Flame, description: 'Levantar más peso con series pesadas y bajas repeticiones' },
  { key: 'perdida_grasa', icon: Wind, description: 'Definición con descansos cortos y más densidad' },
  { key: 'resistencia', icon: Zap, description: 'Repeticiones altas y series ligeras' },
];

const LEVELS: Difficulty[] = ['Principiante', 'Intermedio', 'Avanzado'];

const TOTAL_STEPS = 4;

export function Onboarding() {
  const navigate = useNavigate();
  const { updateUser, replaceAllRoutines } = useAppData();

  const [step, setStep] = useState(0);
  const [weightKg, setWeightKg] = useState(70);
  const [goal, setGoal] = useState<FitnessGoal>('hipertrofia');
  const [level, setLevel] = useState<Difficulty>('Intermedio');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [generating, setGenerating] = useState(false);

  async function finish() {
    setGenerating(true);
    const routines = generateRoutines({ weightKg, goal, level, daysPerWeek });
    replaceAllRoutines(routines);
    updateUser({ weightKg, goal, level, daysPerWeek, onboardingCompleted: true });
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col px-5 py-8">
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col">
        <div className="flex gap-1.5 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={clsx('h-1.5 flex-1 rounded-full', i <= step ? 'bg-primary' : 'bg-surface-3')} />
          ))}
        </div>

        {step === 0 && (
          <StepShell title="¿Cuánto pesas?" subtitle="Usamos tu peso para sugerir cargas iniciales.">
            <div className="flex flex-col items-center py-10">
              <NumberStepper value={weightKg} onChange={setWeightKg} step={1} min={30} suffix="kg" />
            </div>
          </StepShell>
        )}

        {step === 1 && (
          <StepShell title="¿Cuál es tu enfoque?" subtitle="Ajustamos series, repeticiones y descansos según tu objetivo.">
            <div className="flex flex-col gap-2.5">
              {GOALS.map(({ key, icon: Icon, description }) => (
                <button
                  key={key}
                  onClick={() => setGoal(key)}
                  className={clsx(
                    'flex items-start gap-3 p-4 rounded-2xl border text-left transition-colors',
                    goal === key ? 'bg-primary-bg border-primary' : 'bg-surface border-border'
                  )}
                >
                  <Icon size={20} className={goal === key ? 'text-primary' : 'text-text-muted'} />
                  <div>
                    <div className="font-semibold text-text text-sm">{GOAL_LABELS[key]}</div>
                    <div className="text-xs text-text-muted mt-0.5">{description}</div>
                  </div>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell title="¿Cuál es tu experiencia?" subtitle="Esto ajusta el peso sugerido en cada ejercicio.">
            <div className="flex flex-col gap-2.5">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={clsx(
                    'p-4 rounded-2xl border text-left font-semibold text-sm transition-colors',
                    level === l ? 'bg-primary-bg border-primary text-primary' : 'bg-surface border-border text-text'
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell title="¿Cuántos días entrenas?" subtitle="Dividimos tu rutina automáticamente según esto.">
            <div className="flex flex-col items-center py-10 gap-3">
              <NumberStepper value={daysPerWeek} onChange={(v) => setDaysPerWeek(Math.min(7, Math.max(1, v)))} min={1} suffix="días/sem" />
              <p className="text-xs text-text-dim text-center max-w-xs">
                Con {daysPerWeek} {daysPerWeek === 1 ? 'día' : 'días'} generaremos{' '}
                {daysPerWeek <= 2 ? 'rutinas de cuerpo completo' : daysPerWeek <= 4 ? 'una división superior/inferior' : 'una división por grupo muscular'}.
              </p>
            </div>
          </StepShell>
        )}

        <div className="flex gap-3 mt-auto pt-6">
          {step > 0 && (
            <Button variant="secondary" icon={<ChevronLeft size={16} />} onClick={() => setStep((s) => s - 1)}>
              Atrás
            </Button>
          )}
          {step < TOTAL_STEPS - 1 ? (
            <Button fullWidth onClick={() => setStep((s) => s + 1)}>
              Continuar <ChevronRight size={16} />
            </Button>
          ) : (
            <Button fullWidth onClick={finish} disabled={generating}>
              {generating ? <Loader2 size={18} className="animate-spin" /> : 'Generar mi rutina'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="animate-fade-in flex-1">
      <h1 className="text-2xl font-bold text-text mb-1.5">{title}</h1>
      <p className="text-sm text-text-muted mb-6">{subtitle}</p>
      {children}
    </div>
  );
}
