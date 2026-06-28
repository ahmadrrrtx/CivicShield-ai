# CivicShield AI deployment guide

This guide is the recommended path if you cannot run CivicShield AI locally.

## Recommended stack
- Hosting: Vercel
- Database: hosted PostgreSQL (Neon, Supabase Postgres, Railway Postgres, or equivalent)
- Runtime verification: Vercel preview deployment

## 1) Create a hosted PostgreSQL database
Use any PostgreSQL provider you trust. Recommended options:
- Neon
- Supabase Postgres
- Railway Postgres

You will need:
- a PostgreSQL connection string
- a database that Better Auth and Prisma can migrate

Expected format:

`postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require`

## 2) Create a Vercel project
1. Push the repository to GitHub
2. Import the repo into Vercel
3. Use the default Next.js framework detection
4. Do not add custom build commands yet unless needed

## 3) Add required Vercel environment variables
Set these in Vercel Project Settings → Environment Variables.

### Required
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`
- `NODE_ENV`
- `BETTER_AUTH_SECRET`
- `DATABASE_URL`
- `ENCRYPTION_KEY`
- `RETRIEVAL_TIMEOUT_MS`
- `RETRIEVAL_MAX_BYTES`
- `RETRIEVAL_CACHE_TTL_MS`

### Reviewer / governance environment support
- `REVIEWER_EMAIL_ALLOWLIST`
- `REVIEW_AUDIT_PAGE_SIZE`

### Optional for AI chat verification
- `GROQ_API_KEY`
- `GROQ_BASE_URL`
- `GROQ_DEFAULT_MODEL`

### Suggested values
- `NEXT_PUBLIC_APP_NAME=CivicShield AI`
- `NODE_ENV=production`
- `RETRIEVAL_TIMEOUT_MS=5000`
- `RETRIEVAL_MAX_BYTES=60000`
- `RETRIEVAL_CACHE_TTL_MS=300000`
- `GROQ_BASE_URL=https://api.groq.com/openai/v1`
- `GROQ_DEFAULT_MODEL=llama-3.3-70b-versatile`

### Important
- `NEXT_PUBLIC_APP_URL` must match your deployed Vercel URL or custom domain
- `BETTER_AUTH_SECRET` should be a long random secret
- `ENCRYPTION_KEY` should be a long random secret
- `DATABASE_URL` must be a real hosted PostgreSQL URL

## 4) Run Prisma migration against the hosted database
You have two safe options.

### Option A — run migration from a machine that has repo access
Run:
- `npm install`
- `npx prisma migrate dev --name init`

### Option B — if you do not run locally
Use a hosted shell / CI step / Codespace / one-time remote execution environment and run:
- `npm install`
- `npx prisma migrate deploy`

For production-like environments, `prisma migrate deploy` is preferred.

## 5) Trigger Vercel deployment
After env variables are set, redeploy the app.

## 6) Verify cloud deployment
After deployment, verify:
- `/api/health`
- `/auth/sign-up`
- `/auth/sign-in`
- `/app/settings`
- `/api/settings`
- `/api/auth/sign-out`

Use the checklist at:
- `scripts/vercel-preview-verification-checklist.md`

## 7) Better Auth notes for cloud deployment
- `NEXT_PUBLIC_APP_URL` must reflect the deployed base URL
- Sign-in and sign-out behavior depends on correct URL and cookies
- If the preview URL changes between deployments, update env if your auth behavior depends on the exact origin

## 8) What successful deployment means
A successful no-local verification path means:
- deployment builds successfully
- auth routes respond correctly
- sign-up works
- sign-in works
- protected settings are inaccessible when signed out
- protected settings are accessible when signed in
- sign-out invalidates access again

## 9) Final launch consolidation
Before production launch also review:
- `LAUNCH_READINESS.md`
- `scripts/production-env-checklist.md`
- `scripts/vercel-preview-verification-checklist.md`
- `scripts/milestone-22e-migration-readiness.md`

## 10) What is still not full production completion
Even after successful preview verification, production-hardening still remains:
- email verification
- password reset
- Google OAuth
- fuller protected route coverage
- CI / E2E automation
- live operational alerting / incident playbooks
