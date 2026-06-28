import type { RetrievalProviderResult } from '@/lib/retrieval/providers/types';
import type { RetrievedEvidence } from '@/lib/retrieval/types';

export function normalizeHostname(hostname: string) {
  return hostname.trim().toLowerCase().replace(/^www\./, '');
}

export function normalizeUrl(url: string) {
  try {
    const parsed = new URL(url);
    const normalizedHost = normalizeHostname(parsed.hostname);
    const normalizedPath = parsed.pathname.replace(/\/$/, '') || '/';
    return `${parsed.protocol}//${normalizedHost}${normalizedPath}`;
  } catch {
    return url.trim();
  }
}

export function providerResultToEvidence(result: RetrievalProviderResult): RetrievedEvidence | null {
  try {
    const parsed = new URL(result.url);
    return {
      id: result.id,
      title: result.title,
      url: normalizeUrl(result.url),
      hostname: normalizeHostname(parsed.hostname),
      excerpt: result.excerpt,
      passage: result.passage,
      country: result.country ?? 'Unspecified country',
      department: result.department ?? 'Unspecified department',
      lastUpdated: result.lastUpdated ?? 'Unknown',
      trusted: false,
      score: result.score ?? 0,
      sourceType: result.sourceType,
      provider: result.provider,
      verification: 'unverified',
      fetchedAt: result.fetchedAt,
      freshness: result.freshness
    };
  } catch {
    return null;
  }
}

export function dedupeEvidence(items: RetrievedEvidence[]) {
  const map = new Map<string, RetrievedEvidence>();

  for (const item of items) {
    const key = normalizeUrl(item.url);
    const existing = map.get(key);

    if (!existing || item.score > existing.score) {
      map.set(key, {
        ...item,
        url: key
      });
    }
  }

  return Array.from(map.values());
}
