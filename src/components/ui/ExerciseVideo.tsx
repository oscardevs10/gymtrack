import { useState } from 'react';
import { Play } from 'lucide-react';
import clsx from 'clsx';
import type { Exercise } from '../../types';
import { ExercisePhoto } from './ExercisePhoto';

interface ExerciseVideoProps {
  exercise: Pick<Exercise, 'muscleGroup' | 'photos' | 'name' | 'videoId'>;
  className?: string;
}

export function ExerciseVideo({ exercise, className }: ExerciseVideoProps) {
  const [playing, setPlaying] = useState(false);

  if (!exercise.videoId) {
    return <ExercisePhoto exercise={exercise} className={className} />;
  }

  if (!playing) {
    const thumbnail = `https://i.ytimg.com/vi/${exercise.videoId}/hqdefault.jpg`;
    return (
      <button
        onClick={() => setPlaying(true)}
        className={clsx('relative overflow-hidden bg-black block w-full text-left', className)}
      >
        <img src={thumbnail} alt={exercise.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Play size={24} className="text-black ml-1" fill="black" />
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className={clsx('relative overflow-hidden bg-black', className)}>
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${exercise.videoId}?autoplay=1&rel=0`}
        title={exercise.name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
