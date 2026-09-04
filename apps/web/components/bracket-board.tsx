import { Clock3, Radio } from 'lucide-react';
import { getTeam, matchStatusLabels, type BracketMatch, type Tournament } from '../lib/mock-data';
import { TeamMark } from './team-mark';

interface BracketBoardProps {
  tournament: Tournament;
}

function MatchCard({ match, tournament }: { match: BracketMatch; tournament: Tournament }) {
  const firstTeam = getTeam(tournament, match.first.teamId);
  const secondTeam = getTeam(tournament, match.second.teamId);

  return (
    <article className={`matchCard match-${match.status.toLowerCase()}`}>
      <div className="matchCardHeader">
        <span>{match.code}</span>
        <span className="matchState">
          {match.status === 'LIVE' && <Radio size={12} />}
          {matchStatusLabels[match.status]}
        </span>
      </div>
      <div className="matchTeamRow">
        <TeamMark team={firstTeam} label={match.first.label} compact />
        <strong>{match.first.score ?? '—'}</strong>
      </div>
      <div className="matchTeamRow">
        <TeamMark team={secondTeam} label={match.second.label} compact />
        <strong>{match.second.score ?? '—'}</strong>
      </div>
      <div className="matchCardMeta">
        <span>
          <Clock3 size={12} /> {match.scheduledAt}
        </span>
        <span>BO{match.bestOf}</span>
      </div>
      {match.destination && <div className="matchDestination">{match.destination}</div>}
    </article>
  );
}

export function BracketBoard({ tournament }: BracketBoardProps) {
  return (
    <div className="bracketStack">
      {tournament.bracket.map((stage) => (
        <section className="bracketStage" key={stage.id} aria-labelledby={`stage-${stage.id}`}>
          <div className="bracketStageHeader">
            <div>
              <span className="sectionNumber">СЕТКА</span>
              <h2 id={`stage-${stage.id}`}>{stage.name}</h2>
            </div>
            <span className="mutedLabel">{stage.rounds.length} этапа</span>
          </div>
          <div className="bracketScroller">
            <div className="bracketRounds">
              {stage.rounds.map((round) => (
                <div className="bracketRound" key={round.id}>
                  <div className="roundHeader">
                    <span>{round.name}</span>
                    <small>{round.matches.length} матча</small>
                  </div>
                  <div className="roundMatches">
                    {round.matches.map((match) => (
                      <MatchCard key={match.id} match={match} tournament={tournament} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
