'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pin, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function HistoryActions({
  conversationId,
  initialTitle,
  pinned = false
}: {
  conversationId: string;
  initialTitle: string;
  pinned?: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [loading, setLoading] = useState(false);

  async function update(payload: { title?: string; pinned?: boolean }) {
    setLoading(true);
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Update failed');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function removeConversation() {
    setLoading(true);
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Delete failed');
      router.push('/app/history');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function submitRename() {
    if (!title.trim()) return;
    await update({ title: title.trim() });
    setEditing(false);
  }

  return (
    <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Manage</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">Conversation controls</h3>
      </div>

      {editing ? (
        <div className="space-y-3">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} />
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={submitRename} disabled={loading}>
              Save title
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)} disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" className="gap-2" onClick={() => setEditing((value) => !value)} disabled={loading}>
          <Pencil className="h-4 w-4" />
          Rename
        </Button>
        <Button variant="ghost" size="sm" className="gap-2" onClick={() => update({ pinned: !pinned })} disabled={loading}>
          <Pin className="h-4 w-4" />
          {pinned ? 'Unpin' : 'Pin'}
        </Button>
        <Button variant="danger" size="sm" className="gap-2" onClick={removeConversation} disabled={loading}>
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
