import { promises as fs } from 'fs';
import path from 'path';
import { decryptText, encryptText } from '@/lib/crypto';
import { serverEnv } from '@/lib/env';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings-store.json');

export type PersistedSettings = {
  sessionId: string;
  provider: 'groq';
  encryptedGroqApiKey?: string;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  updatedAt: string;
};

type SettingsStoreFile = Record<string, PersistedSettings>;

async function readStore(): Promise<SettingsStoreFile> {
  try {
    const content = await fs.readFile(SETTINGS_FILE, 'utf8');
    return JSON.parse(content) as SettingsStoreFile;
  } catch {
    return {};
  }
}

async function writeStore(store: SettingsStoreFile) {
  await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(store, null, 2), 'utf8');
}

export async function getSettings(sessionId: string) {
  const store = await readStore();
  const record = store[sessionId] || null;

  return {
    sessionId,
    provider: record?.provider || 'groq',
    groqKeyConfigured: Boolean(record?.encryptedGroqApiKey),
    theme: record?.theme || 'system',
    language: record?.language || 'en',
    updatedAt: record?.updatedAt || null
  };
}

export async function saveProviderKey(sessionId: string, apiKey: string) {
  const store = await readStore();
  const existing = store[sessionId];

  store[sessionId] = {
    sessionId,
    provider: 'groq',
    encryptedGroqApiKey: encryptText(apiKey, serverEnv.ENCRYPTION_KEY),
    theme: existing?.theme || 'system',
    language: existing?.language || 'en',
    updatedAt: new Date().toISOString()
  };

  await writeStore(store);
  return getSettings(sessionId);
}

export async function readProviderKey(sessionId: string) {
  const store = await readStore();
  const record = store[sessionId];
  if (!record?.encryptedGroqApiKey) return null;
  return decryptText(record.encryptedGroqApiKey, serverEnv.ENCRYPTION_KEY);
}
