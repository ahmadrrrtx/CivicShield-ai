import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Wordmark } from '@/components/brand/logo';
import { marketingNav } from '@/config/navigation';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/82 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/78">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Link href="/" aria-label="CivicShield AI home" className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Marketing navigation">
          {marketingNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/auth/sign-in"
            className="hidden rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 sm:inline-flex dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className="hidden rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-800 dark:bg-slate-900/80 dark:text-white sm:inline-flex"
          >
            Create account
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5 hover:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            Ask now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
