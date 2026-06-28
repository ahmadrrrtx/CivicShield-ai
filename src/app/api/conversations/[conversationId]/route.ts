import { z } from 'zod';
import { deleteConversation, updateConversationMetadata } from '@/lib/conversations';
import { jsonError, jsonNoStore } from '@/lib/http';
import { getCurrentSession } from '@/lib/session';

const patchSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  pinned: z.boolean().optional()
});

export async function PATCH(request: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params;
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return jsonError('Invalid JSON payload.', 400);
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return jsonError('Invalid conversation update payload.', 400);
  }

  const session = await getCurrentSession();
  const updated = await updateConversationMetadata(
    {
      scopeType: session.type,
      scopeId: session.id,
      userId: session.type === 'user' ? session.id : undefined
    },
    conversationId,
    parsed.data
  );

  if (!updated) {
    return jsonError('Conversation not found or could not be updated.', 404);
  }

  return jsonNoStore({ ok: true, updated: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params;
  const session = await getCurrentSession();
  const deleted = await deleteConversation(
    {
      scopeType: session.type,
      scopeId: session.id,
      userId: session.type === 'user' ? session.id : undefined
    },
    conversationId
  );

  if (!deleted) {
    return jsonError('Conversation not found or could not be deleted.', 404);
  }

  return jsonNoStore({ ok: true, deleted: true });
}
