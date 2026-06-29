import { cn } from '@/lib/utils';

export function Badge({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-slate-200/80 bg-white/86 px-3 py-1.5 text-[0.72rem] font-bold tracking-[0.02em] text-slate-700 shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-200',
        className
      )}
    >
      {children}
    </span>
  );
}
