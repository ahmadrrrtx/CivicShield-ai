import { BookOpenText, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { ChatCitation } from '@/components/app/chat-demo-data';
import { ChatSourceList } from '@/components/app/chat-source-list';

export function SourcePanel({ citations }: { citations: ChatCitation[] }) {
  return (
    <Card className="p-5 lg:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-blue-50 p-2 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"><BookOpenText className="h-5 w-5" /></div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Official sources</p>
          <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-slate-950 dark:text-white">Links behind the answer</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Citations remain visible so users can verify directly with the public agency or official portal.</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300"><ShieldCheck className="h-3.5 w-3.5" /> Evidence policy active</div>
        </div>
      </div>
      <div className="mt-5">{citations.length > 0 ? <ChatSourceList citations={citations} compact /> : <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-5 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">Ask a supported question to see official sources here. Unsupported questions should produce a safer low-confidence answer instead of fake links.</div>}</div>
    </Card>
  );
}
