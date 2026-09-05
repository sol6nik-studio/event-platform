import Link from 'next/link';
import { ArrowUpRight, CalendarDays, MapPin, UsersRound } from 'lucide-react';
import { statusLabels, type Tournament } from '../lib/mock-data';
import styles from './tournament-card.module.css';

interface TournamentCardProps {
  tournament: Tournament;
  featured?: boolean;
}

const css = (value: string | undefined): string => value ?? '';

const accentClass: Record<Tournament['accent'], string> = {
  cyan: css(styles.cyan),
  violet: css(styles.violet),
  amber: css(styles.amber),
  green: css(styles.green),
};

const statusClass: Record<Tournament['status'], string> = {
  REGISTRATION_OPEN: css(styles.registration_open),
  PUBLISHED: css(styles.published),
  LIVE: css(styles.live),
  COMPLETED: css(styles.completed),
};

export function TournamentCard({ tournament, featured = false }: TournamentCardProps) {
  const capacity = Math.round((tournament.teams.length / tournament.participantLimit) * 100);

  return (
    <Link
      className={[
        styles.card,
        accentClass[tournament.accent],
        featured ? styles.featured : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
      href={`/tournaments/${tournament.slug}`}
    >
      <div className={styles.art}>
        <div className={styles.artGrid} aria-hidden="true" />
        <div className={styles.monogram} aria-hidden="true">
          {tournament.gameShort
            .split(' ')
            .map((word) => word[0])
            .join('')
            .slice(0, 3)}
        </div>
        <div className={[styles.status, statusClass[tournament.status]].filter(Boolean).join(' ')}>
          {statusLabels[tournament.status]}
        </div>
        <ArrowUpRight className={styles.arrow} size={20} />
      </div>
      <div className={styles.body}>
        <div className={styles.kicker}>{tournament.game}</div>
        <h3 className={styles.title}>{tournament.name}</h3>
        <div className={styles.facts}>
          <span className={styles.fact}>
            <CalendarDays size={14} /> {tournament.startAt.split(' · ')[0]}
          </span>
          <span className={styles.fact}>
            <MapPin size={14} /> {tournament.region}
          </span>
        </div>
        <div className={styles.capacity}>
          <span className={styles.fact}>
            <UsersRound size={14} /> {tournament.teams.length}/{tournament.participantLimit}
          </span>
          <span>{tournament.format}</span>
        </div>
        <div className={styles.progress} aria-label={`Заполнено на ${String(capacity)}%`}>
          <span className={styles.progressValue} style={{ width: `${String(capacity)}%` }} />
        </div>
        <div className={styles.footer}>
          <span className={styles.footerLabel}>{tournament.prizeLabel}</span>
          <strong className={styles.footerValue}>{tournament.prizePool}</strong>
        </div>
      </div>
    </Link>
  );
}
