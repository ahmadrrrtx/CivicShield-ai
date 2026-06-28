# Release Notes

## CivicShield AI 0.1.0
This release establishes the first public-ready code baseline for CivicShield AI.

### Highlights
- Verified civic AI chat with Groq-first provider abstraction
- Grounded retrieval and citation pipeline
- Conversation persistence, continuation, and quality feedback
- Reviewer queue, audit viewer, reviewer management, and workflow notes
- Launch runbooks and production build validation

### Verified in release engineering
- TypeScript typecheck
- ESLint pass with one non-blocking warning
- Lightweight tests
- Production build with validation env values

### Still requires live infrastructure
- real Prisma migration execution against hosted PostgreSQL
- hosted browser verification on Vercel
- live auth and reviewer flows in deployed environment
