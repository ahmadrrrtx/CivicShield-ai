import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16 lg:px-8 lg:pt-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.20),transparent_45%),radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.14),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(6,182,212,0.14),transparent_25%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="border-blue-200 bg-blue-50/80 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
            Official-source grounded • Multilingual • Security-first
          </Badge>
          <h1 className="mt-8 text-balance text-5xl font-semibold tracking-[-0.06em] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            Trusted AI guidance for public services.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-600 dark:text-slate-300">
            CivicShield AI helps people understand benefits, emergency support, legal information, and government services using official sources, visible citations, and careful AI safety controls.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg">Start in guest mode</Button>
            <Button size="lg" variant="secondary">View trust model</Button>
          </div>
          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            CivicShield AI explains information. Final decisions belong to the relevant authority.
          </p>
        </div>
      </div>
    </section>
  );
}
