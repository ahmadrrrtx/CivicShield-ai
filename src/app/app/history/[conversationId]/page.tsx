import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChatMessageList } from '@/components/app/chat-message-list';
import { HistoryActions } from '@/components/app/history-actions';
import { ReviewWorkflowPanel } from '@/components/app/review-workflow-panel';
import { SourcePanel } from '@/components/app/source-panel';
import { TranscriptQualityPanel } from '@/components/app/transcript-quality-panel';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getConversationDetail } from '@/lib/conversations';
import { formatRelativeDate } from '@/lib/date';
import { getCurrentSession } from '@/lib/session';

export default async function ConversationDetailPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params;
  const session = await getCurrentSession();
  const conversation = await getConversationDetail(
    {
      scopeType: session.type,
      scopeId: session.id,
      userId: session.type === 'user' ? session.id : undefined
    },
    conversationId
  );

  if (!conversation) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Conversation detail</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">{conversation.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Review the saved transcript and the source evidence that supported the answer. Conversation storage remains scoped to your current guest or account session.
          </p>
        </div>
        <Link href={`/app?conversationId=${conversation.id}`} className="inline-flex items-center rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
          Continue conversation
        </Link>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{conversation.sessionType === 'user' ? 'Account session' : 'Guest session'}</Badge>
          <Badge>{conversation.grounded ? 'Grounded answer' : 'Review needed'}</Badge>
          <Badge>{conversation.citationCount} source{conversation.citationCount === 1 ? '' : 's'}</Badge>
          <Badge>
            {conversation.review.status === 'in_review'
              ? 'In review'
              : conversation.review.status === 'resolved'
                ? 'Resolved'
                : 'Open'}
          </Badge>
          {conversation.pinned ? <Badge>Pinned</Badge> : null}
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Last updated {formatRelativeDate(conversation.updatedAt)}
          {conversation.country ? ` · ${conversation.country}` : ''}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          This saved transcript can be searched from History, resumed from the Ask surface, and managed without losing the citations that supported the assistant response.
        </p>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <Card className="p-5 lg:p-7">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Transcript</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">Saved conversation</h2>
          </div>
          <div className="mt-6">
            <ChatMessageList messages={conversation.messages} conversationId={conversation.id} />
          </div>
        </Card>

        <div className="space-y-6">
          <HistoryActions conversationId={conversation.id} initialTitle={conversation.title} pinned={conversation.pinned} />
          <ReviewWorkflowPanel
            conversationId={conversation.id}
            initialStatus={conversation.review.status}
            initialNote={conversation.review.note}
            reviewedAt={conversation.review.reviewedAt}
          />
          <TranscriptQualityPanel
            helpfulCount={conversation.quality.helpfulCount}
            needsReviewCount={conversation.quality.needsReviewCount}
            assistantMessageCount={conversation.quality.assistantMessageCount}
          />
          <SourcePanel citations={conversation.citations} />
        </div>
      </div>
    </div>
  );
}
