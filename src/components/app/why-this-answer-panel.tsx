import { AlertTriangle, CheckCircle2, FileSearch, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { ChatCitation, ChatConfidenceLevel } from '@/components/app/chat-demo-data';

export function WhyThisAnswerPanel({ citations, confidence }: { citations: ChatCitation[]; confidence?: ChatConfidenceLevel }) {
  const hasEvidence = citations.length > 0;
  return (
    <Card className="p-5 lg:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          <FileSearch className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Why this answer?</p>
          <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-slate-950 dark:text-white">Visible AI reasoning boundaries</h2>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <div className="flex gap-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 dark:bg-slate-900/70">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          <span className="text-slate-600 dark:text-slate-300">The answer uses the selected country and help type to retrieve official evidence.</span>
        </div>
        <div className="flex gap-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 dark:bg-slate-900/70">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
          <span className="text-slate-600 dark:text-slate-300">Confidence is currently <strong className="text-slate-950 dark:text-white">{confidence ?? 'not available yet'}</strong>, based on citation and grounding checks.</span>
        </div>
        <div className="flex gap-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 dark:bg-slate-900/70">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <span className="text-slate-600 dark:text-slate-300">If CivicShield cannot verify enough evidence, it should lower confidence and tell you to confirm with official channels.</span>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Evidence status</p>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {hasEvidence
            ? `${citations.length} citation${citations.length === 1 ? '' : 's'} are attached to the current answer. Open the source panel to inspect them.`
            : 'No verified citations are attached yet. Ask a supported public-service question to generate evidence-backed guidance.'}
        </p>
      </div>
    </Card>
  );
}
