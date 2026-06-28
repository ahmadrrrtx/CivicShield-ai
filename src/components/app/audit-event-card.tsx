import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { AuditEventRecord } from '@/lib/audit';

export function AuditEventCard({ event }: { event: AuditEventRecord }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{event.level.toUpperCase()}</Badge>
        <Badge>{event.event}</Badge>
        {event.targetType ? <Badge>{event.targetType}</Badge> : null}
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <p>
          <span className="font-medium text-slate-950 dark:text-white">Created:</span> {event.createdAt}
        </p>
        {event.actorId ? (
          <p>
            <span className="font-medium text-slate-950 dark:text-white">Actor:</span> {event.actorType ?? 'unknown'} · {event.actorId}
          </p>
        ) : null}
        {event.scopeId ? (
          <p>
            <span className="font-medium text-slate-950 dark:text-white">Scope:</span> {event.scopeType ?? 'unknown'} · {event.scopeId}
          </p>
        ) : null}
        {event.targetId ? (
          <p>
            <span className="font-medium text-slate-950 dark:text-white">Target:</span> {event.targetType ?? 'unknown'} · {event.targetId}
          </p>
        ) : null}
      </div>

      {event.payload ? (
        <pre className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200">
          {JSON.stringify(event.payload, null, 2)}
        </pre>
      ) : null}
    </Card>
  );
}
