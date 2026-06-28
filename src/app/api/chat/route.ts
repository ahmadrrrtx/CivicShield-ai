import { NextRequest } from 'next/server';
import { buildLowConfidenceFallback } from '@/lib/ai/fallback';
import { createGroqProvider } from '@/lib/ai/providers/groq';
import { chatRequestSchema } from '@/lib/ai/schemas';
import { auditLog } from '@/lib/audit';
import type { ChatMessageRecord } from '@/components/app/chat-demo-data';
import {
  appendConversationTurn,
  deriveConversationTitleFromMessages,
  getConversationContextMessages,
  saveConversation
} from '@/lib/conversations';
import { jsonError, jsonNoStore } from '@/lib/http';
import { buildQualityMetrics } from '@/lib/observability';
import { evaluateEvidencePolicy } from '@/lib/policy';
import { getClientIp, getRequestId } from '@/lib/request';
import { enforceRateLimit } from '@/lib/rate-limit';
import { retrieveVerifiedEvidence } from '@/lib/retrieval/retrieve';
import { getCurrentSession } from '@/lib/session';
import { resolveGroqApiKeyForScope } from '@/lib/settings-repository';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);
  const ip = getClientIp(request);
  const rate = enforceRateLimit(`chat:${ip}`, 8, 60_000);

  if (!rate.allowed) {
    auditLog('chat.rate_limited', { requestId, ip }, 'warn');
    return jsonError('Too many requests. Please wait before trying again.', 429, {
      requestId,
      retryAfterSeconds: Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000))
    });
  }

  let json: unknown;

  try {
    json = await request.json();
  } catch {
    auditLog('chat.invalid_json', { requestId, ip }, 'warn');
    return jsonError('Invalid JSON payload.', 400, { requestId });
  }

  const parsed = chatRequestSchema.safeParse(json);

  if (!parsed.success) {
    auditLog('chat.invalid_request', { requestId, ip, issues: parsed.error.flatten() }, 'warn');
    return jsonError('Invalid chat request payload.', 400, { requestId });
  }

  const session = await getCurrentSession();
  const scope = {
    scopeType: session.type,
    scopeId: session.id,
    userId: session.type === 'user' ? session.id : undefined
  } as const;

  const apiKey = await resolveGroqApiKeyForScope({ scopeType: session.type, scopeId: session.id });
  const latestUserMessage = parsed.data.messages.filter((message) => message.role === 'user').at(-1)?.content ?? '';

  if (!apiKey) {
    return jsonNoStore({
      ok: true,
      requestId,
      data: buildLowConfidenceFallback('No Groq API key is configured for the current session or server environment.')
    });
  }

  const existingConversation = parsed.data.conversationId
    ? await getConversationContextMessages(scope, parsed.data.conversationId)
    : null;

  const retrieval = await retrieveVerifiedEvidence(parsed.data);
  const evidencePolicy = evaluateEvidencePolicy(retrieval.verifiedEvidence);

  auditLog('chat.retrieval', {
    requestId,
    ip,
    sessionType: session.type,
    query: retrieval.query,
    providersUsed: retrieval.providersUsed,
    candidateCount: retrieval.candidateEvidence.length,
    verifiedCount: retrieval.verifiedEvidence.length,
    liveEvidenceCount: retrieval.liveEvidenceCount,
    evidenceIds: retrieval.verifiedEvidence.map((item) => item.id),
    sourceTypes: retrieval.verifiedEvidence.map((item) => item.sourceType),
    policyAllowed: evidencePolicy.allowed,
    policyReason: evidencePolicy.reason
  });

  const provider = createGroqProvider(apiKey);

  if (!provider.generateResponse) {
    auditLog('chat.provider_unavailable', { requestId, ip, provider: 'groq', sessionType: session.type }, 'error');
    return jsonNoStore({ ok: true, requestId, data: buildLowConfidenceFallback('The AI provider is not available right now.') });
  }

  try {
    const promptMessages = existingConversation
      ? [...existingConversation.messages, ...parsed.data.messages].slice(-8)
      : parsed.data.messages;

    const response = await provider.generateResponse(
      {
        ...parsed.data,
        messages: promptMessages
      },
      retrieval.verifiedEvidence,
      { apiKey }
    );

    const persistedTranscript: ChatMessageRecord[] = [
      {
        id: `user-${requestId}`,
        role: 'user' as const,
        content: latestUserMessage,
        timestamp: 'Just now'
      },
      {
        id: `assistant-${requestId}`,
        role: 'assistant' as const,
        content: response.text,
        timestamp: 'Just now',
        confidence:
          response.confidence >= 0.75 ? 'high' : response.confidence >= 0.35 ? 'moderate' : 'low',
        disclaimer: response.confidence <= 0.2 ? 'I cannot confidently verify this information.' : undefined,
        citations: response.citations.map((citation, index) => ({
          id: `${requestId}-citation-${index + 1}`,
          title: citation.title,
          url: citation.url,
          department: citation.department ?? 'Unspecified department',
          country: citation.country ?? 'Unspecified country',
          lastUpdated: citation.lastUpdated ?? 'Unknown',
          summary: citation.excerpt,
          verified: citation.verified,
          freshness: citation.freshness,
          traceId: citation.traceId
        })),
        isError: !response.grounded
      }
    ];

    if (existingConversation) {
      await appendConversationTurn(scope, existingConversation.conversationId, {
        latestUserMessage,
        latestAnswer: response.text,
        confidence: response.confidence,
        grounded: response.grounded,
        provider: response.provider,
        model: response.model,
        citationCount: response.citations.length,
        country: parsed.data.country,
        transcript: persistedTranscript
      });
    } else {
      await saveConversation({
        scope,
        title: deriveConversationTitleFromMessages(parsed.data.messages),
        latestUserMessage,
        latestAnswer: response.text,
        confidence: response.confidence,
        grounded: response.grounded,
        provider: response.provider,
        model: response.model,
        citationCount: response.citations.length,
        country: parsed.data.country,
        transcript: persistedTranscript
      });
    }

    const quality = buildQualityMetrics({
      verifiedEvidenceCount: retrieval.verifiedEvidence.length,
      liveEvidenceCount: retrieval.liveEvidenceCount,
      citationCount: response.citations.length,
      freshEvidenceCount: retrieval.verifiedEvidence.filter((item) => item.freshness === 'fresh').length,
      agingEvidenceCount: retrieval.verifiedEvidence.filter((item) => item.freshness === 'aging').length,
      staleEvidenceCount: retrieval.verifiedEvidence.filter((item) => item.freshness === 'stale').length
    });

    auditLog('chat.success', {
      requestId,
      ip,
      sessionType: session.type,
      provider: response.provider,
      model: response.model,
      grounded: response.grounded,
      confidence: response.confidence,
      retrievalProviders: retrieval.providersUsed,
      usedLiveEvidence: retrieval.liveEvidenceCount > 0,
      policyAllowed: evidencePolicy.allowed,
      quality,
      citationTraceIds: response.citations.map((citation) => citation.traceId).filter(Boolean),
      continuedConversation: Boolean(existingConversation),
      conversationId: existingConversation?.conversationId ?? null
    });

    return jsonNoStore({ ok: true, requestId, data: response });
  } catch (error) {
    auditLog(
      'chat.provider_error',
      {
        requestId,
        ip,
        sessionType: session.type,
        provider: 'groq',
        message: error instanceof Error ? error.message : 'Unknown error',
        conversationId: parsed.data.conversationId ?? null
      },
      'error'
    );

    return jsonNoStore({
      ok: true,
      requestId,
      data: buildLowConfidenceFallback('The service could not verify an evidence-backed answer right now.')
    });
  }
}
