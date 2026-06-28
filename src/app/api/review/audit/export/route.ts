import { listAuditEvents } from '@/lib/audit';
import { requireReviewerAccess } from '@/lib/reviewer-auth';

export async function GET(request: Request) {
  const access = await requireReviewerAccess();
  const { searchParams } = new URL(request.url);
  const event = searchParams.get('event') || undefined;
  const targetType = searchParams.get('targetType') || undefined;
  const targetId = searchParams.get('targetId') || undefined;

  const events = await listAuditEvents({
    scopeType: access.session.type,
    scopeId: access.session.id,
    event,
    targetType,
    targetId,
    limit: 200
  });

  return Response.json(
    {
      ok: true,
      exportedAt: new Date().toISOString(),
      count: events.length,
      filters: { event, targetType, targetId },
      events
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Disposition': 'attachment; filename="civicshield-audit-export.json"'
      }
    }
  );
}
