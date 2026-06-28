# Security Policy

## Reporting a vulnerability
Please do not open public GitHub issues for sensitive security problems.

Until a dedicated security mailbox is established, share reports privately with the maintainers through the repository support channel and clearly label the report as SECURITY.

## Scope
This policy especially covers:
- authentication and authorization
- API key handling
- prompt injection and prompt leakage concerns
- evidence retrieval and source validation
- reviewer authorization
- audit log exposure
- secrets and environment variable handling

## Current security posture summary
- security headers enabled in middleware
- scoped session model
- encrypted provider-key persistence
- reviewer-gated governance surfaces
- rate limiting on chat
- evidence-policy fail-closed behavior

## Not yet fully complete
- browser-based penetration testing is not verified here
- production secret rotation procedure should be formalized
- richer CSRF strategy can be added as auth surface expands
