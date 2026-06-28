import Link from 'next/link';
import { siteConfig } from '@/config/site';

const legalLinks = [
  { label: 'Privacy Policy', href: siteConfig.links.privacy },
  { label: 'Terms of Service', href: siteConfig.links.terms },
  { label: 'Cookie Policy', href: siteConfig.links.cookies },
  { label: 'AI Disclaimer', href: siteConfig.links.ai },
  { label: 'Accessibility Statement', href: siteConfig.links.accessibility },
  { label: 'Security Statement', href: siteConfig.links.security },
  { label: 'Responsible AI', href: siteConfig.links.responsibleAi }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/70 dark:border-slate-900 dark:bg-slate-950/70">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">CivicShield AI</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Trusted AI guidance for public services, grounded in official sources. CivicShield AI explains public information and never makes final legal, medical, or government decisions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200/70 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 CivicShield AI. Built for trustworthy civic guidance.</p>
          <p>Use official agencies for final determinations and urgent support.</p>
        </div>
      </div>
    </footer>
  );
}
