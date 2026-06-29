import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('surface-card rounded-[28px] p-6', className)}>
      {children}
    </div>
  );
}
