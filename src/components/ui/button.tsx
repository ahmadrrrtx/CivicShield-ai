import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-slate-950 text-white shadow-[0_14px_40px_rgba(15,23,42,0.16)] hover:-translate-y-0.5 hover:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100',
        secondary:
          'border border-slate-200/80 bg-white/88 text-slate-900 shadow-sm backdrop-blur-sm hover:-translate-y-0.5 hover:bg-white dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900',
        ghost:
          'text-slate-700 hover:bg-slate-100/90 dark:text-slate-200 dark:hover:bg-slate-900/90',
        danger: 'bg-rose-600 text-white shadow-[0_12px_32px_rgba(225,29,72,0.22)] hover:bg-rose-700'
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-5',
        lg: 'h-12 px-6'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        style={{ ['--tw-ring-color' as string]: 'var(--ring)' }}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
