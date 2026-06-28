# CivicShield AI — Local auth verification checklist

## 1) Prepare environment

1. Copy env template:
   - `cp .env.local.example .env.local`
2. Generate secrets:
   - `node scripts/generate-local-secrets.mjs`
3. Paste the generated values into `.env.local` for:
   - `BETTER_AUTH_SECRET`
   - `ENCRYPTION_KEY`
4. Ensure PostgreSQL is running locally.
5. Create a database named `civicshield` if it does not already exist.

## 2) Install and generate

- `npm install`
- `npm run prisma:generate`

## 3) Run migrations

- `npx prisma migrate dev --name init`

If migration fails:
- verify `DATABASE_URL`
- verify PostgreSQL host, port, user, password
- verify the database exists

## 4) Start the app

- `npm run dev`

Expected local app URL:
- `http://localhost:3000`

## 5) Verify auth flows manually

### Sign up
1. Open `http://localhost:3000/auth/sign-up`
2. Create an account with email + password
3. Confirm redirect toward `/app/settings`
4. Confirm settings page loads as authenticated user

### Sign in
1. Sign out
2. Open `http://localhost:3000/auth/sign-in`
3. Sign in with the same credentials
4. Confirm redirect to `/app/settings`

### Protected route verification
1. While signed out, visit `/app/settings`
2. Confirm redirect to `/auth/sign-in`
3. While signed in, revisit `/app/settings`
4. Confirm access is allowed

### Session verification
1. Call `GET /api/settings`
2. Confirm session payload shows `type: user`
3. Confirm account email is present

### Sign-out verification
1. Use the Sign out button
2. Confirm session returns to guest mode
3. Confirm `/app/settings` redirects to sign-in again

## 6) Optional provider verification

If you set `GROQ_API_KEY` or save a scoped key in settings:
1. Go to app chat
2. submit a prompt
3. confirm grounded response behavior
4. confirm low-confidence fallback still appears when evidence cannot be verified

## 7) What counts as successful Milestone 16 completion

- migrations run successfully
- sign-up works
- sign-in works
- settings route is protected
- session resolution shows authenticated user
- sign-out invalidates access to protected settings
