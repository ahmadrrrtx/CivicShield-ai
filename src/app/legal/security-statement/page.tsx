export default function SecurityStatementPage() {
  return (
    <>
      <h1>Security Statement</h1>
      <p>
        CivicShield AI is designed with secure defaults, including input validation, output controls, security headers, protected configuration handling, and future-ready auditability.
      </p>
      <h2>Security principles</h2>
      <ul>
        <li>minimum necessary data collection</li>
        <li>defense in depth for AI and web risks</li>
        <li>strict handling of provider API credentials</li>
        <li>role-based administrative access</li>
        <li>monitoring and review of unsafe or low-confidence responses</li>
      </ul>
      <h2>AI-specific safeguards</h2>
      <p>
        The product is intended to mitigate prompt injection, source spoofing, and hallucinated factual claims by grounding responses in approved sources and refusing unsupported answers where appropriate.
      </p>
    </>
  );
}
