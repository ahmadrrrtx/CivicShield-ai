import { Card } from '@/components/ui/card';
import type { AuditEventRecord } from '@/lib/audit';
import { AuditEventCard } from '@/components/app/audit-event-card';

export function AuditEventList({ events }: { events: AuditEventRecord[] }) {
  if (events.length === 0) {
    return (
      <Card className="p-6 lg:p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">No audit events</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">No persisted audit records are available yet</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Audit records will appear here when database-backed persistence is available and review or governance actions are written successfully.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <AuditEventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
