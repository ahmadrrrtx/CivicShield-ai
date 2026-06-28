import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

function deriveKey(secret: string) {
  return createHash('sha256').update(secret).digest();
}

export function encryptText(plainText: string, secret: string) {
  const iv = randomBytes(16);
  const key = deriveKey(secret);
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptText(payload: string, secret: string) {
  const [ivHex, encryptedHex] = payload.split(':');
  if (!ivHex || !encryptedHex) return '';

  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const key = deriveKey(secret);
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}
