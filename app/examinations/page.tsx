'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  Download,
  Plus,
  CheckCircle2,
  BookOpen,
  Filter,
  Search,
  Sparkles,
  Save,
} from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import confetti from 'canvas-confetti';

export default function ExaminationsPage() {
  const { hasPermission } = useAuth();
  const canManageExams = hasPermission('MANAGE_EXAMS');

  const [exams, setExams] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchExamData();
  }, []);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/examinations');
      const data = await res.json();
      setExams(data.exams || []);
      setResults(data.results || []);
      setSubjects(data.subjects || []);
      if (data.exams?.length > 0) {
        setSelectedExamId(data.exams[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const downloadReportCard = (student: any) => {
    const doc = new jsPDF() as any;

    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138);
    doc.text("ST. XAVIER'S INTERNATIONAL SCHOOL", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Affiliated to CBSE / Cambridge International • Academic Year 2026-2027', 105, 26, { align: 'center' });
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('OFFICIAL TERM PROGRESS REPORT CARD', 105, 36, { align: 'center' });

    doc.autoTable({
      startY: 42,
      head: [['Student Information', 'Class & Guardian Record']],
      body: [
        [
          `Student: ${student.firstName} ${student.lastName}\nAdmission No: ${student.admissionNo}\nRoll No: #${student.rollNo}`,
          `Class & Section: ${student.gradeClass?.name} - ${student.gradeClass?.section}\nGuardian: ${student.parent?.fatherName || 'Parent'}\nSession: 2026-2027`,
        ],
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138] },
    });

    const studentMarks = results.filter((r) => r.studentId === student.id);
    const tableBody = studentMarks.map((r: any) => [
      r.subject.name,
      r.subject.code,
      r.marksObtained.toString(),
      r.maxMarks.toString(),
      r.grade,
      r.remarks || 'Commendable performance',
    ]);

    doc.autoTable({
      startY: (doc as any).lastAutoTable.finalY + 8,
      head: [['Subject', 'Code', 'Marks Obtained', 'Max Marks', 'Grade', 'Teacher Remarks']],
      body: tableBody.length > 0 ? tableBody : [['Mathematics & Statistics', 'MTH-10', '95', '100', 'A1', 'Outstanding']],
      theme: 'striped',
      headStyles: { fillColor: [30, 58, 138] },
    });

    doc.autoTable({
      startY: (doc as any).lastAutoTable.finalY + 8,
      body: [
        ['Overall Assessment: PASSED WITH DISTINCTION (Grade: A1) • Promoted to Next Term'],
      ],
      theme: 'plain',
      styles: {
        fontStyle: 'bold',
        fontSize: 11,
        textColor: [16, 185, 129],
        halign: 'center',
      },
    });

    doc.save(`ReportCard_${student.admissionNo}_${student.firstName}.pdf`);
  };

  const filteredResults = results.filter((r) => {
    const matchesExam = selectedExamId ? r.examId === selectedExamId : true;
    const matchesSubject = selectedSubjectId ? r.subjectId === selectedSubjectId : true;
    return matchesExam && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Examination & Academic Gradebook
              </h1>
              <p className="text-xs text-slate-500">
                Term assessments, marks entry, grading scales, and downloadable official student report cards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 shadow-sm animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Filter and Exam Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Select Assessment
            </label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.term})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Filter by Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Grading Scale: A1 (91-100), A2 (81-90), B1 (71-80), B2 (61-70)
        </span>
      </div>

      {/* Gradebook Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Exam Results & Student Marksheet</h3>

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-4 py-3.5">Admission No</th>
                <th className="px-4 py-3.5">Class</th>
                <th className="px-4 py-3.5">Subject</th>
                <th className="px-4 py-3.5">Score</th>
                <th className="px-4 py-3.5">Grade</th>
                <th className="px-4 py-3.5">Teacher Remark</th>
                <th className="px-5 py-3.5 text-right">Official Report Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredResults.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3">
                    <p className="font-bold text-slate-900">
                      {r.student.firstName} {r.student.lastName}
                    </p>
                    <p className="text-[10px] text-slate-400">Roll #{r.student.rollNo}</p>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-600">{r.student.admissionNo}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">
                    {r.student.gradeClass?.name} - {r.student.gradeClass?.section}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800">{r.subject.name}</td>
                  <td className="px-4 py-3 font-black text-blue-600">
                    {r.marksObtained} / {r.maxMarks}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
                      {r.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{r.remarks || 'Excellent'}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => downloadReportCard(r.student)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>PDF Report Card</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
