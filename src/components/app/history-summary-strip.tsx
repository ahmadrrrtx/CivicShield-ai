import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function HistorySummaryStrip({
  total,
  pinned,
  grounded,
  needsReview
}: {
  total: number;
  pinned: number;
  grounded: number;
  needsReview: number;
}) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Badge>{total} conversation{total === 1 ? '' : 's'}</Badge>
        <Badge>{pinned} pinned</Badge>
        <Badge>{grounded} grounded</Badge>
        <Badge>{needsReview} need review</Badge>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Use search and filters to quickly return to prior evidence-backed guidance, pinned transcripts, or conversations that may need further review.
      </p>
    </Card>
  );
}
