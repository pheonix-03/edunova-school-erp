'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Save,
  Users,
  Sparkles,
  UserCheck,
  Building,
} from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import confetti from 'canvas-confetti';

export default function ClassAttendancePage() {
  const { user, role, hasPermission } = useAuth();
  const canManageAttendance = hasPermission('MANAGE_ATTENDANCE');

  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceState, setAttendanceState] = useState<Record<string, { status: string; remarks: string }>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchClassStudents();
    }
  }, [selectedClassId, date]);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      const data = await res.json();
      setClasses(data || []);
      if (data?.length > 0) {
        setSelectedClassId(data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchClassStudents = async () => {
    try {
      setLoading(true);
      const [stuRes, attRes] = await Promise.all([
        fetch(`/api/students?classId=${selectedClassId}`),
        fetch(`/api/attendance?classId=${selectedClassId}&date=${date}`),
      ]);

      const stuData = await stuRes.json();
      const attData = await attRes.json();

      setStudents(stuData || []);

      // Populate state with existing or default PRESENT
      const map: Record<string, { status: string; remarks: string }> = {};
      stuData.forEach((st: any) => {
        const existing = attData.find((a: any) => a.studentId === st.id);
        map[st.id] = {
          status: existing ? existing.status : 'PRESENT',
          remarks: existing?.remarks || '',
        };
      });
      setAttendanceState(map);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const setStatusForStudent = (studentId: string, status: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const markAllPresent = () => {
    const updated = { ...attendanceState };
    Object.keys(updated).forEach((id) => {
      updated[id] = { ...updated[id], status: 'PRESENT' };
    });
    setAttendanceState(updated);
  };

  const handleSaveAttendance = async () => {
    try {
      setIsSaving(true);
      const list = Object.entries(attendanceState).map(([studentId, data]) => ({
        studentId,
        status: data.status,
        remarks: data.remarks,
      }));

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClassId,
          date,
          attendanceList: list,
        }),
      });

      if (res.ok) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        setToastMessage(`Class attendance for ${formatDate(date)} saved & parents notified! ✅`);
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = Object.values(attendanceState).filter((s) => s.status === 'PRESENT').length;
  const absentCount = Object.values(attendanceState).filter((s) => s.status === 'ABSENT').length;
  const lateCount = Object.values(attendanceState).filter((s) => s.status === 'LATE').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Daily Class Attendance Roster
              </h1>
              <p className="text-xs text-slate-500">
                1-Click student roll-call attendance with automated parent SMS and app notifications.
              </p>
            </div>
          </div>
        </div>

        {canManageAttendance && (
          <div className="flex items-center gap-2">
            <button
              onClick={markAllPresent}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Mark All Present
            </button>
            <button
              onClick={handleSaveAttendance}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving Roster...' : 'Save & Publish Attendance'}</span>
            </button>
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 shadow-sm animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Class & Date Selector Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Select Grade Section
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - Section {c.section} ({c.roomNumber || 'Room'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Live Stat Badges */}
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-800">
            Present: {presentCount}
          </span>
          <span className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-800">
            Absent: {absentCount}
          </span>
          <span className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-800">
            Late: {lateCount}
          </span>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Class Student Roll-Call List</h3>

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Roll No</th>
                <th className="px-4 py-3.5">Student</th>
                <th className="px-4 py-3.5">Admission No</th>
                <th className="px-4 py-3.5">Attendance Status</th>
                <th className="px-4 py-3.5">Teacher Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {students.map((stu) => {
                const cur = attendanceState[stu.id] || { status: 'PRESENT', remarks: '' };

                return (
                  <tr key={stu.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3 font-bold text-slate-900">#{stu.rollNo}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={stu.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${stu.firstName}`}
                          alt="avatar"
                          className="h-8 w-8 rounded-lg object-cover"
                        />
                        <span className="font-bold text-slate-900">
                          {stu.firstName} {stu.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-500">{stu.admissionNo}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setStatusForStudent(stu.id, st)}
                            className={cn(
                              'rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase transition',
                              cur.status === st
                                ? st === 'PRESENT'
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : st === 'ABSENT'
                                  ? 'bg-rose-600 text-white shadow-sm'
                                  : 'bg-amber-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            )}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Optional remarks..."
                        value={cur.remarks}
                        onChange={(e) =>
                          setAttendanceState((prev) => ({
                            ...prev,
                            [stu.id]: { ...prev[stu.id], remarks: e.target.value },
                          }))
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
