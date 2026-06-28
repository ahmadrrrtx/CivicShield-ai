# CivicShield AI

<p align="center">
  <img src="public/brand/logo.svg" alt="CivicShield AI logo" width="400" />
</p>

<p align="center"><strong>Trusted AI guidance for public services, grounded in official sources.</strong></p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15.5.19-000000?logo=nextdotjs" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-ready-336791?logo=postgresql" />
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-deployable-000000?logo=vercel" />
  <img alt="Groq" src="https://img.shields.io/badge/Groq-provider-F55036" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green" />
</p>

## Why CivicShield AI exists
CivicShield AI is built to help people navigate public benefits, government services, and urgent support pathways without sacrificing trust. The product is designed so the AI should not invent civic facts, should preserve citations, and should fail closed when evidence cannot be verified safely.

## Screenshots and demo assets
Add final deployed screenshots before hackathon submission:

- Landing page
- Chat answer with verified citations
- Conversation history
- Reviewer queue
- Audit export

Recommended path: `docs/screenshots/`.

## Feature highlights
- Evidence-first civic AI chat
- Verified retrieval and citation traceability
- Guest and authenticated session flows
- Scoped settings persistence and provider-key handling
- Conversation history, continuation, and regenerate foundation
- Transcript quality feedback
- Reviewer queue, workflow notes, and status management
- Persistent audit model, audit viewer, and JSON export
- Reviewer access management with DB-backed foundation

## Tech stack
- Next.js App Router
- React 19
- TypeScript
- Prisma + PostgreSQL
- Better Auth
- Groq
- Zod

## Repository structure
```mermaid
flowchart TD
  A[repo root] --> B[src/app]
  A --> C[src/components]
  A --> D[src/lib]
  A --> E[prisma]
  A --> F[public]
  A --> G[scripts]
  A --> H[tests]
  B --> B1[pages + route handlers]
  C --> C1[app UI]
  C --> C2[auth UI]
  C --> C3[marketing + layout + ui]
  D --> D1[ai]
  D --> D2[retrieval]
  D --> D3[auth settings audit conversations]
```

## Overall architecture
```mermaid
flowchart LR
  U[User] --> W[Next.js UI]
  W --> A[API Routes]
  A --> S[Session/Auth Layer]
  A --> R[Retrieval Pipeline]
  R --> P[Policy Gate]
  P --> G[Groq Provider]
  A --> DB[(PostgreSQL via Prisma)]
  A --> AU[Audit + Reviewer Ops]
```

## Request lifecycle
```mermaid
sequenceDiagram
  participant User
  participant UI
  participant API
  participant Retrieval
  participant Policy
  participant AI
  participant DB

  User->>UI: submit civic question
  UI->>API: POST /api/chat
  API->>Retrieval: gather candidate evidence
  Retrieval->>Policy: verified evidence bundle
  Policy-->>API: allow / fail-closed
  API->>AI: generate grounded answer
  API->>DB: save conversation/transcript
  API-->>UI: answer + citations + confidence
```

## AI provider abstraction
```mermaid
flowchart LR
  ChatRoute[/api/chat/] --> Registry[AI registry]
  Registry --> Groq[Groq adapter]
  Registry -. future .-> Other[Future providers]
```

## Authentication flow
```mermaid
flowchart TD
  G[Guest visitor] --> C[guest cookie]
  U[Signed-in user] --> BA[Better Auth session]
  C --> SS[getCurrentSession]
  BA --> SS
  SS --> Scoped[scoped settings, conversations, review access]
```

## Database relationships
```mermaid
erDiagram
  User ||--o{ Session : has
  User ||--o{ Account : has
  User ||--o{ Conversation : owns
  Conversation ||--o{ ConversationMessage : contains
  ReviewerAccess {
    string email
    boolean active
  }
  AuditEvent {
    string event
    string level
    string targetType
    string targetId
  }
```

## Deployment pipeline
```mermaid
flowchart LR
  Dev[Developer / Maintainer] --> GitHub[GitHub repo]
  GitHub --> Vercel[Vercel project]
  Vercel --> Build[next build]
  Build --> App[Production app]
  App --> DB[(Hosted PostgreSQL)]
  App --> GroqAPI[Groq API]
```

## Retrieval and citation pipeline
```mermaid
flowchart TD
  Q[Question] --> O[Retrieval orchestrator]
  O --> C[Catalog sources]
  O --> L[Live allowlisted fetch]
  C --> V[Verification + normalization]
  L --> V
  V --> Pa[Passage extraction]
  Pa --> Po[Policy evaluation]
  Po --> Ans[Grounded answer + citations]
```

## System requirements
- Node.js 20+
- npm 10+
- PostgreSQL for full persistence and auth/reviewer flows

## Local setup
1. Clone the repository
2. Run `npm install`
3. Copy `.env.local.example` to `.env.local`
4. Generate secrets with `node scripts/generate-local-secrets.mjs`
5. Set a working `DATABASE_URL`
6. Run `npm run prisma:generate`
7. Run `npx prisma migrate dev --name init`
8. Run `npm run dev`

## Environment variables

Minimum production deployment variables:

| Variable | Required | Secret | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Yes | No | Must match the deployed Vercel URL or custom domain. |
| `NEXT_PUBLIC_APP_NAME` | Yes | No | Example: `CivicShield AI`. |
| `BETTER_AUTH_SECRET` | Yes | Yes | Generate with `node scripts/generate-local-secrets.mjs` or `openssl rand -hex 32`. |
| `ENCRYPTION_KEY` | Yes | Yes | Used to encrypt scoped provider API keys. Generate locally. |
| `DATABASE_URL` | Yes | Yes | Hosted PostgreSQL URL from Neon, Supabase, Railway, or equivalent. |
| `GROQ_API_KEY` | Recommended | Yes | Server-level Groq key for AI responses. Users can also save a scoped key in Settings. |
| `GROQ_BASE_URL` | Optional | No | Defaults to `https://api.groq.com/openai/v1`. |
| `GROQ_DEFAULT_MODEL` | Optional | No | Defaults to `llama-3.3-70b-versatile`. |
| `RETRIEVAL_TIMEOUT_MS` | Optional | No | Defaults to `5000`. |
| `RETRIEVAL_MAX_BYTES` | Optional | No | Defaults to `60000`. |
| `RETRIEVAL_CACHE_TTL_MS` | Optional | No | Defaults to `300000`. |
| `AI_PROVIDER_TIMEOUT_MS` | Optional | No | Defaults to `15000`. |
| `REVIEWER_EMAIL_ALLOWLIST` | Recommended | Semi-sensitive | Comma-separated reviewer bootstrap emails. |
| `REVIEW_AUDIT_PAGE_SIZE` | Optional | No | Defaults to `20`. |
| `REVIEWER_MANAGEMENT_PAGE_SIZE` | Optional | No | Defaults to `20`. |

See also:
- `.env.example`
- `.env.local.example`
- `scripts/production-env-checklist.md`
- `LAUNCH_READINESS.md`

## Database setup
- Provision PostgreSQL
- Set `DATABASE_URL`
- Generate Prisma client
- Commit Prisma migrations and apply them with `prisma migrate deploy` in production

## Commands
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run prisma:generate`
- `npm run prisma:migrate:dev`
- `npm run prisma:migrate:deploy`

## Deployment
Start with:
- `DEPLOYMENT.md`
- `LAUNCH_READINESS.md`
- `scripts/vercel-preview-verification-checklist.md`

## Security features
- security headers
- rate limiting on chat
- encrypted provider-key storage
- reviewer-gated governance tooling
- audit event persistence foundation
- evidence-policy fail-closed behavior

## Trust & safety
- official-source grounding only
- low-confidence fallback for insufficient evidence
- no final legal or government decisions by AI

## Open-source project docs
- `ARCHITECTURE.md`
- `ROADMAP.md`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `SUPPORT.md`
- `AI_USAGE.md`
- `PRIVACY.md`
- `THREAT_MODEL.md`
- `RELEASE_NOTES.md`
- `LAUNCH_READINESS.md`


## Known limitations
- The MVP currently focuses on a small allowlist of official U.S. public-service sources.
- Groq is the only active AI provider; other provider entries are placeholders for future expansion.
- AI streaming is not enabled in this build.
- Email verification, password reset, and Google OAuth are not enabled yet.
- Production launch requires committed Prisma migrations and live database verification.

## License
MIT — see `LICENSE`.

## Credits
Built as a civic AI release-engineering project with a trust-first architecture for public-service guidance.
