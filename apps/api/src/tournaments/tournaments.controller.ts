import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { TournamentsService } from './tournaments.service.js';
import type { AuthenticatedRequest } from '../auth/access.guard.js';
import { Public } from '../auth/public.decorator.js';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournaments: TournamentsService) {}

  @Public()
  @Get()
  list(@Query() query: Record<string, unknown>) {
    return this.tournaments.list(query);
  }

  @Public()
  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.tournaments.bySlug(slug);
  }

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() body: unknown) {
    return this.tournaments.create(request.user?.id ?? '', body);
  }

  @Patch(':id/status')
  transition(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body()
    body: {
      status:
        | 'PUBLISHED'
        | 'REGISTRATION_OPEN'
        | 'REGISTRATION_CLOSED'
        | 'CHECK_IN'
        | 'SEEDING'
        | 'LIVE'
        | 'PAUSED'
        | 'COMPLETED'
        | 'CANCELLED';
    },
  ) {
    return this.tournaments.transition(request.user?.id ?? '', id, body.status);
  }
}
