import { BookOpenText, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { ChatCitation } from '@/components/app/chat-demo-data';
import { ChatSourceList } from '@/components/app/chat-source-list';

export function SourcePanel({ citations }: { citations: ChatCitation[] }) {
  return (
    <Card className="p-5 lg:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          <BookOpenText className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Source panel</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">Verified public references behind this answer</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            CivicShield AI now preserves citation traceability back to verified evidence, exposes freshness and verification state, and applies policy gates before an answer is allowed to remain grounded.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Traceable evidence policy active
          </div>
        </div>
      </div>
      <div className="mt-5">
        <ChatSourceList citations={citations} compact />
      </div>
    </Card>
  );
}
