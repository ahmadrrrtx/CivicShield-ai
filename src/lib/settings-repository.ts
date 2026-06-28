import { db } from '@/lib/db';
import { decryptText, encryptText } from '@/lib/crypto';
import { serverEnv } from '@/lib/env';
import { getSettings as getFileSettings, readProviderKey as readFileProviderKey, saveProviderKey as saveFileProviderKey } from '@/lib/settings-store';

export type SettingsScope = {
  scopeType: 'guest' | 'user';
  scopeId: string;
};

export async function getSettingsForScope(scope: SettingsScope) {
  try {
    const existing = await db.appSettings.findUnique({ where: { scopeId: scope.scopeId } });

    if (existing) {
      return {
        sessionId: scope.scopeId,
        provider: 'groq' as const,
        groqKeyConfigured: Boolean(existing.encryptedGroqApiKey),
        theme: (existing.theme as 'light' | 'dark' | 'system') || 'system',
        language: existing.language || 'en',
        updatedAt: existing.updatedAt.toISOString(),
        persistence: 'database' as const
      };
    }
  } catch {
    // fall through to file-backed fallback
  }

  const fileSettings = await getFileSettings(scope.scopeId);
  return {
    ...fileSettings,
    persistence: 'file' as const
  };
}

export async function saveProviderKeyForScope(scope: SettingsScope, apiKey: string) {
  try {
    const encryptedGroqApiKey = encryptText(apiKey, serverEnv.ENCRYPTION_KEY);
    const saved = await db.appSettings.upsert({
      where: { scopeId: scope.scopeId },
      update: {
        provider: 'groq',
        encryptedGroqApiKey,
        updatedAt: new Date()
      },
      create: {
        scopeType: scope.scopeType,
        scopeId: scope.scopeId,
        provider: 'groq',
        encryptedGroqApiKey,
        theme: 'system',
        language: 'en'
      }
    });

    return {
      sessionId: scope.scopeId,
      provider: 'groq' as const,
      groqKeyConfigured: Boolean(saved.encryptedGroqApiKey),
      theme: (saved.theme as 'light' | 'dark' | 'system') || 'system',
      language: saved.language || 'en',
      updatedAt: saved.updatedAt.toISOString(),
      persistence: 'database' as const
    };
  } catch {
    const fallback = await saveFileProviderKey(scope.scopeId, apiKey);
    return {
      ...fallback,
      persistence: 'file' as const
    };
  }
}

export async function readProviderKeyForScope(scope: SettingsScope) {
  try {
    const existing = await db.appSettings.findUnique({ where: { scopeId: scope.scopeId } });
    if (existing?.encryptedGroqApiKey) {
      return decryptText(existing.encryptedGroqApiKey, serverEnv.ENCRYPTION_KEY);
    }
  } catch {
    // fall through
  }

  return readFileProviderKey(scope.scopeId);
}

export async function resolveGroqApiKeyForScope(scope: SettingsScope) {
  const stored = await readProviderKeyForScope(scope);
  if (stored) return stored;
  return process.env.GROQ_API_KEY || null;
}

export async function migrateFileSettingsToDatabase(scope: SettingsScope) {
  try {
    const existing = await db.appSettings.findUnique({ where: { scopeId: scope.scopeId } });
    if (existing) return false;

    const fileSettings = await getFileSettings(scope.scopeId);
    const fileKey = await readFileProviderKey(scope.scopeId);

    if (!fileSettings.updatedAt && !fileKey) return false;

    await db.appSettings.create({
      data: {
        scopeType: scope.scopeType,
        scopeId: scope.scopeId,
        provider: 'groq',
        encryptedGroqApiKey: fileKey ? encryptText(fileKey, serverEnv.ENCRYPTION_KEY) : null,
        theme: fileSettings.theme || 'system',
        language: fileSettings.language || 'en',
        migratedFromFile: true
      }
    });

    return true;
  } catch {
    return false;
  }
}

export async function migrateGuestSettingsToUser(guestScopeId: string, userScopeId: string) {
  try {
    const existingUser = await db.appSettings.findUnique({ where: { scopeId: userScopeId } });
    if (existingUser) return false;

    const guestDb = await db.appSettings.findUnique({ where: { scopeId: guestScopeId } });
    if (guestDb) {
      await db.appSettings.create({
        data: {
          scopeType: 'user',
          scopeId: userScopeId,
          provider: guestDb.provider,
          encryptedGroqApiKey: guestDb.encryptedGroqApiKey,
          theme: guestDb.theme,
          language: guestDb.language,
          migratedFromFile: guestDb.migratedFromFile
        }
      });
      return true;
    }
  } catch {
    // fall through to file-backed migration path
  }

  try {
    const fileSettings = await getFileSettings(guestScopeId);
    const fileKey = await readFileProviderKey(guestScopeId);

    if (!fileSettings.updatedAt && !fileKey) return false;

    await db.appSettings.create({
      data: {
        scopeType: 'user',
        scopeId: userScopeId,
        provider: 'groq',
        encryptedGroqApiKey: fileKey ? encryptText(fileKey, serverEnv.ENCRYPTION_KEY) : null,
        theme: fileSettings.theme || 'system',
        language: fileSettings.language || 'en',
        migratedFromFile: true
      }
    });

    return true;
  } catch {
    return false;
  }
}
