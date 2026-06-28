'use client';

import { useState } from 'react';
import { AlertTriangle, Bot, Check, Copy, FileText, RotateCcw, ShieldCheck, Sparkles, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfidenceBadge } from '@/components/app/confidence-badge';
import { ChatTypingPlaceholder } from '@/components/app/chat-typing-placeholder';
import type { ChatMessageRecord } from '@/components/app/chat-demo-data';

type MessageActionsProps = {
  conversationId?: string;
  message: ChatMessageRecord;
  onRetry?: () => void;
  retryDisabled?: boolean;
};

function MessageActions({ conversationId, message, onRetry, retryDisabled }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'helpful' | 'needs_review' | undefined>(message.feedback);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  async function saveFeedback(nextFeedback: 'helpful' | 'needs_review') {
    if (!conversationId) return;
    setLoadingFeedback(true);
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages/${message.id}/feedback`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: feedback === nextFeedback ? null : nextFeedback })
      });
      if (!response.ok) throw new Error('Feedback save failed');
      setFeedback((current) => (current === nextFeedback ? undefined : nextFeedback));
    } finally {
      setLoadingFeedback(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-4">
      <Button variant="ghost" size="sm" className="gap-2 rounded-xl px-3 text-xs" onClick={copyMessage}>{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied' : 'Copy'}</Button>
      <Button variant="ghost" size="sm" className="gap-2 rounded-xl px-3 text-xs" onClick={onRetry} disabled={!onRetry || retryDisabled}><RotateCcw className="h-3.5 w-3.5" /> Retry</Button>
      <Button variant={feedback === 'helpful' ? 'primary' : 'ghost'} size="sm" className="gap-2 rounded-xl px-3 text-xs" onClick={() => saveFeedback('helpful')} disabled={!conversationId || loadingFeedback}><ThumbsUp className="h-3.5 w-3.5" /> Helpful</Button>
      <Button variant={feedback === 'needs_review' ? 'danger' : 'ghost'} size="sm" className="gap-2 rounded-xl px-3 text-xs" onClick={() => saveFeedback('needs_review')} disabled={!conversationId || loadingFeedback}><ThumbsDown className="h-3.5 w-3.5" /> Needs review</Button>
    </div>
  );
}

function AnswerQualityStrip({ message }: { message: ChatMessageRecord }) {
  const citationCount = message.citations?.length ?? 0;
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-3 text-xs dark:border-slate-800 dark:bg-slate-900/60"><FileText className="mb-1 h-4 w-4 text-blue-500" /><strong className="text-slate-950 dark:text-white">{citationCount}</strong><span className="ml-1 text-slate-500 dark:text-slate-400">citations</span></div>
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-3 text-xs dark:border-slate-800 dark:bg-slate-900/60"><ShieldCheck className="mb-1 h-4 w-4 text-emerald-500" /><strong className="text-slate-950 dark:text-white">{message.isError ? 'Review' : 'Grounded'}</strong><span className="ml-1 text-slate-500 dark:text-slate-400">status</span></div>
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-3 text-xs dark:border-slate-800 dark:bg-slate-900/60"><Sparkles className="mb-1 h-4 w-4 text-indigo-500" /><strong className="text-slate-950 dark:text-white">Plain</strong><span className="ml-1 text-slate-500 dark:text-slate-400">next steps</span></div>
    </div>
  );
}

export function ChatMessage({ message, conversationId, onRetry, retryDisabled }: { message: ChatMessageRecord; conversationId?: string; onRetry?: () => void; retryDisabled?: boolean }) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className="flex w-full max-w-[52rem] gap-3">
        {isAssistant && <div className="mt-1 hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-lg shadow-blue-500/20 sm:flex">{message.isError ? <AlertTriangle className="h-5 w-5" /> : <Bot className="h-5 w-5" />}</div>}
        <Card className={`w-full ${isAssistant ? 'rounded-[30px] bg-white/92 dark:bg-slate-950/78' : 'rounded-[30px] bg-slate-950 text-white dark:bg-white dark:text-slate-950'}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className={`flex h-9 w-9 items-center justify-center rounded-2xl sm:hidden ${isAssistant ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-white/15 text-white dark:bg-slate-950/10 dark:text-slate-950'}`}>{isAssistant ? (message.isError ? <AlertTriangle className="h-4 w-4" /> : <Bot className="h-4 w-4" />) : <User className="h-4 w-4" />}</div>
              <div><p className={`text-sm font-black ${isAssistant ? 'text-slate-950 dark:text-white' : 'text-white dark:text-slate-950'}`}>{isAssistant ? 'CivicShield AI' : 'You'}</p><p className={`text-xs ${isAssistant ? 'text-slate-500 dark:text-slate-400' : 'text-white/70 dark:text-slate-700'}`}>{message.timestamp}</p></div>
            </div>
            {message.confidence ? <ConfidenceBadge confidence={message.confidence} /> : null}
          </div>

          <div className={`mt-4 space-y-4 text-sm leading-7 ${isAssistant ? 'text-slate-700 dark:text-slate-200' : 'text-white/95 dark:text-slate-900'}`}>
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.disclaimer ? <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 font-semibold text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">{message.disclaimer}</div> : null}
            {isAssistant && !message.isStreaming ? <AnswerQualityStrip message={message} /> : null}
            {message.feedback ? <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">Quality signal recorded: {message.feedback === 'helpful' ? 'Helpful' : 'Needs review'}.</div> : null}
            {message.isStreaming ? <ChatTypingPlaceholder /> : null}
          </div>
          {isAssistant ? <MessageActions conversationId={conversationId} message={message} onRetry={onRetry} retryDisabled={retryDisabled} /> : null}
        </Card>
      </div>
    </div>
  );
}
