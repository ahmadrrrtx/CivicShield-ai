export function buildQualityMetrics(input: {
  verifiedEvidenceCount: number;
  liveEvidenceCount: number;
  citationCount: number;
  freshEvidenceCount: number;
  agingEvidenceCount: number;
  staleEvidenceCount: number;
}) {
  const verificationRate = input.verifiedEvidenceCount > 0 ? input.citationCount / input.verifiedEvidenceCount : 0;

  return {
    ...input,
    verificationRate,
    freshnessProfile: {
      fresh: input.freshEvidenceCount,
      aging: input.agingEvidenceCount,
      stale: input.staleEvidenceCount
    }
  };
}
