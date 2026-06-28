export default function PrivacyPolicyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p>
        CivicShield AI is designed to minimize personal data use. Users can explore public-service information in guest mode without creating an account. Where account, provider configuration, or saved history features are used, we collect only the information necessary to operate those features.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>optional account details such as email address</li>
        <li>conversation content when a user chooses to save it</li>
        <li>provider configuration metadata needed to test and manage AI connections</li>
        <li>operational logs for security, abuse prevention, and reliability</li>
      </ul>
      <h2>What we do not promise</h2>
      <p>
        Users should not submit highly sensitive information unless it is necessary for a feature that explicitly requests it. The MVP is built to support civic guidance, not secure legal, medical, or identity-record processing.
      </p>
      <h2>Data retention</h2>
      <p>
        Guest sessions should be treated as temporary. Saved account data is retained only as long as needed to provide requested features, maintain security, or meet legal obligations.
      </p>
      <h2>User controls</h2>
      <p>
        Users should be able to delete saved conversations, remove API keys, and close their accounts when these features are enabled in the application.
      </p>
    </>
  );
}
