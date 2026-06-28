# CivicShield AI production environment checklist

## Required environment variables

### Public
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`
- `NODE_ENV`

### Server
- `BETTER_AUTH_SECRET`
- `DATABASE_URL`
- `ENCRYPTION_KEY`
- `RETRIEVAL_TIMEOUT_MS`
- `RETRIEVAL_MAX_BYTES`
- `RETRIEVAL_CACHE_TTL_MS`
- `AI_PROVIDER_TIMEOUT_MS`

### Optional AI provider variables
- `GROQ_API_KEY`
- `GROQ_BASE_URL`
- `GROQ_DEFAULT_MODEL`

## Recommended values
- `NEXT_PUBLIC_APP_NAME=CivicShield AI`
- `NODE_ENV=production`
- `GROQ_BASE_URL=https://api.groq.com/openai/v1`
- `GROQ_DEFAULT_MODEL=llama-3.3-70b-versatile`
- `RETRIEVAL_TIMEOUT_MS=5000`
- `RETRIEVAL_MAX_BYTES=60000`
- `RETRIEVAL_CACHE_TTL_MS=300000`
- `AI_PROVIDER_TIMEOUT_MS=15000`

## Secret generation guidance
Use long random secrets for:
- `BETTER_AUTH_SECRET`
- `ENCRYPTION_KEY`

If you have access to Node locally or in a cloud shell, you can run:
- `node scripts/generate-local-secrets.mjs`

## Database checklist
- PostgreSQL is reachable from the deployment runtime
- `DATABASE_URL` includes the correct database name
- SSL requirements are included when required by the provider
- migrations are executed before full auth verification

## Auth verification checklist
- `NEXT_PUBLIC_APP_URL` matches the actual deployment base URL
- sign-up works
- sign-in works
- sign-out works
- protected settings redirect when signed out
- protected settings load when signed in

## AI verification checklist
- without a Groq key, the app fails closed safely
- with a Groq key, responses still require verified evidence
- low-confidence behavior remains visible when evidence is insufficient
