import { SourceAttributionCard } from '@/components/app/source-attribution-card';

export default function SourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Sources</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">Official source transparency</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Every grounded response should show which official sources support the answer, along with freshness, jurisdiction, and department metadata.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <SourceAttributionCard
          title="Housing stability support"
          department="Local Housing Authority"
          country="United States"
          lastUpdated="2026-03-08"
          confidence="High confidence"
        />
        <SourceAttributionCard
          title="Food assistance intake"
          department="Department of Human Services"
          country="United States"
          lastUpdated="2025-11-14"
          confidence="Moderate confidence"
        />
      </div>
    </div>
  );
}
