import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { PrismaClient, TournamentStatus } from '@arena-grid/database';
import { DATABASE } from '../platform/database.token.js';
import { createTournamentSchema, tournamentSearchSchema } from '@arena-grid/contracts';

@Injectable()
export class TournamentsService {
  constructor(@Inject(DATABASE) private readonly db: PrismaClient) {}

  async list(query: unknown) {
    const filters = tournamentSearchSchema.parse(query);
    const where = {
      deletedAt: null,
      ...(filters.q
        ? {
            OR: [
              { name: { contains: filters.q, mode: 'insensitive' as const } },
              { description: { contains: filters.q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      ...(filters.game ? { game: { slug: filters.game } } : {}),
      ...(filters.region ? { region: filters.region } : {}),
      ...(filters.format ? { tournamentFormat: filters.format } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.teamSize ? { teamSize: filters.teamSize } : {}),
    };
    const [items, total] = await Promise.all([
      this.db.tournament.findMany({
        where,
        include: { game: true, organization: true, _count: { select: { registrations: true } } },
        orderBy: { tournamentStartAt: 'asc' },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      this.db.tournament.count({ where }),
    ]);
    return {
      items,
      page: filters.page,
      pageSize: filters.pageSize,
      total,
      totalPages: Math.ceil(total / filters.pageSize),
    };
  }

  async bySlug(slug: string) {
    const tournament = await this.db.tournament.findFirst({
      where: { slug, deletedAt: null },
      include: {
        game: true,
        organization: true,
        rules: { orderBy: { position: 'asc' } },
        stages: { include: { rounds: { include: { matches: true } } } },
        _count: { select: { registrations: true, matches: true } },
      },
    });
    if (!tournament) throw new NotFoundException('Tournament not found');
    return tournament;
  }

  async create(actorId: string, body: unknown) {
    const input = createTournamentSchema.parse(body);
    const membership = await this.db.organizationMember.findFirst({
      where: {
        organizationId: input.organizationId,
        userId: actorId,
        status: 'ACTIVE',
        role: { in: ['OWNER', 'ADMIN', 'ORGANIZER'] },
      },
    });
    if (!membership)
      throw new ForbiddenException('Organizer scope does not include this organization');
    const { eligibilityRules, ...scalarInput } = input;
    return this.db.tournament.create({
      data: {
        ...scalarInput,
        eligibilityRules: JSON.parse(JSON.stringify(eligibilityRules)) as object,
        description: input.description ?? null,
        registrationStartAt: input.registrationStartAt ?? null,
        registrationEndAt: input.registrationEndAt ?? null,
        checkInStartAt: input.checkInStartAt ?? null,
        checkInEndAt: input.checkInEndAt ?? null,
        rosterLockAt: input.rosterLockAt ?? null,
        tournamentStartAt: input.tournamentStartAt ?? null,
        createdById: actorId,
        status: 'DRAFT',
      },
      include: { game: true, organization: true },
    });
  }

  async transition(actorId: string, id: string, target: TournamentStatus) {
    const tournament = await this.db.tournament.findUnique({
      where: { id },
      include: { organization: { include: { members: true } } },
    });
    if (!tournament) throw new NotFoundException('Tournament not found');
    const member = tournament.organization.members.find(
      (item) =>
        item.userId === actorId &&
        item.status === 'ACTIVE' &&
        ['OWNER', 'ADMIN', 'ORGANIZER'].includes(item.role),
    );
    if (!member) throw new ForbiddenException('Organizer scope does not include this tournament');
    const transitions: Record<string, TournamentStatus[]> = {
      DRAFT: ['PUBLISHED'],
      PUBLISHED: ['REGISTRATION_OPEN', 'CANCELLED'],
      REGISTRATION_OPEN: ['REGISTRATION_CLOSED', 'CANCELLED'],
      REGISTRATION_CLOSED: ['CHECK_IN', 'SEEDING', 'CANCELLED'],
      CHECK_IN: ['SEEDING', 'CANCELLED'],
      SEEDING: ['LIVE', 'PAUSED', 'CANCELLED'],
      LIVE: ['PAUSED', 'COMPLETED', 'CANCELLED'],
      PAUSED: ['LIVE', 'CANCELLED'],
    };
    if (!transitions[tournament.status]?.includes(target))
      throw new BadRequestException(
        `Invalid tournament transition ${tournament.status} -> ${target}`,
      );
    return this.db.tournament.update({
      where: { id, version: tournament.version },
      data: {
        status: target,
        version: { increment: 1 },
        ...(target === 'COMPLETED' ? { completedAt: new Date() } : {}),
      },
    });
  }
}
