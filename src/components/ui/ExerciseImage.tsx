import clsx from 'clsx';
import { Dumbbell, Zap } from 'lucide-react';
import type { MuscleGroup } from '../../types';

const GRADIENTS: Record<string, string> = {
  pecho: 'from-[#3a3a1f] via-[#232320] to-[#15151a]',
  espalda: 'from-[#1f2a3a] via-[#20232b] to-[#15151a]',
  hombros: 'from-[#2a1f3a] via-[#23202b] to-[#15151a]',
  biceps: 'from-[#1f3a2e] via-[#202b25] to-[#15151a]',
  triceps: 'from-[#3a231f] via-[#2b2320] to-[#15151a]',
  piernas: 'from-[#1f2e3a] via-[#20272b] to-[#15151a]',
  gluteos: 'from-[#3a1f30] via-[#2b2027] to-[#15151a]',
  abdomen: 'from-[#3a3a1f] via-[#2b2b20] to-[#15151a]',
  cardio: 'from-[#3a1f1f] via-[#2b2020] to-[#15151a]',
};

interface ExerciseImageProps {
  muscleGroup: MuscleGroup | string;
  className?: string;
  iconSize?: number;
}

export function ExerciseImage({ muscleGroup, className, iconSize = 28 }: ExerciseImageProps) {
  const key = muscleGroup.toLowerCase();
  const gradient = GRADIENTS[key] ?? GRADIENTS.pecho;
  const Icon = key === 'cardio' ? Zap : Dumbbell;

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0',
        gradient,
        className
      )}
    >
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(198,241,53,0.15),transparent_60%)]" />
      <Icon size={iconSize} className="text-white/70 relative z-10" strokeWidth={1.5} />
    </div>
  );
}
