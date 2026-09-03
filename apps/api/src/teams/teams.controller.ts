import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../auth/access.guard.js';
import { TeamsService } from './teams.service.js';

const teamInput = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().regex(/^[a-z0-9-]{3,50}$/),
  tag: z.string().trim().max(8).optional(),
});
const inviteInput = z.object({ inviteeUserId: z.uuid() });

@Controller()
export class TeamsController {
  constructor(private readonly teams: TeamsService) {}
  @Post('teams') create(@Req() req: AuthenticatedRequest, @Body() body: unknown) {
    return this.teams.create(req.user?.id ?? '', teamInput.parse(body));
  }
  @Post('teams/:teamId/invitations') invite(
    @Req() req: AuthenticatedRequest,
    @Param('teamId') teamId: string,
    @Body() body: unknown,
  ) {
    return this.teams.invite(req.user?.id ?? '', teamId, inviteInput.parse(body).inviteeUserId);
  }
  @Post('invitations/:invitationId/accept') accept(
    @Req() req: AuthenticatedRequest,
    @Param('invitationId') invitationId: string,
  ) {
    return this.teams.accept(req.user?.id ?? '', invitationId);
  }
}
