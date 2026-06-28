import { aiProviders } from '@/lib/ai';
import { requireUserSession } from '@/lib/auth-guards';
import { getSettingsForScope } from '@/lib/settings-repository';
import { ApiKeyWizardCard } from '@/components/app/api-key-wizard-card';
import { ProviderStatusCard } from '@/components/app/provider-status-card';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { Card } from '@/components/ui/card';

export default async function SettingsPage() {
  const session = await requireUserSession();
  const settings = await getSettingsForScope({ scopeType: session.type, scopeId: session.id });
  const health = await Promise.all(aiProviders.map((provider) => provider.healthCheck()));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Settings</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white">Provider settings, privacy, and accessibility</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Groq is the only enabled model provider in this MVP. The architecture is intentionally prepared for future providers without coupling the app to a single vendor surface.
          </p>
        </div>
        <SignOutButton />
      </div>

      <Card className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Session mode</p>
        <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">Current access foundation</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          You are currently using <span className="font-semibold text-slate-900 dark:text-white">{session.type} mode</span> as <span className="font-semibold text-slate-900 dark:text-white">{session.email}</span>. Settings now prefer database-backed persistence when available and migrate guest settings into your account scope when possible.
        </p>
      </Card>

      <ApiKeyWizardCard groqKeyConfigured={settings.groqKeyConfigured} />

      <Card className="p-6 lg:p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Provider health</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">Current AI provider status</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {health.map((item) => (
            <ProviderStatusCard key={item.provider} name={item.provider.toUpperCase()} enabled={item.available || settings.groqKeyConfigured} message={item.message} />
          ))}
        </div>
      </Card>
    </div>
  );
}
