import type { AIResponseEnvelope, VerifiedEvidenceItem } from '@/lib/ai/types';
import { buildLowConfidenceFallback } from '@/lib/ai/fallback';

export type PolicyEvaluation = {
  allowed: boolean;
  reason?: string;
  metrics: {
    verifiedEvidenceCount: number;
    staleEvidenceCount: number;
    agingEvidenceCount: number;
    freshEvidenceCount: number;
    citationCount: number;
  };
};

export function evaluateEvidencePolicy(evidence: VerifiedEvidenceItem[]): PolicyEvaluation {
  const staleEvidenceCount = evidence.filter((item) => item.freshness === 'stale').length;
  const agingEvidenceCount = evidence.filter((item) => item.freshness === 'aging').length;
  const freshEvidenceCount = evidence.filter((item) => item.freshness === 'fresh').length;

  if (evidence.length === 0) {
    return {
      allowed: false,
      reason: 'No verified evidence was available.',
      metrics: { verifiedEvidenceCount: 0, staleEvidenceCount: 0, agingEvidenceCount: 0, freshEvidenceCount: 0, citationCount: 0 }
    };
  }

  if (freshEvidenceCount === 0 && staleEvidenceCount === evidence.length) {
    return {
      allowed: false,
      reason: 'All verified evidence is stale.',
      metrics: { verifiedEvidenceCount: evidence.length, staleEvidenceCount, agingEvidenceCount, freshEvidenceCount, citationCount: 0 }
    };
  }

  return {
    allowed: true,
    metrics: { verifiedEvidenceCount: evidence.length, staleEvidenceCount, agingEvidenceCount, freshEvidenceCount, citationCount: 0 }
  };
}

export function applyResponsePolicy(response: AIResponseEnvelope, evidence: VerifiedEvidenceItem[]): AIResponseEnvelope {
  const citationCount = response.citations.length;
  const staleEvidenceCount = evidence.filter((item) => item.freshness === 'stale').length;
  const freshEvidenceCount = evidence.filter((item) => item.freshness === 'fresh').length;

  if (citationCount === 0) {
    return buildLowConfidenceFallback('No verified citations remained after policy checks.');
  }

  if (freshEvidenceCount === 0 && staleEvidenceCount === evidence.length) {
    return buildLowConfidenceFallback('The available evidence is too stale to support a confident answer.');
  }

  return response;
}
