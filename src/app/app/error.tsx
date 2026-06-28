'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="py-10">
      <Card className="mx-auto max-w-2xl p-6 lg:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-rose-50 p-3 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-400">Something went wrong</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">The app surface could not be rendered safely.</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Try loading the page again. If the issue continues, review recent changes, server logs, and route-specific data dependencies before retrying.
            </p>
            <div className="mt-5">
              <Button type="button" onClick={() => reset()}>Try again</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
