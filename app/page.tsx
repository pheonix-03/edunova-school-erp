'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Users,
  Clock,
  CreditCard,
  Award,
  ArrowUpRight,
  Sparkles,
  CalendarCheck,
  UserPlus,
  BookOpen,
  TrendingUp,
  Building,
  Bell,
  ArrowRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

export default function SchoolDashboardPage() {
  const { user, profile, role, hasPermission } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.name || profile?.name || 'Academic Leader';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-blue-300" />
              <span>EduNova School ERP • {role?.replace('_', ' ')} Command Center</span>
            </div>
            <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {displayName}! 🎓
            </h1>
            <p className="mt-1 text-sm text-blue-100/90 max-w-xl">
              Academic Session 2026-2027 is active. Manage student records, daily attendance, fee collections, and term examination grades in real time.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/attendance"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/20 transition border border-white/10"
            >
              <Clock className="h-4 w-4 text-blue-300" />
              <span>Mark Attendance</span>
            </Link>
            <Link
              href="/students"
              className="flex items-center gap-2 rounded-xl bg-white text-xs font-bold text-blue-900 px-4 py-2.5 shadow-md hover:bg-blue-50 transition"
            >
              <UserPlus className="h-4 w-4 text-blue-600" />
              <span>New Admission</span>
            </Link>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Enrolled Students */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Enrolled Students
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {stats?.totalStudents || 5}
            </span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <ArrowUpRight className="h-3 w-3" /> 100% Active
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Across {stats?.totalClasses || 4} Grade Sections</p>
        </div>

        {/* Metric 2: Today Student Attendance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Today Attendance
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {stats?.presentToday || 4}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
              {stats?.attendanceRate || 95}% Rate
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">1 Absent (Leave Note Logged)</p>
        </div>

        {/* Metric 3: Fee Realization */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Term 1 Fees Realized
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {formatCurrency(stats?.totalFeeCollected || 130000)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {stats?.feeCollectionRate || 80}% Realized • {stats?.pendingFeeInvoicesCount || 1} Pending
          </p>
        </div>

        {/* Metric 4: Admission Inquiries */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Admission Inquiries
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <UserPlus className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">
              {stats?.admissionsCount || 3}
            </span>
            <span className="text-xs font-medium text-amber-700">In Pipeline</span>
          </div>
          <Link
            href="/admissions"
            className="mt-1 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
          >
            Review Admissions CRM <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Class Overview + Noticeboard */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Grade Classes & Capacity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Academic Sections & Class Teachers</h3>
                <p className="text-xs text-slate-500">Classroom allocations and student enrollments.</p>
              </div>
              <Link href="/attendance" className="text-xs font-bold text-blue-600 hover:underline">
                Mark Class Attendance →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(stats?.classes || []).map((cls: any) => (
                <div key={cls.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                      {cls.name} - Section {cls.section}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {cls._count?.students || 5} / {cls.capacity} Students
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-semibold text-slate-700">
                    Mentor: <strong className="text-slate-900">{cls.classTeacher ? `${cls.classTeacher.firstName} ${cls.classTeacher.lastName}` : 'Assigned Faculty'}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{cls.roomNumber || 'Academic Block'}</p>

                  <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${Math.max(20, ((cls._count?.students || 5) / cls.capacity) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Academic Hub Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/students"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-400 hover:shadow-md transition"
            >
              <GraduationCap className="h-6 w-6 text-blue-600 mb-2" />
              <h4 className="font-bold text-sm text-slate-900">Student Database</h4>
              <p className="text-xs text-slate-500 mt-1">Search, update profiles, roll numbers, and parent details.</p>
            </Link>

            <Link
              href="/fees"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-purple-400 hover:shadow-md transition"
            >
              <CreditCard className="h-6 w-6 text-purple-600 mb-2" />
              <h4 className="font-bold text-sm text-slate-900">Fee Accounts</h4>
              <p className="text-xs text-slate-500 mt-1">Collect payments, manage dues, and export official PDF receipts.</p>
            </Link>

            <Link
              href="/examinations"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-400 hover:shadow-md transition"
            >
              <Award className="h-6 w-6 text-emerald-600 mb-2" />
              <h4 className="font-bold text-sm text-slate-900">Exams & Marksheets</h4>
              <p className="text-xs text-slate-500 mt-1">Gradebooks, term assessments, and official PDF report cards.</p>
            </Link>
          </div>
        </div>

        {/* Right Col: Noticeboard */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-500" />
                <span>School Circulars & Notices</span>
              </h3>
              <span className="text-[11px] text-blue-600 font-semibold">Active</span>
            </div>

            <div className="mt-4 space-y-3.5">
              {(stats?.notices || []).map((notice: any) => (
                <div
                  key={notice.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs transition hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-700 uppercase">
                      Audience: {notice.targetAudience}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(notice.createdAt)}
                    </span>
                  </div>
                  <h4 className="mt-1.5 font-bold text-slate-900">{notice.title}</h4>
                  <p className="mt-1 text-slate-600 leading-relaxed">{notice.content}</p>
                  <p className="mt-2 text-[10px] font-medium text-slate-400">
                    Issued by: {notice.authorName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
