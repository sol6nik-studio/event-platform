import type { Team } from '../lib/mock-data';

interface TeamMarkProps {
  team?: Team | undefined;
  label?: string | undefined;
  compact?: boolean;
}

export function TeamMark({ team, label, compact = false }: TeamMarkProps) {
  if (!team) {
    return (
      <span className="teamIdentity teamIdentityPending">
        <span className="teamLogo">?</span>
        <span>{label ?? 'Определится позже'}</span>
      </span>
    );
  }

  return (
    <span className="teamIdentity">
      <span className="teamLogo" style={{ '--team-accent': team.accent } as React.CSSProperties}>
        {team.tag.slice(0, compact ? 2 : 3)}
      </span>
      <span className="teamIdentityText">
        <b>{compact ? team.tag : team.name}</b>
        {!compact && <small>Seed {team.seed}</small>}
      </span>
    </span>
  );
}
