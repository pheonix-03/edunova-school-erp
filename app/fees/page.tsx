'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Download,
  Plus,
  CheckCircle2,
  DollarSign,
  Building,
  TrendingUp,
  FileText,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import confetti from 'canvas-confetti';

export default function FeesAccountsPage() {
  const { role, hasPermission } = useAuth();
  const canManageFees = hasPermission('MANAGE_FEES');

  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [payAmount, setPayAmount] = useState<string>('');
  const [payMethod, setPayMethod] = useState<string>('ONLINE_UPI');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fees');
      const data = await res.json();
      setInvoices(data.invoices || []);
      setPayments(data.payments || []);
      setFeeStructures(data.feeStructures || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      const res = await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: selectedInvoice.id,
          amount: payAmount,
          paymentMethod: payMethod,
        }),
      });

      if (res.ok) {
        setShowCollectModal(false);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        setToastMessage(`Payment of ${formatCurrency(parseFloat(payAmount))} recorded successfully! 🧾`);
        setTimeout(() => setToastMessage(null), 3500);
        fetchFees();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const downloadReceiptPdf = (pay: any) => {
    const doc = new jsPDF() as any;

    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138);
    doc.text("ST. XAVIER'S INTERNATIONAL SCHOOL", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Accounts & Fee Bursary Office • Bengaluru, Karnataka', 105, 26, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`OFFICIAL FEE PAYMENT RECEIPT`, 105, 36, { align: 'center' });

    doc.autoTable({
      startY: 42,
      head: [['Receipt & Student Details', 'Payment Transaction Info']],
      body: [
        [
          `Receipt No: ${pay.receiptNo}\nStudent: ${pay.student.firstName} ${pay.student.lastName}\nAdmission No: ${pay.student.admissionNo}\nClass: ${pay.student.gradeClass?.name} - ${pay.student.gradeClass?.section}`,
          `Date: ${formatDate(pay.paymentDate)}\nPayment Mode: ${pay.paymentMethod}\nRef Code: ${pay.transactionRef || 'N/A'}\nStatus: PAYMENT REALIZED`,
        ],
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138] },
    });

    doc.autoTable({
      startY: (doc as any).lastAutoTable.finalY + 8,
      head: [['Fee Particulars / Heads', 'Amount Paid (INR)']],
      body: [
        ['Tuition & Smart Learning Fee', '₹45,000'],
        ['Science & Computer Lab Fee', '₹6,000'],
        ['Transport & Commuter Facility', '₹12,000'],
        ['Library & Sports Subscription', '₹2,000'],
        ['Total Amount Paid', formatCurrency(pay.amount)],
      ],
      theme: 'striped',
      headStyles: { fillColor: [30, 58, 138] },
    });

    doc.autoTable({
      startY: (doc as any).lastAutoTable.finalY + 8,
      body: [
        [`Received with thanks the sum of ${formatCurrency(pay.amount)}. This is a computer-generated institutional receipt.`],
      ],
      theme: 'plain',
      styles: {
        fontStyle: 'bold',
        fontSize: 10,
        textColor: [16, 185, 129],
        halign: 'center',
      },
    });

    doc.save(`FeeReceipt_${pay.receiptNo}_${pay.student.admissionNo}.pdf`);
  };

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalDue = invoices.reduce((acc, i) => acc + (i.amountDue - i.amountPaid), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Fees & Accounts Management
              </h1>
              <p className="text-xs text-slate-500">
                Fee invoices, installment collections, payment ledgers, and official PDF receipts.
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

      {/* Finance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Fees Realized</span>
          <p className="text-3xl font-black text-emerald-600 mt-2">{formatCurrency(totalCollected)}</p>
          <p className="text-xs text-slate-500 mt-1">Deposited to School Bank Account</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Outstanding Dues</span>
          <p className="text-3xl font-black text-rose-600 mt-2">{formatCurrency(totalDue)}</p>
          <p className="text-xs text-slate-500 mt-1">Pending student installments</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Standard Term 1 Fee (Gr 10)</span>
          <p className="text-3xl font-black text-slate-900 mt-2">₹65,000</p>
          <p className="text-xs text-slate-500 mt-1">Tuition, Lab, Transport & Library</p>
        </div>
      </div>

      {/* Fee Invoices Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Student Fee Invoices</h3>

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Invoice No</th>
                <th className="px-4 py-3.5">Student</th>
                <th className="px-4 py-3.5">Class</th>
                <th className="px-4 py-3.5">Fee Title</th>
                <th className="px-4 py-3.5">Amount Due</th>
                <th className="px-4 py-3.5">Amount Paid</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3 font-mono font-bold text-blue-600">{inv.invoiceNo}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">
                      {inv.student.firstName} {inv.student.lastName}
                    </p>
                    <p className="text-[10px] text-slate-400">{inv.student.admissionNo}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">
                    {inv.student.gradeClass?.name} - {inv.student.gradeClass?.section}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{inv.title}</td>
                  <td className="px-4 py-3 font-bold">{formatCurrency(inv.amountDue)}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">{formatCurrency(inv.amountPaid)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase',
                        inv.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {inv.status !== 'PAID' && canManageFees ? (
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setPayAmount((inv.amountDue - inv.amountPaid).toString());
                          setShowCollectModal(true);
                        }}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                      >
                        Collect Fee
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-600">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Receipts Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Realized Payments & Issued Receipts</h3>

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Receipt No</th>
                <th className="px-4 py-3.5">Student</th>
                <th className="px-4 py-3.5">Payment Date</th>
                <th className="px-4 py-3.5">Method</th>
                <th className="px-4 py-3.5">Amount Realized</th>
                <th className="px-5 py-3.5 text-right">PDF Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3 font-mono font-bold text-emerald-700">{p.receiptNo}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {p.student.firstName} {p.student.lastName} ({p.student.admissionNo})
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(p.paymentDate)}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{p.paymentMethod}</td>
                  <td className="px-4 py-3 font-black text-emerald-600">{formatCurrency(p.amount)}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => downloadReceiptPdf(p)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {showCollectModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Collect Student Fee</h2>
                  <p className="text-xs text-slate-500">{selectedInvoice.student.firstName} ({selectedInvoice.invoiceNo})</p>
                </div>
              </div>
              <button onClick={() => setShowCollectModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCollectPayment} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Payment Amount (INR) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Payment Mode</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-none"
                >
                  <option value="ONLINE_UPI">Online UPI (GooglePay / PhonePe / Paytm)</option>
                  <option value="NET_BANKING">Net Banking / NEFT / IMPS</option>
                  <option value="CASH">Cash Counter Receipt</option>
                  <option value="CHEQUE">Bank Demand Draft / Cheque</option>
                </select>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
