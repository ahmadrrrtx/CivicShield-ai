import Link from 'next/link';
import { ArrowRight, CheckCircle2, MessageSquareText, SearchCheck, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Hero } from '@/components/marketing/hero';
import { FeatureGrid } from '@/components/marketing/feature-grid';
import { FAQ } from '@/components/marketing/faq';
import { ImpactSection } from '@/components/marketing/impact-section';
import { TrustShowcase } from '@/components/marketing/trust-showcase';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/marketing/motion-reveal';

const steps = [
  {
    title: 'Tell us what happened',
    body: 'Ask like you would ask a caseworker, friend, or local agency — no forms or technical terms required.',
    icon: MessageSquareText
  },
  {
    title: 'CivicShield checks sources',
    body: 'The system looks for approved public-service sources before giving a factual answer.',
    icon: SearchCheck
  },
  {
    title: 'Get next steps and links',
    body: 'The answer shows confidence, official citations, and what to do next without pretending to decide your case.',
    icon: CheckCircle2
  },
  {
    title: 'Review when it matters',
    body: 'Low-confidence or flagged conversations can move into reviewer workflows and audit trails.',
    icon: UserRoundCheck
  }
];

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <Hero />

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">How it works</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 dark:text-white sm:text-5xl">
            A calmer path from problem to official next step.
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
            CivicShield is designed for people who need help now, not a technical manual or another confusing government search page.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={index * 0.05}>
                <Card className="relative h-full p-6">
                  <div className="absolute right-5 top-5 text-5xl font-black tracking-[-0.08em] text-slate-100 dark:text-slate-800">
                    {index + 1}
                  </div>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="relative mt-5 text-lg font-bold tracking-[-0.035em] text-slate-950 dark:text-white">{step.title}</h3>
                  <p className="relative mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{step.body}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      <ImpactSection />
      <FeatureGrid />
      <TrustShowcase />

      <section id="security" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <Card className="relative overflow-hidden p-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_85%_30%,rgba(16,185,129,0.14),transparent_26%)]" />
            <div className="relative grid gap-8 p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">Security and trust</p>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 dark:text-white">
                  Designed to be careful with both information and uncertainty.
                </h2>
              </div>
              <div className="grid gap-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <p>Input validation, output validation, security headers, prompt-injection-aware retrieval design, provider-key encryption, and reviewer workflows are built into the foundation.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {['Zod-validated APIs', 'Encrypted provider keys', 'Reviewer-gated governance', 'Audit export foundation'].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-3 py-3 font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      </section>

      <section className="px-5 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-white/70 bg-slate-950 p-8 text-center text-white shadow-[0_30px_110px_rgba(15,23,42,0.24)] dark:border-white/10 lg:p-12">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-200">Ready to try it?</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-[-0.06em] sm:text-5xl">
              Ask one plain-language question and see the trust layer in action.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300">
              Start with SNAP, rent assistance, utilities, or emergency support. CivicShield will show what it can verify — and what it cannot.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/app" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:bg-blue-50">
                Launch CivicShield <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/auth/sign-up" className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/15">
                Create free account
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <FAQ />
      <SiteFooter />
    </main>
  );
}
