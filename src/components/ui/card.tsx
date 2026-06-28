import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70 dark:shadow-[0_10px_40px_rgba(0,0,0,0.28)]',
        className
      )}
    >
      {children}
    </div>
  );
}
