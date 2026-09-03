# Contributing to ARENA GRID

Thank you for helping improve ARENA GRID. Bug reports, documentation fixes, tests, design feedback,
and focused feature proposals are welcome.

## Before you start

- Search existing issues and pull requests before opening a duplicate.
- Use an issue to discuss large features, data-model changes, or breaking API changes before
  investing in an implementation.
- Never post credentials, personal data, access tokens, or vulnerability details in an issue. Follow
  [SECURITY.md](SECURITY.md) for security reports.
- Keep changes focused. Unrelated refactors should be separate pull requests.

## Local setup

Requirements: Node.js 24, pnpm 11, and Docker Compose.

```bash
cp .env.example .env
pnpm install --frozen-lockfile
docker compose up -d postgres redis minio mailpit
pnpm --filter @arena-grid/database db:validate
pnpm --filter @arena-grid/database db:generate
pnpm --filter @arena-grid/database db:seed
pnpm dev
```

The values in `.env.example` are for local development only. Do not commit `.env`, `.env.prod`,
database dumps, or any real secret. If a new environment variable is required for local development,
add only its name and a non-secret default (or an empty value) to `.env.example`; document
deployment-only values separately and update runtime validation.

## Making a change

1. Fork the repository and create a short-lived branch from `main`.
2. Add or update tests for behavior changes.
3. Update documentation and public contracts when applicable.
4. Run the full local quality gate:

   ```bash
   pnpm check
   pnpm build
   ```

5. Open a pull request using the repository template and explain the user impact, implementation,
   test evidence, and any migration or security risk.

Use clear commit messages written in the imperative mood. Maintainers may ask for commits to be
reorganized before merge. Pull requests require passing CI and review; submitting a change does not
guarantee that it will be accepted.

## Engineering expectations

- Preserve strict TypeScript and existing package boundaries.
- Treat authorization, tournament state transitions, and idempotency as server responsibilities;
  never rely on UI-only enforcement.
- Avoid logging secrets, credentials, raw authorization headers, or sensitive personal data.
- Use migrations for schema changes and document backward-compatibility and rollback considerations.
- Pin dependencies through the workspace catalog and commit lockfile changes.
- Keep public API and shared contract changes backward-compatible where practical; call out breaking
  changes explicitly.

## License of contributions

By submitting a contribution, you agree that it may be distributed under the project's
[MIT License](LICENSE). You confirm that you have the right to submit the contribution and that it
does not knowingly include third-party material under incompatible terms.
