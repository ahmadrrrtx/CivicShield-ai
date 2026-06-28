# Auth runtime verification notes

## Verified during Milestone 15B

- Dependencies now install successfully after compatibility corrections.
- Prisma client generation succeeds via `./node_modules/.bin/prisma generate`.
- Better Auth package exports verified:
  - `better-auth/next-js`
  - `nextCookies`
  - `toNextJsHandler`
  - `better-auth/adapters/prisma`
  - `prismaAdapter`
- Better Auth runtime architecture verified from installed package:
  - `auth.handler` is a single request handler function
  - Next.js route handlers should use `toNextJsHandler(auth)`
  - `auth.api.getSession` exists and requires request headers
  - `auth.api.signOut` exists and is the correct sign-out invalidation path

## Corrected in code

- Auth route now uses `toNextJsHandler(auth)`.
- Better Auth now uses the Prisma adapter explicitly.
- Better Auth now uses the Next cookie integration plugin.
- Custom sign-out route now calls `auth.api.signOut({ headers })` before fallback cookie cleanup.

## Still not fully runtime-proven end-to-end

These require a running app plus a real database migration cycle:

1. `prisma migrate dev`
2. actual DB connection against a live PostgreSQL instance
3. live browser sign-up flow
4. live browser sign-in flow
5. live `/api/auth/get-session` verification after login
6. confirmation of the exact Better Auth cookies set in browser
7. confirmation that sign-out invalidates server session and clears client cookies in practice

## Notes

Typecheck still reports pre-existing non-auth issues in retrieval, tests, and one Groq typing area. Those should be handled in a separate cleanup milestone rather than mixed into auth runtime hardening.
