import { ArrowRight, FileCheck2, Home, PlugZap, SearchCheck, ShieldCheck, ShoppingBasket } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { NeedOptionValue } from '@/components/app/chat-composer';

const prompts: Array<{ label: string; text: string; icon: typeof Home; need: NeedOptionValue }> = [
  {
    label: 'Food benefits',
    text: 'I need help buying food this month. What official benefits should I check first?',
    icon: ShoppingBasket,
    need: 'food'
  },
  {
    label: 'Rent help',
    text: 'I am behind on rent. Where can I find official rental assistance or housing help?',
    icon: Home,
    need: 'housing'
  },
  {
    label: 'Utility bills',
    text: 'My utility bill is overdue. Is there official energy assistance I should look at?',
    icon: PlugZap,
    need: 'utilities'
  }
];

export function ChatEmptyState({ onPromptSelect }: { onPromptSelect?: (prompt: string, need: NeedOptionValue) => void }) {
  return (
    <Card className="relative overflow-hidden p-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.10),transparent_26%)]" />
      <div className="relative p-6 lg:p-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[26px] bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 text-white shadow-[0_18px_45px_rgba(37,99,235,0.25)]">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-[-0.055em] text-slate-950 dark:text-white">What do you need help with today?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Ask like you would ask a trusted local helper. CivicShield checks official sources, shows confidence, and gives plain-language next steps.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {prompts.map((prompt) => {
            const Icon = prompt.icon;
            return (
              <button
                key={prompt.label}
                type="button"
                onClick={() => onPromptSelect?.(prompt.text, prompt.need)}
                className="group rounded-[26px] border border-slate-200/80 bg-white/78 p-5 text-left shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_60px_rgba(37,99,235,0.12)] dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-blue-900/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-black tracking-[-0.035em] text-slate-950 dark:text-white">{prompt.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{prompt.text}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition group-hover:gap-3 dark:text-blue-300">
                  Use this prompt <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-3 rounded-[26px] border border-white/70 bg-white/65 p-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/50 sm:grid-cols-3">
          <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200"><SearchCheck className="h-5 w-5 text-blue-500" /> Checks official sources</div>
          <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200"><FileCheck2 className="h-5 w-5 text-emerald-500" /> Shows citations</div>
          <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200"><ShieldCheck className="h-5 w-5 text-indigo-500" /> Refuses to guess</div>
        </div>
      </div>
    </Card>
  );
}
