'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Search,
  UserPlus,
  Filter,
  Building,
  Mail,
  Phone,
  ArrowRight,
  Download,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle,
  Clock,
  Sparkles,
  X,
  User,
} from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import confetti from 'canvas-confetti';

export default function StudentsPage() {
  const { hasPermission } = useAuth();
  const canManageStudents = hasPermission('MANAGE_STUDENTS');

  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    classId: '',
    rollNo: '1',
    dateOfBirth: '2010-06-15',
    gender: 'Male',
    bloodGroup: 'O+',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    address: 'Bengaluru',
  });

  useEffect(() => {
    fetchData();
  }, [search, selectedClass]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedClass) params.append('classId', selectedClass);

      const [stuRes, clsRes] = await Promise.all([
        fetch(`/api/students?${params.toString()}`),
        fetch('/api/classes'),
      ]);

      const stuData = await stuRes.json();
      const clsData = await clsRes.json();

      setStudents(stuData || []);
      setClasses(clsData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowAddModal(false);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Student Database & 360° Records
              </h1>
              <p className="text-xs text-slate-500">
                Academic roster, admission credentials, guardian details, and fee ledgers.
              </p>
            </div>
          </div>
        </div>

        {canManageStudents && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition active:scale-95"
          >
            <UserPlus className="h-4 w-4" />
            <span>Enroll New Student</span>
          </button>
        )}
      </div>

      {/* Filter and View Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name or Admission No..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Grade Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - Section {c.section}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">
            {students.length} Students Listed
          </span>
          <div className="flex rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'rounded p-1 text-slate-600 transition',
                viewMode === 'grid' && 'bg-white shadow-sm text-blue-600'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'rounded p-1 text-slate-600 transition',
                viewMode === 'table' && 'bg-white shadow-sm text-blue-600'
              )}
            >
              <TableIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((stu) => (
            <div
              key={stu.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <img
                    src={
                      stu.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${stu.firstName}`
                    }
                    alt={stu.firstName}
                    className="h-14 w-14 rounded-2xl object-cover ring-2 ring-blue-50 shadow-sm"
                  />
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100">
                    {stu.admissionNo}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition">
                      {stu.firstName} {stu.lastName}
                    </h3>
                    <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold text-slate-600">
                      Roll #{stu.rollNo}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">
                    {stu.gradeClass?.name} • Section {stu.gradeClass?.section}
                  </p>
                </div>

                <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Guardian:</span>
                    <span className="font-semibold text-slate-800">
                      {stu.parent?.fatherName || stu.parent?.motherName || 'Verified Guardian'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Contact:</span>
                    <span className="font-semibold text-slate-800">{stu.parent?.primaryPhone || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Blood Group:</span>
                    <span className="rounded bg-rose-50 px-1.5 py-0.2 text-[10px] font-bold text-rose-700">
                      {stu.bloodGroup || 'O+'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">
                  ● Enrolled & Active
                </span>
                <Link
                  href={`/students/${stu.id}`}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  360° Profile <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-4 py-3.5">Admission No</th>
                <th className="px-4 py-3.5">Class / Section</th>
                <th className="px-4 py-3.5">Roll No</th>
                <th className="px-4 py-3.5">Parent / Guardian</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {students.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={stu.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${stu.firstName}`}
                        alt="avatar"
                        className="h-8 w-8 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-900">
                          {stu.firstName} {stu.lastName}
                        </p>
                        <p className="text-[11px] text-slate-400">DOB: {formatDate(stu.dateOfBirth)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900">{stu.admissionNo}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600">
                    {stu.gradeClass?.name} - {stu.gradeClass?.section}
                  </td>
                  <td className="px-4 py-3 font-bold">{stu.rollNo}</td>
                  <td className="px-4 py-3">{stu.parent?.fatherName || 'Parent'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Enrolled
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/students/${stu.id}`}
                      className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-100 transition"
                    >
                      View 360° Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Student Enrollment Modal */}
      {showAddModal && canManageStudents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Enroll New Student</h2>
                  <p className="text-xs text-slate-500">
                    Add new student to academic class, fee billing, and parent records.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-semibold text-slate-700">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Varun"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Nair"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-semibold text-slate-700">Assign Grade Class *</label>
                  <select
                    required
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Class & Section</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - Section {c.section}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Roll Number</label>
                  <input
                    type="number"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-none"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-semibold text-slate-700">Guardian / Father Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Suresh Nair"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Guardian Primary Contact *</label>
                  <input
                    type="text"
                    required
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-semibold text-slate-700">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Confirm Student Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
