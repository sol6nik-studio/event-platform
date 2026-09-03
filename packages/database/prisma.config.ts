import { config as loadEnvironment } from 'dotenv';
import { defineConfig } from 'prisma/config';
import { fileURLToPath } from 'node:url';

loadEnvironment({ path: fileURLToPath(new URL('../../.env', import.meta.url)), quiet: true });

const localDatabaseUrl =
  'postgresql://arena_grid:arena_grid_local_only@localhost:5432/arena_grid?schema=public';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? localDatabaseUrl,
  },
});
