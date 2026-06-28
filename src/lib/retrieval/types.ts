export type EvidenceVerificationStatus = 'verified' | 'unverified' | 'rejected';
export type EvidenceFreshness = 'fresh' | 'aging' | 'stale';

export type RetrievedEvidence = {
  id: string;
  title: string;
  url: string;
  hostname: string;
  excerpt: string;
  passage?: string;
  country: string;
  department: string;
  lastUpdated: string;
  trusted: boolean;
  score: number;
  sourceType: 'catalog' | 'live';
  provider: string;
  verification: EvidenceVerificationStatus;
  fetchedAt?: string;
  freshness?: EvidenceFreshness;
  traceId?: string;
};
