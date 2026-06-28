import { z } from 'zod';
import { auditLog } from '@/lib/audit';
import { setMessageFeedback } from '@/lib/conversations';
import { jsonError, jsonNoStore } from '@/lib/http';
import { getCurrentSession } from '@/lib/session';

const schema = z.object({
  feedback: z.enum(['helpful', 'needs_review']).nullable()
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ conversationId: string; messageId: string }> }
) {
  const { conversationId, messageId } = await params;
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return jsonError('Invalid JSON payload.', 400);
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return jsonError('Invalid feedback payload.', 400);
  }

  const session = await getCurrentSession();
  const updated = await setMessageFeedback(
    {
      scopeType: session.type,
      scopeId: session.id,
      userId: session.type === 'user' ? session.id : undefined
    },
    conversationId,
    messageId,
    parsed.data.feedback
  );

  if (!updated) {
    return jsonError('Message not found or feedback could not be saved.', 404);
  }

  auditLog('conversation.message_feedback_saved', {
    conversationId,
    messageId,
    sessionType: session.type,
    feedback: parsed.data.feedback
  });

  return jsonNoStore({ ok: true, updated: true });
}
