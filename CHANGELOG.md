# Changelog

All notable changes to CivicShield AI will be documented in this file.

The format is based on Keep a Changelog and this project follows Semantic Versioning once public versioning begins.

## [0.1.0] - 2026-06-28
### Added
- Premium Next.js civic AI application shell
- Evidence-first civic chat with Groq provider abstraction
- Verified retrieval, citation traceability, and trust policy gating
- Guest and authenticated session flows with Better Auth foundation
- Scoped settings persistence with Prisma-first repository model
- Conversation history, detail pages, continuation, and regenerate foundation
- Transcript feedback, reviewer queue, review workflow, and reviewer management
- Persistent audit model, audit viewer, and audit export route
- Deployment runbooks, launch readiness checklist, and verification documentation

### Changed
- Upgraded Next.js to 15.5.19 for patched 15.x baseline
- Refactored environment loading to lazy validation model
- Hardened ESLint configuration for generated build artifacts

### Verification
- Typecheck passed
- Lint passed with one non-blocking warning in `prettier.config.mjs`
- Lightweight trust tests passed
- Production build passed with validation env values

## Unreleased
- Browser-based hosted deployment verification
- Live database migration execution against production infrastructure
- Auth completion (email verification, password reset, OAuth)
- CI / E2E automation and richer audit querying
