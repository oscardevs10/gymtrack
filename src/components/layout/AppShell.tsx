import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';
import { SyncStatusBanner } from './SyncStatusBanner';

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-24 lg:pb-8 lg:pt-6 px-0 lg:px-8 max-w-5xl mx-auto w-full">
        <SyncStatusBanner />
        <div className="pt-5 lg:pt-0">
          <Outlet />
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
