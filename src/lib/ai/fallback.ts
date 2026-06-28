import type { AIResponseEnvelope } from '@/lib/ai/types';

export function buildLowConfidenceFallback(reason: string): AIResponseEnvelope {
  return {
    text: `I cannot confidently verify this information. ${reason}`,
    confidence: 0.1,
    grounded: false,
    citations: [],
    provider: 'groq',
    model: 'fallback'
  };
}

export function normalizeGroundedResponse(response: AIResponseEnvelope): AIResponseEnvelope {
  const hasCitations = response.citations.length > 0;

  if (!response.grounded || !hasCitations || response.confidence <= 0.2) {
    return {
      ...response,
      text: response.text.includes('I cannot confidently verify this information.')
        ? response.text
        : `I cannot confidently verify this information. ${response.text}`.trim(),
      grounded: false,
      confidence: Math.min(response.confidence, 0.2),
      citations: []
    };
  }

  return response;
}
