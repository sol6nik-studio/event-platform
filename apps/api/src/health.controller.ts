import { Controller, Get, Inject } from '@nestjs/common';
import type { PrismaClient } from '@arena-grid/database';
import { DATABASE } from './platform/database.token.js';
import { Public } from './auth/public.decorator.js';

@Controller('health')
export class HealthController {
  constructor(@Inject(DATABASE) private readonly db: PrismaClient) {}

  @Public()
  @Get()
  async health() {
    let database: 'up' | 'down' = 'up';
    try {
      await this.db.$queryRaw`SELECT 1`;
    } catch {
      database = 'down';
    }
    return {
      status: database === 'up' ? 'healthy' : 'degraded',
      database,
      timestamp: new Date().toISOString(),
    };
  }
}
