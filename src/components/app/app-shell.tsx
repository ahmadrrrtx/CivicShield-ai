import { getCurrentSession } from '@/lib/session';
import { AppShellClient } from '@/components/app/app-shell-client';

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();

  return (
    <AppShellClient
      sessionType={session.type}
      sessionLabel={session.type === 'guest' ? 'Guest session' : 'Account session'}
    >
      {children}
    </AppShellClient>
  );
}
