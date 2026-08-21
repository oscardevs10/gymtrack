import { NavLink } from 'react-router-dom';
import {
  Home,
  ClipboardList,
  Dumbbell,
  Play,
  TrendingUp,
  History,
  Heart,
  User,
  Settings,
} from 'lucide-react';
import clsx from 'clsx';
import { useAppData } from '../../context/AppDataContext';
import { Avatar } from '../ui/Avatar';

const links = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/rutinas', label: 'Mis rutinas', icon: ClipboardList },
  { to: '/ejercicios', label: 'Ejercicios', icon: Dumbbell },
  { to: '/entrenamiento', label: 'Entrenamiento', icon: Play },
  { to: '/progreso', label: 'Progreso', icon: TrendingUp },
  { to: '/historial', label: 'Historial', icon: History },
  { to: '/favoritos', label: 'Favoritos', icon: Heart },
  { to: '/perfil', label: 'Perfil', icon: User },
];

export function Sidebar() {
  const { user } = useAppData();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-surface h-screen sticky top-0 py-6 px-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Dumbbell size={18} className="text-black" />
        </div>
        <span className="font-display text-xl tracking-wide text-text">GYMTRACK</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-bg text-primary'
                  : 'text-text-muted hover:text-text hover:bg-surface-2'
              )
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-1">
        <NavLink
          to="/ajustes"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-2',
              isActive ? 'bg-primary-bg text-primary' : 'text-text-muted hover:text-text hover:bg-surface-2'
            )
          }
        >
          <Settings size={19} />
          Ajustes
        </NavLink>
        <NavLink
          to="/perfil"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-2 transition-colors"
        >
          <Avatar initials={user?.avatar ?? '??'} size="sm" />
          <div className="text-left overflow-hidden">
            <div className="text-sm font-semibold text-text truncate">{user?.name ?? ''}</div>
            <div className="text-xs text-text-muted">{user?.level ?? ''}</div>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}
