import * as React from 'react';
import { cn } from '@/lib/utils';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[96px] w-full rounded-2xl border border-slate-200/80 bg-white/92 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition-all placeholder:text-slate-400 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800/80 dark:bg-slate-950/85 dark:text-white dark:placeholder:text-slate-500',
          className
        )}
        style={{ ['--tw-ring-color' as string]: 'var(--ring)' }}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
