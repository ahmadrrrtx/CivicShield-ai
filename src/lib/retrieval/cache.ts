import { serverEnv } from '@/lib/env';

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const retrievalCache = new Map<string, CacheEntry<unknown>>();

export function getRetrievalCache<T>(key: string): T | null {
  const entry = retrievalCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    retrievalCache.delete(key);
    return null;
  }
  return entry.value as T;
}

export function setRetrievalCache<T>(key: string, value: T) {
  retrievalCache.set(key, {
    value,
    expiresAt: Date.now() + serverEnv.RETRIEVAL_CACHE_TTL_MS
  });
}
