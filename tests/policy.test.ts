import { evaluateEvidencePolicy } from '@/lib/policy';
import { assert, assertEqual } from '@/lib/test/assert';
import type { VerifiedEvidenceItem } from '@/lib/ai/types';

function makeEvidence(overrides: Partial<VerifiedEvidenceItem> = {}): VerifiedEvidenceItem {
  return {
    id: 'e1',
    title: 'Test source',
    url: 'https://hud.gov/',
    hostname: 'hud.gov',
    excerpt: 'A sufficiently long evidence excerpt that passes the threshold for verification and policy checks.',
    country: 'United States',
    department: 'HUD',
    lastUpdated: '2026-01-01',
    trusted: true,
    score: 3,
    sourceType: 'live',
    provider: 'trusted-live-fetch',
    verification: 'verified',
    freshness: 'fresh',
    ...overrides
  };
}

export function runPolicyTests() {
  const empty = evaluateEvidencePolicy([]);
  assertEqual(empty.allowed, false, 'Empty evidence should be rejected.');

  const stale = evaluateEvidencePolicy([
    makeEvidence({ id: 's1', freshness: 'stale' }),
    makeEvidence({ id: 's2', freshness: 'stale' })
  ]);
  assertEqual(stale.allowed, false, 'All stale evidence should be rejected.');

  const mixed = evaluateEvidencePolicy([
    makeEvidence({ id: 'm1', freshness: 'aging' }),
    makeEvidence({ id: 'm2', freshness: 'fresh' })
  ]);
  assert(mixed.allowed, 'Mixed fresh/aging evidence should be allowed.');
}
