import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId') || undefined;
    const status = searchParams.get('status') || undefined;

    const [invoices, payments, feeStructures] = await Promise.all([
      prisma.feeInvoice.findMany({
        where: {
          AND: [
            studentId ? { studentId } : {},
            status ? { status } : {},
          ],
        },
        include: {
          student: {
            include: {
              gradeClass: true,
              parent: true,
            },
          },
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.feePayment.findMany({
        where: studentId ? { studentId } : undefined,
        include: {
          student: {
            include: { gradeClass: true, parent: true },
          },
          invoice: true,
        },
        orderBy: { paymentDate: 'desc' },
      }),
      prisma.feeStructure.findMany({
        include: { gradeClass: true },
      }),
    ]);

    return NextResponse.json({ invoices, payments, feeStructures });
  } catch (error) {
    console.error('Error fetching fees:', error);
    return NextResponse.json({ error: 'Failed to fetch fee details' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invoiceId, amount, paymentMethod, transactionRef } = body;

    const invoice = await prisma.feeInvoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const payAmount = parseFloat(amount);
    const newPaid = invoice.amountPaid + payAmount;
    const newStatus = newPaid >= invoice.amountDue ? 'PAID' : 'PARTIAL';

    const count = await prisma.feePayment.count();
    const receiptNo = `RCPT-2026-${(count + 8801).toString()}`;

    const [payment, updatedInvoice] = await prisma.$transaction([
      prisma.feePayment.create({
        data: {
          receiptNo,
          invoiceId: invoice.id,
          studentId: invoice.studentId,
          amount: payAmount,
          paymentMethod: paymentMethod || 'ONLINE_UPI',
          transactionRef: transactionRef || `TXN-${Date.now().toString().slice(-8)}`,
        },
      }),
      prisma.feeInvoice.update({
        where: { id: invoice.id },
        data: {
          amountPaid: newPaid,
          status: newStatus,
        },
      }),
    ]);

    return NextResponse.json({ success: true, payment, invoice: updatedInvoice }, { status: 201 });
  } catch (error) {
    console.error('Error processing fee payment:', error);
    return NextResponse.json({ error: 'Failed to record fee payment' }, { status: 500 });
  }
}
