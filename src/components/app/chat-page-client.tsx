'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChatComposer, NEED_OPTIONS, type NeedOptionValue } from '@/components/app/chat-composer';
import { ChatEmptyState } from '@/components/app/chat-empty-state';
import { ChatMessageList } from '@/components/app/chat-message-list';
import { SourcePanel } from '@/components/app/source-panel';
import { TrustMetricsPanel } from '@/components/app/trust-metrics-panel';
import { WhyThisAnswerPanel } from '@/components/app/why-this-answer-panel';
import { type ChatConfidenceLevel, type ChatMessageRecord, type ChatCitation } from '@/components/app/chat-demo-data';

function mapConfidence(confidence: number): ChatConfidenceLevel {
  if (confidence >= 0.75) return 'high';
  if (confidence >= 0.35) return 'moderate';
  return 'low';
}

function mapCitations(
  citations: Array<{
    title: string;
    url: string;
    excerpt: string;
    country?: string;
    department?: string;
    lastUpdated?: string;
    verified?: boolean;
    freshness?: 'fresh' | 'aging' | 'stale';
    traceId?: string;
  }>
): ChatCitation[] {
  return citations.map((citation, index) => ({
    id: `live-citation-${index + 1}`,
    title: citation.title,
    url: citation.url,
    department: citation.department ?? 'Unspecified department',
    country: citation.country ?? 'Unspecified country',
    lastUpdated: citation.lastUpdated ?? 'Unknown',
    summary: citation.excerpt,
    verified: citation.verified,
    freshness: citation.freshness,
    traceId: citation.traceId
  }));
}

export function ChatPageClient({
  initialMessages,
  initialCitations,
  conversationId,
  sessionLabel,
  conversationTitle,
  initialPrompt,
  initialCountry
}: {
  initialMessages: ChatMessageRecord[];
  initialCitations: ChatCitation[];
  conversationId?: string;
  sessionLabel: string;
  conversationTitle?: string;
  initialPrompt?: string;
  initialCountry?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialPrompt ?? '');
  const [country, setCountry] = useState(initialCountry || 'United States');
  const [need, setNeed] = useState<NeedOptionValue>('benefits');
  const [messages, setMessages] = useState<ChatMessageRecord[]>(initialMessages);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCitations, setActiveCitations] = useState<ChatCitation[]>(initialCitations);

  const hasLiveConversation = messages.length > 0;
  const latestAssistant = [...messages].reverse().find((message) => message.role === 'assistant' && !message.isStreaming);
  const selectedNeed = NEED_OPTIONS.find((item) => item.value === need) ?? NEED_OPTIONS[0];

  function handlePromptSelect(prompt: string, nextNeed: NeedOptionValue) {
    setQuery(prompt);
    setNeed(nextNeed);
  }

  async function handleSubmit() {
    const trimmed = query.trim();
    if (!trimmed || isSubmitting) return;

    const userMessage: ChatMessageRecord = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: 'Just now'
    };

    const placeholderId = `assistant-${Date.now()}`;
    const placeholderMessage: ChatMessageRecord = {
      id: placeholderId,
      role: 'assistant',
      content: 'Checking official sources, verifying citations, and preparing safe next steps.',
      timestamp: 'Just now',
      confidence: 'low',
      isStreaming: true
    };

    setMessages((current) => [...current, userMessage, placeholderMessage]);
    setQuery('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `${trimmed}\n\nHelp type: ${selectedNeed.label}. Retrieval hint: ${selectedNeed.hint}.` }],
          country,
          departmentHint: selectedNeed.hint,
          conversationId
        })
      });

      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
        data?: {
          text: string;
          confidence: number;
          grounded: boolean;
          citations: Array<{
            title: string;
            url: string;
            excerpt: string;
            country?: string;
            department?: string;
            lastUpdated?: string;
            verified?: boolean;
            freshness?: 'fresh' | 'aging' | 'stale';
            traceId?: string;
          }>;
        };
      };

      if (!response.ok || !payload.ok || !payload.data) {
        throw new Error(payload.error || 'Chat request failed.');
      }

      const mappedCitations = mapCitations(payload.data.citations);
      setActiveCitations((current) => (mappedCitations.length > 0 ? mappedCitations : current));

      setMessages((current) =>
        current.map((message): ChatMessageRecord =>
          message.id === placeholderId
            ? {
                id: placeholderId,
                role: 'assistant',
                content: payload.data?.text ?? 'No response available.',
                timestamp: 'Just now',
                confidence: mapConfidence(payload.data?.confidence ?? 0),
                disclaimer:
                  typeof payload.data?.confidence === 'number' && payload.data.confidence <= 0.2
                    ? 'I cannot confidently verify this information.'
                    : undefined,
                citations: mappedCitations,
                isStreaming: false,
                isError: !payload.data?.grounded
              }
            : message
        )
      );

      if (conversationId) {
        router.refresh();
      }
    } catch (error) {
      setMessages((current) =>
        current.map((message): ChatMessageRecord =>
          message.id === placeholderId
            ? {
                id: placeholderId,
                role: 'assistant',
                content: error instanceof Error ? error.message : 'The service could not complete this request safely.',
                timestamp: 'Just now',
                confidence: 'low',
                disclaimer: 'I cannot confidently verify this information.',
                isStreaming: false,
                isError: true,
                citations: []
              }
            : message
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRetry() {
    if (!conversationId || isSubmitting) return;

    const placeholderId = `assistant-regenerate-${Date.now()}`;
    const placeholderMessage: ChatMessageRecord = {
      id: placeholderId,
      role: 'assistant',
      content: 'Re-running fresh official retrieval and regenerating the latest assistant answer from verified evidence.',
      timestamp: 'Just now',
      confidence: 'low',
      isStreaming: true
    };

    setMessages((current) => [...current, placeholderMessage]);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/conversations/${conversationId}/retry`, {
        method: 'POST'
      });

      const payload = (await response.json()) as {
        ok: boolean;
        regenerated?: boolean;
        error?: string;
        data?: {
          text: string;
          confidence: number;
          grounded: boolean;
          citations: Array<{
            title: string;
            url: string;
            excerpt: string;
            country?: string;
            department?: string;
            lastUpdated?: string;
            verified?: boolean;
            freshness?: 'fresh' | 'aging' | 'stale';
            traceId?: string;
          }>;
        };
      };

      if (!response.ok || !payload.ok || !payload.regenerated || !payload.data) {
        throw new Error(payload.error || 'Regenerate request failed.');
      }

      const mappedCitations = mapCitations(payload.data.citations);
      setActiveCitations((current) => (mappedCitations.length > 0 ? mappedCitations : current));

      setMessages((current) =>
        current.map((message): ChatMessageRecord =>
          message.id === placeholderId
            ? {
                id: placeholderId,
                role: 'assistant',
                content: payload.data?.text ?? 'No regenerated response available.',
                timestamp: 'Just now',
                confidence: mapConfidence(payload.data?.confidence ?? 0),
                disclaimer:
                  typeof payload.data?.confidence === 'number' && payload.data.confidence <= 0.2
                    ? 'I cannot confidently verify this information.'
                    : undefined,
                citations: mappedCitations,
                isStreaming: false,
                isError: !payload.data?.grounded
              }
            : message
        )
      );

      router.refresh();
    } catch (error) {
      setMessages((current) =>
        current.map((message): ChatMessageRecord =>
          message.id === placeholderId
            ? {
                id: placeholderId,
                role: 'assistant',
                content: error instanceof Error ? error.message : 'The service could not regenerate this answer safely.',
                timestamp: 'Just now',
                confidence: 'low',
                disclaimer: 'I cannot confidently verify this information.',
                isStreaming: false,
                isError: true,
                citations: []
              }
            : message
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const citationsForPanel = useMemo(() => activeCitations, [activeCitations]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_28%)] p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
                {sessionLabel}
              </Badge>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white lg:text-4xl">
                {conversationId ? 'Continue your verified conversation.' : 'What do you need help with today?'}
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Choose your country and help type first. CivicShield will check official sources, show confidence, and avoid guessing when evidence is weak.
              </p>
              {conversationTitle ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge>{conversationTitle}</Badge>
                  <Link href="/app" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                    Start a new conversation
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
          <div className="mt-6">
            <ChatComposer
              value={query}
              onChange={setQuery}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              country={country}
              onCountryChange={setCountry}
              need={need}
              onNeedChange={setNeed}
            />
          </div>
        </div>
      </Card>

      {!hasLiveConversation ? <ChatEmptyState onPromptSelect={handlePromptSelect} /> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <Card className="p-5 lg:p-7">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Conversation</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
              {conversationId ? 'Resumed conversation' : 'Your answer workspace'}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {conversationId
                ? 'Recent transcript context is used only to maintain continuity. Each new answer still depends on newly retrieved verified evidence.'
                : 'Your conversation stays focused on plain-language next steps, visible citations, and confidence signals.'}
            </p>
          </div>
          <div className="mt-6">
            <ChatMessageList messages={messages} conversationId={conversationId} onRetry={handleRetry} retryDisabled={isSubmitting} />
          </div>
        </Card>

        <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <TrustMetricsPanel citations={citationsForPanel} latestConfidence={latestAssistant?.confidence} country={country} />
          <WhyThisAnswerPanel citations={citationsForPanel} confidence={latestAssistant?.confidence} />
          <SourcePanel citations={citationsForPanel} />
        </div>
      </div>
    </div>
  );
}
