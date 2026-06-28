# Contributing to CivicShield AI

Thank you for your interest in contributing.

## Development principles
- Preserve evidence-first behavior
- Do not introduce unsupported civic claims
- Prefer reusable components and repository-level abstractions
- Keep reviewer and audit workflows secure
- Add or update tests when trust logic changes

## Local workflow
1. Fork the repository
2. Create a feature branch
3. Install dependencies with `npm install`
4. Configure `.env.local`
5. Run `npm run prisma:generate`
6. Run `npm run typecheck && npm run lint && npm run test`
7. Open a pull request with a clear summary

## Pull request expectations
- Describe what changed
- Describe why it changed
- Call out security or trust impacts
- Include screenshots for UI changes
- Note any infrastructure requirements
