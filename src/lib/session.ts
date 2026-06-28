import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';

export const GUEST_SESSION_COOKIE = 'civicshield_guest';
export const APP_SESSION_COOKIE = 'civicshield_session';

export type AppSession = {
  id: string;
  type: 'guest' | 'user';
  email?: string;
};

export async function getCurrentSession(): Promise<AppSession> {
  const store = await cookies();

  try {
    const session = await auth.api.getSession({ headers: new Headers({ cookie: store.toString() }) });

    if (session?.session?.id && session?.user?.id) {
      return {
        id: session.user.id,
        type: 'user',
        email: session.user.email
      };
    }
  } catch {
    // fall back to guest session
  }

  const existingGuest = store.get(GUEST_SESSION_COOKIE)?.value;
  const id = existingGuest || crypto.randomUUID();

  if (!existingGuest) {
    try {
      store.set(GUEST_SESSION_COOKIE, id, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30
      });
    } catch {
      // Middleware normally sets this cookie. Server Components cannot always
      // mutate cookies, so fall back to an in-memory request id instead of
      // crashing public/auth pages.
    }
  }

  return {
    id,
    type: 'guest'
  };
}
