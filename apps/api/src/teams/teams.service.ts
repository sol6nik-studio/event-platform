import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { PrismaClient } from '@arena-grid/database';
import { DATABASE } from '../platform/database.token.js';

@Injectable()
export class TeamsService {
  constructor(@Inject(DATABASE) private readonly db: PrismaClient) {}

  async create(userId: string, input: { name: string; slug: string; tag?: string | undefined }) {
    const exists = await this.db.team.findFirst({
      where: { OR: [{ slug: input.slug }, { name: input.name }] },
    });
    if (exists) throw new ConflictException('Team slug or name already exists');
    return this.db.team.create({
      data: {
        name: input.name,
        slug: input.slug,
        ...(input.tag ? { tag: input.tag } : {}),
        createdById: userId,
        members: { create: { userId, role: 'CAPTAIN' } },
      },
      include: { members: true },
    });
  }

  async invite(captainId: string, teamId: string, inviteeUserId: string) {
    const captain = await this.db.teamMember.findFirst({
      where: { teamId, userId: captainId, role: 'CAPTAIN', status: 'ACTIVE' },
    });
    if (!captain) throw new ForbiddenException('Only an active captain may invite players');
    const existing = await this.db.teamInvitation.findFirst({
      where: { teamId, inviteeUserId, status: 'PENDING' },
    });
    if (existing) return existing;
    return this.db.teamInvitation.create({
      data: {
        teamId,
        inviteeUserId,
        invitedById: captainId,
        tokenHash: `${teamId}:${inviteeUserId}:${String(Date.now())}`,
        expiresAt: new Date(Date.now() + 7 * 86_400_000),
      },
    });
  }

  async accept(userId: string, invitationId: string) {
    const invitation = await this.db.teamInvitation.findUnique({ where: { id: invitationId } });
    if (
      invitation?.inviteeUserId !== userId ||
      invitation.status !== 'PENDING' ||
      invitation.expiresAt < new Date()
    )
      throw new NotFoundException('Invitation not found or expired');
    return this.db.$transaction(async (tx) => {
      await tx.teamInvitation.update({
        where: { id: invitationId },
        data: { status: 'ACCEPTED', respondedAt: new Date() },
      });
      return tx.teamMember.upsert({
        where: { teamId_userId: { teamId: invitation.teamId, userId } },
        update: { status: 'ACTIVE', role: 'PLAYER' },
        create: { teamId: invitation.teamId, userId, role: 'PLAYER' },
      });
    });
  }
}
