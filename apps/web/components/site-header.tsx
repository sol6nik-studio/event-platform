import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { HeaderAccountActions } from './header-account-actions';

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
          <HeaderAccountActions />
        </div>
      </div>
    </header>
  );
}
