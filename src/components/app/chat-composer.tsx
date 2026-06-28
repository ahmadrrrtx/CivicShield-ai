'use client';

import { useState } from 'react';
import { Globe2, Landmark, Paperclip, SendHorizonal, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export const COUNTRY_OPTIONS = [
  'United States',
  'Pakistan',
  'United Kingdom',
  'Canada',
  'Australia',
  'India'
] as const;

export const NEED_OPTIONS = [
  { value: 'benefits', label: 'Benefits and eligibility', hint: 'public benefits assistance eligibility application' },
  { value: 'housing', label: 'Rent or housing help', hint: 'housing rent eviction shelter assistance' },
  { value: 'food', label: 'Food support', hint: 'SNAP food nutrition groceries benefits' },
  { value: 'utilities', label: 'Utility bills', hint: 'LIHEAP utility electricity heating cooling energy assistance' },
  { value: 'emergency', label: 'Emergency contacts', hint: 'emergency official contacts urgent help public services' },
  { value: 'agency', label: 'Find the right agency', hint: 'official agency department public services portal' }
] as const;

export type NeedOptionValue = (typeof NEED_OPTIONS)[number]['value'];

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  country,
  onCountryChange,
  need,
  onNeedChange
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  country: string;
  onCountryChange: (country: string) => void;
  need: NeedOptionValue;
  onNeedChange: (need: NeedOptionValue) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const selectedNeed = NEED_OPTIONS.find((item) => item.value === need) ?? NEED_OPTIONS[0];
  const supportedCoverage = country === 'United States';

  return (
    <div
      className={cn(
        'rounded-[30px] border bg-white/88 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition-all dark:bg-slate-950/78',
        isFocused ? 'border-blue-300 shadow-[0_24px_90px_rgba(37,99,235,0.16)] dark:border-blue-900/60' : 'border-white/80 dark:border-slate-800'
      )}
    >
      <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
        <label className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/70">
          <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            <Globe2 className="h-3.5 w-3.5" /> Country context
          </span>
          <select
            value={country}
            onChange={(event) => onCountryChange(event.target.value)}
            className="mt-1 w-full bg-transparent text-sm font-bold text-slate-950 outline-none dark:text-white"
          >
            {COUNTRY_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/70">
          <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            <Landmark className="h-3.5 w-3.5" /> Help type
          </span>
          <select
            value={need}
            onChange={(event) => onNeedChange(event.target.value as NeedOptionValue)}
            className="mt-1 w-full bg-transparent text-sm font-bold text-slate-950 outline-none dark:text-white"
          >
            {NEED_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>

      {!supportedCoverage ? (
        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          Current verified-source coverage is strongest for United States public-service programs. Other countries may return a safer low-confidence answer until more official sources are added.
        </div>
      ) : null}

      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
        <ShieldCheck className="h-4 w-4" /> CivicShield will check official sources for: {selectedNeed.label.toLowerCase()}.
      </div>

      <div className="mt-4">
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && !isSubmitting && value.trim()) {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Example: I lost work hours and need help with rent, food, and utilities this month."
          className="min-h-[140px] resize-none border-transparent bg-slate-50/85 text-base leading-7 dark:bg-slate-900/80"
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="ghost" size="sm" className="gap-2 rounded-xl px-3" disabled>
            <Paperclip className="h-3.5 w-3.5" /> Attach notice
          </Button>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isFocused ? 'Press Ctrl/Cmd + Enter to submit.' : 'Do not paste Social Security numbers, passwords, or private identity documents.'}
          </span>
        </div>
        <Button type="button" className="gap-2 rounded-2xl" onClick={onSubmit} disabled={isSubmitting || !value.trim()}>
          <SendHorizonal className="h-4 w-4" />
          {isSubmitting ? 'Checking sources…' : 'Get verified next steps'}
        </Button>
      </div>
    </div>
  );
}
