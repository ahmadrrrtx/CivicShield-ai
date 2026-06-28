import type { ChatRequestInput } from '@/lib/ai/schemas';
import { orchestrateRetrieval } from '@/lib/retrieval/orchestrator';

export async function retrieveVerifiedEvidence(input: ChatRequestInput) {
  return orchestrateRetrieval(input);
}
