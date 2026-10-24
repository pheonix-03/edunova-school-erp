import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { AppShell } from '@/components/shell';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EduNova - School ERP & Student Information System (SIS)',
  description: 'Institutional School ERP suite for Student 360°, Admissions, Attendance, Fees with PDF Receipts, and Exam Gradebook with Report Cards.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
