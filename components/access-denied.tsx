'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export function AccessDenied({
  requiredPermission,
  moduleName,
}: {
  requiredPermission?: string;
  moduleName?: string;
}) {
  const { role, user } = useAuth();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center animate-in fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 shadow-inner ring-8 ring-rose-50/50">
        <ShieldAlert className="h-10 w-10" />
      </div>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
        <Lock className="h-3.5 w-3.5" />
        <span>HTTP 403 • Restricted Access</span>
      </div>

      <h1 className="mt-3 text-2xl font-black text-slate-900 tracking-tight">
        Access Denied to {moduleName || 'This Module'}
      </h1>

      <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
        Your current account role (<strong className="text-slate-800 font-bold">{role?.replace('_', ' ')}</strong>) does not have sufficient administrative privileges to view or perform operations in this section.
      </p>

      {requiredPermission && (
        <div className="mt-4 rounded-xl bg-slate-100 px-3.5 py-2 font-mono text-xs text-slate-600 border border-slate-200">
          Required Permission: <strong className="text-rose-700">{requiredPermission}</strong>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
        >
          <Home className="h-4 w-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
