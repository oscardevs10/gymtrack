import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { ExerciseCard } from '../components/exercises/ExerciseCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useAppData } from '../context/AppDataContext';
import { getExerciseById } from '../data/exercises';

export function Favorites() {
  const navigate = useNavigate();
  const { favorites } = useAppData();
  const favExercises = favorites.map((id) => getExerciseById(id)).filter(Boolean);

  return (
    <div className="px-4 lg:px-0 animate-fade-in">
      <Header title="Favoritos" subtitle={`${favExercises.length} ejercicios guardados`} />

      {favExercises.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {favExercises.map((ex) => ex && <ExerciseCard key={ex.id} exercise={ex} />)}
        </div>
      ) : (
        <EmptyState
          icon={<Heart size={22} />}
          title="Sin favoritos"
          description="Guarda ejercicios para acceder rápidamente a ellos."
          action={<Button onClick={() => navigate('/ejercicios')}>Explorar ejercicios</Button>}
        />
      )}
    </div>
  );
}
