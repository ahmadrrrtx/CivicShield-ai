export type RetrievalProviderResult = {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  country?: string;
  department?: string;
  lastUpdated?: string;
  score?: number;
  sourceType: 'catalog' | 'live';
  provider: string;
  fetchedAt?: string;
  freshness?: 'fresh' | 'aging' | 'stale';
  passage?: string;
};

export interface RetrievalProvider {
  id: string;
  label: string;
  enabled: boolean;
  retrieve: (input: { query: string; country?: string; departmentHint?: string }) => Promise<RetrievalProviderResult[]>;
}
