import { CheckCircle2, Clock3, FileText, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FloatingCard, Reveal } from '@/components/marketing/motion-reveal';

const sourceRows = [
  { label: 'HUD housing help', state: 'Official' },
  { label: 'Benefits.gov finder', state: 'Verified' },
  { label: 'LIHEAP energy aid', state: 'Fresh' }
];

function CivicOrb() {
  return (
    <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[1.4rem] bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.35),transparent_28%),radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.28),transparent_26%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,64,175,0.88),rgba(6,78,59,0.82))]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px] opacity-35" />
      <div className="absolute h-64 w-64 rounded-full border border-white/20 bg-white/10 blur-sm" />
      <div className="relative h-44 w-44 rounded-[3rem] border border-white/30 bg-white/15 p-5 shadow-[0_30px_90px_rgba(56,189,248,0.28)] backdrop-blur-2xl">
        <div className="absolute -left-8 top-10 h-5 w-5 rounded-full bg-cyan-300 shadow-[0_0_30px_rgba(103,232,249,0.8)]" />
        <div className="absolute -right-8 top-20 h-5 w-5 rounded-full bg-emerald-300 shadow-[0_0_30px_rgba(110,231,183,0.8)]" />
        <div className="absolute bottom-3 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-blue-200 shadow-[0_0_30px_rgba(191,219,254,0.85)]" />
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" aria-hidden="true">
          <path d="M60 7c15 10 30.8 15.1 47.4 15.7v31.4c0 25.5-16.3 48.6-40.6 57.5L60 114l-6.8-2.4C28.9 102.7 12.6 79.6 12.6 54.1V22.7C29.2 22.1 45 17 60 7Z" fill="url(#orbShield)" />
          <path d="M34 66h52M45 54l15-13 15 13M47 78h26" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="orbShield" x1="18" y1="10" x2="104" y2="111" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="0.5" stopColor="#2563EB" />
              <stop offset="1" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export function HeroPreview() {
  return (
    <Reveal className="relative mx-auto mt-14 max-w-5xl lg:mt-0" delay={0.18}>
      <div className="absolute -inset-6 rounded-[3rem] bg-[radial-gradient(circle_at_25%_20%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_75%_30%,rgba(16,185,129,0.18),transparent_26%),radial-gradient(circle_at_50%_85%,rgba(99,102,241,0.18),transparent_28%)] blur-2xl" />
      <div className="relative grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_30px_100px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70">
          <div className="absolute right-5 top-5 hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-300 sm:inline-flex">Live trust preview</div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25"><Sparkles className="h-5 w-5" /></div>
            <div><p className="text-sm font-semibold text-slate-950 dark:text-white">CivicShield answer</p><p className="text-xs text-slate-500 dark:text-slate-400">Plain-language help with official links</p></div>
          </div>
          <div className="mt-5 rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">User asks</p><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">“I lost work hours and need help with rent, food, and utilities this month.”</p></div>
          <div className="mt-4 space-y-3 rounded-3xl border border-blue-100 bg-white p-4 dark:border-blue-950/60 dark:bg-slate-950/80">
            <div className="flex flex-wrap items-center gap-2"><Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"><ShieldCheck className="mr-1 h-3.5 w-3.5" /> Grounded</Badge><Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300">Moderate confidence</Badge></div>
            <h3 className="text-base font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">Start with three official support paths.</h3>
            <ul className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> Check SNAP food benefits through your state application portal.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> Contact local housing assistance or HUD-backed resources.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> Review LIHEAP energy assistance if utilities are at risk.</li>
            </ul>
          </div>
        </div>
        <div className="grid gap-5">
          <FloatingCard className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-[0_24px_80px_rgba(37,99,235,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/65"><CivicOrb /></FloatingCard>
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_22px_70px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-slate-950 dark:text-white">Verified source stack</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Citations stay visible, not hidden.</p></div><Clock3 className="h-5 w-5 text-blue-500" /></div>
            <div className="mt-4 space-y-2">{sourceRows.map((row) => <div key={row.label} className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900/70"><span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200"><FileText className="h-3.5 w-3.5 text-slate-400" /> {row.label}</span><span className="rounded-full bg-white px-2 py-1 font-semibold text-slate-600 shadow-sm dark:bg-slate-950 dark:text-slate-300">{row.state}</span></div>)}</div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
