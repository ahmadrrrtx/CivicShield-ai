'use client';

import { useState } from 'react';
import { Paperclip, SendHorizonal, ShieldCheck } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  isSubmitting
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="rounded-[28px] border border-white/80 bg-white/90 p-4 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
          <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
          Grounded answer mode
        </Badge>
        <p className="text-xs text-slate-500 dark:text-slate-400">Responses should cite official public sources and show confidence before you rely on them.</p>
      </div>
      <div className="mt-4">
        <Textarea
          aria-label="Ask CivicShield AI"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && !isSubmitting && value.trim()) {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Ask a question about benefits, public services, emergency support, or official agency processes…"
          className="min-h-[132px] resize-none border-transparent bg-slate-50/80 dark:bg-slate-900/80"
        />
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="ghost" size="sm" className="gap-2 rounded-xl px-3" disabled>
            <Paperclip className="h-3.5 w-3.5" />
            Attach notes
          </Button>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isFocused ? 'Press Ctrl/Cmd + Enter to submit.' : 'Future milestone: file-aware evidence upload with validation and redaction checks.'}
          </span>
        </div>
        <Button type="button" className="gap-2" onClick={onSubmit} disabled={isSubmitting || !value.trim()}>
          <SendHorizonal className="h-4 w-4" />
          {isSubmitting ? 'Verifying sources…' : 'Start grounded answer'}
        </Button>
      </div>
    </div>
  );
}
