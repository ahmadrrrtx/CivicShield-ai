import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';
import { jsonNoStore } from '@/lib/http';
import { APP_SESSION_COOKIE, GUEST_SESSION_COOKIE } from '@/lib/session';

export async function POST() {
  const store = await cookies();

  try {
    await auth.api.signOut({
      headers: new Headers({ cookie: store.toString() })
    });
  } catch {
    // continue with defensive local cookie cleanup
  }

  store.delete(APP_SESSION_COOKIE);
  store.delete(GUEST_SESSION_COOKIE);

  return jsonNoStore({
    ok: true,
    signedOut: true
  });
}
