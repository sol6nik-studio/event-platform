import { assertBracketInvariants, TournamentEngineError } from './invariants.js';
import {
  MatchStages,
  MatchStatuses,
  TournamentFormats,
  type AppliedResultEvent,
  type BracketMatch,
  type BracketParticipant,
  type BracketSlot,
  type GenerateBracketInput,
  type MatchLink,
  type MatchResolution,
  type ResultEvent,
  type ResultSource,
  type SlotSource,
  type TournamentBracket,
} from './types.js';

const RESULT_SOURCES: ReadonlySet<ResultSource> = new Set(['GAME_API', 'MANUAL', 'MODERATOR']);

function source(matchId: string, outcome: SlotSource['outcome']): SlotSource {
  return { matchId, outcome };
}

function seededSlot(participantId: string | null): BracketSlot {
  return { participantId, source: null, resolved: true };
}

function sourcedSlot(slotSource: SlotSource): BracketSlot {
  return { participantId: null, source: slotSource, resolved: false };
}

function link(matchId: string, slot: 1 | 2): MatchLink {
  return { matchId, slot };
}

function normalizeParticipants(participants: readonly BracketParticipant[]): BracketParticipant[] {
  if (participants.length < 2) {
    throw new TournamentEngineError(
      'INVALID_PARTICIPANT_COUNT',
      'A tournament bracket requires at least two participants.',
    );
  }

  const ids = new Set<string>();
  const seeds = new Set<number>();
  const normalized = participants.map((participant) => {
    if (
      participant.id.length === 0 ||
      participant.id.trim() !== participant.id ||
      !Number.isSafeInteger(participant.seed) ||
      participant.seed <= 0
    ) {
      throw new TournamentEngineError(
        'INVALID_PARTICIPANT',
        `Invalid participant id or seed: ${participant.id}`,
      );
    }
    if (ids.has(participant.id)) {
      throw new TournamentEngineError(
        'DUPLICATE_PARTICIPANT',
        `Duplicate participant id: ${participant.id}`,
      );
    }
    if (seeds.has(participant.seed)) {
      throw new TournamentEngineError(
        'DUPLICATE_SEED',
        `Duplicate participant seed: ${String(participant.seed)}`,
      );
    }
    ids.add(participant.id);
    seeds.add(participant.seed);

    return participant.displayName === undefined
      ? { id: participant.id, seed: participant.seed }
      : { id: participant.id, seed: participant.seed, displayName: participant.displayName };
  });

  return normalized.sort(
    (left, right) => left.seed - right.seed || left.id.localeCompare(right.id),
  );
}

function nextPowerOfTwo(value: number): number {
  let result = 1;
  while (result < value) {
    result *= 2;
  }
  return result;
}

/** Standard deterministic seed placement: 1v8, 4v5, 2v7, 3v6 for a field of eight. */
function seedOrder(size: number): number[] {
  let order = [1, 2];
  for (let bracketSize = 4; bracketSize <= size; bracketSize *= 2) {
    order = order.flatMap((seedNumber) => [seedNumber, bracketSize + 1 - seedNumber]);
  }
  return order;
}

function createMatch(input: {
  id: string;
  stage: BracketMatch['stage'];
  round: number;
  position: number;
  slots: [BracketSlot, BracketSlot];
  winnerTo?: MatchLink | null;
  loserTo?: MatchLink | null;
}): BracketMatch {
  return {
    id: input.id,
    stage: input.stage,
    round: input.round,
    position: input.position,
    status: MatchStatuses.SCHEDULED,
    slots: input.slots,
    winnerTo: input.winnerTo ?? null,
    loserTo: input.loserTo ?? null,
  };
}

function findMatch(bracket: TournamentBracket, matchId: string): BracketMatch {
  const match = bracket.matches.find((candidate) => candidate.id === matchId);
  if (match === undefined) {
    throw new TournamentEngineError('MATCH_NOT_FOUND', `Match not found: ${matchId}`);
  }
  return match;
}

function getMatchSlot(match: BracketMatch, slotNumber: 1 | 2): BracketSlot {
  const slot = match.slots[slotNumber - 1];
  if (slot === undefined) {
    throw new TournamentEngineError(
      'INVARIANT_VIOLATION',
      `Match ${match.id} has no slot ${String(slotNumber)}.`,
    );
  }
  return slot;
}

function setLinkedSlot(
  bracket: TournamentBracket,
  fromMatchId: string,
  outcome: SlotSource['outcome'],
  destination: MatchLink | null,
  participantId: string | null,
): void {
  if (destination === null) {
    return;
  }

  const destinationMatch = findMatch(bracket, destination.matchId);
  const destinationSlot = getMatchSlot(destinationMatch, destination.slot);
  if (
    destinationSlot.source?.matchId !== fromMatchId ||
    destinationSlot.source.outcome !== outcome
  ) {
    throw new TournamentEngineError(
      'INVARIANT_VIOLATION',
      `Link from ${fromMatchId} does not match slot ${String(destination.slot)} of ${destination.matchId}.`,
    );
  }
  if (destinationSlot.resolved) {
    if (destinationSlot.participantId === participantId) {
      return;
    }
    throw new TournamentEngineError(
      'INVARIANT_VIOLATION',
      `Slot ${String(destination.slot)} of ${destination.matchId} is already resolved.`,
    );
  }

  destinationSlot.participantId = participantId;
  destinationSlot.resolved = true;
}

function promoteResolution(bracket: TournamentBracket, match: BracketMatch): void {
  if (match.resolution === undefined) {
    throw new TournamentEngineError(
      'INVARIANT_VIOLATION',
      `Cannot promote unresolved match ${match.id}.`,
    );
  }
  setLinkedSlot(bracket, match.id, 'WINNER', match.winnerTo, match.resolution.winnerId);
  setLinkedSlot(bracket, match.id, 'LOSER', match.loserTo, match.resolution.loserId);
}

function settleAutomaticMatches(bracket: TournamentBracket): void {
  let changed = true;
  while (changed) {
    changed = false;
    for (const match of bracket.matches) {
      if (match.resolution !== undefined || !match.slots.every((slot) => slot.resolved)) {
        continue;
      }

      const participantIds = match.slots
        .map((slot) => slot.participantId)
        .filter((participantId): participantId is string => participantId !== null);

      if (participantIds.length === 2) {
        match.status = MatchStatuses.READY;
        continue;
      }

      if (participantIds.length === 1) {
        const winnerId = participantIds[0];
        if (winnerId === undefined) {
          throw new TournamentEngineError('INVARIANT_VIOLATION', 'Missing bye winner.');
        }
        match.status = MatchStatuses.WALKOVER;
        match.resolution = { type: 'BYE', winnerId, loserId: null };
      } else {
        match.status = MatchStatuses.CANCELLED;
        match.resolution = { type: 'EMPTY', winnerId: null, loserId: null };
      }
      promoteResolution(bracket, match);
      changed = true;
    }
  }
}

function baseBracket(
  format: TournamentBracket['format'],
  participants: BracketParticipant[],
  matches: BracketMatch[],
): TournamentBracket {
  const bracket: TournamentBracket = {
    schemaVersion: 1,
    format,
    participants,
    matches,
    appliedEvents: [],
  };
  settleAutomaticMatches(bracket);
  assertBracketInvariants(bracket);
  return bracket;
}

export function generateSingleElimination(
  participantsInput: readonly BracketParticipant[],
): TournamentBracket {
  const participants = normalizeParticipants(participantsInput);
  const size = nextPowerOfTwo(participants.length);
  const rounds = Math.log2(size);
  const orderedIds = seedOrder(size).map((seedNumber) => participants[seedNumber - 1]?.id ?? null);
  const matches: BracketMatch[] = [];

  for (let round = 1; round <= rounds; round += 1) {
    const matchCount = size / 2 ** round;
    for (let position = 1; position <= matchCount; position += 1) {
      const id = `se-r${String(round)}-m${String(position)}`;
      const slots: [BracketSlot, BracketSlot] =
        round === 1
          ? [
              seededSlot(orderedIds[(position - 1) * 2] ?? null),
              seededSlot(orderedIds[(position - 1) * 2 + 1] ?? null),
            ]
          : [
              sourcedSlot(
                source(`se-r${String(round - 1)}-m${String(position * 2 - 1)}`, 'WINNER'),
              ),
              sourcedSlot(source(`se-r${String(round - 1)}-m${String(position * 2)}`, 'WINNER')),
            ];
      const winnerTo =
        round === rounds
          ? null
          : link(
              `se-r${String(round + 1)}-m${String(Math.ceil(position / 2))}`,
              position % 2 === 1 ? 1 : 2,
            );
      matches.push(createMatch({ id, stage: MatchStages.UPPER, round, position, slots, winnerTo }));
    }
  }

  return baseBracket(TournamentFormats.SINGLE_ELIMINATION, participants, matches);
}

function upperWinnerLink(round: number, position: number, upperRounds: number): MatchLink {
  if (round === upperRounds) {
    return link('de-gf-r1-m1', 1);
  }
  return link(
    `de-ub-r${String(round + 1)}-m${String(Math.ceil(position / 2))}`,
    position % 2 === 1 ? 1 : 2,
  );
}

function upperLoserLink(round: number, position: number, upperRounds: number): MatchLink {
  if (upperRounds === 1) {
    return link('de-gf-r1-m1', 2);
  }
  if (round === 1) {
    return link(`de-lb-r1-m${String(Math.ceil(position / 2))}`, position % 2 === 1 ? 1 : 2);
  }
  return link(`de-lb-r${String(round * 2 - 2)}-m${String(position)}`, 2);
}

export function generateDoubleElimination(
  participantsInput: readonly BracketParticipant[],
): TournamentBracket {
  const participants = normalizeParticipants(participantsInput);
  const size = nextPowerOfTwo(participants.length);
  const upperRounds = Math.log2(size);
  const lowerRounds = Math.max(0, (upperRounds - 1) * 2);
  const orderedIds = seedOrder(size).map((seedNumber) => participants[seedNumber - 1]?.id ?? null);
  const matches: BracketMatch[] = [];

  for (let round = 1; round <= upperRounds; round += 1) {
    const matchCount = size / 2 ** round;
    for (let position = 1; position <= matchCount; position += 1) {
      const id = `de-ub-r${String(round)}-m${String(position)}`;
      const slots: [BracketSlot, BracketSlot] =
        round === 1
          ? [
              seededSlot(orderedIds[(position - 1) * 2] ?? null),
              seededSlot(orderedIds[(position - 1) * 2 + 1] ?? null),
            ]
          : [
              sourcedSlot(
                source(`de-ub-r${String(round - 1)}-m${String(position * 2 - 1)}`, 'WINNER'),
              ),
              sourcedSlot(source(`de-ub-r${String(round - 1)}-m${String(position * 2)}`, 'WINNER')),
            ];
      matches.push(
        createMatch({
          id,
          stage: MatchStages.UPPER,
          round,
          position,
          slots,
          winnerTo: upperWinnerLink(round, position, upperRounds),
          loserTo: upperLoserLink(round, position, upperRounds),
        }),
      );
    }
  }

  for (let round = 1; round <= lowerRounds; round += 1) {
    const matchCount = size / 2 ** (Math.ceil(round / 2) + 1);
    for (let position = 1; position <= matchCount; position += 1) {
      const id = `de-lb-r${String(round)}-m${String(position)}`;
      let slots: [BracketSlot, BracketSlot];
      if (round === 1) {
        slots = [
          sourcedSlot(source(`de-ub-r1-m${String(position * 2 - 1)}`, 'LOSER')),
          sourcedSlot(source(`de-ub-r1-m${String(position * 2)}`, 'LOSER')),
        ];
      } else if (round % 2 === 0) {
        slots = [
          sourcedSlot(source(`de-lb-r${String(round - 1)}-m${String(position)}`, 'WINNER')),
          sourcedSlot(source(`de-ub-r${String(round / 2 + 1)}-m${String(position)}`, 'LOSER')),
        ];
      } else {
        slots = [
          sourcedSlot(source(`de-lb-r${String(round - 1)}-m${String(position * 2 - 1)}`, 'WINNER')),
          sourcedSlot(source(`de-lb-r${String(round - 1)}-m${String(position * 2)}`, 'WINNER')),
        ];
      }

      const winnerTo =
        round === lowerRounds
          ? link('de-gf-r1-m1', 2)
          : round % 2 === 1
            ? link(`de-lb-r${String(round + 1)}-m${String(position)}`, 1)
            : link(
                `de-lb-r${String(round + 1)}-m${String(Math.ceil(position / 2))}`,
                position % 2 === 1 ? 1 : 2,
              );
      matches.push(
        createMatch({
          id,
          stage: MatchStages.LOWER,
          round,
          position,
          slots,
          winnerTo,
        }),
      );
    }
  }

  const finalSecondSource =
    lowerRounds === 0
      ? source('de-ub-r1-m1', 'LOSER')
      : source(`de-lb-r${String(lowerRounds)}-m1`, 'WINNER');
  matches.push(
    createMatch({
      id: 'de-gf-r1-m1',
      stage: MatchStages.GRAND_FINAL,
      round: 1,
      position: 1,
      slots: [
        sourcedSlot(source(`de-ub-r${String(upperRounds)}-m1`, 'WINNER')),
        sourcedSlot(finalSecondSource),
      ],
    }),
  );

  return baseBracket(TournamentFormats.DOUBLE_ELIMINATION, participants, matches);
}

function rotateRoundRobin<T>(values: readonly T[]): T[] {
  const first = values[0];
  const last = values.at(-1);
  if (first === undefined || last === undefined) {
    return [...values];
  }
  return [first, last, ...values.slice(1, -1)];
}

export function generateRoundRobin(
  participantsInput: readonly BracketParticipant[],
): TournamentBracket {
  const participants = normalizeParticipants(participantsInput);
  let rotation: (string | null)[] = participants.map((participant) => participant.id);
  if (rotation.length % 2 === 1) {
    rotation.push(null);
  }

  const roundCount = rotation.length - 1;
  const matches: BracketMatch[] = [];
  for (let round = 1; round <= roundCount; round += 1) {
    let position = 1;
    for (let pairIndex = 0; pairIndex < rotation.length / 2; pairIndex += 1) {
      const first = rotation[pairIndex];
      const second = rotation[rotation.length - 1 - pairIndex];
      if (first !== null && first !== undefined && second !== null && second !== undefined) {
        matches.push(
          createMatch({
            id: `rr-r${String(round)}-m${String(position)}`,
            stage: MatchStages.ROUND_ROBIN,
            round,
            position,
            slots: [seededSlot(first), seededSlot(second)],
          }),
        );
        position += 1;
      }
    }
    rotation = rotateRoundRobin(rotation);
  }

  return baseBracket(TournamentFormats.ROUND_ROBIN, participants, matches);
}

export function generateBracket(input: GenerateBracketInput): TournamentBracket {
  switch (input.format) {
    case TournamentFormats.SINGLE_ELIMINATION:
      return generateSingleElimination(input.participants);
    case TournamentFormats.DOUBLE_ELIMINATION:
      return generateDoubleElimination(input.participants);
    case TournamentFormats.ROUND_ROBIN:
      return generateRoundRobin(input.participants);
  }
}

function cloneResolution(resolution: MatchResolution): MatchResolution {
  if (resolution.type === 'COMPLETE' && resolution.score !== undefined) {
    return { ...resolution, score: [resolution.score[0], resolution.score[1]] };
  }
  return { ...resolution };
}

function cloneEvent(event: AppliedResultEvent): AppliedResultEvent {
  if (event.type === 'COMPLETE' && event.score !== undefined) {
    return { ...event, score: [event.score[0], event.score[1]] };
  }
  return { ...event };
}

function cloneBracket(bracket: TournamentBracket): TournamentBracket {
  return {
    schemaVersion: bracket.schemaVersion,
    format: bracket.format,
    participants: bracket.participants.map((participant) => ({ ...participant })),
    matches: bracket.matches.map((match) => {
      const copy: BracketMatch = {
        id: match.id,
        stage: match.stage,
        round: match.round,
        position: match.position,
        status: match.status,
        slots: match.slots.map((slot) => ({
          participantId: slot.participantId,
          source: slot.source === null ? null : { ...slot.source },
          resolved: slot.resolved,
        })) as [BracketSlot, BracketSlot],
        winnerTo: match.winnerTo === null ? null : { ...match.winnerTo },
        loserTo: match.loserTo === null ? null : { ...match.loserTo },
      };
      if (match.resolution !== undefined) {
        copy.resolution = cloneResolution(match.resolution);
      }
      return copy;
    }),
    appliedEvents: bracket.appliedEvents.map(cloneEvent),
  };
}

function eventsEqual(left: AppliedResultEvent, right: ResultEvent): boolean {
  if (
    left.type !== right.type ||
    left.eventId !== right.eventId ||
    left.matchId !== right.matchId
  ) {
    return false;
  }
  switch (left.type) {
    case 'CANCEL':
      return true;
    case 'WALKOVER':
      return (
        right.type === 'WALKOVER' &&
        left.winnerId === right.winnerId &&
        left.source === right.source
      );
    case 'DISQUALIFICATION':
      return (
        right.type === 'DISQUALIFICATION' &&
        left.disqualifiedParticipantId === right.disqualifiedParticipantId &&
        left.source === right.source
      );
    case 'COMPLETE': {
      if (
        right.type !== 'COMPLETE' ||
        left.winnerId !== right.winnerId ||
        left.source !== right.source
      ) {
        return false;
      }
      if (left.score === undefined || right.score === undefined) {
        return left.score === right.score;
      }
      return left.score[0] === right.score[0] && left.score[1] === right.score[1];
    }
  }
}

function validateEventIdentity(event: ResultEvent): void {
  if (
    event.eventId.length === 0 ||
    event.eventId.trim() !== event.eventId ||
    event.matchId.length === 0 ||
    event.matchId.trim() !== event.matchId
  ) {
    throw new TournamentEngineError('INVALID_EVENT', 'Event and match ids must be non-empty.');
  }
  if (event.type !== 'CANCEL' && !RESULT_SOURCES.has(event.source)) {
    throw new TournamentEngineError('INVALID_EVENT', `Invalid result source: ${event.source}`);
  }
}

function matchParticipants(match: BracketMatch): [string, string] {
  if (match.status !== MatchStatuses.READY || match.resolution !== undefined) {
    if (match.resolution !== undefined) {
      throw new TournamentEngineError(
        'MATCH_ALREADY_RESOLVED',
        `Match ${match.id} is already resolved.`,
      );
    }
    throw new TournamentEngineError('MATCH_NOT_READY', `Match ${match.id} is not ready.`);
  }
  const first = match.slots[0].participantId;
  const second = match.slots[1].participantId;
  if (first === null || second === null) {
    throw new TournamentEngineError(
      'INVARIANT_VIOLATION',
      `Ready match ${match.id} has an empty slot.`,
    );
  }
  return [first, second];
}

function otherParticipant(
  match: BracketMatch,
  selectedParticipantId: string,
): { winnerId: string; loserId: string; winnerSlot: 0 | 1 } {
  const [first, second] = matchParticipants(match);
  if (selectedParticipantId === first) {
    return { winnerId: first, loserId: second, winnerSlot: 0 };
  }
  if (selectedParticipantId === second) {
    return { winnerId: second, loserId: first, winnerSlot: 1 };
  }
  throw new TournamentEngineError(
    'PARTICIPANT_NOT_IN_MATCH',
    `Participant ${selectedParticipantId} is not in match ${match.id}.`,
  );
}

function validateScore(score: readonly [number, number], winnerSlot: 0 | 1): void {
  const [first, second] = score;
  if (
    !Number.isSafeInteger(first) ||
    !Number.isSafeInteger(second) ||
    first < 0 ||
    second < 0 ||
    first === second ||
    (winnerSlot === 0 ? first <= second : second <= first)
  ) {
    throw new TournamentEngineError(
      'INVALID_SCORE',
      'Score must be non-negative and agree with the winner.',
    );
  }
}

function rollbackAutomaticMatch(bracket: TournamentBracket, match: BracketMatch): void {
  if (match.resolution?.type !== 'BYE' && match.resolution?.type !== 'EMPTY') {
    throw new TournamentEngineError(
      'DOWNSTREAM_ALREADY_RESOLVED',
      `Downstream match ${match.id} already has an external result.`,
    );
  }
  rollbackLink(bracket, match, 'WINNER', match.winnerTo);
  rollbackLink(bracket, match, 'LOSER', match.loserTo);
  delete match.resolution;
  match.status = MatchStatuses.SCHEDULED;
}

function rollbackLink(
  bracket: TournamentBracket,
  fromMatch: BracketMatch,
  outcome: SlotSource['outcome'],
  destination: MatchLink | null,
): void {
  if (destination === null) {
    return;
  }
  const destinationMatch = findMatch(bracket, destination.matchId);
  const destinationSlot = getMatchSlot(destinationMatch, destination.slot);
  if (
    destinationSlot.source?.matchId !== fromMatch.id ||
    destinationSlot.source.outcome !== outcome
  ) {
    throw new TournamentEngineError(
      'INVARIANT_VIOLATION',
      `Cannot roll back invalid link from ${fromMatch.id} to ${destination.matchId}.`,
    );
  }
  if (!destinationSlot.resolved) {
    return;
  }
  if (destinationMatch.resolution !== undefined) {
    rollbackAutomaticMatch(bracket, destinationMatch);
  }
  destinationSlot.participantId = null;
  destinationSlot.resolved = false;
  destinationMatch.status = MatchStatuses.SCHEDULED;
}

function cancelResult(bracket: TournamentBracket, match: BracketMatch): void {
  if (match.resolution === undefined) {
    throw new TournamentEngineError(
      'NO_RESULT_TO_CANCEL',
      `Match ${match.id} has no result to cancel.`,
    );
  }
  if (match.resolution.type === 'BYE' || match.resolution.type === 'EMPTY') {
    throw new TournamentEngineError(
      'AUTOMATIC_RESULT_CANNOT_BE_CANCELLED',
      `Automatic result of match ${match.id} cannot be cancelled directly.`,
    );
  }
  rollbackLink(bracket, match, 'WINNER', match.winnerTo);
  rollbackLink(bracket, match, 'LOSER', match.loserTo);
  delete match.resolution;
  match.status = MatchStatuses.READY;
}

function applyNewEvent(bracket: TournamentBracket, event: ResultEvent): void {
  const match = findMatch(bracket, event.matchId);
  if (event.type === 'CANCEL') {
    cancelResult(bracket, match);
    return;
  }

  if (event.type === 'DISQUALIFICATION') {
    const outcome = otherParticipant(match, event.disqualifiedParticipantId);
    match.status = MatchStatuses.WALKOVER;
    match.resolution = {
      type: 'DISQUALIFICATION',
      eventId: event.eventId,
      source: event.source,
      winnerId: outcome.loserId,
      loserId: outcome.winnerId,
      disqualifiedParticipantId: event.disqualifiedParticipantId,
    };
  } else {
    const outcome = otherParticipant(match, event.winnerId);
    if (event.type === 'COMPLETE' && event.score !== undefined) {
      validateScore(event.score, outcome.winnerSlot);
    }
    match.status = event.type === 'COMPLETE' ? MatchStatuses.COMPLETED : MatchStatuses.WALKOVER;
    match.resolution =
      event.type === 'COMPLETE'
        ? event.score === undefined
          ? {
              type: 'COMPLETE',
              eventId: event.eventId,
              source: event.source,
              winnerId: outcome.winnerId,
              loserId: outcome.loserId,
            }
          : {
              type: 'COMPLETE',
              eventId: event.eventId,
              source: event.source,
              winnerId: outcome.winnerId,
              loserId: outcome.loserId,
              score: [event.score[0], event.score[1]],
            }
        : {
            type: 'WALKOVER',
            eventId: event.eventId,
            source: event.source,
            winnerId: outcome.winnerId,
            loserId: outcome.loserId,
          };
  }

  promoteResolution(bracket, match);
  settleAutomaticMatches(bracket);
}

/**
 * Applies a result without mutating the supplied bracket.
 * Replaying the exact event is a no-op; reusing its id for another payload is rejected.
 */
export function applyMatchResult(
  bracketInput: TournamentBracket,
  event: ResultEvent,
): TournamentBracket {
  assertBracketInvariants(bracketInput);
  validateEventIdentity(event);

  const existingEvent = bracketInput.appliedEvents.find(
    (candidate) => candidate.eventId === event.eventId,
  );
  if (existingEvent !== undefined) {
    if (!eventsEqual(existingEvent, event)) {
      throw new TournamentEngineError(
        'DUPLICATE_EVENT_CONFLICT',
        `Event id ${event.eventId} was already used for another payload.`,
      );
    }
    return bracketInput;
  }

  const bracket = cloneBracket(bracketInput);
  applyNewEvent(bracket, event);
  bracket.appliedEvents.push(cloneEvent(event));
  assertBracketInvariants(bracket);
  return bracket;
}
