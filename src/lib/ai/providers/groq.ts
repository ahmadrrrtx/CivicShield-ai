import { env } from '@/lib/env';
import type { AIChatRequest, AIHealthStatus, AIProviderAdapter, AIResponseEnvelope, VerifiedEvidenceItem } from '@/lib/ai/types';
import { aiResponseEnvelopeSchema } from '@/lib/ai/schemas';
import { buildGroundedSystemPrompt } from '@/lib/ai/prompts';
import { buildLowConfidenceFallback, normalizeGroundedResponse } from '@/lib/ai/fallback';
import { verifyCitationsAgainstEvidence } from '@/lib/retrieval/verify';
import { applyResponsePolicy, evaluateEvidencePolicy } from '@/lib/policy';

const MINIMUM_VERIFIED_EVIDENCE = 1;

async function healthCheck(): Promise<AIHealthStatus> {
  const hasConfiguredKey = Boolean(process.env.GROQ_API_KEY);

  return {
    provider: 'groq',
    available: hasConfiguredKey,
    latencyMs: undefined,
    message: hasConfiguredKey
      ? `Groq is configured. Default model: ${env.GROQ_DEFAULT_MODEL}.`
      : 'Groq is not configured yet. Add an API key in Settings to enable AI responses.'
  };
}

function extractTextContent(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return '';

  const maybe = payload as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  return maybe.choices?.[0]?.message?.content?.trim() ?? '';
}

async function generateResponse(
  input: AIChatRequest,
  evidence: VerifiedEvidenceItem[] = [],
  options?: {
    apiKey?: string;
  }
): Promise<AIResponseEnvelope> {
  const apiKey = options?.apiKey ?? process.env.GROQ_API_KEY;

  if (!apiKey) {
    return buildLowConfidenceFallback('Groq is not configured yet. Add an API key in Settings to enable verified responses.');
  }

  const evidencePolicy = evaluateEvidencePolicy(evidence);

  if (!evidencePolicy.allowed || evidence.length < MINIMUM_VERIFIED_EVIDENCE) {
    return buildLowConfidenceFallback(evidencePolicy.reason ?? 'No verified official evidence was available for this request.');
  }

  const response = await fetch(`${env.GROQ_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: env.GROQ_DEFAULT_MODEL,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: buildGroundedSystemPrompt(input, evidence)
        },
        ...input.messages
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Groq request failed with status ${response.status}`);
  }

  const payload: unknown = await response.json();
  const rawContent = extractTextContent(payload);

  if (!rawContent) {
    return buildLowConfidenceFallback('The provider returned an empty response.');
  }

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(rawContent);
  } catch {
    return buildLowConfidenceFallback('The provider response could not be validated safely.');
  }

  const parsedObject: Record<string, unknown> = typeof parsedJson === 'object' && parsedJson !== null ? (parsedJson as Record<string, unknown>) : {};

  const validated = aiResponseEnvelopeSchema.safeParse({
    ...parsedObject,
    provider: 'groq',
    model: typeof parsedObject.model === 'string' ? parsedObject.model : env.GROQ_DEFAULT_MODEL
  });

  if (!validated.success) {
    return buildLowConfidenceFallback('The provider response did not match the required evidence-backed schema.');
  }

  const verifiedCitations = verifyCitationsAgainstEvidence(validated.data.citations, evidence).map((citation) => ({
    ...citation,
    verified: true
  }));

  const normalized = normalizeGroundedResponse({
    ...validated.data,
    citations: verifiedCitations,
    grounded: validated.data.grounded && verifiedCitations.length >= MINIMUM_VERIFIED_EVIDENCE
  });

  return applyResponsePolicy(normalized, evidence);
}

export function createGroqProvider(customApiKey?: string): AIProviderAdapter {
  return {
    id: 'groq',
    label: 'Groq',
    enabled: true,
    supportsStreaming: true,
    healthCheck,
    generateResponse: async (input, evidence, options) =>
      generateResponse(input, evidence, {
        apiKey: options?.apiKey ?? customApiKey
      })
  };
}

export const groqProvider: AIProviderAdapter = {
  id: 'groq',
  label: 'Groq',
  enabled: true,
  supportsStreaming: true,
  healthCheck,
  generateResponse
};
