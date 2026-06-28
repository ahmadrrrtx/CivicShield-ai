import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { ReviewQueueItem } from '@/lib/conversations';

function formatReviewStatus(status: ReviewQueueItem['reviewStatus']) {
  if (status === 'in_review') return 'In review';
  if (status === 'resolved') return 'Resolved';
  return 'Open';
}

export function ReviewQueueCard({ item }: { item: ReviewQueueItem }) {
  return (
    <Link href={`/app/history/${item.id}`} className="block">
      <Card className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{item.title}</h3>
              <Badge>{item.sessionType === 'user' ? 'Account' : 'Guest'}</Badge>
              <Badge>{item.grounded ? 'Grounded with flags' : 'Ungrounded'}</Badge>
              <Badge>{item.priority === 'high' ? 'High priority' : 'Medium priority'}</Badge>
              <Badge>{formatReviewStatus(item.reviewStatus)}</Badge>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.preview}</p>
            {item.reviewNote ? (
              <p className="mt-3 line-clamp-2 text-xs leading-6 text-slate-500 dark:text-slate-400">Reviewer note: {item.reviewNote}</p>
            ) : null}
          </div>
          <Badge>{item.citationCount} source{item.citationCount === 1 ? '' : 's'}</Badge>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Updated {item.updatedAt}</span>
          {item.country ? <span>· {item.country}</span> : null}
          {item.reviewedAt ? <span>· Reviewed recorded</span> : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{item.assistantMessageCount} assistant turns</Badge>
          <Badge>{item.helpfulCount} helpful</Badge>
          <Badge>{item.needsReviewCount} review flags</Badge>
        </div>
      </Card>
    </Link>
  );
}
