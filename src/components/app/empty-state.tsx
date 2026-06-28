import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function EmptyState({
  title,
  description,
  actionLabel
}: {
  title: string;
  description: string;
  actionLabel: string;
}) {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
        <Sparkles className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
      <Button className="mt-6">{actionLabel}</Button>
    </Card>
  );
}
