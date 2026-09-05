# Technology baseline

Decision date: `2026-09-04`
Status: approved project baseline

## Exact versions

| Capability | Approved version | Where enforced |
| --- | --- | --- |
| Node.js | `24.20.0` LTS | `.nvmrc`, root `engines.node`, CI |
| pnpm | `11.25.0` | root `packageManager`, `engines.pnpm`, CI |
| TypeScript | `6.0.3` | root `devDependencies`; strict config |
| Next.js | `16.3.4` | workspace catalog and lockfile |
| React / React DOM | `19.2.8` | workspace catalog and lockfile |
| NestJS common/core/Fastify adapter | `12.0.1` | workspace catalog and lockfile |
| Fastify | `5.12.1` | workspace catalog and lockfile |
| PostgreSQL | `17.11` | local image and deployment constraint |
| Prisma CLI/client/PG adapter | `7.10.0` | database package and lockfile |
| Redis server | `7.4.9` | local image and deployment constraint |
| ioredis | `6.0.0` | workspace catalog and lockfile |
| BullMQ | `6.3.4` | workspace catalog and lockfile |
| S3 contract | AWS S3 API; local MinIO `RELEASE.2025-09-07T16-13-09Z` | adapter contract / local image only |
| OpenAPI | `3.1.2` | generated contract validator |
| Zod | `4.5.4` | workspace catalog and lockfile |
| Turborepo | `2.10.12` | root `devDependencies` and lockfile |
| Vitest | `5.0.0` | approved test runner version when introduced |
| React Testing Library | `16.3.2` | approved component-test version when introduced |
| Playwright | `1.62.1` | approved E2E version when introduced |
| OpenTelemetry JS API / Node SDK | `1.9.1` / `0.221.0` | approved observability package versions |
| OpenTelemetry Collector Contrib | `0.160.0` | local image and deployment constraint |
| Pino | `10.3.1` | approved logger version |
| Tailwind CSS | `4.3.3` | approved styling version |
| Docker Engine / Compose | `29.8.0` / `5.4.0` | developer and CI toolchain |

Only installed packages belong in `package.json` and `pnpm-lock.yaml`; this table controls approved-but-not-yet-installed capabilities so the Skills system does not introduce unused dependencies. Before first use, add the exact version to the owning workspace and regenerate the frozen lockfile. `catalog:` is allowed only because every catalog entry resolves to an exact version. `workspace:*` is allowed only for local packages and never resolves from a public registry.

TypeScript 6 remains the selected major because the repository already uses it and a move to TypeScript 7 requires a compatibility ADR and full build/lint/typecheck evidence. Node.js 26 is prohibited until it enters LTS and a separate ADR is accepted. Exact `engines`, `.nvmrc`, CI/container pins and `.npmrc` `engine-strict=true` reject Node 26 and every runtime other than Node 24.20.0.

The pinned legacy MinIO image is restricted to isolated local/test data because the upstream community binary line is archived and has published security limitations. Production must use a maintained S3-compatible service selected through security review; never place production PII or private evidence in the local image.

## Official verification sources

- Node release status and latest Node 24 LTS patch: <https://nodejs.org/en/about/previous-releases>
- Next.js releases: <https://nextjs.org/blog>
- React release notes: <https://react.dev/blog>
- NestJS source package version: <https://github.com/nestjs/nest/blob/master/packages/core/package.json>
- PostgreSQL release announcements: <https://www.postgresql.org/about/press/>
- Redis releases: <https://download.redis.io/releases/>
- Prisma packages: <https://www.npmjs.com/org/prisma>
- OpenAPI published versions: <https://spec.openapis.org/oas/>
- Docker Engine 29 notes: <https://docs.docker.com/engine/release-notes/29/>
- Docker Compose releases: <https://github.com/docker/compose/releases>
- OpenTelemetry Collector schedule: <https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/release.md>
- Exact JavaScript package metadata: the package maintainer entries in <https://www.npmjs.com/>

## Change control

Patch/minor updates require green applicable gates and an updated baseline date/evidence. A key technology major, runtime major, database major or API specification minor requires an ADR describing compatibility, migration, rollback and operational impact. No dependency may use `latest`, `*`, an unbounded range, a prerelease tag or an unpinned VCS branch.
