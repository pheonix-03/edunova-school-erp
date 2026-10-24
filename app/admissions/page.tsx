'use client';

import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileCheck,
  Award,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  Building,
  Plus,
  X,
} from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function AdmissionsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    applicantName: '',
    targetGrade: 'Grade 10',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    previousSchool: '',
    notes: '',
  });

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admissions');
      const data = await res.json();
      setApplications(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        if (newStatus === 'APPROVED') {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
          setToastMessage('Application Approved! Student ready for enrollment.');
        } else {
          setToastMessage(`Status updated to ${newStatus.replace(/_/g, ' ')}`);
        }
        setTimeout(() => setToastMessage(null), 3500);
        fetchAdmissions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowInquiryModal(false);
        setToastMessage('New admission inquiry logged successfully! 📝');
        setTimeout(() => setToastMessage(null), 3500);
        fetchAdmissions();
        setFormData({
          applicantName: '',
          targetGrade: 'Grade 10',
          guardianName: '',
          guardianPhone: '',
          guardianEmail: '',
          previousSchool: '',
          notes: '',
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = applications.filter((app) =>
    statusFilter === 'ALL' ? true : app.status === statusFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Admission & Enrollment CRM
              </h1>
              <p className="text-xs text-slate-500">
                Manage candidate inquiries, entrance test evaluations, and document verifications.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowInquiryModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Admission Inquiry</span>
        </button>
      </div>

      {toastMessage && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 shadow-sm animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Pipeline Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Inquiries', count: applications.length, color: 'text-slate-900', bg: 'bg-white' },
          { label: 'Entrance Assessment', count: applications.filter((a) => a.status === 'ENTRANCE_TEST').length, color: 'text-amber-600', bg: 'bg-amber-50/40' },
          { label: 'Docs Verified', count: applications.filter((a) => a.status === 'DOCS_VERIFIED').length, color: 'text-blue-600', bg: 'bg-blue-50/40' },
          { label: 'Approved / Ready', count: applications.filter((a) => a.status === 'APPROVED').length, color: 'text-emerald-600', bg: 'bg-emerald-50/40' },
        ].map((item) => (
          <div key={item.label} className={cn('rounded-2xl border border-slate-200 p-4 shadow-sm', item.bg)}>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">{item.label}</span>
            <p className={cn('text-2xl font-black mt-1', item.color)}>{item.count}</p>
          </div>
        ))}
      </div>

      {/* Applications Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <h3 className="text-base font-bold text-slate-900">Admissions Pipeline Roster</h3>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'SUBMITTED', 'ENTRANCE_TEST', 'DOCS_VERIFIED', 'APPROVED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-semibold transition shrink-0',
                  statusFilter === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {st === 'ALL' ? 'All Applicants' : st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">App No</th>
                <th className="px-4 py-3.5">Candidate Name</th>
                <th className="px-4 py-3.5">Target Grade</th>
                <th className="px-4 py-3.5">Guardian Contact</th>
                <th className="px-4 py-3.5">Assessment Score</th>
                <th className="px-4 py-3.5">Stage</th>
                <th className="px-5 py-3.5 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3 font-mono font-bold text-blue-600">{app.applicationNo}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{app.applicantName}</p>
                    <p className="text-[10px] text-slate-400">Prev: {app.previousSchool || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{app.targetGrade}</td>
                  <td className="px-4 py-3">
                    <p className="text-slate-800 font-semibold">{app.guardianName}</p>
                    <p className="text-[10px] text-slate-400">{app.guardianPhone}</p>
                  </td>
                  <td className="px-4 py-3">
                    {app.testScore ? (
                      <span className="font-bold text-emerald-600">{app.testScore}% (Cleared)</span>
                    ) : (
                      <span className="text-slate-400">Pending Test</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase',
                        app.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'DOCS_VERIFIED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right space-x-1.5">
                    {app.status === 'SUBMITTED' && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'ENTRANCE_TEST')}
                        className="rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 hover:bg-amber-100"
                      >
                        Schedule Test
                      </button>
                    )}
                    {app.status === 'ENTRANCE_TEST' && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'DOCS_VERIFIED')}
                        className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100"
                      >
                        Verify Docs
                      </button>
                    )}
                    {app.status === 'DOCS_VERIFIED' && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-emerald-700"
                      >
                        Approve Enrollment
                      </button>
                    )}
                    {app.status === 'APPROVED' && (
                      <span className="text-[11px] font-bold text-emerald-600">
                        Ready for Admission
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">New Admission Application</h2>
                  <p className="text-xs text-slate-500">Record inquiry for academic session 2026-2027.</p>
                </div>
              </div>
              <button
                onClick={() => setShowInquiryModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInquiry} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Applicant Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    placeholder="e.g. Aniket Roy"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Target Grade *</label>
                  <select
                    value={formData.targetGrade}
                    onChange={(e) => setFormData({ ...formData, targetGrade: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 7">Grade 7</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="e.g. Alok Roy"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Guardian Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    placeholder="+91 98000 11223"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Previous School Attended</label>
                <input
                  type="text"
                  value={formData.previousSchool}
                  onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                  placeholder="e.g. Ryan International Academy"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Log Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
