import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const applications = await prisma.admissionApplication.findMany({
      orderBy: { appliedDate: 'desc' },
    });
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching admissions:', error);
    return NextResponse.json({ error: 'Failed to fetch admission applications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const count = await prisma.admissionApplication.count();
    const applicationNo = `APP-2026-${(count + 101).toString()}`;

    const application = await prisma.admissionApplication.create({
      data: {
        applicationNo,
        applicantName: body.applicantName,
        targetGrade: body.targetGrade,
        guardianName: body.guardianName,
        guardianPhone: body.guardianPhone,
        guardianEmail: body.guardianEmail,
        previousSchool: body.previousSchool || null,
        status: body.status || 'SUBMITTED',
        testScore: body.testScore ? parseFloat(body.testScore) : null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating admission application:', error);
    return NextResponse.json({ error: 'Failed to create admission application' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, testScore, notes } = body;

    const updated = await prisma.admissionApplication.update({
      where: { id },
      data: {
        status: status || undefined,
        testScore: testScore !== undefined ? parseFloat(testScore) : undefined,
        notes: notes !== undefined ? notes : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating admission application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
