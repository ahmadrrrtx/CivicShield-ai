import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  GROQ_BASE_URL: z.string().url().default('https://api.groq.com/openai/v1'),
  GROQ_DEFAULT_MODEL: z.string().min(1).default('llama-3.3-70b-versatile')
});

const serverEnvSchema = z.object({
  GROQ_API_KEY: z.string().min(1).optional(),
  BETTER_AUTH_SECRET: z.string().min(16),
  ENCRYPTION_KEY: z.string().min(16),
  DATABASE_URL: z.string().url().or(z.string().startsWith('postgresql://')),
  RETRIEVAL_TIMEOUT_MS: z.coerce.number().int().min(1000).max(15000).default(5000),
  RETRIEVAL_MAX_BYTES: z.coerce.number().int().min(2000).max(500000).default(60000),
  RETRIEVAL_CACHE_TTL_MS: z.coerce.number().int().min(1000).max(3600000).default(300000),
  AI_PROVIDER_TIMEOUT_MS: z.coerce.number().int().min(3000).max(30000).default(15000)
});

const publicEnvInput = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NODE_ENV: process.env.NODE_ENV,
  GROQ_BASE_URL: process.env.GROQ_BASE_URL,
  GROQ_DEFAULT_MODEL: process.env.GROQ_DEFAULT_MODEL
};

const serverEnvInput = {
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  RETRIEVAL_TIMEOUT_MS: process.env.RETRIEVAL_TIMEOUT_MS,
  RETRIEVAL_MAX_BYTES: process.env.RETRIEVAL_MAX_BYTES,
  RETRIEVAL_CACHE_TTL_MS: process.env.RETRIEVAL_CACHE_TTL_MS,
  AI_PROVIDER_TIMEOUT_MS: process.env.AI_PROVIDER_TIMEOUT_MS
};

let cachedEnv: z.infer<typeof envSchema> | null = null;
let cachedServerEnv: z.infer<typeof serverEnvSchema> | null = null;

export function getEnv() {
  if (cachedEnv) return cachedEnv;
  cachedEnv = envSchema.parse(publicEnvInput);
  return cachedEnv;
}

export function getServerEnv() {
  if (cachedServerEnv) return cachedServerEnv;
  cachedServerEnv = serverEnvSchema.parse(serverEnvInput);
  return cachedServerEnv;
}

export const env = new Proxy({} as z.infer<typeof envSchema>, {
  get(_target, prop) {
    return getEnv()[prop as keyof z.infer<typeof envSchema>];
  }
});

export const serverEnv = new Proxy({} as z.infer<typeof serverEnvSchema>, {
  get(_target, prop) {
    return getServerEnv()[prop as keyof z.infer<typeof serverEnvSchema>];
  }
});

export function getRuntimeDiagnostics() {
  const publicParsed = envSchema.safeParse(publicEnvInput);
  const serverParsed = serverEnvSchema.safeParse(serverEnvInput);

  return {
    nodeEnv: publicParsed.success ? publicParsed.data.NODE_ENV : process.env.NODE_ENV || 'development',
    groqConfigured: Boolean(serverEnvInput.GROQ_API_KEY),
    betterAuthConfigured: Boolean(serverEnvInput.BETTER_AUTH_SECRET),
    databaseConfigured: Boolean(serverEnvInput.DATABASE_URL),
    encryptionConfigured: Boolean(serverEnvInput.ENCRYPTION_KEY),
    retrievalTimeoutMs: serverParsed.success ? serverParsed.data.RETRIEVAL_TIMEOUT_MS : undefined,
    retrievalMaxBytes: serverParsed.success ? serverParsed.data.RETRIEVAL_MAX_BYTES : undefined,
    retrievalCacheTtlMs: serverParsed.success ? serverParsed.data.RETRIEVAL_CACHE_TTL_MS : undefined,
    aiProviderTimeoutMs: serverParsed.success ? serverParsed.data.AI_PROVIDER_TIMEOUT_MS : undefined,
    publicEnvValid: publicParsed.success,
    serverEnvValid: serverParsed.success,
    missingPublicEnv: publicParsed.success ? [] : publicParsed.error.issues.map((issue) => issue.path.join('.')),
    missingServerEnv: serverParsed.success ? [] : serverParsed.error.issues.map((issue) => issue.path.join('.'))
  };
}
