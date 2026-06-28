import { trustedSources } from '@/config/trusted-sources';
import { getRetrievalCache, setRetrievalCache } from '@/lib/retrieval/cache';
import { computeFreshness, extractTitleFromHtml, stripHtmlToText, createExcerpt } from '@/lib/retrieval/extract';
import { safeFetchText } from '@/lib/retrieval/fetch';
import { selectBestPassage } from '@/lib/retrieval/passages';
import type { RetrievalProvider, RetrievalProviderResult } from '@/lib/retrieval/providers/types';
import { normalizeUrl } from '@/lib/retrieval/normalize';

function scoreSource(query: string, topics: string[]) {
  const normalized = query.toLowerCase();
  return topics.reduce((score, topic) => (normalized.includes(topic.toLowerCase()) ? score + 1 : score), 0);
}

async function retrieve(input: { query: string; country?: string }): Promise<RetrievalProviderResult[]> {
  const candidates = trustedSources
    .map((source) => ({ source, score: scoreSource(input.query, source.topics) }))
    .filter(({ source, score }) => score > 0 && (!input.country || source.country === input.country))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const fetched = await Promise.all(
    candidates.map(async ({ source, score }) => {
      const cacheKey = `retrieval:${normalizeUrl(source.url)}`;
      const cached = getRetrievalCache<RetrievalProviderResult>(cacheKey);
      if (cached) {
        return {
          ...cached,
          score: Math.max(cached.score ?? 0, score + 2)
        } satisfies RetrievalProviderResult;
      }

      const result = await safeFetchText(source.url);
      if (!result.ok || !result.text) return null;

      const title = extractTitleFromHtml(result.text) || source.title;
      const bodyText = stripHtmlToText(result.text);
      const bestPassage = selectBestPassage(input.query, bodyText);
      const excerpt = createExcerpt(bestPassage?.text || bodyText || source.summary);

      if (!excerpt) return null;

      const retrievalResult = {
        id: `${source.id}-live`,
        title,
        url: result.url,
        excerpt,
        passage: bestPassage?.text,
        country: source.country,
        department: source.department,
        lastUpdated: source.lastUpdated,
        score: score + (bestPassage ? 3 : 2),
        sourceType: 'live' as const,
        provider: 'trusted-live-fetch',
        fetchedAt: new Date().toISOString(),
        freshness: computeFreshness(source.lastUpdated, new Date().toISOString())
      } satisfies RetrievalProviderResult;

      setRetrievalCache(cacheKey, retrievalResult);
      return retrievalResult;
    })
  );

  return fetched.filter((item): item is NonNullable<typeof item> => item !== null);
}

export const localLiveRetrievalProvider: RetrievalProvider = {
  id: 'local-live',
  label: 'Trusted Live Fetch Provider',
  enabled: true,
  retrieve
};
