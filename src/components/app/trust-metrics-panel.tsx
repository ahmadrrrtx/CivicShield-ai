import { CheckCircle2, Clock3, FileText, Globe2, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { ChatCitation, ChatConfidenceLevel } from '@/components/app/chat-demo-data';

function confidenceLabel(confidence?: ChatConfidenceLevel) {
  if (confidence === 'high') return 'High';
  if (confidence === 'moderate') return 'Moderate';
  if (confidence === 'low') return 'Low';
  return 'Waiting';
}

export function TrustMetricsPanel({
  citations,
  latestConfidence,
  country
}: {
  citations: ChatCitation[];
  latestConfidence?: ChatConfidenceLevel;
  country: string;
}) {
  const verifiedCount = citations.filter((citation) => citation.verified).length;
  const freshCount = citations.filter((citation) => citation.freshness === 'fresh').length;
  const officialCount = citations.length;

  return (
    <Card className="p-5 lg:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">Trust metrics</p>
          <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-slate-950 dark:text-white">What the answer is based on</h2>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/65">
          <FileText className="h-4 w-4 text-blue-500" />
          <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{officialCount}</p>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Sources attached</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/65">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{verifiedCount}</p>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Verified links</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/65">
          <ShieldQuestion className="h-4 w-4 text-amber-500" />
          <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{confidenceLabel(latestConfidence)}</p>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Confidence</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/65">
          <Clock3 className="h-4 w-4 text-cyan-500" />
          <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{freshCount}</p>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Fresh sources</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-3 py-3 text-xs font-bold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300">
        <Globe2 className="h-4 w-4" /> Country context: {country}
      </div>
    </Card>
  );
}
