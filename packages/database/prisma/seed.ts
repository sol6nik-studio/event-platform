import argon2 from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { config as loadEnvironment } from 'dotenv';
import { fileURLToPath } from 'node:url';
import {
  BracketSide,
  DisputeStatus,
  GameProvider,
  MatchStatus,
  PlatformRole,
  PrismaClient,
  RegistrationStatus,
  ResultSource,
  ResultSubmissionStatus,
  SeedSource,
  TeamMemberRole,
  TournamentFormat,
  TournamentStageType,
  TournamentStatus,
  UserStatus,
} from '../src/generated/prisma/client.js';

loadEnvironment({ path: fileURLToPath(new URL('../../../.env', import.meta.url)), quiet: true });

const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://arena_grid:arena_grid_local_only@localhost:5432/arena_grid?schema=public';
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const demoPassword = 'ArenaGridDemo!2026';

async function user(email: string, username: string, roles: PlatformRole[], passwordHash: string) {
  const existing = await prisma.user.findFirst({ where: { email } });
  const record =
    existing === null
      ? await prisma.user.create({
          data: {
            email,
            username,
            passwordHash,
            status: UserStatus.ACTIVE,
            emailVerifiedAt: new Date(),
          },
        })
      : await prisma.user.update({
          where: { id: existing.id },
          data: {
            username,
            passwordHash,
            status: UserStatus.ACTIVE,
            emailVerifiedAt: existing.emailVerifiedAt ?? new Date(),
            deletedAt: null,
          },
        });
  await prisma.userRole.deleteMany({
    where: { userId: record.id, role: { notIn: roles } },
  });
  for (const role of roles) {
    await prisma.userRole.upsert({
      where: { userId_role: { userId: record.id, role } },
      update: {},
      create: { userId: record.id, role },
    });
  }
  return record;
}

async function game(slug: string, name: string, provider: GameProvider, platform: string) {
  return prisma.game.upsert({
    where: { slug },
    update: { name, provider, supportedPlatforms: [platform], active: true },
    create: { slug, name, provider, supportedPlatforms: [platform] },
  });
}

async function main() {
  const passwordHash = await argon2.hash(demoPassword);
  const demoUser = (email: string, username: string, roles: PlatformRole[]) =>
    user(email, username, roles, passwordHash);
  const [
    admin,
    organizer,
    moderator,
    captain,
    player,
    spectator,
    crimsonCaptain,
    crimsonPlayerOne,
    crimsonPlayerTwo,
    crimsonPlayerThree,
    crimsonPlayerFour,
  ] = await Promise.all([
    demoUser('admin@arena-grid.local', 'grid_admin', [PlatformRole.PLATFORM_ADMIN]),
    demoUser('organizer@arena-grid.local', 'nexus_host', [PlatformRole.ORGANIZER]),
    demoUser('moderator@arena-grid.local', 'referee_one', [PlatformRole.MODERATOR]),
    demoUser('captain@arena-grid.local', 'north_captain', [
      PlatformRole.PLAYER,
      PlatformRole.TEAM_CAPTAIN,
    ]),
    demoUser('player@arena-grid.local', 'support_player', [PlatformRole.PLAYER]),
    demoUser('spectator@arena-grid.local', 'grid_spectator', [PlatformRole.SPECTATOR]),
    demoUser('captain.crimson@arena-grid.local', 'crimson_captain', [
      PlatformRole.PLAYER,
      PlatformRole.TEAM_CAPTAIN,
    ]),
    demoUser('player.crimson1@arena-grid.local', 'crimson_entry', [PlatformRole.PLAYER]),
    demoUser('player.crimson2@arena-grid.local', 'crimson_anchor', [PlatformRole.PLAYER]),
    demoUser('player.crimson3@arena-grid.local', 'crimson_scout', [PlatformRole.PLAYER]),
    demoUser('player.crimson4@arena-grid.local', 'crimson_support', [PlatformRole.PLAYER]),
  ]);

  const dota = await game('dota-2', 'Dota 2', GameProvider.STEAM_DOTA, 'PC');
  const lol = await game('league-of-legends', 'League of Legends', GameProvider.RIOT, 'PC');
  const brawl = await game('brawl-stars', 'Brawl Stars', GameProvider.BRAWL_STARS, 'MOBILE');
  const royale = await game('clash-royale', 'Clash Royale', GameProvider.CLASH_ROYALE, 'MOBILE');

  const organization =
    (await prisma.organization.findFirst({ where: { slug: 'northern-nexus' } })) ??
    (await prisma.organization.create({
      data: {
        ownerUserId: organizer.id,
        slug: 'northern-nexus',
        name: 'Northern Nexus Events',
        description: 'Community esports organizers',
      },
    }));
  await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: organization.id, userId: organizer.id } },
    update: { status: 'ACTIVE', role: 'OWNER' },
    create: {
      organizationId: organization.id,
      userId: organizer.id,
      role: 'OWNER',
      status: 'ACTIVE',
      joinedAt: new Date(),
    },
  });

  const team =
    (await prisma.team.findFirst({ where: { slug: 'aurora-five' } })) ??
    (await prisma.team.create({
      data: {
        createdById: captain.id,
        organizationId: organization.id,
        slug: 'aurora-five',
        name: 'Aurora Five',
        tag: 'A5',
      },
    }));
  await prisma.teamMember.upsert({
    where: { teamId_userId: { teamId: team.id, userId: captain.id } },
    update: { role: TeamMemberRole.CAPTAIN, status: 'ACTIVE' },
    create: { teamId: team.id, userId: captain.id, role: TeamMemberRole.CAPTAIN },
  });
  await prisma.teamMember.upsert({
    where: { teamId_userId: { teamId: team.id, userId: player.id } },
    update: { role: TeamMemberRole.PLAYER, status: 'ACTIVE' },
    create: { teamId: team.id, userId: player.id, role: TeamMemberRole.PLAYER },
  });

  const crimsonTeam =
    (await prisma.team.findFirst({ where: { slug: 'crimson-guard' } })) ??
    (await prisma.team.create({
      data: {
        createdById: crimsonCaptain.id,
        organizationId: organization.id,
        slug: 'crimson-guard',
        name: 'Crimson Guard',
        tag: 'CRG',
      },
    }));
  const crimsonRoster = [
    { userId: crimsonCaptain.id, role: TeamMemberRole.CAPTAIN },
    { userId: crimsonPlayerOne.id, role: TeamMemberRole.PLAYER },
    { userId: crimsonPlayerTwo.id, role: TeamMemberRole.PLAYER },
    { userId: crimsonPlayerThree.id, role: TeamMemberRole.PLAYER },
    { userId: crimsonPlayerFour.id, role: TeamMemberRole.PLAYER },
  ];
  for (const member of crimsonRoster) {
    await prisma.teamMember.upsert({
      where: { teamId_userId: { teamId: crimsonTeam.id, userId: member.userId } },
      update: { role: member.role, status: 'ACTIVE' },
      create: { teamId: crimsonTeam.id, userId: member.userId, role: member.role },
    });
  }

  const definitions = [
    {
      slug: 'northern-nexus-cup',
      name: 'Northern Nexus Cup',
      gameId: dota.id,
      format: TournamentFormat.DOUBLE_ELIMINATION,
      teamSize: 5,
      region: 'EU',
      platform: 'PC',
      status: TournamentStatus.LIVE,
    },
    {
      slug: 'rift-challengers',
      name: 'Rift Challengers',
      gameId: lol.id,
      format: TournamentFormat.ROUND_ROBIN,
      teamSize: 5,
      region: 'EU',
      platform: 'PC',
      status: TournamentStatus.REGISTRATION_OPEN,
    },
    {
      slug: 'triple-strike-open',
      name: 'Triple Strike Open',
      gameId: brawl.id,
      format: TournamentFormat.SINGLE_ELIMINATION,
      teamSize: 3,
      region: 'CIS',
      platform: 'MOBILE',
      status: TournamentStatus.PUBLISHED,
    },
    {
      slug: 'crown-masters',
      name: 'Crown Masters',
      gameId: royale.id,
      format: TournamentFormat.SINGLE_ELIMINATION,
      teamSize: 1,
      region: 'GLOBAL',
      platform: 'MOBILE',
      status: TournamentStatus.COMPLETED,
    },
  ];

  for (const definition of definitions) {
    const tournament =
      (await prisma.tournament.findFirst({ where: { slug: definition.slug } })) ??
      (await prisma.tournament.create({
        data: {
          organizationId: organization.id,
          gameId: definition.gameId,
          createdById: organizer.id,
          slug: definition.slug,
          name: definition.name,
          description: `Demo ${definition.name} tournament`,
          status: definition.status,
          tournamentFormat: definition.format,
          region: definition.region,
          platform: definition.platform,
          teamSize: definition.teamSize,
          minRosterSize: definition.teamSize,
          maxRosterSize: definition.teamSize + 1,
          participantLimit: 16,
          registrationStartAt: new Date(Date.now() - 86_400_000 * 7),
          registrationEndAt: new Date(Date.now() + 86_400_000 * 7),
          tournamentStartAt: new Date(Date.now() + 86_400_000),
        },
      }));
    await prisma.tournamentModerator.upsert({
      where: { tournamentId_userId: { tournamentId: tournament.id, userId: moderator.id } },
      update: {},
      create: { tournamentId: tournament.id, userId: moderator.id, assignedByUserId: organizer.id },
    });
    const stage = await prisma.tournamentStage.upsert({
      where: { tournamentId_position: { tournamentId: tournament.id, position: 1 } },
      update: {},
      create: {
        tournamentId: tournament.id,
        name: 'Main Stage',
        type:
          definition.format === TournamentFormat.ROUND_ROBIN
            ? TournamentStageType.ROUND_ROBIN
            : TournamentStageType.SINGLE_ELIMINATION,
        position: 1,
      },
    });
    const round = await prisma.round.upsert({
      where: { stageId_number: { stageId: stage.id, number: 1 } },
      update: {},
      create: { stageId: stage.id, number: 1, name: 'Round 1' },
    });
    const registration =
      (await prisma.registration.findFirst({
        where: { tournamentId: tournament.id, teamId: team.id },
      })) ??
      (await prisma.registration.create({
        data: {
          tournamentId: tournament.id,
          teamId: team.id,
          submittedByUserId: captain.id,
          status:
            definition.status === TournamentStatus.LIVE
              ? RegistrationStatus.CHECKED_IN
              : RegistrationStatus.APPROVED,
          acceptedRuleRevision: 1,
          submittedAt: new Date(),
        },
      }));
    await prisma.seed.upsert({
      where: { registrationId: registration.id },
      update: { value: 1 },
      create: {
        tournamentId: tournament.id,
        registrationId: registration.id,
        value: 1,
        source: SeedSource.MANUAL,
      },
    });
    const match = await prisma.match.upsert({
      where: { tournamentId_externalKey: { tournamentId: tournament.id, externalKey: 'r1-m1' } },
      update: {},
      create: {
        tournamentId: tournament.id,
        roundId: round.id,
        externalKey: 'r1-m1',
        bracketSide: BracketSide.SINGLE,
        position: 1,
        status:
          definition.status === TournamentStatus.LIVE
            ? MatchStatus.DISPUTED
            : MatchStatus.SCHEDULED,
        bestOf: 1,
      },
    });
    await prisma.matchParticipant.upsert({
      where: { matchId_slot: { matchId: match.id, slot: 1 } },
      update: { registrationId: registration.id },
      create: {
        matchId: match.id,
        slot: 1,
        source: 'SEED',
        seedValue: 1,
        registrationId: registration.id,
      },
    });

    if (definition.slug === 'northern-nexus-cup') {
      const submission =
        (await prisma.resultSubmission.findFirst({ where: { matchId: match.id } })) ??
        (await prisma.resultSubmission.create({
          data: {
            matchId: match.id,
            registrationId: registration.id,
            submittedByUserId: captain.id,
            source: ResultSource.TEAM_SUBMISSION,
            status: ResultSubmissionStatus.SUBMITTED,
            score: { own: 1, opponent: 1 },
          },
        }));
      await prisma.dispute.upsert({
        where: { id: match.id },
        update: { status: DisputeStatus.OPEN },
        create: {
          id: match.id,
          matchId: match.id,
          openedByUserId: captain.id,
          reason: 'Conflicting score requires referee review.',
        },
      });
      await prisma.notification.create({
        data: {
          userId: moderator.id,
          type: 'DISPUTE_OPENED',
          title: 'Active dispute',
          body: `Review ${submission.id}`,
          payload: { matchId: match.id },
        },
      });
    }
  }

  console.log(
    `Seeded 11 demo users. Password: ${demoPassword}. Admin: ${admin.email}. Spectator: ${spectator.email}`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
