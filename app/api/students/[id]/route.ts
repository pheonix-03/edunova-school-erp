import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        gradeClass: {
          include: { classTeacher: true },
        },
        parent: true,
        attendances: {
          orderBy: { date: 'desc' },
          take: 45,
        },
        feeInvoices: {
          include: { payments: true },
          orderBy: { createdAt: 'desc' },
        },
        feePayments: {
          orderBy: { paymentDate: 'desc' },
        },
        examResults: {
          include: {
            subject: true,
            exam: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student record not found' }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error fetching student 360 profile:', error);
    return NextResponse.json({ error: 'Failed to fetch student profile' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await prisma.student.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}
