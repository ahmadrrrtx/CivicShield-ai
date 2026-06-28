# CivicShield AI — Vercel preview verification checklist

Use this checklist if you cannot run the app locally.

## Before deploying
- hosted PostgreSQL created
- `DATABASE_URL` ready
- `BETTER_AUTH_SECRET` generated
- `ENCRYPTION_KEY` generated
- Vercel project created
- required env variables added in Vercel

## After deployment

### 1) Health verification
Open:
- `/api/health`

Confirm:
- `ok: true`
- diagnostics are present
- app responds without server crash

### 2) Sign-up verification
Open:
- `/auth/sign-up`

Confirm:
- form renders
- email/password submission works
- app redirects toward `/app/settings`

### 3) Protected route verification
While signed out:
- open `/app/settings`
- confirm redirect to `/auth/sign-in`

### 4) Sign-in verification
Open:
- `/auth/sign-in`

Confirm:
- existing account can sign in
- redirect to `/app/settings`

### 5) Settings session verification
Open:
- `/api/settings`

Confirm:
- response includes `session`
- authenticated state reflects `type: user`

### 6) Sign-out verification
Use sign-out from settings.

Confirm:
- request succeeds
- `/app/settings` redirects to sign-in again
- session returns to guest mode where applicable

### 7) Optional provider verification
If Groq is configured:
- save provider key if needed
- ask a civic question in chat
- confirm evidence-backed output behavior

If Groq is not configured:
- confirm the app fails safely with a low-confidence fallback

## Success criteria
Milestone 16A is successfully verified when:
- deployment is healthy
- auth pages render
- sign-up works
- sign-in works
- protected settings are protected
- sign-out invalidates access
- settings/session endpoints behave consistently
