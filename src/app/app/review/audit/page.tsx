import Link from 'next/link';
import { AuditEventList } from '@/components/app/audit-event-list';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { listAuditEvents } from '@/lib/audit';
import { requireReviewerAccess } from '@/lib/reviewer-auth';

export default async function ReviewAuditPage({
  searchParams
}: {
  searchParams?: Promise<{ event?: string; targetType?: string; targetId?: string }>;
}) {
  const access = await requireReviewerAccess();
  const session = access.session;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const event = resolvedSearchParams?.event?.trim() || undefined;
  const targetType = resolvedSearchParams?.targetType?.trim() || undefined;
  const targetId = resolvedSearchParams?.targetId?.trim() || undefined;

  const events = await listAuditEvents({
    scopeType: session.type,
    scopeId: session.id,
    event,
    targetType,
    targetId,
    limit: Number(process.env.REVIEW_AUDIT_PAGE_SIZE || 20)
  });

  const exportHref = `/api/review/audit/export${
    event || targetType || targetId
      ? `?${new URLSearchParams(
          Object.entries({ event, targetType, targetId }).filter(([, value]) => Boolean(value)) as Array<[string, string]>
        ).toString()}`
      : ''
  }`;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.14),transparent_28%)] p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <Badge className="border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/40 dark:bg-violet-950/30 dark:text-violet-300">
                Audit viewer
              </Badge>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white lg:text-4xl">
                Durable governance and reviewer audit records
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                This reviewer-gated surface displays persisted audit events for review operations and other tracked product actions within the current authorized scope.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>{events.length} events loaded</Badge>
                <Badge>Access source: {access.source}</Badge>
                {event ? <Badge>Filter: {event}</Badge> : null}
                {targetType ? <Badge>Target: {targetType}</Badge> : null}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={exportHref} className="inline-flex items-center rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
                Export JSON
              </a>
              <Link href="/app/review/reviewers" className="inline-flex items-center rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
                Manage reviewers
              </Link>
              <Link href="/app/review" className="inline-flex items-center rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
                Back to review queue
              </Link>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
          <Link href="/app/review/audit" className="underline-offset-4 hover:underline">
            Clear filters
          </Link>
          <Link href="/app/review/audit?event=conversation.review_updated" className="underline-offset-4 hover:underline">
            Review updates
          </Link>
          <Link href="/app/review/audit?event=reviewer.access_upserted" className="underline-offset-4 hover:underline">
            Reviewer grants
          </Link>
          <Link href="/app/review/audit?event=reviewer.access_status_updated" className="underline-offset-4 hover:underline">
            Reviewer status changes
          </Link>
        </div>
      </Card>

      <AuditEventList events={events} />
    </div>
  );
}
