'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function HistoryFilters({
  initialQuery = '',
  initialPinned = false,
  initialGrounded = false,
  initialNeedsReview = false
}: {
  initialQuery?: string;
  initialPinned?: boolean;
  initialGrounded?: boolean;
  initialNeedsReview?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    router.push(`/app/history?${params.toString()}`);
  }

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            defaultValue={initialQuery}
            placeholder="Search titles, questions, or saved answers"
            className="pl-10"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                updateParam('q', (event.currentTarget as HTMLInputElement).value.trim());
              }
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant={initialPinned ? 'primary' : 'secondary'} size="sm" onClick={() => updateParam('pinned', initialPinned ? '' : 'true')}>
            {initialPinned ? 'Pinned only' : 'Filter pinned'}
          </Button>
          <Button variant={initialGrounded ? 'primary' : 'secondary'} size="sm" onClick={() => updateParam('grounded', initialGrounded ? '' : 'true')}>
            {initialGrounded ? 'Grounded only' : 'Filter grounded'}
          </Button>
          <Button
            variant={initialNeedsReview ? 'danger' : 'secondary'}
            size="sm"
            onClick={() => updateParam('needsReview', initialNeedsReview ? '' : 'true')}
          >
            {initialNeedsReview ? 'Needs review only' : 'Filter review-needed'}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => router.push('/app/history')}>
            <X className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
