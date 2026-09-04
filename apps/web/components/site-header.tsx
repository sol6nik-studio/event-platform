import Link from 'next/link';
import { LogIn, Plus, Search, UserRound } from 'lucide-react';

interface SiteHeaderProps {
  active?: 'home' | 'tournaments';
  compact?: boolean;
}

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Arena Grid — на главную">
      <span className="brandMark" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="brandText">
        ARENA <b>GRID</b>
      </span>
    </Link>
  );
}

export function SiteHeader({ active, compact = false }: SiteHeaderProps) {
  return (
    <header className={`siteHeader${compact ? ' siteHeaderCompact' : ''}`}>
      <div className="siteHeaderInner">
        <Brand />
        <nav className="primaryNav" aria-label="Основная навигация">
          <Link className={active === 'tournaments' ? 'isActive' : ''} href="/tournaments">
            Турниры
          </Link>
          <Link href="/tournaments?view=live">Матчи</Link>
          <Link href="/tournaments?view=completed">Рейтинги</Link>
        </nav>
        <div className="headerActions">
          <Link className="iconButton headerSearch" href="/tournaments" aria-label="Поиск турниров">
            <Search size={18} />
          </Link>
          <Link className="button buttonGhost createButton" href="/organizer/tournaments/new">
            <Plus size={17} />
            Создать турнир
          </Link>
          <Link className="button buttonQuiet signInButton" href="/auth/sign-in">
            <LogIn size={17} />
            Войти
          </Link>
          <Link className="avatarButton" href="/profile" aria-label="Открыть профиль">
            <UserRound size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
