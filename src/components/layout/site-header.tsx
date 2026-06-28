import Link from 'next/link';
import { Wordmark } from '@/components/brand/logo';
import { marketingNav } from '@/config/navigation';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-900 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" aria-label="CivicShield AI home">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {marketingNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/legal/ai-disclaimer" className="hidden text-sm font-medium text-slate-500 md:inline dark:text-slate-400">
            AI disclosure
          </Link>
          <Button variant="secondary">Launch demo</Button>
        </div>
      </div>
    </header>
  );
}
