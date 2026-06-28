import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-950 shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 dark:border-slate-800 dark:bg-slate-950/80 dark:text-white dark:placeholder:text-slate-500',
        className
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';
