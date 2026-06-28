import { trustedSources } from '@/config/trusted-sources';
import type { RetrievedEvidence } from '@/lib/retrieval/types';
import { normalizeHostname, normalizeUrl } from '@/lib/retrieval/normalize';

function scoreSource(query: string, topics: string[]) {
  const normalized = query.toLowerCase();
  return topics.reduce((score, topic) => (normalized.includes(topic.toLowerCase()) ? score + 1 : score), 0);
}

export function retrieveCatalogEvidence(query: string, country?: string): RetrievedEvidence[] {
  const normalizedCountry = country?.toLowerCase();

  return trustedSources
    .map((source) => ({
      source,
      score: scoreSource(query, source.topics)
    }))
    .filter(({ source, score }) => score > 0 && (!normalizedCountry || source.country.toLowerCase() === normalizedCountry))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ source, score }) => ({
      id: source.id,
      title: source.title,
      url: normalizeUrl(source.url),
      hostname: normalizeHostname(source.hostname),
      excerpt: source.summary,
      country: source.country,
      department: source.department,
      lastUpdated: source.lastUpdated,
      trusted: source.trusted,
      score,
      sourceType: 'catalog' as const,
      provider: 'trusted-catalog',
      verification: 'verified' as const
    }));
}
