'use client';

import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/app/app-sidebar';
import { AppTopbar } from '@/components/app/app-topbar';

export function AppShellClient({
  children,
  sessionLabel,
  sessionType
}: {
  children: React.ReactNode;
  sessionLabel: string;
  sessionType: 'guest' | 'user';
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-transparent">
      <AppSidebar pathname={pathname} />
      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        <AppTopbar sessionLabel={sessionLabel} sessionType={sessionType} />
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
