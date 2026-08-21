import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { ToastProvider } from './components/ui/Toast';
import { AppShell } from './components/layout/AppShell';
import { RequireAuth, RequireOnboarding } from './components/layout/ProtectedRoute';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Exercises } from './pages/Exercises';
import { ExerciseDetail } from './pages/ExerciseDetail';
import { Routines } from './pages/Routines';
import { RoutineDetail } from './pages/RoutineDetail';
import { RoutineEditor } from './pages/RoutineEditor';
import { ActiveWorkout } from './pages/ActiveWorkout';
import { Progress } from './pages/Progress';
import { History } from './pages/History';
import { HistoryDetail } from './pages/HistoryDetail';
import { Favorites } from './pages/Favorites';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

function WithAppData() {
  return (
    <AppDataProvider>
      <Outlet />
    </AppDataProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Auth />} />

            <Route element={<RequireAuth />}>
              <Route element={<WithAppData />}>
                <Route path="/onboarding" element={<Onboarding />} />

                <Route element={<RequireOnboarding />}>
                  <Route element={<AppShell />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/ejercicios" element={<Exercises />} />
                    <Route path="/ejercicios/:id" element={<ExerciseDetail />} />
                    <Route path="/rutinas" element={<Routines />} />
                    <Route path="/rutinas/nueva" element={<RoutineEditor />} />
                    <Route path="/rutinas/:id" element={<RoutineDetail />} />
                    <Route path="/rutinas/:id/editar" element={<RoutineEditor />} />
                    <Route path="/entrenamiento/:routineId" element={<ActiveWorkout />} />
                    <Route path="/progreso" element={<Progress />} />
                    <Route path="/historial" element={<History />} />
                    <Route path="/historial/:id" element={<HistoryDetail />} />
                    <Route path="/favoritos" element={<Favorites />} />
                    <Route path="/perfil" element={<Profile />} />
                    <Route path="/ajustes" element={<Settings />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
