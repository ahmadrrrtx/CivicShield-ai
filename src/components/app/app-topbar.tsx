import Link from 'next/link';
import { Search, Bell, Globe2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MobileAppNav } from '@/components/app/mobile-app-nav';
import { SessionBadge } from '@/components/app/session-badge';

export function AppTopbar({
  sessionLabel = 'Guest session',
  sessionType = 'guest'
}: {
  sessionLabel?: string;
  sessionType?: 'guest' | 'user';
}) {
  const isUser = sessionType === 'user';

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-slate-900 dark:bg-slate-950/70 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <MobileAppNav />
          <div className="flex items-center gap-2">
            <SessionBadge label={sessionLabel} />
            {!isUser ? <Link href="/auth/sign-in" className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 dark:border-slate-800 dark:text-slate-200">Sign in</Link> : null}
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-600 transition-colors hover:bg-white dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300 dark:hover:bg-slate-950" aria-label="Change language">
              <Globe2 className="h-4 w-4" />
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-600 transition-colors hover:bg-white dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300 dark:hover:bg-slate-950" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input aria-label="Search conversations or resources" placeholder="Search conversations, saved resources, or official programs" className="pl-10" />
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <SessionBadge label={sessionLabel} />
            {!isUser ? <Link href="/auth/sign-in" className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 dark:border-slate-800 dark:text-slate-200">Sign in</Link> : null}
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-600 transition-colors hover:bg-white dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300 dark:hover:bg-slate-950" aria-label="Change language">
              <Globe2 className="h-4 w-4" />
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-600 transition-colors hover:bg-white dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300 dark:hover:bg-slate-950" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
