import Link from 'next/link';
import { ConversationQualityDashboard } from '@/components/app/conversation-quality-dashboard';
import { ReviewQueueList } from '@/components/app/review-queue-list';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatRelativeDate } from '@/lib/date';
import { getConversationQualityDashboardMetrics, listReviewQueueForScope } from '@/lib/conversations';
import { requireReviewerAccess } from '@/lib/reviewer-auth';

export default async function ReviewPage() {
  const access = await requireReviewerAccess();
  const session = access.session;
  const scope = {
    scopeType: session.type,
    scopeId: session.id,
    userId: session.type === 'user' ? session.id : undefined
  } as const;

  const [metrics, queue] = await Promise.all([
    getConversationQualityDashboardMetrics(scope),
    listReviewQueueForScope(scope, 24)
  ]);

  const highPriorityCount = queue.filter((item) => item.priority === 'high').length;
  const mostRecent = queue[0]?.updatedAt;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.18),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.14),transparent_28%)] p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                Quality operations
              </Badge>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white lg:text-4xl">
                Reviewer queue and conversation quality dashboard
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                This workspace helps authorized reviewers identify conversations that may require human review based on grounding state, transcript-level quality signals, and workflow status.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge>{queue.length} queued</Badge>
                <Badge>{highPriorityCount} high priority</Badge>
                <Badge>{metrics.inReviewConversations} in review</Badge>
                {mostRecent ? <Badge>Latest update {formatRelativeDate(mostRecent)}</Badge> : null}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/app/history?needsReview=true" className="inline-flex items-center rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
                Open review-needed history
              </Link>
              <Link href="/app/review/audit" className="inline-flex items-center rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
                Open audit viewer
              </Link>
            </div>
          </div>
        </div>
      </Card>

      <ConversationQualityDashboard metrics={metrics} />

      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Review queue</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">Prioritized conversations</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Priority is currently derived from ungrounded outcomes and accumulated needs-review feedback. Access to this workspace is now gated by a reviewer allowlist foundation.
          </p>
        </div>
        <ReviewQueueList
          items={queue.map((item) => ({
            ...item,
            updatedAt: formatRelativeDate(item.updatedAt)
          }))}
        />
      </div>
    </div>
  );
}
