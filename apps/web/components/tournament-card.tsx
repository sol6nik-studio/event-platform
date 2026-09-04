import Link from 'next/link';
import { ArrowUpRight, CalendarDays, MapPin, UsersRound } from 'lucide-react';
import { statusLabels, type Tournament } from '../lib/mock-data';

interface TournamentCardProps {
  tournament: Tournament;
  featured?: boolean;
}

export function TournamentCard({ tournament, featured = false }: TournamentCardProps) {
  const capacity = Math.round((tournament.teams.length / tournament.participantLimit) * 100);

  return (
    <Link
      className={`tournamentCard tone-${tournament.accent}${featured ? ' tournamentCardFeatured' : ''}`}
      href={`/tournaments/${tournament.slug}`}
    >
      <div className="tournamentArt">
        <div className="artGrid" aria-hidden="true" />
        <div className="gameMonogram" aria-hidden="true">
          {tournament.gameShort
            .split(' ')
            .map((word) => word[0])
            .join('')
            .slice(0, 3)}
        </div>
        <div className={`statusPill status-${tournament.status.toLowerCase()}`}>
          <span /> {statusLabels[tournament.status]}
        </div>
        <ArrowUpRight className="cardArrow" size={20} />
      </div>
      <div className="tournamentCardBody">
        <div className="cardKicker">{tournament.game}</div>
        <h3>{tournament.name}</h3>
        <div className="cardFacts">
          <span>
            <CalendarDays size={14} /> {tournament.startAt.split(' · ')[0]}
          </span>
          <span>
            <MapPin size={14} /> {tournament.region}
          </span>
        </div>
        <div className="capacityRow">
          <span>
            <UsersRound size={14} /> {tournament.teams.length}/{tournament.participantLimit}
          </span>
          <span>{tournament.format}</span>
        </div>
        <div className="progressTrack" aria-label={`Заполнено на ${String(capacity)}%`}>
          <span style={{ width: `${String(capacity)}%` }} />
        </div>
        <div className="cardFooter">
          <span>{tournament.prizeLabel}</span>
          <strong>{tournament.prizePool}</strong>
        </div>
      </div>
    </Link>
  );
}
