import { MessageSquareText, ShieldCheck, SearchCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';

const prompts = [
  'What official housing assistance should I verify first in my area?',
  'How do I prepare documents for SNAP or emergency utility support?',
  'What public agencies handle rental, food, and utility assistance where I live?'
];

export function ChatEmptyState() {
  return (
    <Card className="p-6 lg:p-8">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[22px] bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.16)] dark:bg-white dark:text-slate-950">
          <MessageSquareText className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">Start a grounded civic question</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Ask for help understanding public services, benefits, or agency processes. CivicShield AI is designed to explain verified public information with visible citations.
        </p>
        <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200/80 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">Official-source first</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Answers should be grounded in visible references, not unsupported guesses.</p>
          </div>
          <div className="rounded-[24px] border border-slate-200/80 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <SearchCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">Confidence always visible</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Low-confidence situations should be clearly marked before users rely on the answer.</p>
          </div>
          <div className="rounded-[24px] border border-slate-200/80 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <MessageSquareText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">Designed for follow-up questions</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Ask the next question once sources, location, and eligibility details become clearer.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {prompts.map((prompt) => (
            <span key={prompt} className="rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
              {prompt}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
