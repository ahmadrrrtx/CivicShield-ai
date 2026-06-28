import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/session';

export async function requireUserSession() {
  const session = await getCurrentSession();
  if (session.type !== 'user') {
    redirect('/auth/sign-in');
  }
  return session;
}

export async function redirectIfAuthenticated() {
  const session = await getCurrentSession();
  if (session.type === 'user') {
    redirect('/app/settings');
  }
  return session;
}
