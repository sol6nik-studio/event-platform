export const TournamentFormats = {
  SINGLE_ELIMINATION: 'SINGLE_ELIMINATION',
  DOUBLE_ELIMINATION: 'DOUBLE_ELIMINATION',
  ROUND_ROBIN: 'ROUND_ROBIN',
} as const;

export type TournamentFormat = (typeof TournamentFormats)[keyof typeof TournamentFormats];

export const MatchStages = {
  UPPER: 'UPPER',
  LOWER: 'LOWER',
  GRAND_FINAL: 'GRAND_FINAL',
  ROUND_ROBIN: 'ROUND_ROBIN',
} as const;

export type MatchStage = (typeof MatchStages)[keyof typeof MatchStages];

export const MatchStatuses = {
  SCHEDULED: 'SCHEDULED',
  READY: 'READY',
  COMPLETED: 'COMPLETED',
  WALKOVER: 'WALKOVER',
  CANCELLED: 'CANCELLED',
} as const;

export type MatchStatus = (typeof MatchStatuses)[keyof typeof MatchStatuses];

export interface BracketParticipant {
  id: string;
  seed: number;
  displayName?: string;
}

export interface SlotSource {
  matchId: string;
  outcome: 'WINNER' | 'LOSER';
}

export interface BracketSlot {
  participantId: string | null;
  source: SlotSource | null;
  resolved: boolean;
}

export interface MatchLink {
  matchId: string;
  slot: 1 | 2;
}

export type MatchScore = readonly [number, number];

export type ResultSource = 'GAME_API' | 'MANUAL' | 'MODERATOR';

export type MatchResolution =
  | {
      type: 'BYE';
      winnerId: string;
      loserId: null;
    }
  | {
      type: 'EMPTY';
      winnerId: null;
      loserId: null;
    }
  | {
      type: 'COMPLETE';
      eventId: string;
      source: ResultSource;
      winnerId: string;
      loserId: string;
      score?: MatchScore;
    }
  | {
      type: 'WALKOVER';
      eventId: string;
      source: ResultSource;
      winnerId: string;
      loserId: string;
    }
  | {
      type: 'DISQUALIFICATION';
      eventId: string;
      source: ResultSource;
      winnerId: string;
      loserId: string;
      disqualifiedParticipantId: string;
    };

export interface BracketMatch {
  id: string;
  stage: MatchStage;
  round: number;
  position: number;
  status: MatchStatus;
  slots: [BracketSlot, BracketSlot];
  winnerTo: MatchLink | null;
  loserTo: MatchLink | null;
  resolution?: MatchResolution;
}

export const ResultEventTypes = {
  COMPLETE: 'COMPLETE',
  WALKOVER: 'WALKOVER',
  DISQUALIFICATION: 'DISQUALIFICATION',
  CANCEL: 'CANCEL',
} as const;

export type ResultEventType = (typeof ResultEventTypes)[keyof typeof ResultEventTypes];

interface ResultEventBase {
  eventId: string;
  matchId: string;
}

export interface CompleteResultEvent extends ResultEventBase {
  type: 'COMPLETE';
  winnerId: string;
  source: ResultSource;
  score?: MatchScore;
}

export interface WalkoverResultEvent extends ResultEventBase {
  type: 'WALKOVER';
  winnerId: string;
  source: ResultSource;
}

export interface DisqualificationResultEvent extends ResultEventBase {
  type: 'DISQUALIFICATION';
  disqualifiedParticipantId: string;
  source: ResultSource;
}

/** Cancels the current external result and reopens the match. */
export interface CancelResultEvent extends ResultEventBase {
  type: 'CANCEL';
}

export type ResultEvent =
  CompleteResultEvent | WalkoverResultEvent | DisqualificationResultEvent | CancelResultEvent;

export type AppliedResultEvent = ResultEvent;

export interface TournamentBracket {
  schemaVersion: 1;
  format: TournamentFormat;
  participants: BracketParticipant[];
  matches: BracketMatch[];
  appliedEvents: AppliedResultEvent[];
}

export interface GenerateBracketInput {
  format: TournamentFormat;
  participants: readonly BracketParticipant[];
}

export type TournamentEngineErrorCode =
  | 'INVALID_PARTICIPANT_COUNT'
  | 'INVALID_PARTICIPANT'
  | 'DUPLICATE_PARTICIPANT'
  | 'DUPLICATE_SEED'
  | 'MATCH_NOT_FOUND'
  | 'MATCH_NOT_READY'
  | 'MATCH_ALREADY_RESOLVED'
  | 'PARTICIPANT_NOT_IN_MATCH'
  | 'INVALID_SCORE'
  | 'DUPLICATE_EVENT_CONFLICT'
  | 'NO_RESULT_TO_CANCEL'
  | 'AUTOMATIC_RESULT_CANNOT_BE_CANCELLED'
  | 'DOWNSTREAM_ALREADY_RESOLVED'
  | 'INVALID_EVENT'
  | 'INVARIANT_VIOLATION';
