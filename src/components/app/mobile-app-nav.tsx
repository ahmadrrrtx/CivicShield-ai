'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, MessageSquareText, Landmark, Siren, BookOpenText, History, Settings, X, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import { Wordmark } from '@/components/brand/logo';
import { dashboardNav } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const iconMap = {
  '/app': MessageSquareText,
  '/app/explore': Landmark,
  '/app/emergency': Siren,
  '/app/sources': BookOpenText,
  '/app/history': History,
  '/app/review': ClipboardCheck,
  '/app/settings': Settings
} as const;

function isActive(pathname: string, href: string) {
  if (href === '/app') return pathname === '/app';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileAppNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 lg:hidden">
        <Button type="button" variant="secondary" size="sm" className="rounded-2xl px-3" onClick={() => setOpen(true)} aria-label="Open app navigation">
          <Menu className="h-4 w-4" />
        </Button>
        <Wordmark />
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" aria-label="Close navigation overlay" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[88%] max-w-sm border-r border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
            <div className="flex items-center justify-between gap-3">
              <Wordmark />
              <Button type="button" variant="ghost" size="sm" className="rounded-2xl px-3" onClick={() => setOpen(false)} aria-label="Close app navigation">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="mt-8 space-y-2">
              {dashboardNav.map((item) => {
                const Icon = iconMap[item.href as keyof typeof iconMap];
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70',
                      active
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}

      <nav className="fixed bottom-3 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-[24px] border border-white/80 bg-white/92 px-2 py-2 shadow-[0_18px_50px_rgba(15,23,42,0.15)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
        {dashboardNav.slice(0, 5).map((item) => {
          const Icon = iconMap[item.href as keyof typeof iconMap];
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors',
                active
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
