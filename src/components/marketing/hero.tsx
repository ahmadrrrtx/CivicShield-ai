import Link from 'next/link';
import { ArrowRight, HeartHandshake, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HeroPreview } from '@/components/marketing/hero-preview';
import { Reveal } from '@/components/marketing/motion-reveal';

const trustBadges = [
  { label: 'Official-source grounded', icon: ShieldCheck },
  { label: 'Safe refusal when unsure', icon: LockKeyhole },
  { label: 'Built for stressful moments', icon: HeartHandshake }
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-5 pb-20 pt-14 lg:px-8 lg:pb-28 lg:pt-20">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,rgba(239,246,255,0.95),rgba(255,255,255,0.72)_36%,rgba(236,253,245,0.72))] dark:bg-[linear-gradient(135deg,rgba(2,6,23,1),rgba(15,23,42,0.92)_45%,rgba(8,47,73,0.68))]" />
      <div className="absolute left-1/2 top-0 -z-10 h-[720px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.22),transparent_58%)] blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-[#f6f8fb] dark:to-slate-950" />

      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="max-w-3xl text-center lg:text-left">
          <Reveal>
            <Badge className="border-blue-200 bg-white/75 text-blue-700 shadow-sm dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Official-source grounded
            </Badge>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-7 text-balance text-5xl font-black tracking-[-0.075em] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              Find public help without getting lost.
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-600 dark:text-slate-300 lg:mx-0">
              CivicShield AI helps people understand benefits, housing help, emergency support, and government services in plain language — with visible citations, confidence signals, and safer refusal when official evidence is too weak.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/app"
                className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-7 py-4 text-sm font-bold text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] transition hover:-translate-y-1 hover:bg-slate-900 sm:w-auto dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                Ask for help now <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#trust"
                className="inline-flex h-13 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white/75 px-7 py-4 text-sm font-bold text-slate-900 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:bg-white sm:w-auto dark:border-slate-800 dark:bg-slate-900/75 dark:text-white dark:hover:bg-slate-900"
              >
                See how it verifies
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="mt-7 grid gap-2 sm:grid-cols-3">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.label} className="rounded-2xl border border-white/70 bg-white/65 px-3 py-3 text-left shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/45">
                    <Icon className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    <p className="mt-2 text-xs font-bold leading-5 text-slate-700 dark:text-slate-200">{badge.label}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <p className="mt-5 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Not a government agency. Not legal advice. CivicShield is designed to ground answers in official sources, show its confidence, and say when it cannot confidently verify enough evidence.
            </p>
          </Reveal>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}
