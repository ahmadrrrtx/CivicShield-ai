import { getRuntimeDiagnostics } from '@/lib/env';
import { jsonNoStore } from '@/lib/http';
import { getCurrentSession } from '@/lib/session';

export async function GET() {
  const session = await getCurrentSession();

  return jsonNoStore({
    ok: true,
    service: 'civicshield-ai',
    timestamp: new Date().toISOString(),
    diagnostics: getRuntimeDiagnostics(),
    sessionMode: session.type,
    persistence: {
      settings: 'hybrid-db-with-file-fallback',
      auth: 'better-auth-foundation'
    },
    execution: {
      providerKeyResolution: 'session-aware'
    }
  });
}
