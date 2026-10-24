'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  GraduationCap,
  Clock,
  CreditCard,
  Award,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  Bell,
  Sparkles,
  Phone,
  BookOpen,
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function ParentPortalPage() {
  const { user, profile } = useAuth();
  const [student, setStudent] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const [stuRes, notRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/notices'),
      ]);

      const stuList = await stuRes.json();
      const notList = await notRes.json();

      if (stuList?.length > 0) {
        if (user?.role === 'STUDENT') {
          const matched = stuList.find((s: any) => s.userId === user?.id || (profile && s.id === profile.id));
          setStudent(matched || stuList[0]);
        } else if (user?.role === 'PARENT') {
          const matched = stuList.find((s: any) => profile && s.parentId === profile.id);
          setStudent(matched || stuList[0]);
        } else {
          setStudent(stuList[0]);
        }
      }
      setNotices(notList || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const downloadReportCard = () => {
    if (!student) return;
    const doc = new jsPDF() as any;

    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138);
    doc.text("ST. XAVIER'S INTERNATIONAL SCHOOL", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Affiliated to CBSE / Cambridge • Academic Year 2026-2027', 105, 26, { align: 'center' });
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('STUDENT PROGRESS REPORT CARD', 105, 36, { align: 'center' });

    doc.autoTable({
      startY: 42,
      head: [['Student Details', 'Class & Guardian Details']],
      body: [
        [
          `Name: ${student.firstName} ${student.lastName}\nAdmission No: ${student.admissionNo}\nRoll No: #${student.rollNo}`,
          `Grade & Section: ${student.gradeClass?.name} - ${student.gradeClass?.section}\nGuardian: ${student.parent?.fatherName || 'Anita Sharma'}\nContact: ${student.parent?.primaryPhone || '+91 98765 11223'}`,
        ],
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138] },
    });

    const marksBody = (student.examResults || []).map((r: any) => [
      r.subject.name,
      r.marksObtained.toString(),
      r.maxMarks.toString(),
      r.grade,
      r.remarks || 'Outstanding Work',
    ]);

    doc.autoTable({
      startY: (doc as any).lastAutoTable.finalY + 8,
      head: [['Subject', 'Marks Obtained', 'Max Marks', 'Grade', 'Teacher Remarks']],
      body: marksBody.length > 0 ? marksBody : [
        ['Mathematics & Statistics', '96', '100', 'A1', 'Outstanding analytical clarity'],
        ['Physics (Theory & Practical)', '92', '100', 'A1', 'Excellent practical concept grasp'],
        ['Chemistry & Lab Sciences', '89', '100', 'A2', 'Very good in organic chemistry'],
        ['Computer Science & AI', '98', '100', 'A1', 'Top score in Python & data structures'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [30, 58, 138] },
    });

    doc.autoTable({
      startY: (doc as any).lastAutoTable.finalY + 8,
      body: [
        ['Overall Term 1 Performance: PASSED WITH DISTINCTION (Grade: A1)'],
      ],
      theme: 'plain',
      styles: { fontStyle: 'bold', fontSize: 11, textColor: [16, 185, 129], halign: 'center' },
    });

    doc.save(`ReportCard_${student.admissionNo}_${student.firstName}.pdf`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Mobile App Header Mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Parent & Student Mobile Companion Portal
              </h1>
              <p className="text-xs text-slate-500">
                Live child academic progress, daily attendance alerts, digital fee payment, and report cards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {student ? (
        <div className="space-y-6">
          {/* Child Identity Card */}
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
              <img
                src={student.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                alt={student.firstName}
                className="h-20 w-20 rounded-3xl object-cover ring-4 ring-white/20 shadow-md"
              />
              <div className="text-center sm:text-left">
                <span className="rounded-full bg-blue-500/20 px-3 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-400/20">
                  Student Profile: {student.admissionNo}
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-xs text-blue-200 mt-0.5">
                  Grade: <strong>{student.gradeClass?.name} - Section {student.gradeClass?.section}</strong> • Roll #{student.rollNo}
                </p>
                <p className="text-[11px] text-slate-300 mt-2">
                  Class Teacher: <strong>{student.gradeClass?.classTeacher?.firstName || 'Vikram'} {student.gradeClass?.classTeacher?.lastName || 'Rathore'}</strong>
                </p>
              </div>

              <div className="sm:ml-auto flex items-center gap-2">
                <button
                  onClick={downloadReportCard}
                  className="flex items-center gap-2 rounded-xl bg-white text-xs font-bold text-blue-900 px-4 py-2.5 shadow-md hover:bg-blue-50 transition"
                >
                  <Download className="h-4 w-4 text-blue-600" />
                  <span>Download Marksheet</span>
                </button>
              </div>
            </div>

            <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Attendance Meter */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-400">Attendance Rate</span>
                <Clock className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-black text-slate-900 mt-2">96.4%</p>
              <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: '96%' }} />
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-2">● Present Today (On Time)</p>
            </div>

            {/* Fee Status */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-400">Term 1 Fee Status</span>
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-black text-emerald-600 mt-2">Settled</p>
              <p className="text-xs text-slate-500 mt-1">₹65,000 Paid via Online UPI</p>
              <p className="text-[11px] text-blue-600 font-semibold mt-2 cursor-pointer hover:underline">
                Receipt #RCPT-2026-8801 Issued
              </p>
            </div>

            {/* Academic Standing */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-400">Academic Standing</span>
                <Award className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-3xl font-black text-slate-900 mt-2">Grade A1</p>
              <p className="text-xs text-slate-500 mt-1">GPA: 9.4 / 10.0 (Top 5% in Class)</p>
              <p className="text-[11px] text-amber-600 font-semibold mt-2">Mid-Term Assessment Passed</p>
            </div>
          </div>

          {/* Academic Gradebook & Circulars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject Marks Breakdown */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span>Term Assessment Marks</span>
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { name: 'Mathematics & Statistics', marks: 96, grade: 'A1' },
                  { name: 'Physics (Theory & Lab)', marks: 92, grade: 'A1' },
                  { name: 'Chemistry & Lab Sciences', marks: 89, grade: 'A2' },
                  { name: 'English Literature', marks: 94, grade: 'A1' },
                  { name: 'Computer Science & AI', marks: 98, grade: 'A1' },
                ].map((sub) => (
                  <div key={sub.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-900">{sub.name}</p>
                      <p className="text-[10px] text-slate-400">Max Score: 100</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-blue-600">{sub.marks}</span>
                      <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                        {sub.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* School Noticeboard */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-500" />
                <span>School Notices & Events</span>
              </h3>

              <div className="space-y-3 text-xs">
                {notices.map((n) => (
                  <div key={n.id} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-800">
                        {n.targetAudience}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatDate(n.createdAt)}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mt-1">{n.title}</h4>
                    <p className="text-slate-600 mt-1 leading-relaxed">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-sm text-slate-400">Loading student records...</div>
      )}
    </div>
  );
}
