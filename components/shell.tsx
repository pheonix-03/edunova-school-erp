'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { CommandPalette } from './command-palette';
import { useAuth } from '@/context/auth-context';
import { canAccessRoute } from '@/lib/rbac';
import { AccessDenied } from './access-denied';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, role } = useAuth();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/login') {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // If on login page, render without shell
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // If session is still loading
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-300">Loading EduNova School ERP...</p>
        </div>
      </div>
    );
  }

  // If unauthenticated, render redirect state
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white p-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <div>
            <h3 className="text-sm font-bold text-white">Authentication Required</h3>
            <p className="text-xs text-slate-400 mt-1">Redirecting you to the school portal sign-in...</p>
          </div>
          <button
            onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname)}`)}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition"
          >
            Click here if not redirected
          </button>
        </div>
      </div>
    );
  }

  // Role-Based Route Guard
  const hasRouteAccess = canAccessRoute(role || 'STUDENT', pathname);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            {hasRouteAccess ? children : <AccessDenied moduleName={pathname.replace('/', '').toUpperCase()} />}
          </div>
        </main>
      </div>

      {/* Global Quick Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
