import { ConversationCard } from '@/components/app/conversation-card';
import { HistoryFilters } from '@/components/app/history-filters';
import { HistorySummaryStrip } from '@/components/app/history-summary-strip';
import { Card } from '@/components/ui/card';
import { listConversationsForScope } from '@/lib/conversations';
import { formatRelativeDate } from '@/lib/date';
import { getCurrentSession } from '@/lib/session';

export default async function HistoryPage({
  searchParams
}: {
  searchParams?: Promise<{ q?: string; pinned?: string; grounded?: string; needsReview?: string }>;
}) {
  const session = await getCurrentSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q?.trim() || undefined;
  const pinned = resolvedSearchParams?.pinned === 'true' ? true : undefined;
  const grounded = resolvedSearchParams?.grounded === 'true' ? true : undefined;
  const needsReview = resolvedSearchParams?.needsReview === 'true' ? true : undefined;

  const conversations = await listConversationsForScope(
    {
      scopeType: session.type,
      scopeId: session.id,
      userId: session.type === 'user' ? session.id : undefined
    },
    {
      q: query,
      pinned,
      grounded,
      needsReview,
      sessionType: session.type
    }
  );

  const pinnedCount = conversations.filter((conversation) => conversation.pinned).length;
  const groundedCount = conversations.filter((conversation) => conversation.grounded).length;
  const needsReviewCount = conversations.filter((conversation) => conversation.needsReview).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">History</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">Conversation history</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Search, filter, and revisit prior verified guidance without losing the evidence-first safety foundation behind each saved conversation.
        </p>
      </div>

      <HistoryFilters
        initialQuery={query ?? ''}
        initialPinned={Boolean(pinned)}
        initialGrounded={Boolean(grounded)}
        initialNeedsReview={Boolean(needsReview)}
      />
      <HistorySummaryStrip total={conversations.length} pinned={pinnedCount} grounded={groundedCount} needsReview={needsReviewCount} />

      {conversations.length === 0 ? (
        <Card className="p-6 lg:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">No matching conversations</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">Adjust your search or start a new question</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            If persistence is available, saved conversation summaries will appear here and can be filtered by pinned status, grounded-answer quality, or review-needed signals.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {conversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              id={conversation.id}
              title={conversation.title}
              preview={conversation.preview}
              updated={formatRelativeDate(conversation.updatedAt)}
              pinned={conversation.pinned}
              sessionType={conversation.sessionType}
              grounded={conversation.grounded}
              citationCount={conversation.citationCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
