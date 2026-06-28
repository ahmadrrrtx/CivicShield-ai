import { BadgeAlert, BadgeCheck, ExternalLink, FileText, Landmark, Clock3, Fingerprint } from 'lucide-react';
import type { ChatCitation } from '@/components/app/chat-demo-data';
import { cn } from '@/lib/utils';

function FreshnessBadge({ freshness }: { freshness?: 'fresh' | 'aging' | 'stale' }) {
  if (!freshness || freshness === 'fresh') return null;

  const isStale = freshness === 'stale';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
        isStale
          ? 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300'
          : 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300'
      )}
    >
      <BadgeAlert className="h-3 w-3" />
      {isStale ? 'Stale' : 'Aging'}
    </span>
  );
}

export function ChatSourceList({
  citations,
  compact = false
}: {
  citations: ChatCitation[];
  compact?: boolean;
}) {
  return (
    <div className={cn('grid gap-3', compact ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2')}>
      {citations.map((citation) => (
        <a
          key={citation.id}
          href={citation.url}
          target="_blank"
          rel="noreferrer"
          className="group rounded-[22px] border border-slate-200/80 bg-white/75 p-4 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_10px_30px_rgba(59,130,246,0.08)] dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-blue-900/40"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-slate-950 p-2 text-white dark:bg-white dark:text-slate-950">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">{citation.title}</p>
                  {citation.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </span>
                  ) : null}
                  <FreshnessBadge freshness={citation.freshness} />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{citation.url}</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{citation.summary}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5"><Landmark className="h-3.5 w-3.5" />{citation.department}</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />Updated {citation.lastUpdated}</span>
            <span>{citation.country}</span>
          </div>
          {citation.traceId ? (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <Fingerprint className="h-3 w-3" />
              Trace {citation.traceId}
            </div>
          ) : null}
        </a>
      ))}
    </div>
  );
}
