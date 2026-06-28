import { randomBytes } from 'node:crypto';

function hex(bytes) {
  return randomBytes(bytes).toString('hex');
}

console.log('BETTER_AUTH_SECRET=' + hex(32));
console.log('ENCRYPTION_KEY=' + hex(32));
