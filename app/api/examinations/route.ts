import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('examId') || undefined;
    const studentId = searchParams.get('studentId') || undefined;
    const classId = searchParams.get('classId') || undefined;

    const [exams, results, subjects] = await Promise.all([
      prisma.exam.findMany({
        orderBy: { startDate: 'desc' },
      }),
      prisma.examResult.findMany({
        where: {
          AND: [
            examId ? { examId } : {},
            studentId ? { studentId } : {},
            classId ? { student: { classId } } : {},
          ],
        },
        include: {
          student: {
            include: { gradeClass: true, parent: true },
          },
          subject: true,
          exam: true,
        },
        orderBy: [{ student: { rollNo: 'asc' } }, { subject: { code: 'asc' } }],
      }),
      prisma.subject.findMany(),
    ]);

    return NextResponse.json({ exams, results, subjects });
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({ error: 'Failed to fetch examination data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { examId, studentId, subjectId, marksObtained, maxMarks, remarks } = body;

    const marks = parseFloat(marksObtained);
    const max = parseFloat(maxMarks) || 100;
    const percentage = (marks / max) * 100;

    let grade = 'E';
    if (percentage >= 91) grade = 'A1';
    else if (percentage >= 81) grade = 'A2';
    else if (percentage >= 71) grade = 'B1';
    else if (percentage >= 61) grade = 'B2';
    else if (percentage >= 51) grade = 'C1';
    else if (percentage >= 41) grade = 'C2';
    else if (percentage >= 33) grade = 'D';

    const result = await prisma.examResult.upsert({
      where: {
        examId_studentId_subjectId: {
          examId,
          studentId,
          subjectId,
        },
      },
      update: {
        marksObtained: marks,
        maxMarks: max,
        grade,
        remarks: remarks || null,
      },
      create: {
        examId,
        studentId,
        subjectId,
        marksObtained: marks,
        maxMarks: max,
        grade,
        remarks: remarks || null,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error saving exam marks:', error);
    return NextResponse.json({ error: 'Failed to save exam marks' }, { status: 500 });
  }
}
