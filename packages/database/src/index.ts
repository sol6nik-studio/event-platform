import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from './generated/prisma/client.js';

export { PrismaClient } from './generated/prisma/client.js';
export * from './generated/prisma/enums.js';
export type * from './generated/prisma/models.js';

export interface CreateDatabaseClientOptions {
  connectionString: string;
  log?: ('query' | 'info' | 'warn' | 'error')[];
}

export function createDatabaseClient(options: CreateDatabaseClientOptions): PrismaClient {
  const adapter = new PrismaPg({ connectionString: options.connectionString });

  return new PrismaClient({
    adapter,
    ...(options.log ? { log: options.log } : {}),
  });
}
