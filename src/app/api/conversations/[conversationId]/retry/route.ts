import { buildLowConfidenceFallback } from '@/lib/ai/fallback';
import type { ChatMessageRecord } from '@/components/app/chat-demo-data';
import { createGroqProvider } from '@/lib/ai/providers/groq';
import { appendAssistantMessageToConversation, getConversationContextMessages, getConversationDetail } from '@/lib/conversations';
import { jsonError, jsonNoStore } from '@/lib/http';
import { buildQualityMetrics } from '@/lib/observability';
import { evaluateEvidencePolicy } from '@/lib/policy';
import { getRequestId } from '@/lib/request';
import { retrieveVerifiedEvidence } from '@/lib/retrieval/retrieve';
import { getCurrentSession } from '@/lib/session';
import { resolveGroqApiKeyForScope } from '@/lib/settings-repository';
import { auditLog } from '@/lib/audit';

export async function POST(request: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  const requestId = getRequestId(request as never);
  const { conversationId } = await params;
  const session = await getCurrentSession();
  const scope = {
    scopeType: session.type,
    scopeId: session.id,
    userId: session.type === 'user' ? session.id : undefined
  } as const;

  const apiKey = await resolveGroqApiKeyForScope({ scopeType: session.type, scopeId: session.id });

  if (!apiKey) {
    return jsonNoStore({
      ok: true,
      conversationId,
      regenerated: false,
      data: buildLowConfidenceFallback('No Groq API key is configured for the current session or server environment.')
    });
  }

  const conversation = await getConversationDetail(scope, conversationId);
  const context = await getConversationContextMessages(scope, conversationId, 8);

  if (!conversation || !context) {
    return jsonError('Conversation not found.', 404, { conversationId });
  }

  const latestUserMessage = [...context.messages].reverse().find((message) => message.role === 'user')?.content?.trim() ?? '';

  if (!latestUserMessage) {
    return jsonError('No user message is available to regenerate from.', 400, { conversationId });
  }

  const retrieval = await retrieveVerifiedEvidence({
    messages: [{ role: 'user', content: latestUserMessage }],
    country: conversation.country,
    conversationId
  });

  const evidencePolicy = evaluateEvidencePolicy(retrieval.verifiedEvidence);
  const provider = createGroqProvider(apiKey);

  if (!provider.generateResponse) {
    return jsonNoStore({
      ok: true,
      conversationId,
      regenerated: false,
      data: buildLowConfidenceFallback('The AI provider is not available right now.')
    });
  }

  try {
    const response = await provider.generateResponse(
      {
        messages: context.messages,
        country: conversation.country,
        conversationId
      },
      retrieval.verifiedEvidence,
      { apiKey }
    );

    const assistantMessage: ChatMessageRecord = {
      id: `assistant-regenerated-${requestId}`,
      role: 'assistant' as const,
      content: response.text,
      timestamp: 'Just now',
      confidence: response.confidence >= 0.75 ? 'high' : response.confidence >= 0.35 ? 'moderate' : 'low',
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
    };

    const appended = await appendAssistantMessageToConversation(scope, conversationId, {
      latestAnswer: response.text,
      confidence: response.confidence,
      grounded: response.grounded,
      provider: response.provider,
      model: response.model,
      citationCount: response.citations.length,
      country: conversation.country,
      message: assistantMessage
    });

    if (!appended) {
      return jsonError('The regenerated answer could not be saved.', 500, { conversationId });
    }

    const quality = buildQualityMetrics({
      verifiedEvidenceCount: retrieval.verifiedEvidence.length,
      liveEvidenceCount: retrieval.liveEvidenceCount,
      citationCount: response.citations.length,
      freshEvidenceCount: retrieval.verifiedEvidence.filter((item) => item.freshness === 'fresh').length,
      agingEvidenceCount: retrieval.verifiedEvidence.filter((item) => item.freshness === 'aging').length,
      staleEvidenceCount: retrieval.verifiedEvidence.filter((item) => item.freshness === 'stale').length
    });

    auditLog('conversation.retry_regenerated', {
      requestId,
      conversationId,
      sessionType: session.type,
      grounded: response.grounded,
      confidence: response.confidence,
      policyAllowed: evidencePolicy.allowed,
      quality,
      citationTraceIds: response.citations.map((citation) => citation.traceId).filter(Boolean)
    });

    return jsonNoStore({
      ok: true,
      conversationId,
      regenerated: true,
      canRetry: true,
      data: response
    });
  } catch (error) {
    auditLog(
      'conversation.retry_error',
      {
        requestId,
        conversationId,
        sessionType: session.type,
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      'error'
    );

    return jsonNoStore({
      ok: true,
      conversationId,
      regenerated: false,
      canRetry: true,
      data: buildLowConfidenceFallback('The service could not regenerate an evidence-backed answer right now.')
    });
  }
}
