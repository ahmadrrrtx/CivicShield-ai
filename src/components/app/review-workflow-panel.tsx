'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { ConversationReviewStatus } from '@/lib/conversations';

function formatStatusLabel(status: ConversationReviewStatus) {
  if (status === 'in_review') return 'In review';
  if (status === 'resolved') return 'Resolved';
  return 'Open';
}

export function ReviewWorkflowPanel({
  conversationId,
  initialStatus,
  initialNote,
  reviewedAt
}: {
  conversationId: string;
  initialStatus: ConversationReviewStatus;
  initialNote?: string;
  reviewedAt?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ConversationReviewStatus>(initialStatus);
  const [note, setNote] = useState(initialNote ?? '');
  const [saving, setSaving] = useState(false);

  async function saveReview() {
    setSaving(true);
    try {
      const response = await fetch(`/api/conversations/${conversationId}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          note
        })
      });

      if (!response.ok) {
        throw new Error('Review update failed');
      }

      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-5 lg:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{formatStatusLabel(status)}</Badge>
        {reviewedAt ? <Badge>Last reviewed recorded</Badge> : <Badge>Not reviewed yet</Badge>}
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-white">Review workflow</p>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Move this conversation through a lightweight review lifecycle and attach an internal reviewer note.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant={status === 'open' ? 'primary' : 'secondary'} size="sm" onClick={() => setStatus('open')} disabled={saving}>
            Open
          </Button>
          <Button type="button" variant={status === 'in_review' ? 'primary' : 'secondary'} size="sm" onClick={() => setStatus('in_review')} disabled={saving}>
            In review
          </Button>
          <Button type="button" variant={status === 'resolved' ? 'primary' : 'secondary'} size="sm" onClick={() => setStatus('resolved')} disabled={saving}>
            Resolved
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-950 dark:text-white" htmlFor="review-note">
            Reviewer note
          </label>
          <Textarea
            id="review-note"
            value={note}
            onChange={(event) => setNote(event.currentTarget.value)}
            placeholder="Document why this conversation was reviewed, what was validated, and whether follow-up is still needed."
            className="mt-2 min-h-[140px]"
            disabled={saving}
          />
        </div>

        <Button type="button" variant="primary" onClick={saveReview} disabled={saving}>
          {saving ? 'Saving review...' : 'Save review workflow'}
        </Button>
      </div>
    </Card>
  );
}
