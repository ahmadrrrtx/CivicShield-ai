import { CheckCircle2, CircleOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function ProviderStatusCard({
  name,
  enabled,
  message
}: {
  name: string;
  enabled: boolean;
  message: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-2xl',
            enabled
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400'
          )}
        >
          {enabled ? <CheckCircle2 className="h-5 w-5" /> : <CircleOff className="h-5 w-5" />}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{name}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>
        </div>
      </div>
    </Card>
  );
}
