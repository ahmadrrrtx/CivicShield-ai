import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <article className="prose-legal">{children}</article>
      </div>
      <SiteFooter />
    </main>
  );
}
