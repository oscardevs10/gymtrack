import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, Dumbbell, TrendingUp, User } from 'lucide-react';
import clsx from 'clsx';

const links = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/rutinas', label: 'Rutinas', icon: ClipboardList },
  { to: '/ejercicios', label: 'Ejercicios', icon: Dumbbell },
  { to: '/progreso', label: 'Progreso', icon: TrendingUp },
  { to: '/perfil', label: 'Perfil', icon: User },
];

export function BottomNavigation() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-1 py-2.5 px-3 flex-1 transition-colors',
                isActive ? 'text-primary' : 'text-text-dim'
              )
            }
          >
            <Icon size={22} strokeWidth={2} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
