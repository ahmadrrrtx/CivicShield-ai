import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Hero } from '@/components/marketing/hero';
import { FeatureGrid } from '@/components/marketing/feature-grid';
import { FAQ } from '@/components/marketing/faq';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <Hero />

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            ['1', 'Understand the situation', 'Users ask in natural language. CivicShield captures the question, language, and jurisdiction context with minimal friction.'],
            ['2', 'Check official sources', 'The system is designed to ground answers in approved public sources and show citations with department, country, and freshness metadata.'],
            ['3', 'Respond with caution', 'Answers include confidence signals and plain-language next steps. If evidence is weak, the system should say so instead of guessing.']
          ].map(([step, title, body]) => (
            <Card key={step} className="p-7">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Step {step}</div>
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      <FeatureGrid />

      <section id="security" className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-16">
        <Card className="grid gap-8 p-8 lg:grid-cols-2 lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Security and trust</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
              Designed to be careful with both information and uncertainty.
            </h2>
          </div>
          <div className="grid gap-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            <p>Input validation, output validation, security headers, prompt-injection-aware retrieval design, and future-ready provider isolation are part of the platform foundation.</p>
            <p>Every answer is expected to surface sources, confidence, jurisdiction, and last-updated context instead of performing invisible AI reasoning behind a black box.</p>
          </div>
        </Card>
      </section>

      <FAQ />
      <SiteFooter />
    </main>
  );
}
