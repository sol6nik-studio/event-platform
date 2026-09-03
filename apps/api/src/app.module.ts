import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { createDatabaseClient, PrismaClient } from '@arena-grid/database';
import { AuthController } from './auth/auth.controller.js';
import { AuthService } from './auth/auth.service.js';
import { AccessGuard } from './auth/access.guard.js';
import { HealthController } from './health.controller.js';
import { TournamentsController } from './tournaments/tournaments.controller.js';
import { TournamentsService } from './tournaments/tournaments.service.js';
import { TeamsController } from './teams/teams.controller.js';
import { TeamsService } from './teams/teams.service.js';
import { apiEnvironment } from './config.js';
import { DATABASE } from './platform/database.token.js';
export { DATABASE } from './platform/database.token.js';

const databaseProvider = {
  provide: DATABASE,
  useFactory: (): PrismaClient =>
    createDatabaseClient({
      connectionString: apiEnvironment.DATABASE_URL,
    }),
};

@Module({
  controllers: [HealthController, AuthController, TournamentsController, TeamsController],
  providers: [
    databaseProvider,
    AuthService,
    TournamentsService,
    AccessGuard,
    TeamsService,
    { provide: APP_GUARD, useClass: AccessGuard },
  ],
  exports: [DATABASE],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
