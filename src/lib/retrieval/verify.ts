import { isTrustedHostname, isTrustedUrl } from '@/config/trusted-sources';
import type { AICitation } from '@/lib/ai/types';
import type { RetrievedEvidence } from '@/lib/retrieval/types';
import { normalizeHostname, normalizeUrl } from '@/lib/retrieval/normalize';

const MINIMUM_EVIDENCE_SCORE = 1;
const MINIMUM_EXCERPT_LENGTH = 80;

export function verifyEvidenceBundle(evidence: RetrievedEvidence[]) {
  return evidence
    .filter(
      (item) =>
        isTrustedHostname(normalizeHostname(item.hostname)) &&
        isTrustedUrl(item.url) &&
        item.score >= MINIMUM_EVIDENCE_SCORE &&
        item.excerpt.trim().length >= MINIMUM_EXCERPT_LENGTH
    )
    .map((item) => ({
      ...item,
      trusted: true,
      verification: 'verified' as const,
      url: normalizeUrl(item.url),
      hostname: normalizeHostname(item.hostname),
      traceId: item.traceId ?? `${item.provider}:${normalizeUrl(item.url)}`
    }));
}

export function verifyCitationsAgainstEvidence(citations: AICitation[], evidence: RetrievedEvidence[]) {
  const evidenceMap = new Map(evidence.map((item) => [normalizeUrl(item.url), item]));

  return citations
    .map((citation): AICitation | null => {
      try {
        const hostname = normalizeHostname(new URL(citation.url).hostname);
        const normalizedUrl = normalizeUrl(citation.url);
        const matchedEvidence = evidenceMap.get(normalizedUrl);

        if (!isTrustedHostname(hostname) || !matchedEvidence) {
          return null;
        }

        return {
          title: citation.title,
          url: normalizedUrl,
          excerpt: matchedEvidence.passage || citation.excerpt,
          country: citation.country,
          department: citation.department,
          lastUpdated: citation.lastUpdated,
          verified: citation.verified,
          freshness: matchedEvidence.freshness,
          traceId: matchedEvidence.traceId ?? citation.traceId
        };
      } catch {
        return null;
      }
    })
    .filter((citation): citation is AICitation => citation !== null);
}
