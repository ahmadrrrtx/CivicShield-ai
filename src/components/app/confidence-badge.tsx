import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ChatConfidenceLevel } from '@/components/app/chat-demo-data';

const confidenceConfig: Record<
  ChatConfidenceLevel,
  {
    label: string;
    icon: typeof ShieldCheck;
    className: string;
  }
> = {
  high: {
    label: 'High confidence',
    icon: ShieldCheck,
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300'
  },
  moderate: {
    label: 'Moderate confidence',
    icon: ShieldQuestion,
    className: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300'
  },
  low: {
    label: 'Low confidence',
    icon: ShieldAlert,
    className: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300'
  }
};

export function ConfidenceBadge({ confidence, className }: { confidence: ChatConfidenceLevel; className?: string }) {
  const config = confidenceConfig[confidence];
  const Icon = config.icon;

  return (
    <Badge className={cn('gap-1.5', config.className, className)}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}
