import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { ConversationQualityDashboardMetrics } from '@/lib/conversations';

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function ConversationQualityDashboard({ metrics }: { metrics: ConversationQualityDashboardMetrics }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
      <Card className="p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Coverage</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">{metrics.totalConversations}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Saved conversations in the current session scope.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{metrics.pinnedConversations} pinned</Badge>
          <Badge>{metrics.assistantMessages} assistant messages</Badge>
        </div>
      </Card>

      <Card className="p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">Grounded quality</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">{formatPercent(metrics.groundedRate)}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Conversations whose latest saved state remains grounded.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{metrics.groundedConversations} grounded</Badge>
        </div>
      </Card>

      <Card className="p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">Review pressure</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">{formatPercent(metrics.reviewRate)}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Conversations currently surfaced as needing review.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{metrics.needsReviewConversations} review-needed</Badge>
          <Badge>{metrics.needsReviewSignals} feedback flags</Badge>
        </div>
      </Card>

      <Card className="p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">Review workflow</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">{metrics.openReviews}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Conversations currently sitting in the open review state.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{metrics.inReviewConversations} in review</Badge>
          <Badge>{metrics.resolvedReviews} resolved</Badge>
        </div>
      </Card>
    </div>
  );
}
