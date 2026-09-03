export {};
import { z } from 'zod';

export const platformRoles = [
  'PLAYER',
  'TEAM_CAPTAIN',
  'ORGANIZER',
  'MODERATOR',
  'SPECTATOR',
  'PLATFORM_ADMIN',
] as const;
export const tournamentStatuses = [
  'DRAFT',
  'PUBLISHED',
  'REGISTRATION_OPEN',
  'REGISTRATION_CLOSED',
  'CHECK_IN',
  'SEEDING',
  'LIVE',
  'PAUSED',
  'COMPLETED',
  'CANCELLED',
] as const;
export const registrationStatuses = [
  'DRAFT',
  'PENDING',
  'APPROVED',
  'REJECTED',
  'WAITLISTED',
  'CHECKED_IN',
  'WITHDRAWN',
  'DISQUALIFIED',
] as const;
export const matchStatuses = [
  'SCHEDULED',
  'READY',
  'LIVE',
  'RESULT_PENDING',
  'DISPUTED',
  'COMPLETED',
  'WALKOVER',
  'CANCELLED',
] as const;
export const disputeStatuses = ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'] as const;
export const tournamentFormats = [
  'SINGLE_ELIMINATION',
  'DOUBLE_ELIMINATION',
  'ROUND_ROBIN',
] as const;

export const PlatformRoleSchema = z.enum(platformRoles);
export const TournamentStatusSchema = z.enum(tournamentStatuses);
export const RegistrationStatusSchema = z.enum(registrationStatuses);
export const MatchStatusSchema = z.enum(matchStatuses);
export const DisputeStatusSchema = z.enum(disputeStatuses);
export const TournamentFormatSchema = z.enum(tournamentFormats);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().max(80).optional(),
});

export const tournamentSearchSchema = paginationSchema.extend({
  q: z.string().trim().max(120).optional(),
  game: z.string().trim().max(80).optional(),
  region: z.string().trim().max(40).optional(),
  format: TournamentFormatSchema.optional(),
  status: TournamentStatusSchema.optional(),
  teamSize: z.coerce.number().int().min(1).max(100).optional(),
});

export const createTournamentSchema = z
  .object({
    organizationId: z.uuid(),
    gameId: z.uuid(),
    slug: z.string().regex(/^[a-z0-9-]{3,80}$/),
    name: z.string().trim().min(3).max(120),
    description: z.string().max(10_000).optional(),
    tournamentFormat: TournamentFormatSchema,
    region: z.string().min(2).max(40),
    platform: z.string().min(2).max(40),
    teamSize: z.number().int().min(1).max(100),
    substitutesLimit: z.number().int().min(0).max(100).default(0),
    minRosterSize: z.number().int().min(1).max(100),
    maxRosterSize: z.number().int().min(1).max(100),
    bestOf: z.number().int().min(1).max(9).default(1),
    participantLimit: z.number().int().min(2).max(10_000),
    registrationStartAt: z.coerce.date().optional(),
    registrationEndAt: z.coerce.date().optional(),
    checkInStartAt: z.coerce.date().optional(),
    checkInEndAt: z.coerce.date().optional(),
    rosterLockAt: z.coerce.date().optional(),
    tournamentStartAt: z.coerce.date().optional(),
    eligibilityRules: z.record(z.string(), z.unknown()).default({}),
  })
  .superRefine((data, ctx) => {
    if (data.minRosterSize > data.maxRosterSize)
      ctx.addIssue({
        code: 'custom',
        path: ['maxRosterSize'],
        message: 'maxRosterSize must be >= minRosterSize',
      });
    if (data.minRosterSize < data.teamSize)
      ctx.addIssue({
        code: 'custom',
        path: ['minRosterSize'],
        message: 'minRosterSize must be >= teamSize',
      });
    if (
      data.registrationStartAt &&
      data.registrationEndAt &&
      data.registrationStartAt >= data.registrationEndAt
    )
      ctx.addIssue({
        code: 'custom',
        path: ['registrationEndAt'],
        message: 'registrationEndAt must be after start',
      });
  });

export const resultScoreSchema = z.object({
  own: z.number().int().min(0),
  opponent: z.number().int().min(0),
  games: z
    .array(z.object({ own: z.number().int().min(0), opponent: z.number().int().min(0) }))
    .optional(),
});

export const resultSubmissionSchema = z.object({
  registrationId: z.uuid(),
  score: resultScoreSchema,
  evidenceIds: z.array(z.uuid()).max(20).default([]),
});

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    correlationId: z.uuid(),
    details: z.unknown().optional(),
  }),
});

export type PlatformRole = z.infer<typeof PlatformRoleSchema>;
export type TournamentStatus = z.infer<typeof TournamentStatusSchema>;
export type RegistrationStatus = z.infer<typeof RegistrationStatusSchema>;
export type MatchStatus = z.infer<typeof MatchStatusSchema>;
export type DisputeStatus = z.infer<typeof DisputeStatusSchema>;
export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
export type ResultSubmissionInput = z.infer<typeof resultSubmissionSchema>;
