export { TournamentEngineError } from './invariants.js';
export { assertBracketInvariants } from './invariants.js';
export {
  applyMatchResult,
  generateBracket,
  generateDoubleElimination,
  generateRoundRobin,
  generateSingleElimination,
} from './tournament-engine.js';
export { MatchStages, MatchStatuses, ResultEventTypes, TournamentFormats } from './types.js';
export type {
  AppliedResultEvent,
  BracketMatch,
  BracketParticipant,
  BracketSlot,
  CancelResultEvent,
  CompleteResultEvent,
  DisqualificationResultEvent,
  GenerateBracketInput,
  MatchLink,
  MatchResolution,
  MatchScore,
  MatchStage,
  MatchStatus,
  ResultEvent,
  ResultEventType,
  ResultSource,
  SlotSource,
  TournamentBracket,
  TournamentFormat,
  TournamentEngineErrorCode,
  WalkoverResultEvent,
} from './types.js';
