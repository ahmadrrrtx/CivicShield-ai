import { normalizeHostname, normalizeUrl } from '@/lib/retrieval/normalize';
import { computeFreshness } from '@/lib/retrieval/extract';
import { splitIntoPassages, selectBestPassage } from '@/lib/retrieval/passages';
import { assert, assertEqual } from '@/lib/test/assert';

export function runRetrievalTests() {
  assertEqual(normalizeHostname('WWW.HUD.GOV'), 'hud.gov', 'Hostname normalization failed.');
  assertEqual(normalizeUrl('https://www.hud.gov/'), 'https://hud.gov/', 'URL normalization failed.');

  const freshness = computeFreshness('2026-01-01', '2026-02-01');
  assertEqual(freshness, 'fresh', 'Freshness computation failed.');

  const passages = splitIntoPassages(
    'Housing assistance may be available through official public agencies. Applicants should gather identification, income records, and notices. Utility assistance may also exist through federal and state programs for low-income households.'
  );
  assert(passages.length > 0, 'Passage splitting should produce passages.');

  const best = selectBestPassage('utility assistance low-income households', passages.join(' '));
  assert(best !== null, 'Best passage selection should succeed.');
}
