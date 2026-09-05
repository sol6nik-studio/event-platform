# ARENA GRID project constitution

Baseline date: `2026-09-04`. This file contains only repository-wide rules. Detailed procedures live
in project Skills under `.codex/skills/` and are loaded only when their scope applies.

## Non-negotiable rules

- Write all production code in TypeScript with `strict: true`. Do not use `any` unless the exception
  is documented next to the narrow boundary, justified, and covered by a runtime validator and test.
- Keep business rules out of React components and Next.js Route Handlers. The frontend never
  connects directly to PostgreSQL; `apps/api` is the source of truth and is called through
  `packages/api-client`.
- Design APIs contract-first. Validate every external input, enforce authentication, RBAC and
  resource ownership on the backend, and never trust client-supplied identity or authorization
  state.
- Store money as integer minor units with an explicit currency. Store instants as timezone-aware
  UTC; render public dates with an explicit user or event timezone.
- Execute tournament, registration, match and dispute transitions through domain state machines.
  Reject invalid transitions in the domain layer.
- Make critical mutations, jobs and external callbacks idempotent. Result changes, moderator
  overrides and privileged tournament actions must append an `AuditEvent` in the same reliable
  workflow.
- PostgreSQL migrations are forward-only and immutable after application to a shared environment. A
  migration that may lose data requires an explicit decision before execution.
- Add a new architectural dependency, change a key technology major, move a module boundary or
  introduce a service only through an accepted ADR.
- Never hide or waive failing tests, typecheck, lint, contract validation or migration checks. A
  completed user journey cannot replace its backend with mock data.
- Never commit credentials, tokens, production data, private evidence, or `.env` files. Never log
  secrets, authentication material or full personal data.
- Do not use game logos, official art, screenshots or other assets unless their license and
  permitted use are recorded.
- Do not claim completion until every applicable item in `docs/engineering/definition-of-done.md`
  and every linked requirement in `docs/engineering/requirements-traceability.md` is verified.

## Skill routing

Load every Skill whose scope materially applies; do not load unrelated references.

| Task                                                                 | Required Skill               |
| -------------------------------------------------------------------- | ---------------------------- |
| Scope, roles, flow, MVP, acceptance or product metrics               | `arena-product-requirements` |
| Tournament entities, formats, eligibility, state or bracket behavior | `arena-tournament-domain`    |
| Modules, dependencies, infrastructure, integrations or ADRs          | `arena-system-architecture`  |
| `apps/api`, `apps/worker`, NestJS, jobs or realtime delivery         | `arena-backend-node`         |
| `apps/web`, Next.js rendering, routing or frontend state             | `arena-frontend-next`        |
| OpenAPI, DTO/schema compatibility or generated client                | `arena-api-contracts`        |
| Prisma, PostgreSQL, migrations, indexes, retention or recovery       | `arena-database`             |
| Identity, permissions, privacy, secrets, uploads or threat review    | `arena-auth-security`        |
| Tokens, UI primitives, content, responsive behavior or accessibility | `arena-design-system`        |
| Test design, coverage, fixtures, quality gates or release evidence   | `arena-testing-quality`      |
| Logs, traces, metrics, SLOs, alerts or runbook signals               | `arena-observability`        |
| Local stack, CI/CD, environments, deploy, rollback or recovery       | `arena-devops-release`       |
| Review, audit, risk classification or merge recommendation           | `arena-code-review`          |

Cross-cutting changes normally require several Skills: for example, a result-submission feature uses
product, domain, architecture, backend, API, database, security, testing and observability Skills,
plus frontend/design Skills when UI changes. The authoritative map and ownership matrix are in
`docs/engineering/skills-map.md`.

## Conflict and stopping rule

Precedence is: explicit user requirement, this constitution, accepted ADRs, owning Skill reference,
then implementation convention. Stop and request a decision for conflicting mandatory rules,
security/privacy storage choices, real payments, unlicensed assets, baseline violations, breaking
API changes, potentially destructive migrations, or any required validation that cannot be run. Do
not silently make an irreversible decision.
