import { z } from 'zod';
import { jsonError, jsonNoStore } from '@/lib/http';
import { getRequestId } from '@/lib/request';
import { persistAuditEvent } from '@/lib/audit';
import { listReviewerAccessRecords, requireReviewerAccess, upsertReviewerAccess, updateReviewerAccessStatus } from '@/lib/reviewer-auth';

const createSchema = z.object({
  email: z.string().email(),
  active: z.boolean().optional(),
  notes: z.string().trim().max(1000).optional().or(z.literal(''))
});

const updateSchema = z.object({
  reviewerId: z.string().min(1),
  active: z.boolean()
});

export async function GET() {
  await requireReviewerAccess();
  const reviewers = await listReviewerAccessRecords();
  return jsonNoStore({ ok: true, reviewers });
}

export async function POST(request: Request) {
  const requestId = getRequestId(request as never);
  const access = await requireReviewerAccess();

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return jsonError('Invalid JSON payload.', 400, { requestId });
  }

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return jsonError('Invalid reviewer payload.', 400, { requestId, issues: parsed.error.flatten() });
  }

  const saved = await upsertReviewerAccess({
    email: parsed.data.email,
    active: parsed.data.active,
    notes: parsed.data.notes || undefined
  });

  if (!saved) {
    return jsonError('Reviewer record could not be saved.', 500, { requestId });
  }

  await persistAuditEvent({
    event: 'reviewer.access_upserted',
    level: 'info',
    actorType: 'user',
    actorId: access.session.id,
    scopeType: access.session.type,
    scopeId: access.session.id,
    targetType: 'reviewer_access',
    targetId: saved.id,
    payload: {
      requestId,
      reviewerEmail: saved.email,
      active: saved.active,
      accessSource: access.source
    }
  });

  return jsonNoStore({ ok: true, reviewer: saved });
}

export async function PATCH(request: Request) {
  const requestId = getRequestId(request as never);
  const access = await requireReviewerAccess();

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return jsonError('Invalid JSON payload.', 400, { requestId });
  }

  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return jsonError('Invalid reviewer update payload.', 400, { requestId, issues: parsed.error.flatten() });
  }

  const updated = await updateReviewerAccessStatus(parsed.data.reviewerId, parsed.data.active);

  if (!updated) {
    return jsonError('Reviewer record could not be updated.', 404, { requestId });
  }

  await persistAuditEvent({
    event: 'reviewer.access_status_updated',
    level: 'info',
    actorType: 'user',
    actorId: access.session.id,
    scopeType: access.session.type,
    scopeId: access.session.id,
    targetType: 'reviewer_access',
    targetId: updated.id,
    payload: {
      requestId,
      reviewerEmail: updated.email,
      active: updated.active,
      accessSource: access.source
    }
  });

  return jsonNoStore({ ok: true, reviewer: updated });
}
