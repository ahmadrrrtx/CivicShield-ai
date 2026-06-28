import { ShieldCheck, Languages, Landmark, HeartHandshake, SearchCheck, KeyRound } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/marketing/motion-reveal';

const features = [
  {
    title: 'Official-source answers',
    description: 'Every factual response is designed around official public sources with visible citations and source metadata.',
    icon: SearchCheck,
    gradient: 'from-blue-600 to-cyan-500'
  },
  {
    title: 'Plain language by default',
    description: 'CivicShield translates confusing public-service pages into calmer next steps for everyday users.',
    icon: Languages,
    gradient: 'from-indigo-600 to-blue-500'
  },
  {
    title: 'Public-service boundaries',
    description: 'The assistant explains information without pretending to make decisions for agencies, lawyers, or clinicians.',
    icon: Landmark,
    gradient: 'from-slate-900 to-blue-700'
  },
  {
    title: 'Safety and escalation',
    description: 'High-risk questions trigger caution, uncertainty language, and referral to official or human channels.',
    icon: ShieldCheck,
    gradient: 'from-amber-500 to-rose-500'
  },
  {
    title: 'Secure AI configuration',
    description: 'Groq-first architecture supports server or scoped keys while keeping provider credentials protected.',
    icon: KeyRound,
    gradient: 'from-violet-600 to-indigo-500'
  },
  {
    title: 'Built for dignity',
    description: 'A calm, accessible interface designed for stressful moments, not generic chatbot novelty.',
    icon: HeartHandshake,
    gradient: 'from-emerald-600 to-teal-500'
  }
];

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
      <Reveal className="max-w-2xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">Why CivicShield</p>
        <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 dark:text-white sm:text-5xl">
          Built to feel trustworthy before it feels impressive.
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Reveal key={feature.title} delay={index * 0.04}>
              <Card className="group relative h-full overflow-hidden p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(37,99,235,0.14)]">
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className={`flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg shadow-blue-500/15`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-[-0.035em] text-slate-950 dark:text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
