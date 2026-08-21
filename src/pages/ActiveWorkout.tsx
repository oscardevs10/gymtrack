import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { getExerciseById } from '../data/exercises';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SetRow } from '../components/workout/SetRow';
import { RestTimer } from '../components/workout/RestTimer';
import { WorkoutSummary } from '../components/workout/WorkoutSummary';
import { Button } from '../components/ui/Button';
import { parseTargetReps } from '../utils/reps';
import { todayISO } from '../utils/workout';
import { useToast } from '../components/ui/Toast';
import { loadSavedSession, saveActiveSession, clearActiveSession } from '../utils/activeWorkoutStorage';
import type { CompletedSet, WorkoutExerciseLog, WorkoutSession } from '../types';

type Phase = 'exercise' | 'resting' | 'summary';

export function ActiveWorkout() {
  const { routineId } = useParams<{ routineId: string }>();
  const navigate = useNavigate();
  const { getRoutine, history, completeWorkout } = useAppData();
  const { user: authUser } = useAuth();
  const { showToast } = useToast();
  const userId = authUser?.id ?? '';

  const routine = routineId ? getRoutine(routineId) : undefined;
  const savedSession = useMemo(
    () => (routineId ? loadSavedSession(userId, routineId) : null),
    // solo nos interesa la sesión guardada al momento de montar esta pantalla
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [exerciseIndex, setExerciseIndex] = useState(savedSession?.exerciseIndex ?? 0);
  const [phase, setPhase] = useState<Phase>('exercise');
  const [logs, setLogs] = useState<WorkoutExerciseLog[]>(
    () =>
      savedSession?.logs ??
      routine?.exercises.map((re) => ({
        exerciseId: re.exerciseId,
        sets: Array.from({ length: re.sets }, (_, i) => ({
          setNumber: i + 1,
          weight: re.weight,
          reps: parseTargetReps(re.reps),
          completed: false,
        })),
      })) ??
      []
  );
  const [startTime] = useState(() => savedSession?.startTime ?? Date.now());
  const [summaryData, setSummaryData] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    if (savedSession) showToast('Continuando tu entrenamiento sin terminar', 'info');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!routineId || !userId || phase === 'summary') return;
    saveActiveSession({ userId, routineId, logs, exerciseIndex, startTime });
  }, [userId, routineId, logs, exerciseIndex, startTime, phase]);

  const lastPerformance = useMemo(() => {
    if (!routine) return null;
    const currentExId = routine.exercises[exerciseIndex]?.exerciseId;
    for (const session of history) {
      const log = session.exercises.find((e) => e.exerciseId === currentExId);
      const bestSet = log?.sets.find((s) => s.completed);
      if (bestSet) return bestSet;
    }
    return null;
  }, [routine, exerciseIndex, history]);

  if (!routine) {
    return (
      <div className="p-6 text-center text-text-muted">
        Rutina no encontrada.
        <div className="mt-3">
          <Button variant="secondary" onClick={() => navigate('/rutinas')}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  if (phase === 'summary' && summaryData) {
    return (
      <WorkoutSummary
        routineName={summaryData.routineName}
        durationMinutes={summaryData.durationMinutes}
        totalVolume={summaryData.totalVolume}
        exerciseCount={summaryData.exercises.length}
        newPRs={summaryData.newPRs}
      />
    );
  }

  const currentRoutineExercise = routine.exercises[exerciseIndex];
  if (!currentRoutineExercise) {
    return (
      <WorkoutSummary
        routineName={routine.name}
        durationMinutes={Math.max(1, Math.round((Date.now() - startTime) / 60000))}
        totalVolume={logs.reduce(
          (sum, l) => sum + l.sets.filter((s) => s.completed).reduce((s2, set) => s2 + set.weight * set.reps, 0),
          0
        )}
        exerciseCount={logs.length}
        newPRs={0}
      />
    );
  }

  const currentExercise = getExerciseById(currentRoutineExercise.exerciseId);
  const currentLog = logs[exerciseIndex];
  const totalSets = routine.exercises.reduce((s, re) => s + re.sets, 0);
  const completedSets = logs.reduce((s, l) => s + l.sets.filter((set) => set.completed).length, 0);
  const overallProgress = (completedSets / totalSets) * 100;

  const nextIncompleteIdx = currentLog.sets.findIndex((s) => !s.completed);

  function updateSet(setIdx: number, patch: Partial<CompletedSet>) {
    setLogs((prev) =>
      prev.map((log, i) =>
        i === exerciseIndex
          ? { ...log, sets: log.sets.map((s, si) => (si === setIdx ? { ...s, ...patch } : s)) }
          : log
      )
    );
  }

  function finishWorkout(finalLogs: WorkoutExerciseLog[]) {
    const durationMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
    const totalVolume = finalLogs.reduce(
      (sum, l) => sum + l.sets.filter((s) => s.completed).reduce((s2, set) => s2 + set.weight * set.reps, 0),
      0
    );
    const session: WorkoutSession = {
      id: `w-${Date.now()}`,
      routineId: routine!.id,
      routineName: routine!.name,
      date: todayISO(),
      durationMinutes,
      totalVolume,
      exercises: finalLogs,
      newPRs: 0,
    };
    const { newPRs } = completeWorkout(session);
    const finalSession = { ...session, newPRs: newPRs.length };
    clearActiveSession();
    setSummaryData(finalSession);
    if (newPRs.length > 0) showToast(`¡Nuevo PR en ${newPRs[0].exerciseName}!`, 'pr');
    setPhase('summary');
  }

  function completeSet(setIdx: number) {
    updateSet(setIdx, { completed: true });
    const isLastSetOfExercise = setIdx === currentLog.sets.length - 1;
    const isLastExercise = exerciseIndex === routine!.exercises.length - 1;

    if (isLastSetOfExercise && isLastExercise) {
      const finalLogs = logs.map((log, i) =>
        i === exerciseIndex
          ? { ...log, sets: log.sets.map((s, si) => (si === setIdx ? { ...s, completed: true } : s)) }
          : log
      );
      finishWorkout(finalLogs);
      return;
    }

    setPhase('resting');
  }

  function handleRestFinish() {
    advanceAfterRest();
  }

  function advanceAfterRest() {
    const allSetsDone = nextIncompleteIdx === -1;
    if (allSetsDone) {
      setExerciseIndex((i) => i + 1);
    }
    setPhase('exercise');
  }

  if (phase === 'resting') {
    return (
      <div className="px-4 lg:px-0 flex flex-col min-h-[80vh] animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-text">Descanso</span>
          <button onClick={() => navigate(-1)} className="text-text-muted hover:text-text p-1">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <RestTimer
            seconds={currentRoutineExercise.restSeconds}
            onFinish={handleRestFinish}
            onSkip={advanceAfterRest}
            onAddTime={() => {}}
          />
        </div>
        <p className="text-center text-sm text-text-muted mb-4">
          Siguiente serie:{' '}
          {currentLog.sets.find((s) => !s.completed)
            ? `Serie ${currentLog.sets.find((s) => !s.completed)!.setNumber} · ${
                currentLog.sets.find((s) => !s.completed)!.weight
              } kg × ${currentLog.sets.find((s) => !s.completed)!.reps} reps`
            : 'Siguiente ejercicio'}
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-0 animate-fade-in pb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="font-display text-xl leading-none text-text">{routine.name}</h1>
          <p className="text-xs text-primary font-bold uppercase tracking-wide mt-1.5">
            Ejercicio {exerciseIndex + 1} de {routine.exercises.length}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-muted hover:text-text"
        >
          <X size={18} />
        </button>
      </div>

      <ProgressBar value={overallProgress} className="mb-5" />

      {currentExercise && (
        <>
          <h2 className="font-display text-3xl leading-none text-text mb-2">{currentExercise.name}</h2>
          <p className="text-sm text-text-muted mb-5 uppercase tracking-wide">{currentExercise.muscleGroup}</p>

          {lastPerformance && (
            <div className="bg-surface-2 border border-border rounded-xl px-4 py-2.5 mb-4 inline-flex flex-col">
              <span className="text-[10px] text-text-dim uppercase tracking-wide">Última vez</span>
              <span className="text-sm font-semibold text-text">
                {lastPerformance.weight} kg × {lastPerformance.reps} reps
              </span>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            {currentLog.sets.map((set, i) => (
              <SetRow
                key={i}
                set={set}
                isNext={i === nextIncompleteIdx}
                onChangeWeight={(v) => updateSet(i, { weight: v })}
                onChangeReps={(v) => updateSet(i, { reps: v })}
                onComplete={() => completeSet(i)}
              />
            ))}
          </div>

          {nextIncompleteIdx !== -1 && (
            <Button fullWidth className="mt-5" onClick={() => completeSet(nextIncompleteIdx)}>
              Completar serie
            </Button>
          )}
        </>
      )}
    </div>
  );
}
