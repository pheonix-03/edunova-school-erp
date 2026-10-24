import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId') || undefined;
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const studentId = searchParams.get('studentId') || undefined;

    const records = await prisma.studentAttendance.findMany({
      where: {
        AND: [
          classId ? { classId } : {},
          date ? { date } : {},
          studentId ? { studentId } : {},
        ],
      },
      include: {
        student: true,
        gradeClass: true,
      },
      orderBy: { student: { rollNo: 'asc' } },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { classId, date, attendanceList } = body;
    // attendanceList: [{ studentId, status, remarks }]

    const results = [];
    for (const item of attendanceList) {
      const record = await prisma.studentAttendance.upsert({
        where: {
          studentId_date: {
            studentId: item.studentId,
            date: date || new Date().toISOString().split('T')[0],
          },
        },
        update: {
          status: item.status,
          remarks: item.remarks || null,
        },
        create: {
          studentId: item.studentId,
          classId: classId,
          date: date || new Date().toISOString().split('T')[0],
          status: item.status || 'PRESENT',
          remarks: item.remarks || null,
        },
      });
      results.push(record);
    }

    return NextResponse.json({ success: true, count: results.length, records: results });
  } catch (error) {
    console.error('Error saving class attendance:', error);
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 });
  }
}
