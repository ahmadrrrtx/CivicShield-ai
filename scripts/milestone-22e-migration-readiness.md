# Milestone 22E migration readiness

This project now includes additional Prisma models and fields for:
- conversation review workflow
- durable audit event persistence
- reviewer access records

## New schema areas introduced by recent milestones
- `Conversation.reviewStatus`
- `Conversation.reviewNote`
- `Conversation.reviewedAt`
- `AuditEvent`
- `ReviewerAccess`

## Recommended migration path
If you have a real hosted PostgreSQL database available, use this order:

1. Install dependencies
   - `npm install`

2. Generate Prisma client
   - `npm run prisma:generate`

3. Create and apply a development migration in a development environment
   - `npx prisma migrate dev --name review_audit_roles`

4. For deployed environments, apply committed migrations with:
   - `npx prisma migrate deploy`

## Required environment readiness
You must have a real `DATABASE_URL` set.

Expected shape:
- `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require`

## Reviewer bootstrap options
You now have two ways to grant reviewer access:

### Option A — environment bootstrap
Set:
- `REVIEWER_EMAIL_ALLOWLIST=user@example.com,reviewer@example.com`

### Option B — durable DB-backed reviewer records
After migration, insert rows into `ReviewerAccess` with:
- reviewer email
- `active=true`

## What this milestone does not claim
This file does not mean migration was already run successfully against your real database.
If no real `DATABASE_URL` is present, live migration remains unverified.
