import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { useAppData } from '../../context/AppDataContext';
import { greeting } from '../../utils/format';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showGreeting?: boolean;
}

export function Header({ title, subtitle, showGreeting }: HeaderProps) {
  const { user } = useAppData();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="lg:hidden">
        <button onClick={() => navigate('/perfil')}>
          <Avatar initials={user?.avatar ?? '??'} size="md" />
        </button>
      </div>
      <div className="flex-1 lg:flex-none px-3 lg:px-0">
        {showGreeting ? (
          <>
            <h1 className="text-lg font-semibold text-text">
              {greeting()}, <span className="text-primary">{user?.name ?? ''}</span> 👋
            </h1>
            <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl leading-none text-text">{title}</h1>
            {subtitle && <p className="text-sm text-text-muted mt-1.5">{subtitle}</p>}
          </>
        )}
      </div>
      <button className="relative p-2.5 rounded-xl bg-surface-2 border border-border text-text-muted hover:text-text transition-colors">
        <Bell size={19} />
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger" />
      </button>
    </div>
  );
}
