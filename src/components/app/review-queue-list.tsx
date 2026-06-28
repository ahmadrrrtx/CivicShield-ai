import { Card } from '@/components/ui/card';
import type { ReviewQueueItem } from '@/lib/conversations';
import { ReviewQueueCard } from '@/components/app/review-queue-card';

export function ReviewQueueList({ items }: { items: ReviewQueueItem[] }) {
  if (items.length === 0) {
    return (
      <Card className="p-6 lg:p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">Queue clear</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">No conversations currently need review</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Review-needed conversations will appear here when an answer is ungrounded or an assistant message receives a needs-review quality signal.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {items.map((item) => (
        <ReviewQueueCard key={item.id} item={item} />
      ))}
    </div>
  );
}
