# Security policy

Security reports are handled privately and in good faith. Please do not open a public issue for a
suspected vulnerability or include exploit details in public pull requests, discussions, logs, or
screenshots.

## Supported versions

Security fixes are made for the latest release and the current `main` branch. Older releases and
forks are not guaranteed to receive patches.

## Reporting a vulnerability

Use GitHub's private vulnerability reporting for this repository:

1. Open the repository's **Security** tab.
2. Choose **Advisories** and then **Report a vulnerability**.
3. Include the affected component and version or commit, impact, reproduction steps or proof of
   concept, and any suggested mitigation.

If private vulnerability reporting is not available, contact a maintainer privately and ask for a
secure reporting channel without disclosing technical details. Do not test against systems or
accounts you do not own or have explicit permission to use.

Maintainers aim to acknowledge a complete report within three business days and provide an initial
assessment within seven business days. Timelines for a fix depend on severity and complexity.
Reporters will be credited when desired and when disclosure is safe; coordinated disclosure should
wait until a fix is available to affected users.

## Scope and safe harbor

Reports about authentication or authorization bypasses, injection, SSRF, sensitive-data exposure,
insecure direct object references, unsafe file or URL handling, dependency compromise, and privilege
escalation are especially valuable. Social engineering, denial-of-service traffic, destructive
testing, privacy violations, and accessing or retaining other users' data are out of scope.

Good-faith research that follows this policy, minimizes impact, and stops after demonstrating the
issue will not be treated as malicious by the project. This statement cannot authorize testing of
third-party infrastructure.

## Secrets and deployment configuration

- `.env` and `.env.prod` are local, ignored files. Never commit them.
- Committed `*.example` files must contain only documented development values or unmistakable
  placeholders—never usable production credentials.
- Production secrets should be generated with a cryptographically secure generator, stored in the
  deployment platform's secret manager, scoped to the service that needs them, and rotated after
  suspected exposure.
- Before deployment, replace every `CHANGE_ME` and reserved `example.com` value in `.env.prod`; the
  API intentionally rejects unsafe production values.
- If a secret reaches Git history, logs, an issue, or a build artifact, revoke and rotate it
  immediately. Removing the text from Git is not sufficient.

Dependencies are updated through automated pull requests. Security-sensitive changes should include
regression tests when feasible and avoid publishing exploit details before users can update.
