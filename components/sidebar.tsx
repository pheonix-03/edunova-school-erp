'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  UserPlus,
  Clock,
  CreditCard,
  Award,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles,
  LogOut,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { hasPermission } from '@/lib/rbac';

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, role, logout } = useAuth();

  const allNavItems = [
    {
      name: 'School Dashboard',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
      permission: 'VIEW_DASHBOARD',
    },
    {
      name: 'Student 360° Records',
      href: '/students',
      icon: GraduationCap,
      badge: null,
      permission: 'VIEW_STUDENTS',
    },
    {
      name: 'Admissions & CRM',
      href: '/admissions',
      icon: UserPlus,
      badge: '3 New',
      badgeColor: 'bg-amber-500 text-white',
      permission: 'MANAGE_ADMISSIONS',
    },
    {
      name: 'Class Attendance',
      href: '/attendance',
      icon: Clock,
      badge: null,
      permission: 'VIEW_ATTENDANCE',
    },
    {
      name: 'Fees & Accounts',
      href: '/fees',
      icon: CreditCard,
      badge: null,
      permission: 'VIEW_FEES',
    },
    {
      name: 'Exams & Report Cards',
      href: '/examinations',
      icon: Award,
      badge: null,
      permission: 'VIEW_EXAMS',
    },
    {
      name: 'Parent / Student Portal',
      href: '/parent-portal',
      icon: Smartphone,
      badge: 'Mobile App',
      badgeColor: 'bg-emerald-500 text-white',
      permission: 'VIEW_PARENT_PORTAL',
    },
  ];

  // Filter based on active role permissions
  const navItems = allNavItems.filter((item) =>
    role ? hasPermission(role, item.permission as any) : true
  );

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-slate-200 bg-white transition-all duration-300 z-30',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand / Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-base">
                  Edu<span className="text-blue-600">Nova</span>
                </span>
                <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
                  ERP/SIS
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Institutional Suite</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md">
            <GraduationCap className="h-5 w-5" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Role Indicator Banner */}
      {!collapsed && (
        <div className="mx-3 mt-3 rounded-xl bg-slate-50 p-2.5 border border-slate-100 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-blue-700">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Current Portal
            </p>
            <p className="text-xs font-bold text-slate-800 truncate">
              {role ? role.replace('_', ' ') : 'AUTHENTICATED'}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-colors',
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                )}
              />
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        item.badgeColor || 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Institution Info & Logout */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-1 text-xs text-slate-500">
            <Building2 className="h-4 w-4 text-slate-400" />
            <span className="truncate font-medium">St. Xavier&apos;s International</span>
          </div>
        )}
        <button
          onClick={logout}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition',
            collapsed && 'justify-center px-0'
          )}
          title="Sign out of account"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
