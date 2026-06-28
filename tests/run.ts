import { runPolicyTests } from './policy.test';
import { runRetrievalTests } from './retrieval.test';

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

run('policy', runPolicyTests);
run('retrieval', runRetrievalTests);

if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode);
}

console.log('All lightweight trust tests completed.');
