'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Building2,
  ArrowRight,
  KeyRound,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; message: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage({
        title: 'Email Required',
        message: 'Please enter your institutional email address.',
      });
      return;
    }

    if (!password) {
      setErrorMessage({
        title: 'Password Required',
        message: 'Please enter your account password.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(email, password);

      if (res.success) {
        setSuccessMessage(res.message || 'Authentication successful! Accessing school portal...');
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });
        setTimeout(() => {
          router.push(redirectUrl);
        }, 800);
      } else {
        setErrorMessage({
          title: res.error || 'Authentication Failed',
          message: res.message || 'Invalid credentials. Please check your institutional email and password.',
        });
      }
    } catch (err: any) {
      setErrorMessage({
        title: 'Connection Error',
        message: 'Unable to reach the school authentication service.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillCredentials = (userEmail: string, pass: string) => {
    setEmail(userEmail);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Left Column: Form & Login */}
      <div className="flex w-full flex-col justify-between p-8 sm:p-12 lg:w-1/2 lg:p-16">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white">
              Edu<span className="text-blue-500">Nova</span>
            </span>
            <p className="text-[11px] font-medium text-slate-400">School ERP & SIS Suite</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="my-auto w-full max-w-md mx-auto py-8">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sign in to School Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Access student database, fees, attendance, exam gradebooks, and parent services.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-rose-200">{errorMessage.title}</p>
                <p className="mt-0.5 text-rose-300/90 leading-relaxed">{errorMessage.message}</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300 animate-in fade-in">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <p className="text-xs font-bold text-emerald-200">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Institutional Email
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@edunova.edu"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-10 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-blue-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-10 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition active:scale-[0.98]',
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-500 hover:to-indigo-500'
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to School ERP</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Account Test Matrix */}
          <div className="mt-8 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-bold mb-2">
              <KeyRound className="h-3.5 w-3.5 text-blue-400" />
              <span>Institutional Accounts (Click to Autofill):</span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div
                onClick={() => fillCredentials('principal@edunova.edu', 'Principal@1234')}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-blue-950/40 border border-slate-800 cursor-pointer transition"
              >
                <div>
                  <span className="text-blue-400 font-bold">PRINCIPAL:</span>{' '}
                  <span className="text-slate-300">principal@edunova.edu</span>
                </div>
                <span className="text-slate-400">Pass: Principal@1234</span>
              </div>

              <div
                onClick={() => fillCredentials('accounts@edunova.edu', 'Accounts@1234')}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-blue-950/40 border border-slate-800 cursor-pointer transition"
              >
                <div>
                  <span className="text-emerald-400 font-bold">ACCOUNTANT:</span>{' '}
                  <span className="text-slate-300">accounts@edunova.edu</span>
                </div>
                <span className="text-slate-400">Pass: Accounts@1234</span>
              </div>

              <div
                onClick={() => fillCredentials('teacher.vikram@edunova.edu', 'Teacher@1234')}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-blue-950/40 border border-slate-800 cursor-pointer transition"
              >
                <div>
                  <span className="text-amber-400 font-bold">TEACHER:</span>{' '}
                  <span className="text-slate-300">teacher.vikram@edunova.edu</span>
                </div>
                <span className="text-slate-400">Pass: Teacher@1234</span>
              </div>

              <div
                onClick={() => fillCredentials('parent.anita@edunova.edu', 'Parent@1234')}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-blue-950/40 border border-slate-800 cursor-pointer transition"
              >
                <div>
                  <span className="text-purple-400 font-bold">PARENT:</span>{' '}
                  <span className="text-slate-300">parent.anita@edunova.edu</span>
                </div>
                <span className="text-slate-400">Pass: Parent@1234</span>
              </div>

              <div
                onClick={() => fillCredentials('student.aarav@edunova.edu', 'Student@1234')}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-blue-950/40 border border-slate-800 cursor-pointer transition"
              >
                <div>
                  <span className="text-cyan-400 font-bold">STUDENT:</span>{' '}
                  <span className="text-slate-300">student.aarav@edunova.edu</span>
                </div>
                <span className="text-slate-400">Pass: Student@1234</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-6 border-t border-slate-900">
          <span>© 2026 EduNova School ERP & SIS.</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="h-4 w-4" /> CBSE / ICSE / IB Compliant
          </span>
        </div>
      </div>

      {/* Right Column: Hero Visual */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 p-16 relative overflow-hidden border-l border-slate-800">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-400 border border-blue-500/20 backdrop-blur-md">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Complete Academic & Administrative ERP</span>
          </div>

          <h2 className="mt-6 text-3xl xl:text-4xl font-black text-white leading-tight">
            Integrated Student Information System (SIS) & School Management.
          </h2>

          <p className="mt-3 text-sm text-blue-100/70 max-w-lg leading-relaxed">
            Manage student databases 360°, digital admissions pipeline, 1-click class attendance, automated fee receipts with payment tracking, exam report cards, and parent mobile companion app.
          </p>
        </div>

        {/* Floating Feature Preview */}
        <div className="relative z-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold text-white">Live Institutional Snapshot</span>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              Session 2026-27 Active
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <span className="text-slate-200">Grade 10-A Attendance Today</span>
              <span className="text-emerald-400 font-bold">96% Present</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <span className="text-slate-200">Term 1 Fee Realization</span>
              <span className="text-blue-400 font-bold">₹3,25,000 Collected</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-blue-200/60">
          <span>CBSE / ICSE / Cambridge Ready</span>
          <span>Automated PDF Report Cards & Receipts</span>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs">Loading School Portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}
