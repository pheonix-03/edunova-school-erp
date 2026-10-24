'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Calendar,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Header({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {
  const { user, profile, role, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const displayName = user?.name || profile?.name || 'Academic User';
  const avatarUrl =
    user?.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md">
      {/* Search & Command Bar Trigger */}
      <div className="flex items-center gap-3 w-72 md:w-96">
        <button
          onClick={onOpenCommandPalette}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-100/70"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400" />
            <span>Search students, admissions, fees, exams...</span>
          </div>
          <kbd className="hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 border border-slate-200 sm:inline-block">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Center/Right Action Center */}
      <div className="flex items-center gap-4">
        {/* Academic Session Badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-1.5 text-xs text-blue-800 font-semibold shadow-sm">
          <Calendar className="h-3.5 w-3.5 text-blue-600" />
          <span>Academic Session: <strong>2026-2027 (Term 1)</strong></span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white ring-2 ring-white">
              2
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                <span className="text-xs font-bold text-slate-900">Institutional Circulars</span>
                <span className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="rounded-lg bg-blue-50/60 p-2.5 text-xs">
                  <p className="font-semibold text-blue-900">Term 1 PTM Conference</p>
                  <p className="text-slate-600 mt-0.5">Parent-teacher meetings scheduled this Saturday.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Today</span>
                </div>
                <div className="rounded-lg bg-emerald-50/60 p-2.5 text-xs">
                  <p className="font-semibold text-emerald-900">Science Fest Registrations</p>
                  <p className="text-slate-600 mt-0.5">Annual AI & Robotics competition open for entries.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Yesterday</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Sign out */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 p-1.5 pr-3 hover:bg-slate-50 transition"
          >
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200"
            />
            <div className="hidden text-left md:block">
              <p className="text-xs font-bold text-slate-900 leading-none">{displayName}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                {role ? role.replace('_', ' ') : 'USER'}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="border-b border-slate-100 pb-3 px-1">
                <p className="text-xs font-bold text-slate-900">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100">
                  <Shield className="h-3 w-3" />
                  <span>{role?.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="mt-2 space-y-1 text-xs">
                {role === 'PARENT' && (
                  <Link
                    href="/parent-portal"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl p-2 font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    <span>Parent Portal</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl p-2 font-bold text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
