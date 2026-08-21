import { useState } from 'react';
import clsx from 'clsx';
import type { Exercise } from '../../types';
import { ExerciseImage } from './ExerciseImage';

interface ExercisePhotoProps {
  exercise: Pick<Exercise, 'muscleGroup' | 'photos' | 'name'>;
  className?: string;
  iconSize?: number;
}

export function ExercisePhoto({ exercise, className, iconSize }: ExercisePhotoProps) {
  const [errored, setErrored] = useState(false);

  if (!exercise.photos || errored) {
    return <ExerciseImage muscleGroup={exercise.muscleGroup} className={className} iconSize={iconSize} />;
  }

  return (
    <div className={clsx('relative overflow-hidden rounded-2xl bg-surface-3', className)}>
      <img
        src={exercise.photos[0]}
        alt={exercise.name}
        onError={() => setErrored(true)}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
