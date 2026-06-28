import type { ChatRequestInput } from '@/lib/ai/schemas';
import { retrieveCatalogEvidence } from '@/lib/retrieval/catalog';
import { providerResultToEvidence, dedupeEvidence } from '@/lib/retrieval/normalize';
import { localLiveRetrievalProvider } from '@/lib/retrieval/providers/local-live';
import type { RetrievalProvider } from '@/lib/retrieval/providers/types';
import { verifyEvidenceBundle } from '@/lib/retrieval/verify';

const retrievalProviders: RetrievalProvider[] = [localLiveRetrievalProvider];

export async function orchestrateRetrieval(input: ChatRequestInput) {
  const latestUserMessage = [...input.messages].reverse().find((message) => message.role === 'user');
  const query = latestUserMessage?.content ?? '';

  const catalogEvidence = retrieveCatalogEvidence(query, input.country);

  const enabledProviders = retrievalProviders.filter((provider) => provider.enabled);
  const liveResults = await Promise.all(
    enabledProviders.map((provider) => provider.retrieve({ query, country: input.country, departmentHint: input.departmentHint }))
  );

  const liveEvidence = liveResults
    .flat()
    .map(providerResultToEvidence)
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const candidateEvidence = dedupeEvidence([...catalogEvidence, ...liveEvidence]).sort((a, b) => b.score - a.score);
  const verifiedEvidence = verifyEvidenceBundle(candidateEvidence);

  return {
    query,
    providersUsed: enabledProviders.map((provider) => provider.id),
    candidateEvidence,
    verifiedEvidence,
    liveEvidenceCount: liveEvidence.length
  };
}
