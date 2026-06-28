import Link from 'next/link';
import { MessageSquareText, Landmark, Siren, BookOpenText, History, Settings, ShieldCheck, ClipboardCheck } from 'lucide-react';
import { Wordmark } from '@/components/brand/logo';
import { cn } from '@/lib/utils';
import { dashboardNav } from '@/config/navigation';

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

export function AppSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden w-80 shrink-0 border-r border-slate-200/70 bg-white/80 px-5 py-6 backdrop-blur-xl dark:border-slate-900 dark:bg-slate-950/70 lg:flex lg:flex-col">
      <div className="px-2">
        <Wordmark />
      </div>
      <div className="mt-8 rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 dark:border-blue-950/50 dark:from-blue-950/30 dark:to-slate-950">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-slate-950 p-2 text-white dark:bg-white dark:text-slate-950">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Trust mode enabled</p>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Official-source grounding, visible citations, and cautious answer framing are part of the product baseline.
            </p>
          </div>
        </div>
      </div>
      <nav className="mt-8 space-y-1">
        {dashboardNav.map((item) => {
          const Icon = iconMap[item.href as keyof typeof iconMap];
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70',
                active
                  ? 'bg-slate-950 text-white shadow-[0_10px_30px_rgba(15,23,42,0.16)] dark:bg-white dark:text-slate-950'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-[24px] border border-slate-200/70 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Current mode</p>
        <p className="mt-2 text-sm font-medium text-slate-950 dark:text-white">Guest mode</p>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
          You can explore guidance without creating an account. Saved history and provider settings come later with sign-in.
        </p>
      </div>
    </aside>
  );
}
