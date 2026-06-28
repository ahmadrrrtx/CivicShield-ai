import { ShieldCheck, Languages, Landmark, HeartHandshake, SearchCheck, KeyRound } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    title: 'Official-source answers',
    description: 'Every factual response is grounded in official public sources with visible citations and source metadata.',
    icon: SearchCheck
  },
  {
    title: 'Multilingual by design',
    description: 'The experience is designed for language accessibility, clear wording, and future regional expansion.',
    icon: Languages
  },
  {
    title: 'Public-service trust model',
    description: 'The assistant explains public information without pretending to make decisions on behalf of authorities.',
    icon: Landmark
  },
  {
    title: 'Safety and escalation',
    description: 'High-risk questions trigger caution, uncertainty language, and referral to official or human channels.',
    icon: ShieldCheck
  },
  {
    title: 'Bring your own AI key',
    description: 'Groq-first architecture with secure provider settings and future-ready multi-provider expansion.',
    icon: KeyRound
  },
  {
    title: 'Built for dignity',
    description: 'A calm, accessible interface designed for stressful moments, not generic chatbot novelty.',
    icon: HeartHandshake
  }
];

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Why CivicShield</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl">
          Built to feel trustworthy before it feels impressive.
        </h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
