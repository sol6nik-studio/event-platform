import {
  MatchStatuses,
  type BracketMatch,
  type SlotSource,
  type TournamentBracket,
  type TournamentEngineErrorCode,
} from './types.js';

export class TournamentEngineError extends Error {
  public readonly code: TournamentEngineErrorCode;

  public constructor(code: TournamentEngineErrorCode, message: string) {
    super(message);
    this.name = 'TournamentEngineError';
    this.code = code;
  }
}

function fail(message: string): never {
  throw new TournamentEngineError('INVARIANT_VIOLATION', message);
}

function outcomeParticipant(match: BracketMatch, outcome: SlotSource['outcome']): string | null {
  if (match.resolution === undefined) {
    return null;
  }

  return outcome === 'WINNER' ? match.resolution.winnerId : match.resolution.loserId;
}

export function assertBracketInvariants(bracket: TournamentBracket): void {
  const participantIds = new Set<string>();
  const seeds = new Set<number>();

  for (const participant of bracket.participants) {
    if (participantIds.has(participant.id)) {
      fail(`Duplicate participant id: ${participant.id}`);
    }
    if (seeds.has(participant.seed)) {
      fail(`Duplicate seed: ${String(participant.seed)}`);
    }
    participantIds.add(participant.id);
    seeds.add(participant.seed);
  }

  const matchIds = new Set<string>();
  const matches = new Map<string, BracketMatch>();
  for (const match of bracket.matches) {
    if (matchIds.has(match.id)) {
      fail(`Duplicate match id: ${match.id}`);
    }
    matchIds.add(match.id);
    matches.set(match.id, match);
  }

  const eventIds = new Set<string>();
  for (const event of bracket.appliedEvents) {
    if (eventIds.has(event.eventId)) {
      fail(`Duplicate applied event id: ${event.eventId}`);
    }
    eventIds.add(event.eventId);
  }

  for (const match of bracket.matches) {
    for (const slot of match.slots) {
      if (slot.participantId !== null && !participantIds.has(slot.participantId)) {
        fail(`Unknown participant ${slot.participantId} in match ${match.id}`);
      }
      if (!slot.resolved && slot.participantId !== null) {
        fail(`Unresolved slot contains participant in match ${match.id}`);
      }
      if (slot.source === null && !slot.resolved) {
        fail(`Seeded slot is unresolved in match ${match.id}`);
      }
      if (slot.source !== null) {
        const sourceMatch = matches.get(slot.source.matchId);
        if (sourceMatch === undefined) {
          fail(`Missing source match ${slot.source.matchId} for ${match.id}`);
        }
        const expectedLink =
          slot.source.outcome === 'WINNER' ? sourceMatch.winnerTo : sourceMatch.loserTo;
        if (expectedLink === null) {
          fail(`Source ${sourceMatch.id} has no ${slot.source.outcome.toLowerCase()} link`);
        }
        if (expectedLink.matchId !== match.id) {
          fail(`Source link ${sourceMatch.id} does not target ${match.id}`);
        }
        const expectedSlot = match.slots[expectedLink.slot - 1];
        if (expectedSlot !== slot) {
          fail(`Source link ${sourceMatch.id} targets the wrong slot in ${match.id}`);
        }
        if (slot.resolved) {
          if (sourceMatch.resolution === undefined) {
            fail(`Resolved slot in ${match.id} has unresolved source ${sourceMatch.id}`);
          }
          if (slot.participantId !== outcomeParticipant(sourceMatch, slot.source.outcome)) {
            fail(`Slot value in ${match.id} differs from ${sourceMatch.id} outcome`);
          }
        }
      }
    }

    const [firstId, secondId] = match.slots.map((slot) => slot.participantId);
    const bothSlotsResolved = match.slots.every((slot) => slot.resolved);
    const participantCount = Number(firstId !== null) + Number(secondId !== null);

    if (match.resolution === undefined) {
      const expectedStatus =
        bothSlotsResolved && participantCount === 2 ? MatchStatuses.READY : MatchStatuses.SCHEDULED;
      if (match.status !== expectedStatus) {
        fail(`Unresolved match ${match.id} has invalid status ${match.status}`);
      }
      continue;
    }

    if (!bothSlotsResolved) {
      fail(`Resolved match ${match.id} has unresolved slots`);
    }
    if (match.resolution.type === 'EMPTY') {
      if (participantCount !== 0 || match.status !== MatchStatuses.CANCELLED) {
        fail(`Empty match ${match.id} is inconsistent`);
      }
      continue;
    }
    if (match.resolution.type === 'BYE') {
      if (participantCount !== 1 || match.status !== MatchStatuses.WALKOVER) {
        fail(`Bye match ${match.id} is inconsistent`);
      }
      continue;
    }
    if (participantCount !== 2) {
      fail(`External resolution on ${match.id} does not have two participants`);
    }
    if (match.resolution.winnerId !== firstId && match.resolution.winnerId !== secondId) {
      fail(`Winner of ${match.id} is not a participant`);
    }
    if (match.resolution.loserId !== firstId && match.resolution.loserId !== secondId) {
      fail(`Loser of ${match.id} is not a participant`);
    }
    if (match.resolution.winnerId === match.resolution.loserId) {
      fail(`Winner and loser of ${match.id} are equal`);
    }
    const expectedStatus =
      match.resolution.type === 'COMPLETE' ? MatchStatuses.COMPLETED : MatchStatuses.WALKOVER;
    if (match.status !== expectedStatus) {
      fail(`Resolved match ${match.id} has invalid status ${match.status}`);
    }
  }
}
