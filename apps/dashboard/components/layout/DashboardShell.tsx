'use client';

import { useState, useCallback } from 'react';
import type { AuthUser } from '@habitta/types';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardShellProps {
  user: AuthUser;
  children: React.ReactNode;
}

const DashboardShell = ({ user, children }: DashboardShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Overlay mobile — aparece cuando sidebar está abierto */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <Sidebar user={user} isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Columna principal */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header user={user} onMenuToggle={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
