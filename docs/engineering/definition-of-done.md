# Definition of Done

A task is done only when the applicable evidence below is present. “Not applicable” must name the item and rationale; it is not a silent omission.

## Every change

- Requirement IDs, actor/authorization impact and source of truth are identified.
- Scope, implementation and tests contain no hidden placeholder, fake completed action, untracked TODO or unrelated change.
- Format, lint and strict typecheck pass without suppressing errors; no undocumented `any` is introduced.
- Unit/domain/component tests cover changed logic and negative paths. Relevant integration and contract tests use real boundaries.
- Documentation, generated artifacts and traceability entries are updated when their contracts changed.
- No credential, token, `.env`, production data, private evidence, unlicensed asset or unnecessary dependency is committed.
- The agent reports commands run, outcomes, limitations and remaining risks.

## External behavior or critical mutation

- Product acceptance covers actor, preconditions, happy path, alternatives, errors, authorization, analytics and out-of-scope.
- Domain transitions and invariants reject invalid, duplicate and concurrent operations.
- Backend validation, authorization, idempotency, transaction boundary, structured errors and audit obligations are tested.
- OpenAPI is valid, implementation conforms, generated client is current, and compatibility is classified.
- Database constraints, indexes, concurrency behavior and migration safety are reviewed on empty and previous schemas.
- Threat/privacy review meets OWASP ASVS 5.0 Level 2 scope; logs and telemetry are checked for sensitive data.
- Logs, traces and metrics identify the operation safely; SLI/alert/runbook impact is handled.
- User-visible states include loading, empty, error, offline and forbidden behavior with WCAG 2.2 AA evidence.
- Critical user journey and retry/idempotency behavior pass at the required test level.

## Release or infrastructure

- Frozen install, format, lint, typecheck, tests, OpenAPI, Prisma validation, production build, smoke, dependency, secret and container gates pass.
- Deployment, backward-compatible migration order, health verification, rollback/roll-forward and ownership are recorded.
- Backup freshness is not accepted as recovery evidence without a successful restore drill.
- Production deployment is blocked by any required failing gate, P0/P1 defect or unresolved high/critical security issue without accepted risk ownership and expiry.

## Skills-system completion

- Root constitution, Skills map, all 13 named Skills, required references, traceability matrix and this DoD exist.
- Directory/name/frontmatter/OpenAI metadata/reference/link/YAML/secret/placeholder checks pass.
- Every Skill passes the official `quick_validate.py`; `pnpm skills:validate` passes.
- State machines, architecture boundaries, security controls, quality gates, SLOs and release workflow have single owners and no known contradictions.
- Final audit shows the created tree, validation evidence and unresolved decisions. No ARENA GRID production feature is generated as part of this work.
