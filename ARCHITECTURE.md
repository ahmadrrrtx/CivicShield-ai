# Architecture

## Overview
CivicShield AI is a Next.js application that combines a trust-governed civic chat experience with reviewer operations and audit tooling.

## Layers
1. Presentation layer
   - Next.js App Router pages and reusable UI components
2. Application layer
   - route handlers, session-aware orchestration, reviewer workflows
3. Domain layer
   - conversations, retrieval, audit, settings, reviewer access
4. Data layer
   - Prisma models for auth, settings, conversations, audit events, reviewer access

## Core principles
- evidence before generation
- fail closed on weak verification
- no final legal/government decisions by AI
- reviewer operations are access-controlled
- auditability is built into governance actions

## Key modules
- `src/lib/ai/*`
- `src/lib/retrieval/*`
- `src/lib/conversations.ts`
- `src/lib/settings-repository.ts`
- `src/lib/reviewer-auth.ts`
- `src/lib/audit.ts`
