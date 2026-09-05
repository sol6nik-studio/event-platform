# ADR 0001: Project baseline and telemetry boundary

- Status: accepted
- Date: 2026-09-04
- Owners: ARENA GRID architecture and operations
- Requirement IDs: ARCH-001, ARCH-002, ARCH-009, OBS-001, OPS-002

## Context and evidence

The existing repository already contains web, API, worker, PostgreSQL, Redis and partial tournament code, but had no project-local agent constitution or enforceable Skills. Runtime versions were mostly exact in the lockfile, while `.nvmrc`, container base tags and local service tags were floating. The required local topology also lacked an OpenTelemetry Collector.

## Decision drivers

Reproducibility, Node LTS policy, backend authority, transactional tournament integrity, provider/manual resilience, privacy-safe diagnostics and a local topology matching production boundaries.

## Considered options

1. Keep floating runtime/images and document intent only. Rejected because validation and recovery would not be reproducible.
2. Adopt the exact baseline in `docs/engineering/technology-baseline.md`, retain the modular monolith and add a collector boundary. Accepted.
3. Split API/worker/domain into microservices. Rejected: no measured isolation/scaling reason, with higher consistency and operational cost.

## Decision

Use Node 24.20.0, pnpm 11.25.0 and the exact installed application dependency lines documented in the baseline. Node 26 is prohibited until LTS plus a new ADR. Keep `apps/api` as source of truth, `apps/worker` for asynchronous effects and `packages/tournament-engine` pure. Add a pinned OpenTelemetry Collector to local Compose; services export through OTLP, while production exporter/vendor selection remains an operations configuration.

Retain TypeScript 6.0.3 rather than silently adopting TypeScript 7; that major needs compatibility evidence and a separate ADR. The archived MinIO community binary is local synthetic-data-only; production uses a maintained reviewed S3-compatible service.

## Consequences

Build/developer hosts must install the exact Node/pnpm baseline. Container and service patch updates are deliberate. Telemetry has a vendor-neutral process boundary and can fail without changing canonical tournament data. Existing legacy package names (`packages/ui`, `packages/config`) do not satisfy the target package map and must migrate only in a separately authorized implementation change without mixing that work into the Skills system.

## Migration and rollback

Version pinning is configuration-only and rolls forward to another reviewed patch. Removing the local collector restores the prior topology but loses required telemetry parity. No production database migration is included. Package-boundary migration is deferred and requires import/build compatibility planning.

## Verification

Run `pnpm skills:validate`, all official Skill quick validators, `docker compose config --quiet`, frozen lockfile install, format checks and git diff review. Future implementation adds import-boundary tests, OpenAPI/Prisma gates and end-to-end trace verification.
