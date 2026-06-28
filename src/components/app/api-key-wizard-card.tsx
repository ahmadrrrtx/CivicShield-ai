'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function ApiKeyWizardCard({ groqKeyConfigured = false }: { groqKeyConfigured?: boolean }) {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!apiKey.trim()) return;
    setSaving(true);
    setStatus(null);

    try {
      const response = await fetch('/api/settings/provider-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider: 'groq',
          apiKey
        })
      });

      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Could not save the provider key.');
      }

      setApiKey('');
      setStatus('Groq key saved securely for this session scope.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not save the provider key.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-6 lg:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Groq setup</p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">Connect your Groq API key</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Groq is the default AI provider for this MVP. Add your key to enable fast, low-cost AI responses using the Groq API.
          </p>
        </div>
        <Badge>{groqKeyConfigured ? 'Configured' : 'Primary provider'}</Badge>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <p><span className="font-semibold text-slate-900 dark:text-white">What is Groq?</span> Groq provides hosted model inference with very fast response speeds and a developer-friendly API.</p>
          <p><span className="font-semibold text-slate-900 dark:text-white">How do I get a key?</span> Create a Groq account, open the API dashboard, generate a key, and paste it here.</p>
          <p><span className="font-semibold text-slate-900 dark:text-white">Security note:</span> Your key is never rendered back after save and is stored encrypted at rest in the current MVP foundation.</p>
        </div>
        <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <label htmlFor="groq-key" className="mb-2 block text-sm font-medium text-slate-900 dark:text-white">
            Groq API key
          </label>
          <Input id="groq-key" type="password" placeholder="gsk_..." value={apiKey} onChange={(event) => setApiKey(event.target.value)} />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={handleSave} disabled={saving || !apiKey.trim()}>{saving ? 'Saving…' : 'Save securely'}</Button>
            <Button variant="secondary">View setup guide</Button>
          </div>
          {status ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{status}</p> : null}
        </div>
      </div>
    </Card>
  );
}
