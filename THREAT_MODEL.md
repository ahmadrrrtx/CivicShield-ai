# Threat Model

## Primary risks considered
- hallucinated or unsupported civic guidance
- prompt injection through retrieved content
- secrets exposure
- unauthorized reviewer access
- audit log leakage
- abuse of provider-key storage
- rate-limit evasion

## Current mitigations
- evidence-first retrieval pipeline
- trust policy gating and low-confidence fallback
- security headers in middleware
- scoped session handling
- reviewer-gated governance surfaces
- encrypted provider-key persistence
- chat rate limiting

## Remaining threat-model work
- formal STRIDE or equivalent review for production launch
- live penetration testing
- incident response playbook formalization
