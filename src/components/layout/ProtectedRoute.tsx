import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2, Dumbbell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';

function FullScreenLoader() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center animate-pulse">
        <Dumbbell size={24} className="text-black" />
      </div>
      <Loader2 size={20} className="text-text-muted animate-spin" />
    </div>
  );
}

export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  return <Outlet />;
}

export function RequireOnboarding() {
  const { user, loading } = useAppData();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  if (user && !user.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
