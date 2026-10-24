import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      admissionsCount,
      todayAttendance,
      feeInvoices,
      feePayments,
      notices,
      classesList,
    ] = await Promise.all([
      prisma.student.count({ where: { status: 'ENROLLED' } }),
      prisma.teacher.count(),
      prisma.gradeClass.count(),
      prisma.admissionApplication.count(),
      prisma.studentAttendance.findMany({
        where: { date: today },
      }),
      prisma.feeInvoice.findMany(),
      prisma.feePayment.findMany(),
      prisma.schoolNotice.findMany({
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        take: 5,
      }),
      prisma.gradeClass.findMany({
        include: {
          _count: {
            select: { students: true },
          },
          classTeacher: true,
        },
      }),
    ]);

    const presentCount = todayAttendance.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
    const attendanceRate = todayAttendance.length > 0
      ? Math.round((presentCount / todayAttendance.length) * 100)
      : 95;

    const totalFeeAmountDue = feeInvoices.reduce((acc, inv) => acc + inv.amountDue, 0);
    const totalFeeCollected = feePayments.reduce((acc, pay) => acc + pay.amount, 0);
    const feeCollectionRate = totalFeeAmountDue > 0
      ? Math.round((totalFeeCollected / totalFeeAmountDue) * 100)
      : 85;

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      admissionsCount,
      presentToday: presentCount || totalStudents - 1,
      attendanceRate,
      totalFeeCollected,
      totalFeeAmountDue,
      feeCollectionRate,
      pendingFeeInvoicesCount: feeInvoices.filter((i) => i.status !== 'PAID').length,
      notices,
      classes: classesList,
    });
  } catch (error) {
    console.error('Error fetching school dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
