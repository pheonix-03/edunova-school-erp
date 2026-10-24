import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const classId = searchParams.get('classId') || undefined;
    const status = searchParams.get('status') || undefined;

    const students = await prisma.student.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { firstName: { contains: search } },
                  { lastName: { contains: search } },
                  { admissionNo: { contains: search } },
                ],
              }
            : {},
          classId ? { classId } : {},
          status ? { status } : {},
        ],
      },
      include: {
        gradeClass: {
          include: { classTeacher: true },
        },
        parent: true,
        attendances: {
          take: 30,
          orderBy: { date: 'desc' },
        },
        feeInvoices: true,
        examResults: {
          include: { subject: true },
        },
      },
      orderBy: [{ classId: 'asc' }, { rollNo: 'asc' }],
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Auto-generate admission number if missing
    let admissionNo = data.admissionNo;
    if (!admissionNo) {
      const count = await prisma.student.count();
      admissionNo = `ADM-2026-${(count + 101).toString()}`;
    }

    // Create or link parent
    let parentId = data.parentId;
    if (!parentId && (data.fatherName || data.guardianName)) {
      const parent = await prisma.parent.create({
        data: {
          fatherName: data.fatherName || data.guardianName || 'Guardian',
          motherName: data.motherName || 'Guardian',
          primaryPhone: data.primaryPhone || data.guardianPhone || '+91 98000 00000',
          email: data.guardianEmail || null,
          address: data.address || null,
        },
      });
      parentId = parent.id;
    }

    const student = await prisma.student.create({
      data: {
        admissionNo,
        rollNo: parseInt(data.rollNo) || 1,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth || '2010-01-01',
        gender: data.gender || 'Male',
        bloodGroup: data.bloodGroup || 'O+',
        address: data.address || null,
        emergencyContact: data.emergencyContact || data.primaryPhone || null,
        classId: data.classId,
        parentId: parentId || null,
        status: 'ENROLLED',
        enrollmentDate: data.enrollmentDate || new Date().toISOString().split('T')[0],
        avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.firstName)}`,
      },
      include: {
        gradeClass: true,
        parent: true,
      },
    });

    // Create initial term fee invoice
    await prisma.feeInvoice.create({
      data: {
        invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        studentId: student.id,
        title: 'Term 1 Admission, Tuition & Activity Fee',
        amountDue: 65000,
        amountPaid: 0,
        dueDate: '2026-06-30',
        status: 'UNPAID',
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
