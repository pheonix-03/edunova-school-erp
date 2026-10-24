'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  GraduationCap,
  UserPlus,
  Clock,
  CreditCard,
  Award,
  Smartphone,
  ArrowRight,
  X,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { title: 'Student Database & 360° Records', href: '/students', icon: GraduationCap, category: 'Academic Vault' },
    { title: 'Admission & Enrollment CRM', href: '/admissions', icon: UserPlus, category: 'Admissions' },
    { title: 'Class & Daily Attendance', href: '/attendance', icon: Clock, category: 'Attendance' },
    { title: 'Fees & Accounts Management', href: '/fees', icon: CreditCard, category: 'Finance & Receipts' },
    { title: 'Examinations & Report Cards', href: '/examinations', icon: Award, category: 'Academics & Marks' },
    { title: 'Mobile App / Parent Portal', href: '/parent-portal', icon: Smartphone, category: 'Parent Portal' },
  ];

  const filtered = quickActions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
        {/* Search Bar */}
        <div className="relative flex items-center border-b border-slate-100 pb-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Type to search students, fees, exams, or navigate..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent px-3 py-1 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="mt-3 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No matching modules or actions found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  onClick={() => handleSelect(item.href)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left hover:bg-blue-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-900">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400">{item.category}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 px-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-600">↑</kbd>
            <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-600">↓</kbd>
            <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-600">Enter</kbd>
          </div>
          <div>
            <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-600">Esc</kbd> to close
          </div>
        </div>
      </div>
    </div>
  );
}
