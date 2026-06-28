'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ReviewerRecord } from '@/lib/reviewer-auth';

export function ReviewerManagementPanel({ reviewers }: { reviewers: ReviewerRecord[] }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function addReviewer() {
    if (!email.trim()) return;
    setSaving(true);
    try {
      const response = await fetch('/api/reviewers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), notes })
      });
      if (!response.ok) throw new Error('Reviewer save failed');
      setEmail('');
      setNotes('');
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function toggleReviewer(reviewerId: string, active: boolean) {
    setSaving(true);
    try {
      const response = await fetch('/api/reviewers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerId, active })
      });
      if (!response.ok) throw new Error('Reviewer update failed');
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-5 lg:p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Reviewer management</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">Authorize reviewer access</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Manage durable reviewer records stored in the database. Environment allowlist fallback remains available for bootstrap access.
          </p>
        </div>
        <div className="mt-5 space-y-4">
          <Input value={email} onChange={(event) => setEmail(event.currentTarget.value)} placeholder="reviewer@example.com" />
          <Textarea value={notes} onChange={(event) => setNotes(event.currentTarget.value)} placeholder="Optional internal note for this reviewer record." />
          <Button type="button" variant="primary" onClick={addReviewer} disabled={saving || !email.trim()}>
            {saving ? 'Saving reviewer...' : 'Add or update reviewer'}
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {reviewers.map((reviewer) => (
          <Card key={reviewer.id} className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{reviewer.active ? 'Active' : 'Inactive'}</Badge>
              <Badge>{reviewer.email}</Badge>
            </div>
            {reviewer.notes ? <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{reviewer.notes}</p> : null}
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Updated {reviewer.updatedAt}</p>
            <div className="mt-4">
              <Button type="button" variant={reviewer.active ? 'secondary' : 'primary'} onClick={() => toggleReviewer(reviewer.id, !reviewer.active)} disabled={saving}>
                {reviewer.active ? 'Deactivate reviewer' : 'Activate reviewer'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
