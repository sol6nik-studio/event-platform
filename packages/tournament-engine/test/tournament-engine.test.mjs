import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { describe, it } from 'node:test';

// Production ESM uses `.js` specifiers for emitted files. During source tests, map only
// this package's internal specifiers to Node's built-in TypeScript type stripping.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      specifier.startsWith('./') &&
      specifier.endsWith('.js') &&
      context.parentURL?.includes('/packages/tournament-engine/src/')
    ) {
      return nextResolve(`${specifier.slice(0, -3)}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});

const {
  MatchStatuses,
  TournamentEngineError,
  TournamentFormats,
  applyMatchResult,
  assertBracketInvariants,
  generateBracket,
  generateDoubleElimination,
  generateRoundRobin,
  generateSingleElimination,
} = await import('../src/index.ts');

function participants(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `team-${String(index + 1)}`,
    seed: index + 1,
  }));
}

function match(bracket, id) {
  const found = bracket.matches.find((candidate) => candidate.id === id);
  assert.ok(found, `Expected match ${id}`);
  return found;
}

function participantIds(bracketMatch) {
  return bracketMatch.slots.map((slot) => slot.participantId);
}

function assertEngineError(code, action) {
  assert.throws(action, (error) => {
    assert.ok(error instanceof TournamentEngineError);
    assert.equal(error.code, code);
    return true;
  });
}

describe('deterministic bracket generation', () => {
  it('generates a standard seeded single-elimination bracket', () => {
    const bracket = generateBracket({
      format: TournamentFormats.SINGLE_ELIMINATION,
      participants: participants(8),
    });

    assert.equal(bracket.matches.length, 7);
    assert.deepEqual(participantIds(match(bracket, 'se-r1-m1')), ['team-1', 'team-8']);
    assert.deepEqual(participantIds(match(bracket, 'se-r1-m2')), ['team-4', 'team-5']);
    assert.deepEqual(participantIds(match(bracket, 'se-r1-m3')), ['team-2', 'team-7']);
    assert.deepEqual(participantIds(match(bracket, 'se-r1-m4')), ['team-3', 'team-6']);
    assert.deepEqual(bracket, generateSingleElimination([...participants(8)].reverse()));
    assertBracketInvariants(bracket);
  });

  it('auto-advances byes for an odd participant count', () => {
    const bracket = generateSingleElimination(participants(3));
    const byeMatch = match(bracket, 'se-r1-m1');
    const playableMatch = match(bracket, 'se-r1-m2');
    const final = match(bracket, 'se-r2-m1');

    assert.equal(byeMatch.status, MatchStatuses.WALKOVER);
    assert.deepEqual(byeMatch.resolution, {
      type: 'BYE',
      winnerId: 'team-1',
      loserId: null,
    });
    assert.equal(playableMatch.status, MatchStatuses.READY);
    assert.deepEqual(participantIds(playableMatch), ['team-2', 'team-3']);
    assert.deepEqual(participantIds(final), ['team-1', null]);
    assert.equal(final.slots[0].resolved, true);
    assert.equal(final.slots[1].resolved, false);
    assert.equal(final.status, MatchStatuses.SCHEDULED);
  });

  it('generates every round-robin pairing exactly once for an odd field', () => {
    const bracket = generateRoundRobin(participants(5));
    const pairs = bracket.matches.map((roundMatch) =>
      [...participantIds(roundMatch)].sort().join(':'),
    );

    assert.equal(bracket.matches.length, 10);
    assert.equal(new Set(pairs).size, 10);
    assert.deepEqual(
      [...new Set(bracket.matches.map((roundMatch) => roundMatch.round))],
      [1, 2, 3, 4, 5],
    );
    assert.ok(bracket.matches.every((roundMatch) => roundMatch.status === MatchStatuses.READY));
  });

  it('rejects invalid participants and duplicate seeds', () => {
    assertEngineError('INVALID_PARTICIPANT_COUNT', () => generateSingleElimination([]));
    assertEngineError('DUPLICATE_PARTICIPANT', () =>
      generateSingleElimination([
        { id: 'same', seed: 1 },
        { id: 'same', seed: 2 },
      ]),
    );
    assertEngineError('DUPLICATE_SEED', () =>
      generateSingleElimination([
        { id: 'one', seed: 1 },
        { id: 'two', seed: 1 },
      ]),
    );
  });
});

describe('result application', () => {
  it('promotes a single-elimination winner without mutating the previous bracket', () => {
    const initial = generateSingleElimination(participants(4));
    const updated = applyMatchResult(initial, {
      eventId: 'result-1',
      matchId: 'se-r1-m1',
      type: 'COMPLETE',
      winnerId: 'team-1',
      score: [2, 0],
      source: 'MANUAL',
    });

    assert.equal(match(initial, 'se-r1-m1').status, MatchStatuses.READY);
    assert.equal(match(updated, 'se-r1-m1').status, MatchStatuses.COMPLETED);
    assert.deepEqual(participantIds(match(updated, 'se-r2-m1')), ['team-1', null]);
    assert.equal(updated.appliedEvents.length, 1);
  });

  it('promotes an upper-bracket loser through the lower bracket', () => {
    let bracket = generateDoubleElimination(participants(4));
    bracket = applyMatchResult(bracket, {
      eventId: 'ub-1',
      matchId: 'de-ub-r1-m1',
      type: 'COMPLETE',
      winnerId: 'team-1',
      source: 'GAME_API',
    });
    bracket = applyMatchResult(bracket, {
      eventId: 'ub-2',
      matchId: 'de-ub-r1-m2',
      type: 'COMPLETE',
      winnerId: 'team-2',
      source: 'GAME_API',
    });

    assert.deepEqual(participantIds(match(bracket, 'de-lb-r1-m1')), ['team-4', 'team-3']);
    assert.equal(match(bracket, 'de-lb-r1-m1').status, MatchStatuses.READY);

    bracket = applyMatchResult(bracket, {
      eventId: 'lb-1',
      matchId: 'de-lb-r1-m1',
      type: 'COMPLETE',
      winnerId: 'team-3',
      source: 'MANUAL',
    });
    bracket = applyMatchResult(bracket, {
      eventId: 'ub-final',
      matchId: 'de-ub-r2-m1',
      type: 'COMPLETE',
      winnerId: 'team-1',
      source: 'MANUAL',
    });

    assert.deepEqual(participantIds(match(bracket, 'de-lb-r2-m1')), ['team-3', 'team-2']);
    assert.equal(match(bracket, 'de-lb-r2-m1').status, MatchStatuses.READY);

    bracket = applyMatchResult(bracket, {
      eventId: 'lb-final',
      matchId: 'de-lb-r2-m1',
      type: 'COMPLETE',
      winnerId: 'team-3',
      source: 'MANUAL',
    });
    assert.deepEqual(participantIds(match(bracket, 'de-gf-r1-m1')), ['team-1', 'team-3']);
    assert.equal(match(bracket, 'de-gf-r1-m1').status, MatchStatuses.READY);
  });

  it('handles a walkover and disqualification', () => {
    let bracket = generateSingleElimination(participants(4));
    bracket = applyMatchResult(bracket, {
      eventId: 'walkover-1',
      matchId: 'se-r1-m1',
      type: 'WALKOVER',
      winnerId: 'team-4',
      source: 'MODERATOR',
    });
    bracket = applyMatchResult(bracket, {
      eventId: 'dq-1',
      matchId: 'se-r1-m2',
      type: 'DISQUALIFICATION',
      disqualifiedParticipantId: 'team-3',
      source: 'MODERATOR',
    });

    assert.equal(match(bracket, 'se-r1-m1').status, MatchStatuses.WALKOVER);
    assert.equal(match(bracket, 'se-r1-m1').resolution?.winnerId, 'team-4');
    assert.deepEqual(match(bracket, 'se-r1-m2').resolution, {
      type: 'DISQUALIFICATION',
      eventId: 'dq-1',
      source: 'MODERATOR',
      winnerId: 'team-2',
      loserId: 'team-3',
      disqualifiedParticipantId: 'team-3',
    });
    assert.deepEqual(participantIds(match(bracket, 'se-r2-m1')), ['team-4', 'team-2']);
  });

  it('cancels a result and rolls back automatic lower-bracket advancement', () => {
    const initial = generateDoubleElimination(participants(3));
    const completed = applyMatchResult(initial, {
      eventId: 'result-before-cancel',
      matchId: 'de-ub-r1-m2',
      type: 'COMPLETE',
      winnerId: 'team-2',
      source: 'MANUAL',
    });
    assert.equal(match(completed, 'de-lb-r1-m1').resolution?.type, 'BYE');
    assert.equal(match(completed, 'de-lb-r2-m1').slots[0].resolved, true);

    const cancelled = applyMatchResult(completed, {
      eventId: 'cancel-1',
      matchId: 'de-ub-r1-m2',
      type: 'CANCEL',
    });

    assert.equal(match(cancelled, 'de-ub-r1-m2').status, MatchStatuses.READY);
    assert.equal(match(cancelled, 'de-ub-r1-m2').resolution, undefined);
    assert.equal(match(cancelled, 'de-lb-r1-m1').resolution, undefined);
    assert.equal(match(cancelled, 'de-lb-r1-m1').slots[1].resolved, false);
    assert.equal(match(cancelled, 'de-lb-r2-m1').slots[0].resolved, false);
    assert.equal(cancelled.appliedEvents.length, 2);
    assertBracketInvariants(cancelled);
  });

  it('does not cancel an upstream result after a downstream match is completed', () => {
    let bracket = generateSingleElimination(participants(4));
    for (const [eventId, matchId, winnerId] of [
      ['first', 'se-r1-m1', 'team-1'],
      ['second', 'se-r1-m2', 'team-2'],
      ['final', 'se-r2-m1', 'team-1'],
    ]) {
      bracket = applyMatchResult(bracket, {
        eventId,
        matchId,
        type: 'COMPLETE',
        winnerId,
        source: 'MANUAL',
      });
    }

    assertEngineError('DOWNSTREAM_ALREADY_RESOLVED', () =>
      applyMatchResult(bracket, {
        eventId: 'late-cancel',
        matchId: 'se-r1-m1',
        type: 'CANCEL',
      }),
    );
  });

  it('is idempotent for duplicate delivery and rejects event-id payload conflicts', () => {
    const initial = generateSingleElimination(participants(4));
    const event = {
      eventId: 'stable-event',
      matchId: 'se-r1-m1',
      type: 'COMPLETE',
      winnerId: 'team-1',
      source: 'MANUAL',
    };
    const once = applyMatchResult(initial, event);
    const twice = applyMatchResult(once, event);

    assert.equal(twice, once);
    assert.equal(twice.appliedEvents.length, 1);
    assertEngineError('DUPLICATE_EVENT_CONFLICT', () =>
      applyMatchResult(once, { ...event, winnerId: 'team-4' }),
    );
  });

  it('rejects an invalid winner, score, premature result, and corrupted state', () => {
    const bracket = generateSingleElimination(participants(4));
    assertEngineError('PARTICIPANT_NOT_IN_MATCH', () =>
      applyMatchResult(bracket, {
        eventId: 'bad-winner',
        matchId: 'se-r1-m1',
        type: 'COMPLETE',
        winnerId: 'team-2',
        source: 'MANUAL',
      }),
    );
    assertEngineError('INVALID_SCORE', () =>
      applyMatchResult(bracket, {
        eventId: 'bad-score',
        matchId: 'se-r1-m1',
        type: 'COMPLETE',
        winnerId: 'team-1',
        score: [0, 2],
        source: 'MANUAL',
      }),
    );
    assertEngineError('MATCH_NOT_READY', () =>
      applyMatchResult(bracket, {
        eventId: 'premature',
        matchId: 'se-r2-m1',
        type: 'COMPLETE',
        winnerId: 'team-1',
        source: 'MANUAL',
      }),
    );

    const corrupted = JSON.parse(JSON.stringify(bracket));
    match(corrupted, 'se-r1-m1').slots[0].participantId = 'unknown-team';
    assertEngineError('INVARIANT_VIOLATION', () => assertBracketInvariants(corrupted));
  });
});
