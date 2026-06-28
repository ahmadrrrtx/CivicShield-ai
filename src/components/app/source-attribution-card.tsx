import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function SourceAttributionCard({
  title,
  department,
  country,
  lastUpdated,
  confidence
}: {
  title: string;
  department: string;
  country: string;
  lastUpdated: string;
  confidence: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-white">{title}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {department} · {country}
          </p>
        </div>
        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          {confidence}
        </Badge>
      </div>
      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Last updated {lastUpdated}</p>
    </Card>
  );
}
