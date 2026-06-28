# CivicShield AI — Final launch readiness

This document is the final launch-hardening checklist for CivicShield AI after Milestone 24.

## 1) Product safety requirements
These must remain true at launch:
- answers must remain grounded in verified official evidence
- every answer must preserve visible citations
- the assistant must not make legal or government decisions
- low-confidence fallback behavior must remain intact when evidence is insufficient
- reviewer workflows must remain reviewer-gated

## 2) Required environment readiness
Required runtime configuration:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`
- `NODE_ENV=production`
- `BETTER_AUTH_SECRET`
- `DATABASE_URL`
- `ENCRYPTION_KEY`
- `RETRIEVAL_TIMEOUT_MS`
- `RETRIEVAL_MAX_BYTES`
- `RETRIEVAL_CACHE_TTL_MS`

Reviewer / governance support:
- `REVIEWER_EMAIL_ALLOWLIST`
- `REVIEW_AUDIT_PAGE_SIZE`
- `REVIEWER_MANAGEMENT_PAGE_SIZE`

Optional AI provider configuration:
- `GROQ_API_KEY`
- `GROQ_BASE_URL`
- `GROQ_DEFAULT_MODEL`

## 3) Database readiness
Before production launch:
- real PostgreSQL is provisioned
- SSL requirements are included if provider requires them
- Prisma client generation succeeds
- migrations are applied successfully to the target database
- reviewer access records are seeded if DB-backed reviewer authorization will be used

## 4) Reviewer governance readiness
Before launch confirm:
- reviewer queue is accessible only to reviewer-authorized users
- review workflow writes status and notes correctly
- audit viewer is accessible only to reviewer-authorized users
- reviewer management surface is reviewer-gated
- audit export returns expected JSON payloads

## 5) Production verification checklist
### Build/runtime
- `npm install`
- `npm run prisma:generate`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

### Auth/runtime
- sign-up works
- sign-in works
- sign-out works
- `/app/settings` is protected when signed out
- `/app/settings` loads when signed in

### Civic AI behavior
- without Groq key, app fails closed safely
- with Groq key, chat answers remain evidence-backed
- citations are visible
- low-confidence fallback still appears when evidence is insufficient

### Review operations
- review page loads for reviewer
- audit page loads for reviewer
- reviewer management page loads for reviewer
- review updates persist
- reviewer records can be added and activated/deactivated

## 6) What this checklist does not automatically prove
This checklist does not itself prove:
- live production deployment success
- browser/device compatibility across all targets
- real hosted DB migration success unless actually executed
- full E2E production flows unless explicitly tested

## 7) Recommended launch order
1. finalize production env vars
2. apply Prisma migrations
3. seed reviewer access records
4. deploy preview
5. execute verification checklist
6. fix any env/auth/runtime regressions
7. deploy production
8. perform post-launch spot checks
