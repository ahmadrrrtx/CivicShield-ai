import { z } from 'zod';
import { auditLog } from '@/lib/audit';
import { jsonError, jsonNoStore } from '@/lib/http';
import { getRequestId } from '@/lib/request';
import { getCurrentSession } from '@/lib/session';
import { saveProviderKeyForScope } from '@/lib/settings-repository';

const schema = z.object({
  provider: z.literal('groq'),
  apiKey: z.string().min(10).max(300)
});

export async function POST(request: Request) {
  const requestId = getRequestId(request as never);
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return jsonError('Invalid JSON payload.', 400, { requestId });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return jsonError('Invalid provider key payload.', 400, { requestId });
  }

  const session = await getCurrentSession();
  const settings = await saveProviderKeyForScope({ scopeType: session.type, scopeId: session.id }, parsed.data.apiKey);

  auditLog('settings.provider_key_saved', {
    requestId,
    scopeId: session.id,
    scopeType: session.type,
    provider: parsed.data.provider,
    persistence: settings.persistence
  });

  return jsonNoStore({
    ok: true,
    requestId,
    session,
    settings
  });
}
