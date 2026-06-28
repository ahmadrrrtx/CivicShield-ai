import { db } from '@/lib/db';
import type { ChatCitation, ChatConfidenceLevel, ChatMessageRecord } from '@/components/app/chat-demo-data';

export type ConversationScope = {
  scopeType: 'guest' | 'user';
  scopeId: string;
  userId?: string;
};

export type SaveConversationInput = {
  scope: ConversationScope;
  title: string;
  latestUserMessage: string;
  latestAnswer: string;
  confidence: number;
  grounded: boolean;
  provider: string;
  model: string;
  citationCount: number;
  country?: string;
  transcript: ChatMessageRecord[];
};

export type ConversationReviewStatus = 'open' | 'in_review' | 'resolved';

export type ConversationHistoryQuery = {
  q?: string;
  pinned?: boolean;
  grounded?: boolean;
  needsReview?: boolean;
  sessionType?: 'guest' | 'user';
};

export type ConversationHistoryItem = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  pinned: boolean;
  sessionType: 'guest' | 'user';
  confidence: number;
  grounded: boolean;
  citationCount: number;
  country?: string;
  needsReview: boolean;
  reviewStatus: ConversationReviewStatus;
};

export type ConversationDetail = {
  id: string;
  title: string;
  updatedAt: string;
  sessionType: 'guest' | 'user';
  pinned: boolean;
  grounded: boolean;
  confidence: number;
  citationCount: number;
  country?: string;
  messages: ChatMessageRecord[];
  citations: ChatCitation[];
  quality: {
    helpfulCount: number;
    needsReviewCount: number;
    assistantMessageCount: number;
  };
  review: {
    status: ConversationReviewStatus;
    note?: string;
    reviewedAt?: string;
  };
};

export type ReviewQueueItem = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  sessionType: 'guest' | 'user';
  grounded: boolean;
  citationCount: number;
  country?: string;
  helpfulCount: number;
  needsReviewCount: number;
  assistantMessageCount: number;
  priority: 'high' | 'medium';
  reviewStatus: ConversationReviewStatus;
  reviewNote?: string;
  reviewedAt?: string;
};

export type ConversationQualityDashboardMetrics = {
  totalConversations: number;
  groundedConversations: number;
  needsReviewConversations: number;
  pinnedConversations: number;
  assistantMessages: number;
  helpfulSignals: number;
  needsReviewSignals: number;
  openReviews: number;
  inReviewConversations: number;
  resolvedReviews: number;
  reviewRate: number;
  groundedRate: number;
};

export type ConversationContextMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ConversationContext = {
  conversationId: string;
  title: string;
  messages: ConversationContextMessage[];
};

function buildConversationTitle(message: string) {
  const trimmed = message.trim();
  if (!trimmed) return 'Untitled conversation';
  if (trimmed.length <= 64) return trimmed;
  return `${trimmed.slice(0, 61).trimEnd()}...`;
}

function normalizeReviewStatus(value?: string | null): ConversationReviewStatus {
  if (value === 'in_review' || value === 'resolved') return value;
  return 'open';
}

function serializeCitations(citations?: ChatCitation[]) {
  if (!citations || citations.length === 0) return null;
  return JSON.stringify(citations);
}

function parseCitations(value?: string | null): ChatCitation[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean) as ChatCitation[];
  } catch {
    return [];
  }
}

function normalizeRole(role: string): 'user' | 'assistant' {
  return role === 'assistant' ? 'assistant' : 'user';
}

function formatMessageTimestamp(date: Date) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function mapMessageRecord(message: {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
  confidence: string | null;
  disclaimer: string | null;
  citationsJson: string | null;
  isError: boolean;
  feedback: string | null;
}): ChatMessageRecord {
  return {
    id: message.id,
    role: normalizeRole(message.role),
    content: message.content,
    timestamp: formatMessageTimestamp(message.createdAt),
    confidence: (message.confidence as ChatConfidenceLevel | null) ?? undefined,
    disclaimer: message.disclaimer ?? undefined,
    citations: parseCitations(message.citationsJson),
    isError: message.isError,
    feedback:
      message.feedback === 'helpful' || message.feedback === 'needs_review'
        ? message.feedback
        : undefined
  };
}

function buildQualitySummary(messages: ChatMessageRecord[]) {
  const assistantMessages = messages.filter((message) => message.role === 'assistant');
  return {
    helpfulCount: assistantMessages.filter((message) => message.feedback === 'helpful').length,
    needsReviewCount: assistantMessages.filter((message) => message.feedback === 'needs_review').length,
    assistantMessageCount: assistantMessages.length
  };
}

function buildNeedsReviewState(input: { grounded: boolean; messages: ChatMessageRecord[] }) {
  return !input.grounded || input.messages.some((message) => message.role === 'assistant' && message.feedback === 'needs_review');
}

function buildTranscriptCreateInput(transcript: ChatMessageRecord[]) {
  return transcript.map((message) => ({
    role: message.role,
    content: message.content,
    confidence: message.confidence ?? null,
    disclaimer: message.disclaimer ?? null,
    citationsJson: serializeCitations(message.citations),
    isError: message.isError ?? false,
    feedback: message.feedback ?? null
  }));
}

export async function saveConversation(input: SaveConversationInput) {
  try {
    const record = await db.conversation.create({
      data: {
        scopeType: input.scope.scopeType,
        scopeId: input.scope.scopeId,
        userId: input.scope.userId,
        title: input.title || buildConversationTitle(input.latestUserMessage),
        latestUserMessage: input.latestUserMessage,
        latestAnswer: input.latestAnswer,
        confidence: input.confidence,
        grounded: input.grounded,
        provider: input.provider,
        model: input.model,
        citationCount: input.citationCount,
        country: input.country,
        messages: {
          create: buildTranscriptCreateInput(input.transcript)
        }
      }
    });

    return {
      ok: true as const,
      persistence: 'database' as const,
      id: record.id
    };
  } catch {
    return {
      ok: false as const,
      persistence: 'unavailable' as const,
      id: null
    };
  }
}

export async function appendConversationTurn(
  scope: ConversationScope,
  conversationId: string,
  input: Omit<SaveConversationInput, 'scope' | 'title'> & { title?: string }
) {
  try {
    const existing = await db.conversation.findFirst({
      where: {
        id: conversationId,
        scopeType: scope.scopeType,
        scopeId: scope.scopeId
      },
      select: { id: true }
    });

    if (!existing) {
      return false;
    }

    await db.conversation.update({
      where: {
        id: existing.id
      },
      data: {
        title: input.title ? buildConversationTitle(input.title) : undefined,
        latestUserMessage: input.latestUserMessage,
        latestAnswer: input.latestAnswer,
        confidence: input.confidence,
        grounded: input.grounded,
        provider: input.provider,
        model: input.model,
        citationCount: input.citationCount,
        country: input.country,
        updatedAt: new Date(),
        messages: {
          create: buildTranscriptCreateInput(input.transcript)
        }
      }
    });

    return true;
  } catch {
    return false;
  }
}

export async function appendAssistantMessageToConversation(
  scope: ConversationScope,
  conversationId: string,
  input: {
    latestAnswer: string;
    confidence: number;
    grounded: boolean;
    provider: string;
    model: string;
    citationCount: number;
    country?: string;
    message: ChatMessageRecord;
  }
) {
  try {
    const existing = await db.conversation.findFirst({
      where: {
        id: conversationId,
        scopeType: scope.scopeType,
        scopeId: scope.scopeId
      },
      select: {
        id: true,
        latestUserMessage: true
      }
    });

    if (!existing) {
      return false;
    }

    await db.conversation.update({
      where: {
        id: existing.id
      },
      data: {
        latestUserMessage: existing.latestUserMessage,
        latestAnswer: input.latestAnswer,
        confidence: input.confidence,
        grounded: input.grounded,
        provider: input.provider,
        model: input.model,
        citationCount: input.citationCount,
        country: input.country,
        updatedAt: new Date(),
        messages: {
          create: buildTranscriptCreateInput([input.message])
        }
      }
    });

    return true;
  } catch {
    return false;
  }
}

export async function getConversationContextMessages(
  scope: ConversationScope,
  conversationId: string,
  limit = 6
): Promise<ConversationContext | null> {
  try {
    const record = await db.conversation.findFirst({
      where: {
        id: conversationId,
        scopeType: scope.scopeType,
        scopeId: scope.scopeId
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: limit
        }
      }
    });

    if (!record) {
      return null;
    }

    const messages = [...record.messages].reverse().map((message) => ({
      role: normalizeRole(message.role),
      content: message.content
    }));

    return {
      conversationId: record.id,
      title: record.title,
      messages
    };
  } catch {
    return null;
  }
}

export async function getConversationTranscript(scope: ConversationScope, conversationId: string): Promise<ChatMessageRecord[] | null> {
  try {
    const record = await db.conversation.findFirst({
      where: {
        id: conversationId,
        scopeType: scope.scopeType,
        scopeId: scope.scopeId
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!record) {
      return null;
    }

    return record.messages.map(mapMessageRecord);
  } catch {
    return null;
  }
}

export async function listConversationsForScope(
  scope: ConversationScope,
  query?: ConversationHistoryQuery
): Promise<ConversationHistoryItem[]> {
  try {
    const records = await db.conversation.findMany({
      where: {
        scopeType: query?.sessionType ?? scope.scopeType,
        scopeId: scope.scopeId,
        ...(typeof query?.pinned === 'boolean' ? { pinned: query.pinned } : {}),
        ...(typeof query?.grounded === 'boolean' ? { grounded: query.grounded } : {}),
        ...(query?.q
          ? {
              OR: [
                { title: { contains: query.q, mode: 'insensitive' } },
                { latestUserMessage: { contains: query.q, mode: 'insensitive' } },
                { latestAnswer: { contains: query.q, mode: 'insensitive' } }
              ]
            }
          : {})
      },
      include: {
        messages: {
          where: {
            role: 'assistant'
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 12,
          select: {
            id: true,
            role: true,
            content: true,
            createdAt: true,
            confidence: true,
            disclaimer: true,
            citationsJson: true,
            isError: true,
            feedback: true
          }
        }
      },
      orderBy: [{ pinned: 'desc' }, { updatedAt: 'desc' }],
      take: 24
    });

    const mapped = records.map((record) => {
      const assistantMessages = record.messages.map(mapMessageRecord);
      return {
        id: record.id,
        title: record.title,
        preview: record.latestAnswer,
        updatedAt: record.updatedAt.toISOString(),
        pinned: record.pinned,
        sessionType: record.scopeType === 'user' ? 'user' : 'guest',
        confidence: record.confidence,
        grounded: record.grounded,
        citationCount: record.citationCount,
        country: record.country ?? undefined,
        needsReview: buildNeedsReviewState({
          grounded: record.grounded,
          messages: assistantMessages
        }),
        reviewStatus: normalizeReviewStatus((record as { reviewStatus?: string | null }).reviewStatus)
      } satisfies ConversationHistoryItem;
    });

    if (typeof query?.needsReview === 'boolean') {
      return mapped.filter((item) => item.needsReview === query.needsReview);
    }

    return mapped;
  } catch {
    return [];
  }
}

export async function getConversationDetail(scope: ConversationScope, conversationId: string): Promise<ConversationDetail | null> {
  try {
    const record = await db.conversation.findFirst({
      where: {
        id: conversationId,
        scopeType: scope.scopeType,
        scopeId: scope.scopeId
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!record) return null;

    const messages = record.messages.map(mapMessageRecord);
    const citations = messages.flatMap((message) => message.citations ?? []);

    return {
      id: record.id,
      title: record.title,
      updatedAt: record.updatedAt.toISOString(),
      sessionType: record.scopeType === 'user' ? 'user' : 'guest',
      pinned: record.pinned,
      grounded: record.grounded,
      confidence: record.confidence,
      citationCount: record.citationCount,
      country: record.country ?? undefined,
      messages,
      citations,
      quality: buildQualitySummary(messages),
      review: {
        status: normalizeReviewStatus((record as { reviewStatus?: string | null }).reviewStatus),
        note: (record as { reviewNote?: string | null }).reviewNote ?? undefined,
        reviewedAt: (record as { reviewedAt?: Date | null }).reviewedAt?.toISOString()
      }
    };
  } catch {
    return null;
  }
}

export async function updateConversationMetadata(
  scope: ConversationScope,
  conversationId: string,
  input: {
    title?: string;
    pinned?: boolean;
  }
) {
  try {
    const updated = await db.conversation.updateMany({
      where: {
        id: conversationId,
        scopeType: scope.scopeType,
        scopeId: scope.scopeId
      },
      data: {
        ...(typeof input.title === 'string' ? { title: buildConversationTitle(input.title) } : {}),
        ...(typeof input.pinned === 'boolean' ? { pinned: input.pinned } : {})
      }
    });

    return updated.count > 0;
  } catch {
    return false;
  }
}

export async function updateConversationReview(
  scope: ConversationScope,
  conversationId: string,
  input: {
    status: ConversationReviewStatus;
    note?: string;
  }
) {
  try {
    const existing = await db.conversation.findFirst({
      where: {
        id: conversationId,
        scopeType: scope.scopeType,
        scopeId: scope.scopeId
      },
      select: {
        id: true
      }
    });

    if (!existing) {
      return false;
    }

    await db.conversation.update({
      where: {
        id: existing.id
      },
      data: {
        reviewStatus: input.status,
        reviewNote: input.note?.trim() ? input.note.trim() : null,
        reviewedAt: new Date(),
        updatedAt: new Date()
      }
    });

    return true;
  } catch {
    return false;
  }
}

export async function deleteConversation(scope: ConversationScope, conversationId: string) {
  try {
    const deleted = await db.conversation.deleteMany({
      where: {
        id: conversationId,
        scopeType: scope.scopeType,
        scopeId: scope.scopeId
      }
    });

    return deleted.count > 0;
  } catch {
    return false;
  }
}

export async function setMessageFeedback(
  scope: ConversationScope,
  conversationId: string,
  messageId: string,
  feedback: 'helpful' | 'needs_review' | null
) {
  try {
    const message = await db.conversationMessage.findFirst({
      where: {
        id: messageId,
        conversationId,
        conversation: {
          scopeType: scope.scopeType,
          scopeId: scope.scopeId
        }
      },
      select: {
        id: true
      }
    });

    if (!message) {
      return false;
    }

    await db.conversationMessage.update({
      where: {
        id: message.id
      },
      data: {
        feedback
      }
    });

    return true;
  } catch {
    return false;
  }
}

export async function getLatestAssistantMessageForConversation(scope: ConversationScope, conversationId: string) {
  try {
    const message = await db.conversationMessage.findFirst({
      where: {
        role: 'assistant',
        conversationId,
        conversation: {
          scopeType: scope.scopeType,
          scopeId: scope.scopeId
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
        confidence: true,
        disclaimer: true,
        citationsJson: true,
        isError: true,
        feedback: true
      }
    });

    return message ? mapMessageRecord(message) : null;
  } catch {
    return null;
  }
}

export async function listReviewQueueForScope(scope: ConversationScope, limit = 20): Promise<ReviewQueueItem[]> {
  try {
    const records = await db.conversation.findMany({
      where: {
        scopeType: scope.scopeType,
        scopeId: scope.scopeId
      },
      include: {
        messages: {
          where: {
            role: 'assistant'
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 20,
          select: {
            id: true,
            role: true,
            content: true,
            createdAt: true,
            confidence: true,
            disclaimer: true,
            citationsJson: true,
            isError: true,
            feedback: true
          }
        }
      },
      orderBy: [{ grounded: 'asc' }, { updatedAt: 'desc' }],
      take: limit
    });

    const items: Array<ReviewQueueItem | null> = records.map((record) => {
        const assistantMessages = record.messages.map(mapMessageRecord);
        const quality = buildQualitySummary(assistantMessages);
        const needsReview = buildNeedsReviewState({
          grounded: record.grounded,
          messages: assistantMessages
        });

        if (!needsReview) {
          return null;
        }

        const priority: 'high' | 'medium' = !record.grounded || quality.needsReviewCount > 1 ? 'high' : 'medium';

        return {
          id: record.id,
          title: record.title,
          preview: record.latestAnswer,
          updatedAt: record.updatedAt.toISOString(),
          sessionType: record.scopeType === 'user' ? 'user' : 'guest',
          grounded: record.grounded,
          citationCount: record.citationCount,
          country: record.country ?? undefined,
          helpfulCount: quality.helpfulCount,
          needsReviewCount: quality.needsReviewCount,
          assistantMessageCount: quality.assistantMessageCount,
          priority,
          reviewStatus: normalizeReviewStatus((record as { reviewStatus?: string | null }).reviewStatus),
          reviewNote: (record as { reviewNote?: string | null }).reviewNote ?? undefined,
          reviewedAt: (record as { reviewedAt?: Date | null }).reviewedAt?.toISOString()
        } satisfies ReviewQueueItem;
      });

    return items.filter((item): item is ReviewQueueItem => item !== null);
  } catch {
    return [];
  }
}

export async function getConversationQualityDashboardMetrics(
  scope: ConversationScope
): Promise<ConversationQualityDashboardMetrics> {
  try {
    const records = await db.conversation.findMany({
      where: {
        scopeType: scope.scopeType,
        scopeId: scope.scopeId
      },
      include: {
        messages: {
          where: {
            role: 'assistant'
          },
          select: {
            id: true,
            role: true,
            content: true,
            createdAt: true,
            confidence: true,
            disclaimer: true,
            citationsJson: true,
            isError: true,
            feedback: true
          }
        }
      }
    });

    let groundedConversations = 0;
    let needsReviewConversations = 0;
    let pinnedConversations = 0;
    let assistantMessages = 0;
    let helpfulSignals = 0;
    let needsReviewSignals = 0;
    let openReviews = 0;
    let inReviewConversations = 0;
    let resolvedReviews = 0;

    for (const record of records) {
      const mappedMessages = record.messages.map(mapMessageRecord);
      const quality = buildQualitySummary(mappedMessages);
      const needsReview = buildNeedsReviewState({
        grounded: record.grounded,
        messages: mappedMessages
      });
      const reviewStatus = normalizeReviewStatus((record as { reviewStatus?: string | null }).reviewStatus);

      if (record.grounded) groundedConversations += 1;
      if (record.pinned) pinnedConversations += 1;
      if (needsReview) needsReviewConversations += 1;
      if (reviewStatus === 'open') openReviews += 1;
      if (reviewStatus === 'in_review') inReviewConversations += 1;
      if (reviewStatus === 'resolved') resolvedReviews += 1;

      assistantMessages += quality.assistantMessageCount;
      helpfulSignals += quality.helpfulCount;
      needsReviewSignals += quality.needsReviewCount;
    }

    const totalConversations = records.length;

    return {
      totalConversations,
      groundedConversations,
      needsReviewConversations,
      pinnedConversations,
      assistantMessages,
      helpfulSignals,
      needsReviewSignals,
      openReviews,
      inReviewConversations,
      resolvedReviews,
      reviewRate: totalConversations > 0 ? needsReviewConversations / totalConversations : 0,
      groundedRate: totalConversations > 0 ? groundedConversations / totalConversations : 0
    };
  } catch {
    return {
      totalConversations: 0,
      groundedConversations: 0,
      needsReviewConversations: 0,
      pinnedConversations: 0,
      assistantMessages: 0,
      helpfulSignals: 0,
      needsReviewSignals: 0,
      openReviews: 0,
      inReviewConversations: 0,
      resolvedReviews: 0,
      reviewRate: 0,
      groundedRate: 0
    };
  }
}

export function deriveConversationTitleFromMessages(messages: Array<{ role: string; content: string }>) {
  const latestUser = [...messages].reverse().find((message) => message.role === 'user' && message.content.trim().length > 0);
  return buildConversationTitle(latestUser?.content ?? 'Untitled conversation');
}
