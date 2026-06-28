import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function TranscriptQualityPanel({
  helpfulCount,
  needsReviewCount,
  assistantMessageCount
}: {
  helpfulCount: number;
  needsReviewCount: number;
  assistantMessageCount: number;
}) {
  return (
    <Card className="p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Quality signals</p>
      <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">Transcript review posture</h3>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge>{assistantMessageCount} assistant answer{assistantMessageCount === 1 ? '' : 's'}</Badge>
        <Badge>{helpfulCount} helpful</Badge>
        <Badge>{needsReviewCount} need review</Badge>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Feedback is stored per assistant message so review signals can help prioritize transcript quality improvements without changing the evidence-backed response contract.
      </p>
    </Card>
  );
}
