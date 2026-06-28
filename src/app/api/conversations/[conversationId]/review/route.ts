import { z } from 'zod';
import { getConversationDetail, updateConversationReview } from '@/lib/conversations';
import { jsonError, jsonNoStore } from '@/lib/http';
import { getRequestId } from '@/lib/request';
import { requireReviewerAccess } from '@/lib/reviewer-auth';
import { persistAuditEvent } from '@/lib/audit';

const schema = z.object({
  status: z.enum(['open', 'in_review', 'resolved']),
  note: z.string().trim().max(2000).optional().or(z.literal(''))
});

export async function PATCH(request: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  const requestId = getRequestId(request as never);
  const { conversationId } = await params;
  const access = await requireReviewerAccess();
  const session = access.session;
  const scope = {
    scopeType: session.type,
    scopeId: session.id,
    userId: session.type === 'user' ? session.id : undefined
  } as const;

  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return jsonError('Invalid JSON payload.', 400, { requestId });
  }

  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return jsonError('Invalid review update payload.', 400, { requestId, issues: parsed.error.flatten() });
  }

  const updated = await updateConversationReview(scope, conversationId, {
    status: parsed.data.status,
    note: parsed.data.note || undefined
  });

  if (!updated) {
    return jsonError('Conversation not found or review update failed.', 404, { requestId, conversationId });
  }

  const conversation = await getConversationDetail(scope, conversationId);

  await persistAuditEvent({
    event: 'conversation.review_updated',
    level: 'info',
    actorType: 'user',
    actorId: session.id,
    scopeType: session.type,
    scopeId: session.id,
    targetType: 'conversation',
    targetId: conversationId,
    payload: {
      requestId,
      reviewerEmail: access.reviewerEmail,
      reviewStatus: parsed.data.status,
      noteLength: parsed.data.note?.length ?? 0
    }
  });

  return jsonNoStore({
    ok: true,
    conversationId,
    review: conversation?.review ?? {
      status: parsed.data.status,
      note: parsed.data.note || undefined,
      reviewedAt: new Date().toISOString()
    }
  });
}
