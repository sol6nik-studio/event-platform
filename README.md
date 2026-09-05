# ARENA GRID

Production-oriented monorepo foundation for amateur and semi-pro esports tournaments.

## Quick start

Requirements: Node 24 LTS, pnpm 11, Docker Compose.

```bash
cp .env.example .env
# Fill every empty value in .env before continuing.
pnpm install
docker compose up -d postgres redis minio mailpit
pnpm --filter @arena-grid/database db:validate
pnpm --filter @arena-grid/database db:generate
pnpm --filter @arena-grid/database db:seed
pnpm dev
```

Для полностью изолированного dev-окружения с PostgreSQL, Redis, MinIO, Mailpit, OpenTelemetry, API,
worker и Next.js используйте Docker Compose. При старте отдельный `db-seed` применяет схему
локальной базы и загружает демонстрационные данные:

```bash
pnpm dev:docker
```

Остановка окружения: `pnpm dev:docker:down`. Этот стек предназначен только для mock/demo данных и не
должен подключаться к production storage или production database.

API is exposed on `http://localhost:4000/api/v1`, web on `http://localhost:3000`, Swagger is
reserved for `/api/v1/docs`, and Mailpit UI is `http://localhost:8025`.

Demo accounts use password `ArenaGridDemo!2026`:

| Role           | Email                            |
| -------------- | -------------------------------- |
| Platform admin | admin@arena-grid.local           |
| Organizer      | organizer@arena-grid.local       |
| Moderator      | moderator@arena-grid.local       |
| Captain        | captain@arena-grid.local         |
| Player         | player@arena-grid.local          |
| Spectator      | spectator@arena-grid.local       |
| Captain        | captain.crimson@arena-grid.local |
| Player         | player.crimson1@arena-grid.local |
| Player         | player.crimson2@arena-grid.local |
| Player         | player.crimson3@arena-grid.local |
| Player         | player.crimson4@arena-grid.local |

The additional Crimson accounts form the five-person `Crimson Guard` demo team. Re-running the seed
restores every demo account to an active, verified state and resets its password to the value above.

## Environment configuration

The root commands load `.env` with Node's native env-file support. Docker Compose also reads `.env`
by default and maps host-facing database, Redis, MinIO, Mailpit, API, and web ports from it.

| File           | Committed | Purpose                                                          |
| -------------- | --------- | ---------------------------------------------------------------- |
| `.env`         | No        | Local development values and development-only credentials        |
| `.env.example` | Yes       | Local variable contract without credentials or generated secrets |
| `.env.prod`    | No        | Deployment-specific values managed outside Git                   |

Create or refresh the private files with:

```bash
cp .env.example .env
chmod 600 .env
```

Generate unique local values for `POSTGRES_PASSWORD`, `JWT_SECRET`, `S3_ACCESS_KEY_ID`, and
`S3_SECRET_ACCESS_KEY`, then compose `DATABASE_URL` from the PostgreSQL values. Empty values are
intentional: the repository does not distribute credentials, including development credentials.

Create `.env.prod` directly from values issued by the deployment platform and secret manager. Before
a real deployment, replace reserved `example.com` values, use managed PostgreSQL/Redis/storage/SMTP
endpoints, and rotate generated secrets. The API validates its environment at startup and rejects
known development defaults and placeholders when `NODE_ENV=production`.

Use `pnpm build:prod` to build with the private `.env.prod` file. For Compose interpolation with a
non-default file, use `docker compose --env-file .env.prod config` to review the resolved
configuration first. The included Compose stack is intended for development and parity testing, not
as a hardened production orchestrator.

Для явного заполнения демонстрационных данных в отдельной production-like базе используйте только
после подтверждения окружения и backup:

```bash
NODE_ENV=production SEED_DEMO_DATA=true pnpm --filter @arena-grid/database db:seed
```

Без `SEED_DEMO_DATA=true` seed в production завершается ошибкой. Данные seed являются
синтетическими, а пароль demo-аккаунтов нельзя использовать в реальной эксплуатации.

## Workspace commands

`pnpm dev`, `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm format:check`.

Use `CI=true` for non-interactive installs. Prisma 7.10 is intentionally pinned to the stable ORM
line; Prisma 8 is still a release candidate.

## Project map

- `apps/api` — NestJS + Fastify REST API and authorization boundary.
- `apps/web` — Next.js App Router frontend (being expanded in the next delivery stage).
- `apps/worker` — BullMQ process boundary.
- `packages/contracts` — shared Zod schemas and enums.
- `packages/database` — Prisma schema, migration and demo seed.
- `packages/tournament-engine` — framework-independent bracket domain.
- `docs/` — product, UX, architecture, API, state machines, design and delivery gates.

Current delivery scope and the next vertical slice are tracked in
[`docs/IMPLEMENTATION_STATUS.md`](docs/IMPLEMENTATION_STATUS.md).

## Open source

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md) before opening a pull request. Report suspected
vulnerabilities privately according to [SECURITY.md](SECURITY.md), never through a public issue.

ARENA GRID is distributed under the [MIT License](LICENSE).
