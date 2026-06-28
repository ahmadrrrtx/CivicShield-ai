import { cookies } from 'next/headers';
import { jsonNoStore } from '@/lib/http';
import { GUEST_SESSION_COOKIE, getCurrentSession } from '@/lib/session';
import { getSettingsForScope, migrateFileSettingsToDatabase, migrateGuestSettingsToUser } from '@/lib/settings-repository';

export async function GET() {
  const session = await getCurrentSession();
  const cookieStore = await cookies();
  const guestId = cookieStore.get(GUEST_SESSION_COOKIE)?.value;

  if (session.type === 'user' && guestId) {
    await migrateGuestSettingsToUser(guestId, session.id);
  } else {
    await migrateFileSettingsToDatabase({ scopeType: session.type, scopeId: session.id });
  }

  const settings = await getSettingsForScope({ scopeType: session.type, scopeId: session.id });

  return jsonNoStore({
    ok: true,
    session,
    settings
  });
}
