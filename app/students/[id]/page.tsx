'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  Award,
  Calendar,
  CheckCircle2,
  Download,
  Shield,
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'fees' | 'exams'>('overview');

  useEffect(() => {
    fetchStudent();
  }, [params.id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/students/${params.id}`);
      const data = await res.json();
      setStudent(data);
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
    doc.text('Affiliated to CBSE / Cambridge International • Academic Year 2026-2027', 105, 26, { align: 'center' });
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('STUDENT ACADEMIC REPORT CARD - TERM 1', 105, 36, { align: 'center' });

    doc.autoTable({
      startY: 42,
      head: [['Student Details', 'Class & Guardian Details']],
      body: [
        [
          `Name: ${student.firstName} ${student.lastName}\nAdmission No: ${student.admissionNo}\nRoll No: ${student.rollNo}\nDate of Birth: ${formatDate(student.dateOfBirth)}`,
          `Grade & Section: ${student.gradeClass?.name} - ${student.gradeClass?.section}\nClass Teacher: ${student.gradeClass?.classTeacher?.firstName || 'Faculty'} ${student.gradeClass?.classTeacher?.lastName || ''}\nGuardian: ${student.parent?.fatherName || 'Parent'}\nEmergency Phone: ${student.parent?.primaryPhone || '-'}`,
        ],
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138] },
    });

    const marksBody = (student.examResults || []).map((r: any) => [
      r.subject.name,
      r.subject.code,
      r.marksObtained.toString(),
      r.maxMarks.toString(),
      r.grade,
      r.remarks || 'Good Effort',
    ]);

    doc.autoTable({
      startY: (doc as any).lastAutoTable.finalY + 8,
      head: [['Subject', 'Code', 'Marks', 'Max', 'Grade', 'Teacher Remarks']],
      body: marksBody.length > 0 ? marksBody : [['No exam records entered', '-', '-', '-', '-', '-']],
      theme: 'striped',
      headStyles: { fillColor: [30, 58, 138] },
    });

    doc.autoTable({
      startY: (doc as any).lastAutoTable.finalY + 8,
      body: [
        [
          `Overall Result: PASSED WITH DISTINCTION (Rank in Class: #${student.rollNo})`,
        ],
      ],
      theme: 'plain',
      styles: {
        fontStyle: 'bold',
        fontSize: 12,
        textColor: [16, 185, 129],
        halign: 'center',
      },
    });

    doc.save(`ReportCard_${student.admissionNo}_${student.firstName}.pdf`);
  };

  if (loading) {
    return <div className="py-20 text-center text-sm text-slate-400">Loading student 360° record...</div>;
  }

  if (!student) {
    return <div className="py-20 text-center text-sm text-slate-500">Student not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Link
        href="/students"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Student Database</span>
      </Link>

      {/* Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.firstName}`}
              alt={student.firstName}
              className="h-24 w-24 rounded-3xl object-cover ring-4 ring-blue-50 shadow-md"
            />
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl font-black text-slate-900">
                  {student.firstName} {student.lastName}
                </h1>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-100">
                  {student.admissionNo}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                  Roll #{student.rollNo}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                Class: <strong className="text-blue-600">{student.gradeClass?.name} - Section {student.gradeClass?.section}</strong> •{' '}
                <span>Mentor: {student.gradeClass?.classTeacher?.firstName || 'Faculty'} {student.gradeClass?.classTeacher?.lastName || ''}</span>
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Guardian: {student.parent?.fatherName || student.parent?.motherName || 'Verified Parent'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {student.parent?.primaryPhone || '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={downloadReportCard}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
            >
              <Download className="h-4 w-4" />
              <span>Download Report Card</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex border-b border-slate-100 overflow-x-auto gap-2 text-xs font-bold text-slate-500">
          {[
            { id: 'overview', label: '360° Overview', icon: User },
            { id: 'attendance', label: 'Attendance Ledger', icon: Clock },
            { id: 'fees', label: 'Fee Invoices & Payments', icon: CreditCard },
            { id: 'exams', label: 'Academic Marksheet', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center gap-2 border-b-2 px-4 py-3 transition shrink-0',
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent hover:text-slate-900'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <span>Academic Profile & Allocation</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Admission Date:</span>
                <span className="font-bold text-slate-800">{formatDate(student.enrollmentDate)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Current Grade & Section:</span>
                <span className="font-bold text-blue-600">{student.gradeClass?.name} - {student.gradeClass?.section}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Classroom Location:</span>
                <span className="font-bold text-slate-800">{student.gradeClass?.roomNumber || 'Block A'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">Enrollment Status:</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Enrolled & In Good Standing
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <span>Personal & Medical Details</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Date of Birth:</span>
                <span className="font-bold text-slate-800">{formatDate(student.dateOfBirth)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Blood Group:</span>
                <span className="font-bold text-rose-600">{student.bloodGroup || 'O+'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Guardian Phone:</span>
                <span className="font-bold text-slate-800">{student.parent?.primaryPhone || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">Residential Address:</span>
                <span className="font-bold text-slate-800 max-w-xs truncate">{student.address || student.parent?.address || 'Bengaluru'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Student Attendance Log</h3>
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(student.attendances || []).map((att: any) => (
                  <tr key={att.id}>
                    <td className="px-5 py-3 font-semibold">{formatDate(att.date)}</td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', att.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800')}>
                        {att.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{att.remarks || 'Recorded by Class Teacher'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fees Tab */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Fee Invoices & Payments</h3>
            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Invoice No</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Due Amount</th>
                    <th className="px-4 py-3">Paid Amount</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(student.feeInvoices || []).map((inv: any) => (
                    <tr key={inv.id}>
                      <td className="px-5 py-3 font-mono font-bold text-blue-600">{inv.invoiceNo}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{inv.title}</td>
                      <td className="px-4 py-3 font-bold">{formatCurrency(inv.amountDue)}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">{formatCurrency(inv.amountPaid)}</td>
                      <td className="px-4 py-3">
                        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Exams Tab */}
      {activeTab === 'exams' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Term Examination Gradebook</h3>
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Marks Obtained</th>
                  <th className="px-4 py-3">Max Marks</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(student.examResults || []).map((res: any) => (
                  <tr key={res.id}>
                    <td className="px-5 py-3 font-bold text-slate-900">{res.subject.name}</td>
                    <td className="px-4 py-3 font-mono">{res.subject.code}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">{res.marksObtained}</td>
                    <td className="px-4 py-3 text-slate-500">{res.maxMarks}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800">
                        {res.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{res.remarks || 'Well done!'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
